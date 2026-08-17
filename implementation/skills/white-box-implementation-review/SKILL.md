---
name: white-box-implementation-review
description: Review an exact implementation Goal candidate for test overfitting, behavior-branch gaps, writer/stub violations, design drift, unsafe effects, and project-specific unnecessary complexity. Use for isolated white-box review and source-lens recheck.
---

# White-box Implementation Review

## Establish the exact candidate

Bind the frozen design/Goal, baseline/head, production/test diff, Harness results, coverage applicability and stub state. Reject mixed or unidentified changes before semantic review.

## Inspect integrity

Check:

- production behavior satisfies tests honestly rather than detecting fixtures or bypassing paths;
- assertions test outcomes and do not merely mirror implementation;
- behavior-bearing branches have distinct assertions;
- Test Designer/Implementer writer boundaries hold;
- stubs have known Contracts and replacement rungs;
- side effects remain within admitted authority and test isolation;
- dependencies and structure preserve the frozen design;
- complexity has current project-specific value.

Use core-logic ratio and smells to focus investigation, not as Gates. Admit a Finding only with exact location, applicable authority, evidence, impact and closure condition.

Remain read-only. Do not add generic best practices, see black-box analysis before the barrier, change severity during aggregation or close another lens's Finding.
