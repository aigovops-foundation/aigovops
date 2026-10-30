# CLAUDE.md — house rules for the AiGovOps Foundation public site

**Read this before citing any rule at this repository.** If you are holding house rules about
`scripts/battery.py`, a `bob-brain` session-filing step, a 1/0/? mediator gate, `jeeves`, or
"ALL GREEN before pushing to main", those belong to **`aigovops-foundation/Omni-Rapp-June-2026`** —
a different repository in the same estate. None of it applies here. This is a static site: HTML, CSS,
vanilla JS, a small Python content pipeline, GitHub Pages. There is no gate, no ledger and no agent
fleet in this repo.

This file exists because the confusion was real. In a multi-repo session on 2026-09-30, Claude Code
injected two *other* repositories' `CLAUDE.md` files into every reviewer working on this one, framed
as instructions that override default behaviour — and one of them normalises an agent pushing
straight to main, which is exactly the judgement this repo's publish pipeline needs a reviewer to
keep. The slot gets filled by something; this fills it deliberately.

## Where this repo's rules actually live

| Document | What it governs |
|---|---|
| `docs/version-control/VERSION-CONTROL.md` | branching, commit types, the PR checklist, CI as the enforcement layer, deploy source |
| `content/stories/README.md` | the publish pipeline's contract — "one Markdown file in, three things out"; hand-made posts are never touched |
| `design/wren-cafe/DESIGN-SYSTEM.md` | colour, type, voice, and the rule that every page ends on one next step |
| `docs/version-control/CLOUD-MARY.md` | the test tiers and what each one covers |

`README.md`, `HIBT.md` and `COPY.md` are **stale June-2026 artifacts** from the pre-Wren-Café era.
Do not read them as current policy.

## THE RULE: nothing reaches a public URL that a reviewer has not bounded

`main` is what GitHub Pages serves, and `.github/workflows/publish-content.yml` commits to it
unattended. So the publish job declares its outputs and fails on anything else:

```yaml
OUTPUTS="blog blog.html feed.xml sitemap.xml founders.html content/drafts content/translations llms.txt llms-full.txt"
git add -A -- $OUTPUTS        # -A so deletes and renames still travel
# …then fail the job if `git status --porcelain` shows anything outside OUTPUTS
```

Keep that list in step with `scripts/build_content.py`'s write-target constants and the
`scripts/build-llms-txt.mjs` outputs.
`scripts/test-publish-contract.py` asserts it does, and is verified to fail when a target is
dropped — which is literally bug #153, where the list had drifted and every push was blocked.

**Do not "fix" this by going back to a bare `git add -A`.** That was #154, and it removed the only
written record of what this pipeline outputs. The consequence landed immediately: a *tracked*
`scripts/__pycache__/*.pyc` (gitignore does not apply to tracked files) was re-committed to the
Pages branch on every run, which made the "No changes to commit." path dead code. If a build step
needs a new output, add one word to `OUTPUTS`.

## THE RULE: every third-party string is hostile until escaped

`data/linkedin-posts.json` is written from a remote RSS bridge and read by `js/main.js` into
`innerHTML`, and `index.html`'s CSP allows `'unsafe-inline'`. The feed is **not** limited to Bob's
and Ken's own writing — it has carried posts authored by other people. Markup in a post title
therefore executed in every visitor's browser until 2026-09-30.

Two layers, deliberately not relying on each other:

- **`scripts/fetch_posts.py`** — `sanitise_post()` strips markup and scheme-checks URLs so the
  committed JSON carries none. Note `haiku_enrich_posts()` runs *after* `fetch_feed()` and rewrites
  title and summary with model output, so it strips too; sanitising at one of the two is not enough.
- **`js/main.js`** — `esc()` on every feed field that reaches markup (attributes included), and
  `safeHref()` on anything reaching an `href`, because escaping does nothing about `javascript:`.

A strip in Python and an escape in JS, in that order — escaping in both would double-encode and show
visitors `&amp;lt;`. Guards: `scripts/test-fetch-sanitise.py`, `scripts/test-xss.js`.

## RETIRED 2026-10-19: the site is English only

Bob's decision (2026-10-19): "remove all the stuff below the main page - and also remove spanish - only do
english for the entire site". The EN/ES toggle, `js/i18n/`, `scripts/check-i18n-keys.js`, `scripts/test-i18n.sh`
and `blog/es/` (now redirect stubs) are gone; `build_content.py` has `LANGS = ()`. The footer is one line
(© · Privacy · Terms · Contact) and the feedback strip is not loaded. The section below is kept as history of
bug #155 in case translations ever return.

### History: a duplicate key is a silent translation loss

`window.I18N = { footer: {…}, …, footer: {…} }` is legal JavaScript; the parser keeps the last block
and every key in the first becomes unreachable. Because `js/i18n/i18n.js` applies a value only when
the lookup is truthy, English pages keep their correct static text and **Spanish pages silently keep
the English copy** — which is bug #155, across twenty-five-plus pages, with nothing failing.

`scripts/check-i18n-keys.js` guards it: duplicates at **any** depth, every `data-i18n` key resolving
in both languages across all 49 pages (recursively — `blog/` and `blog/es/` included), and direct
en/es key-set parity, which catches the `chips.*` and `chatbot.*` keys that `js/chat.js` reads and no
`data-i18n` attribute mentions.

**And a key resolving is not the same as the browser being able to fetch the file.** `i18n.js` built
its `<script src>` as the document-relative literal `js/i18n/strings-${lang}.js`, so on any page under
`blog/` it requested `/blog/js/i18n/strings-es.js` — a 404 — and the Spanish toggle was dead on all 14
blog pages while every key "resolved" perfectly in the checker's Node sandbox. The path is now derived
from `document.currentScript.src`, which is correct from a subdirectory *and* from a site served under
a subpath; and the `<script>` has an `onerror`, because a missing strings file otherwise fails in total
silence — the page keeps its English static text and looks right. The checker asserts all three.

Keep checks like this in real `.js` or `.py` files, not in a `node -e "…"` inside a shell script. The
previous inline version's escape comparison was eaten by bash — eight backslashes collapsed to four,
so Node compared one character to a two-character string, the comparison was always false, and one
apostrophe in UI copy would have switched the whole guard off silently. `scripts/test-arch.sh`
carries a comment about having learned the same lesson.

## How to verify a change

```bash
node scripts/test-unit.js && node scripts/test-unit-v3.js
node scripts/test-xss.js && python3 scripts/test-fetch-sanitise.py
python3 scripts/test-publish-contract.py && python3 scripts/test-personas.py
python3 scripts/test-message.py && bash scripts/test-a11y.sh
```

`.github/workflows/automation-v3.yml` runs these on push and PR. The live-site tiers
(`test-e2e-v3.sh`, `test-dns.sh`, `test-uptime.sh`) need the deployed site and run on a schedule.

Two things worth knowing about CI's reach. An automated `publish-content` push uses the default
`GITHUB_TOKEN`, and GitHub does not dispatch workflow runs for those — so a generated artifact lands
on `main` having run only the pipeline self-test, until the next scheduled sweep. And paste real
output into a PR's test line rather than an assurance: #154's subject is literally "publish-content
**still failed** after the founders.html fix", which is what an unbacked claim looks like in hindsight.

## Content

Stories are authored in `content/stories/*.md` and rendered by `scripts/build_content.py` into
`blog/<slug>.html`, a card in `blog.html` between its `<!-- content:start -->` markers, and a
`feed.xml` item. **`feed.xml` has real subscribers**: an item's `<guid>` is derived from its slug, so
renaming a slug re-notifies every subscriber as though the post were new. Hand-made posts and cards
are never touched by the generator. `content/drafts/` is regenerated *and pruned* — do not leave
anything there you want to keep.

`sitemap.xml` is maintained the same way, between `<url><!-- content -->` markers, and
`update_sitemap()` runs *after* `render_translations()` so a `blog/es/` page written on the same run
gets listed. Before 2026-09-30 nothing wrote it at all and five of fourteen posts were missing, so
`scripts/test-publish-contract.py` now asserts every page under `blog/` appears in it.
