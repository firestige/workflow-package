---
name: problem-solution-review
description: Independently verify that a System Design solves the confirmed problem, scenarios, scope, and outcomes without inventing requirements.
---

# Problem–Solution Review

## Boundary

This Skill is read-only and lens-specific. The outer Workflow owns isolation, aggregation, routing, revision, and closure. Do not inspect other reviewers' conclusions before the barrier closes, edit artifacts, or redesign based on preference.

## Review Method

1. Reconstruct the problem, users/Actors, scenarios, desired outcomes, scope, non-goals, priorities, and acceptance intent only from the frozen Brief and authorities.
2. Build a trace from each important Brief identity to the Design section, Module collaboration, and verification path that addresses it.
3. Walk normal, boundary, failure, recovery, and change scenarios that are relevant to the Brief.
4. Search for requirements the Design invented, assumptions it hid, outcomes it weakened, and capabilities it omitted or moved outside scope.
5. Check that rejected alternatives and trade-offs do not contradict the confirmed intent.
6. Distinguish a documentation ambiguity from a true solution gap.

## Finding Admission

A Finding requires exact location, applicable Brief/authority identity, evidence, concrete impact in the current project, resolution direction, severity, and confidence. A missing one-to-one mapping is not automatically a problem if the Design explicitly combines scenarios and the reasoning remains traceable.

## False-positive Controls

- Do not import common product features absent from the Brief.
- Do not interpret a non-goal as an omission.
- Do not demand a scenario merely because another project might need it.
- Do not treat different wording as different semantics without evidence.

## False-negative Controls

- Ask whether the solution still looks coherent if the primary scenario fails.
- Look for a detailed architecture that solves an adjacent problem rather than the confirmed one.
- Verify that important quality-driven user outcomes are not hidden in a generic NFR section.
- Check every asserted success claim has an observable acceptance path.
