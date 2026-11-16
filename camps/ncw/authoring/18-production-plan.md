# NCW AI Camp — Video & Audio Production Plan
## What's missing, what's ready, and exactly how to ship it
*The handoff document for Ken Johnston & Bob Rapp · June 2026*

---

## TL;DR

The **strategy, copy, design, and code are 100% done** and live at [aigovops-foundation.github.io/aigovops-ncw-ai-camp](https://aigovops-foundate-foundation.github.io/aigovops-ncw-ai-camp).

What's **missing for full multi-media production** is the *rendered* audio + video — the actual MP3s and MP4s. This document explains exactly what to render, in what order, on which platform, with reusable scripts in English and Spanish.

You can produce **the entire video library in one weekend** if you commit to a single platform choice. We recommend:

> **Synthesia** for educator-facing avatar videos (Tina, Maya, Mateo, etc.)
> **ElevenLabs** for narrated trailers + audio-only versions
> **Gamma** for slide-based explainer videos and the master deck

Each path is detailed below. Pick one path per video — don't try to mix three platforms for one piece.

---

## What's already shipped (the asset inventory)

### ✅ Content & strategy (100% complete)

| Asset | Status | Where |
|---|---|---|
| 60-slide Gamma deck outline | ✅ Markdown ready for paste | `authoring/05-gamma-deck-outline.md` |
| 32-page mini-camps booklet (saddle-stitch PDF) | ✅ Print-ready | `authoring/mini-camps-booklet.pdf` |
| 4 one-pager PDFs (Cool Tools, Cool Schools, The Rules, Build It in 60) | ✅ | `docs/downloads/` |
| 7-Point Pledge handouts (EN + ES) | ✅ | `authoring/06-pledge-and-two-futures.md` + `10-pledge-spanish.md` |
| Webapp (10 pages, 16 tool pages) on GitHub Pages | ✅ Live | `docs/` → live site |
| Substack post (morning-of) | ✅ | `authoring/08-substack-morning-of.md` |
| Q&A bank (25 anticipated + 3 plant scripts) | ✅ | `authoring/09-slido-and-plant-scripts.md` |
| 5-email post-event drip sequence | ✅ | `authoring/12-drip-sequence.md` |
| 14 cinema-quality trailer frames | ✅ PNG, 1280px+ | `docs/trailer-frames/` |
| 90-second trailer SCRIPT (narration + 12-shot storyboard) | ✅ | `authoring/14-trailer-script.md` |

### ⚠️ Video & audio (scripts done, rendering not done)

| Asset | Script status | Rendered status |
|---|---|---|
| 90s "Use Case Showdown" trailer | ✅ EN script + storyboard | ❌ Need MP3 voice + MP4 cut |
| 11 mini-camp explainer videos (~1.5-2 min each) | ✅ EN + ES scripts now ready | ❌ Need rendered MP4s |
| 4 breakout intro videos (90s each) | ✅ EN + ES scripts now ready | ❌ Need rendered MP4s |
| 1 centerpiece plenary trailer (3 min) | ✅ EN + ES script now ready | ❌ Need rendered MP4 |
| Master deck (60 slides) — actual Gamma deck | ❌ Outline only | ❌ Need someone to paste & generate |

**Total to produce: 17 videos** (11 mini-camp + 4 breakout + 1 centerpiece + 1 trailer) plus 1 Gamma deck.

---

## The 3 platforms — when to use each

### 🎤 ElevenLabs — *for narrated voiceover only (no avatar)*

**Best for:** The Use Case Showdown trailer · audio-only versions of mini-camps · podcast cuts · audio drops for the Drive folder · TikTok/Reels narration

**Strengths:**
- Highest-quality emotional voice (Aria, Adam, Charlotte, Bill, Lily, Sarah)
- Multilingual v2 model handles English AND Mexican Spanish in the same voice (no need for separate voices per language)
- Fast — render 90 seconds in under 30 seconds
- Cheap — $5-22/mo plans cover the entire production

**Limitations:**
- Audio only — you supply the visuals (Gamma frames + a free video editor like CapCut/iMovie)

**Cost:** ~$22/mo (Starter Plan) = unlimited 30K characters/mo. The entire script library fits.

### 🎬 Synthesia — *for avatar-based explainer videos*

**Best for:** Educator-facing videos (the Sunday Rescue Camp for teachers, the District Leadership Camp for admins) where SEEING a person talk creates trust · classroom-style training · "Becca the ELA teacher" types

**Strengths:**
- 230+ pre-licensed avatars (real actor likenesses, lip-synced)
- Built-in slide editor — drop in your shot-list visuals
- One-click translation to 140+ languages including Mexican Spanish
- Renders MP4s directly — no separate editing step

**Limitations:**
- Slightly stiffer than ElevenLabs for emotional moments
- $30-90/mo plans

**Cost:** $30/mo (Starter) for 10 min/mo OR $90/mo (Creator) for 30 min/mo. **For our full 17-video library at ~25 minutes total: $90/mo for one month gets all of it done.**

**Recommended avatars for our scripts:**
| Persona | Avatar slug | Vibe |
|---|---|---|
| Maria (8th grader) | `Anna_costume1_cameraA` | Warm, young-feeling |
| Teacher / "Becca" | `Tina_costume1_cameraA` | Friendly K-12 teacher |
| SMB owner / "Marco" | `Mateo_costume1_cameraA` | Warm Latino male |
| Ken stand-in | `Mike_business` | Serious enterprise voice |
| Bob stand-in | `Tyler_outdoor` | Warm regional/peer feel |
| Community leader | `Sophia_outdoor` | Civic confidence |

### 📊 Gamma — *for slide-based decks and explainers*

**Best for:** The 60-slide master deck for the centerpiece plenary · slide-based mini-camp explainers · printable handouts · social carousels

**Strengths:**
- Paste markdown outline → 90-second deck generation
- Built-in image generation (matches our orchard/Wenatchee aesthetic)
- Export to PPTX, PDF, web link
- Free tier covers a lot

**Limitations:**
- Not video — for video, export slides as images and stitch with ElevenLabs voiceover

**Cost:** Free tier (400 credits) covers the deck. Pro at $20/mo if you need more polish.

---

## The 1-Weekend Production Plan (recommended path)

### Saturday morning — Setup (1 hour)
1. **Sign up for Synthesia Creator** ($90, one-month commit) — give it your Foundation card
2. **Sign up for ElevenLabs Starter** ($22) — same card
3. **Sign up for Gamma Pro** ($20) — same card
4. **Total budget: $132 for the month** — you can cancel all three after rendering

### Saturday afternoon — Render the centerpiece + trailer (3 hours)

**Hour 1: The 90-second Use Case Showdown trailer (ElevenLabs + CapCut)**
- Open `authoring/14-trailer-script.md`
- Generate 5 voice segments in ElevenLabs (Jessica + Adam voices)
- Open CapCut (free), drop in the 14 frames from `docs/trailer-frames/`
- Sync audio to frames
- Export MP4 → upload to YouTube + embed on webapp

**Hour 2: The Centerpiece Plenary trailer in EN (Synthesia)**
- Open `authoring/17-centerpiece-and-breakout-video-scripts.md`
- Paste the English narration into Synthesia
- Pick Avatar = `Tyler_outdoor` (Bob stand-in) for community-leader sections + `Mike_business` (Ken stand-in) for the policy sections
- Drop in shot-list visuals from the CSV
- Hit render → MP4 in 10 minutes

**Hour 3: The Centerpiece in ES (Synthesia)**
- Same Synthesia project → click "Translate to Spanish" → review the AI translation against `17-centerpiece-and-breakout-video-scripts.md` ES version
- Hit render → MP4

### Saturday evening — Render the 4 breakouts (2 hours)

For each breakout intro video (Cool Tools, Cool Schools, The Rules, Build It in 60):
- Synthesia → paste English narration → pick the matching avatar → drop visuals → render → 5 minutes
- Click "Translate to Spanish" → render Spanish version → 5 minutes
- = **10 minutes per breakout × 4 breakouts × 2 languages = 80 minutes**

### Sunday morning — Render the 11 mini-camp videos (3 hours)

For each mini-camp (1-11):
- Synthesia → paste EN narration → pick avatar based on audience → drop visuals → render → 5 min
- "Translate to Spanish" → render → 5 min
- = **10 minutes per video × 11 videos × 2 languages = 110 minutes**

### Sunday afternoon — The master deck (2 hours)

**Hour 1:** Open `authoring/05-gamma-deck-outline.md`, paste into Gamma, hit "Generate from outline," let Gamma build 60 slides.

**Hour 2:** Edit the deck — swap any AI-generated images with real ones from `docs/trailer-frames/`, fix any typos, export PDF + PPTX + shareable link.

### Sunday evening — Upload and embed (30 minutes)

1. Upload all MP4s to YouTube (one playlist: "NCW AI Camp Videos")
2. Add embed codes to the relevant pages on the webapp:
   - Centerpiece trailer → `docs/centerpiece.html` top hero
   - Breakout intros → `docs/plan.html` cards
   - Mini-camp videos → `docs/mini-camps.html` cards (one per camp)
3. Commit to the GitHub repo, PR → merge → Pages auto-deploys

**Total weekend: ~12 hours of work, ~$132 spent, 17 videos shipped in both languages.**

---

## The 3-platform export plan (script → render)

### A. For Synthesia avatar-based videos

Synthesia accepts a **structured input**: title, script, avatar choice, scenes with visual references. Our CSV files contain everything you need.

**Workflow:**
1. Open Synthesia → "Create new video"
2. Pick template = "Talking Head + Visual"
3. **Copy the narration from the EN section of the script file**
4. **For Spanish:** Create a copy of the project, paste the ES narration, OR use Synthesia's built-in translate feature (recommended — it preserves the avatar's lip-sync)
5. Paste in shot-list visuals from the CSV (one per scene)
6. Pick avatar from the recommended mapping above
7. Hit render

**Pro tip — don't translate inside Synthesia.** Their translator is decent but doesn't catch Mexican-Spanish-vs-Castilian distinctions. We already did the translation manually — use ours.

### B. For ElevenLabs voiceover

**Workflow:**
1. Open ElevenLabs → Voice Lab
2. Pick voice per the recommended mapping (Aria, Adam, etc.)
3. Paste the narration (EN or ES) — same voice ID works for both languages with the `eleven_multilingual_v2` model
4. Set stability/similarity_boost per the script (defaults work: 0.65 / 0.8 / 0.25 for narration)
5. Generate → download MP3
6. Drop into CapCut/iMovie with the matching frames from `docs/trailer-frames/`

### C. For Gamma (the master deck)

**Workflow:**
1. Open Gamma → "Generate"
2. Paste the **entire content** of `authoring/05-gamma-deck-outline.md`
3. Choose theme = "Atmosphere" or "Oasis" (warm, friendly)
4. Choose number of cards = 60
5. Hit Generate
6. Edit/replace AI images with real ones from `docs/trailer-frames/`
7. Export as PDF + Web Link

---

## The full file map (where everything lives)

```
authoring/
├── 14-trailer-script.md                          ← 90s trailer (EN)
├── 16-mini-camp-video-scripts.md                 ← 11 mini-camps (EN + ES)
├── 16-mini-camp-video-shotlist.csv               ← Gamma import-ready
├── 17-centerpiece-and-breakout-video-scripts.md  ← 5 hero videos (EN + ES)
├── 17-centerpiece-and-breakout-shotlist.csv      ← Gamma import-ready
└── 18-production-plan.md                         ← this file

docs/trailer-frames/                              ← 14 PNG frames for trailer
```

After rendering:
```
docs/videos/                                       ← create this folder
├── trailer-90s-en.mp4
├── centerpiece-3min-en.mp4
├── centerpiece-3min-es.mp4
├── cool-tools-90s-en.mp4    cool-tools-90s-es.mp4
├── cool-schools-90s-en.mp4  cool-schools-90s-es.mp4
├── the-rules-90s-en.mp4     the-rules-90s-es.mp4
├── build-it-90s-en.mp4      build-it-90s-es.mp4
├── camp-01-gifted-4th-en.mp4   camp-01-gifted-4th-es.mp4
├── camp-02-gifted-8th-en.mp4   camp-02-gifted-8th-es.mp4
├── ...
└── camp-11-local-gov-en.mp4    camp-11-local-gov-es.mp4
```

---

## What this gets you

| Before | After |
|---|---|
| Strategy document | Strategy + production-ready scripts |
| 14 trailer images | 14 trailer images + 17 finished MP4s |
| English only (mostly) | Every video in EN AND Mexican Spanish |
| Webapp on GitHub Pages | Webapp + embedded videos on every page |
| 7-Point Pledge in 2 languages | 7-Point Pledge with VIDEO ambassadors in 2 languages |

---

## What we recommend you do FIRST (if time is tight)

If you can only make ONE video this weekend:

> **Record the Centerpiece Plenary trailer in English with Synthesia (Tyler_outdoor avatar = Bob).**

Why: it's the open of the Expo, it's the highest-leverage piece, and a 3-minute Synthesia render with our finished script takes under 30 minutes. Embed it on `docs/centerpiece.html` and `docs/index.html`. Sharable on LinkedIn the day-of.

If you can make THREE videos:
1. Centerpiece trailer (EN) — Synthesia
2. Centerpiece trailer (ES) — Synthesia translate
3. 90s Use Case Showdown trailer (EN) — ElevenLabs + frames + CapCut

If you can make ALL 17:
- Follow the weekend plan above. $132 in tooling. ~12 hours.

---

## Hand-off to the Foundation

When you've rendered the videos:

1. Drop the MP4s into a new `docs/videos/` folder
2. Update the relevant HTML pages with `<video>` embeds or YouTube `<iframe>`s
3. Open a PR against `aigovops-foundation/aigovops-ncw-ai-camp`
4. PR description: "Adds 17 rendered videos in EN + ES. Closes the production gap from authoring/18-production-plan.md."
5. CODEOWNERS auto-requests Ken + Bob
6. Merge → GitHub Pages redeploys → live in 60 seconds

---

## What's still NOT in this plan (genuinely missing)

Being honest about gaps so nobody is surprised:

1. **Real photography of Ken & Bob at the Expo** — we have LinkedIn headshots and the Foundation founders photo. A professional event photographer at the Expo + 2 weeks of editing time would yield much better "in the room" footage for future Substack posts and the next year's marketing
2. **A dedicated music bed** — every video will sound generic without an Artlist or Epidemic Sound subscription ($16-20/mo). Recommend adding to the budget
3. **Live captioning during the Expo** — for accessibility and post-event YouTube uploads. Otter.ai live is ~$16/mo
4. **The Q&A coaching session with the plants** — Becca, Marco, Diana need a 30-min Zoom with Ken + Bob to rehearse their pre-staged questions before Aug 11
5. **A 12-month follow-up evaluation** — the Pledge says "we review our AI use every quarter" — we should hold ourselves to that and publish results

These are all **nice-to-haves**, not blockers. The Expo can run beautifully without any of them.

---

## The closing thought

**You have more production-ready material than most $50K educational programs ship.** What's between you and a full multimedia launch is one weekend of paste-and-render work on three SaaS tools. Total spend: $132 + ~12 hours.

Everything else — the strategy, the science, the writing, the design, the bilingual translation, the GitHub repo with branch protection, the Pages deployment, the QA report — is **done.**

The story we tell about AI in NCW will be the story we wrote — together.

Now we just need to render it.

— *Production Plan v1.0, June 21 2026*
