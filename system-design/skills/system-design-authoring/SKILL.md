---
name: system-design-authoring
description: Turn a confirmed System Design Brief into a coherent Skeleton and implementation-ready System Design without changing upstream intent.
---

# System Design Authoring

## Boundary

This Skill provides design and writing method. The outer Workflow owns Action order, Gate, budgets, user waits, review, and terminal state. Do not advance Workflow state, change a frozen Brief, close Findings, or execute Spikes.

Use the shared `codebase-design` Skill whenever Module, Interface, Seam, Adapter, Depth, Leverage, or Locality is in scope.

## Reasoning Order

1. Restate the problem, desired outcome, project context, scope, and non-goals from explicit authority.
2. Convert confirmed functional and quality scenarios into design drivers.
3. Decompose the problem into cohesive subproblems before naming Modules.
4. Assign responsibility, authoritative state, Interfaces, and dependency direction.
5. Trace critical scenarios through Actors and Modules, including relevant failures and recovery.
6. Design system-wide data, identity, consistency, concurrency, and lifecycle rules.
7. Show how contextual quality requirements shape the structure and mechanisms.
8. Derive risk, trade-off, acceptance, measurement, and implementation handoff.

## From Scenario to Design

For every important scenario establish:

```text
Actor/context/stimulus
→ expected outcome or Fitness Threshold
→ responsibility and state
→ Module collaboration
→ failure/degradation behavior
→ design mechanism
→ verification evidence
```

Do not write a generic NFR checklist after the architecture. If a quality attribute matters, show where it changes structure, control/data flow, state, failure handling, deployment assumptions, or acceptance. If it does not matter in the confirmed project context, state a specific reason rather than inventing machinery.

## Skeleton Method

- Prefer one minimal sufficient direction; create multiple candidates only for a real trade-off.
- Apply the deletion test to proposed Modules.
- Identify each authoritative state and its unique writer.
- Make dependency direction and external ownership explicit.
- Create a View Plan by question, not by diagram quota.
- Separate architecture feasibility and design-owned parameters from downstream implementation/Contract obligations and runtime tuning. Preserve the semantic dependency and reopen condition without choosing the consuming Workflow's lifecycle.
- Record decisions and rejected directions with Brief/driver evidence.

## Progressive Expansion

Use a single writer. Save checkpoints after coherent reasoning stages rather than splitting chapters among Agents. Later stages may revise earlier design, but must preserve artifact lineage and invalidate affected review evidence.

Write for downstream implementers:

- explain why a boundary exists, not merely that it exists;
- lead with human-readable names and concepts; use stable IDs as parenthetical anchors or dedicated trace columns, never as the primary prose subject;
- present one branch-free successful core flow first, then describe failure, recovery, cancellation, and lifecycle branches in separately named scenarios;
- use a sequence/activity/state diagram when it materially clarifies collaboration or transition order; keep mapping tables for lookup rather than as the only explanation of a critical protocol;
- keep diagrams and prose semantically equivalent;
- expose caller-visible invariants, ordering, errors, configuration, and performance characteristics;
- separate target design from legacy implementation evidence;
- keep implementation mechanics out unless callers or Module designers must know them;
- use stable identities for scenarios, decisions, Modules, Interfaces, Findings, and acceptance relations where traceability requires them, while consolidating dense mappings outside the conceptual reading path.

## Architectural Cleanliness

Treat cleanliness as a design optimization objective:

- cohesive responsibility;
- deep Modules and small complete Interfaces;
- clear ownership and unique writers;
- stable acyclic dependency direction;
- change locality and caller leverage;
- contained failure domains;
- abstractions justified by real variation;
- minimum sufficient mechanism for the project context.

Do not add a “clean architecture” chapter. The quality must be visible in the design itself.

## Unknowns and Evidence

Investigate derivable facts. Route user-intent gaps through Brief Change Request. Publish Spike Requests only for empirical facts whose result changes Design semantics. Never invent precise parameters. Record Fitness Thresholds separately from values that require measurement, and hand downstream obligations to their owners without prescribing their Workflow control.

## Completion of an Authoring Action

Return the requested run-workspace artifact version/content digest, exact dependencies, decisions made, evidence used, unresolved classifications, invalidated dependants/reviews, and allowed Workflow result. Do not place intermediate artifacts in Git or claim `IMPLEMENTATION_READY`; the outer Workflow owns promotion, cleanup, and the terminal Gate.
