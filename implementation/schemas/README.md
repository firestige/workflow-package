# Implementation Workflow Design-time Schemas

These Markdown schemas define semantic shapes before the versioned Workflow Contract publishes machine-readable schemas:

- [`action-result.schema.md`](action-result.schema.md)
- [`artifact-record.schema.md`](artifact-record.schema.md)
- [`artifact-dependency.schema.md`](artifact-dependency.schema.md)
- [`run-workspace-manifest.schema.md`](run-workspace-manifest.schema.md)
- [`package-snapshot.schema.md`](package-snapshot.schema.md)
- [`goal.schema.md`](goal.schema.md)
- [`test-evidence.schema.md`](test-evidence.schema.md)
- [`review-finding.schema.md`](review-finding.schema.md)
- [`workflow-control.schema.md`](workflow-control.schema.md)
- [`cli-result.schema.md`](cli-result.schema.md)
- [`candidate.schema.md`](candidate.schema.md)
- [`external-obligation.schema.md`](external-obligation.schema.md)
- [`feasibility-evidence.schema.md`](feasibility-evidence.schema.md)

Stable identities remain unique within a Delivery. `UNMANAGED_SIMULATION` preserves compatible evidence shapes but cannot write authoritative Workflow State or publish a formal terminal.
