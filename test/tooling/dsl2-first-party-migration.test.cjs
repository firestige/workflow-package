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
  test(`${packageUnderTest.name}@0.4.2 is a closed Workflow DSL 2.0 package`, async () => {
    const documents = Object.fromEntries(await Promise.all(documentNames.map(async (name) => [
      name,
      await readDefinition(packageUnderTest.directory, name),
    ])));

    for (const [name, document] of Object.entries(documents)) {
      assert.equal(document.schemaVersion, "agentops.workflow-dsl@2.0.0", `${name}.json schemaVersion`);
    }
    assert.equal(documents.package.package.name, packageUnderTest.name);
    assert.equal(documents.package.package.version, "0.4.2");
    assert.equal(documents.package.package.definition.version, "0.4.2");
    assert.deepEqual(documents.package.compatibility, {
      minContractVersion: "2.0.0",
      maxContractVersion: "2.0.0",
    });
    assert.equal(documents.workflow.workflow.version, "0.4.2");
    assert.equal(documents.workflow.workflow.contractVersion, "agentops.workflow-dsl@2.0.0");
    assert.equal(documents.snapshot.snapshot.package.version, "0.4.2");
    assert.equal(documents.snapshot.snapshot.definition.version, "0.4.2");

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
      if (fallbackActions.length > 0) {
        const rolePromptResource = resourcesById.get(route.resources.rolePrompt.id);
        assert.ok(rolePromptResource, `${route.resources.rolePrompt.id} is declared`);
        const rolePrompt = await readFile(path.resolve(
          repository,
          packageUnderTest.directory,
          "definition",
          rolePromptResource.path,
        ), "utf8");
        assert.match(rolePrompt, /Chat interaction protocol:[\s\S]*responseSchema\.type = "string"/u,
          `${route.resources.rolePrompt.id} must preserve the DSH Chat string contract for fallback Actions: ${fallbackActions.map(({ id }) => id).join(", ")}`);
      }
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

    if (packageUnderTest.name === "implementation-workflow") {
      assert.ok(documents.workflow.consumedHandoffs.length > 0);
      for (const handoff of documents.workflow.consumedHandoffs) {
        assert.deepEqual(handoff.upstreamHandoff, {
          ...handoff.upstreamHandoff,
          package: "system-design-workflow",
          packageVersion: "0.4.2",
        });
      }
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
    }
  });
}
