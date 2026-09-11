# Decisions for Bob and Ken

Review order. Decisions 1–5 are from PRD v1 (10 Sept) and are taken first because v2 depends on them.
Decisions 6–9 are v2's. Each is recorded as a `design mark` step once taken. Nothing is live until then.

| # | Decision | Recommendation | Where argued |
|---|---|---|---|
| 1 | Project boundaries: A, B or C | **C** — Umbrella declares · Beacon decides-and-proves · Lantern reads | v1 §4 |
| 2 | One assurance ladder for systems | Adopt OVERT's four levels; own the gate coverage number; drop A0–A5 | v1 §6 |
| 3 | Posture toward OVERT and Glacis | Compatible, independent, not dependent; publish conformance first, talk after | v1 §7 |
| 4 | The three reference implementations | Grant assistant · Matchmaker (retrofit) · university coding agent (GitHub Action) | v1 §10 |
| 5 | The ninety days and the exclusion list | Approved as amended by Decision 9 | v1 §14 → v2 §8 |
| 6 | **The practitioner ladder** — four levels, three rules | Adopt 100 Begin · 200 Retrofit · 300 Hold · 400 Prove; every level is the whole loop; levels are marked by hosts; no level is ever a system claim | v2 §4 |
| 7 | **One front door** | New repo `aigovops-foundation/practice` holding the four kits; no meta-CLI; `reference/` folds into the kits; the 100 bundle must verify with the 400 tool | v2 §5 |
| 8 | **The return** — the practitioner ledger | Opt-in, hash-only, revocable; `beacon share` is the only new command; host marks are the only way a level changes | v2 §6 |
| 9 | **The ninety days by level** | P0 ships level 100 whole; P1 ships 200 and 300; P2 ships 400. Exclusions extended: no badge, credential or exam | v2 §8 |

## Open questions carried from v1

- Ken: approach Glacis about a liaison before or after publishing conformance? Recommendation: after.
- Ken: the copy words (site #103) and NCW (site #108) — both touch the level 100 page copy.

## Who does what by Friday, if approved 16 September

- **Ken:** the Thursday five-minute receipt slot (copy and the run-of-show); the host rota copy; Appendix A one-pager read for voice.
- **Bob:** T10 in the Library (day 1, blocks everything); create `aigovops-foundation/practice` from this project (`scripts/humans.sh`); the level 100 page as one site PR; the Appendix B copy sweep as one PR after Decision 6.
- **Design agent:** `design mark` for each decision; republish the Redesign Plan artifact; open the P0 issues in Omni and the site under milestone "Redesign P0".
