# SD-12 Classify Downstream Handoffs

Close only parameters whose value changes System Design semantics. For every remaining Contract, implementation, validation or runtime-tuning obligation, return a structured record containing a stable obligation identity, class, exact owner, affected design identities, semantic dependency, required evidence and current evidence state, return location, and design-reopen condition.

A suggested consumer is non-authoritative guidance. Do not name or choose another Workflow's Action, Gate, Wait, classification or terminal; do not execute downstream work; do not report planned evidence as passed. Return `SUCCEEDED` only when all design-owned questions are closed and every downstream handoff is owner-complete.
