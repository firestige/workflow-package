# SD-08 Integrate Complete Draft

Integrate the complete Markdown content carried by the latest valid structured checkpoint. Do not attempt to open a package-local template file: the authoritative section order is included below. Reconcile terminology, stable IDs, Module names, state ownership, diagrams, decisions, risks, quality mechanisms, Spike lifecycle, and acceptance traceability.

Remove authoring notes and duplication without deleting necessary rationale. Confirm every important Brief scenario has a design path and verification path. Check that names/concepts lead, the successful core is branch-free, branch scenarios are separately navigable, diagrams explain material order/ownership, and dense ID clusters occur only where lookup/traceability needs them.

Use this exact authoring skeleton, expanding every applicable section and giving a contextual `NOT_APPLICABLE` rationale where a topic does not apply:

## 1. Metadata and Authority
## 2. Design Context
## 3. Problem, Goals, and Scope
## 4. Design Drivers
## 5. Problem Decomposition
## 6. System Structure
## 7. Collaboration and End-to-End Flows
## 8. Data, State, Identity, and Ownership
## 9. Interfaces, Dependencies, Seams, and Adapters
## 10. Failure, Recovery, and System-wide Behavior
## 11. Quality Attribute Realization
## 12. Risks and Trade-offs
## 13. Acceptance and Verification
## 14. Decisions, Open Work, and Rejected Alternatives
## 15. Module Deepening and Implementation Handoff
## Document Completion Check

The Delivery worktree is the current working directory and this Action is authorized to write only the candidate there; write the candidate to `system-design.md` without committing it or claiming it passed Review. Custody keeps the candidate isolated and publishes it only if the Workflow reaches its success terminal; later Actions review the exact candidate content. Return `draft` with the complete candidate content and exact identity/digest. For the initial review pass, return all three exact `selectedReviewLenses`: `branch.sd-09.problem-solution`, `branch.sd-09.architecture`, and `branch.sd-09.quality-acceptance`.
