import type { Issue, RunAttempt, ServiceConfig, Workspace } from "../domain/types.js";

export function renderPrompt(template: string, input: { issue: Issue; workspace: Workspace; attempt: RunAttempt; config: ServiceConfig; previousError?: string }): string {
  const header = [`Issue: ${input.issue.identifier} - ${input.issue.title}`, `State: ${input.issue.state}`, `Labels: ${input.issue.labels.join(", ")}`, `URL: ${input.issue.url ?? ""}`, `Workspace: ${input.workspace.path}`, ""].join("\n");
  const rendered = template.replace(/{{\s*([a-zA-Z0-9_.]+)\s*}}/g, (_m, key: string) => {
    const value = lookup(key, input);
    if (value === undefined) throw new Error(`prompt_render_missing_variable: ${key}`);
    return Array.isArray(value) ? value.join(", ") : String(value ?? "");
  });
  return `${header}${rendered}`;
}

function lookup(key: string, i: { issue: Issue; workspace: Workspace; attempt: RunAttempt; config: ServiceConfig; previousError?: string }): unknown {
  const map: Record<string, unknown> = {
    "issue.id": i.issue.id, "issue.identifier": i.issue.identifier, "issue.title": i.issue.title, "issue.description": i.issue.description, "issue.url": i.issue.url, "issue.state": i.issue.state, "issue.labels": i.issue.labels,
    "workspace.path": i.workspace.path, "attempt.id": i.attempt.id, "attempt.number": i.attempt.attempt, "retry.previous_error": i.previousError ?? "", "service.repo_path": i.config.repoPath
  };
  return map[key];
}
