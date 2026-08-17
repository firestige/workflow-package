# Confirmed System Design Brief

> This artifact records shared understanding before formal architecture decisions. It is frozen after explicit user confirmation.

## Metadata

| Field | Value |
| --- | --- |
| Brief ID | `[BRIEF-ID]` |
| Status | `WORKING | CONFIRMED | SUPERSEDED` |
| Run-workspace content digest | `[digest]` |
| Authority source commit/blob | `[OID(s), when Git-managed]` |
| Supersedes | `[Brief identity or N/A]` |
| Target System Design | `[path/identity]` |

## Decision-oriented Summary

[Concise statement of the problem, most important scenarios, scope, project context, quality priorities, accepted trade-offs, non-blocking unknowns, and likely misunderstandings.]

## Topic Directory

| Topic ID | Topic | Status | One-line conclusion | Link |
| --- | --- | --- | --- | --- |
| `BR-PROBLEM` | Problem and desired outcome | `[status]` | `[conclusion]` | [Details](#br-problem) |
| `BR-SCENARIOS` | Users, actors, and scenarios | `[status]` | `[conclusion]` | [Details](#br-scenarios) |
| `BR-CONTEXT` | Project Context Profile | `[status]` | `[conclusion]` | [Details](#br-context) |
| `BR-SCOPE` | Scope and non-goals | `[status]` | `[conclusion]` | [Details](#br-scope) |
| `BR-CONSTRAINTS` | Decisions and constraints | `[status]` | `[conclusion]` | [Details](#br-constraints) |
| `BR-QUALITY` | Quality scenarios | `[status]` | `[conclusion]` | [Details](#br-quality) |
| `BR-RISKS` | Risks and assumptions | `[status]` | `[conclusion]` | [Details](#br-risks) |
| `BR-ACCEPTANCE` | Acceptance intent | `[status]` | `[conclusion]` | [Details](#br-acceptance) |
| `BR-OPEN` | Classified unknowns | `[status]` | `[conclusion]` | [Details](#br-open) |

Allowed topic states: `CONFIRMED`, `DERIVABLE`, `DESIGN_EXPLORATION`, `TO_BE_MEASURED`, `DEFERRED`, `USER_DECISION_REQUIRED`, `BLOCKED`, or reasoned `NOT_APPLICABLE`.

The nine Topic Directory rows are the fixed topics. Relevant subtopics—especially each common quality direction—must also have an explicit state. A design-significant `DERIVABLE` item must be researched before confirmation; a non-blocking one may remain only with an admitted research owner and return Action. `BLOCKED` cannot pass confirmation into design.

## Detailed Topics

<a id="br-problem"></a>
### Problem and Desired Outcome (`BR-PROBLEM`)

- Current situation and why it is a problem:
- Who experiences the problem:
- Desired system-level outcome:
- Why a system change is justified:
- Pressure-tested counterexamples or rejected interpretations:
- Evidence and authority:

[Back to Topic Directory](#topic-directory)

<a id="br-scenarios"></a>
### Users, Actors, and Scenarios (`BR-SCENARIOS`)

For each scenario record actor, trigger, context, expected outcome, important exceptions, tolerated failure/degradation, priority, and acceptance observation. Cover normal, boundary, failure, cancellation/recovery, and future-change scenarios only where relevant.

[Back to Topic Directory](#topic-directory)

<a id="br-context"></a>
### Project Context Profile (`BR-CONTEXT`)

- User/team size and skills:
- Deployment and network environment:
- Trust boundary and threat assumptions:
- Workload, data scale, and growth expectation:
- Availability, loss, and recovery tolerance:
- Operational and maintenance capability:
- Compliance obligations:
- External dependency conditions:
- Product lifecycle stage:
- Expected evolution:
- Engineering properties explicitly not pursued:

[Back to Topic Directory](#topic-directory)

<a id="br-scope"></a>
### Scope and Non-goals (`BR-SCOPE`)

- System owns:
- System does not own:
- External actors/systems and their authority:
- Boundary cases that were explicitly discussed:

[Back to Topic Directory](#topic-directory)

<a id="br-constraints"></a>
### Inherited Decisions, Preferences, and Constraints (`BR-CONSTRAINTS`)

For each item record stable ID, statement, source/authority, rationale, strength, and affected scenarios. Separate authoritative constraints from brainstorming preferences.

[Back to Topic Directory](#topic-directory)

<a id="br-quality"></a>
### Quality Scenarios (`BR-QUALITY`)

Evaluate performance/responsiveness, capacity, reliability, recovery, consistency, concurrency, security/trust, privacy, observability, operability, maintainability, evolvability, compatibility, portability, and cost/resource efficiency. Do not ask abstract checklist questions; derive scenario-specific expectations from Intake and Project Context.

For each relevant topic record stimulus/context, expected response, priority, Fitness Threshold if known, tolerated degradation, evidence source, and unknown state. `NOT_APPLICABLE` requires a project-specific reason.

[Back to Topic Directory](#topic-directory)

<a id="br-risks"></a>
### Risks, Assumptions, and Trade-offs (`BR-RISKS`)

- What the user most fears getting wrong:
- Assumptions on which the design may rely:
- Known tensions between goals or qualities:
- Risks explicitly accepted during grilling:
- Conditions that require reopening this Brief:

[Back to Topic Directory](#topic-directory)

<a id="br-acceptance"></a>
### Acceptance Intent (`BR-ACCEPTANCE`)

For each important problem/scenario describe what observable result would convince the user it is solved. Separate known Fitness Thresholds from empirical parameters requiring measurement or Spike.

[Back to Topic Directory](#topic-directory)

<a id="br-open"></a>
### Classified Unknowns (`BR-OPEN`)

| ID | Exact unknown | State | Owner | Blocks | Required evidence | Return location |
| --- | --- | --- | --- | --- | --- | --- |
| `[ID]` | `[question]` | `[state]` | `[owner]` | `[impact]` | `[evidence]` | `[topic/action]` |

[Back to Topic Directory](#topic-directory)

## Closure Check

- [ ] All fixed topics have content or a reasoned state.
- [ ] No design-significant `DERIVABLE`, `USER_DECISION_REQUIRED`, or `BLOCKED` item remains.
- [ ] No unexplained contradiction remains.
- [ ] Project context and quality expectations are consistent.
- [ ] All unknowns have type, owner, evidence need, blocks, and return location.
- [ ] Decision-oriented Summary highlights likely misunderstandings.
- [ ] User explicitly confirmed the whole Brief.

## Confirmation Record

- Confirmed by:
- Confirmation time/reference:
- Explicit confirmation statement:
- Frozen Brief content digest and authority bindings:
