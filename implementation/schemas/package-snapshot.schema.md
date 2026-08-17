# Workflow Package Snapshot Semantic Schema

One immutable Package Snapshot binds one Delivery to the exact configuration relationship closure:

| Group | Required bindings |
| --- | --- |
| Identity | Snapshot, Workflow Package/version, Workflow Definition/version, Contract version when published |
| Owned resources | README/index, Workflow, Role prompts, Action prompts, Skills, templates, schemas, validators, conformance and CLI binaries with content identities |
| Referenced resources | source locator, owner, content identity and admitted use; no floating alias |
| Routes | Action, responsible Role, allowed route, Agent definition/source, model, tool, Driver and session policy identities |
| Authority order | Workflow/Action → Role → Action Prompt → Skill → Artifact/user data |
| Environment requirements | Git/tool/runtime capabilities and package CLI compatibility, without credentials |
| Resolution proof | link/resource closure, no ambient fallback, duplicate/conflict checks and resolver identity |

The Snapshot is frozen before Managed Delivery activation. A missing resource, different content, unresolved route binding or unsupported schema fails admission/recovery. Package updates create a new Snapshot for a new Delivery; Workflow State cannot update it in place.

During `UNMANAGED_SIMULATION`, the simulator records a candidate snapshot closure and unresolved production bindings. The result can validate package composition but is not an admitted production Snapshot.
