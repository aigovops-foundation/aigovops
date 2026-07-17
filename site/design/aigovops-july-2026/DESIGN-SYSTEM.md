# aigovops-july-2026 — the estate design system

*Canonical rules for how every AiGovOps property looks and speaks. Born from the
2026-07-17 estate simplification (design of record: Library repo
`plan/estate-simplification.md`; session record: `plan/book/when-creation-is-cheap-ch1.md`).
Tokens: [`tokens.css`](tokens.css) beside this file — the single source of truth.*

## The one sentence

Every property's footer leads with the estate creed, byte-identical:

> Ship safe AI — never unsafe AI: get to yes, stay at yes, recover to yes, and keep the
> garden of humanity growing.

Heroes use the short imperative — **"Ship Safe AI. Never Unsafe AI."** — then the three
movements, always welded to their plain glosses: *get to yes — before you ship · stay at
yes — while it runs · recover to yes — when it breaks*. "Yes" is never allowed to stand
cold at a first touch (the negotiation-book misread): anchor to shipping safe AI first.

## The family rule: match the family, not the wallpaper

One garden, many beds. Two named skins, same tokens:

- **garden-warm** — porches, hubs, community-facing pages. Cream ground, orchard green,
  signal orange accents, Fraunces + Source Sans 3, painted warmth. Reference:
  `css/garden.css` (+ homepage-only `css/porch.css`) in this repo.
- **almanac** — deep reading-room documents (blueprints, control planes, long specs).
  The same family in print form: warm paper, ink, botanical green, stamp red confined to
  badges. Reference implementation: `mockups/m6-porch/variant-3-almanac/`.

Navy/midnight infrastructure skins are retired estate-wide. Consoles and log surfaces
may keep a charcoal *panel* where dark is load-bearing for readability; the page chrome
around them is garden.

## Color rules (WCAG AA is a hard gate, not a preference)

- Body text on cream: `--garden-charcoal` or `--garden-ink-soft` (≥7:1).
- Green as TEXT on cream: `--garden-green-ink`, never `--garden-green` below ~24px.
- Orange is a FILL color (buttons, pills, stamps); orange text on cream uses
  `--garden-orange-ink`. Never small orange text on green or green on green.
- On charcoal bands: `--garden-on-dark` / `--garden-on-dark-dim` / `--garden-gold`;
  if a page inlines `var(--teal)` inside a charcoal band, scope it to `#5DCAA5` there.
- Every new pair must clear 4.5:1 small / 3:1 large. The battery's design tier enforces
  the known-good pairs; don't invent near-misses.

## Structure rules

- Load order on every Foundation page: `css/style.css` → `css/garden.css` → page CSS.
  `style.css` carries layout; garden re-skins. Never fork `style.css` per page.
- Skin changes are content-neutral: links, scripts, aria attributes, analytics events,
  and test-asserted strings stay byte-identical. The ONE sanctioned content addition is
  the creed line in footers that lack it.
- Band budget: a page gets at most one green band and one charcoal band; everything else
  alternates cream / deep-cream. Long-form articles: body copy on cream only.
- Footers: creed first (italic serif voice), then the property tagline, then the
  canonical estate link set (Foundation · Community platform · Library · Beacon ·
  Umbrella · NCW AI Camp) + connect links. Exactly one contentinfo per page.
- Footer rollout modes (from M5): *injector* (`estate-footer.js` + `data-site` +
  `data-theme`) for properties with no footer system; *native* for properties with one.
  Never both on a page.

## Mechanics

- Page conversion recipe: `mockups/m6-porch/CONVERSION-GUIDE.md` (palette mapping,
  hero treatment, inline-style playbook, never-touch list).
- Gate: `bash scripts/cloud-mary.sh --unit --a11y --i18n --docs` minimum before any
  commit; full battery (+ dns/uptime/errors/scale/chaos/design/happy) before ship.
- Enforcement: Jeeves' design-warden watches the live estate for creed presence, token
  drift, and AA regressions (Omni repo, `docs/RUNBOOK-design-system.md`).

## Provenance

Chosen by Bob from three externally-evaluated variants (garden-warm, lantern-daylight,
almanac) on 2026-07-17; garden-warm shipped to the porch (PR #61), then estate-wide
(M6b–M10). The losing lantern-daylight mockup is retained in `mockups/m6-porch/` as
reference for any future daylight-teal need.
