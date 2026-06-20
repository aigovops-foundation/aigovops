## What & why

<!-- One or two sentences. Link the issue if there is one. -->

## Checklist
- [ ] Small, reviewable change that matches the surrounding style.
- [ ] `node scripts/check-site.js` passes (vendor-data schema + local link integrity).
- [ ] **Vendor-data changes:** cited a public source and kept the honest *best-at* / *gap*. Ranking can't be bought and gaps aren't hidden (see `docs/vendor-sponsorship.html`).
- [ ] If the catalog changed, bumped `VENDOR_META.lastReviewed`.
- [ ] **UI changes:** accessibility held — skip-link/landmark, keyboard + visible focus, AA contrast, reduced-motion.
- [ ] Doc pages were regenerated with `scripts/md2html.py` (not hand-edited HTML).
