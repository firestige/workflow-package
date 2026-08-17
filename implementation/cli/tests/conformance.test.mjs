import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { execFileSync } from "node:child_process";

import { initRepository, runCli, temporaryDirectory, writeJson } from "./helpers.mjs";

test("positive single-Goal flow preserves RED, writer separation, GREEN evidence, and verified commit", () => {
  const project = initRepository();
  const run = temporaryDirectory("implementation-conformance-");
  const harness = path.join(run, "harness.json");
  const obligations = path.join(run, "obligations.md");
  fs.writeFileSync(obligations, "# Obligations\n\nNone.\n");
  const check = "const fs=require('node:fs');process.exit(fs.readFileSync(process.argv[1],'utf8').includes('implemented = true')?0:1)";
  writeJson(harness, {
    schema_version: "1.0.0",
    commands: {
      focused: { argv: [process.execPath, "-e", check, path.join(project, "src", "core.js")] },
      full: { argv: [process.execPath, "-e", check, path.join(project, "src", "core.js")] },
      coverage: { argv: [process.execPath, "-e", check, path.join(project, "src", "core.js")] }
    }
  });
  const policy = path.join(run, "writer-policy.json");
  writeJson(policy, {
    schema_version: "1.0.0",
    roles: {
      test_designer: { allow: ["test/**"], deny: ["src/**"] },
      implementer: { allow: ["src/**"], deny: ["test/**"] }
    }
  });

  const preflight = runCli("implementation-preflight.mjs", [
    "--project", project, "--design", path.join(project, "design.md"), "--harness", harness,
    "--obligations", obligations
  ]);
  assert.equal(preflight.json.status, "PASSED");
  const branch = runCli("implementation-custodian.mjs", [
    "activate-branch", "--project", project, "--branch", "feat/conformance-goal"
  ]);
  assert.equal(branch.json.status, "ACTIVATED");

  fs.appendFileSync(path.join(project, "test", "core.test.js"), "// asserts implemented behavior\n");
  const testWriter = runCli("implementation-writer.mjs", [
    "check", "--project", project, "--baseline", preflight.json.baseline_commit,
    "--policy", policy, "--role", "test_designer"
  ]);
  assert.equal(testWriter.json.status, "PASSED");
  const red = runCli("implementation-test.mjs", [
    "run", "--project", project, "--binding", harness, "--phase", "focused"
  ]);
  assert.notEqual(red.status, 0);
  assert.equal(red.json.status, "FAILED");

  const implementerBaseline = runCli("implementation-writer.mjs", ["snapshot", "--project", project]);
  fs.appendFileSync(path.join(project, "src", "core.js"), "export const implemented = true;\n");
  const implementationWriter = runCli("implementation-writer.mjs", [
    "check", "--project", project, "--baseline", implementerBaseline.json.tree,
    "--policy", policy, "--role", "implementer"
  ]);
  assert.equal(implementationWriter.json.status, "PASSED");

  for (const phase of ["focused", "full", "coverage"]) {
    const result = runCli("implementation-test.mjs", [
      "run", "--project", project, "--binding", harness, "--phase", phase
    ]);
    assert.equal(result.json.status, "PASSED", `${phase}: ${result.stderr}`);
  }
  const candidateTree = runCli("implementation-writer.mjs", ["snapshot", "--project", project]).json.tree;
  const candidate = path.join(run, "candidate.json");
  writeJson(candidate, {
    schema_version: "1.0.0",
    design_identity: `sha256:${preflight.json.design_sha256}`,
    obligation_register_identity: "sha256:none",
    obligations: [],
    candidate_tree: candidateTree,
    goals: [{ id: "GOAL-001", status: "VERIFIED" }],
    findings: [],
    review_results: [
      { lens: "black-box", scope: "GOAL", goal_id: "GOAL-001", status: "PASSED", baseline: candidateTree },
      { lens: "white-box", scope: "GOAL", goal_id: "GOAL-001", status: "PASSED", baseline: candidateTree },
      { lens: "black-box", scope: "WHOLE_SCOPE", status: "PASSED", baseline: candidateTree },
      { lens: "white-box", scope: "WHOLE_SCOPE", status: "PASSED", baseline: candidateTree }
    ],
    tests: ["focused", "full", "coverage"].map((phase) => ({ phase, status: "PASSED", baseline: candidateTree })),
    unauthorized_stubs: []
  });
  const paths = path.join(run, "paths.json");
  writeJson(paths, { schema_version: "1.0.0", paths: ["src/core.js", "test/core.test.js"] });
  const commit = runCli("implementation-custodian.mjs", [
    "commit-goal", "--project", project, "--goal", "GOAL-001", "--paths", paths,
    "--candidate", candidate, "--message", "implement(GOAL-001): conformance"
  ]);
  assert.equal(commit.json.status, "COMMITTED", commit.stderr);
  assert.equal(execFileSync("git", ["status", "--porcelain"], { cwd: project, encoding: "utf8" }), "");
  const final = runCli("implementation-custodian.mjs", ["verify-candidate", "--candidate", candidate]);
  assert.equal(final.json.status, "PASSED", final.stderr);
});
