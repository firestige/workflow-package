const { createHash } = require("node:crypto");
const { gzipSync } = require("node:zlib");
const { mkdir, readFile, readdir, writeFile } = require("node:fs/promises");
const path = require("node:path");

const CONFIG_KEYS = [
  "schemaVersion", "repository", "releaseBranch", "triggerBranch", "assetMode",
  "acceptanceCommand", "buildCommand", "verifyCommand", "publisherAdapter",
  "remoteInstallMode", "stablePolicy", "capabilities",
];
const PACKAGE_DIRECTORIES = ["implementation", "system-design"];

class ReleaseError extends Error {}

function assertConfiguration(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)
    || Object.keys(value).sort().join(",") !== [...CONFIG_KEYS].sort().join(",")
    || value.schemaVersion !== "wsr.release-component@1.0.0"
    || value.releaseBranch !== "main" || !/^release\/[a-z0-9._-]+$/.test(value.triggerBranch)
    || value.stablePolicy !== "qualified-candidate-exact-assets"
    || !Array.isArray(value.capabilities) || value.capabilities.length === 0
    || new Set(value.capabilities).size !== value.capabilities.length) {
    throw new ReleaseError("RELEASE_CONFIGURATION_INVALID");
  }
}

function simulateLifecycle(scenario) {
  if (["happy", "candidate-main-divergence"].includes(scenario)) return "STABLE";
  if (scenario === "npm-partial-failure") return "UNSUPPORTED_SCENARIO";
  const failures = {
    "digest-mismatch": "RELEASE_ARTIFACT_DIGEST_MISMATCH",
    "tag-collision": "RELEASE_TAG_COLLISION",
    "permission-denied": "RELEASE_PERMISSION_DENIED",
    "builtin-token-final-publish": "RELEASE_APP_TOKEN_REQUIRED",
  };
  if (failures[scenario]) throw new ReleaseError(failures[scenario]);
  throw new ReleaseError("RELEASE_SCENARIO_UNKNOWN");
}

function sha256(bytes) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

async function files(directory, prefix = "") {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(absolute, relative));
    else if (entry.isFile()) result.push({ relative, bytes: await readFile(absolute) });
  }
  return result.sort((a, b) => a.relative.localeCompare(b.relative));
}

function octal(value, length) {
  const encoded = value.toString(8).padStart(length - 1, "0") + "\0";
  if (encoded.length !== length) throw new ReleaseError("WORKFLOW_ASSET_TOO_LARGE");
  return encoded;
}

function writeString(buffer, offset, length, value) {
  const bytes = Buffer.from(value);
  if (bytes.length > length) throw new ReleaseError("WORKFLOW_ASSET_PATH_TOO_LONG");
  bytes.copy(buffer, offset);
}

function tarHeader(name, size) {
  const header = Buffer.alloc(512);
  let filename = name;
  let prefix = "";
  if (Buffer.byteLength(filename) > 100) {
    const split = filename.lastIndexOf("/");
    prefix = filename.slice(0, split);
    filename = filename.slice(split + 1);
  }
  writeString(header, 0, 100, filename);
  writeString(header, 100, 8, octal(0o644, 8));
  writeString(header, 108, 8, octal(0, 8));
  writeString(header, 116, 8, octal(0, 8));
  writeString(header, 124, 12, octal(size, 12));
  writeString(header, 136, 12, octal(0, 12));
  header.fill(0x20, 148, 156);
  header[156] = "0".charCodeAt(0);
  writeString(header, 257, 6, "ustar\0");
  writeString(header, 263, 2, "00");
  writeString(header, 345, 155, prefix);
  const checksum = [...header].reduce((sum, byte) => sum + byte, 0);
  writeString(header, 148, 8, checksum.toString(8).padStart(6, "0") + "\0 ");
  return header;
}

async function archive(directory) {
  const blocks = [];
  for (const file of await files(directory)) {
    const name = `package/${file.relative}`;
    blocks.push(tarHeader(name, file.bytes.byteLength), file.bytes);
    const padding = (512 - (file.bytes.byteLength % 512)) % 512;
    if (padding) blocks.push(Buffer.alloc(padding));
  }
  blocks.push(Buffer.alloc(1024));
  return gzipSync(Buffer.concat(blocks), { level: 9, mtime: 0 });
}

async function buildWorkflowAssets(repository, destination, revision) {
  if (!/^[a-f0-9]{40}$/.test(revision)) throw new ReleaseError("RELEASE_REVISION_INVALID");
  await mkdir(destination, { recursive: true });
  const artifacts = [];
  for (const directoryName of PACKAGE_DIRECTORIES) {
    const directory = path.join(repository, directoryName);
    const identity = JSON.parse(await readFile(path.join(directory, "definition/package.json"))).package;
    if (!identity || typeof identity.name !== "string" || typeof identity.version !== "string"
      || !/^sha256:[a-f0-9]{64}$/.test(identity.digest)) {
      throw new ReleaseError("WORKFLOW_PACKAGE_IDENTITY_INVALID");
    }
    const bytes = await archive(directory);
    const name = `workflow-package-${identity.name}-${identity.version}.tar.gz`;
    await writeFile(path.join(destination, name), bytes);
    artifacts.push({ name, bytes: bytes.byteLength, sha256: sha256(bytes), package: {
      name: identity.name, version: identity.version, digest: identity.digest,
    } });
  }
  const manifest = { schemaVersion: "wsr.workflow-assets-release@1.0.0", revision, artifacts };
  await writeFile(path.join(destination, "release-metadata.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return { artifactCount: await verifyWorkflowAssets(destination), artifacts };
}

async function verifyWorkflowAssets(destination) {
  let manifest;
  try { manifest = JSON.parse(await readFile(path.join(destination, "release-metadata.json"))); }
  catch (error) { throw new ReleaseError("RELEASE_METADATA_INVALID", { cause: error }); }
  if (manifest.schemaVersion !== "wsr.workflow-assets-release@1.0.0"
    || !/^[a-f0-9]{40}$/.test(manifest.revision) || !Array.isArray(manifest.artifacts)
    || manifest.artifacts.length !== PACKAGE_DIRECTORIES.length) throw new ReleaseError("RELEASE_METADATA_INVALID");
  for (const artifact of manifest.artifacts) {
    let bytes;
    try { bytes = await readFile(path.join(destination, artifact.name)); }
    catch (error) { throw new ReleaseError("RELEASE_ARTIFACT_SET_INVALID", { cause: error }); }
    if (artifact.bytes !== bytes.byteLength || artifact.sha256 !== sha256(bytes)) {
      throw new ReleaseError("RELEASE_ARTIFACT_DIGEST_MISMATCH");
    }
  }
  return manifest.artifacts.length;
}

async function run(args = process.argv.slice(2)) {
  const [command, value, revision] = args;
  const repository = path.resolve(__dirname, "../..");
  if (command === "config") {
    const config = JSON.parse(await readFile(path.join(repository, "release/config/component.json")));
    assertConfiguration(config);
    return { repository: config.repository, status: "PASS" };
  }
  if (command === "simulate" && value) return { scenario: value, state: simulateLifecycle(value) };
  if (command === "build" && value && revision) return {
    ...(await buildWorkflowAssets(repository, path.resolve(value), revision)), status: "PASS",
  };
  if (command === "verify" && value) return {
    artifactCount: await verifyWorkflowAssets(path.resolve(value)), status: "PASS",
  };
  throw new ReleaseError("RELEASE_CLI_USAGE_INVALID");
}

module.exports = {
  ReleaseError,
  assertConfiguration,
  buildWorkflowAssets,
  simulateLifecycle,
  verifyWorkflowAssets,
};

if (require.main === module) {
  run().then((result) => process.stdout.write(`${JSON.stringify(result)}\n`));
}
