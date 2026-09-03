# Implementation Workflow Definition — Semantic Fidelity Checklist

Machine Definition: `workflow-package/implementation/definition/` (`agentops.workflow-dsl@2.0.0`, Package `0.4.3`). The semantic source remains `workflow.md`; this checklist records the 2.0 structural migration and does not create new Workflow meaning. Status: `DESIGN_REFERENCE`.

## 1. Contract document set

| Document | Current closure |
| --- | --- |
| `package.json` | Exact six-document index, 85 owned and 4 referenced resources, canonical Package digest; Agent/provider selection is repository Role binding authority rather than Package-local agent/model resources |
| `snapshot.json` | Exact Definition, document, resource, Route, graph/data/Host-operation, authority and resolution bindings with canonical Snapshot digest |
| `workflow.json` | 30 graph nodes, 13 ordinary edges, 90 typed event edges, 3 explicit data edges, one deterministic Host operation, 5 terminals, 4 Wait declarations, one budget and 3 recovery policies |
| `actions.json` | 25 ordinary Actions; every Agent Action has one Role/Route envelope and IM-06 is deterministic with no Agent Route |
| `roles.json` / `routes.json` | 9 Roles and 10 exact Routes；旧 per-episode session 映射为 `episode` scope，Implementer 的旧 continuous-within-goal session 映射为以 `currentGoal` 为 source 的 `data-bound` scope；全部 Agent Route 显式声明 structured completion capability |
| `artifacts.json` | 17 Artifact shapes; each review Finding shape is owned by its exact Reviewer Action |
| `validation.json` | 21 validators, two explicit aggregator bindings, five isolated review bindings and three executable Contract fixtures |

## 2. Parallel review migration

The nominal parallel Actions no longer exist. Their graph identities remain portable parallel nodes whose required branches reference ordinary Actions:

| Parallel node | Required branch Actions | Join |
| --- | --- | --- |
| `node.IM-12` | `action.IM-12.blackbox`, `action.IM-12.whitebox` | explicit `action.IM-13` aggregator |
| `node.IM-17` | `action.IM-17.blackbox`, `action.IM-17.whitebox`, `action.IM-17.custodian` | explicit `action.IM-13` aggregator |

Each branch Action has exactly one responsible Role and one matching Route. The Finding Aggregator retains its own `role.finding-aggregator` authority. The parallel nodes have no Role, nominal authority, shared State writes, optional branches, implicit Agent, or separate barrier node.

IM-15 was also split into `action.IM-15.blackbox` and `action.IM-15.whitebox`, because the source-lens recheck cannot bind two different Reviewer Roles to one Agent Action. Test-side and implementation-side resolution edges enter the corresponding recheck node; both retain the original finite post-recheck outcomes.

## 3. Graph and routing mapping

- Ordinary unconditional transitions remain `graph.edges[]`.
- Former compound predicates and JSON-path tests are replaced by a producing deterministic Action's top-level closed-enum `routing` result.
- `node.IM-12`, `node.IM-17`, and the reusable `node.IM-13` route from the explicit IM-13 aggregator's closed `finding` result.
- Finite return choices fail closed on an unmatched enum value; no Definition field selects a Runtime invocation or attempt.
- State fields declare data shapes only. `attempts` is an observed value used by the declared budget evaluator, not a shared-write reducer declaration.
- IM-06 remains the only deterministic Action with no Agent Route. It binds `operation.IM-06-selection` and writes its exact selected Goal/Rung into `currentGoal`/`currentRung`; that declared State source scopes the Implementer session without ambient affinity.

## 4. Wait, continuation and typed events

Each of the four Wait declarations has a graph `wait` node, a bounded `wait-renewal` node for the same logical Wait, recorded continuation with portable checkpoint bindings, and no ordinary outgoing edge. Closed routing values enter the relevant Wait node for IM-02V, IM-03, IM-04, or IM-06.

All graph nodes declare exactly their applicable typed event edges. Budget exhaustion routes to exact `INCOMPLETE`; cancellation and nonretryable failure route to exact terminals; Wait expiry enters the same logical Wait's renewal node; continuation invalidity fails closed. Runtime-recorded continuation, not a `resumeAction`/`restartAction` field, controls retry, valid resume and restore.

## 5. Authority, Artifact and handoff closure

- Route action-prompt bindings use the split reviewer/recheck Action identities.
- Artifact producer/consumer references and validation review bindings resolve only to declared Actions.
- `validation.aggregation[]` binds `node.IM-12` and `node.IM-17` to the explicit `action.IM-13` join.
- Consumed handoff `affectedLocal` identities use the split IM-17 Action identities; no deleted nominal Action remains as a machine reference.
- `DESIGN_REOPEN` remains an explicit custom terminal and never aliases success, incomplete, cancellation, or failure.

## 6. Executable Contract fixtures

`validation.conformance[]` contains one positive, one negative and one recovery `input + trace + oracle` fixture. They exercise only minimal Planner classification and Wait correlation needed to validate the Contract corpus; they do not execute the Implementation Workflow or its TDD lifecycle.

## 7. Verification

```bash
node system-contracts/workflow-dsl-2-candidate/generated/tools/check-example.cjs workflow-package/implementation/definition
node --test workflow-package/test/tooling/dsl2-first-party-migration.test.cjs
```

Expected results: schema/graph/event/authority/corpus-shape/digest closure passes; the migration guard proves DSL 2.0 versions, removed 1.x bindings, exact Role/Action prompts and the System Design 0.4.3 handoff coordinate.
