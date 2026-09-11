# Open-Source-Unified-Sept-2026

**One practice, four levels, four gates, three tools, one community — and the marks are the credential.**
AiGovOps Foundation · Programme: Labor-Day-Big-Redesign · Started 11 September 2026 · Status: **decide** · PRD v3

This is the working project for unifying the Foundation's **whole estate** — the site, the Library, Beacon,
Umbrella, Lantern, Omni, NCW Camp, the Vendor RFI, the Matchmaker, the Letter — around the **member**, at
whatever level of policy skill or technical skill they arrive with. Nothing here is live and no code in
any repo has changed. When approved, the public name proposed for this repo is
`aigovops-foundation/practice` (see [Decision 7](docs/DECISIONS.md)).

## The idea in four sentences

Each member starts where they are. Each level practises all the parts, not one part. The tools bring you
back, because the community is where you become a practitioner — the tools only get you started. The
marks are the credential, and the credential is a receipt.

## The ladder

| Level | Name | Gate it owns | Built on (FailFest) | You leave with… | OVERT AAL pattern | Time |
|---|---|---|---|---|---|---|
| [**100**](levels/100-begin/) | Begin | pre-pend gate | VH-001 Air Canada | one signed receipt bundle, shown to a person on Thursday | AAL-1 | 10 min |
| [**200**](levels/200-retrofit/) | Retrofit | policy gates | VH-022 Chevrolet of Watsonville · VH-056 Knight Capital | your policy in the catalog, a chain, a diff, a CI run that refused a downgrade | AAL-2 | 30 min |
| [**300**](levels/300-hold/) | Hold | operate gate | VH-015 Arup · VH-035 Cigna PXDX · VH-011 nH Predict | a coverage claim over 30 days with holds, decay and aggregation in the chain | AAL-3 | a week of traffic |
| [**400**](levels/400-prove/) | Prove it to a stranger | audit gate | VH-013 Robodebt · VH-003 Toeslagenaffaire · VH-088 Horizon | a public offline verification with your name on it; a Thursday you hosted | AAL-4 | ongoing |

Every level practises the same five parts — **declare · decide · prove · read · return** — and touches all
four gates, at increasing depth, with the same three tools throughout. Every activity has a plain-words
path and a code path to the same receipt. No level adds a new tool name. A level describes a *person's*
practice; a system's assurance is its OVERT AAL and its gate coverage number, claimed by that system's
evidence — the two sentences never merge.

## The four gates

| Gate | When | Movement | Engine |
|---|---|---|---|
| Pre-pend gate | before a single action runs | Get to Yes | `beacon gate check` |
| Policy gates | before a rule or a system ships | Get to Yes | `umbrella-conformance check` in CI · Lantern GitHub Action |
| Operate gate | while it runs, in real time | Stay at Yes | Beacon broker · hold queue · `beacon coverage` |
| Audit gate | after — on demand, on incident | Recover to Yes | `beacon verify --offline` · Lantern lenses · Umbrella bundle |

## The rule (unchanged from v1)

> No direct model-to-tool path for consequential actions.

## Documents

- [`docs/PRD-OPEN-SOURCE-UNIFIED.md`](docs/PRD-OPEN-SOURCE-UNIFIED.md) — **PRD v3**, whole-estate
  edition. The four gates, the ladder built on corpus cases, the credential (D10), Glacis alignment (D11),
  the ninety days by level.
- [`docs/ESTATE-MAP.md`](docs/ESTATE-MAP.md) — every property, its level, its gate, what changes.
- [`docs/STANDARDS-MAP.md`](docs/STANDARDS-MAP.md) — OVERT 1.1, the EU AI Act after the Omnibus, NIST agent
  identity, ISO 42001, the credentials landscape; sources.
- [`docs/GLACIS-ALIGNMENT.md`](docs/GLACIS-ALIGNMENT.md) — where things stand since May, the position, five
  asks, the draft note for Ken's voice (not sent).
- [`docs/MEMBER-ACTIVITIES.md`](docs/MEMBER-ACTIVITIES.md) — every activity, both paths, per level, with the
  case, the gates, the artifact, the return and the mark.
- [`docs/PRD-PREPEND-PROVE-IT-GATE.md`](docs/PRD-PREPEND-PROVE-IT-GATE.md) — PRD v1 (10 Sept), the source
  thinking, preserved verbatim. Its architecture (the rule, tiers C0–C4, the assurance ladder, the OVERT
  posture, policy schema, receipt, requirements, adversarial suite) is adopted by v2 and v3 unchanged.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — the eleven decisions for Bob and Ken, in review order.
- [`levels/`](levels/) — one kit per level: who it is for, the tools, the exercise, the take-home, the return.
- [`scripts/humans.sh`](scripts/humans.sh) — Bob's single paste script: places this project locally and,
  after one y/N, creates the org repo.

## The three engines (unchanged names, unchanged taglines)

| | Verb | Repo |
|---|---|---|
| **Umbrella** | declares | `aigovops-foundation/umbrella-govops` |
| **Beacon** | decides and proves | `aigovops-foundation/aigovops-beacon` |
| **Lantern** | reads | `aigovops-foundation/aigovops-lantern` — *Beacon signs. Lantern reads.* |
| **Thursday** | is where you return | the Community |

*Get to yes. Stay at yes. Recover to yes. Prove it in ten minutes. Then bring it, and be counted.*
