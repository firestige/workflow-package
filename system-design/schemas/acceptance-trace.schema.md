# Acceptance Trace Semantic Schema

Each important acceptance relation contains:

| Field | Required | Meaning |
| --- | --- | --- |
| `acceptance_id` | yes | stable identity |
| `problem_or_goal_ids` | yes | source problems/goals |
| `scenario_ids` | yes | confirmed scenario(s) |
| `design_driver_ids` | yes | constraint/quality/risk drivers |
| `decision_or_mechanism_ids` | yes | design response |
| `expected_outcome` | yes | observable result |
| `threshold` | when known | categorical/numeric Fitness Threshold and source/reasoning |
| `verification_method` | yes | design check or planned implementation/test method |
| `evidence_state` | yes | `DESIGN_EVIDENCE_AVAILABLE | IMPLEMENTATION_PLAN | SPIKE_REQUIRED | RUNTIME_HANDOFF` |
| `evidence_reference` | as applicable | actual or planned evidence identity |
| `owner` | yes | party responsible for evidence |
| `return_location` | when deferred | where results are applied |
| `reopen_condition` | when deferred | measurement/result that invalidates design assumptions |

Planned evidence must never be represented as passed evidence.
