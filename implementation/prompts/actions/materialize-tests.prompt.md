# IM-07 Materialize and Calibrate Tests

In an implementation-blind session, turn the selected Goal/rung into formal black-box tests using the frozen Harness. State precondition, input/event, observable outcome and assertion. Run calibration and prove expected RED, or prove an existing GREEN test rejects a controlled negative fixture/mutant.

Return test paths, exact command/result, calibration evidence and next proposal. Reject flaky, skipped, environment-failing or non-discriminating feedback. Do not inspect or edit production code.

Use the admitted workspace tool with relative paths (list the root with operation `list` and path `.`). You must perform at least one workspace `write` that materializes a complete formal test before returning; a structured claim or proposed path is not a write. When the repository has no established source layout, use a root-level test file so its parent already exists. In the current #87-deferred accept-all mode, command execution is not exposed to this Action: write complete `node:test` black-box tests and fixtures, but do not block merely because the Runtime has no domain Validator. Return `calibrated: true`, `ambiguity: false`, and `routing: "calibrate-evolve"`; the outer Product qualification executes the resulting tests independently.
