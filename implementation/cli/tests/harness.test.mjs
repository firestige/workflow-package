import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { initRepository, runCli, writeJson } from "./helpers.mjs";

test("harness runner executes the frozen argv without a shell", () => {
  const project = initRepository();
  const marker = path.join(project, "marker.txt");
  const binding = path.join(project, "harness.json");
  writeJson(binding, {
    schema_version: "1.0.0",
    commands: {
      focused: {
        argv: [process.execPath, "-e", "require('node:fs').writeFileSync(process.argv[1], 'ok')", marker]
      }
    }
  });

  const result = runCli("implementation-test.mjs", [
    "run", "--project", project, "--binding", binding, "--phase", "focused"
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.json.status, "PASSED");
  assert.equal(fs.readFileSync(marker, "utf8"), "ok");
  assert.deepEqual(result.json.argv, JSON.parse(fs.readFileSync(binding)).commands.focused.argv);
});

test("harness runner rejects shell command strings", () => {
  const project = initRepository();
  const binding = path.join(project, "harness.json");
  writeJson(binding, {
    schema_version: "1.0.0",
    commands: { focused: { command: "npm test && echo unsafe" } }
  });

  const result = runCli("implementation-test.mjs", [
    "run", "--project", project, "--binding", binding, "--phase", "focused"
  ]);

  assert.notEqual(result.status, 0);
  assert.equal(result.json.code, "INVALID_HARNESS_COMMAND");
});
