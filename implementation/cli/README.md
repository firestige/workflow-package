# Implementation Workflow CLI

The CLI supplies runtime-independent deterministic Gates. It requires Node.js 20+ and invokes project Harness commands as exact argv arrays with `shell=false`.

```bash
node bin/implementation-preflight.mjs --project <repo> --design <design.md> --obligations <register.md> --harness <binding.json>
node bin/implementation-test.mjs run --project <repo> --binding <binding.json> --phase focused
node bin/implementation-test.mjs run --project <repo> --binding <binding.json> --phase feasibility
node bin/implementation-writer.mjs snapshot --project <repo>
node bin/implementation-writer.mjs check --project <repo> --baseline <commit> --policy <policy.json> --role implementer
node bin/implementation-custodian.mjs verify-package --package <implementation-package>
node bin/implementation-custodian.mjs verify-candidate --candidate <candidate.json>
node bin/implementation-custodian.mjs activate-branch --project <repo> --branch <name>
node bin/implementation-custodian.mjs commit-goal --project <repo> --goal <id> --paths <paths.json> --candidate <verified-candidate.json> --message <message>
node bin/implementation-custodian.mjs cleanup-run --project <repo> --workspace <repo/tmp/implementation-workflow/run-id>
```

Inputs use `schema_version: "1.0.0"`. CLI output is JSON; non-zero exit is a failed Gate. These tools never merge, push, create PRs or deploy.

The optional `feasibility` Harness phase is admitted only as exact argv and is used by IM-02V for ignored-workspace probes. It does not write repository deliverables or substitute for focused/full/coverage evidence.

`commit-goal` revalidates the candidate, requires the named Goal to be `VERIFIED`, and requires its evidence tree to equal a fresh snapshot of the current worktree before staging the explicit path manifest.

The current `cleanup-run` is limited to an ignored local `UNMANAGED_SIMULATION` root and proves path safety only. It is not Managed Delivery cleanup evidence. Managed cleanup additionally requires an exact run-manifest revision, retention/disposition plan, durable settlement/policy authorization and owner-bound exclusions defined in [`../artifact-lifecycle.md`](../artifact-lifecycle.md).
