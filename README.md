# workflow-package

English | [中文](README.zh-CN.md)

workflow-package holds the versioned Workflow Packages that workflow-self-recursive executes. Each package is an owner-declared, versioned closure of a Workflow Definition together with its Actions, Role routes, Prompts, Skills, models, tools, Drivers, schemas, validators, and conformance resources. It is a repository workstream — the home of the Workflow definitions and resources — not one of the two product systems.

The repository ships independently versioned logical Workflows:

- **Implementation** turns a frozen, authorized upstream design into a tested, independently reviewed feature-branch candidate change, driven by a Goal Graph, a Test Ladder, and evolutionary TDD.
- **System Design** turns a short, ambiguous design request into an `IMPLEMENTATION_READY` System Design through adaptive grilling, a confirmed Brief and Skeleton, single-writer drafting, and three independent reviews.
- **Hello World 0.2.0** is the multi-provider installation proof: a Copilot-backed greeter Role hands its structured result to a Codex-backed reviewer Role, without tool or workspace authority.

## Developer preview

This repository is part of workflow-self-recursive's architecture-first developer preview for trusted local use by individuals and small teams. Packages are validated against the exact frozen Workflow Contract used by their release. Hello World 0.2.0, Implementation 0.4.1, and System Design 0.4.1 use Runtime DSL 2.0. **THERE WILL BE COMPATIBILITY-BREAKING CHANGES.**

## Structure

Each package keeps four concerns independently locatable, following the [Workflow composition model](https://github.com/firestige/workflow-self-recursive/blob/main/docs/workflow-composition-model.md):

- a package index (`README.md`);
- a Workflow Definition (`workflow.md`) as the single source of flow semantics;
- a resource catalog split by type (`roles/`, `agents/`, `prompts/actions/`, `skills/`, `templates/`, `schemas/`, `validators/`, `conformance/`);
- an explicit artifact lifecycle and Git-identity rules.

## Install a Workflow Package

Product users select a Workflow with `name`, `name@latest`, or exact `name@version`. Execution resolves a bare name or `@latest` through its sticky-local alias and its single configured Source, then freezes the selected exact `name@version`, digest, and local path into the Delivery. It downloads immutable public GitHub Releases at `workflow-package/<name>/v<version>` from `firestige/wsr-workflow-package`, verifies their descriptor, checksum, provenance, compatible Contract revision, Package closure, Workflow schema, and Snapshot identities, then admits them to the exact-content cache. No repository clone or repository development dependency is required.

Repository cloning remains a contributor workflow only; it is never a runtime fallback. `latest` is a controlled package selector, not a tag, branch, ambient-checkout, or local-source fallback.

## Documentation

- [Implementation Workflow Package](implementation/README.md)
- [System Design Workflow Package](system-design/README.md)
- [Hello World Workflow Package](hello-world-workflow/README.md)
- [Workflow composition model](https://github.com/firestige/workflow-self-recursive/blob/main/docs/workflow-composition-model.md)
- [Conceptual architecture](https://github.com/firestige/workflow-self-recursive/blob/main/docs/agent-architecture.md)

## License

[Apache-2.0](LICENSE)
