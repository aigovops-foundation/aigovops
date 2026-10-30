# Work-queue rulebook — WORK

The one set of rules every agent follows when it works a ticket from the AiGovOps Foundation work
queue (GitHub Issues labelled `queue`). The Devin Automations point here; Codex, Claude Code and
humans follow the same rules. Change a rule by pull request; CODEOWNERS review applies.

## Your rung

The label that started you is your rung. Use its name wherever this file says `<rung>`.

| Start label | Rung | For | On failure after three attempts |
|---|---|---|---|
| `ready:lite` | lite | small, clear tickets: copy, docs, config, a one-file fix | remove `ready:lite` and `in-progress`, add `ready` (starts a normal run), comment "Escalating to normal: <why>", stop |
| `ready` | normal | the default: an ordinary change in one repository with a test | remove `ready` and `in-progress`, add `ready:ultra` (starts an ultra run), comment "Escalating to ultra: <why>", stop |
| `ready:ultra` | ultra | cross-repo, auth / payments / security / data, unknown root cause | comment what you tried and what blocks you, remove `in-progress`, add `blocked`, stop. Last rung: a human decides |

## Steps

Do, in order:
0. Lock. Re-read the issue's current labels with your git tools. If it already carries `in-progress` or `blocked`, or is closed, another run owns it: do nothing and stop. Otherwise add the label `in-progress`.
1. Read the issue. The repository the change lands in is the Task template's "Where" field or the Bug template's "Repository" field (a Bug's "Where" is the page, run or command that shows the problem); if it says "other / not sure", infer it from the Outcome (Task) or from Where, Expected and Actual (Bug), and say which you chose in your first issue comment. Read that repository's CLAUDE.md / AGENTS.md / CONTRIBUTING.md and follow them.
2. Comment once on the issue: "Picked up by Devin (<rung>) — plan: <two or three lines>". If the ticket is not clear enough to finish without a decision from a human, do not guess: comment with the one question (options with the reason for each), remove your start label and `in-progress`, add `blocked`, and stop.
3. Work on a branch named devin/<unix-time>-issue-<number>. Make the smallest change that makes the Outcome true. Add or update the test the "Proof" field names; run the repository's test battery and keep it green. You may open the live estate pages (aigovops-foundation.com, aigovops.org and their subdomains) read-only to check a Proof; never submit forms there.
4. SIDE-QUEST RULE (strict). If you notice a problem that does NOT stop this ticket's Outcome from being true (a broken link elsewhere, a flaky test, a typo, tech debt, a missing feature), do NOT fix it in this branch. File a new issue in aigovops-foundation/aigovops using the Task template's fields (Outcome, Where, Proof) or the Bug template's fields (Repository, Where, Expected, Actual, Proof), titled "task: ..." or "bug: ...", labelled `queue` and `discovered`, whose body starts with "Found while working on aigovops-foundation/<issue repository>#<number>". Then carry on with this ticket. Do not add `ready` to it. Only fix something outside the Outcome if, without it, this ticket's Proof cannot pass; say so in the PR.
5. Open one pull request against main whose body starts with "Fixes aigovops-foundation/<issue repository>#<number>" (always the fully qualified form; a bare #N would point at the PR repository), states the Outcome, shows the Proof (test output, URL, screenshot), and lists any `discovered` tickets you filed. Watch CI; fix red checks; answer review comments.
6. Comment on the issue, remove `in-progress` (keep your start label so triage skips the ticket; a human retries by removing and re-adding it), then STOP:
   "Receipt — mode: <rung> · attempts: <n> · PR: <link> · result: <PR open, CI green | blocked: reason> · discovered: <links or none>"
   Never merge, never push to main, never change repository settings, secrets, DNS, hosting, payments or data. A human merges.

Bounded effort: if after three attempts CI is still red or the Proof cannot be met, follow your rung's "on failure" row in the table above.
