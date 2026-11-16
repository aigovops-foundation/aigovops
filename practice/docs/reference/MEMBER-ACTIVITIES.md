# Member activities — simple, end to end, practical, at every level, whatever your skills

The rule for every activity: **one real case, all four gates, one signed artifact, one return** — and
two paths to the same artifact so that policy skill without code, or code without policy skill, both
finish. The corpus already writes each gate in plain words (the `gate` field); Umbrella writes it in
YAML. The plain-words path compiles the sentence to the rule; the code path renders the rule as the
sentence. Same gate, same receipt, same mark (PRD v3 F14).

Every activity below exists in one of two states: **live** (the estate has it today) or **P0/P1/P2**
(the ninety days). Nothing is P3.

## The shape of every activity

| Step | Plain-words path (policy skill, no code) | Code path (code, no policy skill) | Both |
|---|---|---|---|
| 1 · The case | Read today's FailFest case: what happened, what it cost, the source | Same | 2 min |
| 2 · Declare | Write the gate as a sentence — *"a face match is a lead, not evidence"* — pick the action, the tier, the decision from three drop-downs; the page compiles the YAML | Write the three-line YAML; Lantern's compliance lens renders the sentence | Policy gate: the rule validates or it does not run |
| 3 · Decide | Press *propose the action* | `beacon gate check intent.json` | Pre-pend gate: allow · constrain · hold · deny, bound to the hash |
| 4 · Prove | The receipt appears; the chain grows by one | Same, on disk | Operate gate: chain position, identity, budget |
| 5 · Read | Pick your lens: engineer · compliance · auditor · regulator | `lantern read` | Audit gate: `VERIFY.md` says how a stranger checks it |
| 6 · Return | *Bring it Thursday* — the hash goes on your Gate Card | `beacon share` | The mark is a receipt |

## Level 100 — Begin · owns the pre-pend gate · 10 minutes · nothing installed

| | |
|---|---|
| Who | Anyone. If you have never opened a terminal, start at an NCW Camp mini-camp (Hint-Logs: keep the receipts), then come here |
| Warm-up (live) | The practitioner test in the Library: ten cases, pick the verdict |
| The case | **VH-001 Air Canada** — the chatbot promised a bereavement refund the policy did not allow; the tribunal held the airline to the chatbot's word. Gate: *the company stands behind every statement its AI makes and verifies policy answers against the source of truth.* Alt: **VH-010 Mata v. Avianca** — a lawyer filed six cases the model invented |
| Activity | On the Gate Check page: write the gate (sentence or YAML); propose `customer.reply` carrying a policy claim; watch it **hold** (C2 external effect on a person, claim unverified) or **constrain** (allowed only with the verified source attached); download the bundle; read it as a compliance lead, then as an engineer |
| All four gates, felt once | Policy gate: the rule validated before it ran. Pre-pend: the decision. Operate: `seq: 1`, `agent_id`, `authority`. Audit: `VERIFY.md` |
| Artifact | `bundle-<hash>.zip` — verifies with the 400 tool |
| Return | First five minutes of Thursday: show the receipt to a person. A host marks you 100 |
| State | Page P0; test live; Camp live |

## Level 200 — Retrofit · owns the policy gates · 30 minutes · one install

| | |
|---|---|
| Who | A 100 with an agent, a script, a bot or a workflow of their own |
| The cases | **VH-022 Chevrolet of Watsonville** — the dealership bot agreed to sell a Tahoe for $1 "no takesies backsies". Gate: *system prompts are not security boundaries; consequential commitments require deterministic rules.* **VH-056 Knight Capital** — a bad deploy lost $440M in 45 minutes. Gate: *deploy gating, kill switches, rehearsed rollback* |
| Activity A — your agent (Chevy) | `beacon gate init` scaffolds `policy.yaml`; you declare three real actions your agent takes with tiers; `commitment.make` is C3 hold or C4 deny. Wrap the tool calls with `gate.check()`; run; `beacon gate check`; `lantern diff` between the run before and after the rule. Plain-words path: the same on the Gate Check page in "my agent" mode with a pasted action log |
| Activity B — your pipeline (Knight) | Put `umbrella-conformance check` (or the Lantern GitHub Action) in CI on the repo that holds the policy; change a tier in a PR; watch the policy gate refuse the merge until a steward reviews; the merge emits a receipt |
| Worked example | The Global Inclusion Matchmaker retrofit — the README and reference implementation 2 are one artifact |
| Artifact | Your `policy.yaml` landed in the catalog by PR; one chain; one diff; one CI run that refused a downgrade |
| Return | Your story ships through the content pipeline; you pair with a 100 on Thursday. Mark: 200 |
| State | P1 (SDK on PyPI, `gate init`, Action, catalog) |

## Level 300 — Hold · owns the operate gate · a week of real traffic

| | |
|---|---|
| Who | A 200 whose agent touches people, money or rights |
| The cases | **VH-015 Arup** — HK$200M wired after a video call full of deepfaked colleagues. Gate: *high-value transfers require out-of-band confirmation.* **VH-035 Cigna PXDX** — 300,000 claims denied in two months, 1.2 seconds each. Gate: *a human reviewer actually reviews.* **VH-011 UnitedHealth nH Predict** — *a model may inform but never replace clinical judgment in coverage decisions* |
| Activity A — the hold (Arup) | Declare `payment.transfer` above a threshold as C3 with `approver_role`, an out-of-band channel and expiry; run traffic; a hold queues; release it through the named approver; the chain shows hold and release; an unreleased hold **decays to deny** |
| Activity B — aggregation (Cigna) | Declare `claim.deny` as C1 with `budget: {per_hour: N}`; replay a burst; watch the cumulative budget escalate to C3 and hold; `beacon coverage` reports the share of C2+ actions decided by the gate |
| Activity C — identity (Ghosts) | Run one action with no `agent_id`; watch the stop condition fire and the receipt record why |
| Adversarial | `beacon gate test --adversarial` — the nine attacks from v1 §12, each citing its case, all green |
| Procurement (live) | Score a vendor stack in the Vendor RFI advisor; export the self-audit receipt into your chain |
| Artifact | *Gate coverage 9x% over 30 days* with holds, releases and one aggregation escalation in the chain; the auditor and regulator lens renders |
| Return | Verify another practitioner's bundle before Thursday and say what you found; mentor a 200. Mark: 300 |
| State | P1 (broker, hold queue, coverage, adversarial suite) |

## Level 400 — Prove it to a stranger · owns the audit gate · ongoing

| | |
|---|---|
| Who | A 300 ready to steward |
| The cases | **VH-013 Robodebt** — income averaging as a legal premise, 470,000 unlawful debts, a Royal Commission. Gate: *the mathematical premise of an automated decision is independently validated as lawful before a single notice.* **VH-003 Toeslagenaffaire** — 26,000–35,000 families, 2,000 children removed, a cabinet fallen. **VH-088 Post Office Horizon** — *software outputs accusing people of crimes are independently verifiable; the system's outputs are not legal evidence on their own* |
| Activity A — verify a stranger (Horizon) | Take a bundle you did not make, from the catalog or from a stranger; `beacon verify --offline` on a machine with no network; publish the verification statement with your name |
| Activity B — the premise (Robodebt) | Write the policy gate that requires the decision rule's premise to be validated *and receipted* before the first notice; export the evidence bundle with the UCID crosswalk to the Annex III category and to NIST RMF; hand it to a regulator lens reader who is not you |
| Activity C — upstream | File one issue against OVERT's domains, or one incident to AIID / OECD AIM, with the case number and the gate |
| Activity D — teach | Host a Thursday; mark a 300's step (`practice.mark`, you as approver); land a contributor's PR |
| Artifact | A public offline verification with your name on it; a Thursday you hosted |
| Return | You are on the host rota. Mark: 400 |
| State | P2 (offline verifier, bundle export, RFC process) |

## The credential, per level (PRD v3 D10)

| Level | Passes when | Who marks | Minted as |
|---|---|---|---|
| 100 | The bundle verifies and was shown to a person | Any host | `practice.mark` receipt, tier C1, hash-only |
| 200 | The policy is in the catalog; the diff and the refused CI run are in the chain | A 300 or above | same |
| 300 | The coverage claim reproduces from the chain; a hold, a release, a decay and an aggregation are present; someone else's bundle was verified | A 400 | same |
| 400 | A public verification of another party's bundle; a hosted Thursday | Two 400s or a founder | same |

One attempt per scenario per day; server-side scored; free; no expiry, but the ledger shows the date.
Nothing about a system is claimed by any mark.
