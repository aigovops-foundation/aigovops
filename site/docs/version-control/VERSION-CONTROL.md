# Version Control & Release Strategy — AiGovOps Foundation
**Version:** 1.0 | **Date:** 2026-06-03

---

## 1. Philosophy

The AiGovOps Foundation's approach to version control mirrors the governance principle at the heart of the foundation itself: **every change is verifiable, every decision is traceable, every release is testable before it ships.**

We treat the website like a production software system — not a Wix page. That means branch protection, PR reviews, automated testing on every merge, and a clean commit history that serves as an audit log.

---

## 2. Repository

**Org:** `aigovops-foundation`  
**Repo:** `aigovops-foundation-site-redesign-June2026-ken-and-bob`  
**Primary branch:** `main`  
**Deploy source:** GitHub Pages from `main` root

---

## 3. Branching strategy

```
main (protected, deploy-on-push)
  │
  ├── feature/{short-desc}-{month}-{year}
  │     e.g. feature/voice-input-june-2026
  │
  ├── fix/{short-desc}
  │     e.g. fix/touch-target-a11y
  │
  ├── docs/{short-desc}
  │     e.g. docs/add-security-plan
  │
  └── hotfix/{short-desc}
        e.g. hotfix/broken-chatbot-intent
```

**Rules:**
- No direct commits to `main`
- Every branch has a corresponding PR
- PRs must pass Cloud-Mary (all 4 tiers) before merge
- Squash merge to keep `main` history clean — one commit per PR
- Branch names are lowercase, hyphenated, include date context

---

## 4. Commit message standard

```
<type>: <short description>

[optional body — what and why, not how]
[optional: file list for non-obvious changes]
```

**Types:**
| Type | When to use |
|------|-------------|
| `feat` | New feature or page |
| `fix` | Bug fix |
| `a11y` | Accessibility improvement |
| `perf` | Performance improvement |
| `docs` | Documentation only |
| `test` | Test additions or fixes |
| `ci` | CI/CD workflow changes |
| `refactor` | Code change with no behaviour change |
| `content` | Copy/content-only change |
| `chore` | Maintenance (dependency update, cleanup) |

**Examples:**
```
feat: add voice input to chatbot (Web Speech API)
fix: touch targets below 44px on nav links
a11y: add aria-live to frameworks filter count
docs: add PRD, MRD, tech spec, security plan
ci: add doc validation tier to Cloud-Mary
```

---

## 5. PR process

1. Create branch from latest `main`
2. Make changes; test locally with `bash scripts/cloud-mary.sh --unit --a11y --i18n --chaos`
3. Open PR with descriptive title and body (use PR template in `docs/`)
4. Automated Cloud-Mary runs on PR — all 4 tiers must pass
5. At least 1 review from Ken or Bob
6. Squash merge to `main`
7. Delete branch after merge

**PR template location:** `docs/version-control/PR-TEMPLATE.md`

---

## 6. PR template

```markdown
## Summary
[What does this PR do in 1-2 sentences?]

## Changes
| File | What changed |
|------|-------------|
| | |

## Test results
- 🧪 Unit: X/Y ✅
- ♿ A11y: X/Y ✅
- 🌍 i18n: X/Y ✅
- 🐒 Chaos: X/Y ✅

## Screenshots (if visual change)

## Notes for reviewers

## Checklist
- [ ] Cloud-Mary passes locally
- [ ] No secrets in code
- [ ] WCAG touch targets ≥ 44px
- [ ] New pages added to sitemap.xml
- [ ] New pages added to footer nav
- [ ] Plausible events added for new CTAs
```

---

## 7. Semantic versioning for the site

The site uses date-based versioning for documentation:
- `v{YYYY}-{MM}` for major releases (new page, new feature)
- Patch releases tracked in Git log only

**Current:** `v2026-06` (post-launch, PRs #1–#4 merged)

---

## 8. Hotfix process

For urgent production issues (broken link, JS error, incorrect content):

1. Create `hotfix/{desc}` branch from `main`
2. Make minimal fix
3. Run `bash scripts/cloud-mary.sh --unit --a11y` (abbreviated — skip chaos for speed)
4. PR → review → merge (can be expedited — no hold on single-reviewer approval)
5. Monitor deploy for 10 minutes after merge

---

## 9. Stale branch cleanup

Run quarterly:
```bash
# List merged branches
git branch -r --merged main | grep -v main | grep -v HEAD

# Delete stale remote branches older than 30 days
# (after confirming they are merged)
git push origin --delete feature/old-branch-name
```

Current stale branches (as of 2026-06-03):
- `feature/next-sprint-june-2026` → merged as PR #2
- `feature/pr3-full-improvements-june-2026` → merged as PR #3
- `feature/pr4-a11y-mobile-voice-june-2026` → merged as PR #4
- `improvements/post-launch-fixes-june-2026` → merged as PR #1

**Action:** Delete all four after this PR merges.

---

## 10. GitHub Actions as the enforcement layer

Cloud-Mary runs on every PR and every push to `main`. It is the automated gatekeeper:

```yaml
# Required status checks (to configure in branch protection):
- "Unit Tests (v1 + v3)"
- "Accessibility Tests"
- "Multilingual / i18n Tests"
- "Chaos Monkey"
```

A merge that breaks any of these is blocked. This is the same principle as the OVERT 1.0 protocol applied to our own codebase: governance is enforced by automated, verifiable checks — not manual review alone.
