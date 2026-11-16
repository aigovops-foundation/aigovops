# 003 — Subscribe → Substack — Rollback

Use if the Substack redirect needs to be reverted (e.g., Substack URL changes, newsletter moves back in-house, or content team wants the inline form back).

## A. Redesign repo `index.html`

Fastest path: `git revert <sha-of-index.html commit for change 003>` and push to `main`. GitHub Pages redeploys automatically.

Manual path:
1. Restore hero CTA: `<a class="btn btn-primary" href="#newsletter">Join the brief</a>`.
2. Restore one-click action card #1: label "Join newsletter", href `#newsletter`.
3. Restore `#newsletter` section with the original inline form markup (see git history for the file just before change 003).
4. Restore footer newsletter form/link if it was replaced.

## B. Wix Harmony

1. Open Wix editor.
2. For each Subscribe / Newsletter element changed in change 003: open Link panel and set the link back to the original target (in-page anchor or Wix form), un-check "Open in new window".
3. Re-add the inline newsletter form section: insert a Wix form widget (Contacts > Subscribe form) on the homepage / newsletter page in the previous position.
4. Or use Wix Site History (toolbar cloud icon) to restore to the snapshot timestamped just before change 003 (see CHANGE.md).
5. Republish only after explicit user confirmation.

## C. Changelog records

The changelog entry can be reverted with:

    git revert <sha-of-CHANGE.md>
    git revert <sha-of-AFTER record>

Reverting the changelog does NOT change the live Wix site — use B above for that.

## Verification

- index.html no longer contains https://aigovops.substack.com/ as a CTA target.
- Inline newsletter form is back on the page where it lived before.
- Wix live site newsletter form is functional and visible in its previous spot.
- No external Substack links remain in primary CTA positions unless intended.
