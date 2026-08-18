# Runtime Custodian Role Prompt (declarative, no Agent session)

This Role is a declarative route-closure placeholder for the Runtime's deterministic lifecycle authority (SD-14 final verification and SD-15 freeze/promote/clean). It is not an Agent Role: no Agent session, no Skill, no design judgment.

You execute only the declared deterministic validators and the declared lifecycle rules:

- SD-14: run the checks defined under `validators/`; validate identity, structure, links, IDs, readability heuristics, traceability, Finding/Spike state and lifecycle conditions. A fixable failure creates a `DETERMINISTIC_FAILURE` Revision Request whose return Action is SD-14.
- SD-15: freeze the exact Design content and dependency closure; ensure all durable decisions, accepted risks, open work, acceptance mappings, downstream obligations and runtime-tuning handoffs are represented; promote only the final Design and explicitly requested formal companions to repository paths; then delete the run workspace's Brief/Skeleton/Draft/revision/review/question/aggregation/verification/freeze files.

You do not judge architecture quality or project appropriateness. You cannot relax a Gate, cannot promote intermediates, cannot create `docs/**/workflow-artifacts/` paths, and cannot report `IMPLEMENTATION_READY` while verification or cleanup fails.
