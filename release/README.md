# Workflow asset release adapter

This adapter builds deterministic first-party Workflow Package archives and binds them to their package identity and candidate revision. It does not publish npm packages.

```sh
node release/cli/release.cjs config
```

Use the `release/next` ref for candidate dispatch. Stable promotion is separate and only its final GitHub Release operation uses the release App token.
