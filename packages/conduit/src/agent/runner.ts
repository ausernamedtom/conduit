import type { RunAttempt } from "../domain/types.js";

export type AgentResult = { status: "succeeded" | "failed" | "timed_out"; exitCode?: number; output: string; error?: string };
export interface AgentRunner { run(attempt: RunAttempt, prompt: string): Promise<AgentResult>; }

export class FakeAgentRunner implements AgentRunner {
  async run(_attempt: RunAttempt, prompt: string): Promise<AgentResult> { return { status: "succeeded", output: `fake agent received ${prompt.length} chars` }; }
}
