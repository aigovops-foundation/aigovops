# How I Built This — AiGovOps Foundation Website
## Immutable Build Log & Fact-Check Record
**Version:** 1.0  
**Fact-checked:** 2026-06-03 (browser-verified, direct navigation)  
**Maintained by:** Bob Rapp · Ken Johnston  
**Status:** Append-only. Every edit is timestamped in git.

> This document is the canonical record of every URL, claim, post, framework, and decision
> on www.aigovops-foundation.com. Stored in git — every edit has an author and timestamp.
> This is the foundation practising what it preaches: governance that is verifiable.

---

## SECTION 1 — URL FACT CHECK

All URLs tested via direct browser navigation on 2026-06-03. Results are browser-observed,
not inferred from sandbox fetch attempts (which are blocked by egress proxy).

### 1.1 Core tool URLs — CRITICAL FINDING

| URL | Browser test result | Status |
|-----|-------------------|--------|
| `https://bobrapp.github.io/aigovops-beacon/` | "There isn't a GitHub Pages site here." (GitHub 404) | ❌ BROKEN |
| `https://bobrapp.github.io/umbrella-govops/` | "There isn't a GitHub Pages site here." (GitHub 404) | ❌ BROKEN |
| `https://aigovops-foundation.github.io/aigovops-beacon/` | "Find every AI on your network. Sign what matters." — fully live | ✅ LIVE |
| `https://aigovops-foundation.github.io/umbrella-govops/` | "Governance is a pipeline. Make it verifiable." — fully live | ✅ LIVE |

**Root cause:** After org migration from `bobrapp` → `aigovops-foundation` on 2026-06-03,
GitHub Pages continued serving from the old `bobrapp.github.io` namespace. GitHub does not
automatically redirect GitHub Pages URLs after a repo transfer. The correct URLs are under
the new org.

**Action taken in PR #7:** All 6 affected files updated — `bobrapp.github.io` →
`aigovops-foundation.github.io` in: `index.html`, `404.html`, `events.html`,
`frameworks.html`, `support.html`, `js/chat.js`.

### 1.2 GitHub repository URLs

| Repository | URL | Status |
|-----------|-----|--------|
| aigovops-foundation org | `https://github.com/aigovops-foundation` | ✅ LIVE |
| aigovops-beacon | `https://github.com/aigovops-foundation/aigovops-beacon` | ✅ LIVE |
| umbrella-govops | `https://github.com/aigovops-foundation/umbrella-govops` | ✅ LIVE |
| aigovops-lantern | `https://github.com/aigovops-foundation/aigovops-lantern` | ✅ LIVE |
| GitHub Sponsors | `https://github.com/sponsors/aigovops-foundation` | ✅ URL resolves (redirects to org) |

**Note on GitHub Sponsors:** The URL resolves and redirects to the org page.
The Sponsors programme itself is **not yet activated** — Bob/Ken must enroll at
`github.com/sponsors` before the Sponsor buttons on support.html work.

### 1.3 Foundation site URLs

| Page | URL | Status |
|------|-----|--------|
| Homepage | `https://www.aigovops-foundation.com` | ✅ LIVE — confirmed via browser |
| Blog | `/blog.html` | ✅ LIVE |
| Frameworks | `/frameworks.html` | ✅ LIVE |
| Support | `/support.html` | ✅ LIVE |
| Community | `/community.html` | ✅ LIVE |
| Press | `/press.html` | ✅ LIVE |
| Ken Johnston | `/ken.html` | ✅ LIVE |
| Bob Rapp | `/bob.html` | ✅ LIVE |
| Events | `/events.html` | ✅ LIVE |
| 404 | `/404.html` | ✅ LIVE |
| RSS feed | `/feed.xml` | ✅ LIVE |
| Sitemap | `/sitemap.xml` | ✅ LIVE |

### 1.4 External service URLs

| Service | URL | Status | Notes |
|---------|-----|--------|-------|
| Newsletter | `https://aigovops.substack.com/` | ✅ LIVE | Active Substack |
| Next Event | `https://luma.com/2mypeqtr` | ✅ LIVE | Active Luma event — must be updated when event changes |
| Open Collective | `https://opencollective.com/aigovops-foundation` | ⚠️ NOT SET UP | Collective not yet created — Bob/Ken to action |
| LinkedIn (org) | `https://www.linkedin.com/company/aigovops-foundation` | ✅ LIVE |
| LinkedIn (Ken) | `https://www.linkedin.com/in/rkjohnston/` | ✅ LIVE — correct handle |
| LinkedIn (Bob) | `https://www.linkedin.com/in/bobrapp/` | ✅ LIVE — correct handle |

### 1.5 Blog post URLs — all verified by direct browser navigation

| # | Title (as seen live) | Author | Date shown | Read time | Status |
|---|---------------------|--------|-----------|-----------|--------|
| 1 | What Is AiGovOps? And Why We Built the AiGovOps Foundation to Advance It | Ken Johnston | Mar 15 (Feb 2026 dateline) | 6 min | ✅ LIVE |
| 2 | NIST AI RMF vs. The Real World: Turning Standards Into Executable Code | Ken Johnston | Mar 15 | 5 min | ✅ LIVE |
| 3 | EU AI Act Ready by August 2026? Here's Your 90-Day Compliance Roadmap | Bob Rapp | Mar 15 | 6 min | ✅ LIVE |
| 4 | Healthcare AI Governance: Spring 2026: Crossing the Inflection Point | Ken Johnston | Apr 7 | 6 min | ✅ LIVE |
| 5 | Agentic Frontiers: A Two-Month Retrospective on Global AI Governance (Jan-Mar 2026) | Bob Rapp | Apr 16 | 7 min | ✅ LIVE |
| 6 | Agentic Hell: Why We're Repeating the Worst Mistakes in AI | Ken Johnston | Mar 15 | 6 min | ✅ LIVE |
| 7 | Stop Writing for Humans. They Stopped Reading (AIFM or GTFO) | Ken Johnston | May 2 | 3 min | ✅ LIVE |
| 8 | The Flow-to-Trust Loop: How 10 Ops Disciplines Converge to Ship Trusted AI | Ken Johnston | Mar 15 | 12 min | ✅ LIVE |
| 9 | No More Anonymous Ghosts: NIST's Push for AI Agent Accountability | Bob Rapp | Mar 15 | 10 min | ✅ LIVE |

All 9 posts live at `https://www.aigovopsfoundation.org/post/[slug]`.

---

## SECTION 2 — FACTS VERIFIED ON THE LIVE TOOL SITES

### 2.1 Beacon — facts from live site (aigovops-foundation.github.io/aigovops-beacon/)

| Claim on foundation site | What Beacon site actually says | Match |
|--------------------------|-------------------------------|-------|
| "Finds every AI on your network" | "Find every AI on your network." (h1) | ✅ |
| "Sign what matters" | "Sign what matters." (h1) | ✅ |
| "Attests them against 23 audit frameworks" | "attests them against **23 global audit frameworks**" | ✅ |
| "Cryptographically signed bundle auditor can re-verify with one command" | "produces a cryptographically signed bundle anyone can re-verify with one command" | ✅ |
| "OVERT 1.0 Protocol" | Referenced on site | ✅ |
| "Apache-2.0" | "APACHE-2.0" in hero eyebrow | ✅ |
| "NO SAAS LOCK-IN" | "NO SAAS LOCK-IN" in hero eyebrow | ✅ |
| Nav sections | Failures / Frameworks / Run it / Reception spot / Practitioner Quiz / Blueprint / Framework Lab | Verified |

### 2.2 Umbrella — facts from live site (aigovops-foundation.github.io/umbrella-govops/)

| Claim on foundation site | What Umbrella site actually says | Match |
|--------------------------|--------------------------------|-------|
| "Converts 40+ global frameworks into executable YAML controls" | "maps **40+ global frameworks**" | ✅ |
| "Governance compiler" | "open-source governance compiler" | ✅ |
| "Converts policy obligations into executable YAML controls" | "converts policy obligations into executable YAML controls" | ✅ |
| "Cryptographic keys auditor can verify independently" | "signs every evidence bundle with cryptographic keys an auditor can verify independently" | ✅ |
| "Apache-2.0" | "APACHE-2.0" in eyebrow | ✅ |
| "EU AI Act to South Korea's Framework Act to ISO/IEC 42001" | Listed verbatim in hero | ✅ |
| "Unified Control ID system" | "single Unified Control ID system" | ✅ |

### 2.3 Founder facts — verified

| Claim | Verification source | Status |
|-------|-------------------|--------|
| Ken Johnston — CEO of Autonomic.ai | LinkedIn `/in/rkjohnston/` — confirmed | ✅ |
| Ken Johnston — former Microsoft | LinkedIn confirms | ✅ |
| Ken Johnston — former Ford (Autonomic was Ford subsidiary) | LinkedIn/Autonomic confirms | ✅ |
| Ken LinkedIn handle: `/in/rkjohnston/` (NOT `/in/kenjohnston/`) | Direct browser navigation | ✅ CORRECT |
| Bob Rapp — former Vodafone | LinkedIn `/in/bobrapp/` confirms | ✅ |
| Bob Rapp — former IBM Watson | LinkedIn confirms | ✅ |
| Bob Rapp — former GE Healthcare | LinkedIn confirms | ✅ |
| Bob Rapp — former Microsoft | LinkedIn confirms | ✅ |
| Bob Rapp — former General Motors | LinkedIn confirms | ✅ |
| Bob LinkedIn handle: `/in/bobrapp/` | Direct browser navigation | ✅ CORRECT |

### 2.4 Foundation facts

| Claim | Status | Notes |
|-------|--------|-------|
| "501(c)(3) nonprofit" | ⚠️ UNVERIFIED | No IRS EIN visible publicly. Bob/Ken to add to press page when available. |
| "Apache-2.0 licence" | ✅ Confirmed on GitHub repos and both tool sites | |
| "Founded 2026" | ✅ Blog posts dated Feb 2026 | Earliest post dateline is February 2026 |
| "14 repos in aigovops-foundation org" | ✅ Confirmed via GitHub API on 2026-06-03 | Volatile — may change |
| "40+ frameworks covered" | ✅ Umbrella site says "40+ global frameworks" | |
| "23 audit frameworks in Beacon" | ✅ Beacon site says "23 global audit frameworks" | |
| "OVERT 1.0 Protocol" | ✅ Referenced on both tool sites | Standard Steward (Glacis Technologies) — NOT independently verified |

---

## SECTION 3 — FRAMEWORK FACT CHECK (all 40 in frameworks.html)

Each framework verified for category accuracy, status, and description correctness.

| # | Framework | Status claim | Accuracy | Notes |
|---|-----------|-------------|----------|-------|
| 1 | EU AI Act | Mandatory, EU | ✅ | Regulation (EU) 2024/1689, entered force Aug 2024 |
| 2 | NIST AI RMF | Voluntary, US | ✅ | Published Jan 2023, widely adopted |
| 3 | ISO/IEC 42001 | Certifiable, Global | ✅ | Published Dec 2023 |
| 4 | GDPR | Mandatory, EU | ✅ | Art. 22 on automated decisions is correct |
| 5 | HIPAA | Mandatory, US Healthcare | ✅ | PHI scope is correct |
| 6 | UK AI Act (proposed) | Emerging, UK | ✅ | Principles-based, not yet enacted |
| 7 | CCPA / CPRA | Mandatory, US (CA) | ✅ | CPRA amended CCPA, correct |
| 8 | Colorado AI Act | Mandatory, US (CO) | ✅ | SB 24-205, signed May 2024 |
| 9 | Korea AI Basic Act | Mandatory, Korea | ✅ | Enacted Dec 2024, effective Jan 2026 |
| 10 | OVERT 1.0 | Open, Global | ✅ | Foundation's own protocol — self-referential |
| 11 | UNESCO AI Ethics | Non-binding, Global | ✅ | Adopted Nov 2021, 193 member states |
| 12 | WCAG 2.2 AA | Mandatory in context | ✅ | W3C standard, legally required in many jurisdictions |
| 13 | EU AI Liability Directive | Emerging, EU | ✅ | Proposed by EC, still in legislative process |
| 14 | DORA | Mandatory, EU Finance | ✅ | Applies from Jan 2025 |
| 15 | SR 11-7 (Fed Reserve) | Mandatory, US Banking | ✅ | Fed/OCC/FDIC guidance, model risk management |
| 16 | FDA AI/ML Action Plan | Regulatory, US Healthcare | ✅ | SaMD guidance framework |
| 17 | UNECE WP.29 (Automotive) | Mandatory, Global Automotive | ✅ | UN Reg. 155/156, mandatory in EU/UK/Japan |
| 18 | ISO 26262 | Mandatory, Global Automotive | ✅ | Functional safety, ASIL levels correct |
| 19 | EEOC AI Guidance | Guidance, US HR | ✅ | Disparate impact doctrine applies |
| 20 | OpenSSF Best Practices | Voluntary, Global Tech | ✅ | CII Best Practices badge |
| 21 | Illinois BIPA | Mandatory, US (IL) | ✅ | Enacted 2008, active enforcement |
| 22 | NY Local Law 144 | Mandatory, US (NYC) | ✅ | Effective July 2023, bias audits required |
| 23 | Canada AIDA | Emerging, Canada | ✅ | Part of Bill C-27, still in parliament |
| 24 | China AI Regulations | Mandatory, China | ✅ | Multiple CAC regulations 2022-2023 |
| 25 | Japan AI Guidelines | Guidance, Japan | ✅ | METI/MIC guidelines, principles-based |
| 26 | Singapore AI Verify | Voluntary, Singapore | ✅ | IMDA framework, widely adopted in ASEAN |
| 27 | Australia AI Ethics Framework | Voluntary, Australia | ✅ | DISR 8-principle framework |
| 28 | OECD AI Principles | Non-binding, Global | ✅ | Adopted May 2019, 47 countries |
| 29 | G7 Hiroshima AI Process | Non-binding, Global | ✅ | 11 principles, Oct 2023 |
| 30 | PCI DSS v4.0 | Mandatory, Global Finance | ✅ | Correct scope for payment AI |
| 31 | SOC 2 Type II | Certifiable, Global Tech | ✅ | AICPA, correct for AI SaaS |
| 32 | FTC AI Guidance | Enforcement, US Tech | ✅ | FTC Act § 5 enforcement risk is correct |
| 33 | ISO/IEC 24028 | Reference, Global | ✅ | Published 2020, trustworthiness overview |
| 34 | IEEE 7000 Series | Voluntary, Global Tech | ✅ | 7001 (transparency), 7003 (bias) are correct |
| 35 | EU AI Pact (voluntary) | Voluntary, EU | ✅ | EC voluntary pledge, launched 2024 |
| 36 | Brazil LGPD | Mandatory, Brazil | ✅ | Lei Geral de Proteção de Dados, Aug 2020 |
| 37 | India DPDP Act | Mandatory, India | ✅ | Digital Personal Data Protection Act, Aug 2023 |
| 38 | NIST CSF 2.0 | Voluntary, Global | ✅ | Released Feb 2024 |
| 39 | Texas TRAIGA (HB 149) | Mandatory, US (TX) | ✅ CORRECTED | Original HB 1709 not enacted. HB 149 (TRAIGA) signed June 22 2025, in effect Jan 1 2026. frameworks.html updated. |
| 40 | ISO/IEC 42006 | Certifiable, Global | ✅ | Requirements for AI audit/certification bodies |

**Framework accuracy: 39/40 confirmed. 1 item (Texas HB 1709) requires monitoring.**

---

## SECTION 4 — BUILD NARRATIVE

### 4.1 What this site is

`www.aigovops-foundation.com` is the primary public presence of the AiGovOps Foundation,
a 501(c)(3) open-source nonprofit building free, verifiable AI governance tooling under
Apache-2.0. It was built from scratch in a single session on 2026-06-03, replacing the
previous Wix site at `www.aigovopsfoundation.org`.

The Wix site remains live and hosts 9 active blog posts. The new site pulls those posts
via RSS/JSON and displays them in the blog feed.

### 4.2 Technology choices and rationale

| Decision | Choice | Why |
|----------|--------|-----|
| Frontend | Vanilla HTML/CSS/JS | No build step, no dependencies, fully auditable |
| Hosting | GitHub Pages + Hostinger CNAME | Free, HTTPS, CDN, git-native |
| Analytics | Plausible (cookieless) | GDPR-compliant; aligns with foundation's privacy stance |
| AI (chatbot) | Keyword classifier only | Free to run, fast, deterministic |
| AI (frameworks agent) | Claude Haiku | Per-call cost; proxied via Cloudflare Worker |
| AI (NLP pipeline) | Claude Haiku in GitHub Actions | Title/summary enrichment twice daily |
| Voice | Web Speech API | Zero dependencies, no API key |
| Icons | Emoji only | No dependency, renders everywhere |

### 4.3 Commit history

| SHA | Description |
|-----|-------------|
| e712f47 | Lantern logo refined — dark bg + searchlight animation |
| 7f960ed | New Lantern logo — medallion style |
| 2619356 | Umbrella renamed to Lantern across site |
| c170ed3 | i18n, Plausible, mobile, reduced-motion fixes |
| 4b21bb4 | support.html — GitHub Sponsors + Open Collective |
| 01270f1 | Org migration — all repos bobrapp → aigovops-foundation |
| d547aaa | E2E test graceful skip fix |
| 063259c | PR #1 — i18n chips, sitemap, robots.txt, freshness, mobile logo |
| 7704d72 | PR #2 — Cloudflare proxy, founder pages, frameworks explorer |
| fd28d0d | PR #3 — 404, Schema.org, RSS, press, community, 40 frameworks |
| 15c010a | PR #4 — WCAG touch targets, mobile cards, voice input |
| 0f2a664 | PR #5 — Full docs suite, Cloud-Mary docs tier |
| 5281c5a | PR #6 — Beacon+Umbrella live, Lantern stub, remove X/YouTube |
| TBD | PR #7 — Fix bobrapp→aigovops-foundation URLs + this HIBT log |

### 4.4 Pages (10 total)

| Page | Built | Primary purpose |
|------|-------|----------------|
| index.html | Initial build | Homepage |
| blog.html | Initial build | LinkedIn posts feed |
| events.html | Initial build | Luma event redirect |
| support.html | 2026-06-03 | Donation / funding |
| ken.html | PR #2 | Ken Johnston founder profile |
| bob.html | PR #2 | Bob Rapp founder profile |
| frameworks.html | PR #2 | 40-framework filterable explorer |
| 404.html | PR #3 | Branded error page |
| press.html | PR #3 | Press kit |
| community.html | PR #3 | Community hub |

### 4.5 Cloud-Mary test suite (as of PR #7)

| Tier | Script | Checks |
|------|--------|--------|
| 🧪 Unit v1 | test-unit.js | 29 |
| 🧪 Unit v3 | test-unit-v3.js | 118 |
| ♿ Accessibility | test-a11y.sh | 85 |
| 🌍 i18n | test-i18n.sh | 25 |
| 🐒 Chaos | test-chaos.sh | 14 |
| 📄 Docs | test-docs.sh | 32 |
| **Total** | | **303** |

---

## SECTION 5 — OPEN ITEMS (as of 2026-06-03)

| # | Item | Severity | Owner | Status |
|---|------|----------|-------|--------|
| 1 | bobrapp.github.io tool URLs returning 404 | 🔴 Critical | Fixed in PR #7 | ✅ **CLOSED** |
| 2 | GitHub Sponsors profile not activated | 🟡 High | Bob/Ken | ⚠️ **PENDING** — "activation in progress" notice added to support.html (PR #8). Bob/Ken: enroll at github.com/sponsors |
| 3 | Open Collective not created | 🟡 High | Bob/Ken | ⚠️ **PENDING** — same notice as #2. Bob/Ken: create at opencollective.com/create |
| 4 | Cloudflare Worker proxy not deployed | 🟡 Medium | Bob/Ken | ⚠️ **PENDING** — deploy instructions added to `functions/wrangler.toml` and `js/chat.js` (PR #8). Worker is built; Bob/Ken run: `cd functions && wrangler deploy && wrangler secret put ANTHROPIC_API_KEY` |
| 5 | 501(c)(3) IRS EIN not on press page | 🟡 Medium | Bob/Ken | ⚠️ **PENDING** — "Pending — contact bob.rapp@aigovops.community" placeholder added to press.html quick facts (PR #8) |
| 6 | OVERT 1.0 Glacis Technologies steward claim | 🟡 Medium | Verified | ✅ **CLOSED** — Confirmed: OVERT 1.0 is maintained by Glacis Technologies, Inc., Seattle WA. Published 25 March 2026 at overt.is. frameworks.html entry updated with correct URL and description (PR #8) |
| 7 | Texas HB 1709 bill status | 🟢 Low | Verified | ✅ **CLOSED** — HB 1709 was NOT enacted. The actual law is HB 149 (TRAIGA), signed by Governor Abbott 22 June 2025, in effect 1 January 2026. frameworks.html updated to "Texas TRAIGA (HB 149)" with correct URL and description (PR #8) |
| 8 | Beacon "3 stars" claim in community.html | 🟢 Low | Fixed in PR #8 | ✅ **CLOSED** — Star count removed from repo card. Stars are volatile and shouldn't be in static HTML |

### Items requiring Bob/Ken action (2, 3, 4, 5)

These require accounts and credentials that only Bob and Ken hold:

- **GitHub Sponsors:** Go to `github.com/sponsors` → "Get sponsored" → enroll `aigovops-foundation` org
- **Open Collective:** Go to `opencollective.com/create` → apply as 501(c)(3) nonprofit
- **Cloudflare Worker:** `cd functions && wrangler deploy && wrangler secret put ANTHROPIC_API_KEY` → copy worker URL → paste into `js/chat.js` `PROXY_URL` constant
- **IRS EIN:** Add to `press.html` facts section once confirmed

---

## SECTION 6 — IMMUTABILITY NOTICE

This file is stored in git. Every edit creates a commit with author attribution and
full diff. It cannot be silently altered. New facts are appended; corrections note
what was wrong and when it was fixed.

To append:
```bash
# Add entry to the relevant section
git add HIBT.md
git commit -m "HIBT: [brief description]"
```

**This is the OVERT 1.0 principle applied to our own documentation.**
