# Implementation Workflow Artifact Lifecycle

本文定义 Implementation Delivery 产生的配置身份、控制状态、过程 Artifact 和 Git 交付文件如何分离、寻址、失效、恢复与清理。Action 与 transition 仍以 [`workflow.md`](workflow.md) 为权威；本文不把文件系统提升为 Workflow State authority。

## 1. 四个平面

| Plane | 内容 | Writer authority | 是否进入 Goal commit |
| --- | --- | --- | --- |
| Package Snapshot | 本次执行使用的 Workflow、Route、Prompt、Skill、CLI、Schema、Template 与 referenced asset 身份闭包 | Execution System 的配置身份/准入 authority | 否 |
| Workflow State | 当前 Action/attempt、Goal/rung、Wait、预算、Finding、checkpoint、terminal proposal | 正式 Delivery 仅 Selected Runtime Profile | 否 |
| Run Artifacts | Obligation Register、feasibility evidence、Goal Graph、Context、Ladder、test evidence、review、treatment、协调请求、operational handoff 和 verification summary 的不可变版本 | 当前 Action 的授权 Role 或 deterministic custodian；Runtime 记录引用 | 否 |
| Repository Deliverables | 生产资产、正式测试/fixture、必要配置与正式项目文档 | Test Designer/Implementer 写，Delivery Custodian 按 Goal manifest 提交 | 是 |

外部 Contract、Detailed Design、manual 和外部协调结果属于 authority dependency；Workflow 只保存其精确 locator/content identity 和实际使用范围，不复制创作权。

## 2. 执行模式

### Managed Delivery

Execution System 解析并冻结 Package Snapshot，Selected Runtime Profile 独占 Workflow State 写入，Workspace authority 管理候选 Git 状态。每个 checkpoint 必须同时绑定 Delivery、Package Snapshot、Action attempt、Artifact manifest revision 和 candidate Git tree。

### `UNMANAGED_SIMULATION`

在 Runtime 尚未可用时，Agent/测试驱动器可以按同一 Workflow、Route、Prompt、Skill 和 CLI 模拟 Action。模拟记录使用相同 Artifact shape，但：

- 不声称写入正式 Workflow State；
- 不声称具备 durable Wait、原子 checkpoint、恢复幂等性或 terminal settlement；
- 只能报告 `SIMULATION_PASSED | SIMULATION_FAILED | SIMULATION_INCOMPLETE`；
- 不能发布 `VERIFIED_IMPLEMENTATION_READY` 作为正式 Delivery terminal；
- 不能用模拟结果替代未来 Runtime/Driver/Workspace conformance。

它验证的是 Workflow 流程和 Action 资源能否工作，不验证 Runtime 基础设施。

## 3. Logical Workspace

Package 使用逻辑 run workspace，不把物理路径写入通用 Contract：

```text
RUN_WORKSPACE/<delivery-id>/
├── manifest
├── package-snapshot-reference
├── artifacts/<kind>/<artifact-id>/<content-digest>
├── evidence/<goal-id>/<rung-id>/<evidence-id>
├── feasibility/<obligation-id>/<evidence-id>
├── reviews/<scope>/<result-or-finding-id>
├── coordination/<request-id>
└── simulation-control/        # 仅 UNMANAGED_SIMULATION
```

Agent-driven local simulation 默认解析为 `<project>/tmp/implementation-workflow/<delivery-id>/`。Managed Delivery 可使用 Runtime-private 等价位置；Artifact locator 必须保持逻辑含义和精确身份，不能让 Workflow 依赖 Runtime 私有路径。

Workspace 必须：

- 位于项目允许的 implementation run root 内；
- 被 Git ignore，且不在 index/tracked set 中；
- 与一个 Delivery 和一个 Package Snapshot identity 绑定；
- 不保存 credential、token、未脱敏 secret 或无界 stdout/stderr；
- 不被 Action 当作 ambient input 扫描；输入必须通过 manifest/reference 显式绑定。

## 4. Artifact Identity and Versioning

每个 Run Artifact 都是不可变版本。更新不是原地覆盖，而是创建新 `artifact_version_id` 和 `content_digest`，并记录 `supersedes`。稳定 `artifact_id` 表示逻辑对象，版本身份表示某次精确内容。

共同字段见 [`artifact-record.schema.md`](schemas/artifact-record.schema.md)。关键规则是：

1. 同一 identity 对应不同内容时 fail closed；
2. Action result 只能引用已登记 manifest 的输入版本；
3. derived artifact 记录实际消费的 dependency 和 semantic identities；
4. Working 内容也以不可变 checkpoint 版本表达，不因“尚未冻结”允许覆盖历史；
5. stdout/stderr、coverage 和 diff 等大证据保存 bounded reference、摘要和内容身份，不内嵌无界内容。

## 5. Lifecycle and Validity

### Common lifecycle

| State | Meaning |
| --- | --- |
| `WORKING` | 当前 Action 可继续演进；版本本身仍不可变，不是下游 authority |
| `FROZEN` | 人工或 Gate 已确认，当前 Delivery 内不得语义修改 |
| `CALIBRATED` | feedback 已证明能区分目标行为，可释放给 Implementer |
| `REVIEWED` | 所需独立 review 已完成，Finding 状态另行决定能否推进 |
| `VERIFIED` | 所有适用 Gate 对该精确版本通过 |
| `COMMITTED` | 对应正式 Repository Deliverables 已形成 Goal commit；过程 Artifact 本身仍不进 Git |
| `SUPERSEDED` | 新版本明确替代此版本；历史版本只供 lineage/recovery |
| `RETIRED` | retention authority 已允许移除可清理内容；身份/disposition 可继续存在于外部 settlement |

并非每种 Artifact 都经过所有状态。各类合法路径是：

| Artifact kind | Legal path |
| --- | --- |
| Project Context / Goal Graph / Goal Packet / semantic Test Ladder / Harness Binding | `WORKING → FROZEN → SUPERSEDED`；语义变化停止当前 Delivery而非本地 supersede |
| Obligation Register | `WORKING → FROZEN → SUPERSEDED`；分类可修订至 IM-04，semantic dependency/reopen condition 变化停止 Delivery |
| Feasibility evidence | `WORKING → VERIFIED`；只有 compatible exact binding 可满足 IM-02V |
| Formal test feedback | `WORKING → CALIBRATED → VERIFIED`；修订产生新版本 |
| Test/coverage evidence | `WORKING → VERIFIED` |
| Review result | `WORKING → REVIEWED` |
| Finding/treatment/recheck | Finding 使用 schema 状态；每次 treatment/recheck 产生新 Artifact version |
| Goal candidate | `WORKING → REVIEWED → VERIFIED → COMMITTED` |
| Final candidate | `WORKING → REVIEWED → VERIFIED` |
| Operational tuning handoff | `WORKING → VERIFIED` when owner/method/return/reopen fields are complete; measured result belongs to its downstream lifecycle |
| Coordination request | `WORKING → FROZEN → SUPERSEDED` when a correlated result closes/replaces it |

### Dependency validity

| State | Meaning |
| --- | --- |
| `CURRENT` | 所有精确 dependency identity 仍匹配 |
| `STALE_PENDING_IMPACT` | 至少一个 dependency 改变，影响尚未判定 |
| `INVALIDATED` | 改变影响当前 Artifact，已记录 return/stop disposition |
| `REVALIDATED` | 新的 revalidation record 证明变化不影响语义；原版本不被改写 |

直接引用发生变化时，Runtime/Simulation Controller 先确定性地把 dependant 标为 `STALE_PENDING_IMPACT`，并沿 manifest dependency graph 传播。语义复核可以增加 invalidation，不能删除确定性 stale 集合。冻结 Goal/Context/Design 语义变化不得通过 `REVALIDATED` 吸收，必须停止当前 Delivery。

## 6. Checkpoint and Recovery Binding

可恢复 checkpoint 至少绑定：

- Delivery 和 Package Snapshot identity；
- current Action/attempt、Goal/rung 和 candidate Git tree；
- run manifest revision；
- 每个 consumed/produced Artifact version；
- test/review/Finding identities；
- pending Wait/request/correlation 与 exact resume Action；
- remaining budget and last progress evidence。

恢复前必须重新解析这些身份。缺失、损坏、同 identity 不同内容、Snapshot 不匹配或 Git tree 漂移都 fail closed，进入显式 reconciliation/`INCOMPLETE`；不得从“最新文件”猜测状态。

## 7. Promotion and Commit Rules

只有 Repository Deliverables 被 promotion：

```text
approved Goal path manifest
  + verified Goal candidate at exact Git tree
  + writer/review/test closure
  → Goal commit
```

Run Artifact 不因被验证就变成 Git deliverable。若设计明确要求正式 evidence record，该 record 必须在 Goal Graph 中作为正式 Goal/Deliverable，而不能从 run workspace 静默复制。Final candidate summary返回给调用方；除非上游明确要求，它不是 repository document。

## 8. Retention and Cleanup

Package 声明保留类别，不发明时长：

| Class | Examples | Minimum retention condition |
| --- | --- | --- |
| `ACTION_EPHEMERAL` | diagnostic probe、bounded temporary output | Action reconciliation completed |
| `DELIVERY_RECOVERABLE` | frozen inputs、checkpoints、evidence、review、Finding、Wait | terminal settlement and explicit retirement authorization |
| `TERMINAL_REFERENCE` | final identities、dispositions、cleanup report references | owner-specific product/Runtime retention policy |
| `REPOSITORY_DELIVERABLE` | code、tests、formal config/docs | Git/project lifecycle |
| `EXTERNAL_AUTHORITY` | Contract/manual/external result | external owner lifecycle; Package keeps only binding |

`IM-18` 清理的是 Package run workspace 中可退休的过程副本，不删除 Runtime-owned checkpoint/settlement、Git objects、Repository Deliverables 或 External Authority。Managed Delivery 的精确保留时长由 admitted Runtime/project policy binding 决定；simulation 只可在验证结果已输出后清理自己的 ignored workspace。

Cleanup 必须验证 exact run root、Delivery binding、Git ignore 和 disposition。部分清理失败保持 pre-terminal/reconciliation 状态，不允许通过更宽路径重试；不自动 stash/reset/delete user work。

## 9. Authority Matrix

| Operation | Authorized owner |
| --- | --- |
| resolve/freeze Package Snapshot | Execution System configuration identity/admission authority |
| advance Workflow State / persist Wait / accept terminal | Selected Runtime Profile |
| author Goal/context artifacts | Goal Facilitator within current Action |
| author formal tests/fixtures | Test Designer |
| author production deliverables | Implementer |
| author review/Finding artifacts | exact review lens / Finding Aggregator within declared authority |
| execute deterministic Gate / branch / Goal commit | Delivery Custodian through package CLI and Runtime/Workspace authority |
| retire run-workspace copies | lifecycle custodian after authorized disposition |
| alter Git history, publish or merge | never implicit; separate explicit user authority |

No Artifact content can grant itself writer, transition, cleanup, publication or Workflow-launch authority.

## 10. Deterministic Custody Surface

Package-owned CLI 最终需要提供以下有界操作；它们是 Workflow 工具，不是 Runtime 私有语义：

| Operation | Deterministic responsibility |
| --- | --- |
| `snapshot resolve/verify` | 解析 owned/referenced resource 和 route closure，证明无 ambient fallback |
| `workspace init/verify` | 建立或核验 exact Delivery/Snapshot/root/Git-ignore binding |
| `artifact register/verify` | 校验 digest、kind/state、locator、dependency、retention 并产生下一 manifest revision |
| `impact propagate` | 从 changed dependency 计算确定性 `STALE_PENDING_IMPACT` 闭包 |
| `checkpoint verify` | 核对 Snapshot、manifest revision、Action/Goal/rung 与 Git tree identity |
| `cleanup plan/verify` | 仅计算/验证允许退休的 run-workspace 内容和 disposition，不选择 terminal |
| `simulation cleanup` | 在结果已输出后安全删除 exact ignored simulation root |

Managed Runtime 通过通用 Package/State/Workspace 接口消费这些结果，并保持唯一 State/terminal authority。Package CLI 不写 Runtime checkpoint，不解释 Wait，不删除 Runtime-owned state，也不自行报告正式 terminal。

当前 `cleanup-run` 只有 simulation-root path/Git-ignore 安全能力。在 manifest/disposition custody 实现前，它不得作为 Managed Delivery 的 IM-18 cleanup proof；这是实现待办，不改变本文设计。
