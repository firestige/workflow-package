# Runtime Custodian Boundary

This resource documents the deterministic lifecycle boundary used by SD-14 and
SD-15. It is not an Agent Role, does not create an Agent session, and grants no
Route, tool, or model authority.

The Runtime may invoke only the validators declared by those deterministic
Actions. It may freeze the exact admitted Definition/Snapshot bindings, promote
the declared final artifacts, and apply the declared cleanup gate. It may not
make design judgments, close review findings, weaken a Gate, or reinterpret a
non-success terminal as success.
