# Design System — AiGovOps Foundation Site
**Version:** 1.0 | **Date:** 2026-06-03

---

## 1. Brand identity

**Name:** AiGovOps Foundation  
**Tagline:** "Governance Versioned Like Code. Tested Before Deployment."  
**Secondary tagline:** "Policy as Code. Evidence that Ships."  
**Voice:** Direct, technical, honest. No marketing superlatives. No jargon without explanation. Practitioners speaking to practitioners.

---

## 2. Logo — Lantern

The foundation's logo is the Lantern — an SVG illustration of a governance lantern as a metaphor for illuminating AI systems with verifiable evidence. It is not a wordmark.

### Variants
| Variant | Use | File |
|---------|-----|------|
| Animated (searchlight sweep) | Nav header only | Inline SVG in `<header>` |
| Static dark (medalion) | Footer, favicon contexts | `images/logo.png`, `images/logo.svg` |
| 32px favicon | Browser tab | `images/favicon-32.png` |
| 16px favicon | Older contexts | `images/favicon-16.png` |
| Apple touch | iOS home screen | `images/apple-touch-icon.png` |
| OG/social | Social cards | `images/og-logo.png` |

### Logo animations
- **Searchlight sweep:** Two beams rotate ±52° and ±36°, 6s cycle, ease-in-out infinite
- **Flame pulse:** Opacity 0.95 → 0.55, 2.2s, ease-in-out infinite
- **Text ring rotation:** 35s linear, infinite
- **Mobile (<600px):** Sweep slows to 8s, text ring stops
- **prefers-reduced-motion:** All animations disabled; beams shown at mid-position

### Logo colours
- Background: `#071a12` (near-black green)
- Primary stroke: `#1d9e75` (teal)
- Flame core: `#e1f5ee` (near-white)
- Flame mid: `#9fe1cb` (light teal)
- Flame outer: `#5dcaa5` (mid teal)
- Lantern body: `#0a3d2a` (dark green)
- Roof/base: `#0f6e56` (medium green)

### Usage rules
- Always on a dark background or with sufficient contrast
- Minimum size: 32px × 32px
- Do not recolour, stretch, or add effects
- Animated version only in nav — static everywhere else

---

## 3. Colour tokens

```css
/* Core */
--teal:            #1d9e75;   /* Primary brand */
--teal-dark:       #0f6e56;   /* Hover, accessible on white */
--teal-accessible: #0f6e56;   /* Text use — 4.5:1 on white */
--teal-light:      #e1f5ee;   /* Light fills */
--dark:            #0f0f1a;   /* Hero bg */
--purple:          #6c3de6;   /* Chatbot, nav active */
--purple-dark:     #5429c7;
--purple-light:    #ede9fc;

/* Neutral */
--white:           #ffffff;
--light:           #f7f6fd;   /* Section alt bg */
--text:            #1a1a2e;   /* Body text */
--muted:           #6b6b8a;   /* Secondary text */
--border:          #e5e3f0;
--bg:              #f7f6fd;
```

**Contrast ratios (WCAG AA = 4.5:1):**
- Teal `#1d9e75` on `#071a12` dark bg: **4.6:1** ✅
- Teal-accessible `#0f6e56` on white: **5.4:1** ✅
- Muted `#6b6b8a` on white: **4.6:1** ✅

---

## 4. Spacing scale

| Token | Value | Use |
|-------|-------|-----|
| `4px` | Component internal gaps |
| `8px` | Small spacing |
| `12px` | Grid gaps |
| `16px` | Card padding |
| `20px` | Section elements |
| `24px` | Card padding large |
| `32px` | Section margins |
| `48px` | Section padding |
| `64px` | Hero padding |

---

## 5. Component specifications

### Buttons

| Variant | Background | Text | Use |
|---------|-----------|------|-----|
| `.btn-primary` | `--purple` | white | Primary actions |
| `.btn-outline` | transparent | `--text` | Secondary actions |
| `.btn-teal` | `--teal` | white | Support page |
| `.btn-teal-outline` | transparent | `--teal-dark` | Support secondary |
| `.btn-large` | adds `padding: 16px 36px` | – | Hero CTAs |

All buttons: `border-radius: 8–10px`, `font-weight: 600`, `cursor: pointer`, `transition: all 0.18s`.

### Cards

| Type | Border | Radius | Hover |
|------|--------|--------|-------|
| Action card | `rgba(255,255,255,0.12)` | `16px` | +3px lift, opacity +0.06 |
| Framework card | `0.5px solid --border` | `14px` | teal border, 2px lift |
| Pillar card | `0.5px solid --border` | `14px` | – |
| Tier card | `1.5px solid --border` | `16px` | teal border, 4px lift |
| Featured tier | `1.5px solid --teal` | `16px` | teal border |
| Repo card | `0.5px solid --border` | `12px` | teal border, 2px lift |

### Badges / chips

- Framework risk: `HIGH` red, `MEDIUM` amber, `LOW` green
- Tag pills: `background: --light`, `border: 0.5px solid --border`, `border-radius: 20px`
- Badge strip: `background: --dark`, small monospace pills with teal dots
- Chat chips: `border: 1px solid --border`, hover `background: --teal`, rounded

---

## 6. Iconography

All icons are emoji-based (not icon fonts or SVG):
- Action cards: 📰 📅 📆 🔦 ☂️
- Chatbot chips: ⚖️ 📆 💚 📰 📅 💡 💻 🔦 🏮
- Community ways: 💻 📖 ⚖️ 🌍 📣 💚
- Speaking topics: ⚙️ 🚗 📋 🌐 🏗️ 🏥 🔏

**Rationale:** Emoji are universally understood, require no dependency, and render consistently at small sizes across all platforms.

---

## 7. Motion design

| Element | Animation | Duration | Easing | Trigger |
|---------|-----------|---------|--------|---------|
| Lantern searchlight | `rotate(-52° → +52°)` | 6s | ease-in-out | Continuous |
| Lantern flame | `opacity 0.95 → 0.55` | 2.2s | ease-in-out | Continuous |
| Lantern text ring | `rotate 0 → 360°` | 35s | linear | Continuous |
| Card hover | `translateY(-2 to -4px)` | 0.15–0.18s | ease | Hover |
| Button hover | `translateY(-1px)` | 0.18s | ease | Hover |
| Nav link | `color, border-color` | 0.2s | ease | Hover |
| Voice pulse | `opacity 1 → 0.45` | 1.4s | ease-in-out | Listening state |
| Chat window | `hidden` ↔ visible | instant | – | Open/close |

**All animations respect `prefers-reduced-motion: reduce`.**

---

## 8. Writing style guide

- Sentence case everywhere (no Title Case in headings)
- Monospace for anything CLI, code, or technical: `$ aigovops --help`
- Numbers: spell out one through nine; use digits for 10+
- Abbreviations: spell out on first use (EU AI Act = "EU AI Act" — no further expansion needed; OVERT 1.0 = "Open Verifiable Evidence and Transparency")
- Foundation name: "AiGovOps Foundation" — never "AIGOVOPS" or "AiGovOps"
- Tool names: "Beacon", "Lantern" — title case, no ™ or ® needed
- Protocol: "OVERT 1.0" — always with version number
