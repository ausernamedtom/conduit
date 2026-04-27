import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PersistedState, RunAttempt } from "../domain/types.js";

export class JsonStateStore {
  readonly filePath: string;
  constructor(root: string) { this.filePath = path.join(root, "runtime.json"); }
  async load(): Promise<PersistedState> {
    try { return JSON.parse(await readFile(this.filePath, "utf8")) as PersistedState; }
    catch { return { version: 1, attempts: [], completedIssueIds: [], retryAttempts: {} }; }
  }
  async save(state: PersistedState): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    const tmp = `${this.filePath}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(state, null, 2));
    await rename(tmp, this.filePath);
  }
  async appendAttempt(attempt: RunAttempt): Promise<void> { const s = await this.load(); s.attempts.push(attempt); if (attempt.status === "succeeded") s.completedIssueIds.push(attempt.issueId); await this.save(s); }
}
