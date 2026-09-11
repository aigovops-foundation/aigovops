# AiGovOps Foundation — Fall 2026 Release

**Release train:** `fall-2026` · **This repo:** `practice` **v1.0.0-rc.1** (11 September 2026)
**Becomes v1.0.0** when Decisions 6–11 are marked on 16 September and one stranger has finished a
worksheet unaided. Cut and tagged from `main`; the tag is the release.

## What the Fall release is

One practice, four levels, four gates, three engines, one community. The estate's open-source projects
stop being separate downloads and become one hour of value at each level of practice — a worksheet, a
checklist, a signed artifact, a Thursday — with the GitHub repos as the only source of truth and the
website as the door.

The hero of the release is the standard: everything here conforms to **OVERT**, stewarded by Glacis
Technologies. The Foundation's part is to be the open implementation, the training, and the community.

## Versioning — the correct version of each thing

Code follows semantic versioning. Content follows the train. A worksheet carries the train name and the
date it was last verified against the live tools; it never carries a semver of its own.

| Repo | Today (verified 11 Sept 2026) | Fall 2026 target | What moves it |
|---|---|---|---|
| **`practice`** (this repo) | v1.0.0-rc.1 | **v1.0.0** | Decisions marked; one stranger finishes a worksheet |
| **`aigovops-beacon`** | 0.1.0 in `server/` and `studio/` `package.json`; `CHANGES-v0.2.md` exists; no GitHub release; OVERT profile `aigovops-beacon.v1` registration pending | **0.3.0** | `beacon gate check`, `gate init`, `share`; Python SDK (F2); package versions reconciled to one number; first GitHub release; profile signed |
| **`aigovops-lantern`** | v0.1.1 (GitHub release, 1 June 2026); not on PyPI | **0.2.0** | Gate decisions in all four lenses; `diff` across gate runs; the web viewer (issue #2). 0.3.0 = the GitHub Action (issue #3) |
| **`umbrella-govops`** | 0.1.0a1 in `pyproject.toml`; not on PyPI; README's `pipx install umbrella-conformance` fails | **0.1.0** | Gate vocabulary in the YAML; first PyPI release so the 200 worksheet's first line works |
| **`aigovops`** (Open Source v4) | self-hostable from a clone; 193 tests; `@aigovops/*` npm packages and `get.aigovops.org` planned, not live | **v4.1** | Tier-1 "just the gate" documented as the 200/300 runtime option; npm publish (the August plan's wedge) |
| **`aigovops-library-june-ken-bob`** | corpus batch 2026-W24, schema 2.0.0; T0/T1/T3/T5 shipped; T10 next | corpus **2026-W38**; T10 | JCS canonicalizer (blocks every receipt claim); the `gate` field exposed to the 100 page |
| Site | rolling | rolling | The story below; the Community page ladder; Gate Check page grows the rule box in P0 |

**Rules.** No engine claims a version it has not tagged. No README's first install line may fail (the
Umbrella finding from July stands until PyPI). `practice` never pins an engine version in a worksheet;
it names the command and the date it was last verified.

## What works today vs what arrives

Each worksheet marks steps **live** or **fall**. Live means you can do it right now with what is on
GitHub Pages and in the repos. Fall means the Fall release lands it (P0/P1/P2 in the PRD).

| Level | Live today | Arrives in Fall |
|---|---|---|
| 100 | The 100 public cases (f-ai-friday.html); the practitioner test and FailFest (Library, free join); Beacon's browser demo — real key, real JCS-signed receipts, a real downloadable bundle with `VERIFY.md` | The Gate Check page's rule box and action box, so the *decide* step runs on your rule instead of the sample inventory; `beacon share` |
| 200 | `umbrella-conformance check / bundle / verify` from source; `lantern read / diff / explain` from source on any Beacon bundle; the `aigovops` tier-1 gate from a clone | PyPI installs; `beacon gate init`; the Python SDK; the policy catalog; the Lantern GitHub Action |
| 300 | The C3 policy written and validated; the aggregation math done by hand on Cigna's numbers; the Vendor RFI audit-training self-audit with a receipt | Hold queue with decay; budgets enforced; identity binding; `beacon coverage`; the adversarial suite |
| 400 | Verify a Beacon bundle by its own `VERIFY.md` on an offline machine; write the Robodebt policy gate; file a case upstream; host a Thursday | `beacon verify --offline` as one command; bundle export with crosswalk; the RFC process; credential marks minted |

## Release checklist (the train leaves when every box is ticked)

- ☐ Decisions 6–11 marked (`design mark`) — 16 September
- ☐ Profile `aigovops-beacon.v1` signed, or every public page says *targeting OVERT 1.1; registration pending*
- ☐ T10 green in the Library
- ☐ One stranger finishes the 100 worksheet in under an hour, unaided, and comes Thursday
- ☐ Umbrella on PyPI; Lantern on PyPI
- ☐ Site: story published; Community page carries the ladder; Gate Check page has the rule box
- ☐ Each engine tagged `fall-2026` at the version in the table above
- ☐ `practice` tagged v1.0.0

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md).
