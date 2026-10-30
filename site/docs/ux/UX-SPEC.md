# UX Specification — AiGovOps Foundation Site
**Version:** 1.0 | **Date:** 2026-06-03

---

## 1. Design principles

1. **Governance-native aesthetics** — the site looks like it was built by engineers who take compliance seriously. Dark hero, monospace type, teal ecosystem colours. Not a SaaS marketing page.
2. **Practitioners first** — assume the visitor understands AI/ML. No over-explaining. Dense information is fine.
3. **Every page has one primary action** — homepage: schedule a call. Frameworks: filter + Lantern CTA. Support: donate.
4. **Verifiability over claim** — avoid unsubstantiated superlatives. Every statement should be provable.
5. **Progressive disclosure** — hero communicates in 5 words; detail is a scroll away.

---

## 2. Information architecture

```
Homepage (index.html)
├── Hero: headline + 5 action cards
├── Core Pillars (4)
├── Toolkit trilogy (Beacon, Lantern, Lantern Reports)
├── About the Founders
├── Latest from Ken & Bob (posts feed)
├── Compliance badge strip
├── Newsletter section
└── Footer

Frameworks (frameworks.html)
├── Hero: question-framed headline
├── Sticky filter bar (Region / Industry / Risk / Clear)
├── Card grid (40 frameworks)
└── CTA → Lantern + Beacon

Support (support.html)
├── Hero: "Fund the Standard"
├── Coffee banner (locale-aware)
├── Tier grid (3 tiers)
├── Impact breakdown
├── Transparency section
└── FAQ

Community (community.html)     Press (press.html)
Ken (ken.html)                 Bob (bob.html)
Blog (blog.html)               Events (events.html)
404 (404.html)
```

---

## 3. Component library

### Navigation
- **Desktop:** Logo left, nav links centre, EN/ES toggle right. All links 44px min-height.
- **Mobile (<600px):** Logo left, hamburger right, EN/ES toggle between them. Hamburger injects secondary links (Community, Press, Ken, Bob, Support) dynamically on open.
- **Active state:** Underline in teal-accessible colour.

### Action cards
- 5-card grid in hero area. "Schedule a Call" highlighted in teal (primary action).
- **Desktop:** `repeat(5, 1fr)`. **Tablet:** `repeat(3, 1fr)`. **Mobile:** 2+2+1 (last card full width).
- Cards: dark background, white text, emoji icon, two-line label.

### Chatbot
- Persistent bubble (bottom right, 54×54px, purple gradient) with badge counter.
- Opens as 380px-wide dialog, full-screen on <400px.
- Input row: mic button (voice, Chrome/Edge only) + text input + send button. All 44px min height/width.
- Chips: 10 intents, EN/ES translated. Inline chips after FALLBACK response.
- Voice: pulsing red mic while listening, auto-submit on speech end.

### Framework cards
- 3-column grid (auto-fill, min 300px). Single column on mobile.
- Each card: name (monospace, teal), risk badge (colour-coded), description, tags, "Learn more →" link.
- Hover: teal border, 2px lift.

### Post cards
- Two columns (Bob / Ken). Each card: title, truncated summary, date.
- Freshness timestamp below section heading: "Updated Xh ago".

---

## 4. Accessibility specification

| Requirement | Implementation | Status |
|------------|---------------|--------|
| Skip-to-content link | `.skip-link` visible on focus | ✅ |
| WCAG 2.2 AA contrast | Teal #1d9e75 on dark: 4.6:1 | ✅ |
| Touch targets ≥ 44×44px | `min-width/height: 44px` on all interactive elements | ✅ |
| Keyboard navigation | All interactive elements reachable by Tab | ✅ |
| Focus indicators | `outline` visible on all focusable elements | ✅ |
| Screen reader landmarks | `<header>`, `<main>`, `<footer>`, `<nav>`, roles | ✅ |
| Chatbot ARIA | `role="dialog"`, `aria-modal`, `aria-live="polite"` | ✅ |
| Images | All `<img>` have meaningful `alt` | ✅ |
| Forms | All inputs labelled | ✅ |
| Heading hierarchy | H1 → H2 → H3 no skips | ✅ |
| Reduced motion | Logo animation + voice pulse: `@media(prefers-reduced-motion:reduce)` | ✅ |
| Lang attribute | `<html lang="en">` / `lang="es"` | ✅ |

---

## 5. Responsive breakpoints

| Breakpoint | Behaviour |
|-----------|-----------|
| > 1000px | Full desktop layout, 5-col action grid |
| 700–1000px | Action grid 3-col, founders grid stacked |
| 600–700px | Action grid 2-col |
| < 600px | Mobile: hamburger nav, 2+2+1 action cards, full-width chatbot, 1-col grids |

---

## 6. Colour system

| Token | Hex | Use |
|-------|-----|-----|
| `--teal` | `#1d9e75` | Primary brand, CTAs, active states |
| `--teal-dark` | `#0f6e56` | Hover states |
| `--teal-accessible` | `#0f6e56` | Text on light backgrounds (4.5:1+) |
| `--teal-light` | `#e1f5ee` | Hover fills, light badges |
| `--dark` | `#0f0f1a` | Hero backgrounds |
| `--purple` | `#6c3de6` | Nav active, chatbot bubble |
| `--white` | `#ffffff` | Page backgrounds |
| `--light` | `#f7f6fd` | Section alternates |
| `--muted` | `#6b6b8a` | Secondary text |
| `--border` | `#e5e3f0` | Card borders |

---

## 7. Typography

| Use | Font | Size | Weight |
|-----|------|------|--------|
| Body | System sans-serif | 16px | 400 |
| Headings | System sans-serif | clamp scales | 700 |
| Hero H1 | System sans-serif | clamp(1.8rem, 4vw, 3.2rem) | 700 |
| Eyebrow labels | `'Courier New', monospace` | 0.72–0.75rem | 600 |
| Code / CLI | `'Courier New', monospace` | 0.85rem | 400 |
| Framework names | `'Courier New', monospace` | 0.9rem | 700 |
| Timestamps | `'Courier New', monospace` | 0.78rem | 400 |

Monospace is used deliberately as a brand signal — "this is built by engineers for engineers."

---

## 8. Voice UX specification

**Trigger:** User taps mic button (🎤) in chatbot input row  
**Browser support:** Chrome 33+, Edge 79+. Hidden on Safari/Firefox (no degradation).  
**Visual feedback:** Icon changes from mic → stop square, turns red, pulses at 1.4s interval  
**Audio:** No sound effects — visual-only feedback  
**Language:** Uses `document.documentElement.lang` (en-US / es-ES)  
**TTS:** Bot response text stripped of HTML, first 300 chars, rate 0.95  
**Auto-submit:** 300ms after `recognition.onend` if transcript is non-empty  
**Error states:** `no-speech` and `aborted` are silent; other errors show in chat  
**Reduced motion:** Pulse animation disabled; mic still functional
