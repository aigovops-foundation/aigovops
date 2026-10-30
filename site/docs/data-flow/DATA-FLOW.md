# Data Flow Specification — AiGovOps Foundation Site
**Version:** 1.0 | **Date:** 2026-06-03

---

## 1. Content data flow (LinkedIn posts pipeline)

```
LinkedIn RSS Feeds
   │  (KEN_LINKEDIN_RSS, BOB_LINKEDIN_RSS)
   ▼
scripts/fetch_posts.py
   ├── feedparser.parse() → raw items
   ├── clean_title() → strip hashtag-only titles
   ├── strip_urls() → remove raw URLs from summaries
   ├── _first_sentence() → fallback title extraction
   ├── haiku_enrich_posts() → Claude Haiku NLP pass
   │     ├── lang detection (ISO code)
   │     ├── content_type classification
   │     └── title/summary improvement
   │   [ANTHROPIC_API_KEY required; degrades gracefully if absent]
   ├── data/linkedin-posts.json (write)
   └── feed.xml (write, RFC 2822 dates)
        │
        ▼
   GitHub commit + push (automated)
        │
        ▼
   GitHub Pages serve → browser fetch
        │
        ▼
   js/main.js → loadPosts() → renderCol() → DOM
        └── postsUpdated span → "Updated Xh ago"
```

**Trigger:** GitHub Actions `fetch-linkedin-posts.yml` (06:00 + 18:00 UTC daily)  
**Fallback:** If fetch fails, last committed JSON is served unchanged  
**Staleness warning:** Script logs warning if JSON > 24h old at fetch time

---

## 2. AI chatbot data flow

```
User input (text or voice)
   │
   ├── [Voice path] SpeechRecognition API (browser)
   │     └── interim transcript → chatInput.value
   │
   ▼
classify(text) — intent classifier
   └── keyword matching against INTENT_RULES array
        │
        ├── [null intent] → FALLBACK message
        │
        ├── [frameworks] → runFrameworkAgent()
        │     ├── PROXY_URL set? → POST to Cloudflare Worker
        │     │     └── Worker → Anthropic API (claude-haiku-4-5-20251001)
        │     │           └── Response → HTML fragment → chat DOM
        │     └── PROXY_URL empty → direct browser fetch (dev/demo)
        │
        ├── [meeting] → SCHEDULE.open() modal
        │     └── M365 Graph API free/busy check
        │           └── slot list → visitor picks → mailto: link
        │
        └── [all other intents] → RESOURCES[intent] → link response
              └── addMsg('bot', ...) → DOM
                    └── [voice active] → speechSynthesis.speak()
```

**No user data persisted.** Chatbot state is session-only (in-memory).  
**API key exposure:** Without PROXY_URL set, Anthropic API key is in browser JS.  
**Recommended:** Deploy `functions/frameworks-agent.js` to Cloudflare Workers before traffic scales.

---

## 3. Scheduling agent data flow

```
User taps "Schedule a Call"
   │
   ▼
SCHEDULE.open() — step 1: pick leader (Ken / Bob / Either)
   │
   ▼
Step 2: contact form (name, email, topic)
   │
   ▼
generateSlots() — next 5 weekdays, 3–4:55 PM PST
   │
   ▼
M365 Graph API — GET /bookings/{calendarId}/calendarView
   ├── Auth: app-level token (configured in schedule.js)
   └── Response: busy blocks → filter → available slots
        │
        ▼
Step 3: slot confirmation
   └── "Send request" → mailto: to chosen leader
         Subject: "Meeting request [topic]"
         Body: "Name, email, proposed slot"
```

**No calendar write access.** The agent only reads free/busy and generates a mailto: link.  
**Privacy:** No visitor data is sent to any server. Name/email go only into the mailto: link.

---

## 4. Analytics data flow

```
User action (page load, click, form submit)
   │
   ▼
Plausible script (plausible.io/js/script.js)
   ├── Pageview: automatic on navigation
   └── Custom event: window.plausible(eventName, {props})
        Events tracked:
        ├── Chatbot Open
        ├── Chatbot Chip {intent}
        ├── Frameworks Agent Start
        ├── Frameworks filtered {region, industry, risk}
        ├── Framework clicked {framework}
        ├── Frameworks filters cleared
        ├── Schedule: Step 1–3 funnel
        ├── Support: Tier click {tier, platform}
        ├── Support: Coffee {amount, currency}
        ├── Newsletter signup {source}
        ├── Voice input started
        ├── Press: Logo/Boilerplate downloads
        ├── Founder page CTAs (LinkedIn, email, schedule)
        └── Community: Repo click {repo}
```

**Privacy:** Plausible is cookieless. No PII collected. GDPR-compliant by design.  
**Data residency:** EU servers (Plausible is EU-based).  
**Retention:** Plausible default (indefinite in paid plan).

---

## 5. Deployment data flow

```
git push origin main
   │
   ▼
GitHub Actions: automation-v3.yml (parallel)
   ├── Unit tests (Node.js)
   ├── A11y tests (bash grep)
   ├── E2E tests (curl against live site)
   ├── Scale tests (50 concurrent curl)
   ├── i18n tests (bash grep)
   └── Chaos monkey (bash fault injection)
        │
        [if all pass]
        │
        ▼
GitHub Actions: deploy.yml
   ├── FTP upload → Hostinger file system
   └── SSH → cache-bust command
        │
        ▼
GitHub Pages: pages-build-deployment (automatic)
   └── CDN propagation (~60 seconds)
        │
        ▼
www.aigovops-foundation.com live
```

---

## 6. Data at rest

| Data | Location | Sensitivity | Retention |
|------|----------|------------|-----------|
| LinkedIn posts | `data/linkedin-posts.json` (Git) | Public | Git history |
| RSS feed | `feed.xml` (Git) | Public | Git history |
| GitHub Secrets | GitHub encrypted store | High | Until deleted |
| Plausible analytics | Plausible EU servers | Aggregate only | Indefinite |
| Visitor sessions | None (no cookies) | N/A | N/A |
| Form submissions | None (mailto: only) | N/A | N/A |

---

## 7. Data in transit

| Flow | Protocol | Notes |
|------|---------|-------|
| Browser ↔ Site | HTTPS (TLS 1.3) | GitHub Pages enforces HTTPS |
| Browser ↔ Plausible | HTTPS | EU servers |
| Browser ↔ Cloudflare Worker | HTTPS | CORS restricted to aigovops-foundation.com |
| Worker ↔ Anthropic API | HTTPS | Server-to-server, no browser exposure |
| GitHub Actions ↔ LinkedIn RSS | HTTPS | Fetched server-side |
| GitHub Actions ↔ Anthropic API | HTTPS | Server-to-server |
| GitHub Actions ↔ Hostinger | SFTP/SSH | Encrypted deploy |
