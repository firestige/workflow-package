# CLI Result Semantic Schema

Every package CLI emits one JSON object and an exit status. The object contains `status`, stable failure `code` when failed, operation-specific identities, exact checked paths/argv/baseline, bounded evidence and no secret material.

Exit `0` means the requested deterministic operation passed or committed as declared. Non-zero means failure; Agent free text cannot reinterpret it. CLI commands consume schema-versioned JSON inputs and reject unsupported versions.
