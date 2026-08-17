# Action Result Semantic Schema

Every Agent-executed Action returns:

| Field | Required | Meaning |
| --- | --- | --- |
| `action_id` | yes | Workflow Action that authorized the result |
| `attempt_id` | yes | unique invocation attempt |
| `input_bindings` | yes | exact artifact content digests plus applicable authority commit/blob identities consumed |
| `route_binding` | yes | Role/Agent/Prompt/Skill/model/tool/Driver identities planned and observed |
| `status` | yes | `SUCCEEDED | NEEDS_EVIDENCE | NEEDS_BRIEF_CHANGE | NEEDS_HUMAN_DECISION | NEEDS_REVISION | INCOMPLETE | FAILED` |
| `artifacts` | as applicable | newly created immutable run-workspace artifact/version references and content digests; not Git promotion authority |
| `decisions` | as applicable | design-level decisions and evidence |
| `unknowns` | as applicable | classified unknowns with owner/blocks/evidence/return location |
| `downstream_obligations` | SD-12/final handoff | owner-complete obligations with semantic dependency, required evidence, return location and design-reopen condition |
| `invalidations` | as applicable | direct and semantic downstream invalidations |
| `proposal` | as applicable | one allowed next-Action proposal and rationale |
| `evidence` | yes | bounded evidence supporting claims/status |

Agents propose outcomes. Runtime validates the result against allowed successors and writes Workflow State.

All Action-created artifacts are session working state under the ignored run workspace. Only SD-15 may promote the final Design and explicitly requested formal companions to repository paths; review/treatment/control artifacts must never be promoted.
