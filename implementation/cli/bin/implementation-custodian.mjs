#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import {
  assertIdentifier, CliError, emit, git, handleError, parseArguments, readJson,
  requireOption, snapshotTree, worktreePaths,
} from "../lib/core.mjs";

function verifyCandidate(file, { mode = "final", goal: requiredGoal } = {}) {
  const candidate = readJson(file);
  const problems = [];
  if (!candidate.candidate_tree) problems.push("candidate tree is missing");
  if (!Array.isArray(candidate.goals) || candidate.goals.length === 0) problems.push("verified Goal set is empty");
  const goalsToVerify = mode === "goal"
    ? (candidate.goals ?? []).filter((goal) => goal.id === requiredGoal)
    : (candidate.goals ?? []);
  if (mode === "goal" && goalsToVerify.length === 0) problems.push(`goal ${requiredGoal} is missing`);
  for (const goal of goalsToVerify) {
    if (goal.status !== "VERIFIED") problems.push(`goal ${goal.id} is ${goal.status}`);
  }
  if (!candidate.obligation_register_identity) problems.push("obligation register identity is missing");
  if (!Array.isArray(candidate.obligations)) problems.push("obligation dispositions are missing");
  for (const obligation of candidate.obligations ?? []) {
    const affectsRequiredGoal = mode === "final" || !Array.isArray(obligation.affected_goal_ids)
      || obligation.affected_goal_ids.length === 0 || obligation.affected_goal_ids.includes(requiredGoal);
    if (!affectsRequiredGoal) continue;
    if (obligation.class === "CONTRACT_PREREQUISITE" && obligation.state !== "VERIFIED") {
      problems.push(`Contract obligation ${obligation.id} is ${obligation.state}`);
    } else if (obligation.class === "IMPLEMENTATION_FEASIBILITY" && obligation.state !== "COMPATIBLE") {
      problems.push(`feasibility obligation ${obligation.id} is ${obligation.state}`);
    } else if (obligation.class === "IMPLEMENTATION_VERIFICATION" && obligation.state !== "VERIFIED") {
      problems.push(`verification obligation ${obligation.id} is ${obligation.state}`);
    } else if (obligation.class === "OPERATIONAL_TUNING") {
      const allowed = obligation.fitness_threshold_required ? ["VERIFIED"] : ["HANDED_OFF", "VERIFIED"];
      if (!allowed.includes(obligation.state)) problems.push(`tuning obligation ${obligation.id} is ${obligation.state}`);
    } else if (!["CONTRACT_PREREQUISITE", "IMPLEMENTATION_FEASIBILITY", "IMPLEMENTATION_VERIFICATION", "OPERATIONAL_TUNING"].includes(obligation.class)) {
      problems.push(`obligation ${obligation.id} has unknown class ${obligation.class}`);
    }
  }
  for (const finding of candidate.findings ?? []) {
    if (finding.status === "ACCEPTED_MINOR" && finding.severity !== "MINOR") problems.push(`invalid accepted-minor finding ${finding.id}`);
    else if (!["CLOSED_FIXED", "CLOSED_NOT_VALID", "ACCEPTED_MINOR"].includes(finding.status)) problems.push(`open finding ${finding.id}`);
    if (["CLOSED_FIXED", "CLOSED_NOT_VALID", "ACCEPTED_MINOR"].includes(finding.status)
      && (!finding.source_lens || finding.closed_by_lens !== finding.source_lens)) {
      problems.push(`finding ${finding.id} was not closed by its source lens`);
    }
  }
  for (const test of candidate.tests ?? []) {
    if (test.status !== "PASSED") problems.push(`${test.phase} test is ${test.status}`);
    if (candidate.candidate_tree && test.baseline !== candidate.candidate_tree) problems.push(`${test.phase} evidence targets ${test.baseline}`);
  }
  const requiredReviews = [];
  for (const goal of goalsToVerify) {
    for (const lens of ["black-box", "white-box"]) requiredReviews.push({ lens, scope: "GOAL", goalId: goal.id, label: `goal ${goal.id} ${lens}` });
  }
  if (mode === "final") {
    for (const lens of ["black-box", "white-box"]) requiredReviews.push({ lens, scope: "WHOLE_SCOPE", label: `whole-scope ${lens}` });
  }
  for (const required of requiredReviews) {
    const review = (candidate.review_results ?? []).find((item) => item.lens === required.lens && item.scope === required.scope && (required.goalId === undefined || item.goal_id === required.goalId) && item.status === "PASSED");
    if (!review) problems.push(`${required.label} review is missing`);
    else if (candidate.candidate_tree && review.baseline !== candidate.candidate_tree) problems.push(`${required.label} review targets ${review.baseline}`);
  }
  for (const stub of candidate.unauthorized_stubs ?? []) problems.push(`unauthorized stub ${stub}`);
  if (!candidate.design_identity) problems.push("design identity is missing");
  for (const required of ["focused", "full", "coverage"]) {
    if (!(candidate.tests ?? []).some((test) => test.phase === required && test.status === "PASSED")) problems.push(`${required} evidence is missing`);
  }
  if (problems.length) throw new CliError("CANDIDATE_NOT_CLOSED", "candidate has unresolved completion conditions", { problems });
  return candidate;
}

function filesBelow(root, predicate = () => true) {
  const found = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) found.push(...filesBelow(file, predicate));
    else if (predicate(file)) found.push(file);
  }
  return found;
}

function verifyPackage(packageRoot) {
  const required = [
    "README.md", "execution-guide.md", "artifact-lifecycle.md", "composition-conformance.md", "workflow.md", "agents/routes.md", "validators/README.md",
    "conformance/positive/README.md", "conformance/negative/README.md", "conformance/recovery/README.md",
    "schemas/artifact-record.schema.md", "schemas/artifact-dependency.schema.md",
    "schemas/run-workspace-manifest.schema.md", "schemas/package-snapshot.schema.md",
    "schemas/external-obligation.schema.md", "schemas/feasibility-evidence.schema.md",
    "templates/run-workspace-manifest.template.json", "templates/package-snapshot.template.json",
    "templates/external-obligation-register.template.md",
    "roles/implementation-feasibility-validator.role.md",
    "prompts/actions/validate-implementation-feasibility.prompt.md",
    "skills/implementation-feasibility-validation/SKILL.md",
    "cli/package.json", "cli/bin/implementation-preflight.mjs", "cli/bin/implementation-test.mjs",
    "cli/bin/implementation-writer.mjs", "cli/bin/implementation-custodian.mjs",
  ];
  const missing = required.filter((relative) => !fs.existsSync(path.join(packageRoot, relative)));
  for (const directory of ["roles", "prompts/actions", "skills", "templates", "schemas"]) {
    if (!fs.existsSync(path.join(packageRoot, directory))) missing.push(`${directory}/`);
  }
  if (missing.length) throw new CliError("PACKAGE_INCOMPLETE", "required package assets are missing", { missing });
  const markdown = filesBelow(packageRoot, (file) => file.endsWith(".md") && !file.includes(`${path.sep}cli${path.sep}tests${path.sep}`));
  const placeholders = [];
  const brokenLinks = [];
  for (const file of markdown) {
    const content = fs.readFileSync(file, "utf8");
    if (/\[TODO(?::|\])|TODO placeholder|Structuring This Skill/.test(content)) placeholders.push(path.relative(packageRoot, file).split(path.sep).join("/"));
    for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1].split("#", 1)[0];
      if (!target || /^(?:https?:|mailto:)/.test(target)) continue;
      const resolved = path.resolve(path.dirname(file), target.replace(/^<|>$/g, ""));
      if (!fs.existsSync(resolved)) brokenLinks.push(`${path.relative(packageRoot, file).split(path.sep).join("/")} -> ${target}`);
    }
  }
  if (placeholders.length) throw new CliError("PACKAGE_PLACEHOLDER", "package contains unfinished placeholders", { paths: placeholders });
  if (brokenLinks.length) throw new CliError("PACKAGE_BROKEN_LINK", "package contains broken local links", { links: brokenLinks });
  const workflow = fs.readFileSync(path.join(packageRoot, "workflow.md"), "utf8");
  const actionIds = [...new Set(workflow.match(/IM-[0-9]{2}[A-Z]?/g) ?? [])].sort();
  const expectedActions = ["IM-01", "IM-01R", "IM-02", "IM-02V", "IM-03", "IM-04", "IM-05", "IM-06", "IM-07", "IM-08", "IM-09", "IM-10", "IM-11", "IM-12", "IM-13", "IM-14I", "IM-14T", "IM-15", "IM-16", "IM-17", "IM-18"];
  const absentActions = expectedActions.filter((action) => !actionIds.includes(action));
  if (absentActions.length) throw new CliError("PACKAGE_ACTION_GAP", "workflow is missing required Actions", { actions: absentActions });
  const referencedActionIds = [...new Set(markdown.flatMap((file) => fs.readFileSync(file, "utf8").match(/IM-[0-9]{2}[A-Z]?/g) ?? []))].sort();
  const unknownActions = referencedActionIds.filter((action) => !expectedActions.includes(action));
  if (unknownActions.length) throw new CliError("PACKAGE_UNKNOWN_ACTION", "package references undefined Actions", { actions: unknownActions });
  const skillRoot = path.join(packageRoot, "skills");
  const skillDirectories = fs.readdirSync(skillRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  const invalidSkills = skillDirectories.filter((entry) => !fs.existsSync(path.join(skillRoot, entry.name, "SKILL.md"))).map((entry) => entry.name);
  if (invalidSkills.length) throw new CliError("PACKAGE_SKILL_GAP", "skill folders lack SKILL.md", { skills: invalidSkills });
  return { actionIds, referencedActionIds, skillCount: skillDirectories.length, checkedFiles: markdown.length };
}

try {
  const { positional, options } = parseArguments(process.argv.slice(2));
  const command = positional[0];
  if (command === "verify-candidate") {
    const file = path.resolve(requireOption(options, "candidate"));
    verifyCandidate(file);
    emit({ status: "PASSED", candidate: file });
  } else if (command === "verify-package") {
    const packageRoot = path.resolve(requireOption(options, "package"));
    const result = verifyPackage(packageRoot);
    emit({ status: "PASSED", package: packageRoot, action_ids: result.actionIds, referenced_action_ids: result.referencedActionIds, skill_count: result.skillCount, checked_files: result.checkedFiles });
  } else if (command === "activate-branch") {
    const project = path.resolve(requireOption(options, "project"));
    const branch = requireOption(options, "branch");
    if (!/^[A-Za-z0-9][A-Za-z0-9._/-]{0,159}$/.test(branch) || branch.includes("..")) throw new CliError("INVALID_BRANCH", "branch name is invalid");
    const dirty = worktreePaths(project);
    if (dirty.length) throw new CliError("DIRTY_WORKTREE", "branch activation requires a clean worktree", { paths: dirty });
    git(project, ["switch", "-c", branch]);
    emit({ status: "ACTIVATED", branch, baseline_commit: git(project, ["rev-parse", "HEAD"]).stdout.trim() });
  } else if (command === "commit-goal") {
    const project = path.resolve(requireOption(options, "project"));
    const goal = requireOption(options, "goal");
    assertIdentifier(goal, "goal");
    const pathsFile = path.resolve(requireOption(options, "paths"));
    const candidateFile = path.resolve(requireOption(options, "candidate"));
    const message = requireOption(options, "message");
    const candidate = verifyCandidate(candidateFile, { mode: "goal", goal });
    const currentTree = snapshotTree(project);
    if (candidate.candidate_tree !== currentTree) {
      throw new CliError("STALE_CANDIDATE", "candidate evidence does not target the current worktree", { candidate_tree: candidate.candidate_tree, current_tree: currentTree });
    }
    const manifest = readJson(pathsFile);
    if (!Array.isArray(manifest.paths) || manifest.paths.length === 0) throw new CliError("EMPTY_COMMIT", "goal path manifest is empty");
    const paths = manifest.paths.map((file) => {
      if (typeof file !== "string" || path.isAbsolute(file) || file.startsWith("../") || file.includes("/../")) throw new CliError("INVALID_COMMIT_PATH", `invalid goal commit path '${file}'`);
      return file;
    });
    const allChanges = worktreePaths(project);
    const unowned = allChanges.filter((file) => !paths.includes(file));
    if (unowned.length) throw new CliError("UNOWNED_CHANGES", "worktree contains changes outside the goal manifest", { paths: unowned });
    git(project, ["add", "--", ...paths]);
    git(project, ["commit", "-m", message]);
    emit({ status: "COMMITTED", goal, candidate_tree: currentTree, commit: git(project, ["rev-parse", "HEAD"]).stdout.trim(), paths });
  } else if (command === "cleanup-run") {
    const project = path.resolve(requireOption(options, "project"));
    const workspace = path.resolve(requireOption(options, "workspace"));
    const allowedRoot = path.join(project, "tmp", "implementation-workflow");
    const relative = path.relative(allowedRoot, workspace);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new CliError("UNSAFE_CLEANUP_PATH", "workspace must be a run directory below project/tmp/implementation-workflow");
    }
    if (!fs.existsSync(workspace)) throw new CliError("WORKSPACE_NOT_FOUND", `workspace '${workspace}' does not exist`);
    const ignored = git(project, ["check-ignore", "-q", "--", workspace], { allowFailure: true });
    if (ignored.status !== 0) throw new CliError("WORKSPACE_NOT_IGNORED", "cleanup workspace must be ignored by Git");
    fs.rmSync(workspace, { recursive: true });
    emit({ status: "CLEANED", workspace });
  } else {
    throw new CliError("UNKNOWN_COMMAND", "expected verify-package, verify-candidate, activate-branch, commit-goal, or cleanup-run");
  }
} catch (error) {
  handleError(error);
}
