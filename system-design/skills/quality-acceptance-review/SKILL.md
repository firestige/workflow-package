---
name: quality-acceptance-review
description: Independently review contextual quality attributes, risk, measurement lifecycle, and acceptance for both under-design and over-design.
---

# Quality & Acceptance Review

## Boundary

This Skill is read-only and project-context driven. The outer Workflow owns routing, Human Decision admission, revision, and closure. Do not substitute a generic enterprise checklist for confirmed actors, trust, scale, lifecycle, and operating capability.

## Context First

Reconstruct the Project Context Profile before judging mechanisms: users/team, deployment/network, trust assumptions, workload/data scale, availability/recovery tolerance, operating capability, compliance, dependencies, lifecycle, evolution, and explicitly unpursued properties.

For each common quality topic—performance/responsiveness, capacity/scalability, reliability/recovery, consistency/concurrency, security/trust/privacy, observability/operability, maintainability/evolvability, compatibility/portability, and cost/resource efficiency—verify that it has a contextual state and reason. Silence is not `NOT_APPLICABLE`.

## Scenario-to-Mechanism Review

For each relevant quality scenario verify:

```text
context/stimulus
→ expected outcome or Fitness Threshold
→ architectural consequence
→ concrete design mechanism
→ trade-off/residual risk
→ verification method and evidence
```

The mechanism must be specific enough to guide downstream design without prematurely specifying internal implementation.

## Measurement Lifecycle

- Fitness Thresholds have authority, experience, contract, or scenario reasoning.
- Architecture-feasibility Spikes close before expansion.
- Design-owned parameters close before `IMPLEMENTATION_READY`; implementation-owned parameters are explicit handoffs whose downstream lifecycle is not frozen here.
- Runtime-tuning parameters have test owner, workload/method, return location, and design-reopen threshold.
- Downstream obligations preserve semantic dependencies and reopen conditions without prescribing another Workflow's Action, Gate or terminal.
- Precise values without evidence are Findings, not confidence.

## Under-design and Over-design

Under-design includes missing failure/recovery, capacity path, trust boundary, observation, compatibility, or evidence needed by confirmed scenarios.

Over-design includes mechanisms whose cost/complexity lacks a project-context driver: for example multi-tenant RBAC, comprehensive audit, distributed coordination, or speculative extensibility in a trusted small-team local deployment.

Admit either only with exact evidence and concrete impact. Simplicity alone is not a defect; sophistication alone is not quality.

## Acceptance Review

Verify both:

- Design Acceptance: the artifact is coherent, reviewed, traceable, and sufficient for Module Detailed Design/implementation.
- Implementation Acceptance Plan: future contract, integration, load, fault-injection, operational, or human checks can produce evidence for the stated outcomes.

No planned future check may be reported as already passed.
