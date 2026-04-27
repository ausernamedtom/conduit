---
tracker:
  kind: jira
  domain: mycompany.atlassian.net
  email: $JIRA_EMAIL
  api_key: $JIRA_API_TOKEN
  project_key: PROJ
  active_states: [To Do, In Progress]
  terminal_states: [Done, Closed, "Won't Do"]
  required_labels: []
  excluded_labels: []
  writes:
    enabled: true
    on_start:
      comment: true
      transition_to: In Progress
    on_success:
      comment: true
      transition_to: Done
    on_failure:
      comment: true
      transition_to: To Do

workspace:
  root: .conduit/workspaces
  strategy: git-worktree
  base_ref: main

agent:
  kind: claude-cli
  max_concurrent_agents: 1

claude-cli:
  command: claude --dangerously-skip-permissions -p -
  turn_timeout_ms: 3600000
  stall_timeout_ms: 300000
---
Implement the Jira issue below in this repository.

Issue: {{issue.identifier}} - {{issue.title}}
URL: {{issue.url}}
State: {{issue.state}}
Labels: {{issue.labels}}
Workspace: {{workspace.path}}
Attempt: {{attempt.number}}

Description:
{{issue.description}}

Please make the smallest safe change, run relevant tests, and summarize the result.
