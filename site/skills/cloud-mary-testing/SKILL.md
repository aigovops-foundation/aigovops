---
name: cloud-mary-testing
description: >
  How to run and extend Cloud-Mary, the AiGovOps Foundation site's test suite.
  Use whenever running the site tests, adding new test coverage, debugging a failing
  tier, or when a code change breaks a test. Covers the six tiers, the orchestrator
  flags, why unit tests break on content changes, the chaos-tier clean-tree
  requirement, and the GitHub Actions integration. Trigger on "run the tests",
  "cloud-mary", "a test is failing", "add a test", "why is main red", "test tier".
---

# Cloud-Mary Testing

Cloud-Mary is the site's automated test suite. It runs locally and in GitHub Actions
on every PR and push to `main`. All tiers must be green before a PR merges.

## Running it
```bash
# Full local run (the standard pre-commit gate):
bash scripts/cloud-mary.sh --unit --a11y --i18n --chaos --docs

# Individual tiers:
bash scripts/cloud-mary.sh --unit     # unit (v1 + v3)
bash scripts/cloud-mary.sh --a11y      # accessibility
bash scripts/cloud-mary.sh --i18n      # multilingual
bash scripts/cloud-mary.sh --chaos     # chaos monkey
bash scripts/cloud-mary.sh --docs      # documentation validation
```
Network tiers (`--e2e`, `--scale`) hit the live site and **skip gracefully** when
the sandbox egress proxy blocks external requests — that's expected locally; they
run for real in GitHub Actions.

## The tiers
| Flag | Script | What it checks |
|------|--------|----------------|
| `--unit` | `test-unit.js` (v1) + `test-unit-v3.js` (v3) | Intent classifier, URL integrity, NLP pipeline, scheduling, i18n hooks, content assertions |
| `--a11y` | `test-a11y.sh` | ARIA roles, skip links, lang attr, meta, 44px touch targets, chatbot a11y |
| `--i18n` | `test-i18n.sh` | Lang attribute, encoding, chatbot typo-tolerance, timezone i18n |
| `--chaos` | `test-chaos.sh` | Malformed URLs, deleted CNAME, JS syntax errors, JSON corruption, dirty-tree detection |
| `--docs` | `test-docs.sh` | All required docs exist + key sections present |
| `--e2e` | `test-e2e-v3.sh` | Live-site HTTP checks (skips if egress blocked) |
| `--dns` | `test-dns.sh` | Live DNS: resolution, apex→GitHub IPs, www CNAME, stale-record detection (via DNS-over-HTTPS) |
| `--uptime` | `test-uptime.sh` | Reachability, TLS cert validity (catches the apex cert error), response latency |
| `--errors` | `test-errors.sh` | 5xx detection, redirect loops (catches Cloudflare-Flexible bug), real 404 behaviour, soft-404 content |
| `--scale` | `test-scale-v3.sh` | 50 concurrent requests, response time, error rate |

## CRITICAL gotchas (these caused real failures)

### 1. Unit tests assert on literal content strings
`test-unit-v3.js` uses `checkTrue('desc', htmlOrJs.includes('exact string'))`.
When you intentionally change a URL, heading, or piece of copy, the matching
assertion **will fail** — because it's still looking for the old string. This is
correct behaviour, not a bug. Fix: update the assertion to the new string, re-run.
Use `checkFalse(...)` to assert an *old* value is gone (e.g. after a URL migration).

### 2. The chaos tier requires a clean working tree
`test-chaos.sh` includes a dirty-tree check and will SKIP (not fail) if there are
uncommitted changes. Run the full suite BEFORE committing won't satisfy chaos —
chaos wants committed state. Practical order: run `--unit --a11y --i18n --docs`
while iterating, then commit, then the chaos tier passes cleanly on the next run.
(Alternatively `git stash` before a chaos-only run.)

### 3. Main shows red from an E2E race, not a real failure
On push to `main`, the E2E job tests the LIVE site. GitHub Pages CDN takes ~60s+
to propagate, so a naive test runs against stale content and fails. The workflow
handles this with a polling loop (wait for HTTP 200, +30s grace) and one retry.
If you see main red on E2E right after a push, check whether it's just propagation
lag before assuming a real break.

## Extending the suite

### Add a unit test (JS) — `scripts/test-unit-v3.js`
Insert before the `const total = PASS + FAIL;` summary line:
```javascript
checkTrue('My new assertion', someHtml.includes('expected string'));
checkFalse('Old value is gone', someHtml.includes('deprecated string'));
```
Read files at the top of the relevant section with `fs.readFileSync(path.join(__dirname,'../file.html'),'utf8')`.

### Add an a11y / i18n test (bash)
```bash
check_html "$REPO/page.html" "Description" 'expected string'
```

### Add a docs check — `scripts/test-docs.sh`
```bash
check_file "docs/section/FILE.md" "Description"
check_contains "docs/x/FILE.md" "Has section" "Section Heading"
```
Note: `test-docs.sh` must NOT use `set -e` (it would exit on the first non-match
and truncate the run). Match patterns are case-sensitive — verify the exact casing
in the target file.

### Wire a new tier into the orchestrator + CI
- `scripts/cloud-mary.sh`: add the `--flag` to the parser, the default tier list,
  a run block, and a summary label.
- `.github/workflows/automation-v3.yml`: add a parallel job and include it in the
  `report` job's `needs:` list and summary table.

## After extending: always re-run the full suite to confirm green before committing.

## Network-health tiers (DNS / uptime / errors)
These three tiers (`--dns`, `--uptime`, `--errors`) check the LIVE site and share a
helper library at `scripts/lib/health-checks.sh` (pure curl + DNS-over-HTTPS, no extra
deps). Like `--e2e` and `--scale`, they are network-dependent: they SKIP under
`--skip-network` and cannot produce real results in the sandbox (egress proxy blocks
DoH and returns 403), so they are NOT part of the local default gate
(`--unit --a11y --i18n --chaos --docs`). They run for real in GitHub Actions via the
`infra-health` job.

What each catches that content tests don't:
- **dns** — domain stopped resolving; apex not pointing at GitHub's IPs; www CNAME
  drifted off `aigovops-foundation.github.io`; a stale host (e.g. `bobrapp.github.io`)
  still in a record.
- **uptime** — site unreachable; **TLS cert invalid/unprovisioned** (the exact apex
  failure mode we hit); latency regressions.
- **errors** — 5xx server errors; **redirect loops** (the Cloudflare SSL=Flexible bug);
  missing pages returning the wrong status; soft-404s (200 status but error content,
  e.g. GitHub's "There isn't a GitHub Pages site here" placeholder).

To add a new network check: add a function to `scripts/lib/health-checks.sh` (it must
print via `_hc_check LABEL RESULT` and use the caller's PASS/FAIL counters), then call
it from the relevant `test-{dns,uptime,errors}.sh` and, if useful, the E2E script.
The library is sourced by all of them, so one helper is reusable everywhere.
