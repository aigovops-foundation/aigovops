---
name: aigovops-deploy-workflow
description: >
  The standard PR-and-deploy workflow for the AiGovOps Foundation website repo
  (aigovops-foundation/aigovops-foundation-site-redesign-June2026-ken-and-bob).
  Use this whenever making any change to the site that should ship: editing pages,
  CSS, JS, docs, the chatbot, frameworks, or content. Covers branch naming, the
  Cloud-Mary test gate, committing, pushing, creating a PR via the GitHub API,
  squash-merging, and syncing back. Trigger on phrases like "ship this", "make a PR",
  "deploy the site", "merge this change", "create a pull request for the site".
---

# AiGovOps Deploy / PR Workflow

This is the repeatable, tested procedure for shipping a change to the AiGovOps
Foundation site. It exists because the same nine-step sequence is run for every
change, and getting the order wrong (e.g. committing before tests, or pushing to
main directly) causes avoidable failures.

## Repo facts
- **Org/repo:** `aigovops-foundation/aigovops-foundation-site-redesign-June2026-ken-and-bob`
- **Local clone:** the directory matches the repo name exactly.
- **Hosting:** GitHub Pages serves the site from `main` (root). Custom domain via CNAME.
- **Primary branch:** `main` — never commit to it directly; always go through a PR.
- **Merge style:** squash merge (one commit per PR on `main`).

## The workflow — run in this exact order

### 1. Sync local main to remote first
Always start from the true remote state. Do NOT assume local main is current.
```bash
cd ~/aigovops-foundation-site-redesign-June2026-ken-and-bob
TOKEN="<github-token>"   # the org PAT
GIT_TERMINAL_PROMPT=0 git fetch origin main
git checkout main && git merge --ff-only origin/main
```
If `--ff-only` refuses (local main diverged), reset to remote:
`git reset --hard origin/main` (only after confirming no local-only work).

### 2. Create a feature branch
Naming convention: `feature/{short-desc}-{month}-{year}`, e.g.
`feature/pr10-reusable-skills-june-2026`. Also valid: `fix/...`, `docs/...`, `hotfix/...`.
```bash
git checkout -b feature/{desc}-june-2026
```

### 3. Make the edits
Edit pages/CSS/JS/docs as needed. Keep changes scoped to one logical PR.

### 4. Run Cloud-Mary (the test gate) BEFORE committing
```bash
bash scripts/cloud-mary.sh --unit --a11y --i18n --chaos --docs
```
All five tiers must be green. **The chaos tier requires a clean working tree** —
if you have uncommitted changes it skips. Run the suite, read the result, and only
proceed when it passes.

### 5. Fix failing unit tests caused by content changes
The unit tests (`scripts/test-unit-v3.js`) assert on **literal content strings**
(URLs, headings, specific copy). When you intentionally change a string the tests
check, the test breaks and must be updated to match the new content. This is
expected, not a regression. Update the assertion, re-run, confirm green.
See the `cloud-mary-testing` skill for details on how the tiers work.

### 6. Commit with a structured message
```
<type>: <short description>

<body — what changed and why, file-by-file if non-obvious>

Tests: <tier results, e.g. 29/29 + 176/176 . 85/85 . 25/25 . 14/14 . 32/32>
```
Types: feat, fix, a11y, perf, docs, test, ci, refactor, content, chore.

### 7. Push the branch
```bash
GIT_TERMINAL_PROMPT=0 git push https://aigovops-foundation:${TOKEN}@github.com/aigovops-foundation/aigovops-foundation-site-redesign-June2026-ken-and-bob.git {branch}
```

### 8. Create + squash-merge the PR via the GitHub API
Use Python urllib (reliable in this environment). Create the PR, then merge it.
```python
import urllib.request, json, time
token = "<github-token>"
headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json", "Content-Type": "application/json"}
repo = "aigovops-foundation/aigovops-foundation-site-redesign-June2026-ken-and-bob"
pr = json.dumps({"title": "...", "head": "{branch}", "base": "main", "body": "..."}).encode()
r = urllib.request.urlopen(urllib.request.Request(f"https://api.github.com/repos/{repo}/pulls", data=pr, headers=headers, method="POST"))
num = json.loads(r.read())["number"]
time.sleep(3)
merge = json.dumps({"merge_method": "squash", "commit_title": f"... (#{num})"}).encode()
r2 = urllib.request.urlopen(urllib.request.Request(f"https://api.github.com/repos/{repo}/pulls/{num}/merge", data=merge, headers=headers, method="PUT"))
print(json.loads(r2.read()).get("merged"))
```

### 9. Handle a 405 / "dirty" merge (branch behind main)
If the merge returns HTTP 405 with mergeable_state "dirty", the branch is behind
main. Rebase onto remote main, force-push, then retry the merge:
```bash
git fetch origin main:remote-main
git rebase remote-main
git push --force origin {branch}
# then retry the merge API call
```

### 10. Sync local main back
After merge, fast-forward local main so it reflects the squashed result:
```bash
git checkout main
git fetch origin main && git merge --ff-only origin/main
```

## Critical guardrails
- **Never push directly to `main`.** Every change goes through a PR.
- **Never skip Cloud-Mary.** It's the gate; a red tier means do not merge.
- **The token is a credential** — never commit it, never put it in a file, never
  echo it unredacted. It lives only in the shell session.
- **Squash merge only** — keeps `main` history one-commit-per-PR.
- After any change touching content, expect to update the unit-test assertions.

## What NOT to put in this workflow
This skill is procedure only. Live facts (URLs, framework counts, who authored what)
belong in `HIBT.md`, which is version-controlled and dated. Do not hardcode facts here.
