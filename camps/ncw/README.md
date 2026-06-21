# AiGovOps × NCW AI Camp

> **Cool Tools. Cool Schools. The Rules.**
> A complete, open-source community AI training program — built for the NCW Tech Alliance **AI Expo 2026**, August 11, 2026, Wenatchee Convention Center.

**Live site:** [aigovops-foundation.github.io/aigovops-ncw-ai-camp](https://aigovops-foundation.github.io/aigovops-ncw-ai-camp/)
**Foundation:** [aigovops-foundation.com](https://www.aigovops-foundation.com)
**Partner:** [NCW Tech Alliance](https://www.ncwtech.org) · [AI in Action series](https://www.ncwtech.org/ai-in-action)

---

## What this is

A complete day-of program designed to move every attendee from a self-rated **5/10** confidence with AI to a **7 or 8** — with practical tools, ethical guardrails, and a region-wide pledge they can sign on the way out.

Built around one principle:

> **Human in the driver's seat. AI does the painful work.**

The repository contains everything: the published webapp source, the 32-page mini-camps booklet, the trailer storyboard with 14 cinema-quality frames, the 7-Point NCW AI Partnership Pledge (English + Spanish), and every supporting artifact — communications, slido bank, drip campaign, custom domain guide, and the full QA report.

---

## What's in here

### `/docs` — Published webapp (served by GitHub Pages)

Multi-page editorial-grade site, mobile-first, no backend dependencies. GitHub Pages serves this folder at [aigovops-foundation.github.io/aigovops-ncw-ai-camp/](https://aigovops-foundation.github.io/aigovops-ncw-ai-camp/).

- `docs/index.html` — Home (hero, scenario cards, schedule)
- `docs/plan.html` — The Plan (4 breakouts, room schedule)
- `docs/centerpiece.html` — Centerpiece plenary (Maria/Jake, evidence both sides, Deep Think + Model Council demo)
- `docs/mini-camps.html` — All 35 mini-camps filterable + searchable
- `docs/tools.html` + `docs/tools/*.html` — 16 dedicated tool pages + lab-tools installer index
- `docs/pledge.html` — Sign the NCW AI Partnership Pledge (with live signer counter)
- `docs/hint-logs.html` — The Hint-Logs method (the receipts side of "keep the receipts")
- `docs/resources.html` — One-pager downloads + trailer storyboard + tool inventory + citations library
- `docs/about.html` — Ken Johnston, Bob Rapp, the Foundation, the partnership
- `docs/assets/` — JS, CSS, images, 14 trailer frames
- `docs/downloads/` — One-pager PDFs, mini-camps booklet, Spanish pledge, hint-logs spec, trailer script
- `docs/api/sign.js` — Stub endpoint for pledge form (can be wired to any backend)

### `/authoring` — Source documents

The canonical, editable markdown source for every artifact in the program.

| File | Contents |
|---|---|
| `01-training-plan.md` | Strategic overview · the 4 breakouts · room layout |
| `02-facilitator-run-of-show.md` | Minute-by-minute for facilitators |
| `03-centerpiece-session.md` | The 60-min plenary script with the Deep Think + Model Council live demo |
| `04-one-pagers.md` | Source for the 4 printable one-pagers |
| `05-gamma-deck-outline.md` | 60-slide master deck — paste into Gamma's "import from outline" |
| `06-pledge-and-two-futures.md` | The 7-Point Pledge + Maria/Jake "two futures" story (EN) |
| `07-mini-camps.md` | All 35 mini-camps (5 scenarios × 7 voices) |
| `08-substack-morning-of.md` | Substack post Ken & Bob publish the morning of |
| `09-slido-and-plant-scripts.md` | 25 anticipated Q&A items + 3 plant-question scripts |
| `10-pledge-spanish.md` | Mexican Spanish translation of the Pledge + Two Futures |
| `11-handoff-email.md` | Monday-morning email from Bob to NCW Tech Alliance leadership |
| `12-drip-sequence.md` | 5-email post-event drip (Day 1, 4, 10, 18, 30) |
| `13-custom-domain-guide.md` | How to point `ncw.aigovops-foundation.com` at the live webapp |
| `14-trailer-script.md` | 90-second trailer narration + 12-shot storyboard + ElevenLabs settings |
| `15-qa-report.md` | End-to-end QA review — 34 findings, fact-checked stats, link audit |
| `authoring/mini-camps-booklet.pdf` | Print-ready 32-page saddle-stitch booklet (8.5×11) |

### `/docs/trailer-frames` — Cinema-quality storyboard

14 PNG frames (1280px+, 16:9) generated from the trailer script. Drop into Gamma, Descript, CapCut, or any editor with the narration to produce the final cut. Royalty-free.

---

## How to use this repo

### Just want to read the materials?

Browse `/docs` — every document is plain markdown, readable on GitHub.

### Want to host your own version of the webapp?

```bash
git clone https://github.com/aigovops-foundation/aigovops-ncw-ai-camp.git
cd aigovops-ncw-ai-camp/docs
# Serve any static way — Python's stdlib works fine
python3 -m http.server 8080
# Open http://localhost:8080
```

Or deploy directly to:

- **GitHub Pages** — already enabled, serves `/docs` from `main` (the Foundation standard)
- **Cloudflare Pages** / **Vercel** / **Netlify** — point at this repo's `/docs` folder, zero config
- **Your own server** — `rsync` the contents of `/docs` to any static host

### Want to adapt this for your community?

This is Apache 2.0 licensed — fork it, rename "NCW" to your region, adjust the Pledge text in `pledge.html`, swap the trailer frames in `assets/img/trailer/`, and ship. Please credit the AiGovOps Foundation and consider opening a PR with your adaptations so other communities can learn.

---

## The 7-Point NCW AI Partnership Pledge (v1.0)

1. **AI is a partner, not a replacement.**
2. **We use AI to expand opportunity** — especially for those without it.
3. **We govern AI like we engineer it** — with checklists, evidence, and reviews.
4. **We protect critical thinking, not just outcomes.**
5. **We disclose. Always.**
6. **We triangulate hard questions.** No single AI gets to answer something that matters.
7. **We keep the receipts.** Prompts saved. Outputs saved. Edits saved.

Sign it: [ncwaigovopsfoundation.pplx.app/pledge.html](https://ncwaigovopsfoundation.pplx.app/pledge.html)

---

## Foundation principles, scaled down

Every artifact in this package is built on the AiGovOps Foundation's three habits:

| Foundation habit | What it looks like in this camp |
|---|---|
| **Policy as code** | A 5-sentence classroom AI policy on the wall. A 1-page municipal AI ordinance. Hint-logs. |
| **Evidence that ships** | Save the prompt, save the answer, save your edits — a Drive folder a parent or auditor can actually look at. |
| **Find every AI on your network** (Beacon scaled-down) | The hint-log spec at `/downloads/hint-logs-spec.md` is the personal version of what Beacon does for enterprises. |

What costs seven figures in the enterprise — Beacon, Umbrella, Lantern — is here, free, Apache 2.0, on a Saturday afternoon.

---

## Credits

**Co-leads:** Ken Johnston · Bob Rapp
**Foundation:** [AiGovOps Foundation](https://www.aigovops-foundation.com) (501(c)(3))
**Community partner:** [NCW Tech Alliance](https://www.ncwtech.org)
**Built with:** Perplexity Computer — research, drafting, page builds, image generation, end-to-end QA
**Source dataset for evidence claims:** Khan Academy + AIMS Collaboratory (June 2026), [MIT critical-thinking study](https://www.theguardian.com/us-news/2026/jun/19/chatbots-critical-thinking-skills) (June 2026), Cornell GenAI study (May 2026), and the full citations library at `docs/15-qa-report.md`.

---

## License

[Apache 2.0](LICENSE). Use it. Fork it. Adapt it for your town. Tell us how it went.

---

*The story we tell about AI in NCW will be the story we wrote — together.*
