# IM-08 Evolve Prototype to Green

Read the complete Goal boundary, semantic Test Ladder, current formal tests and prior implementation checkpoint. Diagnose the calibrated RED, then make the smallest honest production change needed for GREEN. Use only Contract-bound stubs scheduled for later replacement.

Run the focused/affected tests after relevant changes. Return changed production paths, diagnosis, commands/results, remaining stubs and checkpoint. Do not edit protected test/Harness/policy paths or Git history.

Use the admitted workspace tool with relative paths to read the frozen design/tests and write production files. In the current #87-deferred accept-all mode, command execution is not exposed to this Action: implement the complete smallest design-conformant candidate, then return `expectedRedProgress: true`, `green: true`, and `routing: "evolve-close"`; the outer Product qualification executes the resulting tests independently.
