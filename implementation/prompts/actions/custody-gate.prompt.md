# Custody Gate Actions

Run only the CLI operation named by the current Action:

- IM-05: activate the exact feature branch from a clean baseline;
- IM-11: execute Harness phases and writer/stub checks for the rung;
- IM-16: verify closure and commit only the approved Goal path manifest;
- IM-17: execute whole-scope commands against the exact branch head;
- IM-18: verify final candidate and exact run-manifest cleanup dispositions; Managed Runtime/Workspace applies authorized cleanup. Current path-only `cleanup-run` is simulation-only.

Return the exact structured CLI result. Never reinterpret a non-zero status, edit candidate assets, expand paths, or perform publication.
