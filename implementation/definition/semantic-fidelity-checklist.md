# Implementation Workflow Definition — Semantic Fidelity Checklist

Machine Definition: `workflow-package/implementation/definition/` (7 documents, `agentops.workflow-dsl@1.0.0`). Source of truth: `workflow.md` (transition authority §3; the diagram in `execution-guide.md` never overrides it). Status: `DESIGN_REFERENCE`, verified by `tools/check-example.cjs` → **PASS**.

## 1. Action catalog (§4 of workflow.md) → `actions.json`

| Action | Purpose preserved | Responsible authority | Gate validators |
| --- | --- | --- | --- |
| IM-01 Intake and Authority Scan | binds exact design identity, authority order, scope, obligation classification | role.goal-facilitator | intake-checks |
| IM-01R Bounded Evidence Research | one fact, return to recorded Action only | role.evidence-scout | intake-checks |
| IM-02 Implementation Preflight | clean baseline, harness binding, Contract availability facts | role.delivery-custodian | preflight-checks, cli-checks |
| IM-02V Implementation Feasibility Validation | version/SDK/substrate probes, no repo deliverables | role.implementation-feasibility-validator | feasibility-checks |
| IM-03 Adaptive Grilling and Goal Classification | one decision at a time, facts first, classified blockers | role.goal-facilitator | grilling-checks |
| IM-04 Confirm and Freeze Goal Graph | human confirms; executor persists | role.goal-facilitator | goal-graph-checks |
| IM-05 Activate Feature Branch | clean baseline, no auto-stash/reset/merge | role.delivery-custodian | branch-checks, cli-checks |
| IM-06 Select Ready Goal and Rung | deterministic selector order (Harness → Skeleton → topological) | **runtime** (selection-checks) | selection-checks |
| IM-07 Materialize and Calibrate Tests | discriminating proof required | role.test-designer | calibration-checks, writer-policy |
| IM-08 Evolve Prototype to Green | smallest change; no test/writer-policy edits | role.implementer | evolve-checks, writer-policy |
| IM-09 Close Structural Coverage | 100% branch coverage + assertions; no regression | role.test-designer | coverage-checks, writer-policy |
| IM-10 Bounded Refactor and Hardening | no speculative abstraction; NO_REFACTOR_NEEDED valid | role.implementer | refactor-checks, writer-policy |
| IM-11 Verify Rung | one Git baseline; no random rerun | role.delivery-custodian | rung-verify, cli-checks |
| IM-12 Independent Goal Review | two isolated lenses, barrier | role.goal-adversary (parallel) | review-isolation |
| IM-13 Aggregate and Route Findings | no voting/severity/finding closure by aggregator | role.finding-aggregator | aggregation-rules |
| IM-14T / IM-14I Targeted Resolution | strictly within frozen Goal; test-side vs implementation-side | role.test-designer / role.implementer | resolution-checks, writer-policy |
| IM-15 Independent Recheck | only source lens closes; scope/return recorded | role.goal-adversary | recheck-checks |
| IM-16 Verify and Commit Goal | explicit approved paths only | role.delivery-custodian | goal-commit-checks, cli-checks |
| IM-17 Whole-scope Regression and Review | both lenses + custodian CLI, no partial success | role.goal-adversary (parallel 3) | whole-scope-checks |
| IM-18 Freeze Candidate and Clean | terminal Gate; no push/PR/merge/deploy | role.delivery-custodian | final-checks, cli-checks |

## 2. Transition authority (§3 table, 43 rows) → `workflow.json` edges/terminals/waits

| workflow.md row (condition → successor) | Definition edge/terminal/wait |
| --- | --- |
| IM-01: authority, exact design identity, working Obligation Register bound → IM-02 | `e.intake.preflight` (allOf 3 conditions) |
| IM-01 / any fact-consuming Action: derivable fact missing → IM-01R, then recorded requesting Action | `e.intake.research`; IM-01R return via `returnAction` state + `e.research.intake` / `e.research.grilling` |
| IM-02: Preflight passed + feasibility obligations exist → IM-02V | `e.preflight.feasibility` (feasibilityObligations gt 0) |
| IM-02: Preflight passed + no feasibility obligation → IM-03 | `e.preflight.grilling` (eq 0) |
| IM-02V: all feasibility obligations calibrated → IM-03 | `e.feasibility.grilling` |
| IM-02V: conclusive result pending with new diagnostic progress → IM-02V | `e.feasibility.self` (self-loop) |
| IM-02V: external authority unavailable → WAITING_FOR_EXTERNAL, then IM-02V | `wait.external-authority` (resumeAction IM-02V) |
| IM-02V: result crosses design-reopen → stop Delivery, new design required | `e.feasibility.reopen` → `terminal:DESIGN_REOPEN` (custom) |
| IM-03: one measurement/intent answer → WAITING_FOR_USER, then IM-03 | `wait.user-measurement` (resumeAction IM-03) |
| IM-03: all candidates classified → IM-04 | `e.grilling.confirm` |
| IM-04: confirmation/correction required → WAITING_FOR_USER or IM-03 | `wait.user-confirm` (resume IM-04); `e.confirm.grilling` |
| IM-04: Goal Graph confirmed and frozen → IM-05 | `e.confirm.branch` |
| IM-05: branch activated from clean baseline → IM-06 | `e.branch.select` |
| IM-06: one Goal/rung ready → IM-07 | `e.select.calibrate` |
| IM-06: selected Goal needs missing Contract → WAITING_FOR_EXTERNAL, then IM-03 | `wait.external-coordination` (resumeAction IM-03) |
| IM-06: all in-scope Goals committed → IM-17 | `e.select.whole` |
| IM-07: calibrated RED or discriminating existing-GREEN → IM-08 | `e.calibrate.evolve` |
| IM-07: feedback reveals Goal/Oracle ambiguity → IM-03 | `e.calibrate.grilling` |
| IM-08: still expected RED with progress → IM-08 | `e.evolve.self` (self-loop) |
| IM-08: current rung GREEN → IM-09 | `e.evolve.close` |
| IM-09: branch test introduces expected RED → IM-08 | `e.close.evolve` |
| IM-09: applicable branches closed → IM-10 | `e.close.refactor` |
| IM-10: regression introduced → IM-08 | `e.refactor.evolve` |
| IM-10: GREEN or NO_REFACTOR_NEEDED → IM-11 | `e.refactor.verify` |
| IM-11: another rung remains → IM-07 | `e.verify.calibrate` |
| IM-11: complete Test Ladder verified → IM-12 | `e.verify.review` |
| IM-11: invalid feedback or exact prior-stage failure → recorded owning Action | `e.verify.return07/08/09/10` via `returnAction` state (dynamic return) |
| IM-12: both isolated reviews reach barrier → IM-13 | `e.review.aggregate` |
| IM-13: no Goal-scope Finding → IM-16 | `e.aggregate.commit` (finding == none) |
| IM-13: test-side / implementation-side Finding → IM-14T / IM-14I | `e.aggregate.resolveTest` / `e.aggregate.resolveImpl` |
| IM-14T / IM-14I: treatment recorded → IM-15 | `e.resolveTest.recheck` / `e.resolveImpl.recheck` (unconditional) |
| IM-15: Finding remains open → IM-13 | `e.recheck.aggregate` |
| IM-15: Goal-scope Finding closed → IM-16 | `e.recheck.commit` |
| IM-15: whole-scope Finding closed → IM-17 | `e.recheck.whole` |
| IM-16: verified Goal committed → IM-06 | `e.commit.select` |
| IM-17: whole-scope Finding admitted → IM-13 | `e.whole.aggregate` |
| IM-17: regression and both reviews pass → IM-18 | `e.whole.final` |
| IM-18: terminal Gate passes → VERIFIED_IMPLEMENTATION_READY | `e.final.success` → `terminal:VERIFIED_IMPLEMENTATION_READY` |
| Any active Action: budget exhaustion → INCOMPLETE | runtime-enforced → `terminal:INCOMPLETE` (not an edge; see mapping decision M4) |
| Any active Action: explicit cancellation → CANCELLED | runtime-enforced → `terminal:CANCELLED` |
| Any active Action: non-retryable failure → FAILED | runtime-enforced → `terminal:FAILED` |

## 3. Loops, waits, terminals, budget, recovery

| Concept | Definition |
| --- | --- |
| Goal Loop (IM-06…IM-16) | cycle `node.IM-06 → … → node.IM-16 → node.IM-06`; not a nested Workflow |
| Test Ladder Loop (IM-07…IM-11) | cycle `IM-07 → 08 → 09 → 10 → 11 → IM-07` (+ dynamic returns via `returnAction`) |
| WAITING_FOR_USER | `wait.user-measurement` (IM-03), `wait.user-confirm` (IM-04); one decision per wait, stale/duplicate rejected |
| WAITING_FOR_EXTERNAL | `wait.external-coordination` (IM-06 → resume IM-03), `wait.external-authority` (IM-02V → resume IM-02V) |
| Terminals | `VERIFIED_IMPLEMENTATION_READY` (success), `INCOMPLETE` (incomplete), `CANCELLED` (cancelled), `FAILED` (failure), `DESIGN_REOPEN` (custom) |
| Budget | `budget.attempts` (resource custom/attempts) with an **evaluator registration point** (schemaRef) the Runtime invokes for the budget conclusion; no numeric limit in configuration; exhaustion → `terminal:INCOMPLETE`; never relaxes a Gate (see M4, DSL-1 revised) |
| Recovery | `recovery.default` (continue when known), `recovery.incomplete-resume` (restartFromSavepoint), `recovery.intervene` (unknown); all `noBlindReplay` |
| Design-semantic change | stops Delivery → `terminal:DESIGN_REOPEN`; no local authority substitution |

## 4. Writer boundary, roles/routes, artifacts, handoffs

| workflow.md element | Definition |
| --- | --- |
| Test Designer owns formal tests; Implementer owns production code | `role.test-designer` / `role.implementer` writePermissions + `validator.writer-policy` on IM-07/08/09/10/14T/14I |
| CLI compares Action-start baseline with staged/unstaged/renamed/deleted/untracked | `validator.writer-policy` + `validator.cli-checks` |
| Roles and routes (routes.md, 10 routes) | `roles.json` (9 roles) + `routes.json` (10 routes with rolePrompt/actionPrompts/skills/model/tools/driver/sessionPolicy/access) |
| Review isolation (IM-12, IM-17) | `execution.mode: parallel` + `isolation: session-isolated` + `join.barrier` + `validation.review` |
| Aggregation authority (IM-13) | `validation.aggregation` (preserve-provenance/no-voting, arbiter finding-aggregator) |
| Artifact lifecycle (artifact-lifecycle.md) | `artifacts.json` (13 artifacts: obligation register, context snapshot, goal graph, goal packet, ladder, harness binding, feasibility evidence, test feedback, review result, finding, coordination request, goal candidate, final candidate) with lifecycle states, retention class, producedBy/consumedBy |
| Upstream obligation classification (§2) | `workflow.json` `consumedHandoffs` (4 classes, byte-faithful semanticDependency/reopenCondition, mustNotWeaken) |
| Output handoff | `handoff.verified-candidate` (semanticOnly: domain semantics + invalidation conditions only) |

## 5. Mapping decisions (natural language → structured fields)

| ID | Decision |
| --- | --- |
| M1 | **Dynamic return targets** ("recorded requesting Action", "recorded owning Action") are expressed as `state.returnAction` (reducer overwrite) + conditional edges per possible target. The graph stays static; the predicate selects the target. |
| M2 | **IM-06 deterministic selector** is a pure Runtime action (`responsibleAuthority: {kind: runtime, validator: selection-checks}`); no Planner Agent and **no allowedRoutes** (Runtime-authority actions declare no Agent binding; DSL-2 revised). |
| M3 | **Waits are not graph nodes**: `WAITING_FOR_USER` / `WAITING_FOR_EXTERNAL` are `waits[]` entries bound by `waitPolicy`; edges never point at waits. Resume Action is exact and may differ from the trigger Action (IM-06 → resume IM-03). |
| M4 | **Budget exhaustion / cancellation / non-retryable failure / design-reopen** are runtime-enforced terminal transitions, not edges (workflow.md "Any active Action may enter…"), matching DSL §6.4. Budget declares `budget.attempts` (custom dimension attempts) with an evaluator registration point; the numeric limit is project/runtime policy bound at admission, never configured (DSL-1 revised). |
| M5 | **IM-12/IM-17 parallel reviews** use `execution.mode: parallel` with `join.barrier`; IM-17 adds a third (custodian CLI) branch with `isolation: shared`. |
| M6 | **Gates are deterministic validators**: CLI checks, writer policy, coverage, calibration and disposition rules are referenced as content-addressed validators; Agent free text cannot satisfy them (`freeTextBypass: prohibited`). |
| M7 | **Contract availability / missing Contract** is a wait (external), not a hard failure: only dependent Goals block (M3 + consumedHandoffs). |
| M8 | **Terminal validation** references `validator.final-checks`; terminal settlement follows the checkpointed terminal-proposal path (proposalCheckpoint: true). |
| M9 | **`design-reopen` "stops the current Delivery"** maps to a custom terminal (`DESIGN_REOPEN`) because every stop point in a machine Definition is a terminal; it is never success/incomplete/cancelled. |

## 6. DSL gaps found during migration (feedback to `agentops.workflow-dsl@0.1.x`)

| ID | Gap | Candidate fix |
| --- | --- | --- |
| DSL-1 | ~~`budget.limit` is a required number~~ **REVISED (0.1.x)**: budgets now use resource dimensions (`time|tokens|context|custom`) + an evaluator registration point (schemaRef) invoked by the Runtime; no numeric limit in configuration. `budget.attempts` added back. | resolved by the 0.1.x Contract revision (git history) |
| DSL-2 | ~~Runtime actions still require `allowedRoutes` minItems 1~~ **REVISED (0.1.x)**: Runtime-authority actions declare no `allowedRoutes`; IM-06 no longer binds a placeholder route. | resolved by the 0.1.x Contract revision (git history) |

## 7. Verification

- `node system-contracts/workflow-dsl/tools/check-example.cjs workflow-package/implementation/definition` → **PASS** (JSON, references, closed vocabularies, `allowedSuccessors` == graph out-edges for all 21 actions, 93 owned digests match, no LangGraph/Driver physical fields).
- No LangGraph physical fields present (Appendix C scan).
- `composition-conformance.md` `DESIGN_CLOSED` items 1–13 are all expressible; `IMPLEMENTATION_REQUIRED` items (exact model/tool/Driver/session identities) remain explicit referenced placeholders resolved at Package Snapshot admission — nothing fabricated.
