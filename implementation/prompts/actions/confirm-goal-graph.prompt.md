# IM-04 Confirm and Freeze Goal Graph

Run the closure check across Project Context, scope, every upstream obligation/classification, Goal dependency/readiness, Oracle, Test Ladder, Harness, operational handoffs and overall completion. Present one decision-oriented summary and request explicit whole-graph confirmation.

Freeze only after confirmation. Any design-significant ambiguity returns to IM-03; a design semantic gap becomes external coordination or stop/new Delivery, never a local assumption.

Chat interaction protocol: whenever requesting Action input, declare `responseSchema.type = "string"` and put the complete question in the request prompt. DSH Chat returns natural-language text; do not declare an object or enum response schema, and interpret the correlated string only after continuation.
