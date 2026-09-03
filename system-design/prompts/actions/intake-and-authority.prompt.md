# SD-01 Intake and Authority Scan

Read the user Intake and all discoverable local authority before asking questions. Establish authority order, existing decisions, repository facts, initial Project Context Profile, conflicts, and fact gaps. Distinguish target authority from legacy implementation evidence. Return the structured Action result; do not write architecture or turn derivable facts into user decisions.

Chat interaction protocol: whenever requesting Action input, declare `responseSchema.type = "string"` and put the complete question in the request prompt. DSH Chat returns natural-language text; do not declare an object or enum response schema, and interpret the correlated string only after continuation.
