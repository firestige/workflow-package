---
name: implementation-goal-classification
description: Derive and classify testable implementation Goals from one frozen implementation-ready design. Use during Implementation Workflow intake/grilling to build Project Context, Goal Packets, dependencies, semantic Test Ladders, and exact blockers without making architecture decisions.
---

# Implementation Goal Classification

## Derive the implementation boundary

1. Bind the exact frozen design identity and requested implementation scope.
2. Extract context, non-goals, Interface obligations, accepted risks, verification methods, handoff order and prohibited reinterpretations.
3. Trace every in-scope design obligation to one or more candidate Goals. Do not organize Goals around files merely because files are visible.

Classify each upstream handoff independently as `CONTRACT_PREREQUISITE`, `IMPLEMENTATION_FEASIBILITY`, `IMPLEMENTATION_VERIFICATION`, or `OPERATIONAL_TUNING`. Preserve its semantic dependency and design-reopen condition. Upstream lifecycle suggestions are evidence, not authority over this Workflow.

## Test encodability

For each Goal require stable preconditions, input/event, observable result, side effects, Oracle, Harness, dependencies and completion relationship. Classify it as `READY`, `NEEDS_GOAL_REFINEMENT`, `NEEDS_EVIDENCE`, `NEEDS_TEST_HARNESS`, `BLOCKED_BY_DESIGN_GAP`, `BLOCKED_BY_EXTERNAL_CONTRACT`, `BLOCKED_BY_DEPENDENCY`, or `OUT_OF_SCOPE`.

Investigate derivable facts. Ask the user only for measurement/intent decisions, one at a time. Never fill a missing cross-owner Contract with an implementation guess. A missing Contract blocks only dependent Goals; implementation-verification evidence maps to Test Ladder rungs instead of external wait; operational tuning remains a handoff unless an authoritative Fitness Threshold applies.

## Build the graph and ladder

- Add a Harness Goal when testing capability is absent.
- Prefer a minimum end-to-end Walking Skeleton after prerequisites.
- Express dependencies explicitly; serialize production writers without blocking independent preparation.
- Give every Goal a semantic Test Ladder covering fixed topics with contextual applicability.
- Mark overall success as all in-scope Goals verified; never define partial success.

Return working artifacts for human confirmation. Do not freeze, implement, write tests, or select a Workflow successor.
