import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const cliRoot = path.resolve(import.meta.dirname, "..");

export function temporaryDirectory(prefix = "implementation-workflow-") {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

export function initRepository() {
  const project = temporaryDirectory();
  execFileSync("git", ["init", "-q", "-b", "main"], { cwd: project });
  execFileSync("git", ["config", "user.name", "Implementation Workflow Test"], { cwd: project });
  execFileSync("git", ["config", "user.email", "workflow-test@example.invalid"], { cwd: project });
  fs.mkdirSync(path.join(project, "src"), { recursive: true });
  fs.mkdirSync(path.join(project, "test"), { recursive: true });
  fs.writeFileSync(path.join(project, "src", "core.js"), "export const value = 1;\n");
  fs.writeFileSync(path.join(project, "test", "core.test.js"), "// frozen acceptance test\n");
  fs.writeFileSync(path.join(project, "design.md"), "# Design\n\nStatus: IMPLEMENTATION_READY\n");
  execFileSync("git", ["add", "."], { cwd: project });
  execFileSync("git", ["commit", "-q", "-m", "baseline"], { cwd: project });
  return project;
}

export function runCli(relativeBin, args, options = {}) {
  const result = spawnSync(process.execPath, [path.join(cliRoot, "bin", relativeBin), ...args], {
    cwd: options.cwd,
    encoding: "utf8",
    env: { ...process.env, ...options.env },
  });
  let json = null;
  try {
    json = JSON.parse(result.stdout);
  } catch {}
  return { ...result, json };
}
