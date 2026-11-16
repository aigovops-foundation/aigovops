# AiGovOps Foundation — Site Redesign (June 2026)

Private review repository for Ken Johnston and Bob Rapp. This is a simplified, action-first redesign of https://www.aigovops-foundation.com/ — same content, easier to navigate, mobile-first, accessibility-aware, and tested across major browsers.

**Live preview (after enabling Pages):** Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)`. The repo home page will render `index.html`.

## What changed vs. current site
- Hero replaced with a short headline + 6 one-click actions
- Same content kept, reorganized into scannable sections
- Voice tightened to Ken (executive-practitioner) + Bob (operational checklist) + Beacon (productized clarity)
- Mobile-first 375px baseline, sticky compact header, stacked action cards
- Accessibility: skip link, semantic headings, labeled forms, visible focus, 44px tap targets, reduced-motion support

## One-click actions (above the fold)
1. Join newsletter
2. Attend events
3. Read the blog
4. Listen to podcast
5. Use the tools (Beacon, etc.)
6. Contact us

## Files
- `index.html` — the new homepage
- `styles.css` — mobile-first, accessible styles
- `script.js` — progressive enhancement (mobile nav)
- `WIX-MAPPING.md` — section-by-section punch list to apply in Wix
- `COPY.md` — final homepage copy for editorial approval

## Approval flow
1. Ken + Bob review the live Pages preview
2. Approve hero + 6 actions
3. Approve section order + copy in `COPY.md`
4. Apply `WIX-MAPPING.md` block-by-block in Wix
5. Run browser + accessibility QA (see below)

## Browser QA matrix
- Desktop: Chrome, Edge, Firefox, Safari (latest)
- Mobile: iPhone Safari, Android Chrome
- Widths: 375, 768, 1280

## Accessibility checklist
- [ ] Skip link works and is visible on focus
- [ ] Logical heading order (h1 → h2 → h3)
- [ ] All form fields labeled, autocomplete set
- [ ] Visible focus on every interactive element
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Touch targets ≥ 44×44px
- [ ] Works with keyboard only
- [ ] `prefers-reduced-motion` honored
- [ ] Screen reader pass (VoiceOver, NVDA)
