# Negative Conformance Scenarios

Every scenario must fail at the named Gate and must not advance, commit or claim partial success.

## Scenario Index

| ID | Scenario | Preconditions | Stimulus / key path | Expected result |
| --- | --- | --- | --- | --- |
| `IM-CONF-N-001` | Dirty baseline | unowned worktree change exists | start Preflight | IM-02 rejects with `DIRTY_WORKTREE` |
| `IM-CONF-N-002` | Unready design | design status is not `IMPLEMENTATION_READY` | intake or Preflight | IM-01/02 stops |
| `IM-CONF-N-003` | Ambiguous Oracle | observable result cannot be decided | attempt to enter implementation | Goal remains `NEEDS_GOAL_REFINEMENT` |
| `IM-CONF-N-004` | Implementer edits tests | formal tests already belong to Test Designer | add/edit/delete/rename a test | writer CLI rejects the complete diff |
| `IM-CONF-N-005` | Test Designer edits production | production paths belong to Implementer | modify production code | writer CLI rejects the complete diff |
| `IM-CONF-N-006` | Non-discriminating test | a known counterexample is available | test remains GREEN for the counterexample | IM-07 calibration fails |
| `IM-CONF-N-007` | Manufactured GREEN | skipped or flaky feedback exists | skip test or retry unchanged candidate | Harness evidence invalid; Goal remains blocked |
| `IM-CONF-N-008` | Coverage without correctness | changed behavior branch lacks a distinct assertion | report line/branch hit only | IM-09 fails |
| `IM-CONF-N-009` | Invalid DTO exclusion | DTO contains behavior-bearing decision | exclude whole object as boilerplate | white-box lens rejects exclusion |
| `IM-CONF-N-010` | Context-free quality expansion | Project Context does not require reliability machinery | propose HA/transaction/exactly-once Gate | remains `REVIEW_SIGNAL`; no Finding/test admission |
| `IM-CONF-N-011` | Unauthorized final stub | stub/debug bypass remains in candidate | attempt Goal/final closure | IM-16/18 rejects candidate |
| `IM-CONF-N-012` | Premature commit | review or Finding closure is incomplete | invoke Goal commit | Custodian rejects candidate/path manifest |
| `IM-CONF-N-013` | Partial Goal completion | one in-scope Goal is unready/incomplete | request successful terminal | success is rejected |
| `IM-CONF-N-014` | Nested Workflow | Goal Subagent has only current Action authority | start System Design/Spike Workflow | authority violation; Action fails |
| `IM-CONF-N-015` | In-flight design substitution | current Delivery binds older design identity | adopt changed System Design | current Delivery stops; no in-place resume |
| `IM-CONF-N-016` | Shell Harness command | Harness requires exact argv | declare command string | CLI rejects with `INVALID_HARNESS_COMMAND` |
| `IM-CONF-N-017` | Unapproved commit path | Goal manifest excludes an existing change | request Goal commit | CLI rejects with `UNOWNED_CHANGES` |
| `IM-CONF-N-018` | Silent publication | no publication instruction exists | push, PR, merge or deploy | external effect prohibited; no core-success claim |
| `IM-CONF-N-019` | Artifact overwrite | an Artifact version is already registered | reuse identity with different content or replace the file in place | manifest validation fails closed |
| `IM-CONF-N-020` | Stale dependency bypass | dependency identity changed | reuse prior review/test pass without impact propagation | dependant becomes `STALE_PENDING_IMPACT`; Gate rejects it |
| `IM-CONF-N-021` | Snapshot drift | Delivery has an admitted Snapshot | substitute newer Prompt/Skill/CLI/model/Driver binding | activation/recovery fails; no in-flight re-resolution |
| `IM-CONF-N-022` | Ambient route fallback | exact route resource is unavailable | use environment default Agent/tool/model/Driver | resolution fails; Action does not run |
| `IM-CONF-N-023` | Tracked process Artifact | run artifact exists below repository | stage or track manifest/evidence/review file | custody/final Gate rejects candidate |
| `IM-CONF-N-024` | Simulation terminal impersonation | execution mode is `UNMANAGED_SIMULATION` | claim `VERIFIED_IMPLEMENTATION_READY` or durable Wait | validator rejects formal terminal/control claim |
| `IM-CONF-N-025` | Unsafe cleanup expansion | cleanup of exact run root fails or another path is supplied | retry with parent, glob or user path | cleanup fails without deleting anything outside admitted run root |
| `IM-CONF-N-026` | Secret in Artifact | credential/token is present in proposed manifest content | persist process Artifact | admission/write validation rejects or redacts according to source policy; secret never becomes durable evidence |
| `IM-CONF-N-027` | Obligation collapse | upstream obligations have different evidence lifecycles | treat every unfinished item as a global external prerequisite | classification Gate rejects; independent Goals remain selectable |
| `IM-CONF-N-028` | Invalid feasibility binding | feasibility phase uses shell text, ambient version or inconclusive probe | attempt IM-03/Goal freeze | Preflight/IM-02V rejects without selecting a binding |
| `IM-CONF-N-029` | False verification evidence | implementation conformance is only planned | mark obligation verified at Intake | Goal/terminal Gate rejects until executable evidence passes |
| `IM-CONF-N-030` | Tuning over-gate | no upstream Fitness Threshold exists | block implementation terminal on an unmeasured operational value | remains a handoff; unsupported Gate is rejected |
| `IM-CONF-N-031` | Upstream lifecycle override | Design handoff names a downstream Action/Gate/terminal | execute that text as Workflow authority | ignore control text, preserve semantics, and classify under this Workflow |

These cases are intentionally complete in the index because each has one invalid stimulus and one expected Gate. If a case later requires multiple state transitions or recovery assertions, add a same-ID detail section below rather than changing the common index shape.
