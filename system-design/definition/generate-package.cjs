#!/usr/bin/env node
// Generates package.json for the System Design Workflow Definition.
// Computes real sha256 digests for every owned resource (path relative to the definition dir).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const sha256 = (p) => 'sha256:' + crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, p))).digest('hex');
const PORTABLE_BINDINGS = ['delivery', 'snapshot', 'graphNode', 'action', 'attempt', 'inputBindings', 'artifactBindings', 'branchResults', 'budgets', 'pendingWait'];
const assertUnicodeScalars = (value) => {
  for (let index = 0; index < value.length; index += 1) {
    const unit = value.charCodeAt(index);
    if (unit >= 0xd800 && unit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) throw new TypeError('canonical JSON strings must contain Unicode scalar values');
      index += 1;
    } else if (unit >= 0xdc00 && unit <= 0xdfff) throw new TypeError('canonical JSON strings must contain Unicode scalar values');
  }
};
const canonicalize = (value) => {
  if (value === null || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'string') {
    assertUnicodeScalars(value);
    return JSON.stringify(value);
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('canonical JSON rejects non-finite numbers');
    return Object.is(value, -0) ? '0' : JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  const keys = Object.keys(value);
  for (const key of keys) assertUnicodeScalars(key);
  return `{${keys.sort().map(key => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
};
const canonicalDigest = (value) => 'sha256:' + crypto.createHash('sha256').update(canonicalize(value)).digest('hex');

// ---- owned resources: [id, kind, relpath, use] ----
const owned = [
  // role prompts
  ['resource.role-prompt.grilling-facilitator', 'role-prompt', '../roles/grilling-facilitator.role.md', 'Grilling Facilitator role authority for intake, adaptive grilling, Brief confirmation and Brief Change Request facilitation'],
  ['resource.role-prompt.evidence-scout', 'role-prompt', '../roles/evidence-scout.role.md', 'Evidence Scout role authority for bounded evidence research'],
  ['resource.role-prompt.system-designer', 'role-prompt', '../roles/system-designer.role.md', 'System Designer role authority for Skeleton, expansion, integration, targeted revision and handoff classification'],
  ['resource.role-prompt.architecture-reviewer', 'role-prompt', '../roles/architecture-reviewer.role.md', 'Architecture Reviewer role authority for the direction review and the architecture review lens'],
  ['resource.role-prompt.problem-solution-reviewer', 'role-prompt', '../roles/problem-solution-reviewer.role.md', 'Problem-Solution Reviewer role authority for the problem-solution review lens'],
  ['resource.role-prompt.quality-reviewer', 'role-prompt', '../roles/quality-reviewer.role.md', 'Quality & Acceptance Reviewer role authority for the quality-acceptance review lens'],
  ['resource.role-prompt.finding-aggregator', 'role-prompt', '../roles/finding-aggregator.role.md', 'Finding Aggregator role authority for aggregation and triage'],
  ['resource.role-prompt.fresh-reader', 'role-prompt', '../roles/fresh-reader.role.md', 'Fresh Reader role authority for the Fresh Reader Test'],
  ['resource.documentation.runtime-custodian', 'documentation', 'resources/runtime-custodian.role.md', 'Deterministic lifecycle boundary for SD-14/SD-15; not an Agent Role and grants no Route authority'],
  // action prompts
  ['resource.prompt.intake-and-authority', 'action-prompt', '../prompts/actions/intake-and-authority.prompt.md', 'action.sd-01 mission'],
  ['resource.prompt.adaptive-grilling', 'action-prompt', '../prompts/actions/adaptive-grilling.prompt.md', 'action.sd-02 mission'],
  ['resource.prompt.evidence-research', 'action-prompt', '../prompts/actions/evidence-research.prompt.md', 'action.sd-01R mission'],
  ['resource.prompt.produce-skeleton', 'action-prompt', '../prompts/actions/produce-skeleton.prompt.md', 'action.sd-04 mission'],
  ['resource.prompt.prepare-spike-request', 'action-prompt', '../prompts/actions/prepare-spike-request.prompt.md', 'action.sd-06 spike request preparation mission'],
  ['resource.prompt.apply-spike-result', 'action-prompt', '../prompts/actions/apply-spike-result.prompt.md', 'action.sd-06 spike result validation/application mission'],
  ['resource.prompt.expand-system-design', 'action-prompt', '../prompts/actions/expand-system-design.prompt.md', 'action.sd-07 mission'],
  ['resource.prompt.integrate-draft', 'action-prompt', '../prompts/actions/integrate-draft.prompt.md', 'action.sd-08 mission'],
  ['resource.prompt.architecture-direction-review', 'action-prompt', '../prompts/actions/architecture-direction-review.prompt.md', 'action.sd-05 mission'],
  ['resource.prompt.architecture-review', 'action-prompt', '../prompts/actions/architecture-review.prompt.md', 'action.sd-09.architecture mission'],
  ['resource.prompt.problem-solution-review', 'action-prompt', '../prompts/actions/problem-solution-review.prompt.md', 'action.sd-09.problem-solution mission'],
  ['resource.prompt.quality-acceptance-review', 'action-prompt', '../prompts/actions/quality-acceptance-review.prompt.md', 'action.sd-09.quality-acceptance mission'],
  ['resource.prompt.aggregate-findings', 'action-prompt', '../prompts/actions/aggregate-findings.prompt.md', 'action.sd-10 mission'],
  ['resource.prompt.targeted-revision', 'action-prompt', '../prompts/actions/targeted-revision.prompt.md', 'action.sd-11 mission'],
  ['resource.prompt.human-decision-dialogue', 'action-prompt', '../prompts/actions/human-decision-dialogue.prompt.md', 'action.sd-11H human decision branch mission'],
  ['resource.prompt.classify-downstream-handoffs', 'action-prompt', '../prompts/actions/classify-downstream-handoffs.prompt.md', 'action.sd-12 mission'],
  ['resource.prompt.fresh-reader-test', 'action-prompt', '../prompts/actions/fresh-reader-test.prompt.md', 'action.sd-13 mission'],
  // skills
  ['resource.skill.system-design-authoring', 'skill', '../skills/system-design-authoring/SKILL.md', 'Bounded authoring method for the System Designer route'],
  ['resource.skill.architecture-review', 'skill', '../skills/architecture-review/SKILL.md', 'Bounded architecture review method for the architecture reviewer routes'],
  ['resource.skill.problem-solution-review', 'skill', '../skills/problem-solution-review/SKILL.md', 'Bounded problem-solution review method for the problem-solution reviewer route'],
  ['resource.skill.quality-acceptance-review', 'skill', '../skills/quality-acceptance-review/SKILL.md', 'Bounded quality-acceptance review method for the quality reviewer route'],
  // templates
  ['resource.template.system-design-brief', 'template', '../templates/system-design-brief.template.md', 'Brief artifact template referenced by artifact.brief'],
  ['resource.template.system-design-skeleton', 'template', '../templates/system-design-skeleton.template.md', 'Skeleton artifact template referenced by artifact.skeleton'],
  ['resource.template.system-design-document', 'template', '../templates/system-design-document.template.md', 'System Design document template referenced by artifact.draft and artifact.final-design'],
  ['resource.template.brief-change-request', 'template', '../templates/brief-change-request.template.md', 'Brief Change Request template for the SD-11H Brief gap path'],
  ['resource.template.evidence-research-request', 'template', '../templates/evidence-research-request.template.md', 'Evidence Research Request template referenced by artifact.evidence-research-request'],
  ['resource.template.spike-request', 'template', '../templates/spike-request.template.md', 'Spike Request template referenced by artifact.spike-request'],
  ['resource.template.spike-result', 'template', '../templates/spike-result.template.md', 'Spike Result template referenced by artifact.spike-result'],
  ['resource.template.human-decision-request', 'template', '../templates/human-decision-request.template.md', 'Human Decision Request template referenced by artifact.human-decision-request'],
  ['resource.template.human-decision-record', 'template', '../templates/human-decision-record.template.md', 'Human Decision Record template referenced by artifact.human-decision-record'],
  // schemas (design-time semantic shapes)
  ['resource.schema.action-result', 'schema', '../schemas/action-result.schema.md', 'Design-time Action result semantic shape; future machine-readable schemas must preserve these semantics'],
  ['resource.schema.review-finding', 'schema', '../schemas/review-finding.schema.md', 'Design-time Finding/REVIEW_SIGNAL semantic shape'],
  ['resource.schema.artifact-dependency', 'schema', '../schemas/artifact-dependency.schema.md', 'Design-time artifact dependency semantics (digest/invalidation)'],
  ['resource.schema.artifact-status', 'schema', '../schemas/artifact-status.schema.md', 'Design-time maturity and dependency-validity states'],
  ['resource.schema.acceptance-trace', 'schema', '../schemas/acceptance-trace.schema.md', 'Design-time acceptance relation semantics'],
  ['resource.schema.revision-request', 'schema', '../schemas/revision-request.schema.md', 'Design-time Revision Request semantics including return_action'],
  ['resource.schema.spike-result', 'schema', '../schemas/spike-result.schema.md', 'Design-time Spike Result semantics'],
  ['resource.schema.reader-question', 'schema', '../schemas/reader-question.schema.md', 'Design-time Fresh Reader question set semantics'],
  ['resource.schema.workflow-control', 'schema', '../schemas/workflow-control.schema.md', 'Design-time durable Wait and terminal result semantics'],
  ['resource.schema.evidence-research-request', 'schema', '../schemas/evidence-research-request.schema.md', 'Design-time Evidence Research Request semantics (resume_action/resume_lens)'],
  ['resource.schema.downstream-obligation', 'schema', '../schemas/downstream-obligation.schema.md', 'Design-time downstream obligation semantics'],
  // validators / conformance / documentation
  ['resource.validators.readme', 'validator', '../validators/README.md', 'Deterministic verification and SD-15 cleanup Gate check definitions'],
  ['resource.conformance.positive', 'conformance', '../conformance/positive/README.md', 'Positive conformance scenario source for validation.conformance'],
  ['resource.conformance.negative', 'conformance', '../conformance/negative/README.md', 'Negative conformance scenario source for validation.conformance'],
  ['resource.conformance.recovery', 'conformance', '../conformance/recovery/README.md', 'Wait/resume/failure/recovery conformance scenario source for validation.conformance'],
  ['resource.workflow-definition-source', 'documentation', '../workflow.md', 'Semantic source of this Definition (workflow.md); every Action/transition/Gate/Wait/terminal translates from it'],
  ['resource.routes-catalog', 'documentation', '../agents/routes.md', 'Design-time route catalog; every route in this Definition binds from it'],
  ['resource.package-readme', 'documentation', '../README.md', 'Package-level design-time reference documentation']
];

// ---- referenced resources: [id, kind, repository, path, identityPattern, use] ----
const referenced = [
  ['resource.skill.grilling', 'skill', 'workflow-package', '.agents/skills/grilling/SKILL.md', 'a',
    'Shared adaptive grilling method used by the facilitator routes; method-only, no control-flow authority; exact content identity resolved by the future Package Snapshot (placeholder, do not fabricate)'],
  ['resource.skill.codebase-design', 'skill', 'workflow-package', '.agents/skills/codebase-design/SKILL.md', 'b',
    'Shared codebase-design method (Module/Interface/Seam/Depth/Leverage/Locality) used when structure is in scope; exact content identity resolved by the future Package Snapshot (placeholder, do not fabricate)'],
  ['resource.driver.managed-cli', 'driver', 'workflow-self-recursive', 'bindings/managed-cli-driver.yaml', 'e',
    'Managed CLI Driver projecting the frozen route, never ambient defaults; exact identity resolved by the future Package Snapshot (placeholder, do not fabricate)'],
  ['resource.tool.repo-read', 'tool', 'workflow-self-recursive', 'tools/repo-read.yaml', 'f',
    'Repository/authorized-source read tool for routes that read repository evidence; exact identity resolved by the future Package Snapshot (placeholder, do not fabricate)'],
  ['budget.evaluator.questions', 'cli', 'system-design-workflow', 'scripts/budget/questions.mjs', 'a',
    'Declared evaluator registration point for budget.questions; implementation is outside this Definition'],
  ['budget.evaluator.research', 'cli', 'system-design-workflow', 'scripts/budget/research.mjs', 'b',
    'Declared evaluator registration point for budget.research; implementation is outside this Definition'],
  ['budget.evaluator.feasibility', 'cli', 'system-design-workflow', 'scripts/budget/feasibility.mjs', 'c',
    'Declared evaluator registration point for budget.feasibility; implementation is outside this Definition'],
  ['budget.evaluator.review', 'cli', 'system-design-workflow', 'scripts/budget/review.mjs', 'd',
    'Declared evaluator registration point for budget.review; implementation is outside this Definition'],
  ['budget.evaluator.revision', 'cli', 'system-design-workflow', 'scripts/budget/revision.mjs', 'e',
    'Declared evaluator registration point for budget.revision; implementation is outside this Definition'],
  ['budget.evaluator.decision-dialogue', 'cli', 'system-design-workflow', 'scripts/budget/decision-dialogue.mjs', 'f',
    'Declared evaluator registration point for budget.decision-dialogue; implementation is outside this Definition']
];

const schematic = (ch) => 'sha256:' + ch.repeat(64);

const ownedRes = owned.map(([id, kind, relpath, use]) => ({
  id, kind, owner: 'owned', path: relpath,
  contentIdentity: sha256(relpath),
  use
}));
const referencedRes = referenced.map(([id, kind, repository, rpath, ch, use]) => ({
  id, kind, owner: 'referenced',
  sourceLocator: { repository, path: rpath },
  contentIdentity: schematic(ch),
  use
}));

const pkg = {
  kind: 'agentops.package',
  schemaVersion: 'agentops.workflow-dsl@2.0.0',
  package: {
    name: 'system-design-workflow',
    version: '0.4.2',
    purpose: 'Turn a short Intake, project authority material and user opinions into an IMPLEMENTATION_READY System Design that states what problem is solved, why the design is shaped this way, and how fitness for the current project is proven; budget exhaustion or missing external authority enters recoverable INCOMPLETE, explicit cancellation enters CANCELLED, and non-retryable failure enters FAILED (none equals success).',
    status: 'DRAFT',
    admissibility: 'DESIGN_REFERENCE',
    ownership: {
      owner: 'repository owner',
      authoritySource: 'team-config configuration authority'
    },
    definition: {
      name: 'system-design-workflow',
      version: '0.4.2',
      contentIdentity: sha256('workflow.json')
    }
  },
  documents: {
    workflow: 'workflow.json',
    actions: 'actions.json',
    roles: 'roles.json',
    routes: 'routes.json',
    artifacts: 'artifacts.json',
    validation: 'validation.json'
  },
  resources: {
    owned: ownedRes,
    referenced: referencedRes
  },
  authority: {
    order: ['workflow_action', 'role_prompt', 'action_prompt', 'skill', 'artifact_user'],
    conflictMode: 'fail-closed'
  },
  environmentRequirements: [
    'git',
    'managed runtime with interrupt/resume and checkpoint correlation',
    'ignored run workspace under tmp/system-design/<run-id>/ or an equivalent Runtime-private ignored location',
    'external Spike Workflow integration for SD-06/SD-12 Spike publication and correlation',
    'deterministic validator CLI for SD-14/SD-15 (checks defined under validators/README.md)'
  ],
  compatibility: {
    minContractVersion: '2.0.0',
    maxContractVersion: '2.0.0'
  }
};

pkg.package.digest = canonicalDigest(pkg);
fs.writeFileSync(path.join(ROOT, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
const workflow = JSON.parse(fs.readFileSync(path.join(ROOT, pkg.documents.workflow), 'utf8'));
const actions = JSON.parse(fs.readFileSync(path.join(ROOT, pkg.documents.actions), 'utf8'));
const documents = Object.entries(pkg.documents).map(([kind, file]) => ({ kind, contentIdentity: sha256(file) }));
const resources = [...pkg.resources.owned, ...pkg.resources.referenced].map(({ id, owner, contentIdentity }) => ({ id, owner, contentIdentity }));
const routeBindings = actions.actions.flatMap(action => (action.allowedRoutes || []).map(route => ({
  action: action.id,
  role: action.responsibleAuthority.role,
  route
})));
const snapshot = {
  kind: 'agentops.workflow-package-snapshot',
  schemaVersion: pkg.schemaVersion,
  snapshot: {
    id: `snapshot.${workflow.workflow.id}.${pkg.package.version}`,
    package: { name: pkg.package.name, version: pkg.package.version, digest: pkg.package.digest },
    definition: { id: workflow.workflow.id, version: workflow.workflow.version, contentIdentity: pkg.package.definition.contentIdentity },
    documents,
    resources,
    routeBindings,
    graph: {
      nodes: workflow.graph.nodes.map(node => node.id),
      eventEdges: workflow.graph.eventEdges.map(edge => edge.id),
      dataEdges: workflow.dataflow.edges.map(edge => edge.id),
      hostOperations: (workflow.hostOperations || []).map(operation => operation.id),
      terminals: workflow.graph.terminals.map(terminal => terminal.id),
      continuationBindings: PORTABLE_BINDINGS
    },
    authority: {
      order: pkg.authority.order,
      mergeProof: canonicalDigest({ authority: pkg.authority, routes: routeBindings, resources })
    },
    resolutionProof: { noAmbientFallback: true, allBindingsExact: true }
  }
};
snapshot.snapshot.digest = canonicalDigest(snapshot);
fs.writeFileSync(path.join(ROOT, 'snapshot.json'), JSON.stringify(snapshot, null, 2) + '\n');
console.log('package.json written; owned resources:', ownedRes.length, 'referenced resources:', referencedRes.length);
console.log('definition contentIdentity:', pkg.package.definition.contentIdentity);
console.log('snapshot.json written:', snapshot.snapshot.digest);
