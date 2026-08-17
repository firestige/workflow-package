#!/usr/bin/env node
import path from "node:path";

import {
  changedPaths, CliError, emit, handleError, matchesAny, parseArguments, readJson,
  requireOption, snapshotTree, splitList,
} from "../lib/core.mjs";

try {
  const { positional, options } = parseArguments(process.argv.slice(2));
  const project = path.resolve(requireOption(options, "project"));
  if (positional[0] === "snapshot") {
    emit({ status: "SNAPSHOTTED", tree: snapshotTree(project) });
    process.exit(0);
  }
  if (positional[0] !== "check") throw new CliError("UNKNOWN_COMMAND", "expected 'snapshot' or 'check'");
  const baseline = requireOption(options, "baseline");
  const policy = readJson(path.resolve(requireOption(options, "policy")));
  const roleName = requireOption(options, "role");
  const role = policy.roles?.[roleName];
  if (!role) throw new CliError("UNKNOWN_ROLE", `writer policy has no role '${roleName}'`);
  const ignored = new Set(splitList(options.allow_dirty));
  const paths = changedPaths(project, baseline).filter((file) => !ignored.has(file));
  const violations = [];
  for (const file of paths) {
    if (matchesAny(file, role.deny ?? [])) violations.push({ path: file, reason: "denied" });
    else if (!matchesAny(file, role.allow ?? [])) violations.push({ path: file, reason: "not-allowed" });
  }
  if (violations.length) throw new CliError("WRITER_POLICY_VIOLATION", `role '${roleName}' changed files outside its authority`, { violations, changed_paths: paths });
  emit({ status: "PASSED", role: roleName, baseline, changed_paths: paths });
} catch (error) {
  handleError(error);
}
