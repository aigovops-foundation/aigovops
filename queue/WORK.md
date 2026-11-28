# Work-queue rulebook — WORK

The one set of rules every agent follows when it works a ticket from the AiGovOps Foundation work
queue (GitHub Issues labelled `queue`). The Devin Automations and the Claude worker point here;
Codex and humans follow the same rules. Change a rule by pull request; CODEOWNERS review applies.

## Your rung

The label that started you is your rung. Use its name wherever this file says `<rung>`.

| Start label | Rung | For | On failure after three attempts |
|---|---|---|---|
| `ready:lite` | lite | small, clear tickets: copy, docs, config, a one-file fix | remove `ready:lite` and `in-progress`, add `ready` (starts a normal run), comment "Escalating to normal: <why>", stop |
| `ready` | normal | the default: an ordinary change in one repository with a test | remove `ready` and `in-progress`, add `ready:ultra` (starts an ultra run; Claude hands the ticket to Devin first, see Workers), comment "Escalating to ultra: <why>", stop |
| `ready:ultra` | ultra | cross-repo, auth / payments / security / data, unknown root cause | comment what you tried and what blocks you, remove `in-progress`, add `blocked`, stop. Last rung: a human decides |

## Workers

Two agents work tickets. A ticket's worker label says whose it is; a ticket with no worker label
is Devin's. Wherever this file says `<worker>`, use your own name.

| Worker label | Worker | Starts | Branch |
|---|---|---|---|
| `worker:devin`, or none | Devin | when a start label is added (the Devin Automations) | `devin/<unix-time>-issue-<number>` |
| `worker:claude` | Claude | at its next check, every two hours (a Claude cloud scheduled task on Bob's account) | `claude/<unix-time>-issue-<number>` |

- The nightly triage sets the worker label ([TRIAGE.md](TRIAGE.md), step 4). A human may change it
  before adding the start label. A worker never changes it, except in the hand-off below.
- Ultra runs are Devin's, whatever the worker label says. A ticket started with `ready:ultra` that
  still carries `worker:claude` is Devin's: Devin replaces that label with `worker:devin` as it
  locks, and Claude leaves the ticket alone. When Claude's normal run has to escalate, it first
  replaces `worker:claude` with `worker:devin` and only then adds `ready:ultra`, so the label that
  starts the ultra run finds the ticket already Devin's.
- Claude acts through Bob's GitHub account, so its comments, branches and pull requests show
  `bobrapp` as their author. "Picked up by Claude" in the comment is what marks them as automation.
  They are never a human's approval of anything.
- Claude checks on a timer, not on the label event. It works a ticket once per start label: when its
  Receipt is newer than the last start label added, the ticket is finished until a human removes and
  re-adds that label. If a `worker:claude` ticket has carried `in-progress` for more than six hours
  with no Receipt since, the run that held it has died: the next Claude run takes it over and says
  so in its first comment. No other run may take over a lock.
- A person pauses Claude by opening an issue labelled `claude-paused` in any estate repository, and
  resumes it by closing that issue. Claude reads the switch at the start of every check and never
  opens, closes or edits it. The switch can only stop Claude; it starts nothing and does not touch Devin.
- Every Claude check that reaches GitHub adds one line to the run log in the text of
  aigovops-foundation/aigovops#58 (label `worker-log`): what it picked up, or why it did nothing.

## Steps

Do, in order:
0. Lock. Re-read the issue's current labels with your git tools. If it carries a worker label that is not yours, it is not your ticket: do nothing and stop, with no comment and no label change. The one exception is a ticket started with `ready:ultra`, which is Devin's whatever its worker label says (see Workers). If it is closed or carries `blocked`, do nothing and stop. If it carries `in-progress`, another run owns it: do nothing and stop, unless you are Claude and the ticket meets the stale-lock rule in Workers; then keep `in-progress` and say in your first comment that you are taking over. Otherwise add the label `in-progress`.
1. Read the issue. The repository the change lands in is the Task template's "Where" field or the Bug template's "Repository" field (a Bug's "Where" is the page, run or command that shows the problem); if it says "other / not sure", infer it from the Outcome (Task) or from Where, Expected and Actual (Bug), and say which you chose in your first issue comment. Read that repository's CLAUDE.md / AGENTS.md / CONTRIBUTING.md and follow them.
2. Comment once on the issue: "Picked up by <worker> (<rung>) — plan: <two or three lines>". If the ticket is not clear enough to finish without a decision from a human, do not guess: comment with the one question (options with the reason for each), remove your start label and `in-progress`, add `blocked`, and stop.
3. Work on a branch named <worker>/<unix-time>-issue-<number>, in lower case (devin/... or claude/...). Make the smallest change that makes the Outcome true. Add or update the test the "Proof" field names; run the repository's test battery and keep it green. You may open the live estate pages (aigovops-foundation.com, aigovops.org and their subdomains) read-only to check a Proof; never submit forms there.
4. SIDE-QUEST RULE (strict). If you notice a problem that does NOT stop this ticket's Outcome from being true (a broken link elsewhere, a flaky test, a typo, tech debt, a missing feature), do NOT fix it in this branch. File a new issue in aigovops-foundation/aigovops using the Task template's fields (Outcome, Where, Proof) or the Bug template's fields (Repository, Where, Expected, Actual, Proof), titled "task: ..." or "bug: ...", labelled `queue` and `discovered`, whose body starts with "Found while working on aigovops-foundation/<issue repository>#<number>". Then carry on with this ticket. Do not add `ready` to it. Only fix something outside the Outcome if, without it, this ticket's Proof cannot pass; say so in the PR.
5. Open one pull request against main whose body starts with "Fixes aigovops-foundation/<issue repository>#<number>" (always the fully qualified form; a bare #N would point at the PR repository), states the Outcome, shows the Proof (test output, URL, screenshot), and lists any `discovered` tickets you filed. Watch CI; fix red checks; answer review comments.
6. Comment on the issue, remove `in-progress` (keep your start label so triage skips the ticket; a human retries by removing and re-adding it), then STOP:
   "Receipt — mode: <rung> · attempts: <n> · PR: <link> · result: <PR open, CI green | blocked: reason> · discovered: <links or none>"

   Before posting that receipt, if the ticket's footer starts with "Filed from a Fo text"
   and a PR exists, also text its link to Bob through the Wajo Fo MCP tool `ask_fo`:
   `{"message":"Text me exactly this message: PR for <issue#>: <url>"}`.
   Replace `<issue#>` with the fully qualified queue issue (for example,
   `aigovops-foundation/aigovops#123`) and `<url>` with the actual PR URL. If `ask_fo` is
   unavailable, say "Fo: Wajo Fo MCP ask_fo unavailable; PR link not texted" in the receipt
   comment. If delivery fails or remains unconfirmed, report that instead of claiming it
   was sent. If no PR exists, say so in the receipt; do not send a made-up link.

   Never merge, never push to main, never change repository settings, secrets, DNS, hosting, payments or data. A human merges.

Bounded effort: if after three attempts CI is still red or the Proof cannot be met, follow your rung's "on failure" row in the table above.

## Merging

A worker run never merges (step 6). A pull request is merged in one of three ways, and no other:

1. A person taps Merge.
2. The nightly estate sweep merges a pull request a person labelled `automerge`. Its rules are in the
   header of [scripts/estate-sweep.mjs](../scripts/estate-sweep.mjs).
3. A person tells an agent, in that agent's own session, to merge: one pull request, several, or
   "all". The rest of this section binds that agent, whichever agent it is. The instruction is the
   person's decision; the agent's part is to refuse what the instruction should not cover.

Before each merge ALL of these hold, read fresh from GitHub and not from memory:

- The pull request is open, targets the default branch, and is not a draft. A draft is merged only
  when the person named it, and then the agent first marks it ready and lets its checks run.
- Its title does not start with "HOLD" and does not say "merge at cutover", and it carries no hold
  label. "All" never covers these: a hold is lifted by a person naming that pull request.
- It has at least one check on its head commit, and every check finished green (success, skipped or
  neutral). No checks is not green, and unknown is not green.
- GitHub reports it mergeable and `clean`. If it is behind, update the branch, wait for the checks
  and test again. If it conflicts, or is blocked because it needs a review, say so and move on.
- Nobody's latest review requests changes.

Then:

- Merge with the head commit pinned, so a push after the check loses the race instead of merging
  unseen code. Never use an administrator override, and never turn off a branch rule.
- "All" means the open, non-draft pull requests that pass every line above, in the repositories
  listed in [estate-repos.json](estate-repos.json), at the moment of asking. If that is more than
  five, list them and wait for the person to say go.
- One agent merges at a time. Before a run of more than one merge, look for an open issue labelled
  `merge-lock` in aigovops-foundation/aigovops. If one is less than 30 minutes old, another agent is
  merging: stop and tell the person. Otherwise open one titled "Merge run: <agent>", merge, and close
  it when the run ends. A lock older than 30 minutes is stale: close it, say so, and carry on.
- Afterwards report what merged, what did not and why, and look once at the default branch of each
  repository you merged into: a red main goes in the same report.

An agent that cannot meet a line above does not merge that pull request. It never works around the
line, and it never asks a second agent to.
