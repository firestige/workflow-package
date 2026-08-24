# Hello World Workflow

`hello-world-workflow@0.1.0` is the first non-initial installation proof package. Its single model-backed Action receives the triggering Intake turn as a generic immutable TaskPrompt, including ordered attachment snapshots, and returns a short structured greeting.

The route declares no tools and no workspace, Git, environment, or secret access. Provider/model credentials remain Runtime-owned and are never Workflow input.
