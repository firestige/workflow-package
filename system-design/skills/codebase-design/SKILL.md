---
name: codebase-design
description: Design cohesive Modules and narrow Interfaces around authoritative state, complexity, and change locality.
---

# Codebase Design

Use this Skill as structural design guidance under the current Workflow and Action authority.

Decompose the problem before naming Modules. Give each Module one cohesive responsibility and make it hide meaningful complexity behind a small, complete Interface. Identify authoritative state and its unique writer, dependency direction, transactional or concurrency boundaries, and the seams where external systems or volatile policy enter.

Prefer deep Modules, stable acyclic dependencies, high caller leverage, and local changes. Apply a deletion test: if removing a proposed Module barely changes caller complexity, it is probably only a wrapper. Avoid pass-through layers, fragmented ownership, generic abstractions without demonstrated variation, and Interfaces that leak storage, provider, or orchestration mechanics.

Trace the successful core scenario first, then the relevant failures and recovery across Interfaces. Make invariants, ordering, idempotency, errors, performance characteristics, and test seams observable where callers need them. Preserve the difference between target design and current implementation evidence.
