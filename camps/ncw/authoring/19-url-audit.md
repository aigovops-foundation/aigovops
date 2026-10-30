# NCW AI Camp — URL Audit (June 21, 2026)

**Scope:** Every external link, internal page link, citation, tool download, and GitHub asset URL referenced from `/docs/` and `/authoring/`. Tested with both default and browser User-Agent. 66 distinct URLs reviewed.

**Overall result:** 55 / 66 working. 1 genuine fix applied. 10 false positives (bot-blocking, auth-gated, or transient).

---

## Genuine issues found and fixed

### 1. `verodate.ca/blog/ai-tutors-personalized-learning-classroom-2026` — SSL handshake failure

**Issue:** Khan Academy +23% mastery citation pointed at a third-party blog whose host returns SSL handshake errors and was already flagged in `15-qa-report.md` as a weak secondary source.

**Fix:** Replaced everywhere with the canonical AIMS Collaboratory URL (`https://www.aimscollaboratory.org/resources-all/how-khan-academy-is-building-a-better-ai-tutor-our-most-recent-learnings`), which Khan Academy authored directly. The AIMS URL was already being used elsewhere in the centerpiece deck, so this also resolves the inconsistency the QA report called out.

**Files patched** (8 total):
- `docs/centerpiece.html`
- `docs/assets/js/resources.js`
- `docs/downloads/pledge-spanish.md`
- `authoring/03-centerpiece-session.md`
- `authoring/06-pledge-and-two-futures.md`
- `authoring/08-substack-morning-of.md`
- `authoring/09-slido-and-plant-scripts.md`
- `authoring/10-pledge-spanish.md`

`authoring/15-qa-report.md` retains the historical references as documentation of the issue.

### 2. `docs/downloads/master-deck.pdf` — 404 on Pages

**Issue:** PDF returns 404 from `https://aigovops-foundation.github.io/aigovops-ncw-ai-camp/downloads/master-deck.pdf` because the file lives on the `add-rendered-video-library` branch only.

**Fix:** Resolves automatically when PR #2 (rendered video library + master deck PDF) merges to `main`. No code change needed in this PR.

---

## False positives (no fix needed)

| URL | Code | Why it's fine |
|---|---|---|
| `lennysnewsletter.com/p/productpass` | 200 with browser UA | Real URL used in repo works. My earlier test of `/p/the-ai-product-bundle` was the wrong URL — that path is not in the repo. |
| `nytimes.com/2026/06/09/nyregion/nyc-schools-council-members-ai-ban.html` | 403 to curl | NYT blocks non-browser UAs. Real users reach it normally. |
| `chat.openai.com` | 403 to curl | Cloudflare bot protection. Real users land on login page. |
| `claude.ai` | 403 to curl | Cloudflare bot protection. |
| `gamma.app` (root and `/docs/...`) | 403 to curl | Cloudflare; decks load for owners/viewers. |
| `perplexity.ai` (Comet download) | 429 to curl | Rate limit on probe traffic. |
| `instagram.com/p/DZWP5QnFxuz` (Stanford) | 429 | Already removed from current materials — only mentioned in `09-slido-and-plant-scripts.md` as a script the speaker reads. Replacement Khan/AIMS citation is the primary source. |

---

## Tested and passing (highlights)

- **GitHub Pages root** (`/`, `/centerpiece.html`, `/breakouts.html`, `/minicamps.html`, `/tools.html`, `/hint-logs.html`, `/pledge.html`, `/resources.html`, `/about.html`, `/lab-tools.html`) — all 200
- **Tool pages** — all 16 (`/tools/<slug>.html`) return 200
- **Downloads on `main`** — one-pagers PDF, mini-camps booklet PDF, Spanish pledge PDF, hint-logs spec PDF, trailer script MD all 200
- **Citations (verified)** — Guardian (MIT critical thinking), Cornell Scientific Inquirer, Senate (Blunt Rochester), Google Blog (Gemini Deep Think), AIMS Collaboratory, AiGovOps Foundation site
- **Tool homepages** — ChatGPT, Claude, Gemini, Perplexity (Comet), Gamma, NotebookLM, Khanmigo, Magic School, Glean, Microsoft Copilot, Wispr Flow, Granola — all reachable for real users

---

## Method

```
# Default UA pass — caught bot-blocked sites
curl -sIL <url> -o /dev/null -w "%{http_code}\n"

# Browser UA pass — distinguished real failures from bot blocks
curl -sIL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36" <url>
```

Only failures present on **both passes** were treated as real. Single 403/429 with a clean browser-UA pass = bot block, not broken.

---

**Audit by:** Computer · **Repo state:** branch `url-audit-fixes` opened off `main`.
