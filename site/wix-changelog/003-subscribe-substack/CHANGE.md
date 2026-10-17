# 003 — Subscribe → Substack

- **Status:** planned
- **Created:** 2026-05-30 17:00 PDT
- **Author:** bobrapp
- **Source:** User instruction (Comet session 2026-05-30): "make this the subscribe — subscribe to our newsletter on substack https://aigovops.substack.com/"
- **Targets:** redesign repo `index.html` (canonical) + Wix Harmony live site (mirrored)
- **Wix Site History timestamp (before edit):** _to be filled when BEFORE captured_
- **Wix Site History timestamp (after edit):** _to be filled after AFTER_

## Goal

Replace every "Subscribe" / "Join newsletter" / "Join the brief" CTA with a single canonical link out to Substack.

- **Substack URL:** https://aigovops.substack.com/
- **Link attributes:** `target="_blank"` `rel="noopener noreferrer"`
- **Visible label:** "Subscribe on Substack" (primary CTAs) or "Subscribe" (compact CTAs)

## Edits to perform

### A. Redesign repo `index.html` (canonical)

1. Header / nav: if a Subscribe link exists, point it to https://aigovops.substack.com/ with `target=_blank rel=noopener noreferrer`.
2. Hero CTA row: change `<a class="btn btn-primary" href="#newsletter">Join the brief</a>` to `<a class="btn btn-primary" href="https://aigovops.substack.com/" target="_blank" rel="noopener noreferrer">Subscribe on Substack</a>`.
3. One-click action cards: change "Join newsletter" card href from `#newsletter` to https://aigovops.substack.com/ (same link attrs). Update visible label to "Subscribe on Substack".
4. `#newsletter` section: remove inline form. Replace with a short CTA block:
   - h2: "Subscribe"
   - p: "The AiGovOps brief — governance that runs like engineering. Delivered on Substack."
   - a.btn.btn-primary -> https://aigovops.substack.com/ (target=_blank, rel=noopener noreferrer), label "Subscribe on Substack"
5. Footer: if a newsletter form/link exists, replace with the same Substack link.

### B. Wix Harmony (mirror)

1. Locate every Subscribe / newsletter button or form on the homepage (and the dedicated newsletter page, if any).
2. Change link target to https://aigovops.substack.com/, set "Open in new window".
3. Replace inline newsletter form section with a CTA card: heading "Subscribe", subhead, single "Subscribe on Substack" button.
4. Confirm visual style matches existing primary buttons.

## Why

Newsletter is now hosted on Substack at https://aigovops.substack.com/. Inline forms add friction and require email plumbing; the Substack page handles signup, double opt-in, archive, and delivery. Single source of truth.

## Acceptance

- All visible "Subscribe" / "Join newsletter" / "Join the brief" CTAs link to https://aigovops.substack.com/.
- No remaining inline newsletter `<form>` / Wix form widget for newsletter.
- All external links open in a new tab with rel=noopener noreferrer.
- Live preview (GitHub Pages) and live Wix site agree.

## Rollback

See ROLLBACK.md.
