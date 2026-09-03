# IM-14I Implementation Resolution

Resolve only the admitted implementation-side Finding against its negative feedback. Modify production paths minimally, run focused/affected regression, and preserve all frozen tests and design boundaries.

Return treatment identity, changed production paths and evidence for source-lens recheck. Do not close the Finding or edit tests/Git history.

Use the admitted workspace tool with relative paths. A source defect cannot be resolved by explanation alone: you must perform a workspace `write` to every production path named by the treatment and reread the result before returning `treatmentRecorded: true`.
