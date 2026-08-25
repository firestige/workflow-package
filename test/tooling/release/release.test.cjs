const assert = require("node:assert/strict");
const { mkdtemp, readFile, writeFile } = require("node:fs/promises");
const { tmpdir } = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  ReleaseError,
  assertConfiguration,
  buildWorkflowAssets,
  simulateLifecycle,
  verifyWorkflowAssets,
} = require("../../../release/cli/release.cjs");

const root = path.resolve(__dirname, "../../..");

test("workflow adapter selects workflow assets without npm publication", async () => {
  const config = JSON.parse(await readFile(path.join(root, "release/config/component.json")));
  assert.doesNotThrow(() => assertConfiguration(config));
  assert.equal(config.assetMode, "workflow-assets");
  assert.equal(config.publisherAdapter, "workflow-assets+github-release");
  assert.equal(JSON.stringify(config).includes("npm-pair"), false);
});

test("workflow asset builder is deterministic and digest verified", async () => {
  const first = await mkdtemp(path.join(tmpdir(), "workflow-release-a-"));
  const second = await mkdtemp(path.join(tmpdir(), "workflow-release-b-"));
  const revision = "a".repeat(40);
  const a = await buildWorkflowAssets(root, first, revision);
  const b = await buildWorkflowAssets(root, second, revision);
  assert.deepEqual(a, b);
  assert.ok(a.artifactCount >= 2);
  assert.equal(await verifyWorkflowAssets(first), a.artifactCount);
  const manifest = JSON.parse(await readFile(path.join(first, "release-metadata.json")));
  await writeFile(path.join(first, manifest.artifacts[0].name), "changed");
  await assert.rejects(() => verifyWorkflowAssets(first), /RELEASE_ARTIFACT_DIGEST_MISMATCH/);
});

test("generic lifecycle cases are fail closed", () => {
  assert.equal(simulateLifecycle("happy"), "STABLE");
  assert.equal(simulateLifecycle("candidate-main-divergence"), "STABLE");
  assert.equal(simulateLifecycle("npm-partial-failure"), "UNSUPPORTED_SCENARIO");
  for (const scenario of ["digest-mismatch", "tag-collision", "permission-denied", "builtin-token-final-publish"]) {
    assert.throws(() => simulateLifecycle(scenario), ReleaseError);
  }
});

test("only stable publish receives the release App token", async () => {
  const candidate = await readFile(path.join(root, ".github/workflows/release-candidate.yml"), "utf8");
  const promote = await readFile(path.join(root, ".github/workflows/release-promote.yml"), "utf8");
  assert.equal(candidate.includes("WSR_RELEASE_APP_PRIVATE_KEY"), false);
  assert.ok(candidate.includes("workflow_call:"));
  assert.ok(candidate.includes('test "$GITHUB_REF_NAME" = "release/next"'));
  assert.ok(candidate.includes("ref: ${{ inputs.contract_ref }}"));
  assert.equal(candidate.includes("ref: main"), false);
  assert.ok(promote.includes("actions/create-github-app-token@"));
  assert.ok(promote.includes("GH_TOKEN: ${{ steps.release-app-token.outputs.token }}"));
  assert.ok(promote.includes("repositories: workflow-package"));
  assert.ok(promote.includes("permission-contents: write"));
});
