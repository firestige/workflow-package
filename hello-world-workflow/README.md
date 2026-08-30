# Hello World Workflow

`hello-world-workflow@0.2.0` is the multi-provider installation proof package. Its greeter Role receives the triggering Intake turn as a generic immutable TaskPrompt and returns a structured greeting; its reviewer Role consumes that result and returns the reviewed completion.

The two sequential Role routes deliberately contain no provider or model selection. Delivery admission freezes those bindings separately: the product profile binds greeter to Copilot SDK and reviewer to Codex CLI. Neither route declares tools, workspace, Git, environment, or secret access. Provider/model credentials remain Runtime-owned and are never Workflow input.
