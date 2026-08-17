# Implementation Review Finding Schema

A Finding requires `finding_id`, `source_lens`, source result identity, `review_scope` (`GOAL | WHOLE_SCOPE`), exact candidate/Goal/rung when applicable, location, observed problem, frozen requirement/context applicability, evidence, concrete impact, negative-feedback form, resolution direction, severity, confidence, status and `return_action` (`IM-16 | IM-17`). A closed disposition also records `closed_by_lens`, which must equal `source_lens`.

Severity is `BLOCKING | MAJOR | MINOR`; `REVIEW_SIGNAL` is not a Finding. Status is `OPEN | CLOSED_FIXED | CLOSED_NOT_VALID | ACCEPTED_MINOR`. Only the source lens may apply a closing status.

Negative-feedback form is `EXECUTABLE_TEST | DETERMINISTIC_CHECK | SEMANTIC_RECHECK`. Goal/design semantic expansion is not a resolution direction; it stops the Delivery.
