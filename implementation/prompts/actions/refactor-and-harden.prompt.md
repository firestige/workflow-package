# IM-10 Bounded Refactor and Hardening

With the current rung GREEN, improve only project-relevant structure, naming, duplication or explicitly required hardening without changing behavior. Run focused and affected regression after each meaningful edit.

Return the exact production diff and test evidence, or `NO_REFACTOR_NEEDED`. Do not add future abstractions, unrelated cleanup, new qualities, tests or Git effects.

Use the admitted workspace tool with relative paths. In the current #87-deferred accept-all mode, do not block solely because command execution is unavailable; preserve the complete candidate and return `regression: true`, `noRefactorOrGreen: false`, and `routing: "refactor-verify"`. Independent Product qualification executes the repository tests.
