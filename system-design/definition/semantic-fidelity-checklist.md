# System Design Workflow Definition — Semantic Fidelity Checklist

Machine Definition: `workflow-package/system-design/definition/` (`agentops.workflow-dsl@2.0.0`, Package `0.4.4`). The semantic source remains `workflow.md`; this checklist records the 2.0 structural migration and does not create new Workflow meaning. Status: `DESIGN_REFERENCE`.

## 1. Contract document set

| Document | Current closure |
| --- | --- |
| `package.json` | Exact six-document index, 57 owned and 10 referenced resources, canonical Package digest; Agent/provider selection is repository Role binding authority rather than Package-local agent/model resources |
| `snapshot.json` | Exact Definition, document, resource, Route, graph, authority and resolution bindings with canonical Snapshot digest |
| `workflow.json` | 26 graph nodes, 15 ordinary edges, 68 typed event edges, 4 terminals, 5 Wait declarations, 6 budgets and 4 recovery policies |
| `actions.json` | 19 ordinary Actions; every Agent Action has one Role and Route envelope; SD-14/SD-15 are deterministic Runtime Actions without Agent Routes |
| `roles.json` / `routes.json` | 8 Roles and 9 exact Routes; instruction resources are bound through declared Routes |
| `artifacts.json` | 18 declared Artifact shapes; each review Finding shape is owned by its exact Reviewer Action |
| `validation.json` | 18 validators, one explicit aggregator binding, four isolated review bindings and three executable Contract fixtures |

## 2. SD-09 authority and parallel migration

The former nominal `action.sd-09` no longer exists. `node.sd-09` is the user-visible graph-level parallel node:

| Required branch | Action | Responsible Role | Route |
| --- | --- | --- | --- |
| `branch.sd-09.problem-solution` | `action.sd-09.problem-solution` | `role.problem-solution-reviewer` | `route.reviewer.problem-solution` |
| `branch.sd-09.architecture` | `action.sd-09.architecture` | `role.architecture-reviewer` | `route.reviewer.architecture` |
| `branch.sd-09.quality-acceptance` | `action.sd-09.quality-acceptance` | `role.quality-reviewer` | `route.reviewer.quality` |

The node declares `maxConcurrency: 3` and `join.kind: aggregator` with `action.sd-10`. SD-10 keeps its own Finding Aggregator Role/Route, reads the branch-result map through the join, and supplies the closed routing result. There is no nominal parallel Action, per-branch Role field on the parallel node, optional branch, implicit aggregator, or shared branch State reducer.

## 3. Graph and routing mapping

- Ordinary single-successor transitions remain `graph.edges[]`.
- Every old `field/op/value` conditional surface is represented by a producing Action's top-level closed-enum result and `node.routing.kind: deterministic`.
- Dynamic evidence and revision returns remain finite closed cases; an unmatched value fails closed.
- SD-09 routes directly from the explicit SD-10 aggregator result; the former `node.sd-10` composition hop is unnecessary.
- State fields declare data shapes only. Budget evaluators own accounting; no State field declares `overwrite`, `append`, `merge`, `keepFirst`, writer precedence, or another reducer.

## 4. Wait, continuation and typed events

Each of the five Wait declarations has a graph `wait` node, a bounded `wait-renewal` node for the same logical Wait, recorded continuation with portable checkpoint bindings, and no ordinary outgoing edge. Renewal exhaustion routes through the renewal node's `budget-exhausted` event to the exact incomplete terminal.

Every graph node declares exactly the applicable closed event edges from `budget-exhausted | wait-expired | cancelled | nonretryable-failure | continuation-invalid`. These are portable graph declarations; retry, valid answer resume, crash restore and exact attempt identity remain Runtime-recorded continuation behavior and are not Action targets in the Definition.

## 5. Package and generator closure

`generate-package.cjs`:

- hashes every owned resource, including `resources/runtime-custodian.role.md`;
- classifies that file as deterministic lifecycle-boundary documentation, not an Agent Role prompt;
- emits the canonical Package digest and exact `snapshot.json` bindings;
- produces byte-identical `package.json` and `snapshot.json` on consecutive runs with unchanged inputs.

The runtime-custodian document grants no Role, Route, tool, provider binding, or design authority. SD-14 and SD-15 remain deterministic Actions bound only to their declared validators.

## 6. Executable Contract fixtures

`validation.conformance[]` contains one positive, one negative and one recovery `input + trace + oracle` fixture. They exercise only the Contract's minimal Planner classification and Wait-correlation abstractions; they do not implement Workflow scheduling or production Runtime behavior.

## 7. Verification

```bash
node workflow-package/system-design/definition/generate-package.cjs
node system-contracts/workflow-dsl-2-candidate/generated/tools/check-example.cjs workflow-package/system-design/definition
node --test workflow-package/test/tooling/dsl2-first-party-migration.test.cjs
```

Expected results: generator reconstruction is stable; schema/graph/event/authority/corpus-shape/digest closure passes; the migration guard proves DSL 2.0 versions, removed 1.x bindings and exact Role/Action prompts.
