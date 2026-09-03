# workflow-package

[English](README.md) | 中文

workflow-package 存放 workflow-self-recursive 所执行的版本化 Workflow Package。每个 Package 都是 owner 声明的、版本化的闭合组合：Workflow Definition 与其 Actions、Role routes、Prompts、Skills、模型、工具、Drivers、schemas、validators 和 conformance 资源共同构成。它是源码组件的划分（Workflow 定义与资源的家），而不是两个产品 System 之一。

仓库包含彼此独立定版的逻辑 Workflow：

- **Implementation**：把一份精确冻结、具备实现授权的上游设计转化为经过测试和独立对抗检查的特性分支候选变更，由 Goal Graph、Test Ladder 与演进式 TDD 驱动。
- **System Design**：把简短、模糊的设计请求转化为 `IMPLEMENTATION_READY` 的 System Design，经历 adaptive grilling、冻结的 Brief 与 Skeleton、单一 writer 扩写与三个独立 Review。
- **Hello World 0.2.0**：多 Provider 安装验证 Package；由 Copilot 驱动的 greeter Role 把结构化结果交给 Codex 驱动的 reviewer Role，全程不申请 tool 或 workspace authority。

## Developer preview

本仓库是 workflow-self-recursive 架构优先开发者预览版的一部分，适用于个人或小团队的可信本地环境。每个 Package 都必须通过其 release 精确冻结的 Workflow Contract 校验；Hello World 0.2.0、Implementation 0.4.2 与 System Design 0.4.2 均使用 Runtime DSL 2.0。**后续会有破坏兼容性的变更。**

## 结构

每个 Package 遵循 [Workflow 组合模型](https://github.com/firestige/workflow-self-recursive/blob/main/docs/workflow-composition-model.md)，让四个关注点可独立定位：

- Package index（`README.md`）；
- Workflow Definition（`workflow.md`），作为流程语义的唯一来源；
- 按类型拆分的资源目录（`roles/`、`agents/`、`prompts/actions/`、`skills/`、`templates/`、`schemas/`、`validators/`、`conformance/`）；
- 显式的 artifact 生命周期与 Git identity 规则。

## 安装 Workflow Package

产品用户可通过 `name`、`name@latest` 或确定的 `name@version` 选择 Workflow。Execution 对裸名称和 `@latest` 使用 sticky-local alias 与唯一配置的 Source 完成解析，并把选中的精确 `name@version`、digest 和本地路径冻结到 Delivery。Execution 从 `firestige/wsr-workflow-package` 下载不可变的 public GitHub Release `workflow-package/<name>/v<version>`，依次校验 descriptor、checksum、provenance、兼容 Contract revision、Package closure、Workflow schema 与 Snapshot identity，再写入 exact-content cache。用户不需要克隆仓库或安装仓库开发依赖。

克隆仓库仅属于 contributor workflow，绝不是 runtime fallback。`latest` 是受控的 package selector，不是 tag、branch、ambient checkout 或本地 source fallback。

## 文档

- [Implementation Workflow Package](implementation/README.md)
- [System Design Workflow Package](system-design/README.md)
- [Hello World Workflow Package](hello-world-workflow/README.md)
- [Workflow 组合模型](https://github.com/firestige/workflow-self-recursive/blob/main/docs/workflow-composition-model.md)
- [概念架构](https://github.com/firestige/workflow-self-recursive/blob/main/docs/agent-architecture.zh-CN.md)

## License

[Apache-2.0](LICENSE)
