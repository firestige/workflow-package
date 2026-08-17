# Recovery Conformance Scenarios

## Scenario Index

| ID | Scenario | Preconditions | Stimulus / key path | Expected result |
| --- | --- | --- | --- | --- |
| `IM-CONF-R-001` | Rung interruption | IM-08 has exact Goal/rung and RED evidence | interrupt after production diff, before GREEN | resume same rung without regenerating Goal/test authority |
| `IM-CONF-R-002` | Budget exhaustion | diagnostic loop remains RED | exhaust Action budget | persist `INCOMPLETE`; renewal resumes same content identity |
| `IM-CONF-R-003` | Human measurement wait | one unresolved measurement decision exists | enter `WAITING_FOR_USER`, then receive response | accept only correlated response; resume IM-03 or stop on design change |
| `IM-CONF-R-004` | External coordination wait | frozen design delegates a missing artifact | publish request, then receive external result | compatible identity resumes classification; conflict stops Delivery |
| `IM-CONF-R-005` | Goal commit recovery | G1 commit succeeded; G2 not selected | interrupt after IM-16 | resume from exact G1 commit and select next Goal |
| `IM-CONF-R-006` | Ambiguous custody effect | branch/commit acknowledgement is lost | retry requested | reconcile Git facts before any effect; never duplicate blindly |
| `IM-CONF-R-007` | Cancel and failure | active or waiting Delivery exists | explicit cancellation or non-retryable failure | exact terminal state; no success/publication; safe retention cleanup |
| `IM-CONF-R-008` | Missing/corrupt Artifact | checkpoint references an unavailable or digest-mismatched Artifact | resume Delivery | fail closed to reconciliation/`INCOMPLETE`; never select “latest” file |
| `IM-CONF-R-009` | Manifest revision interruption | Artifact content exists but manifest revision acknowledgement is absent | resume/retry registration | reconcile exact identity and predecessor before adding one new revision |
| `IM-CONF-R-010` | Snapshot/resource unavailable | admitted Snapshot resource cannot be materialized on resume | attempt ambient replacement | preserve Delivery/Snapshot identity and enter visible failure/Intervention path |
| `IM-CONF-R-011` | Partial cleanup | some eligible run-workspace copies remain | retry cleanup | retry only recorded dispositions under same exact root; preserve user/Runtime/Git/external state |
| `IM-CONF-R-012` | Feasibility interruption | IM-02V probe identity and argv are frozen | interrupt before compatible conclusion | resume same obligation/probe lineage; no ambient candidate substitution |

## Scenario Details

## `IM-CONF-R-001` Rung interruption

Interrupt IM-08 after a recorded production diff but before GREEN. Resume the same Goal/rung from exact Git baseline, formal test identities, failure evidence and implementation checkpoint. Do not regenerate Goal/test authority.

## `IM-CONF-R-002` Budget exhaustion

Exhaust a rung diagnostic budget while RED. Enter `INCOMPLETE` with attempt history, current candidate, tests, Findings and exact resume Action. Renewal resumes the same content identity; it does not weaken or skip the test.

## `IM-CONF-R-003` Human measurement wait

Persist one exact measurement question and IM-03 resume Action. Reject stale or unrelated responses. A design-semantic answer stops the Delivery instead of revising the frozen design.

## `IM-CONF-R-004` External coordination wait

Persist an exact Coordination Request for a design-delegated missing Contract/Detailed Design/evidence item. A matching compatible artifact resumes classification. A result that contradicts the frozen design stops the current Delivery. No Agent starts the external Workflow.

## `IM-CONF-R-005` Goal commit recovery

After IM-16 commits Goal `G1`, interrupt before selecting `G2`. Resume from the exact `G1` commit as baseline and never replay `G1` production mutation.

## `IM-CONF-R-006` Lost/failed custody effect

If branch or commit acknowledgement is ambiguous, reconcile Git facts before retry. Never create a second branch/commit blindly. Same identity/different content fails closed.

## `IM-CONF-R-007` Cancel and failure

Cancellation records `CANCELLED` without publication. Non-retryable CLI/configuration failure records `FAILED`. Neither is reported as `INCOMPLETE` or success; process artifact cleanup follows retention policy without deleting user work.

## `IM-CONF-R-008` Missing/corrupt Artifact

On resume, resolve every checkpoint-bound Artifact version and digest. Missing or mismatched content enters reconciliation or `INCOMPLETE` with the exact missing identity and resume requirement. Do not search for a newer file, regenerate frozen authority or reuse stale test/review evidence.

## `IM-CONF-R-009` Manifest revision interruption

When an Artifact write may have succeeded but manifest acknowledgement is unknown, compare the exact content identity and predecessor chain. Same identity/same content may be acknowledged; same identity/different content fails closed; absent registration creates exactly one new immutable revision.

## `IM-CONF-R-010` Snapshot/resource unavailable

When a frozen Prompt, Skill, CLI binary, model/tool/Driver binding or referenced resource is unavailable, retain the admitted Snapshot and expose the missing binding. Resume only when that exact binding can be materialized or when a new Delivery/Snapshot is admitted.

## `IM-CONF-R-011` Partial cleanup

Persist per-item cleanup dispositions and retry only unresolved eligible items beneath the same Delivery root. A retry must not widen its target, remove durable Runtime settlement/checkpoints, touch Git objects/deliverables, or infer terminal success from partial deletion.

## `IM-CONF-R-012` Feasibility interruption

Resume the exact obligation, candidate bindings, environment and Harness argv. Preserve inconclusive observations, create a new attempt identity, and accept only a conclusive compatible result for the same semantic dependency. A result crossing the design-reopen condition stops the Delivery.
