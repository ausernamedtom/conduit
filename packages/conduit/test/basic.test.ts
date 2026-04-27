import { describe, expect, it } from "vitest";
import { buildConfig, loadWorkflow } from "../src/config/workflow.js";
import { renderPrompt } from "../src/prompt/render.js";

describe("workflow config", () => {
  it("loads the example workflow", async () => {
    const workflow = await loadWorkflow(".conduit/workflow.example.md");
    const config = buildConfig(workflow, process.cwd());
    expect(config.tracker.kind).toBe("fake");
    expect(config.workspace.baseRef).toBe("main");
    expect(config.state.root).toContain(".conduit");
    expect(config.tracker.excludedLabels).toContain("blocked");
  });
});

describe("prompt rendering", () => {
  it("renders supported variables", () => {
    const config = buildConfig({ path: "WORKFLOW.md", config: {}, promptTemplate: "" }, process.cwd());
    const text = renderPrompt("Hello {{issue.identifier}} in {{workspace.path}}", {
      config,
      issue: { id: "1", identifier: "ABC-1", title: "T", description: null, priority: null, state: "Todo", branchName: null, url: null, labels: ["ai"], blockedBy: [], createdAt: null, updatedAt: null },
      workspace: { path: "/tmp/w", workspaceKey: "abc-1", branchName: "conduit/abc-1/1", createdNow: true },
      attempt: { id: "a1", issueId: "1", issueIdentifier: "ABC-1", attempt: 1, workspacePath: "/tmp/w", branchName: "b", startedAt: new Date().toISOString(), status: "running" }
    });
    expect(text).toContain("Hello ABC-1 in /tmp/w");
  });
});
