# Downstream Obligation Semantic Schema

A downstream obligation is part of the final System Design handoff, not Workflow control for its consumer.

| Field | Required | Meaning |
| --- | --- | --- |
| `obligation_id` | yes | stable identity within the Design lineage |
| `owner` | yes | accountable Contract, implementation, validation or operational owner |
| `affected_design_identities` | yes | exact decisions, Interfaces, scenarios or assumptions affected |
| `semantic_dependency` | yes | design semantics a downstream result must preserve |
| `required_evidence` | yes | Contract, fact, test result or measurement still needed |
| `current_evidence_state` | yes | confirmed state without claiming unexecuted evidence |
| `suggested_consumer` | optional | non-authoritative routing hint |
| `return_location` | yes | durable location/owner to receive a compatible result |
| `design_reopen_condition` | yes | result that invalidates or materially changes Design semantics |

The record cannot declare another Workflow's Action, lifecycle classification, Wait, Gate or terminal. The consuming Workflow owns those choices while preserving `semantic_dependency` and `design_reopen_condition`.
