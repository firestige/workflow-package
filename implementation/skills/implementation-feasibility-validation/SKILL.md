---
name: implementation-feasibility-validation
description: Validate implementation-owned dependency versions, SDK/API behavior and local substrate capabilities with bounded exact-argv probes before Goal freeze.
---

# Implementation Feasibility Validation

## Bind the question

Read the exact obligation identity, semantic dependency, required evidence, candidate environment and design-reopen condition. Do not turn an architectural or user-intent choice into a tool experiment.

## Run a bounded probe

Use authoritative manuals plus the frozen Harness `feasibility` argv. Keep installations, generated files and outputs inside the admitted ignored run workspace. Record dependency/version, environment, command, exit status and bounded evidence identities; never use a shell command string or ambient fallback.

## Classify the result

Return one of:

- `COMPATIBLE`: conclusive evidence supports one exact selected binding;
- `INCONCLUSIVE`: more diagnostic evidence is required on the same obligation;
- `NEEDS_EXTERNAL`: an unavailable authority/environment is required;
- `DESIGN_REOPEN_REQUIRED`: evidence contradicts the frozen semantic dependency.

Do not write package manifests, lockfiles, production configuration, formal tests or Harness. Those are later repository deliverables under their owning writer. Do not claim compatibility beyond the observed environment or silently substitute a candidate.
