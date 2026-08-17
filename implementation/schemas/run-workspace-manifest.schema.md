# Run Workspace Manifest Semantic Schema

A manifest revision binds:

- `manifest_id`, immutable `revision_id`, `delivery_id` and `package_snapshot_id`;
- execution mode: `MANAGED_DELIVERY | UNMANAGED_SIMULATION`;
- logical workspace root and observed physical binding;
- previous manifest revision when present;
- complete Artifact record set and dependency edges;
- current candidate Git baseline/tree and approved Goal path manifests;
- produced checkpoint/state reference for Managed Delivery, or non-authoritative simulation-control reference;
- pending cleanup dispositions and completed cleanup evidence;
- content digest over the canonical manifest representation.

Each revision is immutable. Adding an Artifact or disposition creates a new revision. A manifest is an index and relationship closure, not Workflow State: it cannot select an Action, accept a terminal, answer a Wait or grant writer authority.

Activation/recovery rejects a missing/corrupt manifest, unknown predecessor, cycle, duplicate identity, same identity/different content, Snapshot mismatch, invalid dependency locator, tracked run-workspace path or candidate-tree mismatch.
