# Deterministic Verification Definition

The first package version defines checks but does not ship an executable validator before the Workflow/Package Contract is available. A future implementation must emit command, exit status, checked artifact identity, check results, and bounded evidence.

## Required Checks

### Artifact and identity

- required Brief, Skeleton, Design, Review, decision, Spike, reader-test, and acceptance artifacts exist;
- every artifact has an exact content digest and locator; Git-managed authorities/deliverables also have resolvable commit/blob identities;
- Git ancestry and change set are available for mismatched versions;
- the candidate Design is not `STALE_PENDING_IMPACT` or `INVALIDATED`.

### Document structure

- required template headings exist;
- no template placeholder remains;
- Markdown fences/tables and Mermaid blocks are structurally complete;
- local links and anchors resolve;
- diagrams referenced by prose exist;
- a critical-flow section contains a successful core before separately named exception/recovery/lifecycle scenarios;
- conceptual and behavioral prose has no repeated dense stable-ID cluster; dedicated trace, decision, acceptance and external-obligation registers are exempt;
- the candidate has no required link to a run-workspace intermediate.

### Identity and traceability

- topic, scenario, decision, Module, Interface, view, Finding, Spike, and acceptance IDs are unique;
- every referenced identity exists in the admitted dependency closure;
- every important Brief scenario has a Design mechanism and acceptance relation;
- no changed upstream identity retains a stale Review pass.

### Review and lifecycle

- three final review lenses used isolated result identities and the same admitted Draft lineage;
- all Blocking/Major Findings are `CLOSED_FIXED` or `CLOSED_NOT_VALID` by their corresponding lens;
- every Minor Finding is `CLOSED_FIXED`, `CLOSED_NOT_VALID`, or `ACCEPTED_MINOR` by its source lens; no admitted Finding remains `OPEN`;
- no `REVIEW_SIGNAL` was counted as a Finding or used for Human Decision admission;
- architecture-feasibility Spikes closed before expansion;
- design-owned parameters closed before `IMPLEMENTATION_READY`;
- downstream obligations have owner, affected design identities, semantic dependency, required evidence, return location and reopen threshold;
- no handoff text prescribes another Workflow's Action, Gate, Wait, classification or terminal;
- runtime-tuning handoffs have owner, method, return location, and reopen threshold;
- Fresh Reader Test passed against the exact candidate Design;
- maturity transition is legal;
- repository candidate changes contain only the final Design and explicitly requested formal companions; no `docs/**/workflow-artifacts/` path or other run-workspace artifact is tracked;

## SD-15 Post-promotion Cleanup Gate

After SD-14 passes and the final Design is promoted, SD-15 deterministically verifies that:

- the final Design has no required reference to a run-workspace intermediate;
- no workflow intermediate is present in the Git index or tracked file set;
- the ignored run workspace has been deleted;
- only the final Design and explicitly requested formal companions remain as repository candidate changes.

Failure remains pre-terminal and retries bounded cleanup; it never reports `IMPLEMENTATION_READY`.

## Explicit Non-checks

The deterministic validator does not judge whether architecture is clean, a Module is deep, NFR is appropriate, risk is real, or the solution fits the problem. Those are independent semantic Review responsibilities.
