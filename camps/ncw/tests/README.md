# NCW AI Camp — Test Suite

This directory contains the CI test harness that runs on every pull request
into `main`. The suite is designed to **keep the August 11 landing
experience stable and secure** while we iterate on the page content.

## What runs on every PR

| Workflow file | Job | What it checks |
|---|---|---|
| `.github/workflows/ci.yml` | `html-lint` | Every `docs/**/*.html` passes structural lint (htmlhint) — tag pairs, unique IDs, alt-text on images, doctype, etc. |
| `.github/workflows/ci.yml` | `api-tests` | Unit tests against `docs/api/sign.js` — method allow/deny, 200 on POST, 405 on GET/PUT/DELETE, JSON-serializable response. |
| `.github/workflows/ci.yml` | `e2e` (matrix: chromium-desktop, mobile-safari, mobile-android) | <ul><li>**Pledge form** end-to-end: render, required-field validation, valid submission flips to success card, signer name echoed, works with `/api/sign` reachable AND when prod (GitHub Pages) returns 404.</li><li>**Responsiveness:** every page returns 200, no horizontal scroll, hero `h1` visible, form inputs reachable on iPhone-sized viewport, tap targets meet 44 px floor.</li><li>**Accessibility:** axe-core scan on every page with WCAG 2.1 A + AA tags. Build fails on `critical` or `serious` violations; `moderate` reported as advisory in the HTML report.</li></ul> |
| `.github/workflows/ci.yml` | `link-check` | Every relative `href` in `docs/` resolves (linkinator). External links are skipped to keep CI deterministic; the standalone URL audit (`authoring/19-url-audit.md`) covers those manually. |
| `.github/workflows/security.yml` | `codeql` | CodeQL `security-and-quality` queries on JavaScript. |
| `.github/workflows/security.yml` | `dependency-review` | Fails PRs that introduce HIGH-severity npm vulnerabilities or restrictively licensed deps. |
| `.github/workflows/security.yml` | `npm-audit` | `npm audit --audit-level=high` on devDependencies. |

The site has **zero runtime npm dependencies** — it's static HTML/CSS/JS served
by GitHub Pages — so the security surface is small. The audit primarily guards
the test harness itself.

## Local development

```bash
# One-time
npm ci
npx playwright install --with-deps chromium webkit

# Lint markup
npm run test:html

# API endpoint unit tests
npm run test:api

# Full E2E + a11y + mobile (starts http-server on :4173 automatically)
npm run test:e2e

# Internal link check
npm run test:links

# Everything
npm test
```

The Playwright config (`tests/playwright.config.mjs`) starts a local
`http-server` against `docs/` on port 4173 before the suite runs. You don't
need to start the server manually.

## Layout

```
tests/
├── README.md                    ← you are here
├── .htmlhintrc                  ← HTML lint config
├── linkinator.config.json       ← internal link-check config
├── playwright.config.mjs        ← Playwright config (3 projects)
├── api/
│   └── sign.test.mjs            ← Node test for /api/sign endpoint
└── e2e/
    ├── pledge-form.spec.mjs     ← Form submission E2E
    ├── responsive.spec.mjs      ← Mobile responsiveness + layout
    └── a11y.spec.mjs            ← axe-core accessibility scan
```

## Test artifacts

On every CI run the Playwright HTML report and any failure traces are
uploaded as workflow artifacts and kept for 14 days (reports) / 7 days
(traces). Look for `playwright-report-<project>` on the CI run's summary
page.

## Adding new content

When you add a new page or a new form field, please add or update the
relevant test:

- New landing page → add its path to the `PAGES` array in
  `tests/e2e/responsive.spec.mjs` AND `tests/e2e/a11y.spec.mjs`.
- New required field on the pledge form → extend `VALID_SIGNER` in
  `tests/e2e/pledge-form.spec.mjs`.
- New server endpoint → add a sibling test in `tests/api/`.

## Why these tests, specifically

The August 11 event is one-shot — there is no second chance to ship a
broken pledge form. These tests guard the three things that matter most:

1. **The pledge submission still works** (form contract + endpoint contract).
2. **The site is usable on phones** (most attendees will arrive on mobile).
3. **The site is accessible** (we're talking about AI in education — meeting
   WCAG 2.1 AA is table stakes).

The security workflow guards the supply chain on the test harness so a
compromised dev dep can't smuggle code into the deployed site.
