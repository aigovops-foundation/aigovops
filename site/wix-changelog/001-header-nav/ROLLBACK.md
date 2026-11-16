# 001 — Header / Nav — Rollback

Use this if change 001 needs to be undone.

## Fastest path: Wix Site History

1. Open Wix Harmony editor for AiGovOps Foundation.
2. Top toolbar, click the cloud / history icon.
3. Restore to the snapshot timestamped just before the edit (see CHANGE.md, Wix Site History timestamp before edit).
4. Verify against BEFORE.png in this folder.
5. Republish only after explicit user confirmation.

## Manual path (if Site History snapshot is missing)

Reverse each numbered step from CHANGE.md Exact edits:

1. Header strip, Settings, Scroll behavior: set back to Default (non-sticky).
2. Header strip height: revert to 88px.
3. Background: revert to original (transparent / site default), remove bottom border.
4. Logo block: restore single text style (AiGovOps Foundation full weight).
5. Restore nav menu items in original order: HOME, BLOG, EVENTS. Remove What / Pillars / Programs / Tools / Events.
6. Delete the Contact button element.

## Git rollback

The changelog records themselves can be reverted with:

    git revert <commit-sha-of-AFTER>
    git revert <commit-sha-of-CHANGE.md applied update>

Reverting the changelog does NOT change the live Wix site — use the Wix steps above for that.

## Verification

- Live site header matches BEFORE.png in this folder.
- Nav reads HOME / BLOG / EVENTS, no Contact button visible.
- Header is not sticky on scroll.
