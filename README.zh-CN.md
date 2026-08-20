# workflow-package

[English](README.md) | 中文

workflow-package 存放 workflow-self-recursive 所执行的版本化 Workflow Package。每个 Package 都是 owner 声明的、版本化的闭合组合：Workflow Definition 与其 Actions、Role routes、Prompts、Skills、模型、工具、Drivers、schemas、validators 和 conformance 资源共同构成。它是源码组件的划分（Workflow 定义与资源的家），而不是两个产品 System 之一。

首个发行版包含两个逻辑 Workflow：

- **Implementation**：把一份精确冻结、具备实现授权的上游设计转化为经过测试和独立对抗检查的特性分支候选变更，由 Goal Graph、Test Ladder 与演进式 TDD 驱动。
- **System Design**：把简短、模糊的设计请求转化为 `IMPLEMENTATION_READY` 的 System Design，经历 adaptive grilling、冻结的 Brief 与 Skeleton、单一 writer 扩写与三个独立 Review。

## Developer preview

本仓库是 workflow-self-recursive 架构优先开发者预览版的一部分，适用于个人或小团队的可信本地环境。当前以 design-time 模型发布 Workflow 定义与资源；Workflow Contract 与机器可读 Runtime DSL 尚未发布，因此 Package 通过 `UNMANAGED_SIMULATION` 与 package 自带的 CLI gates 验证。**后续会有破坏兼容性的变更。**

## 结构

每个 Package 遵循 [Workflow 组合模型](https://github.com/firestige/workflow-self-recursive/blob/main/docs/workflow-composition-model.md)，让四个关注点可独立定位：

- Package index（`README.md`）；
- Workflow Definition（`workflow.md`），作为流程语义的唯一来源；
- 按类型拆分的资源目录（`roles/`、`agents/`、`prompts/actions/`、`skills/`、`templates/`、`schemas/`、`validators/`、`conformance/`）；
- 显式的 artifact 生命周期与 Git identity 规则。

## 获取源码

本仓库通常作为 [workflow-self-recursive](https://github.com/firestige/workflow-self-recursive) 的 submodule 使用：

```sh
git clone --recurse-submodules https://github.com/firestige/workflow-self-recursive.git
```

单独克隆：

```sh
git clone https://github.com/firestige/workflow-package.git
```

## 文档

- [Implementation Workflow Package](implementation/README.md)
- [System Design Workflow Package](system-design/README.md)
- [Workflow 组合模型](https://github.com/firestige/workflow-self-recursive/blob/main/docs/workflow-composition-model.md)
- [概念架构](https://github.com/firestige/workflow-self-recursive/blob/main/docs/agent-architecture.zh-CN.md)

## License

[Apache-2.0](LICENSE)
