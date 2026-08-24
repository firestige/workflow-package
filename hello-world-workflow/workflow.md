# Hello World Workflow 0.1.0

The Workflow executes one model-backed Action. The Action reads only the admitted TaskPrompt value, acknowledges the text and any ordered attachments, and calls `workflow_complete` exactly once with `{"success":true,"greeting":"..."}`.

Success means a valid structured result was returned by the configured model. Cancellation and non-retryable execution failure are separate non-success terminals.
