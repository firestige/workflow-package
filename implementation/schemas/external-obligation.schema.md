# External Obligation Semantic Schema

Each upstream handoff is consumed without allowing its Artifact text to control this Workflow.

| Field | Required | Meaning |
| --- | --- | --- |
| `obligation_id` | yes | exact upstream obligation identity |
| `source_identity` | yes | frozen design/artifact content identity |
| `upstream_owner` | yes | owner accountable for the upstream semantic statement/result |
| `semantic_dependency` | yes | meaning the Implementation must preserve |
| `required_evidence` | yes | Contract, feasibility fact, executable verification or operational measurement |
| `design_reopen_condition` | yes | result that stops this Delivery and requires a new design version |
| `class` | yes | `CONTRACT_PREREQUISITE | IMPLEMENTATION_FEASIBILITY | IMPLEMENTATION_VERIFICATION | OPERATIONAL_TUNING` |
| `affected_goal_ids` | yes | Goals blocked by or responsible for this obligation; may be empty before IM-03 |
| `state` | yes | `UNCLASSIFIED | READY_FOR_VALIDATION | BLOCKED | MAPPED | COMPATIBLE | VERIFIED | HANDED_OFF` |
| `evidence_identities` | as applicable | exact evidence consumed/produced by this Workflow |

`class` and Goal readiness are independent. The classification cannot weaken `semantic_dependency`, claim unexecuted evidence or modify the upstream Artifact.
