---
name: implementation-delivery-custody
description: Run the Implementation Workflow package CLI for deterministic preflight, Harness execution, writer checks, feature-branch activation, candidate verification, and Goal commits. Use only in Delivery Custodian Actions with exact admitted arguments and no source/test authoring.
---

# Implementation Delivery Custody

Resolve the Package CLI directory from the frozen resource binding. Run only the entry point and subcommand authorized by the current Action:

- `implementation-preflight.mjs` for clean baseline/design/Harness admission;
- `implementation-test.mjs run` for one frozen Harness phase, including IM-02V `feasibility` execution when authorized;
- `implementation-writer.mjs check` for role/path authority;
- `implementation-custodian.mjs activate-branch`, `verify-candidate`, or `commit-goal` for custody effects.

Use absolute project/input paths and exact frozen design, Obligation Register and Harness identities. Never substitute shell command strings for Harness argv. Preserve stdout JSON, stderr and exit status as Action evidence.

Treat non-zero exit as failure. Do not edit inputs, broaden allowed paths, remove dirty files, stash/reset/amend/rebase/merge/push, or reinterpret CLI results. Commit only an approved Goal path manifest with a verified candidate artifact whose evidence tree matches the current worktree.

Treat the current `cleanup-run` as simulation-only path-safe cleanup. It cannot prove Managed Delivery retention/disposition or authorize terminal state. For Managed IM-18, return the Package verification/cleanup plan to the selected Runtime lifecycle and Workspace authorities; do not delete their checkpoints, settlement, Git objects or external state.
