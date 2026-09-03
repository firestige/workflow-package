import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { execFileSync } from "node:child_process";

import { initRepository, runCli, temporaryDirectory, writeJson } from "./helpers.mjs";

function candidate(project, overrides = {}, outputDirectory = project) {
  const file = path.join(outputDirectory, "candidate.json");
  const tree = overrides.candidate_tree ?? "tree-1";
  writeJson(file, {
    schema_version: "1.0.0",
    design_identity: "sha256:design",
    obligation_register_identity: "sha256:obligations",
    obligations: [],
    candidate_tree: tree,
    goals: [{ id: "GOAL-001", status: "VERIFIED" }],
    findings: [],
    review_results: [
      { lens: "black-box", scope: "GOAL", goal_id: "GOAL-001", status: "PASSED", baseline: tree },
      { lens: "white-box", scope: "GOAL", goal_id: "GOAL-001", status: "PASSED", baseline: tree },
      { lens: "black-box", scope: "WHOLE_SCOPE", status: "PASSED", baseline: tree },
      { lens: "white-box", scope: "WHOLE_SCOPE", status: "PASSED", baseline: tree }
    ],
    tests: [
      { phase: "focused", status: "PASSED", baseline: tree },
      { phase: "full", status: "PASSED", baseline: tree },
      { phase: "coverage", status: "PASSED", baseline: tree }
    ],
    unauthorized_stubs: [],
    ...overrides
  });
  return file;
}

test("candidate verification passes only a fully closed candidate", () => {
  const project = initRepository();
  const result = runCli("implementation-custodian.mjs", [
    "verify-candidate", "--candidate", candidate(project)
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.json.status, "PASSED");
});

test("candidate verification rejects incomplete goals, open findings, and stubs", () => {
  const project = initRepository();
  const result = runCli("implementation-custodian.mjs", [
    "verify-candidate", "--candidate", candidate(project, {
      goals: [{ id: "GOAL-001", status: "READY" }],
      findings: [{ id: "F-1", status: "OPEN", severity: "MAJOR" }],
      unauthorized_stubs: ["src/adapter.js:12"]
    })
  ]);
  assert.notEqual(result.status, 0);
  assert.equal(result.json.code, "CANDIDATE_NOT_CLOSED");
  assert.deepEqual(result.json.problems.sort(), [
    "goal GOAL-001 is READY",
    "open finding F-1",
    "unauthorized stub src/adapter.js:12"
  ].sort());
});

test("candidate verification rejects missing reviews and evidence from another tree", () => {
  const project = initRepository();
  const result = runCli("implementation-custodian.mjs", [
    "verify-candidate", "--candidate", candidate(project, {
      review_results: [{ lens: "black-box", scope: "WHOLE_SCOPE", status: "PASSED", baseline: "tree-0" }],
      tests: [
        { phase: "focused", status: "PASSED", baseline: "tree-1" },
        { phase: "full", status: "PASSED", baseline: "tree-0" },
        { phase: "coverage", status: "PASSED", baseline: "tree-1" }
      ]
    })
  ]);
  assert.notEqual(result.status, 0);
  assert.equal(result.json.code, "CANDIDATE_NOT_CLOSED");
  assert.ok(result.json.problems.includes("whole-scope white-box review is missing"));
  assert.ok(result.json.problems.includes("whole-scope black-box review targets tree-0"));
  assert.ok(result.json.problems.includes("full evidence targets tree-0"));
});

test("final candidate verification rejects missing whole-scope review", () => {
  const project = initRepository();
  const result = runCli("implementation-custodian.mjs", [
    "verify-candidate", "--candidate", candidate(project, {
      review_results: [
        { lens: "black-box", scope: "GOAL", goal_id: "GOAL-001", status: "PASSED", baseline: "tree-1" },
        { lens: "white-box", scope: "GOAL", goal_id: "GOAL-001", status: "PASSED", baseline: "tree-1" }
      ]
    })
  ]);
  assert.notEqual(result.status, 0);
  assert.ok(result.json.problems.includes("whole-scope black-box review is missing"));
  assert.ok(result.json.problems.includes("whole-scope white-box review is missing"));
});

test("candidate verification permits ACCEPTED_MINOR only for a Minor finding", () => {
  const project = initRepository();
  const result = runCli("implementation-custodian.mjs", [
    "verify-candidate", "--candidate", candidate(project, {
      findings: [{ id: "F-1", severity: "MAJOR", status: "ACCEPTED_MINOR" }]
    })
  ]);
  assert.notEqual(result.status, 0);
  assert.ok(result.json.problems.includes("invalid accepted-minor finding F-1"));
});

test("candidate verification rejects a finding closed by another lens", () => {
  const project = initRepository();
  const result = runCli("implementation-custodian.mjs", [
    "verify-candidate", "--candidate", candidate(project, {
      findings: [{
        id: "F-1", severity: "MINOR", status: "ACCEPTED_MINOR",
        source_lens: "black-box", closed_by_lens: "white-box"
      }]
    })
  ]);
  assert.notEqual(result.status, 0);
  assert.ok(result.json.problems.includes("finding F-1 was not closed by its source lens"));
});

test("candidate verification rejects inconclusive feasibility and accepts non-gating tuning handoff", () => {
  const project = initRepository();
  const result = runCli("implementation-custodian.mjs", [
    "verify-candidate", "--candidate", candidate(project, {
      obligations: [
        { id: "EXT-004", class: "IMPLEMENTATION_FEASIBILITY", state: "INCONCLUSIVE" },
        { id: "EXT-005", class: "OPERATIONAL_TUNING", state: "HANDED_OFF", fitness_threshold_required: false }
      ]
    })
  ]);

  assert.notEqual(result.status, 0);
  assert.equal(result.json.code, "CANDIDATE_NOT_CLOSED");
  assert.ok(result.json.problems.includes("feasibility obligation EXT-004 is INCONCLUSIVE"));
  assert.ok(!result.json.problems.some((problem) => problem.includes("EXT-005")));
});

test("custodian creates a verified goal commit from explicit paths", () => {
  const project = initRepository();
  fs.appendFileSync(path.join(project, "src", "core.js"), "export const committed = true;\n");
  const evidence = temporaryDirectory();
  const paths = path.join(evidence, "goal-paths.json");
  writeJson(paths, { schema_version: "1.0.0", paths: ["src/core.js"] });
  const snapshot = runCli("implementation-writer.mjs", ["snapshot", "--project", project]);
  const verifiedCandidate = candidate(project, { candidate_tree: snapshot.json.tree }, evidence);

  const result = runCli("implementation-custodian.mjs", [
    "commit-goal", "--project", project, "--goal", "GOAL-001",
    "--paths", paths, "--candidate", verifiedCandidate,
    "--message", "implement(GOAL-001): satisfy core behavior"
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.json.status, "COMMITTED");
  assert.match(result.json.commit, /^[0-9a-f]{40}$/);
  assert.equal(execFileSync("git", ["status", "--porcelain"], { cwd: project, encoding: "utf8" }), "");
  assert.equal(execFileSync("git", ["log", "-1", "--format=%s"], { cwd: project, encoding: "utf8" }).trim(), "implement(GOAL-001): satisfy core behavior");
});

test("custodian rejects a goal commit without verified candidate evidence", () => {
  const project = initRepository();
  fs.appendFileSync(path.join(project, "src", "core.js"), "export const unverified = true;\n");
  const paths = path.join(temporaryDirectory(), "goal-paths.json");
  writeJson(paths, { schema_version: "1.0.0", paths: ["src/core.js"] });

  const result = runCli("implementation-custodian.mjs", [
    "commit-goal", "--project", project, "--goal", "GOAL-001",
    "--paths", paths, "--message", "implement(GOAL-001): bypass"
  ]);

  assert.notEqual(result.status, 0);
  assert.equal(result.json.code, "MISSING_ARGUMENT");
  assert.match(result.json.message, /--candidate/);
  assert.equal(execFileSync("git", ["status", "--porcelain"], { cwd: project, encoding: "utf8" }).includes("src/core.js"), true);
});

test("package verification accepts the complete checked-in resource set", () => {
  const packageRoot = path.resolve(import.meta.dirname, "../..");
  const result = runCli("implementation-custodian.mjs", [
    "verify-package", "--package", packageRoot
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.json.status, "PASSED");
  assert.equal(result.json.action_ids.length, 21);
  assert.equal(result.json.referenced_action_ids.length, 21);
  assert.equal(result.json.skill_count, 9);
});

test("cleanup removes only an implementation run workspace under project tmp", () => {
  const project = initRepository();
  fs.writeFileSync(path.join(project, ".gitignore"), "tmp/\n");
  execFileSync("git", ["add", ".gitignore"], { cwd: project });
  execFileSync("git", ["commit", "-q", "-m", "ignore run workspace"], { cwd: project });
  const workspace = path.join(project, "tmp", "implementation-workflow", "run-1");
  fs.mkdirSync(workspace, { recursive: true });
  fs.writeFileSync(path.join(workspace, "state.json"), "{}\n");

  const result = runCli("implementation-custodian.mjs", [
    "cleanup-run", "--project", project, "--workspace", workspace
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.json.status, "CLEANED");
  assert.equal(fs.existsSync(workspace), false);
});

test("cleanup rejects a path outside the implementation run root", () => {
  const project = initRepository();
  const result = runCli("implementation-custodian.mjs", [
    "cleanup-run", "--project", project, "--workspace", path.join(project, "src")
  ]);

  assert.notEqual(result.status, 0);
  assert.equal(result.json.code, "UNSAFE_CLEANUP_PATH");
  assert.equal(fs.existsSync(path.join(project, "src", "core.js")), true);
});
