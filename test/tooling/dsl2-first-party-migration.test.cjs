const assert = require("node:assert/strict");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const test = require("node:test");

const repository = path.resolve(__dirname, "../..");
const packages = [
  { directory: "implementation", name: "implementation-workflow" },
  { directory: "system-design", name: "system-design-workflow" },
];
const documentNames = ["package", "workflow", "actions", "roles", "routes", "artifacts", "validation", "snapshot"];

async function readDefinition(directory, documentName) {
  return JSON.parse(await readFile(path.join(repository, directory, "definition", `${documentName}.json`), "utf8"));
}

for (const packageUnderTest of packages) {
  test(`${packageUnderTest.name}@0.4.5 is a closed Workflow DSL 2.0 package`, async () => {
    const documents = Object.fromEntries(await Promise.all(documentNames.map(async (name) => [
      name,
      await readDefinition(packageUnderTest.directory, name),
    ])));

    for (const [name, document] of Object.entries(documents)) {
      assert.equal(document.schemaVersion, "agentops.workflow-dsl@2.0.0", `${name}.json schemaVersion`);
    }
    assert.equal(documents.package.package.name, packageUnderTest.name);
    assert.equal(documents.package.package.version, "0.4.5");
    assert.equal(documents.package.package.definition.version, "0.4.5");
    assert.deepEqual(documents.package.compatibility, {
      minContractVersion: "2.0.0",
      maxContractVersion: "2.0.0",
    });
    assert.equal(documents.workflow.workflow.version, "0.4.5");
    assert.equal(documents.workflow.workflow.contractVersion, "agentops.workflow-dsl@2.0.0");
    assert.equal(documents.snapshot.snapshot.package.version, "0.4.5");
    assert.equal(documents.snapshot.snapshot.definition.version, "0.4.5");

    const resources = [
      ...documents.package.resources.owned,
      ...documents.package.resources.referenced,
    ];
    assert.deepEqual(
      resources.filter(({ kind }) => kind === "agent-definition" || kind === "model"),
      [],
    );
    for (const route of documents.routes.routes) {
      assert.equal(Object.hasOwn(route, "agent"), false, `${route.id} has no DSL 1.x agent binding`);
      assert.equal(Object.hasOwn(route.resources, "model"), false, `${route.id} has no DSL 1.x model binding`);
      assert.equal(typeof route.resources.rolePrompt?.id, "string", `${route.id} has an exact role prompt`);
      assert.ok(Array.isArray(route.resources.actionPrompts), `${route.id} has action prompt bindings`);
    }

    const resourcesById = new Map(resources.map((resource) => [resource.id, resource]));
    for (const route of documents.routes.routes.filter(({ resources: routeResources }) =>
      routeResources.capabilities.includes("action-interaction"))) {
      const explicitlyPromptedActions = new Set(route.resources.actionPrompts.map(({ action }) => action));
      const fallbackActions = documents.actions.actions.filter(({ id, allowedRoutes = [] }) =>
        allowedRoutes.includes(route.id) && !explicitlyPromptedActions.has(id));
      assert.deepEqual(fallbackActions.map(({ id }) => id), [],
        `${route.id} must bind an explicit Action prompt for every interactive Action`);
      for (const actionPrompt of route.resources.actionPrompts) {
        const resource = resourcesById.get(actionPrompt.prompt.id);
        assert.ok(resource, `${actionPrompt.prompt.id} is declared`);
        const prompt = await readFile(path.resolve(repository, packageUnderTest.directory, "definition", resource.path), "utf8");
        assert.match(prompt, /Chat interaction protocol:[\s\S]*responseSchema\.type = "string"/u,
          `${actionPrompt.prompt.id} must use the DSH Chat string response contract`);
      }
    }

    const roleIds = new Set(documents.roles.roles.map(({ id }) => id));
    const routedRoleIds = new Set(documents.routes.routes.map(({ role }) => role));
    assert.deepEqual([...routedRoleIds].filter((role) => !roleIds.has(role)), []);
    assert.deepEqual([...roleIds].filter((role) => !routedRoleIds.has(role)), []);

    for (const node of documents.workflow.graph.nodes.filter(({ kind }) => kind === "parallel")) {
      for (const branch of node.branches) {
        assert.ok(documents.workflow.dataflow.edges.some((edge) =>
          edge.source.kind === "site-result"
          && edge.source.site?.kind === "parallel-branch"
          && edge.source.site?.nodeIdentity === node.id
          && edge.source.site?.branchIdentity === branch.id
          && edge.source.slot?.kind === "whole"
          && edge.target.kind === "site-input"
          && edge.target.site?.kind === "parallel-join"
          && edge.target.site?.nodeIdentity === node.id),
        `${node.id}/${branch.id} result must bind its aggregator input`);
      }
    }

    if (packageUnderTest.name === "implementation-workflow") {
      assert.ok(documents.workflow.consumedHandoffs.length > 0);
      for (const handoff of documents.workflow.consumedHandoffs) {
        assert.deepEqual(handoff.upstreamHandoff, {
          ...handoff.upstreamHandoff,
          package: "system-design-workflow",
          packageVersion: "0.4.5",
        });
      }
      const selector = documents.workflow.hostOperations.find(({ id }) => id === "operation.IM-06-selection");
      assert.equal(selector?.configuration.accepted, true);
      assert.deepEqual(selector?.configuration.result, {
        goalRungReady: false,
        allGoalsCommitted: true,
        missingContract: false,
        routing: "select-whole",
      });
    } else {
      assert.ok(documents.workflow.dataflow.edges.some((edge) =>
        edge.source.kind === "site-result"
        && edge.source.site?.nodeIdentity === "node.sd-01"
        && edge.source.slot?.kind === "whole"
        && edge.target.kind === "site-input"
        && edge.target.site?.nodeIdentity === "node.sd-02"
        && edge.target.slot?.kind === "property"
        && edge.target.slot.name === "intakeContext"),
      "SD-01 structured result must bind the required SD-02 intakeContext");

      const reviewNode = documents.workflow.graph.nodes.find(({ id }) => id === "node.sd-09");
      assert.deepEqual(reviewNode.selection, { source: { kind: "state", field: "selected_review_lenses" } });
      assert.ok(documents.workflow.dataflow.edges.some((edge) =>
        edge.source.kind === "site-result"
        && edge.source.site?.nodeIdentity === "node.sd-08"
        && edge.source.slot?.name === "selectedReviewLenses"
        && edge.target.kind === "state"
        && edge.target.field === "selected_review_lenses"),
      "SD-08 must select the non-empty initial review lens set before SD-09");
      const requiredBindings = [
        ["node.sd-02", "workingBrief", "node", "node.sd-03", undefined, "workingBrief"],
        ["node.sd-03", "brief", "node", "node.sd-04", undefined, "brief"],
        ["node.sd-03", "brief", "node", "node.sd-05", undefined, "brief"],
        ["node.sd-04", "skeleton", "node", "node.sd-05", undefined, "skeleton"],
        ["node.sd-03", "brief", "node", "node.sd-06", undefined, "brief"],
        ["node.sd-04", "skeleton", "node", "node.sd-06", undefined, "skeleton"],
        ["node.sd-03", "brief", "node", "node.sd-07", undefined, "brief"],
        ["node.sd-04", "skeleton", "node", "node.sd-07", undefined, "skeleton"],
        ["node.sd-03", "brief", "node", "node.sd-08", undefined, "brief"],
        ["node.sd-04", "skeleton", "node", "node.sd-08", undefined, "skeleton"],
        ["node.sd-08", "draft", "parallel-branch", "node.sd-09", "branch.sd-09.problem-solution", "draft"],
        ["node.sd-08", "draft", "parallel-branch", "node.sd-09", "branch.sd-09.architecture", "draft"],
        ["node.sd-08", "draft", "parallel-branch", "node.sd-09", "branch.sd-09.quality-acceptance", "draft"],
        ["node.sd-08", "draft", "node", "node.sd-13", undefined, "candidateDesign"],
        ["node.sd-08", "draft", "node", "node.sd-14", undefined, "candidate"],
      ];
      for (const [producer, sourceProperty, targetKind, targetNode, targetBranch, targetProperty] of requiredBindings) {
        assert.ok(documents.workflow.dataflow.edges.some((edge) =>
          edge.source.kind === "site-result"
          && edge.source.site?.kind === "node"
          && edge.source.site?.nodeIdentity === producer
          && edge.source.slot?.kind === "property"
          && edge.source.slot.name === sourceProperty
          && edge.target.kind === "site-input"
          && edge.target.site?.kind === targetKind
          && edge.target.site?.nodeIdentity === targetNode
          && edge.target.site?.branchIdentity === targetBranch
          && edge.target.slot?.kind === "property"
          && edge.target.slot.name === targetProperty),
        `${producer}.${sourceProperty} must bind ${targetNode}${targetBranch ? `/${targetBranch}` : ""}.${targetProperty}`);
      }
      assert.ok(documents.workflow.dataflow.edges.some((edge) =>
        edge.source.kind === "site-result"
        && edge.source.site?.kind === "parallel-join"
        && edge.source.site?.nodeIdentity === "node.sd-09"
        && edge.source.slot?.kind === "whole"
        && edge.target.kind === "site-input"
        && edge.target.site?.kind === "node"
        && edge.target.site?.nodeIdentity === "node.sd-12"
        && edge.target.slot?.kind === "property"
        && edge.target.slot.name === "reviewDisposition"),
      "SD-09 aggregation must bind the downstream handoff-classification context");
      const actionsById = new Map(documents.actions.actions.map((action) => [action.id, action]));
      const actionByNode = new Map(documents.workflow.graph.nodes
        .filter((node) => typeof node.action === "string")
        .map((node) => [node.id, node.action]));
      for (const edge of documents.workflow.dataflow.edges) {
        if (edge.source.kind !== "site-result" || edge.source.slot?.kind !== "property") continue;
        const action = actionsById.get(actionByNode.get(edge.source.site?.nodeIdentity));
        if (action === undefined) continue;
        assert.ok(action.resultSchema.required?.includes(edge.source.slot.name),
          `${action.id}.${edge.source.slot.name} is projected by dataflow and must be required by its result schema`);
      }
      const operations = new Map(documents.workflow.hostOperations.map((operation) => [operation.id, operation]));
      assert.equal(operations.get("operation.sd-14-deterministic-verification")?.configuration.accepted, true);
      assert.deepEqual(operations.get("operation.sd-14-deterministic-verification")?.configuration.result, {
        status: "PASS", routing: "pass", validatorReport: { mode: "ACCEPT_ALL", issue: 87 },
      });
      assert.equal(operations.get("operation.sd-15-publication-guard")?.configuration.accepted, true);
      assert.deepEqual(operations.get("operation.sd-15-publication-guard")?.configuration.result, {
        status: "CLEAN", routing: "clean", promotedDeliverables: ["system-design.md"],
      });
      const integratePrompt = await readFile(path.join(repository, "system-design", "prompts", "actions", "integrate-draft.prompt.md"), "utf8");
      assert.match(integratePrompt, /write the candidate to `system-design\.md`/u);
    }
  });
}
