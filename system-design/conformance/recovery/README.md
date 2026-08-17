# Wait, Resume, Failure, and Recovery Conformance

1. SD-02 persists `WAITING_FOR_USER` with question and resume Action; only the correlated answer resumes the same working Brief.
2. SD-03 confirmation wait survives restart and cannot freeze a Brief from an answer bound to another version.
3. Human Decision Dialogue resumes across multiple questions without interpreting exploratory text as final confirmation.
4. SD-06 publishes an exact Spike Request, persists `WAITING_FOR_SPIKE`, rejects mismatched/duplicate results, and applies one conclusive correlated result.
5. SD-12 resumes from an exact design-owned parameter result and invalidates only the recorded transitive dependency closure plus semantic impacts; downstream obligations do not create a System Design Wait unless their result crosses the design-reopen condition.
6. A retryable Agent/Driver failure creates a new attempt on the same Action without losing artifact/checkpoint identity.
7. Budget exhaustion enters `INCOMPLETE` with resume Action and required input; a later authorized continuation resumes the same admitted state.
8. Explicit user cancellation from user/Spike Wait enters `CANCELLED`, preserves lineage, and does not claim completion.
9. A non-retryable missing/configuration identity terminates `FAILED` with evidence; it cannot be converted to `INCOMPLETE` to allow silent substitution.
10. Evidence Research returns to the exact SD-05 or SD-09 requester without restarting grilling.
11. Fresh Reader revision returns to SD-13 recheck; deterministic correction returns to SD-14; review Finding revision returns only to invalidated SD-09 lens(es).
12. An evidence request persists the exact requesting SD-09 lens/result and returns research only to that fresh recheck before aggregation resumes.
13. Wait expiry renews through the recorded Action while policy permits; otherwise it enters resumable `INCOMPLETE` with the pending request.
14. A Human Decision that invalidates direction returns to SD-04; a Draft-level decision creates a `HUMAN_DECISION` Revision Request and returns to invalidated review evidence.
15. Cancellation during an active non-Wait Action terminates `CANCELLED` at the next safe Runtime boundary while preserving the latest durable run-workspace artifact/checkpoint lineage under retention policy.
16. An interrupted or `INCOMPLETE` run keeps its ignored run workspace for correlated resume; it is never recovered by committing intermediate artifacts.
17. If SD-15 cleanup fails, the Workflow remains pre-terminal, retries bounded cleanup, and never reports `IMPLEMENTATION_READY` with intermediates in the Git candidate set.
