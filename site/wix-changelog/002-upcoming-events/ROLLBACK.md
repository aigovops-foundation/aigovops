# 002 — Upcoming Events — Rollback

Use if the AiGovOps Founders Forum Meetup event card needs to be removed (e.g., event canceled, postponed, or wrong details published).

## A. Redesign repo `index.html`

1. Identify the commit that added the event card (see git log on `index.html`, message starts with "Add June 4 2026 Founders Forum Meetup").
2. `git revert <sha>` and push to `main`. GitHub Pages will redeploy automatically.

Manual alternative: edit `index.html`, remove the `<article>` (or equivalent) block for the event, commit.

## B. Wix Harmony

1. Open Wix editor, navigate to the page where the event was added.
2. Click the event card element, press Delete (or right-click > Delete).
3. If multiple elements were added (heading, subhead, RSVP button), delete each.
4. Alternatively, use Wix Site History (toolbar cloud icon) to restore to the snapshot recorded in `CHANGE.md` "Wix Site History timestamp (before edit)".
5. Republish only after explicit user confirmation.

## C. Changelog records

The changelog entry itself can be reverted with:

    git revert <sha-of-CHANGE.md>
    git revert <sha-of-AFTER record>

Reverting the changelog does NOT change the live Wix site — use B above for that.

## Verification

- index.html `#events` no longer mentions June 4, 2026 / Founders Forum Meetup / luma.com/2mypeqtr.
- Wix live site events area no longer shows the card.
- No broken anchors or stranded buttons remain.
