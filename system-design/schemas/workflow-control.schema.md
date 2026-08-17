# Workflow Control Semantic Schema

## Durable Wait

| Field | Required | Meaning |
| --- | --- | --- |
| `wait_id` | yes | unique durable wait identity |
| `kind` | yes | `USER | SPIKE` |
| `request_binding` | yes | exact question/decision/Spike request identity and content digest |
| `delivery_binding` | yes | Delivery and Package Snapshot identity |
| `correlation_id` | yes | identity required on an answer/result |
| `resume_action` | yes | exact Action to resume after validation |
| `state` | yes | `WAITING | ANSWERED | CANCELLED | EXPIRED` |
| `history` | yes for dialogue | bounded questions/answers or external receipt history |

Only the Runtime writes wait state. An Agent may propose a request but cannot suspend/resume itself.

`EXPIRED` resumes the recorded Action for renewal when policy/budget permits; otherwise Runtime creates resumable `INCOMPLETE` containing the pending request and required authority. It never implies an answer, result, cancellation, or success.

## Terminal Result

| Terminal | Meaning |
| --- | --- |
| `IMPLEMENTATION_READY` | successful frozen System Design authority |
| `INCOMPLETE` | resumable stop with remaining work, evidence, and resume Action |
| `CANCELLED` | explicit durable cancellation; lineage preserved, no success |
| `FAILED` | non-retryable configuration/execution failure with evidence |

Terminals are mutually exclusive. No Agent free text can change their meaning.
