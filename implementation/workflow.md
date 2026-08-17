# Implementation Workflow Definition

## 1. 目标、输入与终态

本 Workflow 将一个精确冻结、具备实现授权的设计及其已发布依赖，转化为特性分支上的 `VERIFIED_IMPLEMENTATION_READY` 候选变更。候选包含全部 in-scope Goal 的生产资产、正式测试、fixture、必要配置/文档和绿灯 commit，不包含默认 merge、push、PR 或部署。

起始输入必须绑定：

- 一个 `IMPLEMENTATION_READY` 上游设计版本及其内容身份；
- 本次实现范围；
- 设计引用的可用 Contract、Detailed Design，以及带 owner、语义依赖和 reopen 条件的下游义务；
- 一个干净 Git baseline；
- 可推导并冻结的 Project Context Snapshot 与 Harness Binding。

成功终态只有 `VERIFIED_IMPLEMENTATION_READY`。红灯或阻塞下预算耗尽进入可恢复 `INCOMPLETE`；明确取消进入 `CANCELLED`；不可重试的配置/执行失败进入 `FAILED`。`WAITING_FOR_USER` 和 `WAITING_FOR_EXTERNAL` 是非终态 Wait。

一个 Delivery 永远绑定一个设计版本。测试表达可以在不改变设计语义时按本 Workflow 修订；任何目标、scope、Project Context 或上游设计语义变化都停止当前 Delivery，并要求新 Delivery。

## 2. Applicability Boundary

Workflow 只实现能编码为可靠负反馈的 Goal。复杂 UI 交互拆解、产品发现和缺失架构属于上游工作。Goal 进入 Test Ladder 前必须具有：

- 稳定前置状态、输入、预期输出和可观察副作用；
- 可重复 Oracle 或预先定义的统计判定；
- 适用 Project Context、scope/non-goal 和质量边界；
- 可运行、隔离且安全的 Harness；
- 跨 owner Interface/Contract 已发布；或 implementation-owned 内部 Interface 具有冻结语义、可重复 Oracle 和明确 writer；
- owner、依赖和整体完成位置。

Goal 分类为：

| State | Meaning | Behavior |
| --- | --- | --- |
| `READY` | 输入、Oracle、Harness 和依赖足以测试 | 可按 Goal Graph 选择 |
| `NEEDS_GOAL_REFINEMENT` | 测量标准或行为仍含糊 | 进入 grilling；不得实现 |
| `NEEDS_EVIDENCE` | 可查证事实未闭合 | `IM-01R` 后重新分类 |
| `NEEDS_TEST_HARNESS` | 缺少可靠测试基础设施 | 建立显式 Harness Goal |
| `BLOCKED_BY_DESIGN_GAP` | 冻结设计明确委托的下游架构/Detailed Design 缺失 | 发布 Coordination Request；等待外部结果 |
| `BLOCKED_BY_EXTERNAL_CONTRACT` | 跨 owner Contract 尚未发布 | 只阻塞依赖该 Contract 的 Goal；发布 Coordination Request |
| `BLOCKED_BY_DEPENDENCY` | 上游 Goal 尚未完成 | 等待依赖 commit |
| `OUT_OF_SCOPE` | 不属于本次实现范围 | 不计入终态 |

`READY` Goal 不被无依赖的未准备 Goal 阻塞；任何仍属于 in-scope 的未完成 Goal 都阻止整体成功。

上游 obligation 的类型与 Goal 当前状态是两个正交维度。Implementation Workflow 在 Intake 中把每项义务分类为：

| Obligation class | Meaning | Lifecycle |
| --- | --- | --- |
| `CONTRACT_PREREQUISITE` | 跨 owner、版本化 Contract 是可靠 Oracle/集成的前提 | 缺失时只阻塞依赖 Goal；通过外部协调取得 |
| `IMPLEMENTATION_FEASIBILITY` | 依赖版本、SDK/API 或本地 substrate 是否适合实现 | `IM-02V` 在 Goal freeze/TDD 前校准 |
| `IMPLEMENTATION_VERIFICATION` | 证据必须由当前实现及其 conformance/fault tests 产生 | 映射到 Test Ladder、Goal review 和 whole-scope verification |
| `OPERATIONAL_TUNING` | 只有可运行候选和代表性环境才能测量的配置值 | 保留 handoff；除非存在冻结 Fitness Threshold，否则不阻止实现候选 |

分类不能弱化上游语义或把未执行证据写成已通过。若可行性、验证或调优结果跨越上游记录的 design-reopen condition，当前 Delivery 停止并请求新设计版本。Runtime 内部 Interface 可以作为实现 Goal 演进；跨 owner Contract 不能由 Implementer 单方面发明。

## 3. Transition Authority

面向人的分层流程图与说明见 [`execution-guide.md`](execution-guide.md)。本节是 AI/执行器使用的确定性 successor authority；图示不得覆盖本表。

| Current Action/state | Valid condition/result | Successor |
| --- | --- | --- |
| `IM-01` | authority, exact design identity and working Obligation Register bound | `IM-02` |
| `IM-01` / any fact-consuming Action | admitted derivable fact missing | `IM-01R`, then recorded requesting Action |
| `IM-02` | Preflight passed and feasibility obligations exist | `IM-02V` |
| `IM-02` | Preflight passed and no feasibility obligation exists | `IM-03` |
| `IM-02V` | all implementation-feasibility obligations calibrated | `IM-03` |
| `IM-02V` | conclusive result pending with new diagnostic progress | `IM-02V` |
| `IM-02V` | required external authority/environment unavailable | `WAITING_FOR_EXTERNAL`, then `IM-02V` |
| `IM-02V` | result crosses a design-reopen condition | stop current Delivery; require new design/Delivery |
| `IM-03` | one measurement/intent answer required | `WAITING_FOR_USER`, then `IM-03` |
| `IM-03` | all candidates classified | `IM-04` |
| `IM-04` | confirmation or correction required | `WAITING_FOR_USER` or `IM-03` |
| `IM-04` | whole Goal Graph confirmed and frozen | `IM-05` |
| `IM-05` | branch activated from clean baseline | `IM-06` |
| `IM-06` | one Goal/rung ready | `IM-07` |
| `IM-06` | selected Goal requires a missing cross-owner Contract/design artifact | `WAITING_FOR_EXTERNAL`, then `IM-03` after compatible result |
| `IM-06` | all in-scope Goals committed | `IM-17` |
| `IM-07` | calibrated RED or discriminating existing-GREEN proof | `IM-08` |
| `IM-07` | feedback reveals Goal/Oracle ambiguity | `IM-03` |
| `IM-08` | still expected RED with diagnostic progress | `IM-08` |
| `IM-08` | current rung GREEN | `IM-09` |
| `IM-09` | branch test introduces expected RED | `IM-08` |
| `IM-09` | applicable branches closed | `IM-10` |
| `IM-10` | regression introduced | `IM-08` |
| `IM-10` | GREEN or `NO_REFACTOR_NEEDED` | `IM-11` |
| `IM-11` | another rung remains | `IM-07` |
| `IM-11` | complete Test Ladder verified | `IM-12` |
| `IM-11` | invalid feedback or exact prior-stage failure | recorded owning Action |
| `IM-12` | both isolated reviews reach barrier | `IM-13` |
| `IM-13` | no Goal-scope Finding | `IM-16` |
| `IM-13` | test-side / implementation-side Finding | `IM-14T` / `IM-14I` |
| `IM-14T` / `IM-14I` | treatment recorded | `IM-15` |
| `IM-15` | Finding remains open | `IM-13` |
| `IM-15` | Goal-scope Finding closed | `IM-16` |
| `IM-15` | whole-scope Finding closed | `IM-17` |
| `IM-16` | verified Goal committed | `IM-06` |
| `IM-17` | whole-scope Finding admitted | `IM-13` |
| `IM-17` | regression and both reviews pass | `IM-18` |
| `IM-18` | terminal Gate passes | `VERIFIED_IMPLEMENTATION_READY` |

Any active Action may enter `INCOMPLETE` on budget exhaustion, `CANCELLED` on explicit cancellation, or `FAILED` on a non-retryable configuration/execution failure. A design-semantic change stops the current Delivery rather than substituting new authority. The Goal Loop is `IM-06` through `IM-16`; its Test Ladder Loop is `IM-07` through `IM-11`. Neither is a nested Workflow.

## 4. Action Catalog

### IM-01 Intake and Authority Scan

- **Role:** Goal Facilitator; read-only Evidence Scouts may support facts.
- **Purpose:** bind exact design identity, authority order, target scope and repository context; classify every upstream handoff obligation without converting derivable facts into questions or accepting upstream control over this Workflow's lifecycle.
- **Gate:** no ambient design/current-file substitution; a non-ready or contradictory design fails closed.

### IM-01R Bounded Evidence Research

- **Role:** Evidence Scout, read-only.
- **Purpose:** resolve one repository/manual/tool fact and return only to its recorded Action.
- **Prohibited:** decisions, writes, Goal changes, Workflow launch.

### IM-02 Implementation Preflight

- **Role:** Delivery Custodian using package CLI; Goal Facilitator consumes the result.
- **Checks:** clean worktree, design status/identity, project-native build/test/coverage/static commands, safe test isolation, obligation classification completeness, Contract availability facts for later Goal mapping, and tool/permission availability needed to run admitted feasibility checks.
- **Output:** Preflight Report and candidate Harness Binding.
- **Gate:** missing Harness becomes an explicit Goal; an unavailable Contract is recorded for IM-03 and does not fail global Preflight when safe Goal classification remains possible; unsafe, unclassified or unmeasurable conditions cannot be waived by an Agent.

### IM-02V Implementation Feasibility Validation

- **Role:** Implementation Feasibility Validator using the frozen Harness `feasibility` phase and admitted authoritative sources.
- **Purpose:** resolve implementation-owned version/SDK/substrate questions before Goal freeze without making architecture decisions or writing repository deliverables.
- **Method:** run bounded probes in the ignored run workspace with exact argv, bind environment and dependency identities, compare candidates against the upstream semantic dependency, and produce a feasibility evidence record with limitations.
- **Writer boundary:** may write only ignored probe/evidence content. Dependency manifests, lockfiles and production configuration are later Implementer-owned deliverables; formal tests/Harness remain Test Designer-owned.
- **Gate:** every `IMPLEMENTATION_FEASIBILITY` obligation has a conclusive compatible result and selected binding. Inconclusive evidence stays in `IM-02V`; missing external authority waits; a result that invalidates the frozen design stops the Delivery.

### IM-03 Adaptive Grilling and Goal Classification

- **Role:** Goal Facilitator using referenced `grilling` and package goal-classification Skill.
- **Purpose:** derive Project Context Snapshot, Goal Packets, dependencies, completion boundary, semantic Test Ladders and classified blockers; map implementation-verification obligations to executable rungs and preserve operational-tuning handoffs.
- **Rule:** ask one decision at a time; investigate facts first. Grilling establishes measurement authority, not architecture.

### IM-04 Confirm and Freeze Goal Graph

- **Authority:** Facilitator prepares; human confirms; executor persists the exact artifacts.
- **Gate:** every upstream obligation is mapped to a Goal, feasibility result, external blocker or operational handoff; every Goal has classification, dependency, Oracle, Test Ladder and completion relation; no unresolved user decision remains.

### IM-05 Activate Feature Branch

- **Role:** Delivery Custodian using CLI.
- **Behavior:** require clean baseline, create a new feature branch and record baseline commit. Never auto-stash, reset, merge or reuse a conflicting branch.

### IM-06 Select Ready Goal and Rung

- **Authority:** deterministic Workflow selector.
- **Order:** Harness prerequisite, then minimum end-to-end Walking Skeleton, then topological Goal/Test Ladder order. Implementer preference cannot choose the next Goal.
- **Result:** one selected Goal/rung or an exact wait/terminal proposal. A missing Contract waits only when no independent Ready Goal remains; verification evidence planned for the current implementation is never treated as an external prerequisite.

### IM-07 Materialize and Calibrate Tests

- **Role:** Test Designer in implementation-blind mode.
- **Purpose:** turn the current semantic rung into black-box tests and prove discriminating power.
- **Calibration:** current behavior must fail for the expected reason, or an existing-green behavior must be challenged by a negative fixture/controlled mutant. A test file that merely exists is insufficient.
- **Gate:** flaky, skipped, misdirected or non-discriminating tests cannot enter implementation.

### IM-08 Evolve Prototype to Green

- **Role:** Implementer; the same session normally spans one Goal.
- **Purpose:** make the smallest production-code change that turns the current calibrated RED into GREEN.
- **Writer rule:** no formal test, fixture, Harness, coverage or writer-policy changes. Diagnostic probes stay ignored and non-authoritative.
- **Prototype rule:** stubs may represent later collaborators only when bound to known Contracts and replacement rungs; they cannot replace current core behavior.

### IM-09 Close Structural Coverage

- **Role:** Test Designer in code-aware fresh session.
- **Purpose:** classify changed branches and add assertions for behavior-relevant branches.
- **Gate:** new/modified behavior-bearing branches require 100% coverage plus branch-specific assertions; historical coverage cannot regress. Generated/non-behavioral/proven-unreachable exclusions require exact evidence and later Auditor admission.
- **Data reuse:** the generated Coverage Applicability Map drives the Gate, risk focus, impact analysis and regression selection. Core-logic ratio is `REVIEW_SIGNAL`, never a percentage Gate.

### IM-10 Bounded Refactor and Hardening

- **Role:** Implementer.
- **Purpose:** improve the current prototype without changing frozen behavior.
- **Boundary:** no speculative abstraction, future feature, generic HA/transaction/retry machinery or unrelated cleanup. `NO_REFACTOR_NEEDED` is valid.

### IM-11 Verify Rung

- **Role:** Delivery Custodian using CLI.
- **Checks:** current tests, affected regression, writer policy, stub ledger and Action evidence against one Git baseline.
- **Next:** next rung, Goal review, or exact return Action. A random rerun to obtain GREEN is prohibited.

### IM-12 Independent Goal Review

Two fresh sessions start from the same Goal candidate and remain isolated until the barrier closes:

| Lens | Role | Focus |
| --- | --- | --- |
| Black-box | Goal Adversary | counterexamples derivable from Goal, Interface and Project Context; implementation initially hidden |
| White-box | Implementation Reviewer | code/test diff, coverage, overfitting, scope drift, design conformance, writer/stub integrity |

Generic best practice is only a `REVIEW_SIGNAL`. An admitted Finding requires exact location, applicable Goal/context/upstream authority, evidence, impact and closure condition.

### IM-13 Aggregate and Route Findings

- **Role:** Finding Aggregator.
- **Purpose:** preserve provenance, merge clear common causes, detect conflicts and route each Finding.
- **Prohibited:** voting, severity changes, test/code edits and Finding closure.

### IM-14T / IM-14I Targeted Resolution

- **Test-side Role:** Test Designer; may add/repair feedback strictly within the frozen Goal.
- **Implementation-side Role:** Implementer; may modify production code only.
- **Negative feedback order:** failing executable test, deterministic rule, then structured semantic recheck.
- **Design change:** any requested semantic expansion stops this Delivery; it is never resolved here.

### IM-15 Independent Recheck

- **Role:** original Finding lens in a fresh session.
- **Gate:** only the source lens closes its Finding against the exact treatment and new candidate. Implementer/Aggregator cannot close it.
- **Return:** a closed Goal-review Finding returns to IM-16; a closed whole-scope Finding returns to IM-17. The Finding records its review scope and return Action so recovery cannot confuse the two loops.

### IM-16 Verify and Commit Goal

- **Role:** Delivery Custodian using CLI.
- **Checks:** all Goal rungs complete, local Findings closed, writer/scope clean, focused/affected regression/coverage green, no unauthorized stubs.
- **Effect:** commit only explicit approved paths with Goal identity; the commit becomes the next baseline. RED states remain Runtime/workspace checkpoints, never commits.

### IM-17 Whole-scope Regression and Review

- **Roles:** both independent Review lenses plus Delivery Custodian CLI.
- **Purpose:** test cross-Goal composition, shared state, final Project Context applicability, mapped implementation-verification obligations and full regression against the complete branch.
- **Gate:** Findings return through IM-13; no partial success.

### IM-18 Freeze Candidate and Clean

- **Role:** Delivery Custodian uses Package CLI verification; Managed Runtime lifecycle/Workspace authority applies admitted cleanup dispositions.
- **Checks:** every in-scope Goal `VERIFIED`, all Findings disposition-valid, required Harness phases pass against the candidate, no unauthorized stub/debug artifact, process artifacts absent from Git, worktree clean after Goal commits, exact run-manifest/retention disposition valid.
- **Output:** exact branch/head/change-set identity, bounded verification summary, and unresolved operational-tuning handoffs. An unmeasured tuning value cannot be reported as passed; absent an upstream Fitness Threshold it does not block `VERIFIED_IMPLEMENTATION_READY`.
- **Cleanup boundary:** remove only eligible Package run-workspace copies after durable settlement/policy authorization; never delete Runtime-owned checkpoint/settlement, Git objects/deliverables or external authority. The current `cleanup-run` CLI is simulation-only until disposition-aware custody is implemented.
- **Non-effect:** no push, PR, merge, deployment or target-branch rebase unless a separate explicit user instruction authorizes it outside core success.

## 5. Goal Graph and Walking Skeleton

One input design produces one frozen Goal Graph. A Goal is an independently testable behavior/asset increment, not necessarily one file or Module. Edges represent implementation/test prerequisites. The first non-Harness path should be the smallest end-to-end successful core derived from the design; known collaborators may be stubbed only behind declared Interfaces and only until their recorded replacement rung.

Code mutation is serialized in one candidate workspace. Goal research and isolated review may run concurrently, but only one production-code writer is active. A completed Goal commit is never rolled back merely because another independent Goal is blocked.

## 6. Test Ladder and Feedback Integrity

Every Goal freezes a semantic ladder with these fixed topics and project-specific applicability:

1. Interface/Contract and Harness calibration;
2. minimum core success;
3. remaining confirmed functional scenarios;
4. applicable boundary/error/cancellation/recovery behavior;
5. stub replacement and real collaboration;
6. behavior-relevant branch correctness;
7. explicitly required measurable quality thresholds;
8. affected regression and composition.

Topics are `APPLICABLE`, reasoned `NOT_APPLICABLE`, `BLOCKED`, or authorized `DEFERRED`. The full semantic boundary is visible to Implementer; exact tests are generated rung by rung. Adversarial counterexamples become visible after admission. Permanent hidden tests never decide success.

Formal tests are Test Designer-owned. Implementer may not edit, delete, rename, skip, reconfigure or weaken them. The writer CLI compares the Action-start Git baseline with staged, unstaged, renamed, deleted and untracked paths. Test Designer likewise cannot modify production code.

A flaky result—different outcomes on an unchanged baseline without a declared statistical method—is a Harness failure. Retry may diagnose but cannot transform a random GREEN into acceptance.

## 7. Project Context and Finding Admission

The Project Context Snapshot is derived from the frozen design's context, scope, non-goals, trust assumptions, qualities, accepted risks and rejected mechanisms. It is locked for the Delivery. Test and Review proposals must state their applicable Goal/scenario and project-specific impact.

Finding severities are:

- `BLOCKING`: invalid Goal, correctness, feedback or upstream conformance;
- `MAJOR`: important behavior, branch, regression or design constraint remains open;
- `MINOR`: local low-impact issue, fixed or explicitly accepted by the source lens;
- `REVIEW_SIGNAL`: investigation cue, never a Finding or Gate by itself.

All Blocking/Major Findings must be `CLOSED_FIXED` or `CLOSED_NOT_VALID` by their source lens. Minor Findings may additionally be `ACCEPTED_MINOR` with a recorded no-semantic-impact rationale.

## 8. Roles, Writers and Subagents

Production Role set: Goal Facilitator, Evidence Scout, Test Designer, Implementer, Goal Adversary, Implementation Reviewer, Finding Aggregator and Delivery Custodian. Role prompts are under `roles/`; exact routes are under `agents/routes.md`.

Subagents may perform bounded tasks inside the current Action/Goal and inherit the parent Role's authority. Parent and children count as one writer. A Subagent cannot choose successors, change frozen artifacts, bypass isolation, claim terminal state or start another Workflow.

## 9. Artifact Lifecycle

完整生命周期、identity、dependency validity、retention 和 authority 见 [`artifact-lifecycle.md`](artifact-lifecycle.md)。逻辑分流如下：

```text
Immutable Package Snapshot ──┐
                             ├─ Workflow State references immutable Run Artifact versions
Ignored logical run workspace┘

Repository: baseline → verified Goal commits → complete verified candidate
```

Package Snapshot、Workflow State、Run Artifact 和 Repository Deliverable 不得混为同一文件状态。Run Artifact 以 immutable version/content digest 和 manifest dependency graph 管理；修改产生新版本，不能覆盖。直接 dependency 改变时 dependant 先进入 `STALE_PENDING_IMPACT`，再被 invalidated 或以新记录 revalidate。冻结 design/Goal/Project Context 的语义变化不能在当前 Delivery 内 revalidate。

Only production assets, formal tests/fixtures, necessary configuration and formal project documentation enter Goal commits. When upstream explicitly requires a formal evidence record, that record is itself an in-scope Goal. Process Artifacts never enter Git merely because they reached `VERIFIED`.

## 10. External Coordination, Wait and Recovery

This Workflow never launches another Workflow. A frozen-design-delegated cross-owner Contract/Detailed Design or external-authority evidence gap that the current Delivery cannot produce creates a Coordination Request with blocker, affected Goals, expected compatible artifact and resume condition. A human or external coordinator may start a separate Delivery. Only an exact compatible result resumes classification; a result that changes design semantics stops the current Delivery.

`WAITING_FOR_USER` persists one measurement/intent decision and exact resume Action. `WAITING_FOR_EXTERNAL` persists the Coordination Request identity and compatibility expectation. It is reserved for a missing cross-owner Contract/design/authority or an environment fact that the current Delivery cannot produce; implementation-verification evidence and post-candidate tuning do not qualify merely because they are unfinished. Budget exhaustion records current Goal/rung, Git baseline, test results, attempts, Findings and resume Action in `INCOMPLETE`; it never relaxes a Gate.

Action retry retains the same Goal/rung content identity and gains a new attempt identity. Repeating the same failure without new diagnosis consumes budget and cannot create progress. `UNMANAGED_SIMULATION` records equivalent evidence for validation but does not create authoritative Workflow State or durable Wait.

## 11. Git and Publication

Preflight requires a clean starting branch. IM-05 creates a feature branch from an exact baseline. No Action auto-stashes, resets, amends, rebases, merges or deletes user changes. IM-16 commits only an explicit Goal path manifest after all local Gates pass. Merge to the target branch is publication; push and PR are external repository effects. None occur without an explicit user instruction.

## 12. CLI and Runtime Independence

The Package owns deterministic CLI behavior. Shared code handles Git/config/result identity; thin executables follow authority boundaries. All project commands use frozen argv arrays and `shell=false`. CLI outputs JSON, command/argv, exit status, checked identities and bounded stdout/stderr.

Runtime is not required to contain Implementation-specific semantics. `UNMANAGED_SIMULATION` may call the same CLI through bound Skills and report only simulation outcomes. A formal Delivery requires a selected Runtime Profile to own Workflow State, Wait/resume, checkpoint and terminal settlement while consuming the same frozen Package Snapshot; it must not reinterpret CLI failure as success.

## 13. Package Validation and Conformance

Package completion requires:

- Workflow Semantics Review;
- Authority & Feedback Review;
- Fresh Reader/Simulator Test;
- deterministic resource/link/schema/CLI validation;
- positive, negative and recovery conformance corpus.

The corpus must prove at least: single/multi-Goal flow, Walking Skeleton, stub replacement, writer violations, non-discriminating/skipped/flaky tests, invalid coverage exclusions, irrelevant quality demands, dirty baseline, incomplete candidate rejection, Wait/resume correlation and stop-on-design-conflict.

## 14. Terminal Completion Check

- [ ] Exact frozen design and implementation scope are bound.
- [ ] Preflight and Harness Binding passed against a clean baseline.
- [ ] Every upstream obligation was classified; implementation feasibility is conclusive, implementation verification is mapped to passed evidence, and operational tuning has an explicit handoff.
- [ ] Goal Graph covers every in-scope obligation and every Goal completed its Test Ladder.
- [ ] Walking Skeleton and all required real collaborations are implemented; no unauthorized stub remains.
- [ ] Formal tests were authored only by Test Designer and production code only by Implementer.
- [ ] New/modified behavior branches meet applicable coverage and assertion rules; historical coverage did not regress.
- [ ] Goal-level and whole-scope independent reviews passed; all Findings have valid source-lens dispositions.
- [ ] Focused, full regression, coverage and applicable static/build commands passed against the final candidate without flaky retry-to-green.
- [ ] Each Goal has a green commit; final branch/head/change-set identity is recorded.
- [ ] Process artifacts are absent from Git and ignored workspace cleanup passed.
- [ ] No nested Workflow, design mutation, hidden terminal test, publication or unapproved external effect occurred.
