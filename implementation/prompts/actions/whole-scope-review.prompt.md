# IM-17 Whole-scope Review

Review the exact complete branch after every in-scope Goal commit. The black-box lens challenges cross-Goal observable composition from the frozen design and Project Context without seeing implementation before its initial result freezes. The white-box lens independently inspects shared state, integration paths, full regression/coverage, design conformance and accumulated scope.

Return `WHOLE_SCOPE` review results and Findings against the exact candidate tree. Preserve the review barrier. Findings route through IM-13 and return to IM-17 after source-lens recheck; they never create another Goal commit by default.

Use the admitted workspace tool to read the complete candidate. When no authority-backed whole-scope defect remains, return `passed: true` and `wholeScopeFindingAdmitted: false`.
