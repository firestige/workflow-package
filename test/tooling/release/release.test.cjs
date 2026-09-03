const assert = require("node:assert/strict");
const { mkdir, mkdtemp, readFile, writeFile } = require("node:fs/promises");
const { tmpdir } = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  ReleaseError,
  assertConfiguration,
  buildWorkflowAssets,
  qualifyWorkflowAssets,
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

test("clean-directory qualification replays only the DSL 2 Contract validator for every downloaded archive", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "workflow-release-replay-"));
  const checkerRoot = await mkdtemp(path.join(tmpdir(), "workflow-release-checker-"));
  await mkdir(path.join(checkerRoot, "workflow-dsl-2-candidate", "generated", "tools"), { recursive: true });
  const checker = `
    const fs = require("node:fs");
    const path = require("node:path");
    const root = process.argv[2];
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json")));
    if (!pkg.package || !pkg.documents || !fs.existsSync(path.join(root, "snapshot.json"))) process.exit(1);
  `;
  await writeFile(path.join(checkerRoot, "workflow-dsl-2-candidate", "generated", "tools/check-example.cjs"), checker);
  await buildWorkflowAssets(root, destination, "a".repeat(40), "b".repeat(40));
  assert.deepEqual(await qualifyWorkflowAssets(destination, checkerRoot), {
    artifactCount: 12,
    packageCount: 3,
  });
});

test("workflow asset builder is deterministic and digest verified", async () => {
  const first = await mkdtemp(path.join(tmpdir(), "workflow-release-a-"));
  const second = await mkdtemp(path.join(tmpdir(), "workflow-release-b-"));
  const revision = "a".repeat(40);
  const contractRevision = "b".repeat(40);
  const a = await buildWorkflowAssets(root, first, revision, contractRevision);
  const b = await buildWorkflowAssets(root, second, revision, contractRevision);
  assert.deepEqual(a, b);
  assert.equal(a.artifactCount, 12);
  assert.equal(await verifyWorkflowAssets(first), a.artifactCount);
  const manifest = JSON.parse(await readFile(path.join(first, "release-metadata.json")));
  assert.deepEqual(manifest.packages.map((item) => item.tag), [
    "workflow-package/hello-world-workflow/v0.2.0",
    "workflow-package/implementation-workflow/v0.4.10",
    "workflow-package/system-design-workflow/v0.4.10",
  ]);
  for (const item of manifest.packages) {
    assert.equal(item.assets.length, 4);
    const descriptor = JSON.parse(await readFile(path.join(first, item.assets.find((asset) => asset.kind === "descriptor").name)));
    assert.equal(descriptor.schemaVersion, "workflow-package.package-release@2.0.0");
    assert.deepEqual(descriptor.contract, {
      repository: "firestige/wsr-contracts",
      revision: contractRevision,
      minVersion: "2.0.0",
      maxVersion: "2.0.0",
    });
    const provenance = JSON.parse(await readFile(path.join(first, descriptor.provenance.name)));
    assert.equal(provenance.schemaVersion, "workflow-package.provenance@1.0.0");
    assert.equal(provenance.subject.name, descriptor.archive.name);
    assert.equal(provenance.subject.sha256, descriptor.archive.sha256);
    assert.equal(provenance.source.revision, revision);
    assert.equal(provenance.contract.revision, contractRevision);
  }
  await writeFile(path.join(first, manifest.packages[0].assets[0].name), "changed");
  await assert.rejects(() => verifyWorkflowAssets(first), /RELEASE_ARTIFACT_DIGEST_MISMATCH/);
});

test("workflow release verification rejects missing provenance and undeclared files", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "workflow-release-closed-"));
  await buildWorkflowAssets(root, destination, "a".repeat(40), "b".repeat(40));
  const manifest = JSON.parse(await readFile(path.join(destination, "release-metadata.json")));
  const provenance = manifest.packages[0].assets.find((asset) => asset.kind === "provenance");
  await writeFile(path.join(destination, provenance.name), "{}");
  await assert.rejects(() => verifyWorkflowAssets(destination), /RELEASE_ARTIFACT_DIGEST_MISMATCH/);
  await buildWorkflowAssets(root, destination, "a".repeat(40), "b".repeat(40));
  await writeFile(path.join(destination, "latest.json"), "{}");
  await assert.rejects(() => verifyWorkflowAssets(destination), /RELEASE_ARTIFACT_SET_INVALID/);
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
  const ci = await readFile(path.join(root, ".github/workflows/ci.yml"), "utf8");
  const releaseCli = await readFile(path.join(root, "release/cli/release.cjs"), "utf8");
  assert.equal(candidate.includes("WSR_RELEASE_APP_PRIVATE_KEY"), false);
  assert.ok(candidate.includes("workflow_call:"));
  assert.ok(candidate.includes('test "$GITHUB_REF_NAME" = "release/next"'));
  assert.ok(candidate.includes("ref: ${{ inputs.contract_ref }}"));
  assert.equal(candidate.includes("ref: main"), false);
  assert.ok(promote.includes("actions/create-github-app-token@"));
  assert.ok(promote.includes('gh release view "$CANDIDATE_TAG" --repo "$GITHUB_REPOSITORY"'));
  assert.ok(promote.includes("GH_TOKEN: ${{ steps.release-app-token.outputs.token }}"));
  assert.ok(promote.includes("repositories: wsr-workflow-package"));
  assert.ok(promote.includes("permission-contents: write"));
  assert.ok(candidate.includes('release.cjs qualify "$RUNNER_TEMP/remote-release"'));
  assert.ok(promote.includes('release.cjs qualify "$RUNNER_TEMP/qualified-release" "$RUNNER_TEMP/system-contracts"'));
  assert.ok(promote.includes('npm --prefix "$RUNNER_TEMP/system-contracts/workflow-dsl-2-candidate" ci'));
  assert.equal(promote.includes('system-contracts/workflow-dsl"'), false);
  assert.equal(candidate.includes('system-contracts/workflow-dsl"'), false);
  assert.equal(ci.includes('system-contracts/workflow-dsl"'), false);
  assert.equal(ci.includes("test-wave6-contract.cjs"), false);
  assert.equal(releaseCli.includes("agentops.workflow-dsl@1.1.0"), false);
  assert.equal(candidate.includes("workflow-dsl/tools/check-example.cjs"), false);
  assert.equal(candidate.includes("workflow-dsl/tools/run-conformance.cjs"), false);
  assert.ok(candidate.includes("workflow-dsl-2-candidate/generated/tools/check-example.cjs implementation/definition"));
  assert.ok(candidate.includes("workflow-dsl-2-candidate/generated/tools/check-example.cjs system-design/definition"));
  assert.ok(promote.includes("jq -c '.packages[]'"));
  assert.ok(promote.includes('gh release view "$TAG"'));
  assert.ok(promote.includes("continue"));
  assert.equal(promote.includes('test "$(gh api "repos/$GITHUB_REPOSITORY/git/ref/tags/$TAG"'), false);
  assert.ok(promote.includes('gh release create "$TAG"'));
  assert.equal(promote.includes("inputs.final_tag"), false);
});
