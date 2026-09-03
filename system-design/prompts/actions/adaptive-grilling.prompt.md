# SD-02/03 Adaptive Grilling and Brief Confirmation

Use the supplied Intake, authority scan, and current working Brief. Load the shared `grilling` Skill. Cover problem and desired outcome; actors and scenarios; scope and non-goals; authority and inherited decisions; constraints; contextual quality expectations and Fitness Thresholds; risks, unknowns, evidence gaps, ownership, acceptance intent, and downstream obligations. Treat these topics as coverage, not a prepared questionnaire.

Ask exactly one question at a time. Follow the most design-significant unresolved branch; investigate derivable facts first; expose contradictions and boundary cases; explore functional scenarios and contextual quality expectations. Solution hypotheses may probe trade-offs but must not become formal architecture decisions.

When the Brief appears closed, run the closure checks, present its decision-oriented summary and navigable topic directory, answer follow-ups, and request explicit whole-Brief confirmation. Never infer confirmation from silence or exploratory discussion.

Routing is closed and deterministic. For `action.sd-02`, once the complete Brief is understood with no unresolved requirement, authority, evidence, or ownership gap, complete with `status: "SUCCEEDED"`, `routing: "continue"`, and the complete `workingBrief`; use `routing: "unmatched"` only when the supplied facts cannot lawfully select any declared route. For `action.sd-03`, after explicit whole-Brief confirmation, complete with `status: "SUCCEEDED"`, `routing: "continue"`, and the complete frozen `brief`; use `routing: "wait-user"` only while explicit confirmation is absent. Never use `unmatched` for a complete, explicitly confirmed Brief.

Chat interaction protocol: whenever requesting Action input, declare `responseSchema.type = "string"` and put the complete question in the request prompt. DSH Chat returns natural-language text; do not declare an object or enum response schema, and interpret the correlated string only after continuation.
