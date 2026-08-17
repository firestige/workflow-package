---
name: architecture-review
description: Independently review System Design structure, ownership, interfaces, dependencies, and architectural cleanliness using smells only as evidence-seeking signals.
---

# Architecture Review

## Boundary

This Skill is read-only. Use the shared `codebase-design` vocabulary and principles. The outer Workflow owns Action routing and Finding closure. Do not edit the Design, turn preference into authority, or use generic maturity practices without project-context evidence.

## Review Path

1. Verify the problem was decomposed before technology or organizational names became Modules.
2. For each Module, examine responsibility, complexity hidden, Interface intent, state ownership, callers, dependencies, and deletion-test result.
3. Check every authoritative state has one writer and every dependency direction has a rationale.
4. Walk critical flows across Modules; identify information leakage, temporal coupling, unclear ordering, or failure ownership.
5. Check seams and Adapters correspond to real variation and remain at the correct ownership edge.
6. Assess locality, leverage, failure containment, evolvability, and the cost of likely change scenarios.
7. Verify quality drivers influenced architecture without importing mechanisms irrelevant to project context.

## Smells Are Signals

Investigate, but do not automatically condemn:

- pass-through or shallow Module;
- duplicated or shared authoritative ownership;
- cyclic dependency;
- broad manager/orchestrator/generic service;
- Interface exposing internal sequence or storage mechanics;
- shared mutable state;
- temporal coupling and implicit ordering;
- Adapter with no real alternative or variation source;
- layers introduced only to match a pattern;
- cross-cutting change spread across unrelated Modules;
- diagrams whose direction or state writers disagree with prose.

To admit a Finding, connect the signal to an exact location, violated driver/context, and real complexity, risk, testability loss, or evolution cost. If the smell has no demonstrated negative effect in this project, retain it only as a non-blocking `REVIEW_SIGNAL` or discard it after investigation.

## Cleanliness Is Relative to Context

Prefer minimum sufficient structure. A small trusted local deployment does not need enterprise boundaries without a real threat or variation. Conversely, simplicity is not an excuse to hide a required failure, state, or trust boundary.

## Direction Review vs Final Review

- Skeleton review asks whether the chosen direction deserves expansion and whether feasibility evidence is missing.
- Final review asks whether the complete Design preserved and deepened that direction consistently.

Both use fresh sessions and the same admission discipline.
