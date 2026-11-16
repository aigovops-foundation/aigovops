# Garden-warm conversion guide (M6b)

The mechanical recipe for converting any remaining page of the Foundation site to the
garden-warm design. Reference conversions: **`support.html`** and **`community.html`**
(diff them against main to see the recipe applied). The homepage (`index.html`) uses the
same system plus its own `css/porch.css` layer — do not copy porch.css pieces to other pages.

## 0. The one rule

**Skin only.** You may touch: the `<head>` stylesheet links and the page's own `<style>`
block. You may NOT touch: text content, URLs/hrefs, `data-*` attributes (especially
`data-orig` parked CTAs and `data-i18n` hooks), `aria-*` attributes, `onclick`/plausible
events, scripts, ids/classes in markup, meta/JSON-LD/canonical, or comments (e.g. the
`giving-interim:start/end` markers on support.html — Jeeves watches them). Inline
`style=""` attributes in the body stay as-is; where their colors clash with the new
ground, override them **from the page `<style>` block** (see §4). After converting, run
the gate (§6) — the unit/a11y/i18n tests assert literal strings, URLs and aria-labels.

## 1. `<head>` additions

Immediately **after** `<link rel="stylesheet" href="css/style.css" />` (style.css always
stays first — it carries layout/structure), add:

```html
<!-- M6b garden-warm skin (shared system) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Source+Sans+3:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="css/garden.css" />
```

garden.css already re-skins for free: body ground + paper grain, serif headings,
header/nav, lang toggle, skip-link, focus rings, `.section-light/-mid/-dark`,
`.page-hero`, `.btn-primary/.btn-outline`, badge strip, blog/event/pillar/post cards,
footer (including inline `#8080a0` address colors), chat + schedule modal accents.
A page with no local `<style>` block may need nothing else.

## 2. Palette mapping (old → garden)

Use the `--garden-*` custom properties from `css/garden.css`; never hard-code new hexes.

| Old value (navy/teal system)                        | Garden replacement                          |
|-----------------------------------------------------|---------------------------------------------|
| `var(--dark)` / `#0d0d1a` / navy gradients          | `var(--garden-charcoal)` band **or** `var(--garden-green)` band (§3) |
| `var(--mid)` / `#1e1e3a` / `#0a2318` / `#0d1a2e`    | (gradient goes away — flat garden band)     |
| `var(--white)` page/section background              | `var(--garden-cream)` `#FAF7F0`             |
| `var(--light)` / `#f8f7ff` section background       | `var(--garden-deep-cream)` `#F1EAD8`        |
| card background on cream sections                   | `#fff` + `1px solid var(--garden-card-line)` + `var(--garden-shadow-sm)` + radius `14px` (small) / `var(--garden-r-2xl)` (large) |
| `var(--purple)` (accent, buttons, links)            | `var(--garden-green)` fills / `var(--garden-green-ink)` text |
| `var(--teal)` `#1d9e75` as TEXT on light            | `var(--garden-green-ink)` `#1F5E3A`         |
| `var(--teal)` as TEXT on a charcoal band            | `#5DCAA5` (scope `--teal: #5DCAA5` on the band) or `var(--garden-gold)` |
| `var(--teal-accessible)` / `var(--teal-dark)` text  | `var(--garden-green-ink)` (hover: `var(--garden-green-deep)`) |
| `var(--teal-light)` wash background                 | `var(--garden-deep-cream)`                  |
| `var(--muted)` `#72728e` body text                  | `var(--garden-ink-soft)` `#4C4A42`          |
| `var(--text)` / `var(--dark)` headings              | `var(--garden-charcoal)` `#2B2B28`          |
| `var(--border)` `#e0ddf5`                           | `var(--garden-line)` (rules) / `var(--garden-card-line)` (cards) |
| white text `#fff` on dark bands                     | keep on green/charcoal bands; on cream grounds re-ink to `var(--garden-charcoal)` / `var(--garden-ink-soft)` |
| `rgba(255,255,255,.5–.6)` dim text on dark          | `rgba(250,247,240,.72)` on charcoal, `#F4FAF4` on green |
| amber `#ef9f27`                                     | `var(--garden-orange)` fills / `var(--garden-orange-ink)` text |
| button radius `8px`                                 | `999px` (pill)                              |

## 3. Hero treatment rule

Every page hero (`.page-hero`, `.support-hero`, `.comm-hero`, etc.) that was a navy
gradient becomes a **daylight deep-cream hero**:

```css
.PAGE-hero { background: var(--garden-deep-cream); color: var(--garden-charcoal);
  position: relative; overflow: hidden; }
.PAGE-hero::before { content: ""; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(480px 220px at 10% 115%, rgba(232,181,74,.28), transparent 70%),
              radial-gradient(460px 220px at 92% -15%, rgba(46,125,79,.16), transparent 70%); }
.PAGE-hero .container { position: relative; }
.PAGE-hero .hero-eyebrow { color: var(--garden-green-ink); }   /* keep Courier mono */
.PAGE-hero h1 { font-weight: 600; }                            /* Fraunces comes from garden.css */
.PAGE-hero p { color: var(--garden-ink-soft); }
```

Full-width dark CTA bands lower on a page (e.g. `join-banner`, newsletter-style strips)
become **orchard green** (`var(--garden-green)` + the same two radial washes with
`rgba(15,74,44,.55)` as the second). Data/stats bands may instead go **charcoal**
(`var(--garden-charcoal)`) — the "toolkit treatment" — with gold/`#5DCAA5` accents.
Use at most one green and one charcoal band per page; everything else is cream/deep-cream.

## 4. Page-local `<style>` blocks and inline styles

1. Rewrite the page's own `<style>` block by applying the §2 table line-by-line. Keep
   every structural property (grid, padding, font-size) untouched — change only colors,
   borders, radii, shadows, and font-family accents.
2. **Inline `style=""` attributes in the body must not be edited.** Fix clashes from the
   `<style>` block instead:
   - Re-point CSS variables the inline styles consume. Both converted pages do
     `:root { --teal-accessible: #1F5E3A; }` so every inline
     `color:var(--teal-accessible)` link goes garden automatically. On charcoal bands,
     scope `--teal: #5DCAA5;` on the band's class.
   - For hard-coded inline colors (e.g. white ghost buttons on a now-cream hero), add a
     targeted `!important` override, e.g.
     `.support-hero a.btn[style] { background: var(--garden-cream) !important; ... }`.
   - Sections with inline `background:var(--white|--light)` can be re-banded with
     attribute selectors: `.section[style*="--white"] { background: var(--garden-cream) !important; }`.
3. Buttons: primary actions inside a **green** band become orange
   (`.band .btn-primary { background: var(--garden-orange); color: var(--garden-charcoal); }`)
   — never green-on-green. Third-party brand buttons (Discord `#5865F2`, Stripe) keep
   their brand color.

## 5. AA contrast pairs (verified — use only these)

| Foreground on background                            | Ratio  |
|-----------------------------------------------------|--------|
| `#2B2B28` charcoal on `#FAF7F0` cream               | ~13:1  |
| `#4C4A42` ink-soft on cream / deep-cream            | ≥6.3:1 |
| `#1F5E3A` green-ink text on cream / deep-cream      | ≥6.4:1 |
| `#9C4E12` orange-ink text on cream                  | 5.5:1  |
| `#fff` on `#2E7D4F` green                           | 5.05:1 |
| `#F4FAF4` on `#2E7D4F` green                        | ~4.8:1 |
| `#FAF7F0` cream / `rgba(250,247,240,.72)` on `#2B2B28` charcoal | ≥4.6:1 |
| `#E8B54A` gold on `#2B2B28` charcoal                | 7.3:1  |
| `#5DCAA5` on `#2B2B28` charcoal                     | 7.1:1  |
| `#2B2B28` charcoal on `#E07A2A` orange              | 4.9:1  |

Never use: green `#2E7D4F` as small text on cream (4.4:1 — use `#1F5E3A`), gold as text
on cream/green, teal `#1d9e75` as text anywhere on light, `#E07A2A` orange as text on
cream (use `#9C4E12`).

## 6. Gate + visual check (every page)

```bash
bash scripts/cloud-mary.sh --unit --a11y --i18n --docs   # must be fully green
```

Do not edit tests. If a unit/a11y assertion fails, you changed something in §0's
"may NOT touch" list — revert the markup, fix via CSS instead. Then load the page at
desktop (1280px) and mobile (375px) and check: no horizontal overflow, no
white-on-cream/green-on-green text, header sticky over the paper grain, footer charcoal
with garden link colors, focus rings visible (tab through the CTAs).

## 7. Remaining pages checklist

blog.html, blog/*.html (9 posts), events.html, frameworks.html, ecosystem.html,
alpha.html, press.html, ken.html, bob.html, f-ai-friday.html, jeeves-*.html, status.html,
demo.html, 404.html, admin.html. Convert each on the `feature/m6b-garden-all-pages-july-2026`
branch; one commit per page or small batch; do not commit without the founders' go.
