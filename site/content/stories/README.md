# Stories — drop a file here and it publishes

This folder is the whole publishing system for the monthly story. One Markdown file in,
three things out, no HTML, no PR, no test suite:

| You do | It does |
|---|---|
| Copy `_TEMPLATE.md` to `2026-10-doing-ai-better.md`, fill in title/date, write | `blog/doing-ai-better.html` is rendered from the same skeleton as every hand-made post |
| Commit it (or hand it to Jeeves, who commits it for you) | a card appears at the top of `blog.html`; `feed.xml` gets the item; GitHub Pages is live within a minute |
| Nothing | `content/drafts/<slug>.newsletter.md` (subject + lead + link) and `<slug>.linkedin.md` (hook + body under 1,300 chars + link + three hashtags) are written for you. Both end on the Gate Check, tagged `src=newsletter` / `src=linkedin`, so the funnel knows which path a reader took. Paste, don't rewrite. |

Front matter: `title` and `date` (YYYY-MM-DD) are required. `author`, `summary`, `image`, `slug` are optional.
Files starting with `_` are ignored. Re-saving a file re-renders it; nothing is duplicated.

The renderer is `scripts/build_content.py`; the workflow is `.github/workflows/publish-content.yml`.
Hand-made posts and cards are never touched — generated cards live between the
`<!-- content:start -->` / `<!-- content:end -->` markers in `blog.html`.

## Dates and holds

A story publishes on its `date` (the Tuesday cron). Add `hold: true` to the front matter to keep it out of every output — blog, feed, drafts — until the line is removed. The daily runbook email sets and clears this when Ken or Bob replies NO / YES.
