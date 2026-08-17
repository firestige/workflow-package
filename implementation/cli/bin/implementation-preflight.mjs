#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import {
  CliError, emit, git, handleError, parseArguments, readJson, repositoryRelative,
  requireOption, sha256File, splitList, worktreePaths,
} from "../lib/core.mjs";

try {
  const { options } = parseArguments(process.argv.slice(2));
  const project = path.resolve(requireOption(options, "project"));
  const design = path.resolve(requireOption(options, "design"));
  const harness = path.resolve(requireOption(options, "harness"));
  const obligations = path.resolve(requireOption(options, "obligations"));
  if (!fs.existsSync(design)) throw new CliError("DESIGN_NOT_FOUND", `design '${design}' does not exist`);
  if (!fs.existsSync(harness)) throw new CliError("HARNESS_NOT_FOUND", `harness '${harness}' does not exist`);
  if (!fs.existsSync(obligations)) throw new CliError("OBLIGATIONS_NOT_FOUND", `obligation register '${obligations}' does not exist`);
  git(project, ["rev-parse", "--is-inside-work-tree"]);
  const designText = fs.readFileSync(design, "utf8");
  const readyStatus = /(?:^|\n)\s*Status\s*:\s*`?IMPLEMENTATION_READY`?\b/.test(designText)
    || /\|\s*Status\s*\|[^\n]*`IMPLEMENTATION_READY`/.test(designText);
  if (!readyStatus) throw new CliError("DESIGN_NOT_READY", "design is not IMPLEMENTATION_READY");
  const binding = readJson(harness);
  for (const phase of ["focused", "full", "coverage"]) {
    if (!binding.commands?.[phase]) throw new CliError("HARNESS_INCOMPLETE", `harness command '${phase}' is required`);
  }
  for (const [phase, command] of Object.entries(binding.commands ?? {})) {
    if (!command || !Array.isArray(command.argv) || command.argv.length === 0
      || command.argv.some((value) => typeof value !== "string" || !value)) {
      throw new CliError("INVALID_HARNESS_COMMAND", `phase '${phase}' must declare a non-empty argv array`);
    }
  }
  const admitted = new Set(splitList(options.allow_dirty));
  for (const file of [design, harness, obligations]) {
    const relative = repositoryRelative(project, file);
    if (relative) admitted.add(relative);
  }
  const dirty = worktreePaths(project).filter((file) => !admitted.has(file));
  if (dirty.length) throw new CliError("DIRTY_WORKTREE", "worktree contains unowned changes", { paths: dirty });
  const baseline = git(project, ["rev-parse", "HEAD"]).stdout.trim();
  emit({
    status: "PASSED",
    baseline_commit: baseline,
    design_path: design,
    design_sha256: sha256File(design),
    harness_path: harness,
    harness_sha256: sha256File(harness),
    obligation_register_path: obligations,
    obligation_register_sha256: sha256File(obligations),
  });
} catch (error) {
  handleError(error);
}
