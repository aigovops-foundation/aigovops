# Decisions for Bob and Ken

> **Decided — Bob, 11 September 2026, via the Decision Sheet: yes to all eleven** (and to the redesign's R1–R11). Ken's column is open on the sheet. R3 carries two edits: `f-ai-friday.html` and `frameworks.html` stay public until the Library has a public view. R7 (NCW redirect) and R11's Parker/Ken items wait for their owners. Executed the same morning: site #123 (creed, fold), Camp #53 + Library #89 (creed), Beacon #57 (STANDARDS.md line, D10), Omni #420 (auto-admit verified live, bulk import guard, cohort welcome pipeline); marks on the droplet: 4.1 live, 4.4 live, 0.1/0.2/2.4 noted; the Joe draft sent to Ken (D11).

Review order. Decisions 1–5 are from PRD v1 (10 Sept) and are taken first because everything after
depends on them. Decisions 6–11 are v3's. Each is recorded as a `design mark` step once taken. Nothing is
live until then.

| # | Decision | Recommendation | Where argued |
|---|---|---|---|
| 1 | Project boundaries: A, B or C | **C** — Umbrella declares · Beacon decides-and-proves · Lantern reads | v1 §4 |
| 2 | One assurance ladder for systems | Adopt OVERT's AALs verbatim; own the gate coverage number; drop A0–A5 | v1 §6 → v3 §4 |
| 3 | Posture toward OVERT and Glacis | Compatible, independent, not dependent; publish first, talk after | v1 §7 → v3 §8 |
| 4 | The three reference implementations | Grant assistant · Matchmaker (retrofit) · university coding agent (GitHub Action) — folded into the 100, 200 and 400 kits | v1 §10, v2 §5 |
| 5 | The ninety days and the exclusion list | Approved as amended by Decision 9 | v1 §14 → v3 §11 |
| 6 | **The practitioner ladder, revised** | Four levels; each owns one of the four gates (pre-pend · policy · operate · audit); each built on named corpus cases from the hardest domains; each maps to an OVERT AAL pattern under the two-sentence rule (person vs system) | v3 §4 |
| 7 | **One front door** | `aigovops-foundation/practice`; no meta-CLI; two paths (plain words, code) to byte-identical receipts | v2 §5, v3 §5 |
| 8 | **The return** | `beacon share`; opt-in hash-only ledger; host marks are the only level changes | v2 §6, v3 §6 |
| 9 | **The ninety days by level, revised** | P0 ships 100 whole (+ profile ask day 1, criteria for 100/200 to the Review Circle by day 20); P1 ships 200 + 300 (+ credential v1 minted); P2 ships 400 (+ joint story). Exclusion list rewritten: people-credential in; system certification, exam selling, IAP operation, standards issuing out | v3 §11 |
| 10 | **The credential** | AiGovOps Practitioner — policy-as-code readiness, 100–400. Performance-based on corpus cases, host-marked, ledger-minted as a receipt, free to attempt, never sold. Reverses v2's "no badge"; keeps ADR-0001's line by redrawing it: community credentials people, the standard's process certifies systems. Readiness promise dated to 2 Dec 2027 | v3 §7 |
| 11 | **Glacis and Joe** | Lock in. Five asks, cheapest first: sign the profile; read the criteria in the Review Circle; the 100 page as the v1 launch artifact; a joint story on the first outside verification; the IAP question, later. The note goes in Ken's voice on day 1 with Bob's yes | v3 §8, GLACIS-ALIGNMENT.md |

## Open questions carried

- Ken: the copy words (site #103) and NCW (site #108) — both touch the level 100 page.
- Ken: send the Glacis note? (needs Bob's yes; draft in GLACIS-ALIGNMENT.md §7).
- Bob: is Glean-Mastery Foundation-scoped? If yes its daily-lesson format is the kit template; if not, only the idea is reused.
- Both: the readiness promise's wording — *"a 300 can take an Annex III-class system to the operate-gate pattern before 2 December 2027"* — is this a sentence you will say on stage?

## Who does what by Friday, if approved 16 September

- **Ken:** the Glacis note; the Thursday five-minute receipt slot and host-rota copy; Appendix A read for voice; which four cases lead the site copy.
- **Bob:** T10 in the Library (day 1); create `aigovops-foundation/practice` from this project (`scripts/humans.sh`); the level 100 page as one site PR; the Beacon README AAL/IAP correction; the copy sweep after D6/D10.
- **Design agent:** `design mark` for each decision; republish the Redesign Plan artifact; open the P0 issues in Omni and the site under "Redesign P0"; the ledger schema for `practice.*` receipts.
