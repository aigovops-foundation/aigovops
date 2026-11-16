# Architecture Overview — AiGovOps Foundation Site
**Version:** 1.0 | **Date:** 2026-06-03

---

## 1. System diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        VISITOR BROWSER                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │  index.html  │  │frameworks.html│  │  support/press/etc.   │ │
│  │  css/style   │  │ 40 frameworks │  │     static pages      │ │
│  │  js/chat.js  │  │ filter logic  │  │                       │ │
│  │  js/main.js  │  └──────────────┘  └───────────────────────┘ │
│  │  js/schedule │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│  ┌──────▼───────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │  Chatbot     │  │  Schedule    │  │     Plausible         │ │
│  │  10 intents  │  │  M365 agent  │  │     analytics         │ │
│  │  Voice input │  │  (free/busy) │  │  (cookieless, EU)     │ │
│  └──────┬───────┘  └──────────────┘  └───────────────────────┘ │
└─────────┼───────────────────────────────────────────────────────┘
          │ PROXY_URL (HTTPS)
          ▼
┌─────────────────────────────┐
│   Cloudflare Worker          │
│   frameworks-agent.js        │
│   CORS guard (aigovops-      │
│   foundation.com only)       │
│   ANTHROPIC_API_KEY (secret) │
└─────────┬───────────────────┘
          │ HTTPS
          ▼
┌─────────────────────────────┐
│   Anthropic API              │
│   claude-haiku-4-5-20251001  │
│   (frameworks analysis)      │
└─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB ACTIONS (CI/CD)                       │
│                                                                 │
│  fetch-linkedin-posts.yml    deploy.yml      automation-v3.yml  │
│  ├── feedparser              ├── FTP upload  ├── Unit (Node.js) │
│  ├── Anthropic Haiku NLP     ├── SSH bust    ├── A11y (bash)    │
│  ├── data/linkedin-posts.json               ├── E2E (curl)     │
│  └── feed.xml                               ├── Scale (curl×50)│
│                                             ├── i18n (bash)    │
│                                             ├── Chaos (bash)   │
│                                             └── Doc validation │
└──────────────────────────────────┬──────────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │      GitHub Pages            │
                    │   main branch → CDN          │
                    │   HTTPS enforced             │
                    │   Custom domain CNAME        │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │        Hostinger             │
                    │   www.aigovops-foundation.com│
                    │   CNAME → GitHub Pages CDN   │
                    └─────────────────────────────┘
```

---

## 2. Decision log

| Decision | Rationale | Alternatives considered |
|----------|-----------|------------------------|
| Static HTML, no framework | Fastest, most maintainable, no build step, no dependency rot | React, Vue, Astro |
| GitHub Pages hosting | Free, CDN-backed, HTTPS, integrates with CI/CD | Vercel, Netlify, Hostinger direct |
| System fonts only | No render-blocking, no FOUT, no external dependency | Google Fonts |
| Plausible analytics | Cookieless, GDPR-compliant, EU-hosted, open-source | Google Analytics, Fathom |
| Cloudflare Workers for API proxy | Free tier, global edge, zero cold start | Vercel Edge, AWS Lambda |
| Web Speech API (voice) | Zero dependencies, no API key, works natively | Whisper API, AssemblyAI |
| Claude Haiku for NLP | Fast, cheap, good enough for title/summary enrichment | GPT-4o-mini, Gemini Flash |
| Vanilla JS chatbot (no LLM at runtime) | Free to run, fast, deterministic, no API cost per visitor | Full LLM chatbot |
| Squash merge to main | Clean linear history, one commit = one PR | Merge commits, rebase |
| Emoji icons | No dependency, renders everywhere, no SVG overhead | Tabler, Heroicons, Font Awesome |

---

## 3. Scalability considerations

**Current constraints:**
- GitHub Pages has a soft bandwidth limit of 100GB/month and 10 build/hour limit
- Cloudflare Workers free tier: 100,000 requests/day
- Anthropic API: rate limited per key

**Scaling path:**
1. Move static hosting to Cloudflare Pages (same edge network, no bandwidth limit)
2. Upgrade Cloudflare Workers to paid plan if frameworks agent gets > 100k requests/day
3. Add request caching in the Worker (cache identical userContext strings)
4. Add Anthropic API key rotation if multiple Workers needed

**Content scaling:**
- LinkedIn posts: `data/linkedin-posts.json` is fetched twice daily. At 10 posts each, file stays small. No pagination needed until >100 posts.
- Frameworks: 40 in JS array. Can scale to 200+ before needing pagination (filter performance is O(n) in-browser).

---

## 4. Dependency inventory

| Dependency | Version/date | Risk | Update cadence |
|------------|-------------|------|----------------|
| Plausible script | CDN latest | Low | Automatic |
| Claude claude-haiku-4-5-20251001 | Fixed model ID | Medium | Review quarterly |
| Web Speech API | Browser-native | Low | None |
| feedparser (Python) | Latest | Low | Annual |
| Anthropic Python SDK | Latest | Medium | Quarterly |
| GitHub Actions runners | ubuntu-latest | Low | Automatic |

No npm or pip lockfile for frontend (no build step). Python dependencies for `fetch_posts.py` are installed at runtime in GitHub Actions.

---

## 5. Monitoring and observability

| Signal | Source | Alert threshold |
|--------|--------|----------------|
| Uptime | Plausible pageviews (absence = down) | No pageviews for 2h |
| Deploy success | GitHub Actions deploy.yml | Workflow failure = email |
| Test failures | Cloud-Mary automation-v3.yml | Any tier failure = email |
| LinkedIn fetch | fetch-linkedin-posts.yml | Workflow failure = email |
| Post staleness | fetch_posts.py staleness warning | Log warning if >24h old |
| Anthropic API errors | chat.js error handler | User-visible only (no server log) |

**Future:** Add UptimeRobot or Better Uptime monitoring to `www.aigovops-foundation.com` for independent uptime alerting.
