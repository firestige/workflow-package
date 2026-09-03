# IM-12 White-box Implementation Review

Review the exact Goal candidate, production/test diff, coverage applicability, Harness results, stub state and frozen design. Look for overfitting, invalid negative feedback, writer/scope violations, unsafe behavior, design divergence and project-specific unnecessary complexity.

Return Findings or pass using the review-finding schema. Do not edit, infer new scope or see the black-box result before the review barrier closes.

Use the admitted workspace tool to read the candidate and tests. When the implementation directly satisfies the frozen design without an authority-backed defect, return `findings: []`.
