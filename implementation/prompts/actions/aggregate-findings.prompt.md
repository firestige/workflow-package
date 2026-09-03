# IM-13 Aggregate and Route Findings

Read the isolated review results after the barrier closes. Preserve source lens and severity, merge only exact common causes, expose contradictions and assign each Finding a valid negative-feedback form and return Action.

Do not adjudicate, alter severity, edit code/tests or close Findings. A design-semantic change routes to stop/new Delivery; it never enters targeted resolution.

When every isolated review result contains no Findings, return `finding: "none"`, `routedFindings: []`, and `routing: "aggregate-commit"`.
