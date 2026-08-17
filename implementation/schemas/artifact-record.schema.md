# Run Artifact Record Semantic Schema

| Field | Required | Meaning |
| --- | --- | --- |
| `artifact_id` | yes | stable logical object identity within Delivery |
| `artifact_version_id` | yes | unique immutable version identity |
| `kind` | yes | declared Goal/context/test/evidence/review/Finding/candidate/coordination kind |
| `delivery_id` | yes | owning Delivery |
| `package_snapshot_id` | yes | immutable configuration closure used to produce it |
| `action_id`, `attempt_id` | yes | producing Action attempt |
| `goal_id`, `rung_id` | when applicable | exact loop scope |
| `lifecycle_state` | yes | state permitted by [`artifact-lifecycle.md`](../artifact-lifecycle.md) for this kind |
| `dependency_validity` | yes | `CURRENT | STALE_PENDING_IMPACT | INVALIDATED | REVALIDATED` |
| `storage_kind` | yes | `RUN_WORKSPACE | REPOSITORY_DELIVERABLE | REPOSITORY_AUTHORITY | EXTERNAL_AUTHORITY` |
| `locator` | yes | logical locator; never an ambient search instruction |
| `media_type` | yes | content representation |
| `content_digest` | yes | exact immutable content identity |
| `size_bytes` | yes | bounded storage/validation fact |
| `dependencies` | yes | exact dependency records, possibly empty |
| `produced_by_route` | yes | resolved route binding identity |
| `supersedes` | when revised | prior artifact version identity |
| `retention_class` | yes | declared lifecycle retention class |
| `created_at` | yes | observed timestamp, not semantic ordering authority |

The manifest rejects duplicate identities, same identity/different content, undeclared kind/state combinations, unbounded evidence, secret-classified content, and locators outside the admitted storage root.
