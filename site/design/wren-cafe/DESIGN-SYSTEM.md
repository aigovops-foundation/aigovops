# Wren Café — the AiGovOps Foundation design system

*11 September 2026. Supersedes the garden layer (`design/aigovops-july-2026`) as the named system; the
garden tokens stay the primitives. The canvas: [The Café System](https://claude.ai/code/artifact/532ace5d-83db-465c-b3ca-f1a094920238).
The layer: `css/wren-cafe.css`, loaded after `garden.css` on every page; the icon sprite is inlined at the top of each body.*

## The idea

The site is a café with Wren at the table by the door. Cream ground, charcoal ink, orchard green for
what you can do, one warm accent for what to notice, and the chalkboard as the only other dark surface
(the practice pages, the demo). Everything is made once and linked; the words are part of the system.

## Color

| Token | Value | Job |
|---|---|---|
| `--wc-cream` | #FAF7F0 | page ground |
| `--wc-deep-cream` | #F1EAD8 | alternating bands, the badge strip, the "start here" door |
| `--wc-charcoal` | #2B2B28 | ink; the footer and toolkit bands |
| `--wc-ink-soft` | #4C4A42 | body text on cream — 7:1 |
| `--wc-green` | #2E7D4F | fills: the Community pill, the primary button, the newsletter band |
| `--wc-green-ink` | #1F5E3A | green for text on cream — 7.1:1: links, eyebrows, tags |
| `--wc-green-deep` | #0F4A2C | hover and emphasis |
| `--wc-orange` | #E07A2A | warm accent — fills only |
| `--wc-orange-ink` | #9C4E12 | orange for text on cream — 5.5:1: door hints, movement separators |
| `--wc-gold` | #E8B54A | accent on charcoal — 7.3:1 there; the focus ring; never text on cream |
| `--wc-board` / `--wc-board-2` | #22302F / #1A2626 | the chalkboard — the practice pages' stage, the demo |
| `--wc-chalk` / `--wc-chalk-dim` | #EFE9D8 / #B3AD9D | text on the board (6.4:1 for dim) |
| `--wc-amber` | #E0AC48 | the café's accent on the board — gold's job there |
| `--wc-coffee` | #6B4A35 | Wren's voice: her quoted lines, the mark line |

Fill colors are never used for text; the `-ink` variant is. The legacy `--purple*`, `--radius`, `--shadow`,
`--border`, `--muted`, `--text`, `--light`, `--dark` are folded into these values by the layer, so nothing
old renders in its old colours. `--teal` stays the lantern's colour and nothing else.

## Type

| Role | Face | Setting |
|---|---|---|
| Hero h1 | Fraunces 560 | clamp(2.4rem, 5.6vw, 4.2rem) · 1.08 · −.015em |
| Movements | Fraunces | clamp(1.02rem, 1.7vw, 1.3rem) · b 640 green-ink · separators orange-ink |
| h2 / section title | Fraunces 700 | clamp(1.4rem, 2.5vw, 2rem) · 1.2 |
| Door question | Fraunces italic 500 | 1.12rem · 1.3 · charcoal |
| Body | Source Sans 3 400 | 1–1.18rem · 1.6 · ink-soft · ≤ 62ch |
| Eyebrow · tag · badge | IBM Plex Mono 600 | .75rem floor (12px) · .14em · uppercase |
| Wren's line | Fraunces italic 500 | 1.05–1.18rem · coffee on cream, chalk on the board (`.wc-wren`) |

Three faces. `'Courier New'` is retired site-wide; IBM Plex Mono takes every label.

## Shape, elevation, focus

Three radii: `999px` pills and buttons · `14px` cards and doors · `1.4rem` hero doors and pillars.
Two shadows, both warm: `shadow-sm` at rest, `shadow` on hover with a −4px lift. Lines carry ink:
`rgba(43,43,40,.14)` for rules, `.08` for card edges, `rgba(239,233,216,.18)` on the board.
One focus ring, every control: `2px solid gold`, offset 3px.

## Components

Header (sticky cream, five items, the Community pill) · hero doors (`.action-card`: green / charcoal / white) ·
café doors (`.cafe-door`: white, mono label, italic question, one line of case) · buttons (primary green,
outline green, the newsletter's orange) · cards: the quiet card (`.way`, cream, 18px) and the offer card
(`.tool`, white, 22px, eyebrow, serif title, go-link pinned to the bottom) · badge pill · the footer creed.
The board variant (`.wc-board`) is the same anatomy on the chalkboard.

## Icons

Stroke icons on a 24px grid, 1.8 stroke, round caps, `currentColor`, from the inline sprite (`#wc-sprite`, at the top of every body):
`<svg class="wc-icon" aria-hidden="true"><use href="#wc-cup"></use></svg>`. Set: cup · check · receipt ·
shield · wrench · hand · search · book · leaf · doc · code · scale · globe · megaphone · heart · repeat ·
pen · flag · eye · atom · cap · tent · lantern · umbrella · clipboard · calendar · briefcase · news · sprout.
Emoji are not icons: any that remain in copy sit inside `<span aria-hidden="true">`.

## Voice

The promise once, where a page introduces itself (the home hero, a person's creed line, a post's
standfirst) — not in a footer. Since 2026-10-19 the footer is a single line, © · Privacy · Terms · Contact,
and nothing else sits below the page; the site is English only. One question at the door — *what brought you in?* — and doors
written in the visitor's words as real cases. Levels describe a person's practice, never a system's
assurance. Sentence case for headings; Title Case for the three movements as names and the h1.
Every page ends on one next step: the ten-minute Gate Check, the worksheet, or Thursday at 15:00 Pacific.

## Where it applies

The Foundation site (all pages, this layer) · the practice pages (`aigovops-foundation/practice`, the
same layer in `assets/wren-cafe.css` and the Jekyll layout) · the demo and the Decision Sheet (the
board palette). New surfaces take the layer as-is; they do not restate tokens.
