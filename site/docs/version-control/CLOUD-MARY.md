# Cloud-Mary v3 — Test Suite Specification
**Version:** 3.0 | **Date:** 2026-06-03

---

## 1. Overview

Cloud-Mary is the AiGovOps Foundation's end-to-end test suite, named after the automation that proves our governance claim: *governance is tested, not assumed*. It runs locally and in GitHub Actions on every PR and push to `main`.

The suite has 6 tiers, each independently executable. All tiers pass before any code merges.

---

## 2. Tiers

| Tier | Script | Tests | Scope |
|------|--------|-------|-------|
| 🧪 Unit v1 | `scripts/test-unit.js` | 29 | Intent classifier, basic checks |
| 🧪 Unit v3 | `scripts/test-unit-v3.js` | 118 | Intent classifier, URL integrity, NLP pipeline, scheduling, i18n, a11y hooks, PR4 checks |
| ♿ Accessibility | `scripts/test-a11y.sh` | 85 | ARIA, skip links, lang attr, meta, chatbot, support page, i18n |
| 🌍 Multilingual / i18n | `scripts/test-i18n.sh` | 25 | Lang attribute, encoding, chatbot typo-tolerance, timezone i18n, NLP lang detection |
| 🐒 Chaos Monkey | `scripts/test-chaos.sh` | 14 | Malformed URLs, deleted CNAME, JS syntax error, dirty tree, JSON corruption |
| 🌐 E2E | `scripts/test-e2e-v3.sh` | 38 | Live site HTTP checks (skips gracefully if egress blocked) |
| ⚡ Scale | `scripts/test-scale-v3.sh` | – | 50 concurrent requests, response time, error rate |
| 📄 Docs | `scripts/test-docs.sh` | NEW | All required doc files exist, valid markdown |

**Total: 150+ checks across all tiers.**

---

## 3. Running Cloud-Mary

### Full local run (all tiers)
```bash
cd /path/to/repo
bash scripts/cloud-mary.sh --unit --a11y --i18n --chaos
```

### Individual tiers
```bash
bash scripts/cloud-mary.sh --unit       # Unit tests only
bash scripts/cloud-mary.sh --a11y       # Accessibility only
bash scripts/cloud-mary.sh --i18n       # i18n only
bash scripts/cloud-mary.sh --chaos      # Chaos monkey only
bash scripts/cloud-mary.sh --e2e        # E2E (requires network)
bash scripts/cloud-mary.sh --scale      # Scale tests (requires network)
bash scripts/cloud-mary.sh --docs       # Doc validation (new)
```

### Full suite including docs
```bash
bash scripts/cloud-mary.sh --unit --a11y --i18n --chaos --docs
```

---

## 4. GitHub Actions integration

`automation-v3.yml` runs all tiers in parallel on every push to `main` and on every PR:

```yaml
jobs:
  unit:     scripts/test-unit.js + scripts/test-unit-v3.js
  a11y:     scripts/test-a11y.sh
  e2e:      scripts/test-e2e-v3.sh
  scale:    scripts/test-scale-v3.sh
  i18n:     scripts/test-i18n.sh
  chaos:    scripts/test-chaos.sh
  docs:     scripts/test-docs.sh  ← NEW in PR #5
  report:   aggregate results → comment on PR
```

---

## 5. Adding new tests

### Unit test (JS)
Add to `scripts/test-unit-v3.js` before the result summary:
```javascript
checkTrue('My new test description', someCondition);
checkFalse('My false check', someOtherCondition);
```

### A11y or i18n test (bash)
```bash
check_html "$REPO/page.html" "Test description" 'expected string'
```

### Chaos test (bash)
Add a numbered chaos scenario with PASS/FAIL assertions.

### Doc test (bash)
```bash
check_file "docs/section/FILE.md" "File description"
```

---

## 6. Test file locations

```
scripts/
├── cloud-mary.sh        # Orchestrator — accepts --flag arguments
├── test-unit.js         # Unit v1 (29 checks)
├── test-unit-v3.js      # Unit v3 (118 checks)
├── test-a11y.sh         # Accessibility (85 checks)
├── test-i18n.sh         # i18n (25 checks)
├── test-chaos.sh        # Chaos (14 scenarios)
├── test-e2e-v3.sh       # E2E live (38 checks, skips if egress blocked)
├── test-scale-v3.sh     # Scale (50 concurrent)
├── test-docs.sh         # Doc validation (NEW — PR #5)
├── test-e2e.sh          # DEPRECATED (superseded by v3)
└── test-scale.sh        # DEPRECATED (superseded by v3)
```
