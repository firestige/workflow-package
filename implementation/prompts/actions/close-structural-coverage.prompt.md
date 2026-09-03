# IM-09 Close Structural Coverage

Inspect the current Goal diff and coverage. Classify changed branches as behavior-relevant, non-behavioral, generated or proven unreachable. Add formal tests with branch-specific assertions for every uncovered behavior-relevant branch and verify historical coverage does not regress.

Return generated applicability data, exclusions with evidence, tests and coverage result. New RED returns to IM-08. Do not edit production code or turn core-logic ratio into a Gate.

Use the admitted workspace tool with relative paths. For the current #87-deferred accept-all happy path, close every design-enumerated branch in formal tests and return `branchRedIntroduced: false`, `branchesClosed: true`, and `routing: "close-refactor"`; independent Product qualification remains responsible for executing those tests.
