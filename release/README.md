# Workflow asset release adapter

This adapter builds deterministic first-party Workflow Package archives and binds them to their exact Package identity, source revision, Contract revision, checksum, and provenance. It does not publish npm packages.

```sh
node release/cli/release.cjs config
node release/cli/release.cjs build /tmp/workflow-assets "$SOURCE_REVISION" "$CONTRACT_REVISION"
node release/cli/release.cjs qualify /tmp/workflow-assets /path/to/system-contracts/workflow-dsl
```

Use the `release/next` ref for aggregate candidate dispatch. Stable promotion is separate and only its final package-scoped GitHub Release operations use the release App token. Each public stable Release is named `workflow-package/<name>/v<version>` and contains exactly the archive, descriptor, checksum, and provenance assets declared by `release-metadata.json`.
