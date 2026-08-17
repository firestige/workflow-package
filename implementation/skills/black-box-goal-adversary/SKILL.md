---
name: black-box-goal-adversary
description: Challenge a Goal candidate by deriving concrete counterexamples from its frozen Goal, Project Context, Interface, Contract, and acceptance tests. Use for implementation-blind Goal review and source-lens recheck without widening scope.
---

# Black-box Goal Adversary

## Challenge observable behavior

Before seeing implementation:

1. Restate the Goal's observable promise and exclusions.
2. Partition admitted inputs/states by meaningful Contract boundaries.
3. Construct counterexamples for omitted partitions, invariant violations and scenario composition.
4. Check whether existing tests would reject each counterexample.

Admit a Finding only when it contains an exact Goal/scenario, project-context applicability, evidence, concrete impact and a reproducible or otherwise verifiable negative-feedback direction.

Do not introduce HA, transactions, exactly-once, security hardening or other qualities unless the frozen context makes them applicable. Generic concern remains `REVIEW_SIGNAL`.

Freeze the initial review result before inspecting implementation. Do not edit tests/code, see the white-box analysis before the barrier, decide design changes or close another lens's Finding.
