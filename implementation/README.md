# Implementation Workflow Package

## Package 定位

本目录维护 Execution System 可装载的通用 Implementation Workflow。它把一个精确冻结、具备实现授权的上游设计转化为经过测试和独立对抗检查的特性分支候选变更。Workflow 采用 Goal Graph、Test Ladder 和演进式原型：测试逐层产生可靠负反馈，生产实现从最小 Walking Skeleton 螺旋演进为完整交付件。

当前 [`workflow.md`](workflow.md) 是流程语义的唯一来源。Package 同时提供可独立调用的 CLI、Role、Prompt、Skill、Template、Schema、Validator 和 conformance corpus。Agent 可以用 `UNMANAGED_SIMULATION` 验证 Action 流程与资源，但不能冒充具有 durable State/Wait/terminal authority 的正式 Delivery；未来 Runtime 只实现状态、Gate、恢复和资源投影，不重定义 Workflow 语义。

| Field | Value |
| --- | --- |
| Package owner | Repository owner acting through `team-config/` configuration authority |
| Design version | `0.3.0-design` |
| Design status | `CONFIRMED` |
| Governing model | [`docs/workflow-composition-model.md`](../../docs/workflow-composition-model.md) |
| Workflow authority | [`workflow.md`](workflow.md) until a versioned Runtime DSL is published |
| Initial validation mode | `UNMANAGED_SIMULATION` with package-owned CLI Gates |

## 核心原则

1. 一个 Delivery 只绑定一个精确冻结的上游设计版本；设计语义变化必须启动新 Delivery。
2. Preflight、实现可行性校准和 adaptive grilling 先证明 Goal、Oracle、Harness、环境与当前 Goal 所需 Contract 足以支持 TDD。
3. 一个设计可产生多个 Goal；独立 Goal 可推进，但所有 in-scope Goal 完成前 Workflow 不成功。
4. Test Designer 独占正式测试 writing；Implementer 独占生产实现 writing；CLI 使用 Git diff 检查越权。
5. 每个 Goal 以 Test Ladder 驱动演进式原型，循环 `calibrate → RED → minimal GREEN → branch correctness → refactor`。
6. Project Context Snapshot 决定质量与对抗检查的适用范围；通用最佳实践不能扩大冻结目标。
7. Goal 完成后进行相互隔离的黑盒/白盒对抗检查；全部 Goal 完成后再做整体检查。
8. 每个关闭的 Goal 形成绿灯 commit；merge、push、PR 和部署不属于默认 Workflow。
9. 允许当前 Action 内的有界 Subagent task；禁止启动或运行嵌套 Workflow。
10. 过程 Artifact 留在 ignored run workspace；仓库只保留产品、测试和必要正式文档资产。
11. 上游义务的语义必须保留，但其实现生命周期分类、Action 和 terminal 影响由本 Workflow 决定。

## 资源索引

| 资源 | 位置 | 用途 |
| --- | --- | --- |
| Human Execution Guide | [`execution-guide.md`](execution-guide.md) | 核心流程、Goal 循环、Finding、Wait 与 Git 边界的分层图解 |
| Workflow | [`workflow.md`](workflow.md) | Action、transition、Gate、Wait、恢复与终态 |
| Artifact Lifecycle | [`artifact-lifecycle.md`](artifact-lifecycle.md) | Snapshot、State、Run Artifact、Git deliverable、lineage、retention 与 cleanup |
| Composition Review | [`composition-conformance.md`](composition-conformance.md) | 对照 governing model 的闭合项、实现义务与未决 authority 问题 |
| Routes | [`agents/routes.md`](agents/routes.md) | Role、Prompt、Skill、CLI 和 session binding |
| Roles | [`roles/`](roles/) | 稳定职责与 writer authority |
| Action Prompts | [`prompts/actions/`](prompts/actions/) | 当前 Action mission、输入、输出和 return |
| Skills | [`skills/`](skills/) | 有界 Goal、测试、实现、Review 和 custody 方法 |
| Templates | [`templates/`](templates/) | Goal Graph、Goal Packet、Test Ladder、Finding 等 Artifact |
| Schemas | [`schemas/`](schemas/) | 设计时语义 shape |
| CLI | [`cli/`](cli/) | Runtime-independent deterministic Gates |
| Validators | [`validators/`](validators/) | Package/candidate verification definition |
| Conformance | [`conformance/`](conformance/) | Positive、negative 和 recovery 场景 |

## CLI

CLI 采用共享 library 与按 authority 边界拆分的薄入口：

- `implementation-preflight.mjs`：冻结设计、Obligation Register、Git baseline 和 Harness 准入；
- `implementation-test.mjs`：按冻结 argv 执行 feasibility/focused/full/coverage 等命令；
- `implementation-writer.mjs`：比较 Git baseline 并执行文件级 writer policy；
- `implementation-custodian.mjs`：branch、candidate verification 和 Goal commit custody。

CLI 输出结构化 JSON 和非零失败状态。Skill 说明如何使用 CLI；机械 enforcement 位于 CLI，而非 Prompt 自律。

## Owned 与 Referenced Assets

本目录内资源均由 Package owner 维护。共享 `grilling` Skill 以内容身份引用，不复制或取得其创作权：

| Asset | Source | Baseline blob identity | Use |
| --- | --- | --- | --- |
| `grilling` | External `.agents/skills/grilling/SKILL.md` | `52d8eb3cadd2dca62634d5dccfa73ea6b725b117` | IM-03/IM-04 的单问题人工测量标准确认 |

正式 Workflow Package Snapshot 必须重新解析所有 owned/referenced asset、route 和 executable resource 的实际身份；README 中的 identity 只是当前设计 baseline，不是永久 alias。Snapshot shape 见 [`package-snapshot.schema.md`](schemas/package-snapshot.schema.md)。

运行 CLI 测试：

```bash
cd workflow-package/implementation/cli
npm test
npm run check
```

## Package 边界

本 Package 不负责拆解复杂 UI 交互、不从裸需求创建设计、不修改冻结 System Design、不运行子 Workflow、不提供 Runtime、不得用 hidden tests 决定终态，也不默认 publish Git 变更。跨 owner Contract/设计缺口只产生 Coordination Request；实现可行性在本 Package 的有界 Action 中校准，实现验证由 Test Ladder 产生，运行调优形成后续 handoff。兼容结果可恢复，推翻冻结设计则当前 Delivery 停止。
