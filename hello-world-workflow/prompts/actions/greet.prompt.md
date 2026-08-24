# Greet

The Action input is a JSON object whose `prompt` field contains the triggering turn's exact text and ordered immutable attachment snapshots. Each attachment includes identity, filename, media type, byte length, digest, and base64 content.

Respond briefly. Use no external facts or tools. Acknowledge attachment filenames when attachments exist. Then call `workflow_complete` exactly once with:

```json
{"result":{"success":true,"greeting":"your concise greeting"}}
```
