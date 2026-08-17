# Workflow Control Semantic Schema

Workflow State records Delivery, Package Snapshot, design, upstream-obligation register, Goal Graph and run-manifest-revision identities; current Action/attempt; active obligation/Goal/rung; Git baseline/tree/head; budgets; pending Wait; feasibility/test evidence; operational handoffs; Findings; commits; checkpoint reference; and exact resume Action.

`WAITING_FOR_USER` binds one measurement decision. `WAITING_FOR_EXTERNAL` binds one Coordination Request and expected compatible result. `INCOMPLETE` preserves current state and reason. `FAILED` and `CANCELLED` are terminal. `VERIFIED_IMPLEMENTATION_READY` binds the final candidate and proves no publication effect.

No control can substitute a new design identity inside the Delivery.

For `MANAGED_DELIVERY`, only the Selected Runtime Profile writes Workflow State, Wait and terminal settlement. A run-workspace manifest indexes Artifacts but cannot advance state.

`UNMANAGED_SIMULATION` may keep a non-authoritative simulation-control record with the same observational fields. Its outcomes are `SIMULATION_PASSED | SIMULATION_FAILED | SIMULATION_INCOMPLETE`; they are not Workflow terminals and cannot be resumed as a Managed Delivery checkpoint.
