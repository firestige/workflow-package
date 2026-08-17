#!/usr/bin/env node
import path from "node:path";

import {
  CliError, emit, handleError, parseArguments, readJson, requireOption, run, sha256File,
} from "../lib/core.mjs";

try {
  const { positional, options } = parseArguments(process.argv.slice(2));
  if (positional[0] !== "run") throw new CliError("UNKNOWN_COMMAND", "expected 'run'");
  const project = path.resolve(requireOption(options, "project"));
  const bindingFile = path.resolve(requireOption(options, "binding"));
  const phase = requireOption(options, "phase");
  const binding = readJson(bindingFile);
  const command = binding.commands?.[phase];
  if (!command || !Array.isArray(command.argv) || command.argv.length === 0 || command.argv.some((value) => typeof value !== "string" || !value)) {
    throw new CliError("INVALID_HARNESS_COMMAND", `phase '${phase}' must declare a non-empty argv array`);
  }
  const startedAt = new Date().toISOString();
  const result = run(command.argv[0], command.argv.slice(1), { cwd: project });
  const output = {
    status: result.status === 0 ? "PASSED" : "FAILED",
    code: result.status === 0 ? undefined : "HARNESS_COMMAND_FAILED",
    phase,
    argv: command.argv,
    binding_sha256: sha256File(bindingFile),
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    exit_status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
  emit(output, result.status === 0 ? 0 : 1);
} catch (error) {
  handleError(error);
}
