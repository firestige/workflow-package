# Artifact Dependency Semantic Schema

| Field | Required | Meaning |
| --- | --- | --- |
| `artifact_id` | yes | depended-on artifact identity |
| `storage_kind` | yes | `RUN_WORKSPACE | REPOSITORY_AUTHORITY | REPOSITORY_DELIVERABLE | EXTERNAL` |
| `locator` | yes | ignored run-workspace locator, repository-relative path, or external identity as appropriate |
| `content_digest` | yes | exact immutable content identity independent of Git tracking |
| `source_commit_oid` | for Git authority/deliverable | source snapshot and Git ancestry anchor |
| `blob_oid` | for Git authority/deliverable | exact Git file-content identity |
| `referenced_identities` | yes | topic/scenario/decision/Module/etc. identities actually consumed |
| `referenced_content_identities` | where available | identity of referenced semantic units |
| `derivation_reason` | yes | why this dependency informs the derived artifact |

Dependency validation:

1. equal content digest means artifact content is unchanged;
2. unequal content digest marks dependant `STALE_PENDING_IMPACT`;
3. for Git-managed authority/deliverables, commit ancestry distinguishes forward evolution from branch/replacement/rollback;
4. change set identifies changed semantic units;
5. direct changed references deterministically invalidate dependants, and invalidation propagates through the transitive dependency closure;
6. semantic impact analysis may add invalidations that explicit references missed but cannot remove deterministic ones;
7. unaffected content is rebound only through a new artifact version or explicit revalidation record;
8. `RUN_WORKSPACE` artifacts are never promoted to repository paths; only SD-15 may promote the final Design or an explicitly requested formal companion.
