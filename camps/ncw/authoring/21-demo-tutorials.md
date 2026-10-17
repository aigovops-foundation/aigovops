# NCW AI Camp — 25 Good-AI / Bad-AI Demo Tutorials

*Expanded from `authoring/20-demo-scripts.md` (the 25 cards) · 5 personas × 5 tools · each card becomes a 5–8 minute step-by-step demo · For Bob & Ken · Aug 11, 2026*

Every card in doc 20 was a 60–120 second bit. This doc turns each one into a **teachable 5–8 minute demo** with the same shape: run the task the *good* way, then show the same task going wrong the *bad* way, then hand the room the one question that tells the two futures apart. It is the Two Futures handout (Maria 🟢 / Jake 🔴) applied to grown-up work, twenty-five times.

---

## The shared spine (every demo follows this clock)

| Clock | Beat | What happens |
|---|---|---|
| 0:00 | **Hook** (45s) | Name the persona, name the pain, invite the volunteer. "Kim, is this your Tuesday?" |
| 0:45 | **🟢 Good path** (3 min) | Do the task live, step by step, narrating each choice out loud. |
| 3:45 | **🔴 Bad path** (2 min) | The *same task*, run the way most people actually run it. Staged, never shipped (rules below). |
| 5:45 | **The tell** (30s) | The one question the audience can ask forever after to know which future they're in. |
| 6:15 | **Receipts + send-off** (45s) | Save the receipts into the hint-log, say the teachable moment in English, Ken says it in Spanish. |
| 7:00 | Done | Hand the volunteer their card. Next demo. |

Run short demos at 5 minutes by trimming the good path to its two best steps; run long ones at 8 by letting the volunteer drive a step. Never trim the bad path or the tell — those are the camp.

### Staging rules (the bad path is theater, not malpractice)

1. **Stage, don't ship.** The bad path is always shown at the *last reversible moment* — the drafted reply, the deleted approval node, the settings toggle — and never actually published, posted, sent, or recorded. We teach the cliff by walking to the edge, not off it.
2. **Fake data only.** Any demo that touches a person uses a synthetic one: patient "Maria Demo, DOB 01/01/1980," customer "Sample Household, 123 Orchard Ave." No real student, patient, customer, or elder data ever appears on screen.
3. **Consent is part of the show.** Any demo that records audio (Granola, Wispr Flow) opens by asking the room's consent out loud. That's not overhead — it *is* the lesson.
4. **Pre-run every bad path the night before.** Hallucinations are reliable in kind but not in detail. Know what your no-citation tab will say before you open it on stage; keep last night's screenshot as the fallback slide.
5. **Never disparage a named tool for a staged failure.** The bad path is a *configuration* — citations off, human removed, English only — not a brand. Say "a chatbot without sources," not a product name, unless the tool's own default is the problem.

### The receipts habit (ties every demo to Hint-Logs)

Every demo ends by saving three things into the demo hint-log, on screen, in about 20 seconds: **the prompt, the output, the human edit.** By demo 25 the room has watched receipts get kept twenty-five times — that repetition, not the pledge speech, is what makes pledge point 7 stick.

### The tags (say them, don't explain them)

Each tutorial carries a **Which-Yes** tag and a **Pledge point**. Yes-1: *does it work?* (citation, grounding, verification). Yes-2: *is it safe?* (human on the trigger, consent, retention). Yes-3: *does it reach everyone?* (translation, access, elders). Call the tag as you close each demo; by Block 3 the room says it with you.

---

## How to share this (placement + formats)

**Where it lives.** This doc is the durable source. The rendered experience is a new **`docs/demos.html` — "The Demo Lab"** page on the camp site, built exactly like `mini-camps.html`: a filterable card grid (filter by persona, tool, and Which-Yes) backed by `docs/assets/js/demos-data.js`, each card expanding into the timed run sheet below, with a green/red two-column layout for good path / bad path and a print stylesheet so any one tutorial prints as a two-page handout. Add `demos` to the NAV array in `assets/js/shared.js` between Mini-Camps and Tools.

**Formats, in order:**
1. **The site page** (above) — the canonical share link, EN with ES teachable moments inline.
2. **The 4×6 cards** (doc 20 spec) — front EN / back ES, three sets, QR to the demo's own anchor on demos.html.
3. **A printable booklet** — `docs/downloads/demo-tutorials.pdf`, same pipeline as `mini-camps-booklet.pdf`, for the follow-up mini-camps where there's no projector.
4. **Videos later, not now** — the mini-camp video pipeline (docs 16–18) can pick these up after the Expo; each tutorial's timed beats are already a shot list.

**What ships when.** Docs 20 + 21 land in `authoring/` first (this PR). The demos.html build is its own PR after Bob reviews the drafts, so the page renders content that's already been read once by a human. Spanish full-text expansion of the tutorial steps is a third pass — the prompts and send-offs are already bilingual from doc 20.

---

## The two tracks (full toolkit / free core-four)

Every demo runs on two tracks, and the Demo Lab page carries a toggle between them. The **full toolkit** is the fifteen-tool stage set below — maximum wow, some paid tiers. The **free track** re-runs the *same 25 scripts* on four vendors' free tiers — **ChatGPT (OpenAI), Claude (Anthropic), Gemini + NotebookLM (Google), Copilot (Microsoft)** — plus the tools already on the machine (Windows Voice Typing / Gboard dictation, Google Sites / Forms / Calendar). Same lessons, same tells, $0; every card links to the tool and its signup. The free track also earns its own teachable moment: *you don't need to buy anything to work this way.*

The swaps that matter (the rest are one-for-one substitutions with identical choreography):

| Demo | Full toolkit | Free track | What changes |
|---|---|---|---|
| 1.3 tutor | Khanmigo | ChatGPT Study Mode | Same refusal-to-answer behavior; Khanmigo stays the classroom pick (free for US teachers) |
| 1.4 / 2.5 / 4.4 decks & mockups | Gamma / Magic Patterns / Bolt | Claude Artifacts | HTML deck/variants/form as shareable artifacts; prototype-not-product framing unchanged |
| 2.1 / 4.3 meeting & visit notes | Granola | Gemini audio upload | Record on a phone, upload; 4.3's lesson sharpens — a free consumer tool has no BAA |
| 3.4 elder dictation | Wispr Flow | Built-in dictation (Win+H / Gboard) | Nothing installs; the custody question points at the OS |
| 3.5 comment portal | Lovable | Claude Artifact → Google Forms | Prototype in Artifacts, ship on Forms |
| 5.1 website | Lovable | Google Sites | The "change Sunday's hours yourself" test gets more literal |
| 5.3 reservation cap | Replit Agent | Google Calendar booking page | The calendar enforces the slot cap — same refusal, less flash |
| 2.2 / 5.4 workflows | n8n | **n8n stays** (free self-hosted) | The delete-the-approval-node moment has no core-four equivalent; Power Automate free is the fallback |
| Research lookups | Perplexity | ChatGPT Search / Copilot / Gemini Deep Research | Citations as source pills; identical click-the-citation choreography |

**Free-tier drift warning:** free tiers move — Study Mode availability, Deep Research limits, Copilot features. Staging rule 4 (pre-run every demo the night before) covers the habit; re-check the whole free track the week before Aug 11.

---

# PERSONA 1 — TEACHER · Kim, 6th grade, Cashmere

## 1.1 · Perplexity — "The grants question" · 6 min

**Tool:** [perplexity.ai](https://www.perplexity.ai) · **Which Yes:** Yes-1 (does it work?) · **Pledge:** #7 keep the receipts

**Prep:** Perplexity logged in; a second tab with a no-citation chatbot (web search off), pre-run last night; screenshot of last night's invented grant as fallback; the hint-log open in a third tab.

**0:00 — Hook.** "Kim teaches 6th grade in Cashmere. Kim — what's a grant you wished you'd had time to find last spring?" Take her real answer. "Grant-hunting is a Saturday job. Let's do it in ninety seconds."

**0:45 — 🟢 Good path.**
1. Type, out loud: *What are the top 5 STEM grants under $10K a Chelan County middle-school teacher can apply for in the next 90 days, with deadlines and eligibility?*
2. When the answer streams in, don't read it — **point at the citation numbers.** "See the little numbers? Those are doors."
3. Click one citation live. Land on the funder's real page. Find the deadline on that page and match it against the answer.
4. Ask the follow-up: *Which of these accept applications from individual teachers rather than districts?* Show that refinement is a conversation, not a new search.
5. Hand the mouse to Kim for one click on a second citation. Her click, her verification.

**3:45 — 🔴 Bad path.**
1. Switch tabs to the no-citation chatbot. Same question, word for word.
2. Five grants come back, confident and clean. Read one out: "the Chelan Rural STEM Initiative — $7,500, rolling deadline." Sounds perfect.
3. New tab, search that name. Nothing. It doesn't exist. "Kim just spent her Saturday chasing a grant an AI dreamed for her."
4. Point at the two answers side by side: "Same question. Same confidence. One has doors, one has walls painted like doors."

**5:45 — The tell.** *Ask any AI answer: "show me where you got that." If there's nothing to click, there's nothing there.*

**6:15 — Receipts + send-off.** Save prompt, answer, and Kim's verified citation to the hint-log. **EN:** *No citation, no click. If the AI can't show you where it got it, it didn't get it.* **ES:** *Sin cita, no hay clic. Si la IA no te muestra de dónde lo sacó, no lo sacó de ningún lado.*

## 1.2 · NotebookLM — "The AUP podcast" · 7 min

**Tool:** [notebooklm.google.com](https://notebooklm.google.com) · **Which Yes:** Yes-1 (grounding) · **Pledge:** #5 disclose always

**Prep:** A NotebookLM notebook loaded that morning with three sources: the district AUP (public doc), the WA OSPI AI guidance, one board memo. Audio Overview pre-generated (it takes minutes — never generate live). A chatbot tab pre-run with "summarize a typical district AI acceptable-use policy," no files attached.

**0:00 — Hook.** "Kim's AUP is 40 pages. Nobody — not Kim, not the parents, honestly maybe not the board — has read all 40. This morning I gave those 40 pages to an AI that is only allowed to talk about what it read."

**0:45 — 🟢 Good path.**
1. Show the three sources in the left rail first. "This is the whole world this AI knows. Three documents. That's the point."
2. Play 45 seconds of the pre-generated Audio Overview — pick the stretch where the hosts cite the AUP directly.
3. Pause it. Ask the notebook a live question: *What does the AUP say about students using AI on homework?* Show the answer arrive **with page-numbered source chips.**
4. Click a chip. The actual paragraph of the actual AUP highlights. "Claim, page, paragraph. That's grounding."
5. Ask one question the sources *can't* answer — *Does the district allow AI grading?* — and show it say the sources don't cover it. "It knows what it doesn't know. Remember that."

**4:15 — 🔴 Bad path.**
1. Switch to the chatbot tab: same summary request, **no files.** It produces a smooth, confident policy summary.
2. Highlight the line it invented — a "parent opt-in requirement." "That's not in Kim's AUP. It's in the AI's idea of a *typical* AUP."
3. "Kim emails that to 30 families Monday. At the next PTA she's not explaining the policy — she's retracting one."

**6:00 — The tell.** *Ask the AI: "which of MY documents says that, and on what page?" Grounded tools answer. Guessing tools change the subject.*

**6:45 — Receipts + send-off.** Save the question, the chip-cited answer, and the podcast link. **EN:** *Ground it or lose it. AI that reads your documents beats AI that guesses at them.* **ES:** *O lo anclas en tus documentos, o lo pierdes. Una IA que lee tus documentos le gana a una IA que los adivina.*

## 1.3 · Khanmigo — "The Socratic tutor" · 6 min

**Tool:** [khanacademy.org/khan-labs](https://www.khanacademy.org/khan-labs) · **Which Yes:** Yes-2 (protects the kid) · **Pledge:** #4 protect critical thinking

**Prep:** Khanmigo open in a student-view session; a general chatbot in a second tab. Two Futures handout within reach — this demo is Maria-and-Jake made live.

**0:00 — Hook.** "Kim's student Maria is stuck on 3/4 + 5/6. Two AIs are about to help her. Watch what *help* means to each of them."

**0:45 — 🟢 Good path.**
1. In Khanmigo, ask directly for the answer: *What is 3/4 + 5/6?* Let the room watch it **decline** and ask Maria what a common denominator is.
2. Roleplay Maria wrong on purpose: answer *7*. Watch it correct course gently instead of just handing over the result.
3. Answer *12* next. Let it walk the equivalent-fractions step: 9/12 + 10/12.
4. Arrive at 19/12 — typed by "Maria," not by the machine. "Every keystroke of that answer was hers."
5. Point at the confidence, not the math: "Next week she can do 2/3 + 1/4 alone. That's the product."

**3:45 — 🔴 Bad path.**
1. Second tab: *What is 3/4 + 5/6?* → *19/12*, instantly, one line.
2. "Same answer. Faster. And Maria learned exactly nothing. Next week, 2/3 + 1/4 is a brick wall."
3. Tie to the handout: "The MIT study on the Two Futures sheet — four weeks of this and Jake's ability to spot fake news dropped 15%. The cheat sheet doesn't just skip the learning. It *unlearns*."

**5:45 — The tell.** *Watch what the AI does when a kid asks for the answer. The tutor asks a question back. The cheat sheet just answers.*

**6:15 — Receipts + send-off.** Save both transcripts side by side — they're the best parent-night slide Kim will ever have. **EN:** *The tutor asks. The cheat sheet tells. Pick the one that grows the kid.* **ES:** *El tutor pregunta. La copia dicta. Elige la que haga crecer al niño.*

## 1.4 · Gamma — "Parent night in 90 seconds" · 5 min

**Tool:** [gamma.app](https://gamma.app) · **Which Yes:** Yes-2 (human judgment stays) · **Pledge:** #1 partner, not replacement

**Prep:** Gamma logged in. A deliberately awful "before" slide: the 11pm bulleted Word doc, unreadable from the back row. Pre-run the generation once so you know its two weak slides.

**0:00 — Hook.** Show the Word doc first. "This is parent night at 11pm on a Wednesday. It isn't a skill problem. It's an exhaustion problem."

**0:45 — 🟢 Good path.**
1. Type the prompt out loud: *Make a 6-slide parent-night deck for a 6th-grade class on how we're using AI this year — one slide per topic: what we use, what we don't, how we protect student data, how kids show their work, how parents can help, how to reach me.*
2. While it builds (~40s), narrate what Kim is *not* doing: not fighting fonts, not resizing boxes, not googling clip art.
3. When it lands, **do not present it. Edit it.** Find the slide where Gamma guessed wrong about Kim's classroom — fix that line on stage.
4. Say the division of labor plainly: "Gamma made it *look* right. Kim made it *be* right. Forty seconds of machine, two minutes of judgment."

**3:45 — 🔴 Bad path.**
1. Scroll back to the generated deck, un-edited. Point at the guessed line you just fixed. "Now imagine Kim presents *this* version, verbatim, to 30 parents — and a parent asks about the line the AI guessed."
2. "The bad path isn't the ugly Word doc. It's the beautiful deck nobody edited. Polish without judgment is just confident wrongness in 24-point font."

**4:45 — The tell.** *Ask the presenter: "which slide did you change?" If the answer is "none," the AI presented and the human watched.*

**5:15 — Receipts + send-off.** Save prompt, first draft, and Kim's edit — the diff *is* the disclosure. **EN:** *AI does the painful part. Kim does the judgment part. That's the deal.* **ES:** *La IA hace la parte dolorosa. Kim hace la parte del criterio. Ese es el trato.*

## 1.5 · Claude — "The AUP for a 5th grader" · 6 min

**Tool:** [claude.ai](https://claude.ai) · **Which Yes:** Yes-3 (reaches every family) · **Pledge:** #2 expand opportunity

**Prep:** The 42-page AUP as a file; Claude logged in. Count the AUP's actual rules the night before — you need the number (say it's 12) for the verification step.

**0:00 — Hook.** Put page 17 of the AUP on screen — dense legal English. "Every family in Kim's class agreed to this. Raise your hand if you'd read past page two." No hands. "A rule nobody reads protects nobody."

**0:45 — 🟢 Good path.**
1. Paste/attach and type: *Rewrite this AUP as a one-page letter a 5th grader can read out loud to their family at dinner. Keep every real rule. Cut every acronym.*
2. Read the opening two sentences of the letter aloud in your best 5th-grade voice. Let it land.
3. **Verify the compression:** *List every rule from the original that appears in this letter, and every rule you dropped.* This is the step everyone skips — do it slowly.
4. If it dropped one (pre-run tells you), make it restore the rule and show the fixed letter. "Compression is allowed to shrink words. It is not allowed to shrink rules."
5. Ask for the same letter in Spanish. Twenty seconds. "Half of Kim's families just got included for free."

**4:15 — 🔴 Bad path.**
1. Back to page 17. "The bad path is no path — nobody translates, families sign what they can't read, and six months later a kid breaks a rule no one at home knew existed. The parents don't blame the kid. They blame the school."
2. The AI-flavored bad path: accepting the pretty one-pager *without* step 3. "A friendly letter missing rule #9 is worse than the legalese — it's wrong *and* trusted."

**5:45 — The tell.** *Ask: "what got dropped?" Any honest summarizer can answer. If nobody asked, nobody knows.*

**6:15 — Receipts + send-off.** Save the original page count, the letter, and the rule-by-rule check. **EN:** *A rule nobody can read is a rule nobody follows. Translation IS enforcement.* **ES:** *Una regla que nadie puede leer es una regla que nadie sigue. La traducción ES el cumplimiento.*

---

# PERSONA 2 — UTILITY DISTRICT · Dave, operations, Chelan PUD

## 2.1 · Granola — "The commission meeting notes" · 7 min

**Tool:** [granola.ai](https://granola.ai) · **Which Yes:** Yes-2 (retention before transcription) · **Pledge:** #7 keep the receipts

**Prep:** Granola installed and tested on the demo laptop; a 90-second scripted "commission meeting" roleplay with Ken (two agenda items, one action item with an owner and a date); a slide showing a consumer transcription app's retention clause, highlighted.

**0:00 — Hook.** "Dave runs ops at Chelan PUD. Tuesday is commission day. Dave takes bad notes, and Saturday he reconstructs the meeting from memory. Also — before we demo anything that listens: this room okay with us recording ninety seconds of a fake meeting? Say no and we use yesterday's transcript." **Wait for the yes.** "That pause you just watched? That's the whole lesson, and we haven't started."

**1:00 — 🟢 Good path.**
1. Turn Granola on, on screen, so the room sees the recording indicator.
2. Run the 90-second roleplay with Ken: one budget item, one outage review, one action item ("Ken owns the vegetation report, due Friday").
3. Stop. Show what Granola hands back: clean minutes, the action item extracted **with owner and date.**
4. Point at where the audio lives and the retention setting. "Dave knows where this recording is, how long it lives, and who can pull it. Write those three answers down *before* you turn any recorder on."
5. "Minutes at meeting-end, not Saturday. Commissioners can cite the record Tuesday afternoon."

**4:15 — 🔴 Bad path.**
1. Put up the consumer-app retention slide. "Different tool, same meeting. Full audio, uploaded, retained indefinitely, terms nobody read."
2. "Six months later a public-records request pulls the *audio* — including the off-hand thing Dave said about a customer while the projector warmed up. That's front-page news, and it was legal to request."
3. "Public agencies don't have private mumbles. The transcript's home matters more than its quality."

**6:00 — The tell.** *Before any recording tool: "where does the audio live, how long, and who can request it?" No answer, no record button.*

**6:30 — Receipts + send-off.** Save the minutes and the retention-settings screenshot — the receipt about receipts. **EN:** *Where the transcript lives matters more than that it exists. Public agencies need retention rules before they need better notes.* **ES:** *Dónde vive la transcripción importa más que el hecho de que exista. Las agencias públicas necesitan reglas de retención antes de necesitar mejores notas.*

## 2.2 · n8n — "The outage workflow" · 8 min

**Tool:** [n8n.io](https://n8n.io) · **Which Yes:** Yes-2 (human on the trigger) · **Pledge:** #1 partner, not replacement

**Prep:** The 5-node workflow pre-built and tested: simulated SCADA alert → Gemini classifies severity → drafts customer notice EN+ES → **human approval node** → posts to a demo outage page. A test trigger button. Know how to delete and undo-delete the approval node cleanly.

**0:00 — Hook.** "Substation trips. Dave gets a text, a page, an email, then makes three phone calls — while a thousand customers refresh a blank outage map. Let's give Dave a machine for the first five minutes."

**0:45 — 🟢 Good path.**
1. Walk the workflow left to right on screen, one node at a time. Stop hard on node four: "That node is a person. Remember it."
2. Fire the simulated SCADA alert live.
3. Show the AI's classification and the drafted notice — English and Spanish, side by side.
4. Show the approval step arrive on "Dave's" phone. Read the draft *as Dave would*, catch that it's fine, tap approve.
5. The demo outage page updates, both languages. "Forty-five seconds from alert to informed customers. Dave touched it once — at exactly the right spot."

**4:30 — 🔴 Bad path.**
1. **Delete the approval node.** Let the room watch the wire close the gap — AI straight to publish. Do not run it.
2. Narrate the real failure: "A planned test trips the sensor. The AI, doing its statistical best, guesses 'wildlife contact.' The workflow posts it. The PUD has now told the public something false, at scale, in two official languages, with nobody to stop it — because the stopper got optimized away."
3. Undo. Put the human back. "One node is the difference between the two futures."

**6:45 — The tell.** *Look at any automation and ask: "show me the node where a person says yes." If you can't point at it, you're the wildlife-contact tweet waiting to happen.*

**7:15 — Receipts + send-off.** Save the workflow diagram — with the approval node circled — and the approved notice. **EN:** *Automation without a human checkpoint scales your mistakes as fast as your wins. Put a person on the "publish" button.* **ES:** *La automatización sin un punto de control humano escala tus errores tan rápido como tus aciertos. Pon una persona en el botón de "publicar."*

## 2.3 · Perplexity — "The compliance question" · 6 min

**Tool:** [perplexity.ai](https://www.perplexity.ai) · **Which Yes:** Yes-1 (cite the section) · **Pledge:** #7 keep the receipts

**Prep:** Perplexity tab; no-citation chatbot tab pre-run with the same WAC question (know what it paraphrases wrong); apps.leg.wa.gov bookmarked.

**0:00 — Hook.** "Dave has a compliance question that decides whether a family keeps its lights on: what must a PUD disclose before disconnecting for non-payment? Getting this wrong isn't embarrassing — it's actionable."

**0:45 — 🟢 Good path.**
1. Type: *What does WAC 480-100 require a Washington PUD to disclose to a residential customer before a disconnect for non-payment? Cite the WAC section.*
2. The answer names the section. **Don't trust it yet.** Open apps.leg.wa.gov and pull the actual section, live.
3. Read one requirement from the official page, then find the same requirement in the AI answer. Match them out loud.
4. "Twenty seconds to a starting point, one click to verification. The AI found the door; the state's own website is the door."

**3:45 — 🔴 Bad path.**
1. Second tab: same question, no citations. A confident paragraph arrives.
2. Point at the poisoned detail (pre-run tells you — typically a California-flavored notice period). "That's another state's rule wearing a Washington costume."
3. "Dave pastes that into a disconnect letter. The customer's attorney reads WAC 480-100 for a living. That's the whole case."

**5:30 — The tell.** *In regulated work the question is never "is this right?" — it's "what section says so?" No section number, no send.*

**6:00 — Receipts + send-off.** Save the prompt, the answer, and the leg.wa.gov URL you verified against. **EN:** *Regulated industries can't paraphrase. Cite the section or don't send the letter.* **ES:** *Las industrias reguladas no pueden parafrasear. O citas la sección, o no mandas la carta.*

## 2.4 · Claude — "The 5-sentence disconnect policy" · 6 min

**Tool:** [claude.ai](https://claude.ai) · **Which Yes:** Yes-1 (nothing legal got lost) · **Pledge:** #3 govern like we engineer

**Prep:** The 6-page disconnect policy file; count its legal requirements the night before (you need the number). Claude logged in.

**0:00 — Hook.** "Dave's disconnect policy is six pages. It's correct, it's complete, and it's never once been read in a truck at 6am in the rain. The field runs on what fits on a dashboard."

**0:45 — 🟢 Good path.**
1. Paste and type: *Turn this into a 5-sentence field card a lineworker can read in the truck. Keep every legal requirement. Lose every adverb.*
2. Read the five sentences aloud, at truck speed. It works.
3. **The audit step:** *Table every legal requirement in the original against the sentence that carries it. Flag any requirement with no sentence.*
4. Walk the table. If a requirement is orphaned (pre-run tells you), make it revise until the table is clean. "Five sentences, zero dropped duties — *proven*, not vibed."
5. "This card goes to legal for sign-off with the audit table stapled to it. Legal signs in a day because you did their trace work for them."

**4:15 — 🔴 Bad path.**
1. "Bad path one is the six pages staying six pages: two years on, a wrongful disconnect hits the paper, and discovery finds the crew 'never saw' the current version. Truthfully."
2. "Bad path two is the five sentences *without* the audit table — a beautiful card silently missing the medical-hold rule. Now the compression itself caused the wrongful disconnect."

**5:30 — The tell.** *For any AI-shortened policy, ask for the mapping table: original requirement → surviving sentence. No table, no card.*

**6:00 — Receipts + send-off.** Save the original, the card, and the audit table. **EN:** *Compression is a safety control. If it doesn't fit on the dashboard, it doesn't get followed.* **ES:** *La compresión es un control de seguridad. Si no cabe en el tablero, no se cumple.*

## 2.5 · Magic Patterns — "The outage map redesign" · 5 min

**Tool:** [magicpatterns.com](https://magicpatterns.com) · **Which Yes:** Yes-2 (prototypes inform, humans decide) · **Pledge:** #1 partner, not replacement

**Prep:** Magic Patterns logged in; a screenshot of the actual 2014-era outage map (or a stand-in); pre-run the generation once for timing.

**0:00 — Hook.** Show the 2014 map. "This is what a Chelan County family sees at 11pm when the power's out and the baby monitor is dead. It hasn't changed since flip phones. Redesigns die in committee because everyone argues about words."

**0:45 — 🟢 Good path.**
1. Type: *Design a mobile-first outage map for a rural utility with Spanish toggle, ETA, and a "text me when restored" button. Three variants.*
2. While it generates, name the three requirements and why each is on the card: Spanish toggle (half the county), ETA (the only question anyone has), text-me (so they stop refreshing).
3. Click through all three variants. **Click the actual buttons** — these are clickable mockups, not pictures.
4. "Dave screenshots these three into Tuesday's commission packet. The commissioners argue about *which real thing*, not *whose imaginary thing*. That's a different meeting."

**3:30 — 🔴 Bad path.**
1. "The alternative is the one every public agency knows: a $60K engagement, six months, and a PDF of *concepts*. Ratepayers bought slides about a map instead of a map."
2. "And the AI-flavored trap: shipping variant two straight to production because it's pretty — without the field test, without the Spanish review, without asking one actual customer. A mockup is an argument-starter, not a deliverable."

**4:30 — The tell.** *A prototype earns a conversation, never a deploy. Ask: "who decided, after seeing it?" If the answer is "nobody — it just shipped," the tool made the call.*

**5:00 — Receipts + send-off.** Save the prompt and all three variant links — dissent between variants is data. **EN:** *Prototypes are cheaper than opinions. Ship a mockup on Tuesday, argue Wednesday.* **ES:** *Los prototipos son más baratos que las opiniones. Publica un mockup el martes, discute el miércoles.*

---

# PERSONA 3 — TRIBAL COUNCIL · Councilwoman Rita

*Extra staging rule for this persona: nothing sacred, nothing real. No actual tribal-language audio, no real cultural documents, no real legal filings on screen. Every demo here uses public documents and scripted roleplay in English. Say that out loud at the top of the block — the restraint is itself the data-sovereignty lesson.*

## 3.1 · Perplexity — "The treaty rights question" · 7 min

**Tool:** [perplexity.ai](https://www.perplexity.ai) · **Which Yes:** Yes-1 (verify every source) · **Pledge:** #7 keep the receipts

**Prep:** Perplexity tab; no-citation chatbot pre-run on the same question (know the fake case it produces); courtlistener.com or scholar.google.com bookmarked for the live disproof.

**0:00 — Hook.** "Councilwoman Rita fields the same question every year, and every year it costs her legal team a week. For a sovereign nation, the stakes of a wrong answer aren't embarrassment — they're precedent."

**0:45 — 🟢 Good path.**
1. Type: *What are the current legal citations for Colville-reserved fishing and hunting rights under the 1891 agreement, and what recent court decisions from 2023–2026 affect them? Cite each source.*
2. Real cases, real dates, real links. Click one citation into the actual decision.
3. Read the case name and docket number off the *court's* page, not the AI's. "The AI is the index. The court record is the source. Never confuse the index for the book."
4. "Rita's legal team now verifies in an hour what took a week to assemble. The AI didn't answer the question — it fetched the materials. The attorney still answers the question."

**4:00 — 🔴 Bad path.**
1. The no-citation tab: same question. Out comes a confident summary citing *United States v. Colville* (pre-run confirms your model's favorite phantom).
2. Search that case live on CourtListener. **Nothing.** Let the empty results page sit on screen a beat.
3. "Rita cites that case in a public comment to the state. Someone checks. The tribe's credibility — the thing sovereignty runs on — takes the hit. A fake citation isn't a bug here. It's a treaty-risk event."

**6:00 — The tell.** *Every legal citation gets looked up in the court's own record before it's spoken aloud. The AI's confidence is not a citation.*

**6:30 — Receipts + send-off.** Save prompt, answer, and the verified docket links. **EN:** *For sovereign nations, a fake citation isn't a bug — it's a treaty violation risk. Verify every source.* **ES:** *Para naciones soberanas, una cita falsa no es un error — es un riesgo de violación de tratado. Verifica cada fuente.*

## 3.2 · NotebookLM — "The equity briefing" · 6 min

**Tool:** [notebooklm.google.com](https://notebooklm.google.com) · **Which Yes:** Yes-1 (knows what it read) · **Pledge:** #6 triangulate hard questions

**Prep:** Notebook pre-loaded with public documents only: three federal AI-equity memos and the NCW pledge, plus a *public* language-preservation framework standing in for the tribe's plan. A chatbot tab where you pasted the same docs but one silently exceeded the paste limit.

**0:00 — Hook.** "Rita needs to know where federal AI guidance supports the tribe's language-preservation work and where it falls short — before the comment deadline. The question isn't whether an AI can compare documents. It's whether it will admit which documents it actually read."

**0:45 — 🟢 Good path.**
1. Show the source rail: every document listed, none hidden.
2. Ask: *Where does the federal guidance align with the language-preservation plan, and where does it fall short? Cite pages.*
3. Walk the gap analysis — click two page-chips, one alignment, one gap.
4. Ask the accountability question: *List each source you used and how many pages of each you read.* It answers, exactly. "That's a tool that can testify."

**3:45 — 🔴 Bad path.**
1. The chatbot tab: same ask, pasted docs. It "summarizes" all of them — including the one the paste limit silently cut. Show its fluent comparison of a document it never received.
2. Ask *it* the accountability question. Watch it hedge, or worse, claim it read everything.
3. "Council makes a decision against a document the AI never saw — and nobody can even reconstruct that it happened. Silent omission is the most dangerous failure in this whole camp, because it leaves no error message."

**5:15 — The tell.** *Ask any document AI: "list what you read, and what you didn't." An honest tool has an exact answer. A guessing tool has a vibe.*

**5:45 — Receipts + send-off.** Save the source list screenshot with the analysis — the receipt that proves the inputs. **EN:** *If the AI won't tell you what it did and didn't read, it didn't read.* **ES:** *Si la IA no te dice qué leyó y qué no, no leyó nada.*

## 3.3 · Gemini Deep Think + Model Council — "The disagreement is the data" · 7 min

**Tool:** [gemini.google.com](https://gemini.google.com) + [claude.ai](https://claude.ai) · **Which Yes:** Yes-1 by redundancy · **Pledge:** #6 triangulate hard questions

**Prep:** Gemini Deep Think and Claude in adjacent tabs, both pre-run on the question so you know where they diverge; a split-screen arrangement you've rehearsed.

**0:00 — Hook.** "Every demo so far had a verifiable answer — a page, a statute, a docket. This question doesn't: *should a tribal government use a US-hosted commercial LLM for internal sovereignty deliberations?* No citation settles that. So the method changes."

**0:45 — 🟢 Good path.**
1. Put the same question to both models, live, split screen: *Should a tribal government use a US-hosted commercial LLM for internal deliberations about sovereignty issues? What are the tradeoffs?*
2. While they generate, tell the room what to watch for: not the answers — the *deltas*.
3. Read one point where they agree ("data residency matters") and one where they genuinely diverge (one weighs jurisdiction, the other weighs capability access — pre-run tells you yours).
4. Screenshot the disagreement. "That screenshot is the briefing. Rita walks into council with both sides' best argument pre-written, and the council — the humans, the ones with the authority — adjudicates."
5. Name the pattern: "One model is an opinion with good grammar. Two models is a visible tradeoff."

**4:45 — 🔴 Bad path.**
1. Cover one half of the split screen with your hand. "Here's the bad path — it's just *this*. One tab. One answer. Treated as truth."
2. "Council makes a sovereignty-affecting decision inside a single vendor's worldview, and nobody in the room even knows a second worldview existed. The failure isn't a wrong answer. It's a missing argument."

**6:15 — The tell.** *For any question that matters and has no lookup: "what did the second model say?" If there was no second model, you got an opinion, not a decision input.*

**6:45 — Receipts + send-off.** Save both full answers plus the disagreement screenshot. **EN:** *One model is an opinion. Two models is a decision. When the stakes are sovereignty, always ask twice.* **ES:** *Un modelo es una opinión. Dos modelos son una decisión. Cuando lo que está en juego es la soberanía, pregunta siempre dos veces.*

## 3.4 · Wispr Flow — "The elder interview" · 6 min

**Tool:** [wisprflow.ai](https://wisprflow.ai) · **Which Yes:** Yes-2 (data sovereignty) · **Pledge:** #2 expand opportunity

**Prep:** Wispr Flow installed; a scripted 30-second dictation in English (Rita's after-interview summary); a slide of a consumer transcription tool's terms with the training-data clause highlighted. **No tribal-language audio, real or synthetic, at any point.**

**0:00 — Hook.** "Rita is documenting an elder's oral history. She's typing while he talks — eyes on a keyboard during the most important conversation of the month. The fix seems obvious: record everything. The fix is also the trap. Watch where the line is."

**0:45 — 🟢 Good path.**
1. Set the scene: laptop *closed* during the interview itself. "Step one of the workflow is no technology at all. The elder gets both eyes."
2. *After* the conversation — now, on stage — Rita dictates her summary from memory and handwritten notes: speak 30 seconds naturally into Wispr Flow.
3. Show the clean, formatted text land in the document. No typing, no transcription of the elder's own voice, nothing sacred ever left the room.
4. "Notice what got recorded: Rita's words, on Rita's machine, about the meeting. The elder's voice and language stayed with the elder. Dictation for *her* notes, not surveillance of *his* story."

**3:45 — 🔴 Bad path.**
1. Put up the terms-of-service slide. Read the highlighted clause: audio may be retained and used to improve services.
2. "Now imagine that clause attached to a live recording of an elder speaking a language fewer than a hundred people speak. Sacred knowledge, on someone else's disk, under someone else's law, feeding someone else's model. You can't un-upload it."
3. "The bad path here isn't a hallucination. It's a perfectly *accurate* transcript in the wrong custody."

**5:15 — The tell.** *Before any tool touches cultural or language data: "whose disk, whose law, whose model does this feed?" If any answer is 'not ours,' the tool waits.*

**5:45 — Receipts + send-off.** Save the dictated summary and the ToS screenshot you rejected — the receipt of a *no* is still a receipt. **EN:** *Data sovereignty is tribal sovereignty. Before the tool, read the terms — especially for language and cultural data.* **ES:** *La soberanía de datos es soberanía tribal. Antes de la herramienta, lee los términos — especialmente para datos de idioma y cultura.*

## 3.5 · Lovable — "The public comment portal" · 7 min

**Tool:** [lovable.dev](https://lovable.dev) · **Which Yes:** Yes-3 (reaches the elder) · **Pledge:** #2 expand opportunity

**Prep:** Lovable logged in; the spec written on a card so you type it fluently; a screenshot of a real English-only government form with a translate widget bolted on. Pre-run the build once — know the step where you'll pause it.

**0:00 — Hook.** "Rita needs public comment on a new ordinance — from elders who don't type, in three languages. The traditional path is a vendor, eight months, and $40K. Watch the other path, and watch what we check before we call it done."

**0:45 — 🟢 Good path.**
1. Type the spec: *Build a public comment form for a tribal ordinance: English and Spanish now, with a placeholder third-language column for the tribe's own translators; large type; and an audio-comment option — record a voice comment instead of typing. Mobile-first.*
2. While it builds, name the design decision out loud: "The tribe's language gets a *placeholder*, not a machine translation. Some translation is not the AI's to do. Knowing which is governance."
3. Click the built form. **Test the audio path first** — the elder path is the acceptance test, not an edge case.
4. Bump the font size, watch it rebuild. "Iteration measured in seconds, so 'reach the elder' is cheap to get right."
5. "Live before this block ends. Council collects comments this week — and the tribe's translators fill the third column on their own authority."

**4:45 — 🔴 Bad path.**
1. The screenshot: English-only form, Google-Translate widget on top. "Eight months, $40K, and the audio option didn't survive scoping. Elders don't use it. Nobody comments."
2. "And then the quiet failure after: council calls the empty inbox 'community engagement.' A portal that doesn't reach the elder doesn't just fail — it *launders* the failure as participation."

**6:15 — The tell.** *Test any civic tool as its least-served user first. If the elder can't use it, it isn't built yet — no matter what it cost.*

**6:45 — Receipts + send-off.** Save the spec, the working URL, and the audio-path test. **EN:** *If the tool doesn't reach the elder, it isn't worth the electricity. From the pledge.* **ES:** *Si la herramienta no llega al anciano, no vale la electricidad. Del compromiso.*

---

# PERSONA 4 — HEALTHCARE · Dr. Mendez, Leavenworth clinic

*Extra staging rule for this persona: synthetic patients only — "Maria Demo, DOB 01/01/1980" is the only patient who exists today. Open the block by saying so. Demo 4.2 keeps its DEMO ONLY, NOT CLINICAL ADVICE banner on screen the entire time.*

## 4.1 · ChatGPT — "The 5-sentence front-desk policy" · 6 min

**Tool:** [chatgpt.com](https://chatgpt.com) · **Which Yes:** Yes-2 (a rule before the tools) · **Pledge:** #3 govern like we engineer

**Prep:** ChatGPT logged in; the data-controls/settings screen of a consumer chatbot ready to show (the "improve the model for everyone" toggle, on by default); the Two Futures 5-sentence policy template handy — this is its clinical twin.

**0:00 — Hook.** "Dr. Mendez's front desk already uses AI — they just never told her, because there's no policy that says how. You can't enforce a rule that doesn't exist. So the first tool we'll use AI for is the rule itself."

**0:45 — 🟢 Good path.**
1. Type: *Draft a 5-sentence AI-use policy for a small primary care clinic front desk. Cover: what patient data can and cannot go into an LLM, when to disclose AI use to a patient, and who to call if unsure. Plain English, one page, 8th-grade reading level.*
2. Read all five sentences aloud. Thirty seconds of reading — that's the point.
3. Hand-edit two lines on stage as Dr. Mendez would: put a real name in "who to call," tighten "patient data" to her clinic's actual systems. "The AI drafted. The doctor decided. The signature line is hers."
4. "Monday: every front-desk staffer reads it — because they *can* read it — and signs it. Five sentences that get followed beat fifty pages that get shelved."

**3:45 — 🔴 Bad path.**
1. Show the consumer chatbot's settings screen. Point at the training toggle, on by default.
2. Narrate, with the synthetic patient only: "No policy. A staffer pastes 'Maria Demo, appointment Tuesday, diabetes follow-up' into a free chatbot to draft a reminder — faster! Helpful! And that patient's name and condition just left the building into a tool set to learn from it. Under HIPAA, that's not a shortcut. That's a breach, and it happened because nobody wrote five sentences."
3. "The bad path isn't a bad tool. It's a good tool arriving before the rule did."

**5:30 — The tell.** *Walk into any front office and ask: "can I see the AI policy?" One page, signed, current — or the tools are governing themselves.*

**6:00 — Receipts + send-off.** Save prompt, draft, and the doctor's edits. **EN:** *A 5-sentence policy beats a 50-page policy nobody reads. Short + signed > long + shelved.* **ES:** *Una política de 5 oraciones le gana a una política de 50 páginas que nadie lee. Corta + firmada > larga + archivada.*

## 4.2 · Perplexity — "The medication interaction check" · 7 min

**Tool:** [perplexity.ai](https://www.perplexity.ai) · **Which Yes:** Yes-1 (two-source rule) · **Pledge:** #6 triangulate hard questions

**Prep:** A persistent on-screen banner: **DEMO ONLY — NOT CLINICAL ADVICE.** Perplexity tab; no-citation chatbot pre-run (know its phantom paper); doi.org bookmarked.

**0:00 — Hook.** Banner up first, and say it: "Nothing in the next seven minutes is clinical advice — we're demonstrating a *lookup method*, and the method is the lesson. Dr. Mendez needs current interaction literature between two common drugs in elderly patients. Today that's 20 minutes she doesn't have."

**1:00 — 🟢 Good path.**
1. Type: *What are the current documented interactions between apixaban and amiodarone in patients over 75, with citations to primary literature from 2023–2026?*
2. Real papers, real DOIs. Click one DOI through to the journal page. Match title, year, journal, live.
3. Say the workflow out loud: "This is a *starting point* in 20 seconds instead of 20 minutes. Before it touches a patient decision she verifies against UpToDate — the second, independent, clinical-grade source. The AI accelerates the lookup. It never becomes the decision."
4. "Two sources, one of them built for the job. That's the two-source rule, and it predates AI by a century. AI just makes source one faster."

**4:15 — 🔴 Bad path.**
1. The no-citation tab: same question. A confident answer citing a 2024 NEJM paper.
2. Look up its DOI at doi.org, live. **Not found.** Let it sit.
3. "Dr. Mendez cites that paper in a chart note. Two years later a malpractice attorney says: *produce the paper.* She can't, because it never existed. The note is now evidence — against her."

**6:00 — The tell.** *In clinical work: "what's my second source, and is it clinical-grade?" An AI answer alone is half a lookup, not a fact.*

**6:30 — Receipts + send-off.** Save prompt, answer, verified DOIs, and the note "verified against UpToDate." **EN:** *In clinical settings, AI accelerates the lookup. It never replaces the verification. Two-source rule, always.* **ES:** *En entornos clínicos, la IA acelera la búsqueda. Nunca reemplaza la verificación. Regla de dos fuentes, siempre.*

## 4.3 · Granola — "The visit note draft" · 6 min

**Tool:** [granola.ai](https://granola.ai) · **Which Yes:** Yes-2 (consent + BAA first) · **Pledge:** #5 disclose always

**Prep:** A scripted 90-second mock visit with Ken as the (synthetic) patient; a mock sign-in form with the ambient-scribe consent line highlighted; Granola tested. Ask the room's recording consent again — yes, again.

**0:00 — Hook.** "Dr. Mendez sees 22 patients a day and charts until 9pm. Ambient scribes give doctors their evenings back — and they're also the fastest way to an OCR complaint if you skip two pieces of paper. Watch for both papers."

**0:45 — 🟢 Good path.**
1. Show paper one **before any audio**: the sign-in form, consent line highlighted. "The patient said yes, in writing, before the microphone knew the visit existed."
2. Name paper two: the BAA — the Business Associate Agreement between clinic and vendor. "No BAA, no tool. It's the contract that makes the vendor legally answerable for patient data."
3. Run the 90-second mock visit with Ken. Stop.
4. Show the draft SOAP note. Then **edit it as the doctor**: fix one detail the AI got almost-right. "Draft is the machine's. Signature is the physician's. She edits, she signs, she's home at six."

**4:00 — 🔴 Bad path.**
1. "Same tool, same visit — minus the two papers. No consent line, no BAA. The patient finds out afterward that a machine was listening."
2. "One OCR complaint later, the clinic is explaining to HHS why it had no consent and no contract. The tool worked perfectly the whole time. The *paperwork* was the safety system, and it wasn't there."

**5:15 — The tell.** *For any listening tool in a clinic: "show me the consent line and the BAA." Two pieces of paper, or no microphone.*

**5:45 — Receipts + send-off.** Save the consent form image, the draft, and the doctor's edited final. **EN:** *Consent + BAA are non-negotiable in healthcare. The tool is only as safe as the paperwork behind it.* **ES:** *El consentimiento + el BAA son innegociables en salud. La herramienta es tan segura como el papeleo que la respalda.*

## 4.4 · Bolt — "The Spanish patient intake form" · 7 min

**Tool:** [bolt.new](https://bolt.new) · **Which Yes:** Yes-3 (both languages from one spec) · **Pledge:** #2 expand opportunity

**Prep:** Bolt logged in; spec on a card; a side-by-side slide of an English form and its translate-widget Spanish rendering with the medication-frequency field mangled. Pre-run the build.

**0:00 — Hook.** "Half of Dr. Mendez's patients are Spanish-first. The clinic's Spanish intake form is paper, and four versions out of date. When an intake form drops a medication field, that's not a UX bug — that's a dosing error wearing a UX costume."

**0:45 — 🟢 Good path.**
1. Type: *Build a bilingual patient intake form, English + Spanish, mobile-friendly, that emails a PDF to the clinic. Include allergies, meds, and a plain-language HIPAA notice.*
2. While it builds, land the design principle: "One spec, two languages, born together. Spanish isn't a coat of paint on the English form — it's load-bearing."
3. Open the built form on the phone view. **Fill it in Spanish first** — the room's Spanish speakers are your reviewers, invite one to read the meds section aloud.
4. Check the field-parity: allergies, meds, *frequency* — present in both languages. Submit; show the PDF arrive.
5. "Spanish-first patients fill this out at home. The front desk stops re-typing paper. Two failure modes deleted in two minutes."

**4:45 — 🔴 Bad path.**
1. The slide: English form + translate widget. Point at the Spanish rendering where the frequency field lost its meaning.
2. "A patient writes 'once a day' where the mangled form seemed to ask. QA logs the resulting dosing error as *patient miscommunication.* No — the patient communicated fine. The form couldn't listen."
3. "Widget translation fails silently, and silent failures in healthcare get filed under the patient's name instead of the tool's."

**6:15 — The tell.** *Open the Spanish version and count the medical fields against the English one. Any missing field is a patient-safety finding, not a translation note.*

**6:45 — Receipts + send-off.** Save the spec, both language screenshots, and the field-parity check. **EN:** *Translation is a safety feature, not a marketing feature. Build both versions from the same spec, not with a plug-in on top.* **ES:** *La traducción es una función de seguridad, no de marketing. Construye ambas versiones desde la misma especificación, no con un plug-in encima.*

## 4.5 · ChatPRD — "The AI-vendor questionnaire" · 6 min

**Tool:** [chatprd.ai](https://www.chatprd.ai) · **Which Yes:** Yes-2 (procurement is governance) · **Pledge:** #3 govern like we engineer

**Prep:** ChatPRD logged in; a mocked-up "vendor response" sheet where two of three vendors left half the questions blank (make it obviously fictional — "Vendor A / B / C").

**0:00 — Hook.** "Three ambient-scribe vendors are pitching Dr. Mendez this month. All three demos will be flawless — vendor demos always are. The clinic's protection isn't in watching *their* demo. It's in making them answer *her* questions."

**0:45 — 🟢 Good path.**
1. Type: *Draft a 12-question vendor questionnaire for a small clinic evaluating ambient-scribe AI. Cover BAA, training data usage, retention, audit logs, uptime, price, red-team results, and off-boarding.*
2. Read three of the twelve aloud — pick BAA, training-data usage, and off-boarding. On off-boarding: "Nobody asks how a contract *ends* until they're trapped inside one."
3. Add the doctor's own 13th question on stage: *Can I export every note if we leave?* "The AI drafted twelve. Her thirteenth is the one only she could know to ask."
4. "Print. Hand to all three vendors. Same questions, same order, answers in writing."

**3:45 — 🔴 Bad path.**
1. Show the fictional response sheet: Vendor A answered everything; B and C went quiet on training data and retention.
2. "Silence *is* the answer. The vendor who won't say what happens to your patients' data is telling you what happens to your patients' data."
3. "The bad path is picking by sales-rep charm and month-one price — and learning from a news article, a year later, that your patients' visits trained the vendor's next model."

**5:30 — The tell.** *Score vendors by what they refuse to answer. The blank cells are the evaluation.*

**6:00 — Receipts + send-off.** Save the questionnaire and (in real life) every vendor's written answers — those receipts outlive the salesperson. **EN:** *The vendor who won't answer your questionnaire is the vendor whose contract you don't sign. AI procurement IS AI governance.* **ES:** *El proveedor que no contesta tu cuestionario es el proveedor cuyo contrato no firmas. La adquisición de IA ES gobernanza de IA.*

---

# PERSONA 5 — SMALL BUSINESS · Marisol (taquería) & Tom (cider orchard)

## 5.1 · Lovable — "The Sunday hours website" · 6 min

**Tool:** [lovable.dev](https://lovable.dev) · **Which Yes:** Yes-3 (bilingual + ownable) · **Pledge:** #2 expand opportunity

**Prep:** Lovable logged in; a screenshot of a 2019-era Facebook business page with wrong hours; a QR code generator ready; pre-run the build.

**0:00 — Hook.** The Facebook screenshot. "This is Marisol's web presence. The hours are wrong, and she can't fix them because the nephew who set it up moved to Spokane. Every wrong-hours Google result is a customer standing at a locked door."

**0:45 — 🟢 Good path.**
1. Type: *Build a 1-page website for Marisol's Taquería: hours, menu, phone, Google Maps embed, order-ahead button, mobile-first, English + Spanish.*
2. While it builds: "Watch what matters — not that it's fast. That it's *hers*."
3. Open the live site on the phone view. Toggle to Spanish. Check the hours block.
4. **The ownership test, live:** change Sunday's hours in the editor and republish. Seconds. "That edit is the whole product. The site she can change at 7am from her phone beats the $3,500 site she has to email someone about."
5. Point a QR code at the live URL. "That goes on the door and the menu tonight. And she stops paying $89 a month to a 'web guy' for the privilege of asking permission."

**4:15 — 🔴 Bad path.**
1. "The bad path costs *more*: $3,500 to a template shop, eight weeks, and it's beautiful — and frozen. Month three, the hours change, she can't touch it, and she's back to posting hours on Facebook while the pretty site lies."
2. "A website that's wrong about your hours is worse than no website. It's a machine for disappointing people, with your name on it."

**5:15 — The tell.** *One question for any website pitch: "show me, right now, how I change Sunday's hours myself." No answer, no contract.*

**5:45 — Receipts + send-off.** Save the prompt, the live URL, and the before/after of the hours edit. **EN:** *The site you can change yourself beats the site somebody else owns. Ownership > polish.* **ES:** *El sitio que tú puedes cambiar le gana al sitio que otro es dueño. Propiedad > pulido.*

## 5.2 · Gamma — "The investor one-pager" · 6 min

**Tool:** [gamma.app](https://gamma.app) · **Which Yes:** Yes-1 (verify the numbers) · **Pledge:** #7 keep the receipts

**Prep:** Gamma logged in; Tom's (fictional) real numbers on a card — acreage, revenue, capex ask; pre-run to know which "comparable" the draft invents or hedges.

**0:00 — Hook.** "Tom needs the bank to take his cider-orchard expansion seriously on one page. A consultant would charge $2K and take three weeks. The AI takes 40 seconds — and hides one landmine in the nicest font you've ever seen."

**0:45 — 🟢 Good path.**
1. Type: *One-page investor summary for a cider orchard expansion: current acreage, projected revenue, capex ask, 3-year P&L, comparable operations in Chelan County. Numbers I feed you, story you shape.* Then feed Tom's actual numbers.
2. The one-pager lands, tight and professional. Admire it for exactly five seconds.
3. **The audit pass, out loud:** go number by number. "His acreage — he gave it. His revenue — he gave it. The 'comparable Chelan County operation' — *where did that come from?*"
4. Highlight the comparable. "The AI shaped the story with a number nobody fed it. Tom's move: verify it or cut it. He cuts it, cites the one comparable he actually knows, and now every digit on the page is his."
5. "Monday he walks into the bank with a page where he can defend every number. That's what the banker is actually testing."

**4:15 — 🔴 Bad path.**
1. Show the unedited draft with the invented comparable still in it. "Tom prints this version."
2. "The banker — whose entire job is smelling numbers — googles the comparable at his desk, in front of Tom. It doesn't check out. The pitch doesn't die because the orchard is bad. It dies because one decorative number poisoned nine real ones."

**5:30 — The tell.** *Before any AI-drafted document leaves the building: point at each number and say where it came from. Any number without an owner gets cut.*

**6:00 — Receipts + send-off.** Save the draft, the final, and the list of what got cut and why. **EN:** *Gamma writes the pitch. YOU verify the numbers. AI is the intern, not the CFO.* **ES:** *Gamma escribe la propuesta. TÚ verificas los números. La IA es la becaria, no la directora financiera.*

## 5.3 · Replit Agent — "The reservation booker" · 7 min

**Tool:** [replit.com](https://replit.com) · **Which Yes:** Yes-1 (model the constraint) · **Pledge:** #3 govern like we engineer

**Prep:** The app pre-built by Replit Agent from the demo prompt (building live is too slow for the slot — show the prompt, then the result); an audience member's phone for the live text; the 6-tables/hour cap set.

**0:00 — Hook.** "Friday night, the taquería is slammed, and Marisol turns away 30 calls because her hands are full of tortillas. Every missed call is a table. But watch the *one sentence* in this prompt that decides whether the tool saves her Saturday or destroys it."

**0:45 — 🟢 Good path.**
1. Show the prompt: *Build me a Replit app: web form + SMS confirmation for reservations, capped at 6 tables/hour, English + Spanish, sends to Marisol's phone.* Circle **capped at 6 tables/hour**. "That's the sentence. That's her kitchen's real capacity, written down before the code existed."
2. Open the live app. Have a volunteer book a table from their phone; show the SMS confirmation arrive.
3. Book tables until the hour is full. **Attempt table 7.** The app refuses and offers the next slot. Let the refusal get its applause — the refusal is the feature.
4. "Twenty more reservations a night, zero phone calls — and it cannot promise what the kitchen can't cook, because Marisol told it the truth about her kitchen first."

**4:45 — 🔴 Bad path.**
1. "The bad path is the same app minus the cap — the free tool that takes *every* booking, because more bookings sounds like winning."
2. "Saturday 7pm: twelve parties, six tables. The double-booked families don't yell at the software. They yell at Marisol, and then they tell Yelp, and Yelp doesn't have a 'the tool did it' button. Two weeks of one-star weather over one missing sentence."

**6:15 — The tell.** *Before shipping any tool, say the real-world limit out loud — tables, staff, stock — and show me where the tool enforces it. Unmodeled constraints become public failures.*

**6:45 — Receipts + send-off.** Save the prompt with the cap circled and a screenshot of the table-7 refusal. **EN:** *"Free" without the rule you need costs more than "paid" with the rule you need. Model the constraint before you ship the tool.* **ES:** *"Gratis" sin la regla que necesitas cuesta más que "pagado" con la regla que necesitas. Modela la restricción antes de publicar la herramienta.*

## 5.4 · n8n — "The review-to-reply workflow" · 7 min

**Tool:** [n8n.io](https://n8n.io) · **Which Yes:** Yes-2 (human on the trigger) · **Pledge:** #1 partner, not replacement

**Prep:** The workflow pre-built: new Google review → Claude drafts a reply in the reviewer's language → Tom approves in Slack → post. A test 5-star review in Spanish and a scathing test 1-star review queued. **The 1-star's cheerful auto-draft is shown, never posted.**

**0:00 — Hook.** "Tom's taproom gets eight Google reviews a week. He answers none — not because he doesn't care, but because it's 9pm and he's been on his feet since noon. Unanswered reviews read as 'owner doesn't care.' Let's fix it without letting a robot speak for Tom unsupervised."

**0:45 — 🟢 Good path.**
1. Walk the workflow: review in → Claude drafts *in the reviewer's language* → **Slack DM to Tom** → only then, post.
2. Fire the 5-star Spanish test review. Show Claude's warm Spanish draft land in Slack.
3. As Tom: read it, tweak one word ("gracias" to "mil gracias — vuelve pronto"), approve. Show it post.
4. "Ten seconds of Tom per review, in line at the bank. Every reviewer gets answered in their own language, and every word still passed through the owner. 4.2 to 4.6 in ninety days — and Tom never typed a reply from scratch."

**4:15 — 🔴 Bad path.**
1. Fire the 1-star test review — the scathing one. Show the AI's drafted reply sitting in the approval queue: cheerful, generic, tone-deaf: *"So glad you loved it!"*
2. **Point at it, don't post it.** "In the good workflow, this dies right here, in the queue, with a wince and a rewrite. In the auto-post workflow, this is live. The whole town screenshots it before Tom's shift ends. The review hurt; the robot's chirpy reply to it goes *viral*."
3. "Notice the AI wasn't wrong by its own lights — it pattern-matched a nice reply. It just can't feel a room. That's Tom's job description."

**6:15 — The tell.** *Same as the outage map, same as it'll always be: "show me the node where the human says yes." Reputation tools without one are machine guns on a tripod.*

**6:45 — Receipts + send-off.** Save the workflow diagram, the caught bad draft, and Tom's rewrite — the near-miss is the best training document the next owner will ever see. **EN:** *Automation without a human on the trigger is a machine gun aimed at your reputation.* **ES:** *La automatización sin un humano en el gatillo es una ametralladora apuntándole a tu reputación.*

## 5.5 · ChatPRD — "The seasonal-hire training manual" · 6 min

**Tool:** [chatprd.ai](https://www.chatprd.ai) · **Which Yes:** Yes-1 (the signature is yours) · **Pledge:** #5 disclose always

**Prep:** ChatPRD logged in; pre-run the manual and find its shakiest "regulation-sounding" claim (there's always one — often an allergen or labor rule stated with unearned confidence).

**0:00 — Hook.** "Every apple-blossom weekend Marisol hires six seasonal staff and trains them by shouting over the fryer. A training manual would fix it. She never had time to write one — and the AI will write one in 45 seconds that is 95% excellent and 5% inspection-bait. The demo is finding the 5%."

**0:45 — 🟢 Good path.**
1. Type: *Write a 4-page onboarding manual for a taquería seasonal hire: opening checklist, POS quick-start, allergen protocol, tip policy, closing checklist. English + Spanish, bullet points, printable.*
2. Scroll the result. "Forty-five seconds. Day-one-useful instead of day-three-useful. Now the owner's pass — two kinds of edit."
3. **Edit one — make it hers:** fix the POS quick-start to her actual register's quirks. The AI wrote a generic POS; she owns a specific one.
4. **Edit two — challenge the rules:** find the allergen line that *sounds* like a regulation. Ask the AI: *Cite the exact OSHA or WA Department of Health rule for this line.* Watch it hedge or retract. Replace it with the county health district's actual guidance (or delete it).
5. "Now she signs it. And the signature is honest, because every line either came from her or got checked by her."

**4:15 — 🔴 Bad path.**
1. "The bad path: print the 45-second version verbatim. It sits in the break room looking official. During a routine visit, the health inspector reads the fake OSHA allergen rule — a regulation that doesn't exist, cited in an official-looking document with Marisol's name on it."
2. "Now the inspector wonders what *else* in her operation is confidently made up. One uncheck-ed line converted a routine visit into a flagged one."

**5:30 — The tell.** *For every rule-shaped sentence an AI writes, ask it to cite the actual regulation. Real rules have numbers. Fake rules have vibes.*

**6:00 — Receipts + send-off.** Save the draft, both edits, and the citation-challenge exchange. **EN:** *AI drafts. YOU own. The signature at the bottom is yours — so the accuracy on every line has to be yours too.* **ES:** *La IA redacta. TÚ eres dueña. La firma abajo es tuya — así que la exactitud de cada línea también tiene que ser tuya.*

---

# The Block-3 close (say it over the master grid)

Twenty-five demos, and the room has now *watched* the same three moves win twenty-five times:

1. **Citation or it didn't happen** — every good path clicked through to a source; every bad path was confident and unclickable. *(Yes-1: does it work?)*
2. **The human stays on the trigger** — every good path had a person edit, approve, or sign; every bad path deleted that node. *(Yes-2: is it safe?)*
3. **Translation is a safety feature** — every good path reached the Spanish-first neighbor, the field crew, the elder; every bad path pretended English was the whole town. *(Yes-3: does it reach everyone?)*

Those three are the three-Yes framework, and the room discovered them empirically before anyone said the word "framework." Now hand out the pledge.

---

## Coverage check (all 25, tagged)

| # | Demo | Persona | Tool | Which Yes | Pledge | Min |
|---|---|---|---|---|---|---|
| 1.1 | The grants question | Teacher | Perplexity | Yes-1 | #7 | 6 |
| 1.2 | The AUP podcast | Teacher | NotebookLM | Yes-1 | #5 | 7 |
| 1.3 | The Socratic tutor | Teacher | Khanmigo | Yes-2 | #4 | 6 |
| 1.4 | Parent night in 90 seconds | Teacher | Gamma | Yes-2 | #1 | 5 |
| 1.5 | The AUP for a 5th grader | Teacher | Claude | Yes-3 | #2 | 6 |
| 2.1 | The commission meeting notes | Utility | Granola | Yes-2 | #7 | 7 |
| 2.2 | The outage workflow | Utility | n8n | Yes-2 | #1 | 8 |
| 2.3 | The compliance question | Utility | Perplexity | Yes-1 | #7 | 6 |
| 2.4 | The 5-sentence disconnect policy | Utility | Claude | Yes-1 | #3 | 6 |
| 2.5 | The outage map redesign | Utility | Magic Patterns | Yes-2 | #1 | 5 |
| 3.1 | The treaty rights question | Tribal | Perplexity | Yes-1 | #7 | 7 |
| 3.2 | The equity briefing | Tribal | NotebookLM | Yes-1 | #6 | 6 |
| 3.3 | The disagreement is the data | Tribal | Gemini + Claude | Yes-1 | #6 | 7 |
| 3.4 | The elder interview | Tribal | Wispr Flow | Yes-2 | #2 | 6 |
| 3.5 | The public comment portal | Tribal | Lovable | Yes-3 | #2 | 7 |
| 4.1 | The 5-sentence front-desk policy | Healthcare | ChatGPT | Yes-2 | #3 | 6 |
| 4.2 | The medication interaction check | Healthcare | Perplexity | Yes-1 | #6 | 7 |
| 4.3 | The visit note draft | Healthcare | Granola | Yes-2 | #5 | 6 |
| 4.4 | The Spanish patient intake form | Healthcare | Bolt | Yes-3 | #2 | 7 |
| 4.5 | The AI-vendor questionnaire | Healthcare | ChatPRD | Yes-2 | #3 | 6 |
| 5.1 | The Sunday hours website | Small biz | Lovable | Yes-3 | #2 | 6 |
| 5.2 | The investor one-pager | Small biz | Gamma | Yes-1 | #7 | 6 |
| 5.3 | The reservation booker | Small biz | Replit | Yes-1 | #3 | 7 |
| 5.4 | The review-to-reply workflow | Small biz | n8n | Yes-2 | #1 | 7 |
| 5.5 | The seasonal-hire training manual | Small biz | ChatPRD | Yes-1 | #5 | 6 |

Total live-demo time at nominal: **~159 minutes** — which is why these run as a *menu*, not a marathon. Pick 5 (one per persona) for the plenary; the other 20 live on demos.html and in the booklet for mini-camps and follow-up events. Glean stays in reserve for the IT-director Q&A, per the doc-20 note.

---

*Demo tutorials v1 · expands authoring/20-demo-scripts.md · NCW AI Expo 2026 · AiGovOps Foundation × NCW Tech Alliance*




