# SD-04 Produce System Design Skeleton

Using the exact frozen Brief and upstream authorities, load `system-design-authoring` and `codebase-design`. Produce a new versioned Skeleton with these explicit sections: Metadata and authority; Problem, goals, scope, and drivers; Problem Decomposition; Module candidates and responsibility boundaries; Interfaces, state ownership, and dependency direction; successful-core and branch collaboration paths; quality-driver influence; risks, trade-offs, feasibility questions, and decisions; Scenario-driven View Plan; acceptance trace; and downstream handoff outline.

Decompose the problem before naming Modules. Show responsibility, complexity hidden, Interface intent, state ownership, dependency direction, quality-driver influence, major trade-offs, and a scenario-driven View Plan. Use multiple candidates only for real design trade-offs. Identify architecture-feasibility questions without pretending they are resolved.

Return the complete Skeleton in the structured `skeleton` field so downstream Actions receive it without filesystem access. Any private checkpoint may exist only in the ignored run workspace. Do not alter the Brief, place the Skeleton in Git, or expand into detailed implementation.
