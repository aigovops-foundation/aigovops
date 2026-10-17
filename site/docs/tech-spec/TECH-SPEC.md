# Technical Specification — AiGovOps Foundation Site
**Version:** 1.0 | **Date:** 2026-06-03

---

## 1. Architecture overview

```
Browser
  │
  ├── GitHub Pages (static hosting)
  │     └── www.aigovops-foundation.com (Hostinger CNAME)
  │
  ├── Cloudflare Worker (frameworks agent proxy)
  │     └── ANTHROPIC_API_KEY (server-side secret)
  │
  └── Microsoft 365 / Bookings (scheduling free/busy)

GitHub Actions
  ├── fetch-linkedin-posts.yml  (twice daily, RSS + Haiku NLP)
  ├── deploy.yml                (FTP/SSH deploy to Hostinger on push)
  └── automation-v3.yml         (Cloud-Mary test suite on push)
```

---

## 2. Repository structure

```
aigovops-foundation/aigovops-foundation-site-redesign-June2026-ken-and-bob/
├── *.html                     # 10 pages: index, blog, frameworks, support,
│                              #   community, press, ken, bob, events, 404
├── css/style.css              # Single stylesheet (~420 lines)
├── js/
│   ├── chat.js                # Chatbot: 10 intents, frameworks agent, voice
│   ├── main.js                # Posts rendering, nav toggle, smooth scroll
│   ├── schedule.js            # M365 scheduling agent
│   └── i18n/
│       ├── i18n.js            # Language toggle module
│       ├── strings-en.js      # English strings
│       └── strings-es.js      # Spanish strings
├── data/
│   └── linkedin-posts.json    # Auto-fetched by GitHub Actions
├── feed.xml                   # RSS feed, auto-regenerated
├── sitemap.xml                # 9 pages, updated manually on new page
├── robots.txt                 # Allow all, sitemap pointer
├── CNAME                      # www.aigovops-foundation.com
├── images/                    # Logo variants, founders photo, favicons
├── functions/
│   ├── frameworks-agent.js    # Cloudflare Worker proxy
│   └── wrangler.toml          # Worker deploy config
├── scripts/                   # Cloud-Mary test suite (see §6)
├── docs/                      # This documentation tree
└── .github/workflows/         # CI/CD workflows
```

---

## 3. Technology stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Hosting | GitHub Pages | Static, HTTPS enforced, custom domain |
| DNS/CDN | Hostinger | CNAME to GitHub Pages |
| Frontend | Vanilla HTML5/CSS3/ES2020 | No framework, no build step |
| Fonts | System fonts + `'Courier New'` for monospace brand | No external font CDN |
| Analytics | Plausible (privacy-first) | No cookies, GDPR-compliant |
| AI agent | Claude claude-haiku-4-5-20251001 via Anthropic API | Frameworks explorer + post enrichment |
| Voice | Web Speech API (browser-native) | Chrome/Edge only; graceful degradation |
| TTS | Web SpeechSynthesis API | Browser-native, no third-party |
| Scheduling | Microsoft 365 Bookings / Graph API | Free/busy check for Ken and Bob |
| Proxy | Cloudflare Workers | Keeps Anthropic API key server-side |
| CI/CD | GitHub Actions | 3 workflows |
| Content fetching | Python 3 + feedparser + Anthropic SDK | LinkedIn RSS → JSON |
| Testing | Bash + Node.js (Cloud-Mary) | 4 tiers, 150+ checks |

---

## 4. Key JavaScript modules

### chat.js
- **Intent classifier:** keyword-based, 10 intents, case-insensitive
- **Frameworks agent:** Claude Haiku via PROXY_URL (Cloudflare Worker) with direct fallback
- **Scheduling agent:** delegates to schedule.js modal
- **Voice engine:** `SpeechRecognition` start/stop, interim results, auto-submit, `speechSynthesis` TTS
- **i18n hooks:** chip labels re-rendered on language switch
- **Plausible:** 6 tracked events (Open, Chip, Frameworks Start, Schedule Intent, Voice Start, Support)

### schedule.js
- **Leaders config:** `LEADERS` object — update emails here
- **Slots:** 3:00–4:55 PM PST in 25-min increments, weekdays only
- **M365 free/busy:** calls Microsoft Graph Bookings API
- **Funnel:** Step 1 (pick leader) → Step 2 (contact info) → Step 3 (slot confirmation → mailto)

### i18n/i18n.js
- Reads `strings-{lang}.js`, sets `window.I18N`
- Applies `data-i18n` attributes on DOM load and language switch
- Persists selection in `localStorage`

---

## 5. GitHub Actions workflows

### fetch-linkedin-posts.yml
- **Trigger:** Schedule (twice daily, 06:00 + 18:00 UTC) + manual dispatch
- **Steps:** Checkout → Python setup → Run `scripts/fetch_posts.py` → Commit+push if changed
- **Secrets:** `KEN_LINKEDIN_RSS`, `BOB_LINKEDIN_RSS`, `ANTHROPIC_API_KEY`
- **Output:** `data/linkedin-posts.json`, `feed.xml`

### deploy.yml
- **Trigger:** Push to `main`
- **Steps:** Checkout → FTP deploy to Hostinger → SSH cache-bust
- **Secrets:** `FTP_SERVER`, `FTP_USERNAME`, `SSH_HOST`, `SSH_USER`, `SSH_PASSWORD`, `SSH_PORT`, `SSH_PRIVATE_KEY`, `SSH_REMOTE_PATH`

### automation-v3.yml
- **Trigger:** Push to `main` + manual dispatch
- **Jobs (parallel):** Unit, A11y, E2E, Scale, i18n, Chaos, Report
- **See docs/version-control/CLOUD-MARY.md for full spec**

---

## 6. Secrets inventory

| Secret | Used by | Purpose |
|--------|---------|---------|
| `ANTHROPIC_API_KEY` | fetch workflow + Cloudflare Worker | Claude Haiku NLP + frameworks agent |
| `KEN_LINKEDIN_RSS` | fetch workflow | Ken Johnston LinkedIn RSS feed URL |
| `BOB_LINKEDIN_RSS` | fetch workflow | Bob Rapp LinkedIn RSS feed URL |
| `FTP_SERVER` | deploy workflow | Hostinger FTP host |
| `FTP_USERNAME` | deploy workflow | Hostinger FTP user |
| `SSH_HOST` | deploy workflow | Hostinger SSH host |
| `SSH_USER` | deploy workflow | Hostinger SSH user |
| `SSH_PASSWORD` | deploy workflow | Hostinger SSH password |
| `SSH_PORT` | deploy workflow | Hostinger SSH port |
| `SSH_PRIVATE_KEY` | deploy workflow | Hostinger SSH private key |
| `SSH_REMOTE_PATH` | deploy workflow | Remote deploy path |

---

## 7. Performance targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| First Contentful Paint | < 1.5s |
| Total Blocking Time | < 100ms |
| No render-blocking JS | ✓ (all scripts at bottom / defer) |
| No external font CDN | ✓ (system fonts only) |
| Max HTML page size | < 50KB |
| Max CSS size | < 30KB |
