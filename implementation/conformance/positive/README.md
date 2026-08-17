# Positive Conformance Scenarios

Each simulation records exact inputs, Action sequence, CLI results, Artifact identities, Goal/rung states, commits and terminal result.

## Scenario Index

| ID | Scenario | Preconditions | Stimulus / key path | Expected result |
| --- | --- | --- | --- | --- |
| `IM-CONF-P-001` | Single Goal evolutionary TDD | one ready pure-behavior Goal; clean repository | complete core Action path with calibrated RED and GREEN Goal commit | one Goal commit; `VERIFIED_IMPLEMENTATION_READY`; no publication |
| `IM-CONF-P-002` | Multi-Goal Walking Skeleton | Harness Goal plus core and collaborator Goals | topological selection, Contract-bound stubs and later replacement | serialized production writes, per-Goal commits and complete whole-scope success |
| `IM-CONF-P-003` | Existing-green calibration | baseline already satisfies the Goal | controlled negative fixture/mutant proves test discrimination | Goal completes without unnecessary production change |
| `IM-CONF-P-004` | Adversarial extension within Goal | admitted black-box counterexample remains inside frozen Goal | test-side treatment → implementation treatment → source-lens recheck | Finding closes autonomously without scope expansion |
| `IM-CONF-P-005` | Non-code verifiable asset | schema/config asset has reliable positive and negative fixtures | same Test Ladder, writer, review and commit flow | verified non-code Goal without language-specific assumptions |
| `IM-CONF-P-006` | Artifact lineage and revalidation | one non-semantic dependency version changes | create new dependency/artifact versions, propagate stale state, perform bounded impact check | unaffected dependant gains explicit revalidation record; frozen identity is never overwritten |
| `IM-CONF-P-007` | Package Snapshot closure | all owned/referenced resources and route bindings are resolvable | resolve identities, authority order, environment requirements and no-fallback proof | immutable Snapshot admitted and bound to Delivery/run manifest |
| `IM-CONF-P-008` | Managed workspace lifecycle | admitted Snapshot, ignored run root and retention policy exist | create manifest revisions, checkpoint exact Artifact/Git identities, settle and clean eligible copies | repository contains only Goal deliverables; durable owner state is not deleted |
| `IM-CONF-P-009` | Typed obligation lifecycle | Contract, version, conformance and tuning obligations are handed off | classify separately, run feasibility, map verification, retain tuning handoff | only dependent Goals wait; candidate completes without false evidence claims |

## Scenario Details

## `IM-CONF-P-001` Single Goal evolutionary TDD

Given one ready pure-behavior Goal and a clean repository, prove:

`IM-01 → 02 → 02V (when applicable) → 03 → 04 → 05 → 06 → 07(EXPECTED_RED) → 08(GREEN) → 09 → 10 → 11 → 12 → 13 → 16 → 17 → 18`.

The Goal receives one green commit; final status is `VERIFIED_IMPLEMENTATION_READY`; no publication occurs.

## `IM-CONF-P-002` Multi-Goal Walking Skeleton

Given Harness Goal `G0`, core vertical Goal `G1`, and collaborator Goals `G2/G3`, prove topological selection, a minimum end-to-end path, Contract-bound stubs, sequential production writes, stub replacement, per-Goal commits and final whole-scope regression.

## `IM-CONF-P-003` Existing-green calibration

Given a Goal already satisfied at baseline, prove Test Designer uses a controlled negative fixture/mutant to establish discrimination, then completes without unnecessary production modification.

## `IM-CONF-P-004` Adversarial extension within Goal

Given a black-box counterexample strictly derived from the frozen Goal, prove the new test is admitted by Test Designer, becomes visible RED feedback, returns through implementation/recheck and closes without human intervention or scope expansion.

## `IM-CONF-P-005` Non-code verifiable asset

Given a schema/configuration Goal with positive and negative fixtures, prove the same ladder, writer separation, review and commit semantics apply without assuming a specific programming language.

## `IM-CONF-P-006` Artifact lineage and revalidation

Given a changed dependency that does not alter frozen Goal semantics, prove manifest graph propagation marks the dependant `STALE_PENDING_IMPACT`, an authorized impact check creates a new `REVALIDATED` record, and no prior version/content identity is mutated. A frozen design, Goal or Project Context semantic change must fail this case and stop the Delivery instead.

## `IM-CONF-P-007` Package Snapshot closure

Resolve every owned and referenced resource plus each Action/Role/route/Prompt/Skill/model/tool/Driver/session binding. Prove content identities, authority order, environment requirements and resolver proof are complete, no ambient fallback remains, and the admitted Snapshot cannot change with Workflow State.

## `IM-CONF-P-008` Managed workspace lifecycle

Prove each Artifact addition produces a new manifest revision, checkpoints bind the exact manifest and Git tree, Goal commit promotes only approved repository paths, and IM-18 cleanup removes only eligible run-workspace copies after settlement/policy authorization. Runtime-owned durable state, Git objects and external authorities remain untouched.

## `IM-CONF-P-009` Typed obligation lifecycle

Given four upstream obligations, prove a missing cross-owner Contract blocks only its dependent Goal, a version/SDK question reaches compatible IM-02V evidence before Goal freeze, conformance/fault requirements become executable Test Ladder and whole-scope evidence, and an unmeasured operational value remains an owner-complete post-candidate handoff. The Workflow preserves every upstream semantic dependency but uses only its own Action/Gate/terminal rules.
