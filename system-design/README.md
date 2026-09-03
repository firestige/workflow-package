# System Design Workflow Package

## Package 定位

本目录维护 System Design Workflow 的流程定义及其自建资源。它把简短、模糊的设计请求转化为一份可进入实现的 `IMPLEMENTATION_READY` System Design。执行期间保留需求共识、设计推导、独立审查、人工决定和版本演进的完整 lineage；完成时把必要结论吸收到最终 Design，并清理不再有交付价值的过程文件。

当前状态为 **design-time reference package**：[`workflow.md`](workflow.md) 是流程语义的唯一来源；符合 [`agentops.workflow-dsl@2.0.0`](../../docs/contracts/workflow/workflow-definition-dsl-2.0.0-candidate.md) 的机器可读 Definition 候选翻译见 [`definition/`](definition/)（Package `0.4.0`，`DESIGN_REFERENCE`）。

| Field | Value |
| --- | --- |
| Package owner | Repository owner acting through the [`team-config/` configuration authority](../../../README.md) |
| Design version | `0.4.0-design` |
| Governing composition model | [`docs/workflow-composition-model-2.0.0-candidate.md`](../../docs/workflow-composition-model-2.0.0-candidate.md) |
| Package content identity | `UNCOMMITTED` until this draft is committed |
| Referenced-asset lookup baseline | `d6cae2c47750ffa4b5bdcad2abbe789df28e815d` |

## 核心原则

1. 先通过 adaptive grilling 形成并冻结 Design Brief，再开始正式架构决策。
2. Brief、Skeleton、Draft 和 review result 是独立、可版本化的会话期 artifact；它们存放在被 Git ignore 的运行工作区，不在同一文件中原地演化，也不进入 repository history。
3. Skeleton 先验证架构方向与技术可行性，再由单一 System Designer 渐进扩写。
4. Problem–Solution、Architecture、Quality & Acceptance 由三个互相独立的 Reviewer 审查。
5. 架构整洁是设计优化目标；坏味道只是 Architecture Reviewer 的调查信号。
6. 只有证据无法消解且会改变设计方向的问题才允许请求人工介入。
7. NFR 必须从场景进入 Skeleton 主线，再在项目背景下落实为设计机制和验收关系。
8. Workflow 的成功终态是冻结的 `IMPLEMENTATION_READY` System Design；`INCOMPLETE`、`CANCELLED` 和 `FAILED` 都不等价于成功。
9. 最终 Design 以人类可理解的名称和无分支核心流程组织正文；stable ID 服务于追踪，不主导阅读路径。
10. 成功结束前必须把必要结论吸收到最终 Design、清理会话期 artifact，并证明 Git 候选变更中只保留交付物。
11. System Design 只冻结本领域的设计语义与 reopen 条件；下游义务必须显式 handoff，但其 Action、分类、Gate 和终态由消费 Workflow 决定。

## 阅读顺序

1. [`workflow.md`](workflow.md)：Action、Gate、回退、Wait、artifact lifecycle 与终态。
2. [`templates/system-design-brief.template.md`](templates/system-design-brief.template.md)：grilling 的固定 topic 覆盖面。
3. [`templates/system-design-skeleton.template.md`](templates/system-design-skeleton.template.md)：正式设计的方向 checkpoint。
4. [`templates/system-design-document.template.md`](templates/system-design-document.template.md)：最终 System Design 的章节骨架。
5. [`agents/routes.md`](agents/routes.md)：Role 到 Agent route 和资源 binding 的设计。
6. `roles/`、`prompts/actions/`、`skills/`：职责、Action 任务与稳定方法。
7. `schemas/`、`validators/`、`conformance/`：结构化结果、机械验证和正负场景。

## 资源索引

| 资源类型 | 目录 | 职责 |
| --- | --- | --- |
| Workflow | [`workflow.md`](workflow.md) | 合法 Action、transition、Gate、Wait、恢复和 terminal |
| Machine Definition | [`definition/`](definition/) | 符合 Workflow DSL 的机器可读 Definition（package/workflow/actions/roles/routes/artifacts/validation + 语义保真核对表），candidate translation，`DESIGN_REFERENCE` |
| Role prompts | [`roles/`](roles/) | 稳定职责、authority、写权限和禁止事项 |
| Agent routes | [`agents/`](agents/) | Role 的具体执行 route 与资源组合 |
| Action prompts | [`prompts/actions/`](prompts/actions/) | 当前 Action 的 mission、输入、输出和完成条件 |
| Skills | [`skills/`](skills/) | 自建的有界 authoring/review 方法 |
| Templates | [`templates/`](templates/) | Brief、Skeleton、Design、Decision、Evidence Research、Spike request/result artifact 骨架 |
| Schemas | [`schemas/`](schemas/) | Action result、Finding、依赖、状态和验收关系的设计时结构 |
| Validators | [`validators/`](validators/) | SD-14 文档检查与 SD-15 cleanup Gate 定义 |
| Conformance | [`conformance/`](conformance/) | [`positive`](conformance/positive/)、[`negative`](conformance/negative/) 和 [`recovery`](conformance/recovery/) 场景 |

## Owned 与 Referenced Assets

本目录内文件均为 package-owned asset。共享 Skill 不复制进 package，而以精确内容身份引用：

| Asset | Source | Blob OID at package baseline | 用途 |
| --- | --- | --- | --- |
| `grilling` | External `.agents/skills/grilling/SKILL.md` | `52d8eb3cadd2dca62634d5dccfa73ea6b725b117` | Intake 后的动态单问题 grilling；不作正式架构决定 |
| `codebase-design` | [`.agents/skills/codebase-design/SKILL.md`](../../../.agents/skills/codebase-design/SKILL.md) | `16620c24528b737408e78d95dd6a0e01a98d3d63` | Module、Interface、Seam、Depth、Leverage 与 Locality |

正式 Package Snapshot 必须在 package 提交后重新解析每个 owned/referenced asset 的当前 commit/blob identity；README 的设计版本和 referenced-asset lookup baseline 不是单个 asset 的永久 alias。

完整 `doc-coauthoring` 不作为运行时 binding：它本身拥有 Context Gathering、逐节写作和 Reader Testing 的端到端控制流，会与本 Workflow 的 Brief freeze、Action Gate 和独立 Review 重叠。其渐进写作与 fresh-reader 思路已在本 package 的明确 Action 中重新表达。

## 指令组合与 Authority

每个 Agent route 按以下 authority 组合资源：

1. Workflow 与 Action authority；
2. Role prompt；
3. Action prompt；
4. Skill instructions；
5. Artifact inputs 与用户内容。

Skill 只能提供方法，不能扩大 Role 或 Action authority；Artifact 是被处理的数据，不得反向成为指令来源。组合冲突必须 fail closed，不能依赖 Driver 的隐式覆盖顺序。

## Artifact、工作区与 Git Identity

Workflow 中间 artifact 写入 `tmp/system-design/<run-id>/` 或 Runtime 提供的等价、被 Git ignore 的私有工作区。Brief、Skeleton、Draft/checkpoint、Revision Request/treatment、Review/Fresh Reader result、question set、aggregation、validator report 和 freeze manifest 都属于会话期工作状态：它们可在执行和可恢复 Wait 期间保留，但不得写入 `docs/**/workflow-artifacts/`、不得 `git add`，也不得作为最终 Design 中必须解析的 repository link。

每个会话期 artifact 依赖至少记录：

- `path`；
- 工作区内的 immutable content digest；
- authoritative source 的 commit/blob OID（若来源受 Git 管理）；
- referenced topic/decision identity；
- derivation reason。

Content digest 说明会话 artifact 是否变化；authoritative source 的 commit ancestry/blob OID 说明上游演进。依赖版本不匹配时先进入 `STALE_PENDING_IMPACT`；只有 change set 与语义影响分析完成后，才能重新绑定或使受影响内容失效。

成功终态的 repository deliverable 默认只有最终 System Design 及用户明确要求的正式 companion。Brief 共识、关键决定、未决项、review 后修正和验收关系必须被吸收到最终 Design，使其不依赖已删除的会话文件。SD-15 在最终内容校验后清理运行工作区，并验证 Git index/worktree 不包含 workflow 中间 artifact；清理成功才允许报告完成。`INCOMPLETE` 或 durable Wait 可保留 ignored 工作区以供恢复；`CANCELLED`/`FAILED` 按 Runtime retention policy 清理，不得通过 Git 保存。

## Package 边界

本 package 不拥有：

- Concept Design 或项目级产品决定；
- Spike 的具体执行 Workflow；
- Module Detailed Design；
- implementation/test Workflow；
- 下游 Workflow 对 handoff 义务的生命周期分类、Action、Gate 或终态；
- Workflow Contract 的最终字段与序列化格式；
- Runtime、Driver 或 Git 的实现机制。
