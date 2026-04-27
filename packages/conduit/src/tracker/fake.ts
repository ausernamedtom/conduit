import type { Issue } from "../domain/types.js";
import { BaseTracker } from "./tracker.js";

export class FakeTracker extends BaseTracker {
  private readonly issues: Issue[] = [{
    id: "fake-1", identifier: "FAKE-1", title: "Fake Conduit issue", description: "This issue is emitted by the fake tracker for local smoke tests.", priority: 1,
    state: this.config.tracker.activeStates[0] ?? "Todo", branchName: null, url: null, labels: ["ai"], blockedBy: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }];
  async fetchCandidateIssues(): Promise<Issue[]> { return this.issues.filter(i => this.config.tracker.activeStates.includes(i.state)); }
  async fetchIssuesByStates(stateNames: string[]): Promise<Issue[]> { return this.issues.filter(i => stateNames.includes(i.state)); }
  async fetchIssueStatesByIds(issueIds: string[]): Promise<Record<string, string>> { return Object.fromEntries(this.issues.filter(i => issueIds.includes(i.id)).map(i => [i.id, i.state])); }
}
