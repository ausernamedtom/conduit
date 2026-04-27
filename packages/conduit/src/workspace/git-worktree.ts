import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import type { Issue, ServiceConfig, Workspace } from "../domain/types.js";

export class GitWorktreeManager {
  constructor(private readonly config: ServiceConfig) {}
  async prepare(issue: Issue, attempt: number, dryRun = false): Promise<Workspace> {
    await this.assertSafeRoot();
    const key = sanitize(issue.identifier || issue.id);
    const branchName = `conduit/${key}/${attempt}`;
    const workspacePath = path.join(this.config.workspace.root, key, `attempt-${attempt}`);
    if (!dryRun) {
      await mkdir(path.dirname(workspacePath), { recursive: true });
      await git(this.config.repoPath, ["rev-parse", "--git-dir"]);
      await git(this.config.repoPath, ["worktree", "add", "-b", branchName, workspacePath, this.config.workspace.baseRef]);
    }
    return { path: workspacePath, workspaceKey: key, branchName, createdNow: true };
  }
  async remove(workspacePath: string): Promise<void> { await this.assertInsideRoot(workspacePath); await rm(workspacePath, { recursive: true, force: true }); }
  private async assertSafeRoot() {
    const root = path.resolve(this.config.workspace.root); const repo = path.resolve(this.config.repoPath);
    if (root === repo || root === path.parse(root).root || root.length < repo.length) throw new Error(`unsafe_workspace_root: ${root}`);
  }
  private async assertInsideRoot(target: string) { const rel = path.relative(path.resolve(this.config.workspace.root), path.resolve(target)); if (rel.startsWith("..") || path.isAbsolute(rel)) throw new Error(`unsafe_workspace_path: ${target}`); }
}

function sanitize(s: string) { return s.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "issue"; }
function git(cwd: string, args: string[]): Promise<void> { return new Promise((resolve, reject) => { const p = spawn("git", args, { cwd, stdio: "pipe" }); let err = ""; p.stderr.on("data", d => err += d); p.on("error", reject); p.on("close", code => code === 0 ? resolve() : reject(new Error(`git ${args.join(" ")} failed: ${err}`))); }); }
