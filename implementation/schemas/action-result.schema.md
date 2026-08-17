# Action Result Semantic Schema

Every Agent-executed Action returns:

| Field | Required | Meaning |
| --- | --- | --- |
| `action_id` | yes | authorizing `IM-*` Action |
| `attempt_id` | yes | unique attempt |
| `goal_id` / `rung_id` | when applicable | exact loop position |
| `input_bindings` | yes | Package Snapshot, manifest revision, design, Goal, test, Git and resource identities consumed |
| `route_binding` | yes | Role/Prompt/Skill/model/tool/Driver planned and observed identities |
| `status` | yes | `SUCCEEDED | NEEDS_EVIDENCE | NEEDS_FEASIBILITY | NEEDS_USER | NEEDS_EXTERNAL | DESIGN_REOPEN_REQUIRED | NEEDS_TEST_RESOLUTION | NEEDS_IMPLEMENTATION_RESOLUTION | INCOMPLETE | FAILED` |
| `artifacts` | as applicable | immutable Artifact version references/digests registered in the next manifest revision |
| `changed_paths` | writer Actions | complete candidate path set |
| `evidence` | yes | commands, results and bounded observations |
| `proposal` | as applicable | exactly one allowed successor and rationale |

Agents propose outcomes. Runtime or an `UNMANAGED_SIMULATION` controller validates allowed transitions for its execution mode; free text cannot bypass a Gate.

For a Managed Delivery, only Runtime validation may advance Workflow State from this result. `UNMANAGED_SIMULATION` may validate the same shape but records only a simulation outcome.
