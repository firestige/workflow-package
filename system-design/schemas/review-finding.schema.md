# Review Finding Semantic Schema

## Finding

| Field | Required | Meaning |
| --- | --- | --- |
| `finding_id` | yes | stable identity |
| `lens` | yes | `PROBLEM_SOLUTION | ARCHITECTURE | QUALITY_ACCEPTANCE | FRESH_READER` |
| `draft_binding` | yes | exact run-workspace Draft content digest reviewed |
| `location` | yes | design identity/section/diagram |
| `observation` | yes | exact statement, omission, or contradiction |
| `applicable_requirement` | yes | Brief/project/design authority identity |
| `evidence` | yes | evidence supporting the claim |
| `project_impact` | yes | concrete impact in the confirmed context |
| `resolution_direction` | yes | bounded recommendation, not an edit |
| `severity` | yes | `BLOCKING | MAJOR | MINOR` |
| `confidence` | yes | confidence and uncertainty reason |
| `status` | yes | `OPEN | CLOSED_FIXED | CLOSED_NOT_VALID | ACCEPTED_MINOR` |
| `provenance` | yes | Reviewer route/session/result identity |

## Review Signal

A `REVIEW_SIGNAL` records location, observed signal, investigation performed, and why admission evidence is currently insufficient. It is not a Finding, cannot block, cannot trigger Human Decision, and must not be counted as reported risk.

## Closure

Only the corresponding review lens can close a Finding after reading the original Finding, treatment, exact new Draft and evidence in a fresh session. The source lens may set a Minor to `ACCEPTED_MINOR` only with a reasoned statement that it does not change design meaning, implementation direction, or acceptance. Designer and Aggregator cannot close or accept it.
