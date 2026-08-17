# System Design Skeleton

## Metadata and Dependencies

- Skeleton identity and status:
- Confirmed Brief identity, content digest, and referenced topic identities:
- Upstream authorities:
- Target System Design path:

## Problem, Goal, and Boundary

State the system-level problem, desired outcome, actors, scope, non-goals, and project context that materially shape the direction.

## Design Drivers

Map key scenarios, constraints, quality expectations, Fitness Thresholds, risks, and expected evolution to their architectural consequences.

## Problem Decomposition

Explain how the large problem is decomposed into smaller cohesive problems before naming Modules. Show why the decomposition is sufficient and where complexity belongs.

## Candidate and Selected System Structure

Use multiple candidates only when a real ownership, seam, state, dependency, or quality trade-off exists. For the selected direction describe each Module's purpose, complexity hidden, Interface intent, state ownership, dependencies, and deletion-test result.

## Key Collaboration Paths

Outline how each critical scenario crosses Actors and Modules, including failure/recovery where it changes structure.

## State, Data, and Authority

Identify authoritative state, unique writer, readers, lifecycle, correlation, consistency expectations, and external facts.

## Quality Attribute Influence

Explain how relevant quality scenarios shape Module boundaries, control/data flow, failure domains, seams, deployment assumptions, or acceptance strategy. Do not append generic tactics without project-context justification.

## View Plan

| View ID | Question answered | Scenario | View type | Required elements | Target section |
| --- | --- | --- | --- | --- | --- |
| `[VIEW-ID]` | `[question]` | `[scenario]` | `[diagram type]` | `[actors/modules/state]` | `[section]` |

## Feasibility and Parameter Classification

Classify unknown measurements as architecture feasibility, design-owned parameter, downstream obligation, or runtime tuning. Architecture feasibility must close before expansion; downstream lifecycle routing is not owned here.

## Decisions, Risks, and Rejected Directions

Record selected direction, rationale, alternatives, accepted trade-offs, risks, and the Brief/driver evidence behind each choice.

## Expansion Plan

List the reasoning-order checkpoints for the single System Designer writer and the dependencies between them.

## Direction Review Record

- Review artifact identity:
- Blocking/Major Finding state:
- Feasibility Spike state:
- `SKELETON_CONFIRMED` evidence:
