# SD-02/03 Adaptive Grilling and Brief Confirmation

Use the supplied Intake, authority scan, current working Brief, and `system-design-brief.template.md`. Load the shared `grilling` Skill. Treat template topics as coverage, not a prepared questionnaire.

Ask exactly one question at a time. Follow the most design-significant unresolved branch; investigate derivable facts first; expose contradictions and boundary cases; explore functional scenarios and contextual quality expectations. Solution hypotheses may probe trade-offs but must not become formal architecture decisions.

When the Brief appears closed, run the closure checks, present its decision-oriented summary and navigable topic directory, answer follow-ups, and request explicit whole-Brief confirmation. Never infer confirmation from silence or exploratory discussion.

Chat interaction protocol: whenever requesting Action input, declare `responseSchema.type = "string"` and put the complete question in the request prompt. DSH Chat returns natural-language text; do not declare an object or enum response schema, and interpret the correlated string only after continuation.
