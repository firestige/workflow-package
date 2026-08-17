# Revision Request Semantic Schema

| Field | Required | Meaning |
| --- | --- | --- |
| `revision_id` | yes | stable request identity |
| `origin_type` | yes | `REVIEW_FINDING | FRESH_READER_FINDING | SPIKE_RESULT | HUMAN_DECISION | DETERMINISTIC_FAILURE` |
| `origin_identity` | yes | exact Finding/result/check identity |
| `draft_binding` | yes | exact artifact to revise |
| `affected_identities` | yes | sections/diagrams/decisions/acceptance relations affected |
| `required_change` | yes | bounded correction without inventing new authority |
| `invalidated_reviews` | yes | review/reader evidence invalidated by the change |
| `return_action` | yes | `SD-09 | SD-13 | SD-14`, selected from the invalidated validation evidence |
| `evidence` | yes | evidence proving why revision is required |

Runtime validates `return_action` against origin and invalidation state. SD-11 may not default every request to SD-09.
