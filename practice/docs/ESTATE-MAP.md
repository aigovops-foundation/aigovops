# The whole estate, mapped to the ladder

Every AiGovOps Foundation property, its part in the practitioner ladder, the gate(s) it serves, the
movement it belongs to, and what changes if PRD v3 is approved. Read alongside
[`PRD-OPEN-SOURCE-UNIFIED.md`](PRD-OPEN-SOURCE-UNIFIED.md) §2. Sources: the local clones under
`~/Downloads/_aigov` as of 11 September 2026 and the Library's `plan/strategy` documents.

**The rule:** a property that cannot name its level and its gate is folded into one that can, or
retired, in the copy sweep. Nothing on this list is new infrastructure.

| Property | Repo / surface | What it is today | Level(s) | Gate(s) served | Movement | What changes under v3 |
|---|---|---|---|---|---|---|
| **Foundation site** — the porch | `aigovops-foundation/aigovops-foundation-site-redesign-June2026-ken-and-bob` · aigovops-foundation.com | The only front door. One message, four services, one loop. Gate Check in all 22 footers and every hero. Three movements as the IA. EN + ES | 100 (the page), all (the ladder) | Pre-pend (the Gate Check page) | Get to Yes | Gate Check page gains rule box (plain words + YAML), action box, four lens tabs, download, `share`; Community page becomes the ladder + the four gates + the readiness promise; chatbot intents learn "what level am I" |
| **AiGovOps Library** (private, members) | `aigovops-library` · Fly core + CDN hub | 100 verified AI-harm cases (batch 2026-W24, 67 primary / 33 strong-secondary), each with the plain-words gate that would have caught it; #FridayFailFest daily rotation; the 10-question practitioner test; the 1/0/? gate law; runtime primitives T0 SecretsProvider, T1 gate↔secrets, T3 sandbox, T5 capability dial; T10 JCS canonicalizer next; the ledger | all (scenarios), 100 (test), 300 (broker), all (ledger) | Operate (broker); Audit (corpus verdicts) | Recover to Yes | The corpus becomes the exam bank and the scenario bank; the `gate` sentence becomes the plain-words path's input; T10 ships first; the ledger mints `practice.complete` and `practice.mark` receipts |
| **Beacon** | `aigovops-foundation/aigovops-beacon` · GitHub Pages demo · Node server + Studio | OVERT 1.0-conformant runtime signer: Ed25519, JCS, append-only log, Merkle anchoring, auditor bundle with `VERIFY.md`. Browser demo generates a key and a real bundle client-side. Profile `aigovops-beacon.v1` registration **pending Glacis sign-off since May** | 100 (page), 300 (broker/holds), 400 (verify) | Pre-pend; Operate; Audit | Get / Stay / Recover | Gains `beacon gate check`, `gate init`, `hold`, `coverage`, `verify --offline`, `share`; Python SDK (v1 F2); agent identity binding (v3 F15); README AAL/IAP line corrected; profile registered |
| **Umbrella-GovOps** | `aigovops-foundation/umbrella-govops` · `umbrella-conformance` CLI (install from source; PyPI not yet published) | The program layer: laws compiled to versioned UCIDs, crosswalks (NIST AI RMF, EU AI Act, ISO 42001, OECD…), `EvidenceBundle` binding Beacon receipts to controls, the 41-item policy-as-code vendor checklist | 200 (catalog, CI), 400 (bundle export) | Policy gates; Audit | Get to Yes; Recover | Gate vocabulary (tiers, decisions, constraints, stop conditions) added to the YAML; the community policy catalog with steward review; policy change emits a receipt; PyPI release so the 200 README's first line works |
| **Lantern** | `aigovops-foundation/aigovops-lantern` · Python CLI v0.1.1 | `read`, `diff`, `explain`; four role lenses; "Beacon signs. Lantern reads." Open issues: v0.2 web viewer, v0.3 GitHub Action | all (read), 300+ (verify page), 200+ (Action) | Audit (viewer); Policy gates (Action) | Recover; Get | Renders gate decisions; `diff` across two gate runs; v0.2 becomes the public verify page (the August plan's "make Lantern real by making it the verify page"); v0.3 becomes the 200 policy gate in CI |
| **Omni / Jeeves** | `aigovops-foundation/Omni-Rapp-June-2026` · droplet | The agent estate: 45 agents, crew roles, the Design agent (`design mark`), twins and envelopes (inert), `jeeves numbers`, cohort call, letter assembly, story@ intake, the ledger | all (return) | — (machinery) | the loop | Counts loops and marks by level; Thursday run-of-show gains the five-minute receipt slot; host rota as data; ledger schema for `practice.*` receipts |
| **NCW AI Camp** | `aigovops-foundation/aigovops-ncw-ai-camp` · GitHub Pages | Cool Tools, Cool Schools, The Rules — 35 mini-camps, 16 tool pages, the Hint-Logs "keep the receipts" method, the 7-point NCW AI Partnership Pledge (EN/ES). Built for AI Expo, 11 Aug 2026 | pre-100 | — | Get to Yes | Becomes the named zero-tech on-ramp: "if you have never opened a terminal, start here"; Hint-Logs is the receipts habit that makes the 100 page familiar; one mini-camp links straight to the Gate Check page |
| **Vendor RFI** | `aigovops-foundation/aigov-ops-open-source-vendor-rfi-rapp-johnston-june-2026` | Evidence-oriented vendor stack composer (Beacon lens, Umbrella lens); auditor value model; neutral sponsorship framework; the audit-training tool with a scored knowledge check, self-audit and receipt export | 300, 400 | Audit; Policy gates | Recover; Get | The 300/400 procurement activity: score a vendor stack in evidence terms; the self-audit's receipt joins the member's chain |
| **Global Inclusion Matchmaker** | (repo named in v1 §10) | The G20 rural and Indigenous resource app | 200 | Pre-pend; Policy gates | Get | The retrofit worked example — reference implementation 2 and the 200 README are one artifact |
| **Newsletter / Tuesday Letter** | Substack + LinkedIn newsletter; Omni `letter_assemble` | Weekly; one Publish click for Ken | all | — | the loop | One line from `jeeves numbers`: loops closed and marks minted this week, by level, no names; the readiness countdown to 2 December 2027 |
| **Glean-Mastery** | `Glean-Mastery` (in `_aigov`) | 30-minutes-a-day curriculum, levels 200→500, content as data gated by policy-as-code, quizzes as JSON | — | — | — | **Confirm scope before reuse** (employer IP carve-out). If Foundation-scoped: its `content/weeks/NN/day-NN.mdx` + `data/quizzes` format is the template for level kits' daily practice; otherwise reuse only the idea |
| **quantum-stack-intelligence** | `quantum-stack-intelligence` | (out of scope for this map) | — | — | — | Not part of the ladder; not touched |

## Where the corpus cases live

Batch `2026-W24`, `aigovops-library/docs/data/verified-harms-2026-W24.json`, schema 2.0.0, 100 cases,
verdicts 85 × 0 · 13 × ? · 2 × 1. Domains by count: chatbots-llm 17, biometrics-face 17,
content-data-provenance 14, public-benefits 11, healthcare 9, deepfakes-fraud 8, autonomous-vehicles 6,
hiring 5, finance 4, content-moderation 3, education 2, justice 2, safety-physical 2. Each case carries
`gate` (the plain-words rule), `verdict`, `frameworks`, `source[]`, `verification`. The `gate` field is
the plain-words path's input at every level.

## Ken's themes and where the ladder answers them

| Theme (Foundation blog) | Where it lands |
|---|---|
| *Agentic Hell* — recursive loops, no observability, no provenance | The chain, gap detection, coverage; 300 owns it |
| *No More Anonymous Ghosts* — agent identity and authority | `agent_id` + `authority` bound by the broker (F15); an unbound action is a stop |
| *EU AI Act ready by August 2026?* | The Omnibus moved Annex III to 2 Dec 2027; the readiness promise names that date |
| *Healthcare AI governance, spring 2026* | 300 is built on nH Predict and Cigna PXDX: a model may inform, never replace clinical judgment; a human actually reviews |
| *NIST AI RMF vs the real world* | UCID crosswalks; policy gates in CI |
| *Flow-to-Trust Loop* — ten ops disciplines | The four gates are where GovOps hands off to the other nine |
