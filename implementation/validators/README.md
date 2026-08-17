# Deterministic Verification Definition

Package-owned CLI and validation checks must verify:

## Package

- required Workflow, Role, Prompt, Skill, Template, Schema, CLI and conformance assets exist;
- the human Execution Guide exists while `workflow.md` remains the transition authority;
- Artifact lifecycle, Package Snapshot, run-manifest and dependency schemas exist and remain separately discoverable;
- Markdown links and resource bindings resolve;
- no template TODO remains in Skills or promoted Package documents;
- every Agent Action has one responsible Role/route and Action Prompt;
- every Skill is bounded and validates structurally;
- CLI source passes syntax checks and tests.

## Snapshot, Artifact and Delivery candidate

- one immutable Package Snapshot identity binds the Workflow Definition, owned/referenced resources and exact route/executable identities;
- Package resolution has no ambient Agent/Prompt/Skill/model/tool/Driver fallback;
- one run-manifest revision binds the Delivery, Snapshot, candidate Git tree and complete Artifact version set;
- every process Artifact has immutable version/content identity, legal lifecycle state, retention class and explicit dependencies;
- same identity/different content, dependency cycles, unknown predecessor revisions and locators outside the admitted root fail closed;
- changed dependencies propagate `STALE_PENDING_IMPACT`; no stale/invalidated Artifact satisfies a Gate;
- Managed checkpoints bind Delivery, Snapshot, manifest revision and Git tree; simulation records cannot satisfy formal terminal checks;
- exact frozen design, Goal Graph, Harness and Git identities exist;
- every upstream obligation has one Implementation classification that preserves semantic dependency and design-reopen condition;
- feasibility obligations have compatible exact-binding evidence; Contract prerequisites block only dependent Goals; verification obligations map to executable evidence; operational tuning has a complete handoff;
- worktree baseline/branch conditions are satisfied;
- writer policy includes staged, unstaged, rename/delete and untracked paths;
- every in-scope Goal is verified and committed;
- required test phases passed against the exact candidate without flaky retry-to-green;
- applicable branch coverage/assertion and no-regression policy passed;
- every Finding has a source-lens-valid closing disposition;
- no unauthorized stub, debug bypass or tracked process artifact remains;
- no push/PR/merge/deployment effect is claimed.
- no upstream Artifact text has overridden this Workflow's Action, Gate, Wait or terminal authority.

## Retention and cleanup

- the run root is exact, ignored and bound to one Delivery/Snapshot;
- cleanup disposition does not include Runtime-owned checkpoint/settlement, Git objects, Repository Deliverables or External Authority;
- cleanup never broadens its path after partial failure and never deletes user work;
- terminal reporting follows durable settlement and the admitted cleanup/retention policy.

Deterministic checks do not decide whether a Goal, quality or architecture is appropriate. Those remain confirmed input and independent semantic Review responsibilities.
