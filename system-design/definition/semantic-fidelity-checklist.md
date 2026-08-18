# System Design Workflow Definition — Semantic Fidelity Checklist

Machine Definition: `workflow-package/system-design/definition/` (7 documents, `agentops.workflow-dsl@0.1.0`). Source of truth: `workflow.md` (§2 Action graph, §4 Action catalog; the mermaid diagram never overrides the catalog). Status: `DESIGN_REFERENCE`, verified by `tools/check-example.cjs` → **PASS**.

## 1. Action catalog (§2 + §4) → `actions.json`

| Action | Purpose preserved | Responsible authority |
| --- | --- | --- |
| SD-01 Intake and Authority Scan | evidence-backed starting context; facts investigated, not converted into questions | role.grilling-facilitator |
| SD-01R Bounded Evidence Research | one derivable fact; return only to recorded requester | role.evidence-scout |
| SD-02 Adaptive Grilling | one question at a time; solution hypotheses as probes only | role.grilling-facilitator |
| SD-03 Confirm and Freeze Brief | Runtime persists wait, validates identity, freezes the Brief | role.grilling-facilitator |
| SD-04 Produce System Design Skeleton | first formal architecture decisions before prose | role.system-designer |
| SD-05 Independent Architecture Direction Review | challenge Skeleton; smells become Findings only with project-specific impact | role.architecture-reviewer |
| SD-06 Resolve Architecture Feasibility | external Spike request/result; never executed inside a Skill | role.system-designer |
| SD-07 Progressive System Design Expansion | single-writer reasoning-order expansion; never mutates frozen Brief | role.system-designer |
| SD-08 Integrate Complete Draft | one coherent Design via formal template | role.system-designer |
| SD-09 Parallel Independent Adversarial Review | three isolated lenses behind the barrier | role.architecture-reviewer (nominal; per-lens roles enforced via validation.review + branch routes) |
| SD-10 Aggregate and Triage Findings | no voting/severity change/finding closure by aggregator | role.finding-aggregator |
| SD-11 Targeted Resolution | one validated Revision Request; Designer cannot close its own Finding | role.system-designer |
| SD-11H Brief/Human Resolution | Brief gap or true direction conflict; six human-decision admission conditions | role.grilling-facilitator |
| SD-12 Close Design Parameters and Classify Handoffs | owner-complete downstream obligations; no design-owned parameter open | role.system-designer |
| SD-13 Fresh Reader Test | context-isolated downstream-implementability read | role.fresh-reader |
| SD-14 Deterministic Final Verification | **runtime authority**; no Agent Role or Skill | runtime (validator.final-verification) |
| SD-15 Freeze, Promote, and Clean | **runtime authority**; freeze/promote/clean gates; no workflow intermediates in Git | runtime (validator.cleanup-gate) |

## 2. Action graph (§2) → `workflow.json` edges/conditionalEdges

| workflow.md branch | Definition |
| --- | --- |
| SD-01 → SD-02 | `edge.sd-01-sd-02` |
| SD-02 → SD-03 (Brief ready) | `edge.sd-02-sd-03` (routing == brief-ready) |
| SD-02 → WAITING_FOR_USER | `wait.user-grilling-answer` (resume SD-02) |
| SD-03 → SD-04 | `edge.sd-03-sd-04` |
| SD-03 → WAITING_FOR_USER (confirm) | `wait.user-brief-confirm` (resume SD-03) |
| SD-04 → SD-05 | `edge.sd-04-sd-05` |
| SD-05 four-way | `cedge.sd-05`: pass→sd-06 / direction-fix→sd-04 / evidence-gap→sd-01r / brief-gap→sd-11h |
| SD-01R return by recorded resume_action | `cedge.sd-01r`: evidence_return_action == SD-05→sd-05, == SD-09→sd-09 |
| SD-06 → SD-07 / SD-04 | `cedge.sd-06`: feasibility-confirmed→sd-07 / invalidates-direction→sd-04 |
| SD-06 → WAITING_FOR_SPIKE | `wait.spike-feasibility` (resume SD-06) |
| SD-07 → SD-08 | `edge.sd-07-sd-08` |
| SD-08 → SD-09 | `edge.sd-08-sd-09` |
| SD-09 → SD-10 | `edge.sd-09-sd-10` (parallel + barrier + aggregator join) |
| SD-10 six-way routing | `cedge.sd-10`: evidence-gap→sd-01r / brief-gap,conflict→sd-11h / skeleton-invalid→sd-04 / draft-fix→sd-11 / disposition-valid→sd-12 |
| SD-11 dynamic return | `cedge.sd-11` by return_action: SD-09 / SD-13 / SD-14; default → `terminal:failed` (fail closed; SD-09 is never the unconditional default) |
| SD-11H | `cedge.sd-11h`: new-brief→sd-03 / direction-invalidated→sd-04 / draft-decision→sd-11 |
| SD-11H → WAITING_FOR_USER (decision dialogue) | `wait.user-decision` (resume SD-11H; resumable-within-admitted-dialogue) |
| SD-12 | `cedge.sd-12`: closed→sd-13 / affects-design→sd-11 |
| SD-12 → WAITING_FOR_SPIKE | `wait.spike-design-parameter` (resume SD-12) |
| SD-13 | `cedge.sd-13`: pass→sd-14 / fresh-reader-finding→sd-11 |
| SD-14 | `cedge.sd-14`: pass→sd-15 / fixable-failure→sd-11 |
| SD-15 → IMPLEMENTATION_READY | `edge.sd-15-ready` (routing == clean) |

## 3. Waits, terminals, budgets, recovery

| Concept | Definition |
| --- | --- |
| WAITING_FOR_USER (3) | `wait.user-grilling-answer` (SD-02), `wait.user-brief-confirm` (SD-03), `wait.user-decision` (SD-11H); one pending decision each; stale/duplicate rejected; expiry is a deterministic policy event, never success or silent cancellation |
| WAITING_FOR_SPIKE (2) | `wait.spike-feasibility` (SD-06), `wait.spike-design-parameter` (SD-12); exact request identity/content digest correlation; mismatched/duplicate results cannot advance |
| Terminals | `implementation-ready` (success), `incomplete`, `cancelled`, `failed`; budget exhaustion / cancellation / non-retryable failure are runtime-enforced terminal transitions |
| Budgets (6) | questions / research / feasibility / review / revision / decision-dialogue; resource `custom` with `resourceName` per dimension + evaluator registration point (schemaRef) invoked by the Runtime; `onExhaustion: incomplete`; no numeric limits in configuration; exhaustion never relaxes a Gate (DSL-S4 revised with DSL-1) |
| Recovery (4) | retry-continue / incomplete-resume / intervene / cleanup-retry; all `noBlindReplay: true`; INCOMPLETE records exact resume Action; FAILED/CANCELLED require a new authorized Delivery |

## 4. Artifacts, sessions, findings, human decision

| workflow.md element | Definition |
| --- | --- |
| Artifact lifecycle (§3) | `artifacts.json` (15 artifacts) with lifecycle states (WORKING → SKELETON_CONFIRMED → DESIGN_REVIEWED → IMPLEMENTATION_READY → SUPERSEDED), storageKind RUN_WORKSPACE/REPOSITORY_DELIVERABLE, dependencyValidity |
| Session rules (§9) | `roles.independence` (3 review roles session-isolated + barrier + sharedRawEvidenceOnly) + `routes.sessionPolicy` (fresh-per-episode / resumable-within-admitted-dialogue) |
| Finding admission (§7) | `validator.finding-admission` + `artifact.review-finding` (findingShape) + `validator.final-verification` (Minor ACCEPTED_MINOR by source lens) |
| Human decision admission (§8, six conditions) | `validator.human-decision-admission` + `wait.user-decision` resumeSchema (Decision Record) |
| Unknown classification (§5) | Brief template topic statuses + `validator.brief-closure-check` (no USER_DECISION_REQUIRED/BLOCKED remains; BLOCKED → recoverable INCOMPLETE) |
| Quality lifecycle (§6) | `validator.parameter-closure` + `validator.downstream-obligation-completeness` + handoffs (semanticOnly) |

## 5. Handoffs

`workflow.json` `handoffs[]` (5, all `semanticOnly: true`): `handoff.contract-prerequisite`, `handoff.implementation-feasibility`, `handoff.implementation-verification`, `handoff.operational-tuning`, `handoff.design-obligation`. These are consumed byte-faithfully by the Implementation Workflow Definition (`workflow-package/implementation/definition/workflow.json` `consumedHandoffs`, referencing package `system-design-workflow@0.3.0`). No downstream Action/Gate/Wait/terminal field appears upstream (semanticOnly enforced by schema).

## 6. Mapping decisions

| ID | Decision |
| --- | --- |
| M1 | **Selectors are all deterministic**: SD has no Planner Agent; SD-05/06/10/11/11H/12/13/14 routing is Runtime evaluation of structured results (`selector.kind: deterministic`). |
| M2 | **Dynamic return targets** (`return_action`, `resume_action`, `resume_lens`) are `state` fields (snake_case per schema pattern) + conditional edges: `cedge.sd-11` by `return_action` (SD-09/SD-13/SD-14, default failed), `cedge.sd-01r` by `evidence_return_action` (SD-05/SD-09). |
| M3 | **SD-14/SD-15 runtime authority**: `responsibleAuthority: {kind: runtime, validator}`; no Agent Role and **no allowedRoutes** (Runtime-authority actions declare no Agent binding; DSL-2 revised). The former `role.runtime-custodian` / `route.runtime.deterministic` placeholders are removed. |
| M4 | **SD-09 parallel barrier**: `execution.mode: parallel`, 3 branches (session-isolated, required), `join {mode: aggregator, aggregatorAction: action.sd-10, barrier: true}`; aggregation rules in `validation.aggregation` (preserve-provenance, arbiter finding-aggregator, prohibited voting/hiding risk/inflating signals/severity change/finding closure). |
| M5 | **Wait/resume correlation**: 3 user + 2 spike waits; resumeAction == triggerAction (each recorded resume_action is its trigger Action); correlation identitySource + stale/duplicate rejection; SD-11H decision dialogue is resumable only within the admitted decision identity and evidence binding. |
| M6 | **Handoff**: 5 `handoffs[]` all semanticOnly; `consumedHandoffs: []` (SD is the upstream producer); ids align with the Implementation Definition's consumed references. |
| M7 | **Lowercase identities**: the meta identity pattern `^[a-z][a-z0-9._-]{0,127}$` admits only lowercase — all ids are lowercase (`action.sd-01`, `node.sd-11h`, `terminal:implementation-ready`); SD names stay in `name`/`meaning` text. |
| M8 | **snake_case state fields** (`return_action`, `evidence_return_action`, `resume_lens`) match the design-time schema naming (revision-request, evidence-research-request). |
| M9 | **Budget evaluator registration point**: per the revised DSL (DSL-1/DSL-S4), each budget declares `resource: custom` + `resourceName` + an `evaluator` schemaRef (script registration point) the Runtime invokes for the budget conclusion; **no numeric limit in configuration**. The former placeholder-limit workaround is removed. |
| M10 | **owned/referenced**: 57 owned resources with real sha256; grilling/codebase-design and model/tool/driver/agent-definition use sourceLocator + schematic sha256 with `use` noting "resolved at Package Snapshot admission; never fabricated". |

## 7. DSL gaps found during migration (feedback to `agentops.workflow-dsl@0.1.x`)

| ID | Gap | Candidate fix |
| --- | --- | --- |
| DSL-S1 (judgment authority) | **REVISED (0.1.x)**: conditional edges gained `judge` — `state` predicates or `planner` (Planner Action semantic judgment over possibly unstructured Agent output); Runtime validates the structured classification, then selects the branch. Judgment belongs to the Agent; branch structure belongs to the Workflow. | resolved by the 0.1.x Contract revision (git history) |
| DSL-S1 (branch subset activation) | **ACCEPTED as known limitation**: SD-09 recheck of only invalidated lenses is Runtime scheduling (an optimization), not workflow semantics; full 3-branch parallel declaration stays. | recorded in spec §18.1 |
| DSL-S2 | **Parallel action with multiple roles** (SD-09's three lenses have distinct roles): DSL `responsibleAuthority` allows a single role → nominal `role.architecture-reviewer` with per-lens roles enforced via `validation.review` + branch routes. | Allow `responsibleAuthority` (or parallel branches) to declare per-branch roles. |
| DSL-S3 | **CLOSED as non-issue**: one wait per trigger Action (resume == trigger) is semantically equivalent to a recorded `resume_action`; dynamic post-resume routing is covered by fixed resume + conditional-edge routing at the resume point. No DSL change. | recorded in spec §18.1 |
| DSL-S4 | ~~Budget "policy limit" must be numeric~~ **REVISED with DSL-1 (0.1.x)**: budgets use resource dimensions + evaluator registration points; no numeric limit in configuration. | resolved by the 0.1.x Contract revision (git history) |

## 8. Verification

- `node system-contracts/workflow-dsl/tools/check-example.cjs workflow-package/system-design/definition` → **PASS**.
- All 7 documents also validate against the 8 normative JSON Schemas (draft-07, `additionalProperties: false`).
- No LangGraph/Driver physical fields (Appendix C scan).
- `composition-conformance.md` `DESIGN_CLOSED` items expressible; exact model/tool/Driver/session identities remain explicit referenced placeholders (IMPLEMENTATION_REQUIRED) — nothing fabricated.
