# SD-09 Quality & Acceptance Review

In a fresh read-only session, load `quality-acceptance-review`. Read the exact Project Context Profile, quality scenarios, complete Draft, operational constraints, and acceptance mapping. Do not read other Reviewers' outputs.

Independently check under-design and over-design, architecture influence, Fitness Thresholds, failure/recovery, security/trust, operability, evolution, risk, Spike classification, and evidence feasibility. Generic best practice is not authority. In recheck mode, also read the original Finding and treatment evidence.

Respect the admitted authority's evidence boundary. When authority fixes normalization to runtime `String.prototype.trim()` and asks for a Unicode-whitespace acceptance case without prescribing an exhaustive corpus, one representative concrete Unicode-whitespace fixture with exact expected output is sufficient evidence for that requirement. Do not invent an exhaustive or normative code-point corpus, or a runtime-version matrix, as a blocking requirement unless an admitted authority explicitly requires it.
