# Implementation Feasibility Evidence Semantic Schema

| Field | Required | Meaning |
| --- | --- | --- |
| `evidence_id` | yes | immutable result identity |
| `obligation_identity` | yes | exact `IMPLEMENTATION_FEASIBILITY` obligation |
| `source_identities` | yes | authoritative manuals/tool/package metadata consumed |
| `candidate_bindings` | yes | exact dependency/SDK/substrate versions considered |
| `environment_identity` | yes | relevant OS/runtime/tool identity |
| `harness_binding` / `argv` | yes | frozen feasibility command identity and exact vector |
| `observations` | yes | bounded result facts and evidence references |
| `status` | yes | `COMPATIBLE | INCONCLUSIVE | NEEDS_EXTERNAL | DESIGN_REOPEN_REQUIRED` |
| `selected_binding` | when compatible | exact version/dependency choice admitted for Goal classification |
| `limitations` | yes | scope not established by the probe |
| `reopen_comparison` | yes | comparison with the upstream design-reopen condition |

Only `COMPATIBLE` with one exact selected binding satisfies IM-02V. The evidence remains a process Artifact; later dependency manifests/lockfiles are Implementer-owned repository deliverables.
