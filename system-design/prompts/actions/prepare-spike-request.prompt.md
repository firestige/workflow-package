# SD-06/12 Prepare Spike Request

Prepare one structured Spike Request for one empirical question owned by System Design. Include a stable request identity; classification as architecture feasibility or design-owned parameter; the exact design decision and artifact identities it informs; current evidence; workload/environment; measurement method; expected result form; owner; deadline Gate; return Action/location; and design-reopen threshold.

Create an architecture-feasibility Spike only when an unresolved empirical answer can invalidate the Skeleton's technical direction. Whether a downstream test-Harness or assertion mechanism can prove an already exact observable requirement is a downstream verification obligation, not an architecture-feasibility wait. When no qualifying architecture-feasibility question exists, return `status: "SUCCEEDED"` and `routing: "feasibility-confirmed"` without a Spike.

Do not execute the Spike, invent a number, downgrade an architecture-blocking question to tuning, or run a downstream implementation/configuration obligation on another Workflow's behalf. Those obligations receive a handoff record instead.
