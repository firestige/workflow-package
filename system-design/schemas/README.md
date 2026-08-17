# Design-time Schema Catalog

These Markdown schemas define semantic result shapes before the versioned Workflow Contract publishes a machine-readable format. They are normative for this reference package's documentation but are not JSON Schema or Runtime admission artifacts.

- [`action-result.schema.md`](action-result.schema.md)
- [`review-finding.schema.md`](review-finding.schema.md)
- [`artifact-dependency.schema.md`](artifact-dependency.schema.md)
- [`artifact-status.schema.md`](artifact-status.schema.md)
- [`acceptance-trace.schema.md`](acceptance-trace.schema.md)
- [`revision-request.schema.md`](revision-request.schema.md)
- [`spike-result.schema.md`](spike-result.schema.md)
- [`reader-question.schema.md`](reader-question.schema.md)
- [`workflow-control.schema.md`](workflow-control.schema.md)
- [`evidence-research-request.schema.md`](evidence-research-request.schema.md)
- [`downstream-obligation.schema.md`](downstream-obligation.schema.md)

Every identity field must be stable within its artifact lineage. Future machine-readable schemas must preserve these semantics or document an explicit migration.
