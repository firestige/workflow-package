# Candidate Evidence Semantic Schema

A candidate record binds `schema_version`, frozen `design_identity`, Obligation Register identity, exact `candidate_tree`, Goal states, Findings, review results, feasibility/test evidence, operational-tuning handoffs and unauthorized-stub results.

Goal commit verification is scoped to the named Goal. It requires that Goal to be `VERIFIED`, both `GOAL` review lenses to pass against the candidate tree, all Findings carried by the artifact to have valid dispositions, and focused/full/coverage evidence to pass against the same tree. Other graph Goals need not yet be complete.

Final verification requires every listed in-scope Goal to be `VERIFIED`, black-box and white-box `GOAL` reviews for every Goal, both `WHOLE_SCOPE` reviews, valid Finding dispositions and all required test phases against the exact final tree.

Final verification also requires every obligation disposition to be valid: Contract prerequisites are satisfied for completed dependent Goals, feasibility is `COMPATIBLE`, implementation verification has passed mapped evidence, and operational tuning has an owner-complete handoff. Operational tuning blocks this terminal only when the frozen upstream authority supplies an applicable Fitness Threshold.

Every review result records `lens`, `scope` (`GOAL | WHOLE_SCOPE`), `goal_id` when scoped to a Goal, `status` and `baseline`. A Goal-level result cannot satisfy a whole-scope Gate or vice versa.
