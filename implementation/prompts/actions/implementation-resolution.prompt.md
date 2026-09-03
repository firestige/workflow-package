# IM-14I Implementation Resolution

Resolve only the implementation-side entries in the bound `routedFindings` against their negative feedback. Modify production paths minimally, run focused/affected regression, and preserve all frozen tests and design boundaries. If a finding says a required production file is absent, create that file; do not reinterpret absence as an acceptable empty change.

Return treatment identity, changed production paths and evidence for source-lens recheck. Do not close the Finding or edit tests/Git history.

Use the admitted workspace tool with relative paths. You must perform a workspace `write` for every production path named by the finding or treatment, using operation `write`, and then operation `read` for every written path. A source defect cannot be resolved by explanation alone, and you must not return `treatmentRecorded: true` until the read results contain the repaired implementation.
