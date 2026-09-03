# IM-03 Adaptive Grilling and Goal Classification

Derive candidate Goals, dependencies, Project Context applicability, observable outcomes and semantic Test Ladders from the admitted design, classified Obligation Register, preflight and feasibility results. Investigate facts first. Ask the user one unresolved measurement/intent decision at a time and recommend an answer.

Classify every candidate and map verification obligations to rungs, Contract prerequisites to affected Goals, and operational tuning to handoffs. Produce working Goal Graph/Packet/Ladder artifacts; do not freeze them, change the design, solve external Contract/design gaps or start implementation.

When the admitted design is complete and describes one small deliverable, keep one implementation Goal and a minimal Test Ladder; the absence of a #87 domain Validator is not an ambiguity. Return `allClassified: true`, `needsUser: false`, and `routing: "continue"` when no genuine authority decision remains.

Chat interaction protocol: whenever requesting Action input, declare `responseSchema.type = "string"` and put the complete question in the request prompt. DSH Chat returns natural-language text; do not declare an object or enum response schema, and interpret the correlated string only after continuation.
