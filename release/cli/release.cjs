const { createHash } = require("node:crypto");
const { spawnSync } = require("node:child_process");
const { gzipSync, gunzipSync } = require("node:zlib");
const { access, mkdir, mkdtemp, readFile, readdir, rm, writeFile } = require("node:fs/promises");
const { tmpdir } = require("node:os");
const path = require("node:path");

const CONFIG_KEYS = [
  "schemaVersion", "repository", "releaseBranch", "triggerBranch", "assetMode",
  "acceptanceCommand", "buildCommand", "verifyCommand", "publisherAdapter",
  "remoteInstallMode", "stablePolicy", "capabilities",
];
const PACKAGE_DIRECTORIES = ["hello-world-workflow", "implementation", "system-design"];

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

async function buildWorkflowAssets(repository, destination, revision, contractRevision) {
  if (!/^[a-f0-9]{40}$/.test(revision)) throw new ReleaseError("RELEASE_REVISION_INVALID");
  if (!/^[a-f0-9]{40}$/.test(contractRevision)) throw new ReleaseError("RELEASE_CONTRACT_REVISION_INVALID");
  await mkdir(destination, { recursive: true });
  const packages = [];
  for (const directoryName of PACKAGE_DIRECTORIES) {
    const directory = path.join(repository, directoryName);
    const packageDocument = JSON.parse(await readFile(path.join(directory, "definition/package.json")));
    const identity = packageDocument.package;
    if (!identity || typeof identity.name !== "string" || typeof identity.version !== "string"
      || !/^sha256:[a-f0-9]{64}$/.test(identity.digest)
      || !packageDocument.compatibility
      || typeof packageDocument.compatibility.minContractVersion !== "string"
      || typeof packageDocument.compatibility.maxContractVersion !== "string") {
      throw new ReleaseError("WORKFLOW_PACKAGE_IDENTITY_INVALID");
    }
    const bytes = await archive(directory);
    const archiveName = `workflow-package-${identity.name}-${identity.version}.tar.gz`;
    const descriptorName = `workflow-package-${identity.name}-${identity.version}.json`;
    const checksumName = `${archiveName}.sha256`;
    const provenanceName = `workflow-package-${identity.name}-${identity.version}.provenance.json`;
    const archiveDigest = sha256(bytes);
    const tag = `workflow-package/${identity.name}/v${identity.version}`;
    const provenance = {
      schemaVersion: "workflow-package.provenance@1.0.0",
      subject: { name: archiveName, sha256: archiveDigest },
      source: { repository: "firestige/wsr-workflow-package", revision },
      contract: { repository: "firestige/wsr-contracts", revision: contractRevision },
      builder: { workflow: ".github/workflows/release-candidate.yml" },
    };
    const provenanceBytes = Buffer.from(`${JSON.stringify(provenance, null, 2)}\n`);
    const descriptor = {
      schemaVersion: "workflow-package.package-release@2.0.0",
      tag,
      package: { name: identity.name, version: identity.version, digest: identity.digest },
      archive: { name: archiveName, sha256: archiveDigest, bytes: bytes.byteLength },
      checksum: { name: checksumName },
      provenance: { name: provenanceName, sha256: sha256(provenanceBytes) },
      contract: {
        repository: "firestige/wsr-contracts", revision: contractRevision,
        minVersion: packageDocument.compatibility.minContractVersion,
        maxVersion: packageDocument.compatibility.maxContractVersion,
      },
    };
    const descriptorBytes = Buffer.from(`${JSON.stringify(descriptor, null, 2)}\n`);
    const checksumBytes = Buffer.from(`${archiveDigest.slice(7)}  ${archiveName}\n`);
    await Promise.all([
      writeFile(path.join(destination, archiveName), bytes),
      writeFile(path.join(destination, descriptorName), descriptorBytes),
      writeFile(path.join(destination, checksumName), checksumBytes),
      writeFile(path.join(destination, provenanceName), provenanceBytes),
    ]);
    packages.push({
      tag,
      package: descriptor.package,
      assets: [
        { kind: "archive", name: archiveName, bytes: bytes.byteLength, sha256: archiveDigest },
        { kind: "descriptor", name: descriptorName, bytes: descriptorBytes.byteLength, sha256: sha256(descriptorBytes) },
        { kind: "checksum", name: checksumName, bytes: checksumBytes.byteLength, sha256: sha256(checksumBytes) },
        { kind: "provenance", name: provenanceName, bytes: provenanceBytes.byteLength, sha256: sha256(provenanceBytes) },
      ],
    });
  }
  const manifest = {
    schemaVersion: "wsr.workflow-assets-release@2.0.0",
    repository: "firestige/wsr-workflow-package",
    revision,
    contract: { repository: "firestige/wsr-contracts", revision: contractRevision },
    packages,
  };
  await writeFile(path.join(destination, "release-metadata.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return { artifactCount: await verifyWorkflowAssets(destination), packages };
}

async function verifyWorkflowAssets(destination) {
  let manifest;
  try { manifest = JSON.parse(await readFile(path.join(destination, "release-metadata.json"))); }
  catch (error) { throw new ReleaseError("RELEASE_METADATA_INVALID", { cause: error }); }
  if (manifest.schemaVersion !== "wsr.workflow-assets-release@2.0.0"
    || manifest.repository !== "firestige/wsr-workflow-package"
    || !/^[a-f0-9]{40}$/.test(manifest.revision)
    || manifest.contract?.repository !== "firestige/wsr-contracts"
    || !/^[a-f0-9]{40}$/.test(manifest.contract?.revision)
    || !Array.isArray(manifest.packages) || manifest.packages.length !== PACKAGE_DIRECTORIES.length) {
    throw new ReleaseError("RELEASE_METADATA_INVALID");
  }
  const artifacts = manifest.packages.flatMap((item) => item.assets ?? []);
  if (artifacts.length !== PACKAGE_DIRECTORIES.length * 4
    || new Set(artifacts.map((item) => item.name)).size !== artifacts.length) {
    throw new ReleaseError("RELEASE_METADATA_INVALID");
  }
  const actualFiles = (await readdir(destination)).sort();
  const expectedFiles = ["release-metadata.json", ...artifacts.map((item) => item.name)].sort();
  const acceptedFiles = actualFiles.filter((name) => name !== "release-qualification.json");
  if (acceptedFiles.join("\0") !== expectedFiles.join("\0")
    || actualFiles.filter((name) => name === "release-qualification.json").length > 1) {
    throw new ReleaseError("RELEASE_ARTIFACT_SET_INVALID");
  }
  for (const artifact of artifacts) {
    let bytes;
    try { bytes = await readFile(path.join(destination, artifact.name)); }
    catch (error) { throw new ReleaseError("RELEASE_ARTIFACT_SET_INVALID", { cause: error }); }
    if (artifact.bytes !== bytes.byteLength || artifact.sha256 !== sha256(bytes)) {
      throw new ReleaseError("RELEASE_ARTIFACT_DIGEST_MISMATCH");
    }
  }
  for (const item of manifest.packages) {
    const byKind = Object.fromEntries(item.assets.map((asset) => [asset.kind, asset]));
    if (Object.keys(byKind).sort().join(",") !== "archive,checksum,descriptor,provenance") throw new ReleaseError("RELEASE_METADATA_INVALID");
    const descriptor = JSON.parse(await readFile(path.join(destination, byKind.descriptor.name)));
    const provenance = JSON.parse(await readFile(path.join(destination, byKind.provenance.name)));
    if (descriptor.schemaVersion !== "workflow-package.package-release@2.0.0"
      || descriptor.tag !== item.tag || descriptor.package?.name !== item.package?.name
      || descriptor.package?.version !== item.package?.version || descriptor.package?.digest !== item.package?.digest
      || descriptor.archive?.name !== byKind.archive.name || descriptor.archive?.sha256 !== byKind.archive.sha256
      || descriptor.archive?.bytes !== byKind.archive.bytes || descriptor.checksum?.name !== byKind.checksum.name
      || descriptor.provenance?.name !== byKind.provenance.name || descriptor.provenance?.sha256 !== byKind.provenance.sha256
      || descriptor.contract?.repository !== manifest.contract.repository
      || descriptor.contract?.revision !== manifest.contract.revision
      || provenance.schemaVersion !== "workflow-package.provenance@1.0.0"
      || provenance.subject?.name !== byKind.archive.name || provenance.subject?.sha256 !== byKind.archive.sha256
      || provenance.source?.repository !== manifest.repository || provenance.source?.revision !== manifest.revision
      || provenance.contract?.repository !== manifest.contract.repository
      || provenance.contract?.revision !== manifest.contract.revision) throw new ReleaseError("RELEASE_METADATA_INVALID");
    const checksum = await readFile(path.join(destination, byKind.checksum.name), "utf8");
    if (checksum !== `${byKind.archive.sha256.slice(7)}  ${byKind.archive.name}\n`) throw new ReleaseError("RELEASE_ARTIFACT_DIGEST_MISMATCH");
  }
  return artifacts.length;
}

function tarString(buffer, offset, length) {
  const end = buffer.indexOf(0, offset);
  return buffer.subarray(offset, end === -1 || end > offset + length ? offset + length : end).toString("utf8");
}

function tarNumber(buffer, offset, length) {
  const value = tarString(buffer, offset, length).trim();
  return /^[0-7]+$/.test(value) ? Number.parseInt(value, 8) : Number.NaN;
}

async function extractQualifiedArchive(bytes, destination) {
  let tar;
  try { tar = gunzipSync(bytes, { maxOutputLength: 536_870_912 }); }
  catch (error) { throw new ReleaseError("RELEASE_ARTIFACT_ARCHIVE_INVALID", { cause: error }); }
  let offset = 0;
  let files = 0;
  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    const name = tarString(header, 0, 100);
    const prefix = tarString(header, 345, 155);
    const relative = prefix ? `${prefix}/${name}` : name;
    const size = tarNumber(header, 124, 12);
    const type = header[156];
    if (!Number.isSafeInteger(size) || size < 0 || type !== "0".charCodeAt(0)
      || !relative.startsWith("package/") || relative.includes("\\")
      || relative.split("/").some((part) => part === "" || part === "." || part === "..")) {
      throw new ReleaseError("RELEASE_ARTIFACT_ARCHIVE_INVALID");
    }
    const start = offset + 512;
    const end = start + size;
    if (end > tar.length || ++files > 4096) throw new ReleaseError("RELEASE_ARTIFACT_ARCHIVE_INVALID");
    const target = path.join(destination, ...relative.split("/"));
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, tar.subarray(start, end), { flag: "wx", mode: 0o600 });
    offset = start + Math.ceil(size / 512) * 512;
  }
  if (files === 0) throw new ReleaseError("RELEASE_ARTIFACT_ARCHIVE_INVALID");
}

async function qualifyWorkflowAssets(destination, checkerRoot) {
  const artifactCount = await verifyWorkflowAssets(destination);
  const manifest = JSON.parse(await readFile(path.join(destination, "release-metadata.json")));
  const legacyChecker = path.join(checkerRoot, "tools/check-example.cjs");
  const legacyLayout = await access(legacyChecker).then(() => true, () => false);
  const clean = await mkdtemp(path.join(tmpdir(), "workflow-release-qualification-"));
  try {
    for (const item of manifest.packages) {
      const archiveAsset = item.assets.find((asset) => asset.kind === "archive");
      const packageRoot = path.join(clean, createHash("sha256").update(item.tag).digest("hex"));
      await mkdir(packageRoot, { recursive: true });
      await extractQualifiedArchive(await readFile(path.join(destination, archiveAsset.name)), packageRoot);
      const definition = path.join(packageRoot, "package/definition");
      const packageDocument = JSON.parse(await readFile(path.join(definition, "package.json")));
      const contractDirectory = packageDocument.schemaVersion === "agentops.workflow-dsl@2.0.0"
        ? "workflow-dsl-2-candidate"
        : packageDocument.schemaVersion === "agentops.workflow-dsl@1.1.0" ? "workflow-dsl" : undefined;
      if (contractDirectory === undefined) throw new ReleaseError("RELEASE_CONTRACT_REPLAY_FAILED");
      const checker = legacyLayout ? legacyChecker : path.join(checkerRoot, contractDirectory, ...(contractDirectory === "workflow-dsl-2-candidate" ? ["generated"] : []), "tools/check-example.cjs");
      const checked = spawnSync(process.execPath, [checker, path.join(packageRoot, "package/definition")], {
        encoding: "utf8", shell: false, timeout: 30_000, maxBuffer: 1_048_576,
      });
      if (checked.status !== 0) throw new ReleaseError("RELEASE_CONTRACT_REPLAY_FAILED");
    }
    return { artifactCount, packageCount: manifest.packages.length };
  } finally { await rm(clean, { recursive: true, force: true }); }
}

async function run(args = process.argv.slice(2)) {
  const [command, value, revision, contractRevision] = args;
  const repository = path.resolve(__dirname, "../..");
  if (command === "config") {
    const config = JSON.parse(await readFile(path.join(repository, "release/config/component.json")));
    assertConfiguration(config);
    return { repository: config.repository, status: "PASS" };
  }
  if (command === "simulate" && value) return { scenario: value, state: simulateLifecycle(value) };
  if (command === "build" && value && revision && contractRevision) return {
    ...(await buildWorkflowAssets(repository, path.resolve(value), revision, contractRevision)), status: "PASS",
  };
  if (command === "verify" && value) return {
    artifactCount: await verifyWorkflowAssets(path.resolve(value)), status: "PASS",
  };
  if (command === "qualify" && value && revision) return {
    ...(await qualifyWorkflowAssets(path.resolve(value), path.resolve(revision))), status: "PASS",
  };
  throw new ReleaseError("RELEASE_CLI_USAGE_INVALID");
}

module.exports = {
  ReleaseError,
  assertConfiguration,
  buildWorkflowAssets,
  qualifyWorkflowAssets,
  simulateLifecycle,
  verifyWorkflowAssets,
};

if (require.main === module) {
  run().then((result) => process.stdout.write(`${JSON.stringify(result)}\n`));
}
