# Workflow Composition Conformance Review

本审查按 [`docs/workflow-composition-model-2.0.0-candidate.md`](https://github.com/firestige/workflow-self-recursive/blob/03f216bdedc3ecf272b2b8321169edc180b4b60f/docs/workflow-composition-model-2.0.0-candidate.md) 的设计顺序、不变量和十三项验收问题检查 Implementation Workflow `0.4.1-design`。状态含义：

- `DESIGN_CLOSED`：Package 已给出明确设计答案；
- `IMPLEMENTATION_REQUIRED`：设计已闭合，但需要 Contract/Execution/Runtime/CLI 实现和证据；
- `CONFIRMED_DECISION`：Package owner 已显式确认的 authority 边界。

## Acceptance Matrix

| # | Composition question | State | Package evidence / remaining obligation |
| --- | --- | --- | --- |
| 1 | Problem, success and terminals | `DESIGN_CLOSED` | [`workflow.md`](workflow.md) §§1–2,14 |
| 2 | Action decomposition and boundaries | `DESIGN_CLOSED` | `workflow.md` Action Catalog; [`execution-guide.md`](execution-guide.md) |
| 3 | Successors and selection authority | `DESIGN_CLOSED` | `workflow.md` Transition Authority; deterministic selector vs declared Agent Role |
| 4 | Responsible Role/routes/escalation | `DESIGN_CLOSED` | [`agents/routes.md`](agents/routes.md); writer/review isolation |
| 5 | Exact Agent/model/tool/Driver bindings | `IMPLEMENTATION_REQUIRED` | [`package-snapshot.schema.md`](schemas/package-snapshot.schema.md) closes required shape; production identities await Contract/Snapshot resolution |
| 6 | Package index and resource discovery | `DESIGN_CLOSED` | [`README.md`](README.md) resource and owned/referenced indexes |
| 7 | Artifact templates/lifecycle/dependency/revalidation | `DESIGN_CLOSED` | [`artifact-lifecycle.md`](artifact-lifecycle.md), Artifact/dependency/manifest schemas and templates |
| 8 | Immutable Snapshot vs mutable State | `DESIGN_CLOSED` | schemas separate both; `IM-DEC-001` confirms runtime-less execution is validation-only simulation |
| 9 | Result/Review/Finding/budget/Wait/recovery/terminal checks | `DESIGN_CLOSED`; `IMPLEMENTATION_REQUIRED` for full proof | semantic schemas, CLI Gates and conformance corpus; remaining cases need executable fixtures |
| 10 | Human intervention admission | `DESIGN_CLOSED` | adaptive grilling, evidence-first rule, one decision/wait binding and external coordination |
| 11 | Missing resource/illegal transition/fallback/drift | `DESIGN_CLOSED`; `IMPLEMENTATION_REQUIRED` for enforcement | fail-closed Snapshot/manifest rules and negative/recovery conformance |
| 12 | Runtime/Driver replacement invariants | `DESIGN_CLOSED` | Workflow/Package/Artifact semantics contain no LangGraph-specific field |
| 13 | Cross-Workflow handoff authority | `DESIGN_CLOSED` | upstream semantics/reopen conditions are preserved; this Package owns obligation classification, Actions, Gates and terminal effects |

## Implementation Obligations, Not Design Questions

1. Publish the versioned Workflow/Package Contract and machine-readable Definition/manifest.
2. Implement Package Snapshot resolver/validator with exact route and executable resource binding.
3. Implement Artifact workspace custody: init, register, verify, impact propagation, checkpoint verification and disposition-aware cleanup planning.
4. Bind Managed Runtime/Workspace generic interfaces without adding Implementation-specific Runtime tools.
5. Convert remaining multi-Goal, Snapshot, lineage, Wait/recovery and cleanup conformance scenarios into executable fixtures.
6. Qualify actual Agent/model/tool/Driver/session bindings and prove no ambient fallback.

These obligations may block formal activation but do not require Product/Package owner preference to finish the design.

## Confirmed Authority Decision

### `IM-DEC-001` Runtime-less execution is validation-only

Two confirmed sources currently pull in different directions:

- Composition model: Selected Runtime Profile is the only Workflow State writer and terminal authority.
- Prior Implementation Workflow decision: the Workflow should still be runnable entirely by Agents without Runtime, with weaker control.

The Package owner confirmed that Agent-only execution is `UNMANAGED_SIMULATION`: it can validate every Action/resource and produce simulation results, but cannot publish formal `VERIFIED_IMPLEMENTATION_READY`, durable Wait or resumable Managed checkpoint.

Formal Delivery may use any Contract-conforming generic Runtime Profile, including a future minimal local implementation; it does not require LangGraph and cannot add Implementation-specific Runtime semantics. No additional Runtime-specific composition amendment is required. This closes the execution-mode authority decision for `0.4.1-design`.
