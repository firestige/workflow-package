# workflow-package

English | [中文](README.zh-CN.md)

workflow-package holds the versioned Workflow Packages that workflow-self-recursive executes. Each package is an owner-declared, versioned closure of a Workflow Definition together with its Actions, Role routes, Prompts, Skills, models, tools, Drivers, schemas, validators, and conformance resources. It is a repository workstream — the home of the Workflow definitions and resources — not one of the two product systems.

The repository ships independently versioned logical Workflows:

- **Implementation** turns a frozen, authorized upstream design into a tested, independently reviewed feature-branch candidate change, driven by a Goal Graph, a Test Ladder, and evolutionary TDD.
- **System Design** turns a short, ambiguous design request into an `IMPLEMENTATION_READY` System Design through adaptive grilling, a confirmed Brief and Skeleton, single-writer drafting, and three independent reviews.
- **Hello World 0.1.0** is a non-initial installation proof: one model-backed Action consumes the current Intake TaskPrompt and returns structured success without tool or workspace authority.

## Developer preview

This repository is part of workflow-self-recursive's architecture-first developer preview for trusted local use by individuals and small teams. It publishes Workflow definitions and resources under a design-time model; the Workflow Contract and a machine-readable Runtime DSL are not yet published, so packages are validated through `UNMANAGED_SIMULATION` with package-owned CLI gates. **THERE WILL BE COMPATIBILITY-BREAKING CHANGES.**

## Structure

Each package keeps four concerns independently locatable, following the [Workflow composition model](https://github.com/firestige/workflow-self-recursive/blob/main/docs/workflow-composition-model.md):

- a package index (`README.md`);
- a Workflow Definition (`workflow.md`) as the single source of flow semantics;
- a resource catalog split by type (`roles/`, `agents/`, `prompts/actions/`, `skills/`, `templates/`, `schemas/`, `validators/`, `conformance/`);
- an explicit artifact lifecycle and Git-identity rules.

## Get the source

This repository is normally consumed as a submodule of [workflow-self-recursive](https://github.com/firestige/workflow-self-recursive):

```sh
git clone --recurse-submodules https://github.com/firestige/workflow-self-recursive.git
```

To clone it standalone:

```sh
git clone https://github.com/firestige/workflow-package.git
```

## Documentation

- [Implementation Workflow Package](implementation/README.md)
- [System Design Workflow Package](system-design/README.md)
- [Hello World Workflow Package](hello-world-workflow/README.md)
- [Workflow composition model](https://github.com/firestige/workflow-self-recursive/blob/main/docs/workflow-composition-model.md)
- [Conceptual architecture](https://github.com/firestige/workflow-self-recursive/blob/main/docs/agent-architecture.md)

## License

[Apache-2.0](LICENSE)
