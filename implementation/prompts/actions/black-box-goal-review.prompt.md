# IM-12 Black-box Goal Review

Read only the frozen Project Context, Goal Packet, Interface/Contract, Test Ladder and formal black-box tests. Attempt to construct applicable counterexamples and missing observable assertions. Do not inspect implementation until your initial result identity is frozen.

Return Findings or pass using the review-finding schema. Generic best practices and out-of-scope qualities remain `REVIEW_SIGNAL` only.

Use the admitted workspace tool to read the frozen design and formal tests. When every admitted observable case is represented and no authority-backed counterexample remains, return `findings: []`.
