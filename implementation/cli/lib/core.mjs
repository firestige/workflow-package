import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function parseArguments(argv) {
  const positional = [];
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) {
      positional.push(value);
      continue;
    }
    const key = value.slice(2).replaceAll("-", "_");
    const next = argv[index + 1];
    if (next === undefined || next.startsWith("--")) options[key] = true;
    else {
      options[key] = next;
      index += 1;
    }
  }
  return { positional, options };
}

export function emit(value, exitCode = 0) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
  process.exitCode = exitCode;
}

export function fail(code, message, details = {}) {
  emit({ status: "FAILED", code, message, ...details }, 1);
}

export function requireOption(options, name) {
  const value = options[name];
  if (typeof value !== "string" || !value) throw new CliError("MISSING_ARGUMENT", `--${name.replaceAll("_", "-")} is required`);
  return value;
}

export class CliError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export function handleError(error) {
  if (error instanceof CliError) fail(error.code, error.message, error.details);
  else fail("UNEXPECTED_ERROR", error instanceof Error ? error.message : String(error));
}

export function readJson(file, expectedSchema = "1.0.0") {
  let value;
  try {
    value = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new CliError("INVALID_JSON", `cannot read JSON '${file}': ${error.message}`);
  }
  if (expectedSchema && value?.schema_version !== expectedSchema) {
    throw new CliError("UNSUPPORTED_SCHEMA", `'${file}' requires schema_version ${expectedSchema}`);
  }
  return value;
}

export function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: options.env ?? process.env,
    shell: false,
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error) throw new CliError("COMMAND_UNAVAILABLE", result.error.message, { command, argv: [command, ...args] });
  return result;
}

export function git(project, args, { allowFailure = false } = {}) {
  const result = run("git", args, { cwd: project });
  if (!allowFailure && result.status !== 0) {
    throw new CliError("GIT_FAILED", String(result.stderr || result.stdout || `git exited ${result.status}`).trim(), { argv: ["git", ...args] });
  }
  return result;
}

function normalizePath(value) {
  return value.split(path.sep).join("/").replace(/^\.\//, "");
}

export function repositoryRelative(project, file) {
  const relative = normalizePath(path.relative(path.resolve(project), path.resolve(file)));
  return relative.startsWith("../") || relative === ".." ? null : relative;
}

export function worktreePaths(project) {
  const result = git(project, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]);
  const fields = result.stdout.split("\0").filter(Boolean);
  const paths = [];
  for (let index = 0; index < fields.length; index += 1) {
    const record = fields[index];
    const status = record.slice(0, 2);
    const file = normalizePath(record.slice(3));
    if (status.includes("R") || status.includes("C")) {
      paths.push(file);
      const destination = fields[index + 1];
      if (destination) paths.push(normalizePath(destination));
      index += 1;
    } else paths.push(file);
  }
  return [...new Set(paths)].sort();
}

export function changedPaths(project, baseline) {
  if (/^[0-9a-f]{40}$/.test(baseline)) {
    const currentTree = snapshotTree(project);
    return git(project, ["diff", "--name-only", "--diff-filter=ACDMRTUXB", baseline, currentTree, "--"])
      .stdout.split("\n").filter(Boolean).map(normalizePath).sort();
  }
  const tracked = git(project, ["diff", "--name-only", "--diff-filter=ACDMRTUXB", baseline, "--"])
    .stdout.split("\n").filter(Boolean).map(normalizePath);
  const untracked = git(project, ["ls-files", "--others", "--exclude-standard"])
    .stdout.split("\n").filter(Boolean).map(normalizePath);
  return [...new Set([...tracked, ...untracked])].sort();
}

export function snapshotTree(project) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "implementation-git-index-"));
  const indexFile = path.join(temporary, "index");
  const env = { ...process.env, GIT_INDEX_FILE: indexFile };
  try {
    const read = run("git", ["read-tree", "HEAD"], { cwd: project, env });
    if (read.status !== 0) throw new CliError("GIT_SNAPSHOT_FAILED", String(read.stderr || read.stdout).trim());
    const add = run("git", ["add", "-A", "--", "."], { cwd: project, env });
    if (add.status !== 0) throw new CliError("GIT_SNAPSHOT_FAILED", String(add.stderr || add.stdout).trim());
    const tree = run("git", ["write-tree"], { cwd: project, env });
    if (tree.status !== 0) throw new CliError("GIT_SNAPSHOT_FAILED", String(tree.stderr || tree.stdout).trim());
    return tree.stdout.trim();
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

export function splitList(value) {
  if (value === undefined || value === true || value === "") return [];
  return String(value).split(",").map((item) => normalizePath(item.trim())).filter(Boolean);
}

function globRegex(glob) {
  let expression = "";
  for (let index = 0; index < glob.length; index += 1) {
    const character = glob[index];
    if (character === "*" && glob[index + 1] === "*") {
      expression += ".*";
      index += 1;
    } else if (character === "*") expression += "[^/]*";
    else if (character === "?") expression += "[^/]";
    else expression += character.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
  }
  return new RegExp(`^${expression}$`);
}

export function matchesAny(file, patterns = []) {
  return patterns.some((pattern) => globRegex(normalizePath(pattern)).test(normalizePath(file)));
}

export function assertIdentifier(value, label = "identifier") {
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/.test(value ?? "")) {
    throw new CliError("INVALID_IDENTIFIER", `${label} is invalid`);
  }
}
