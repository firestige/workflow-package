# Implementation Agent Route Catalog

This catalog defines design-time route bindings. Exact model, Agent, Driver and tool identities are resolved into a future Workflow Package Snapshot. The authority order is Workflow/Action → Role Prompt → Action Prompt → Skill → Artifact/user data.

| Route | Role | Actions | Skills | Access/session |
| --- | --- | --- | --- | --- |
| `goal.facilitator` | Goal Facilitator | IM-01, IM-03, IM-04 | referenced `grilling`; owned `implementation-goal-classification` | repository/design read; ignored Goal artifact write; fresh per grilling/revision episode |
| `evidence.scout` | Evidence Scout | IM-01R | none | admitted sources read-only; fresh per request |
| `feasibility.validator` | Implementation Feasibility Validator | IM-02V | `implementation-feasibility-validation` | authoritative sources read; exact Harness command execution; ignored probe/evidence write only; fresh per validation set |
| `test.designer.blackbox` | Test Designer | IM-07, IM-14T | `acceptance-test-design` | Goal/Contract read; formal test/fixture write; implementation hidden for IM-07; fresh per rung |
| `test.designer.structural` | Test Designer | IM-09, IM-14T | `structural-test-coverage` | code/coverage read; formal test/fixture write; fresh per structural pass |
| `implementation.standard` | Implementer | IM-08, IM-10, IM-14I | `evolutionary-tdd-implementation` | production paths write; formal tests/config protected; continuous within Goal, fresh across Goals |
| `review.goal-blackbox` | Goal Adversary | IM-12 black-box, IM-15, IM-17 black-box | `black-box-goal-adversary` | Goal/Contract/test read; implementation hidden on first pass; Finding write; fresh and isolated |
| `review.implementation-whitebox` | Implementation Reviewer | IM-12 white-box, IM-15, IM-17 white-box | `white-box-implementation-review` | candidate/diff/coverage read-only; Finding write; fresh and isolated |
| `finding.aggregate` | Finding Aggregator | IM-13 | none | review artifacts read; aggregation write; fresh |
| `delivery.custodian` | Delivery Custodian | IM-02, IM-05, IM-11, IM-16, IM-17 deterministic portion, IM-18 | `implementation-delivery-custody` | declared CLI only; no source/test authoring; fresh per custody Action |

## Route Invariants

- No ambient/default Agent or tool substitution.
- Feasibility validation cannot write repository deliverables, formal tests/Harness or System Design content.
- Test Designer and Implementer writer families never overlap.
- Goal Adversary cannot inspect implementation before its initial counterexample result is frozen.
- Independent reviewers cannot see each other's analysis until the IM-12 barrier closes.
- Custodian cannot waive CLI failure or choose commit paths outside the approved Goal manifest.
- A bounded Subagent inherits the exact parent route/Action/Goal authority and cannot launch a Workflow.
- Route/model escalation cannot change the frozen Goal, writer authority, Gate or successor set.

## Binding Index

| Route | Role Prompt | Action Prompts | Skill |
| --- | --- | --- | --- |
| `goal.facilitator` | `roles/goal-facilitator.role.md` | `intake-and-authority`, `adaptive-grilling`, `confirm-goal-graph`, `external-coordination` | referenced `grilling`; `implementation-goal-classification` |
| `evidence.scout` | `roles/evidence-scout.role.md` | `evidence-research` | none |
| `feasibility.validator` | `roles/implementation-feasibility-validator.role.md` | `validate-implementation-feasibility` | `implementation-feasibility-validation` |
| `test.designer.blackbox` | `roles/test-designer.role.md` | `materialize-tests`, `test-side-resolution` | `acceptance-test-design` |
| `test.designer.structural` | `roles/test-designer.role.md` | `close-structural-coverage`, `test-side-resolution` | `structural-test-coverage` |
| `implementation.standard` | `roles/implementer.role.md` | `evolve-prototype`, `refactor-and-harden`, `implementation-resolution` | `evolutionary-tdd-implementation` |
| `review.goal-blackbox` | `roles/goal-adversary.role.md` | `black-box-goal-review`, `recheck-finding`, `whole-scope-review` | `black-box-goal-adversary` |
| `review.implementation-whitebox` | `roles/implementation-reviewer.role.md` | `white-box-implementation-review`, `recheck-finding`, `whole-scope-review` | `white-box-implementation-review` |
| `finding.aggregate` | `roles/finding-aggregator.role.md` | `aggregate-findings` | none |
| `delivery.custodian` | `roles/delivery-custodian.role.md` | `preflight`, `custody-gate` | `implementation-delivery-custody` |
