# Spike Result Semantic Schema

| Field | Required | Meaning |
| --- | --- | --- |
| `result_id` | yes | stable result identity |
| `request_binding` | yes | exact Spike Request identity and content digest |
| `class` | yes | architecture feasibility or design-owned parameter |
| `executor_environment` | yes | comparable executor/environment/workload identity |
| `method_evidence` | yes | procedure and bounded evidence references |
| `status` | yes | `CONCLUSIVE | INCONCLUSIVE | INVALID` |
| `observations` | yes | measured/observed facts |
| `recommendation` | when conclusive | direction/value, confidence, and limitations |
| `threshold_comparison` | when applicable | comparison with pre-existing Fitness Threshold |
| `affected_identities` | yes | assumptions/artifacts/reviews/acceptance affected |
| `resume_action` | yes | action that consumes the result |

Only a result whose request, environment, method, and evidence satisfy the request contract may close a Spike.

Implementation feasibility, implementation verification, external Contract publication and runtime tuning are downstream obligations rather than SD-06/12 Spike classes. A later downstream result is compared with its recorded design-reopen condition; it does not retroactively become a System Design completion prerequisite.
