---
name: evolutionary-tdd-implementation
description: Evolve production implementation from calibrated RED to minimal GREEN through a frozen semantic Test Ladder. Use for implementation and bounded refactor Actions where the Implementer must not change formal tests or expand the frozen design.
---

# Evolutionary TDD Implementation

## Move one rung

1. Read the full Goal boundary and semantic ladder, then focus on the current released tests.
2. Reproduce the recorded RED and diagnose its cause.
3. Make the smallest honest production change that satisfies current behavior.
4. Run the focused command after relevant edits; run affected regression before returning GREEN.
5. Record changed paths, diagnosis, remaining Contract-bound stubs and a recoverable checkpoint.

Treat the implementation as an evolutionary prototype. Keep it in the candidate path and deepen it rung by rung. Stub only later collaborators behind known Contracts; bind every stub to a replacement rung. Never stub the current core behavior.

## Refactor only under GREEN

Improve project-relevant clarity, duplication or structure while tests remain GREEN. Prefer `NO_REFACTOR_NEEDED` over speculative abstraction. Do not add future capabilities, generic reliability machinery or unrelated cleanup.

Never edit formal tests, fixtures, Harness/coverage/writer configuration or Git history. Do not skip tests, retry unchanged flaky tests to GREEN, launch another Workflow or claim Goal completion.
