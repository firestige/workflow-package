import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { initRepository, runCli, writeJson } from "./helpers.mjs";

function policy(project) {
  const file = path.join(project, "writer-policy.json");
  writeJson(file, {
    schema_version: "1.0.0",
    roles: {
      implementer: { allow: ["src/**"], deny: ["test/**", "harness.json", "writer-policy.json"] },
      test_designer: { allow: ["test/**"], deny: ["src/**", "harness.json", "writer-policy.json"] }
    }
  });
  return file;
}

test("writer check permits only the role-owned file family", () => {
  const project = initRepository();
  const baseline = "HEAD";
  const policyFile = policy(project);
  fs.appendFileSync(path.join(project, "src", "core.js"), "export const next = 2;\n");

  const result = runCli("implementation-writer.mjs", [
    "check", "--project", project, "--baseline", baseline,
    "--policy", policyFile, "--role", "implementer",
    "--allow-dirty", "writer-policy.json"
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.json.status, "PASSED");
  assert.deepEqual(result.json.changed_paths, ["src/core.js"]);
});

test("writer check rejects an Implementer test edit", () => {
  const project = initRepository();
  const policyFile = policy(project);
  fs.appendFileSync(path.join(project, "test", "core.test.js"), "// weakened\n");

  const result = runCli("implementation-writer.mjs", [
    "check", "--project", project, "--baseline", "HEAD",
    "--policy", policyFile, "--role", "implementer",
    "--allow-dirty", "writer-policy.json"
  ]);

  assert.notEqual(result.status, 0);
  assert.equal(result.json.code, "WRITER_POLICY_VIOLATION");
  assert.deepEqual(result.json.violations, [{ path: "test/core.test.js", reason: "denied" }]);
});

test("writer check includes untracked files", () => {
  const project = initRepository();
  const policyFile = policy(project);
  fs.writeFileSync(path.join(project, "test", "new.test.js"), "// untracked\n");

  const result = runCli("implementation-writer.mjs", [
    "check", "--project", project, "--baseline", "HEAD",
    "--policy", policyFile, "--role", "implementer",
    "--allow-dirty", "writer-policy.json"
  ]);

  assert.notEqual(result.status, 0);
  assert.deepEqual(result.json.violations, [{ path: "test/new.test.js", reason: "denied" }]);
});

test("writer snapshot treats pre-existing RED tests as the Implementer action baseline", () => {
  const project = initRepository();
  const policyFile = policy(project);
  fs.writeFileSync(path.join(project, "test", "red.test.js"), "// expected RED owned by Test Designer\n");
  const snapshot = runCli("implementation-writer.mjs", ["snapshot", "--project", project]);
  assert.equal(snapshot.status, 0, snapshot.stderr);
  assert.match(snapshot.json.tree, /^[0-9a-f]{40}$/);

  fs.appendFileSync(path.join(project, "src", "core.js"), "export const green = true;\n");
  const allowed = runCli("implementation-writer.mjs", [
    "check", "--project", project, "--baseline", snapshot.json.tree,
    "--policy", policyFile, "--role", "implementer",
    "--allow-dirty", "writer-policy.json"
  ]);
  assert.equal(allowed.status, 0, allowed.stderr);
  assert.deepEqual(allowed.json.changed_paths, ["src/core.js"]);

  fs.appendFileSync(path.join(project, "test", "red.test.js"), "// Implementer weakened it\n");
  const denied = runCli("implementation-writer.mjs", [
    "check", "--project", project, "--baseline", snapshot.json.tree,
    "--policy", policyFile, "--role", "implementer",
    "--allow-dirty", "writer-policy.json"
  ]);
  assert.notEqual(denied.status, 0);
  assert.deepEqual(denied.json.violations, [{ path: "test/red.test.js", reason: "denied" }]);
});
