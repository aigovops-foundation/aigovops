# The flow — one loop, nothing twice

*11 September 2026, evening. Supersedes `FLOW.md`. The café (`index.html`, the front door of these
pages) is the one place the loop is drawn for a visitor; this page is the one place it is drawn for the
people who maintain it. Rule: every object is made once, in one file, and everything else links to it.*

## The loop, from the visitor's side

```
  a story · a post · a friend · the Camp · a search
        │
        ▼
  THE CAFÉ  — index.html: Wren asks "what brought you in?"
        │   five doors, each a real case: a promise (100) · shipping an agent (200) · already running (300) · proof (400) · not sure (Gate Check)
        ▼
  THE WREN CARD  — made on the café page, in the browser; copied, never stored
        │   level · path · lens (and the lens not your own) · Thursday · who you'll show
        ▼
  THE WORKSHEET  — one per level; the hour; both paths; the ten-minute version; the checklist as its last page; "no one left behind"
        ▼
  THE RECEIPT  — Beacon in the browser (100) · CI (200) · the broker (300) · offline (400)
        │   hashes and dates, never content
        ▼
  THURSDAY  — THURSDAY.md: first five minutes for receipts; a host marks; the mark line
        ▼
  THE LETTER  — Tuesday: marks by level, no names; the countdown to 2 Dec 2027
        │
        └──▶ next level, or host — and a friend brought to the door
```

## One object, one home

| Object | The only file that defines it | Everything else… |
|---|---|---|
| The door and the five problems | `index.html` (the café) | links here — the Foundation site's "start the practice" and the Community page both land on the café |
| The Wren Card | `index.html` (built in the browser) · the persona in `docs/WREN.md` | the worksheets assume you have one |
| The ladder (levels, gates, cases, AALs) | `MANIFESTO.md` (one page) | the café shows the same four levels as doors; `README.md` links; nothing restates the table |
| The four gates and the rule | `MANIFESTO.md` | the Foundation home page shows them in its own words |
| A level's hour | `levels/<level>/WORKSHEET.md` — with its checklist as the last section | `levels/<level>/README.md` says who it is for and what tools; no steps |
| The receipt | the engine that makes it (Beacon, Umbrella, Lantern) | worksheets say which engine at which step, live or fall |
| Thursday and the mark line | `docs/THURSDAY.md` | the café's step 4 links; Omni's cohort call reads it |
| The Letter line | Omni (`letter.py`, #418) | this page names it; nothing else describes it |
| Versions, live vs fall | `RELEASE.md` | `CHANGELOG.md` records; nothing else claims a version |
| Wren | `docs/WREN.md` | the café uses her art from `docs/wren/`; the Foundation site's Ask widget gets her face in Fall |

## What folded into what, 11 September

| Before (two or more places) | After (one) |
|---|---|
| `README.md` front door · `docs/FLOW.md` loop · the demo's opening · the Community page's ladder | **`index.html`, the café** — the loop drawn once, for the visitor; `README.md` is now a short pointer for people who arrive via GitHub |
| `levels/*/CHECKLIST.md` beside `levels/*/WORKSHEET.md` (the same steps twice) | **the checklist is the worksheet's last page** — one file per level, printable from there |
| `docs/FLOW.md` (objects, rules, live-vs-fall) · `docs/MEMBER-ACTIVITIES.md` (every activity per level) | **this page** for the objects; the worksheets for the activities; `MEMBER-ACTIVITIES.md` kept in `docs/reference/` as the record of how the kits were derived |
| The PRDs, the decisions, the estate map, the standards map, the Glacis note, the release-day record — in `docs/` beside the working pages | **`docs/reference/`** — the back room: read when you need the reasoning, never to find the next step |
| The ladder table in `README.md` and in `MANIFESTO.md` | **`MANIFESTO.md`** only |
| "Ask", "Jeeves", "Wren" as three names at the door | **Wren** at the door; Jeeves stays in the runbooks; "Ask Wren" is the one surface (R4, edit pending Ken's copy pass) |

## The seven rules that keep it simple

1. **One name at the door: Wren.** One question: what brought you in?
2. **One next step, one Thursday.** Every page, card and message ends the same way.
3. **Two paths, one receipt.** Plain words or code — byte-identical results, marked the same.
4. **Ten-minute version of everything.** Every worksheet names the three steps that still produce a receipt.
5. **"I don't know yet" is always an answer,** and it always pairs you with someone.
6. **Nothing decides but the gate; nobody marks but a host.** Wren carries; she does not judge.
7. **Nothing twice.** If a fact needs a second home, the second home is a link.

## Live today vs Fall

| Piece | Today | Fall |
|---|---|---|
| The café | `index.html` on these pages; the site links here | Wren's face on the Foundation site's Ask widget (Omni #421); the café's card becomes `checks/wren-ready` |
| The Wren Card | built in the browser, copied by the visitor | stored on the Gate Card when the visitor chooses |
| The worksheets | live, both paths, checklist inside | Spanish for 200–400; hover-a-tier |
| The receipt | Beacon's demo (100); tools from source (200); paper (300); `VERIFY.md` (400) | the Gate Check rule box (Library #87); PyPI; `beacon coverage`; `verify --offline` |
| Thursday | Ken hosts; the mark line in the recap | host rota; `practice.mark` receipts (Library #88) |
| The Letter | weekly | marks by level (Omni #418) |
