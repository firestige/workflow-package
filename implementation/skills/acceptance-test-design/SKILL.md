---
name: acceptance-test-design
description: Materialize and calibrate black-box acceptance tests for one frozen Goal and Test Ladder rung. Use before implementation or for test-side Finding resolution when tests must provide reliable observable RED feedback without reading or changing production code.
---

# Acceptance Test Design

## Preserve black-box authority

Read only the frozen Goal, Project Context, Interface/Contract, Harness Binding and prior formal tests. Do not inspect production implementation during initial rung design.

For each test state:

- precondition and owned fixture;
- input/event;
- observable result or side effect;
- assertion and why it distinguishes a conforming result;
- applicable Goal/scenario identity.

Test outcomes, not internal calls. Prefer real controlled collaborators, then fakes, then Contract-bound stubs. Avoid mocks that merely restate an implementation.

## Calibrate negative feedback

Run the exact frozen command. Accept the test only when it fails for the expected missing behavior. If existing behavior is already correct, prove discrimination with a negative fixture or controlled mutant outside the candidate source tree.

Reject environment failures, false positives, skipped tests, unowned side effects and flaky outcomes. Do not retry until GREEN.

Return formal test paths, command/result, expected RED reason, calibration evidence and any Goal ambiguity. Never edit production code or weaken the Goal.
