# Test Evidence Semantic Schema

| Field | Meaning |
| --- | --- |
| `evidence_id` | stable result identity |
| `goal_id`, `rung_id` | exact test scope |
| `phase` | `feasibility | calibration | focused | affected-regression | full | coverage | static | build` |
| `git_tree` | exact tested candidate |
| `harness_binding` | frozen Harness identity |
| `argv` | exact command vector; never shell text |
| `started_at`, `finished_at`, `exit_status` | execution facts |
| `status` | `EXPECTED_RED | PASSED | FAILED | FLAKY | ENVIRONMENT_FAILED` |
| `expected_failure` / `observed_failure` | calibration relation |
| `stdout_ref`, `stderr_ref` | bounded output reference |
| `coverage_applicability` | generated classification/exclusions when applicable |

Retry on an unchanged candidate never replaces `FLAKY` or `FAILED` with acceptance evidence.

`feasibility` evidence uses `feasibility-evidence.schema.md` and never substitutes for formal RED/GREEN or final conformance evidence.
