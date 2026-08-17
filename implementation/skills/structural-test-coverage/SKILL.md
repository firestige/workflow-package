---
name: structural-test-coverage
description: Classify changed code branches and add branch-specific correctness tests for behavior-bearing logic. Use after a Test Ladder rung first reaches GREEN or when a coverage Finding requires test-side resolution.
---

# Structural Test Coverage

## Classify branches

Inspect the exact Goal diff and coverage data. Classify each changed decision as:

- `BEHAVIOR_RELEVANT`: affects result, state, authority, error or side effect;
- `NON_BEHAVIORAL`: passive carrier or project-irrelevant boilerplate;
- `GENERATED`: tool/compiler output outside authored behavior;
- `PROVEN_UNREACHABLE`: impossible under the admitted Contract, with evidence.

Do not exclude whole DTO/data-object files by label. Validation, normalization, equality and serialization decisions may carry behavior.

## Close meaningful coverage

Add a test that reaches each behavior-relevant branch and asserts its distinct outcome. Treat 100% changed behavior-branch coverage as the structural Gate and historical coverage as a no-regression baseline. Coverage without a meaningful assertion is insufficient.

Generate applicability data from diff/coverage and persist only exclusion exceptions. Reuse it for risk focus and regression selection. Treat core-logic ratio as `REVIEW_SIGNAL`, never a threshold.

Return tests, coverage result, exclusions and new RED feedback. Do not edit production code or approve your own exclusion as final.
