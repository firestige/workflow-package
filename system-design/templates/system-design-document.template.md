# [System Name] System Design

## 1. Metadata and Authority

Status, final artifact identity, authoritative source commit/blob identities, Confirmed Brief and Skeleton identities/content digests, authority order, intended audience, and supersession lineage. Do not link to disposable run-workspace files.

## 2. Design Context

Project background, deployment context, actors, trust/ownership assumptions, lifecycle stage, and contextual facts that materially shape the design.

## 3. Problem, Goals, and Scope

The problem being solved, desired outcomes, key scenarios, system scope, non-goals, and success definition. Trace to Brief identities without reproducing the grilling transcript.

## 4. Design Drivers

Inherited decisions, constraints, quality scenarios, Fitness Thresholds, risks, priorities, and evolution expectations that determine architectural trade-offs.

## 5. Problem Decomposition

How the large problem is divided into smaller cohesive problems; why these boundaries are sufficient; where complexity is intentionally hidden.

## 6. System Structure

System Modules, responsibilities, Interface intent, authoritative state, dependency direction, seams, external systems, and rationale. Include a hierarchy/module view when it materially improves understanding.

## 7. Collaboration and End-to-End Flows

Start with one human-readable, branch-free successful core flow and a short phase-by-phase explanation. Then give each relevant failure, wait, cancellation, recovery, publication conflict, and lifecycle branch its own named scenario. Use scenario-selected sequence, activity, flow, data-flow, state, dependency, or deployment views when they materially clarify order or ownership; mapping tables support lookup but must not be the only explanation of a critical protocol. Diagrams answer questions; no diagram quota exists.

Lead with names and concepts. Put stable IDs in parenthetical anchors, dedicated trace columns, or a compact mapping after comprehension; do not make dense ID clusters the subject of behavioral prose.

## 8. Data, State, Identity, and Ownership

Authoritative facts, unique writers, readers, lifecycle, persistence responsibility, consistency, ordering, idempotency, concurrency, identity, and content/lineage relationships.

## 9. Interfaces, Dependencies, Seams, and Adapters

Caller-visible inputs, outputs, invariants, ordering, errors, configuration and performance characteristics; dependency categories; seam placement; Adapter justification; compatibility expectations.

## 10. Failure, Recovery, and System-wide Behavior

Failure domains, propagation/containment, retry, compensation, degradation, cancellation, restart, reconciliation, recovery ownership, and cross-Module invariants.

## 11. Quality Attribute Realization

For each relevant quality scenario, show project context, required outcome/Fitness Threshold, architectural mechanism, trade-off, residual risk, and verification method. Cover only applicable performance/responsiveness, capacity/scalability, reliability/recovery, consistency/concurrency, security/trust/privacy, observability/operability, maintainability/evolvability, compatibility/portability, and cost/resource-efficiency concerns. A `NOT_APPLICABLE` conclusion requires a contextual reason.

## 12. Risks and Trade-offs

Constraints under which the design holds, failure/overdesign risks, probability/impact where useful, mitigation or acceptance, owner, evidence need, and reopen condition.

## 13. Acceptance and Verification

Maintain the trace:

```text
Problem/Goal → Scenario → Design Driver → Decision/Mechanism
→ Expected Outcome → Verification Method → Acceptance Evidence
```

Separate Design Acceptance from the Implementation Acceptance Plan. Distinguish known Fitness Thresholds from empirical parameters and their lifecycle.

## 14. Decisions, Open Work, and Rejected Alternatives

Decision register, rejected directions and reasons, unresolved/deferred items, design-owned Spike results/requests, downstream obligations, runtime-tuning handoffs, owner, semantic dependency, evidence, return location, and design-reopen threshold.

For each downstream obligation use the semantic shape in `schemas/downstream-obligation.schema.md`; any suggested consumer is guidance rather than downstream Workflow authority.

## 15. Module Deepening and Implementation Handoff

Recommended Module Detailed Design order, dependency reason, available contracts/parameters, typed downstream obligations, prohibited reinterpretations, test-stage measurement needs, and feedback path that may create a new System Design version. State required semantics and reopen conditions without prescribing a downstream Workflow's Action, Gate or terminal.

## Document Completion Check

- [ ] Metadata binds the exact Confirmed Brief/Skeleton content identities, authoritative source commit/blob identities, authority order, and lineage without requiring disposable files.
- [ ] Problem, goals, scope, non-goals, Project Context, and Design Drivers are explicit and traceable.
- [ ] Problem decomposition precedes and justifies the Module structure.
- [ ] Every Module explains responsibility, complexity hidden, Interface intent, state ownership, and dependency direction.
- [ ] Every important scenario has an understandable collaboration/state path and appropriate view.
- [ ] A reader can explain the successful core and named branch scenarios without decoding stable IDs; detailed identities remain easy to locate afterward.
- [ ] Interfaces and system-wide failure, recovery, concurrency, consistency, identity, and lifecycle rules are caller-complete at System Design level.
- [ ] Every fixed quality direction is addressed through a relevant scenario or a project-specific `NOT_APPLICABLE` reason; no generic checklist machinery is added without a driver.
- [ ] Risks and trade-offs identify conditions, impact, owner, mitigation/acceptance, and reopen trigger where applicable.
- [ ] Acceptance traces important problems/scenarios through mechanism, expected outcome, method, and evidence state.
- [ ] Architecture-feasibility and design-owned parameter Spikes are closed; downstream and runtime-tuning handoffs are owner-complete and do not claim unexecuted evidence.
- [ ] Handoffs preserve required design semantics without prescribing downstream Action, Gate, Wait, classification or terminal authority.
- [ ] Decisions, deferred/open work, rejected alternatives, Module deepening order, and implementation handoff are internally consistent.
- [ ] No authoring placeholder, hidden conversation dependency, unmarked assumption, or claim of unexecuted evidence remains.
- [ ] The final Design contains no required link to a run-workspace Brief, Draft, treatment, review, question set, validator report, or freeze manifest.

A whole section may be omitted only when the template explicitly allows consolidation elsewhere and traceability remains clear. A topic that is irrelevant must carry a contextual `NOT_APPLICABLE` rationale at its natural location; empty headings and generic boilerplate do not satisfy completion.
