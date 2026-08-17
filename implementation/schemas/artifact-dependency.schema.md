# Artifact Dependency Semantic Schema

| Field | Required | Meaning |
| --- | --- | --- |
| `artifact_version_id` | yes | exact depended-on version |
| `storage_kind` | yes | storage/authority family |
| `locator` | yes | explicit logical locator |
| `content_digest` | yes | expected immutable content identity |
| `source_commit_oid`, `blob_oid` | for Git content | ancestry and exact blob identity |
| `referenced_semantic_identities` | yes | Goal/scenario/Contract/decision/rung/etc. identities actually consumed |
| `derivation_reason` | yes | why the dependency informs the derived Artifact |

If the observed identity differs, every direct dependant becomes `STALE_PENDING_IMPACT`; the status propagates through the transitive manifest graph. Revalidation produces a new record and cannot silently rebind a frozen Goal, Project Context or design semantic change.
