#!/usr/bin/env node
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const rawDigest = relative => `sha256:${crypto.createHash("sha256").update(fs.readFileSync(path.join(root, relative))).digest("hex")}`;
const canonicalize = value => {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("canonical JSON rejects non-finite numbers");
    return Object.is(value, -0) ? "0" : JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
};
const canonicalDigest = value => `sha256:${crypto.createHash("sha256").update(canonicalize(value)).digest("hex")}`;
const referenced = (id, kind, repository, resourcePath, fill, use) => ({
  id, kind, owner: "referenced",
  sourceLocator: { repository, path: resourcePath },
  contentIdentity: `sha256:${fill.repeat(64)}`,
  use,
});
const owned = [
  ["resource.role-prompt.greeter", "role-prompt", "../roles/greeter.role.md", "Greeter Role authority"],
  ["resource.prompt.greet", "action-prompt", "../prompts/actions/greet.prompt.md", "action.greet mission"],
  ["resource.package-readme", "documentation", "../README.md", "Package reference"],
  ["resource.workflow-source", "documentation", "../workflow.md", "Workflow semantic source"],
].map(([id, kind, resourcePath, use]) => ({
  id, kind, owner: "owned", path: resourcePath, contentIdentity: rawDigest(resourcePath), use,
}));
const documents = {
  workflow: "workflow.json",
  actions: "actions.json",
  roles: "roles.json",
  routes: "routes.json",
  artifacts: "artifacts.json",
  validation: "validation.json",
};
const resources = {
  owned,
  referenced: [
    referenced("resource.agent-definition.managed", "agent-definition", "workflow-self-recursive", "agents/managed-agent-definition.yaml", "a", "Managed agent projection"),
    referenced("resource.model.managed", "model", "workflow-self-recursive", "bindings/managed-model.yaml", "b", "Configured model binding"),
    referenced("resource.driver.managed-cli", "driver", "workflow-self-recursive", "bindings/managed-cli-driver.yaml", "c", "Managed DSH driver"),
  ],
};
const pkg = {
  kind: "agentops.package",
  schemaVersion: "agentops.workflow-dsl@1.1.0",
  package: {
    name: "hello-world-workflow",
    version: "0.1.0",
    purpose: "Prove current Intake TaskPrompt to configured model to structured success without workspace, Git, environment, secret, or tool authority.",
    status: "CONFIRMED",
    admissibility: "ADMISSIBLE",
    ownership: { owner: "workflow-package maintainers", authoritySource: "repository owner" },
    definition: { name: "hello-world-workflow", version: "0.1.0", contentIdentity: rawDigest(documents.workflow) },
  },
  documents,
  resources,
  authority: {
    order: ["workflow_action", "role_prompt", "action_prompt", "skill", "artifact_user"],
    conflictMode: "fail-closed",
  },
  environmentRequirements: ["managed runtime with structured completion", "configured model binding"],
  compatibility: { minContractVersion: "1.1.0", maxContractVersion: "1.1.0" },
};
pkg.package.digest = canonicalDigest(pkg);
fs.writeFileSync(path.join(root, "package.json"), `${JSON.stringify(pkg, null, 2)}\n`);

const workflow = JSON.parse(fs.readFileSync(path.join(root, documents.workflow), "utf8"));
const actions = JSON.parse(fs.readFileSync(path.join(root, documents.actions), "utf8"));
const routeBindings = actions.actions.flatMap(action => action.allowedRoutes.map(route => ({
  action: action.id, role: action.responsibleAuthority.role, route,
})));
const snapshot = {
  kind: "agentops.workflow-package-snapshot",
  schemaVersion: pkg.schemaVersion,
  snapshot: {
    id: "snapshot.hello-world-workflow.0.1.0",
    package: { name: pkg.package.name, version: pkg.package.version, digest: pkg.package.digest },
    definition: { id: workflow.workflow.id, version: workflow.workflow.version, contentIdentity: pkg.package.definition.contentIdentity },
    documents: Object.entries(documents).map(([kind, file]) => ({ kind, contentIdentity: rawDigest(file) })),
    resources: [...resources.owned, ...resources.referenced].map(({ id, owner, contentIdentity }) => ({ id, owner, contentIdentity })),
    routeBindings,
    graph: {
      nodes: workflow.graph.nodes.map(node => node.id),
      eventEdges: workflow.graph.eventEdges.map(edge => edge.id),
      dataEdges: workflow.dataflow.edges.map(edge => edge.id),
      hostOperations: [],
      terminals: workflow.graph.terminals.map(terminal => terminal.id),
      continuationBindings: ["delivery", "snapshot", "graphNode", "action", "attempt", "inputBindings", "artifactBindings", "branchResults", "budgets", "pendingWait"],
    },
    authority: {
      order: pkg.authority.order,
      mergeProof: canonicalDigest({ authority: pkg.authority, routes: routeBindings, resources: [...resources.owned, ...resources.referenced].map(({ id, owner, contentIdentity }) => ({ id, owner, contentIdentity })) }),
    },
    resolutionProof: { noAmbientFallback: true, allBindingsExact: true },
  },
};
snapshot.snapshot.digest = canonicalDigest(snapshot);
fs.writeFileSync(path.join(root, "snapshot.json"), `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(JSON.stringify({ packageDigest: pkg.package.digest, snapshotDigest: snapshot.snapshot.digest }));
