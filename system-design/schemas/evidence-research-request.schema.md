# Evidence Research Request Semantic Schema

| Field | Required | Meaning |
| --- | --- | --- |
| `request_id` | yes | stable research identity |
| `requesting_action` | yes | Action that discovered the gap |
| `requesting_result_or_finding` | when applicable | exact Reviewer result/Finding identity |
| `question` | yes | one derivable factual question |
| `why_not_user_intent` | yes | evidence that this belongs to research, not user decision |
| `authority_scope` | yes | admitted sources/read authority |
| `prior_evidence` | yes | sources/observations already checked |
| `required_result` | yes | evidence needed and affected identities |
| `resume_action` | yes | `SD-05 | SD-09` |
| `resume_lens` | when SD-09 | exact Problem–Solution, Architecture, or Quality Reviewer lens/result to re-run |

Runtime persists the return binding. Evidence Scout cannot change it.
