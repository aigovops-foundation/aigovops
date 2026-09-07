# Product Requirements Document — AiGovOps Foundation Site
**Version:** 1.0 | **Status:** Live | **Date:** 2026-06-03 | **Authors:** Ken Johnston, Bob Rapp

---

## 1. Product overview

The AiGovOps Foundation website (`www.aigovops-foundation.com`) is the primary public presence of a 501(c)(3) open-source nonprofit that builds free, verifiable AI governance tooling under Apache-2.0. The site serves as a discovery and conversion surface for practitioners, regulators, enterprises, and contributors.

The site is a static HTML/CSS/JS application deployed via GitHub Pages to a Hostinger custom domain, augmented by GitHub Actions for automated content fetching, testing, and deployment.

---

## 2. Goals

**Primary**
- Establish credibility as the home of OVERT 1.0, Beacon, and Lantern
- Convert visitors to newsletter subscribers, contributors, and financial supporters
- Provide the frameworks explorer as a reference that earns organic search traffic
- Enable direct scheduling with founders

**Secondary**
- Support press and conference discovery (press kit, boilerplate, bios)
- Serve as canonical source of foundation brand assets
- Demonstrate "eating our own cooking" — CI/CD tested, version-controlled, auditable

---

## 3. Personas

| Persona | Primary need |
|---------|-------------|
| **Practitioner** (engineer/compliance lead) | Which frameworks apply? What tools exist? |
| **Executive** (CTO/VP Risk) | Is this credible? Who's behind it? |
| **Contributor** (open-source developer) | How do I get involved? What's the codebase? |
| **Funder** (individual/enterprise) | How does my money get used? What are the tiers? |
| **Press/analyst** | Boilerplate, logo, founder bios |
| **Regulator/policy staff** | OVERT 1.0 details, framework coverage |

---

## 4. Feature inventory (v1.0 live)

### Pages
| Page | Purpose |
|------|---------|
| `index.html` | Hero, action cards, pillars, founders, posts feed, toolkit, newsletter form, chatbot |
| `frameworks.html` | 40 filterable framework cards with shareable URLs |
| `support.html` | 3 donation tiers with pledge mailtos, direct Stripe giving (interim: $500 checkout + pledge email) |
| `community.html` | Org stats, repos, contribution guide, support tiers |
| `press.html` | Logo downloads, boilerplate copy, media contact |
| `ken.html` / `bob.html` | Founder bio, speaking topics, schedule CTA |
| `blog.html` | LinkedIn posts feed with freshness timestamp |
| `events.html` | Luma redirect |
| `404.html` | Branded error page |

### Cross-cutting features
- EN/ES language toggle with full string files
- AI chatbot — 10 intents: frameworks (Claude Haiku agent), scheduling (M365 free/busy), voice (Web Speech API), support, newsletter, event, ken, bob, opensource, beacon, lantern
- Plausible Analytics with 15+ custom events
- Schema.org JSON-LD on all major pages (Organization, Person, ItemList)
- RSS feed (`feed.xml`) auto-generated on every LinkedIn post fetch
- WCAG 2.2 AA (skip links, aria roles, 44px touch targets, reduced-motion)
- Animated Lantern SVG logo with prefers-reduced-motion support

---

## 5. Non-goals (v1.0)
User accounts, CMS, community forum, e-commerce beyond donations, languages beyond EN/ES, mobile app.

---

## 6. Success metrics

| Metric | Target (6 months) |
|--------|-------------------|
| Monthly unique visitors | 1,000+ |
| Newsletter signups | 200+ |
| Frameworks explorer sessions | 500+ |
| Schedule conversions | 20+ |
| WCAG failures in Cloud-Mary | 0 |
| Cloud-Mary pass rate on every merge | 100% |

---

## 7. Constraints
- GitHub Pages (static only) + Hostinger custom domain
- No server-side logic except Cloudflare Worker proxy
- All dependencies open-source or free tier
- Apache-2.0 on all code
- 501(c)(3) compliant fundraising messaging

---

## 8. Roadmap (v2.0)
1. Inline email form → Buttondown/ConvertKit
2. Community sustainer wall via Open Collective API
3. Live Beacon demo embedded on homepage
4. Whisper API voice fallback (cross-browser)
5. Portuguese BR / French / German i18n
6. Frameworks expansion to 60+
7. Interactive OVERT 1.0 protocol explorer


## Labor-Day-Big-Redesign (7 September 2026)

This site's job narrowed to one message and one CTA. **Message:** Ship safe AI — never unsafe AI;
get to yes, stay at yes, recover to yes; prove it in ten minutes. **CTA:** the ten-minute Gate Check,
on every page (footers since #113, `src=site-footer`). **Target shape:** nine pages — home,
get/stay/recover-to-yes, gate-check, library, community, founders, support (+ blog) — every folded
page a redirect, nothing deleted from git. **Content is files:** `content/stories/*.md` publishes
everywhere; `content/founders.md` renders the founders page (#114). **Guard:** `scripts/test-message.py`
(promise on every page, Gate Check on every footer, retired vocabulary blocked; allowlist only shrinks).

Programme of record: Omni `docs/PRD-LABOR-DAY-BIG-REDESIGN.md`, `jeeves design`; tracker artifact
"AiGovOps Redesign Plan"; issues #103–#112 here.
