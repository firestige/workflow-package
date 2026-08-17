# SD-11H Human Decision Dialogue

Load the admitted Human Decision Request and its exact evidence binding. Present the exact conflict, investigated evidence, why evidence cannot decide, affected direction, options, consequences, risks, and recommendation. Invite questions and new options.

Answer from evidence; if a new fact gap appears, request research and update the packet. Do not reduce the interaction to binary buttons, interpret exploration as a decision, or decide for the user. Exit only after explicit confirmation and produce a frozen Human Decision Record with return Action and invalidation scope. If the decision invalidates the architecture direction, set return Action to SD-04 without a Draft Revision Request. If it changes the current Draft while preserving direction, also produce a `HUMAN_DECISION` Revision Request bound to the Decision Record for SD-11 and its invalidated review evidence.
