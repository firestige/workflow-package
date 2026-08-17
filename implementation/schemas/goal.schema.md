# Goal and Test Ladder Semantic Schema

A Goal records `goal_id`, design obligation references, upstream obligation classes, observable outcome, classification, Project Context applicability, dependencies, Oracle, Harness phases, writer path families, semantic Test Ladder identity, allowed stub replacements, completion condition and commit identity/state.

A Test Ladder rung records `rung_id`, fixed topic, applicability/reason, input/state, observable assertion, required fixture/isolation, stub replacement, calibration state, test-evidence identities and completion state.

Goal status is `CLASSIFIED | READY | ACTIVE | BLOCKED_BY_DEPENDENCY | BLOCKED_BY_DESIGN_GAP | BLOCKED_BY_EXTERNAL_CONTRACT | VERIFIED`. Obligation class is not a Goal status. A Goal becomes `VERIFIED` only after its complete ladder, local independent reviews, Finding closure and IM-16 commit.
