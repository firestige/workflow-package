import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { initRepository, runCli, writeJson } from "./helpers.mjs";

function harness(project) {
  const file = path.join(project, "harness.json");
  writeJson(file, {
    schema_version: "1.0.0",
    commands: {
      focused: { argv: [process.execPath, "-e", "process.exit(0)"] },
      full: { argv: [process.execPath, "-e", "process.exit(0)"] },
      coverage: { argv: [process.execPath, "-e", "process.exit(0)"] }
    }
  });
  return file;
}

function obligations(project) {
  const file = path.join(project, "obligations.md");
  fs.writeFileSync(file, "# Obligations\n\nNone.\n");
  return file;
}

test("preflight accepts a clean repository and emits exact identities", () => {
  const project = initRepository();
  const result = runCli("implementation-preflight.mjs", [
    "--project", project,
    "--design", path.join(project, "design.md"),
    "--harness", harness(project),
    "--obligations", obligations(project)
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.json.status, "PASSED");
  assert.match(result.json.baseline_commit, /^[0-9a-f]{40}$/);
  assert.match(result.json.design_sha256, /^[0-9a-f]{64}$/);
  assert.match(result.json.harness_sha256, /^[0-9a-f]{64}$/);
  assert.match(result.json.obligation_register_sha256, /^[0-9a-f]{64}$/);
});

test("preflight rejects an unowned dirty worktree", () => {
  const project = initRepository();
  fs.appendFileSync(path.join(project, "src", "core.js"), "export const dirty = true;\n");
  const result = runCli("implementation-preflight.mjs", [
    "--project", project,
    "--design", path.join(project, "design.md"),
    "--harness", harness(project),
    "--obligations", obligations(project)
  ]);

  assert.notEqual(result.status, 0);
  assert.equal(result.json.status, "FAILED");
  assert.equal(result.json.code, "DIRTY_WORKTREE");
  assert.deepEqual(result.json.paths, ["src/core.js"]);
});

test("preflight rejects a design without IMPLEMENTATION_READY status", () => {
  const project = initRepository();
  fs.writeFileSync(path.join(project, "design.md"), "# Design\n\nStatus: DRAFT\n");
  const result = runCli("implementation-preflight.mjs", [
    "--project", project,
    "--design", path.join(project, "design.md"),
    "--harness", harness(project),
    "--obligations", obligations(project),
    "--allow-dirty", "design.md"
  ]);

  assert.notEqual(result.status, 0);
  assert.equal(result.json.code, "DESIGN_NOT_READY");
});

test("preflight rejects a declared feasibility phase that is not frozen argv", () => {
  const project = initRepository();
  const binding = harness(project);
  const value = JSON.parse(fs.readFileSync(binding, "utf8"));
  value.commands.feasibility = { command: "npm view @langchain/langgraph version" };
  writeJson(binding, value);

  const result = runCli("implementation-preflight.mjs", [
    "--project", project,
    "--design", path.join(project, "design.md"),
    "--harness", binding,
    "--obligations", obligations(project)
  ]);

  assert.notEqual(result.status, 0);
  assert.equal(result.json.code, "INVALID_HARNESS_COMMAND");
});
