#!/usr/bin/env node
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORTABLE_BINDINGS = ["delivery", "snapshot", "graphNode", "action", "attempt", "inputBindings", "artifactBindings", "branchResults", "budgets", "pendingWait"];
const read = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), "utf8"));
const write = (relative, value) => fs.writeFileSync(path.join(ROOT, relative), `${JSON.stringify(value, null, 2)}\n`);
const rawDigest = (relative) => `sha256:${crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, relative))).digest("hex")}`;
const assertUnicodeScalars = (value) => {
  for (let index = 0; index < value.length; index += 1) {
    const unit = value.charCodeAt(index);
    if (unit >= 0xd800 && unit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) throw new TypeError("canonical JSON strings must contain Unicode scalar values");
      index += 1;
    } else if (unit >= 0xdc00 && unit <= 0xdfff) throw new TypeError("canonical JSON strings must contain Unicode scalar values");
  }
};
const canonicalize = (value) => {
  if (value === null || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "string") {
    assertUnicodeScalars(value);
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("canonical JSON rejects non-finite numbers");
    return Object.is(value, -0) ? "0" : JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const keys = Object.keys(value);
  for (const key of keys) assertUnicodeScalars(key);
  return `{${keys.sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
};
const canonicalDigest = (value) => `sha256:${crypto.createHash("sha256").update(canonicalize(value)).digest("hex")}`;

const pkg = read("package.json");
const workflow = read(pkg.documents.workflow);
const actions = read(pkg.documents.actions);
pkg.schemaVersion = "agentops.workflow-dsl@2.0.0";
pkg.package.version = "0.4.12";
pkg.package.purpose = "Turns one exact frozen, implementation-authorizing design into a tested, independently reviewed feature-branch candidate via Goal Graph, Test Ladder and evolutionary TDD; machine-readable Definition per agentops.workflow-dsl@2.0.0.";
pkg.package.definition.version = "0.4.12";
pkg.compatibility = { minContractVersion: "2.0.0", maxContractVersion: "2.0.0" };
for (const owner of ["owned", "referenced"]) {
  pkg.resources[owner] = pkg.resources[owner].filter(({ kind }) => kind !== "agent-definition" && kind !== "model");
}
for (const resource of pkg.resources.owned) resource.contentIdentity = rawDigest(resource.path);
pkg.package.definition.contentIdentity = rawDigest(pkg.documents.workflow);
delete pkg.package.digest;
pkg.package.digest = canonicalDigest(pkg);
write("package.json", pkg);

const snapshot = read("snapshot.json");
snapshot.schemaVersion = pkg.schemaVersion;
snapshot.snapshot.id = `snapshot.${workflow.workflow.id}.${pkg.package.version}`;
snapshot.snapshot.package.version = pkg.package.version;
snapshot.snapshot.package.digest = pkg.package.digest;
snapshot.snapshot.definition.version = workflow.workflow.version;
snapshot.snapshot.definition.contentIdentity = pkg.package.definition.contentIdentity;
snapshot.snapshot.documents = Object.entries(pkg.documents).map(([kind, file]) => ({ kind, contentIdentity: rawDigest(file) }));
snapshot.snapshot.resources = [...pkg.resources.owned, ...pkg.resources.referenced].map(({ id, owner, contentIdentity }) => ({ id, owner, contentIdentity }));
snapshot.snapshot.routeBindings = actions.actions.flatMap((action) => (action.allowedRoutes || []).map((route) => ({
  action: action.id,
  role: action.responsibleAuthority.role,
  route,
})));
snapshot.snapshot.authority = {
  order: pkg.authority.order,
  mergeProof: canonicalDigest({
    authority: pkg.authority,
    routes: snapshot.snapshot.routeBindings,
    resources: snapshot.snapshot.resources,
  }),
};
snapshot.snapshot.graph = {
  nodes: workflow.graph.nodes.map((node) => node.id),
  eventEdges: workflow.graph.eventEdges.map((edge) => edge.id),
  dataEdges: workflow.dataflow.edges.map((edge) => edge.id),
  hostOperations: workflow.hostOperations.map((operation) => operation.id),
  terminals: workflow.graph.terminals.map((terminal) => terminal.id),
  continuationBindings: PORTABLE_BINDINGS,
};
delete snapshot.snapshot.digest;
snapshot.snapshot.digest = canonicalDigest(snapshot);
write("snapshot.json", snapshot);
