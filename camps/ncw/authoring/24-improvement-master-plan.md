# Master Plan — NCW AI Camp improvements
### T-13 to showtime · July 29 → August 11, 2026 · Bob Rapp & Ken Johnston · AiGovOps Foundation

Status key: 🟢 shipping in PR now · 🟡 needs Bob/Ken action · 🔵 scheduled work · ⚪ post-event

| # | Workstream | Owner | Effort | Due | Status |
|---|---|---|---|---|---|
| 1 | Spanish pack (site pages) | Computer | done in PR | Jul 29 | 🟢 |
| 2 | Spanish pack (kits + deck) | Computer, native review by NCW Tech | 1 build + review | Aug 3 | 🔵 |
| 3 | Pre/post surveys | Bob creates 2 Google Forms; pages ready | 30 min | Jul 31 | 🟡 |
| 4 | Supporters wall | Computer | done in PR | Jul 29 | 🟢 |
| 5 | EIN on Give pages | Camp page in PR; foundation site = Bob | 10 min | Jul 31 | 🟢/🟡 |
| 6 | Sponsor send + reply tracker | Bob & Ken send; tracker in PR | send Jul 30–31 | 🟡 |
| 7 | Own walkthrough videos | Bob records, Ken reviews | 2 evenings | Aug 6 | 🔵 |
| 8 | Wordmark bug + tools test coverage | Computer | done in PR | Jul 29 | 🟢 |
| 9 | Analytics | Bob picks provider + account | 30 min | Aug 3 | 🟡 |
| 10 | Dry run + day-of ops | Bob & Ken | 2 hrs | Aug 6 | 🔵 |

---

## 1–2 · Spanish pack 🟢/🔵
**Why:** tribal members and ELL families are two of the seven tables; the demo cards are already EN/ES but nothing else is.
- 🟢 In PR now: `docs/es/workshop.html` and `docs/es/checklist.html` (full Spanish), language toggle links on both English pages.
- 🔵 Next build (on request): Spanish table-kit PDF and Spanish deck edition from the existing generators.
- 🟡 Native review: route the ES pages to a native speaker (David Estrada at NCW Tech Alliance is the natural reviewer) before Aug 8. Machine-drafted, human-blessed — same rule we teach.

## 3 · Pre/post surveys 🟡
**Why:** the numbers Ken wants for the close, and the proof the sponsor emails promise.
- 🟢 In PR now: `docs/survey.html` (pre) and `docs/survey-after.html` (post) — question sets rendered, each with a `FORM_URL` placeholder at the top of the file.
- 🟡 Bob (30 min): create two Google Forms with the same questions, paste the two URLs, done. Pre-survey link goes in the Eventbrite confirmation email (Sue's team); post-survey QR is already on the deck's final slide once the URL exists.
- Pre (3 q): role/persona · "have you used an AI tool this month?" · "what's the one thing you want from the workshop?"
- Post (5 q): did your table finish the checklist? · confidence before/after (1–5) · which lab was most valuable? · will you do your week-one move? · one thing we should change.

## 4 · Supporters wall 🟢
- In PR now: `docs/supporters.html` — sponsor tiers, "your logo here" tiles, linked from support.html and the footer. Adding a real sponsor = drop a logo file + one line; instructions are in an HTML comment at the top of the file.
- ⚪ After each sponsor "yes": logo up within 24h, thank-you post, tag them.

## 5 · EIN on Give pages 🟢/🟡
- 🟢 In PR now: EIN 41-2999095 + NCW Tech Alliance EIN 91-2112603 on the camp `support.html` fine print.
- 🟡 Bob: add the same line to aigovops-foundation.com's Give page (separate repo/host — not reachable from this one).

## 6 · Sponsor outreach execution 🟡
- Pack is final (md/docx/pdf, delivered). Send window Jul 30–31: Anthropic, Bolt, Lovable, n8n, ChatPRD, Khan Academy first (high-confidence channels); Microsoft via Sue's contact; forms for OpenAI/Google/Replit.
- 🟢 In PR now: `authoring/23-sponsor-tracker.md` — one row per vendor (sent / replied / committed / paid / accounts granted / logo live) + the day-7 follow-up nudge template.
- I can also create the 16 Outlook drafts on request, and run a twice-weekly reply check against the tracker.

## 7 · Own walkthrough videos 🔵
- Record the seven persona-lab runs (5–7 min each) as YouTube videos on the Foundation channel; scripts already exist in the Live Demo Playbook.
- Two evenings: Bob records with Wispr/Granola-style narration, Ken reviews for accuracy. Then swap the five third-party links on tool pages for Foundation videos (tiny follow-up PR) — and the sponsor emails get "taught by us, on our channel."

## 8 · Site code health 🟢
- In PR now: wordmark visibility fix (the `hidden xs:block` vs Tailwind-CDN load-order bug) with nav density re-verified at 1280–1920px alongside it, and the tool-pages probe promoted into the Playwright suite so `docs/tools/*` is covered by CI from now on.

## 9 · Analytics 🟡
- Recommend GoatCounter (free, no cookies, one script tag) or Plausible ($9/mo). Bob creates the account (10 min), then one-line PR adds the tag site-wide. From then on: real traffic numbers for sponsors and the board.

## 10 · Dry run + day-of ops 🔵 (Aug 6, 2 hrs)
- Full run against the deck's timing cheat sheet; time each lab with the actual slides.
- Checklist: print 7 kits + spares · stage fallback videos behind every table QR (the deck promises them) · two hotspots + second laptop · flip chart + markers for Room Asks and the scoreboard · test Ken's GPT quiz rounds on venue guest wifi · assign a volunteer table captain per table (NCW Tech volunteers).
- I can put the Aug 6 dry run and an Aug 10 final-check on your calendar on request.

---

## Timeline at a glance
- **Jul 29 (today):** PR merged → ES pages, supporters wall, surveys scaffold, EIN, wordmark fix, test coverage, tracker live.
- **Jul 30–31:** sponsor emails sent (Bob/Ken) · Google Forms created and URLs pasted · foundation-site EIN added · title + paragraph to Sue if not already sent.
- **Aug 3:** Spanish kit + deck built · ES native review requested · analytics live.
- **Aug 6:** dry run · walkthrough videos recorded · follow-up nudges to non-responding sponsors.
- **Aug 8:** ES review back, corrections merged · print run of table kits.
- **Aug 10:** final site smoke test · kits packed · scoreboard/flip charts staged.
- **Aug 11, 9:00 AM:** you're facilitators, not presenters. The tables do the work.
