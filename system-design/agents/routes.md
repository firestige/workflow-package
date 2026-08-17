# Agent Route Catalog

This file records design-time route bindings. It is not a Runtime schema. Exact model, Driver, tool, and content identities must be supplied by the future machine-readable Package Snapshot.

## Composition

Every route composes resources in this authority order:

1. Workflow/Action authority;
2. Role prompt;
3. Action prompt;
4. Skill instructions;
5. Artifact inputs and user content.

Sessions are fresh for every formal Review, for System Designer after Brief freeze, and for local grilling after a Brief Change Request. A multi-turn Human Decision Dialogue may resume only within the same admitted decision identity and evidence binding.

## Routes

| Route | Role | Actions | Skills | Access/session |
| --- | --- | --- | --- | --- |
| `facilitator.standard` | Grilling Facilitator | SD-01, SD-02, SD-03, Brief branch of SD-11H | referenced `grilling` | repository read; ignored run-workspace Brief write; fresh per formal grilling episode |
| `scout.evidence` | Evidence Scout | SD-01R | no method Skill; bounded research prompt | repository/authorized source read-only; fresh per research request |
| `designer.standard` | System Designer | SD-04, SD-06 design-owned Spike request/result, SD-07, SD-08, SD-11, SD-12 downstream handoff classification | owned `system-design-authoring`; referenced `codebase-design` when structure is in scope | repository read; ignored run-workspace artifact write; fresh after Brief freeze |
| `reviewer.architecture` | Architecture Reviewer | SD-05, SD-09 architecture lens, architecture recheck | owned `architecture-review`; referenced `codebase-design` | read-only; fresh per review/recheck |
| `reviewer.problem-solution` | Problem–Solution Reviewer | SD-09 problem lens and recheck | owned `problem-solution-review` | read-only; fresh per review/recheck |
| `reviewer.quality` | Quality & Acceptance Reviewer | SD-09 quality lens and recheck | owned `quality-acceptance-review` | read-only; fresh per review/recheck |
| `aggregator.standard` | Finding Aggregator | SD-10 | no method Skill; Workflow/schema rules only | review-artifact read; disposition-result write; fresh |
| `facilitator.decision` | Grilling Facilitator | Human Decision branch of SD-11H | referenced `grilling` | evidence read; decision-artifact write; resumable only within admitted dialogue |
| `reader.fresh` | Fresh Reader | SD-13 | no method Skill; Action prompt/question schema only | candidate Design read-only; context-isolated fresh session |

## Binding Index

| Route | Role prompt | Action prompts | Skill sources |
| --- | --- | --- | --- |
| `facilitator.standard` | [`grilling-facilitator.role.md`](../roles/grilling-facilitator.role.md) | [`intake-and-authority`](../prompts/actions/intake-and-authority.prompt.md), [`adaptive-grilling`](../prompts/actions/adaptive-grilling.prompt.md) | External shared `grilling` |
| `scout.evidence` | [`evidence-scout.role.md`](../roles/evidence-scout.role.md) | [`evidence-research`](../prompts/actions/evidence-research.prompt.md) | none |
| `designer.standard` | [`system-designer.role.md`](../roles/system-designer.role.md) | [`produce-skeleton`](../prompts/actions/produce-skeleton.prompt.md), [`prepare-spike-request`](../prompts/actions/prepare-spike-request.prompt.md), [`apply-spike-result`](../prompts/actions/apply-spike-result.prompt.md), [`classify-downstream-handoffs`](../prompts/actions/classify-downstream-handoffs.prompt.md), [`expand-system-design`](../prompts/actions/expand-system-design.prompt.md), [`integrate-draft`](../prompts/actions/integrate-draft.prompt.md), [`targeted-revision`](../prompts/actions/targeted-revision.prompt.md) | [`system-design-authoring`](../skills/system-design-authoring/SKILL.md), [shared `codebase-design`](../../../../.agents/skills/codebase-design/SKILL.md) |
| `reviewer.architecture` | [`architecture-reviewer.role.md`](../roles/architecture-reviewer.role.md) | [`architecture-direction-review`](../prompts/actions/architecture-direction-review.prompt.md), [`architecture-review`](../prompts/actions/architecture-review.prompt.md) | [`architecture-review`](../skills/architecture-review/SKILL.md), [shared `codebase-design`](../../../../.agents/skills/codebase-design/SKILL.md) |
| `reviewer.problem-solution` | [`problem-solution-reviewer.role.md`](../roles/problem-solution-reviewer.role.md) | [`problem-solution-review`](../prompts/actions/problem-solution-review.prompt.md) | [`problem-solution-review`](../skills/problem-solution-review/SKILL.md) |
| `reviewer.quality` | [`quality-reviewer.role.md`](../roles/quality-reviewer.role.md) | [`quality-acceptance-review`](../prompts/actions/quality-acceptance-review.prompt.md) | [`quality-acceptance-review`](../skills/quality-acceptance-review/SKILL.md) |
| `aggregator.standard` | [`finding-aggregator.role.md`](../roles/finding-aggregator.role.md) | [`aggregate-findings`](../prompts/actions/aggregate-findings.prompt.md) | none |
| `facilitator.decision` | [`grilling-facilitator.role.md`](../roles/grilling-facilitator.role.md) | [`human-decision-dialogue`](../prompts/actions/human-decision-dialogue.prompt.md) | External shared `grilling` |
| `reader.fresh` | [`fresh-reader.role.md`](../roles/fresh-reader.role.md) | [`fresh-reader-test`](../prompts/actions/fresh-reader-test.prompt.md) | none |

## Route Invariants

- An Action exposes only the routes listed for it; no ambient/default Agent substitution.
- Review routes cannot write the Brief, Skeleton, or Design.
- The three SD-09 routes start from the same admitted Draft lineage but cannot receive each other's analysis before the barrier closes.
- Recheck is performed by the same Role/lens, not necessarily the same model instance, and always uses a fresh session.
- Model or Driver escalation cannot expand authority or bypass a Gate.
