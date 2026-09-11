# Open-Source-Unified — the Practitioner Ladder

**PRD v3 — draft for review · whole-estate edition**
Owner: Bob Rapp · Reviewers: Bob Rapp, Ken Johnston · Date: 11 September 2026
Programme: Labor-Day-Big-Redesign · Project: Open-Source-Unified-Sept-2026 · Status: **decided by Bob, 11 Sept 2026 (all eleven); Ken's column open**
(the practice repo and the site are live as rc.1; engines unchanged except one sentence in Beacon's STANDARDS.md)
Supersedes: v2 (11 Sept, morning — the ladder) and, on persona, packaging and roadmap,
[`PRD-PREPEND-PROVE-IT-GATE.md`](PRD-PREPEND-PROVE-IT-GATE.md) (v1, 10 Sept). v1's architecture — the
rule, the tiers, the receipt, the policy schema, requirements F1–F10 / N1–N7, the adversarial suite — is
kept whole and referenced by section number.
Companion documents: [`ESTATE-MAP.md`](ESTATE-MAP.md) · [`STANDARDS-MAP.md`](STANDARDS-MAP.md) ·
[`GLACIS-ALIGNMENT.md`](GLACIS-ALIGNMENT.md) · [`MEMBER-ACTIVITIES.md`](MEMBER-ACTIVITIES.md) ·
[`DECISIONS.md`](DECISIONS.md)

---

## 0. Summary in one paragraph

The Foundation's whole estate — nine public properties, one private Library, one agent estate — is
reorganised around a **member**, not a project. Every member, whatever their policy skill or their
technical skill, gets activities that are simple, end to end and practical, at one of four levels — 100,
200, 300, 400 — and every activity runs the same four gates on a real case from the FailFest corpus:
the **pre-pend gate** before an action, the **policy gates** before a rule or a system ships, the
**operate gate** while it runs in real time, and the **audit gate** after, when a stranger has to be
able to verify what happened. Each level ends in a signed artifact a host marks on Thursday, and the
marks are the credential: **AiGovOps Practitioner — policy-as-code readiness**, performance-based, free
to attempt, minted on the Foundation's own ledger, with criteria co-signed by the steward of the
standard our receipts conform to. The ladder maps rung for rung to OVERT's four attestation assurance
levels, which is how it aligns with Glacis instead of competing with them, and it is built for the
scenarios Ken writes about — the benefit system that branded 26,000 families as fraudsters, the insurer
that denied 300,000 claims at 1.2 seconds each, the chatbot whose promise bound the airline — because a
practitioner who has only gated the easy cases is not ready. The message does not change: *get to yes,
stay at yes, recover to yes, prove it in ten minutes.* v3 adds: *then bring it, and be counted.*

---

## 1. What changed, and why — v1 → v2 → v3

| | v1 (10 Sept) | v2 (11 Sept am) | v3 (this document) |
|---|---|---|---|
| Scope | Three open-source repos | Three repos + the community | **The whole estate**: site, Library, Beacon, Umbrella, Lantern, Omni, NCW Camp, Vendor RFI, Matchmaker, the Letter |
| Organising principle | The Gate | The practitioner ladder | The ladder, **run against the four gates on real FailFest cases** |
| Who it is for | A manager persona | Anyone, by level of practice | Anyone, by level, **whatever their policy skill or tech skill** — every activity has a plain-words path and a code path to the same artifact |
| Standards | OVERT 1.1 conformance for the receipt | Same | Same, plus **the ladder maps to OVERT's AAL-1…4**, and the standards calendar (EU AI Act omnibus, NIST agent identity, ISO 42001) sets the readiness date |
| Glacis | Compatible, independent; talk after publishing | Same | **A concrete alignment proposal**: publish the profile, co-sign the credential criteria through the Review Circle Joe already holds, keep the Foundation as training + open reference, Glacis as steward + runtime |
| Credential | "Not a certification business" | "No badge, credential or exam" | **Reversed, with the line redrawn**: a performance-based *practitioner* credential is in (it is the 10x plan's Lever 6 and the FinOps/CNCF pattern the Foundation cites); *system* certification, exam selling and standards issuing stay out (ADR-0001 holds) |
| Highest-risk scenarios | Three reference implementations | Same | **The levels are built on the corpus's hardest domains** — public benefits, healthcare coverage, biometrics, high-value transfer fraud, binding chatbot statements — so the credential means something where it matters |

Three sentences still carry the design: **each member starts where they are; each level practises all
the parts, not one part; the tools bring you back, because the community is where you become a
practitioner.** v3 adds a fourth: **the marks are the credential, and the credential is a receipt.**

---

## 2. The whole estate, in one map

Full table in [`ESTATE-MAP.md`](ESTATE-MAP.md). The finding that matters: **nothing needs inventing.**
Every property already plays a part; the work is to say which part and stop maintaining the rest as if
it were separate.

| Property | Its part in the ladder |
|---|---|
| **Foundation site** (the porch) | The only front door. The Gate Check page *is* level 100; the Community page *is* the ladder; the three movements — Get to Yes · Stay at Yes · Recover to Yes — are *when* each gate runs |
| **AiGovOps Library** (private) | The FailFest corpus is the scenario bank at every level (100 verified harms, each carrying the plain-words gate that would have caught it); the practitioner test is the 100 warm-up; runtime primitives T0–T10 are the 300 broker; the ledger mints the credential |
| **Beacon** | Decides and proves: the pre-pend gate, the operate gate's broker and holds, the signer and the verifier. Its no-install browser demo is the seed of the 100 page. Its OVERT profile `aigovops-beacon.v1` is the alignment artifact |
| **Umbrella** | Declares: the policy gates in CI (`umbrella-conformance check`), the UCID registry, the crosswalks, the evidence bundle. The community policy catalog for 200 lives here |
| **Lantern** | Reads at every level. v0.2 web viewer becomes the public verify page — the audit gate's surface. v0.3 GitHub Action becomes the 200 policy gate where engineers already look |
| **Omni / Jeeves** | The return machinery: cohort call, Tuesday Letter, `jeeves numbers`, the Design agent, `design mark` — and the ledger the credential is minted on |
| **NCW AI Camp** | The zero-tech on-ramp: 35 mini-camps, the Hint-Logs "keep the receipts" method, the pledge. A 100 who has never opened a terminal starts here |
| **Vendor RFI** | The 300/400 procurement activity: the auditor value model and the audit-training tool that already exports a receipt |
| **Global Inclusion Matchmaker** | The 200 retrofit worked example (v1 §10, unchanged) |
| **Newsletter / Tuesday Letter** | Where the count is published — loops closed by level, no names |

One rule from this map: **a property that cannot name its level and its gate is folded or retired in the
copy sweep.** That is the estate-simplification discipline of July applied to the open-source program.

---

## 3. The rule, the five parts, and the four gates

The rule is unchanged from v1 §3 and is read aloud at the top of every review:

> **No direct model-to-tool path for consequential actions.**

The five parts of the practice are unchanged from v2 — **declare · decide · prove · read · return** —
and every level practises all five. What v3 adds is *when* the gate runs. Bob named four gates; they
are the same rule at four moments, and they map exactly onto the three movements the estate already
teaches and onto OVERT's domains.

| Gate | When it runs | Movement | The question it answers | Engine | OVERT domain |
|---|---|---|---|---|---|
| **Pre-pend gate** | Before a single action runs | Get to Yes | May this exact action run, and only this far? | `beacon gate check` — decision bound to the payload hash | PROTECT |
| **Policy gates** | Before a rule or a system ships | Get to Yes | Is the rule itself valid, reviewed, crosswalked — and did changing it leave a receipt? | `umbrella-conformance check` in CI; Lantern GitHub Action | GOVERN · IDENTIFY |
| **Operate gate** | While it runs, in real time | Stay at Yes | Are holds held, budgets kept, identities bound, coverage measured — continuously, with fail-closed above C1? | Beacon broker, hold queue, `beacon coverage` | MEASURE · PROTECT |
| **Audit gate** | After — on demand, on incident | Recover to Yes | Can a stranger verify what happened, offline, without us — and did the evidence reach the regulator complete and unedited? | `beacon verify --offline`, Lantern lenses, Umbrella bundle | ATTEST · RESPOND |

Two reconciliations the estate has been carrying silently, now written down:

- **The Library's gate law and v1's four outcomes are one thing.** The Library says every action is a
  proposal and the gate answers 1 (yes, earned with evidence), 0 (no, written to the ledger) or ? (held
  for a human, decays to 0 at the deadline). v1 says allow / constrain / hold / deny. Mapping: allow = 1;
  constrain = 1 with the scope narrowed and the narrowing receipted; hold = ?; deny = 0. **Holds decay to
  deny at expiry** — v1 §11 F6 adopts the Library's decay rule explicitly.
- **Agent identity is a receipt field, not a later feature.** Ken's *No More Anonymous Ghosts* and
  NIST's 2026 agent identity and authorization work ask one question — *which agent did this, under
  whose authority?* The receipt already carries `key_id`; v3 makes the broker bind every action to a
  named agent identity and a named authority, and an unbound action is a stop condition. That closes
  *Agentic Hell*'s "no provenance" by construction.

---

## 4. Decision 6 (revised) — the ladder, the gates it owns, the cases it is built on

Every level practises all five parts and touches all four gates. Each level **owns** one gate — the
gate at which its credential artifact is produced — and is built on named cases from the corpus, chosen
from the domains where the harm was largest.

| Level | Name | Gate it owns | Built on (FailFest) | Who arrives | Time | Credential artifact | OVERT rung it maps to |
|---|---|---|---|---|---|---|---|
| **100** | **Begin** | Pre-pend gate | **VH-001 Air Canada** — the chatbot's promise bound the airline; *the company stands behind every statement its AI makes, verified against the source of truth*. Alt: VH-010 Mata v. Avianca | Anyone. No install, no account | 10 min | One signed receipt bundle from one gated action, read in one lens | **AAL-1 Policy Documentation** — you can write governance policy as code |
| **200** | **Retrofit** | Policy gates | **VH-022 Chevrolet of Watsonville** — the bot agreed to sell a car for $1; *system prompts are not security boundaries; consequential commitments require deterministic rules*. **VH-056 Knight Capital** — $440M in 45 minutes; *deploy gating, kill switches, rehearsed rollback* | A 100 with an agent, a script or a workflow of their own | 30 min | Your policy, validated in CI, landed in the catalog; one receipt chain; one diff | **AAL-2 Process Records** — operational records of your own system's governance exist |
| **300** | **Hold** | Operate gate | **VH-015 Arup** — HK$200M sent after a deepfake video call; *high-value transfers require out-of-band confirmation*. **VH-035 Cigna PXDX** — 300,000 claims denied in two months at 1.2 s each; *a human reviewer actually reviews*. **VH-011 UnitedHealth nH Predict** — *a model may inform but never replace clinical judgment* | A 200 whose agent touches people, money or rights | A week of real traffic | A coverage claim over 30 days, with holds, releases and the aggregation rule proven in the chain | **AAL-3 Automated Monitoring** — continuous, machine-generated telemetry |
| **400** | **Prove it to a stranger** | Audit gate | **VH-013 Robodebt** — *the mathematical premise of an automated decision is independently validated as lawful before a single notice*. **VH-003 Toeslagenaffaire** — 26,000+ families, a cabinet fallen. **VH-088 Post Office Horizon** — *software outputs accusing people are independently verifiable; not legal evidence on their own* | A 300 ready to steward | Ongoing | A public offline verification of another party's bundle, with your name on it; a Thursday you hosted | **AAL-4 Cryptographic Attestation** — an independent party produces tamper-evident proof without content access |

Why these cases and not the easy ones: the corpus's largest domains are chatbots, biometrics,
content provenance, public benefits and healthcare, and its worst outcomes are population-scale and
rights-affecting. A ladder whose 400 is "gated a coding agent" would certify people for the scenarios
that hurt least. The 400 is public benefits and Horizon on purpose — the audit gate exists because
Robodebt ran for four years and Horizon for twenty before anyone could independently verify the software.

**The AAL mapping is a claim about the person, never about a system.** A 300 has demonstrably taken a
system to the AAL-3 *pattern* on the reference scenarios. Whether any particular system *is* at AAL-3 is
a conformance claim under OVERT, made by that system's evidence, assessed the way OVERT says. The two
sentences never merge. This is v1 Decision 2's separation rule, kept, and now stated in OVERT's own
terms so a reviewer from either side reads the same thing. (Correction carried into the copy sweep:
v1 §6's "OVERT Level 1 Core" should read **AAL-1 Policy Documentation**; Beacon's README roadmap line
"AAL-2 with IAP" should be re-checked — per OVERT 1.1 the Independent Attestation Provider is an AAL-4
requirement, and registered profiles are required from AAL-3.)

Three rules keep the ladder honest, unchanged from v2: every level is the whole loop; levels are marked
in the community, not self-certified; no level is ever a system claim.

---

## 5. Decision 7 (unchanged) — the simple tools and one front door

Unchanged from v2. One install per level and level 100 has none; five verbs, three names, at every
level; the 100 bundle must verify with the 400 tool; the kits are directories in
`aigovops-foundation/practice`, not a product; `reference/` folds into the kits. v3 adds one constraint
from the member's side:

**Every activity has two paths to the same artifact.** The corpus already writes each gate in plain
words — *"a face match is a lead, not evidence"* — and Umbrella writes it in YAML. A member with policy
skill and no code writes the sentence and the page compiles the rule; a member with code and no policy
writes the rule and Lantern renders the sentence in the compliance lens. Both run the same gate, both
get the same receipt, both are marked the same. Detail per level in
[`MEMBER-ACTIVITIES.md`](MEMBER-ACTIVITIES.md).

---

## 6. Decision 8 (unchanged) — the return, and the practitioner ledger

Unchanged from v2: `beacon share` is the only new command; the ledger is opt-in and hash-only; a host's
mark is a `practice.mark` receipt with the host as approver; `jeeves numbers` counts it for the Tuesday
Letter with no identities. v3 gives the ledger its second job: **the marks are the credential.**

---

## 7. Decision 10 — the credential: AiGovOps Practitioner, policy-as-code readiness

**What it is.** A performance-based credential, one per level. To earn a level you run the four gates on
corpus cases and produce the level's signed artifact; a host marks it on Thursday; the mark is minted on
the ledger as a receipt anyone can verify offline. Free to attempt. One attempt per scenario per day,
server-side scored, ledger-minted — the scoring-integrity design the August plan already hardened.

**What it is not.** Not a multiple-choice exam (IAPP's AIGP owns that ground and we do not contest it).
Not a system certification (OVERT and its assessors own that). Not a standard (STANDARDS.md: the
Foundation does not issue standards). Not sold: no fee to attempt, no fee to hold, no paid prep. The
badge is LinkedIn-shareable because the receipt is; nothing else is minted.

**Why this reverses v2's "no badge" line and how the ADR-0001 line still holds.** ADR-0001 (May) ruled
out "a certification program" in the sense of certifying *implementations* against the standard — the
standards-issuing adjacent path Joe asked us not to walk. The August 10x plan then named
performance-based *practitioner* credentialing as Lever 6 and left "what practitioner means" as a
founder decision. v2 collapsed the two and excluded both. v3 draws the line where the FinOps and CNCF
playbooks the Foundation cites already draw it: **people are credentialed by the community; systems are
certified by the standard's own process.** The exclusion list in §11 is rewritten to say exactly that.

**Why it can become the credential everyone looks to.** Four reasons, each checkable:

1. **It is open land.** Glacis's own 2026 certification guide lists AIGP, ISO 42001 lead implementer and
   the IAPP AI+privacy certificate — all documentation-side — and names no hands-on, runtime,
   policy-as-code credential. Nobody certifies that a person can make a gate hold.
2. **The exam bank is public and grows on its own.** One hundred verified harms today, re-verified against
   primary sources, each with its gate; FailFest adds to it weekly. No other credential's questions are
   court rulings and regulator orders.
3. **The credential is itself evidence.** It is a receipt on a chain, verifiable offline, zero-egress. A
   hiring manager checks it the way an auditor checks a bundle — with the same tool.
4. **The criteria are co-signed by the steward of the standard.** §8.

**Readiness date.** "Policy-as-code readiness" needs a date to be ready *for*. The Digital Omnibus moved
the EU AI Act's Annex III high-risk obligations from 2 August 2026 to **2 December 2027**; Article 50
transparency duties are live as of 2 August 2026; NIST's agent identity and authorization work matures
through 2027. The credential's public promise is: **a 300 can take a high-risk system to the operate-gate
pattern before December 2027.** That is the sentence the site, the Letter and the LinkedIn badge repeat.

---

## 8. Decision 11 — alignment with Glacis and Joe Braidwood

The honest starting point, from the repo: Beacon's profile registration `aigovops-beacon.v1` has been
*pending Glacis sign-off* since ADR-0001 in May; STEWARD.md invites Glacis as Founding Open-Source
Curator and Joe as Launch Advisor through the Beacon v1 window; ENGAGEMENT.md hands Joe the pen on eight
questions; and the August 10x plan flagged the dependency as its number-one risk ("decide the OVERT /
Glacis question"). Nothing has moved since May. v3 decides it. Full proposal and the draft note in
[`GLACIS-ALIGNMENT.md`](GLACIS-ALIGNMENT.md).

**Position: lock in.** OVERT 1.1 is the normative receipt; Beacon registers the profile; the Foundation
stays downstream, as STANDARDS.md already says. The ladder maps to the AALs. What the Foundation brings
that Glacis does not sell: the practitioners, the public-interest reference implementations, the open
corpus, and the community that hosts itself.

**Five asks of Joe, in order of cheapness:**

1. **Sign the profile.** The single blocker. Everything in P0 that says "OVERT 1.1 conformant" is a
   claim we cannot make in public until the profile is registered.
2. **Read the credential criteria before they ship**, through the Review Circle he already chairs on
   paper. A co-signed criteria document is what makes the AAL mapping credible to a reviewer.
3. **Take the level 100 page as the v1 launch artifact** — it is the smallest, most filmable thing the
   Launch Advisor seat exists for.
4. **Say together** — a joint story when the first practitioner verifies a stranger's bundle offline;
   the Foundation's standing line is *OVERT is the standard, Glacis is one implementation, we are
   another, and here are the people who can run either.*
5. **Later, not now:** whether the community's 400s can constitute a verification pool under OVERT's
   Independent Attestation Provider rules. We do not run an IAP in the ninety days (exclusion list); we
   ask the question so the answer is his.

**What we offer without being asked:** attribution stays where it is; no Foundation release touches the
standard without the Review Circle seeing it; every corpus case that exposes a gap in OVERT's domains
goes upstream as an issue against the spec, with the case number; and the Foundation never resells,
never runs a hosted service, never claims an AAL above what its own evidence shows.

**Sequence.** Publish the profile first, then talk about the credential — v1 Decision 3's "publish
first" holds. The note to Joe is a draft for Ken's voice; nothing is sent from this project.

---

## 9. Preserved from v1 and v2, by reference

| Section | What it fixes | v3 status |
|---|---|---|
| v1 §3 The rule | No direct model-to-tool path; hash binding at the broker | Unchanged |
| v1 §4 Decision 1 | Option C: Umbrella declares · Beacon decides-and-proves · Lantern reads | Unchanged; the fifth verb, *return*, from v2 |
| v1 §5 Tiers C0–C4 | Aggregation is a tier; mandatory stop conditions; fail-closed above C1 | Unchanged; **Cigna PXDX is the named aggregation test** |
| v1 §6 Decision 2 | One assurance ladder for systems | Unchanged; restated in OVERT's AAL terms (§4) |
| v1 §7 Decision 3 | Compatible, independent, not dependent | Unchanged; made concrete (§8) |
| v1 §8 Policy as code | The YAML; policy change is a governed event; deny unknown | Unchanged; the corpus's `gate` sentence is the plain-words form |
| v1 §9 The receipt | Field table; never payload content | Unchanged; `agent_id` and `authority` bound by the broker (§3) |
| v1 §11 F1–F10, N1–N7 | The build contract | Unchanged; v2 F11–F13, N8 kept; v3 adds F14–F16 below |
| v1 §12 Adversarial suite | Nine named attacks | Unchanged; each attack now cites its corpus case |
| v1 §13 Governance | Apache-2.0, DCO, RFC, spec/impl separation | Unchanged; Review Circle pre-release habit from STEWARD.md made explicit |
| v2 §5 Front door | `practice` repo, no meta-CLI | Unchanged |
| v2 §6 The return | `beacon share`, hash-only ledger, host marks | Unchanged; the ledger also mints the credential |

**Added requirements**

- F14. Every level activity ships in two paths — plain words and code — that produce byte-identical
  receipts for the same case. Enforced by a test per case.
- F15. The broker binds every action to `agent_id` and `authority`; an unbound action is a stop condition
  with a receipt. (NIST agent identity alignment; *No More Anonymous Ghosts*.)
- F16. The credential mark is a receipt on the same chain and verifies with the same offline verifier as
  any bundle. No separate badge system, ever.
- N9. Nothing in the credential path has a price. Enforced the way N6 is: a test that the flows contain
  no payment step.

---

## 10. Member services — the set

The estate's services, seen from the member's side. Each is already built or in the ninety days;
nothing on this list is new infrastructure.

| Service | What the member gets | Level(s) |
|---|---|---|
| **The Gate Check page** | Ten minutes, nothing installed, one receipt | 100 |
| **FailFest** | One verified harm a day, with the gate that would have caught it — the daily practice and the exam bank | all |
| **The practitioner test** | Ten cases, pick the verdict — the 100 warm-up, already live in the Library | 100 |
| **The level kits** | A README a stranger can follow, in two paths | all |
| **The policy catalog** | Your policy, reviewed by a steward, landed by PR, crosswalked by UCID | 200+ |
| **The verify page** (Lantern v0.2) | Paste a bundle, see it verified, read it in your lens | 300+ |
| **The GitHub Action** (Lantern v0.3) | The policy gate where engineers already look | 200+ |
| **Thursday** | First five minutes for receipts; hosts mark levels; 400s host | all |
| **The Tuesday Letter** | Loops closed by level, no names; the readiness countdown to December 2027 | all |
| **The ledger** | Your marks, verifiable offline, shareable | all |
| **NCW Camp mini-camps** | The zero-tech on-ramp; Hint-Logs as the receipts habit | pre-100 |
| **The Vendor RFI advisor** | Procurement in evidence terms; the audit-training self-audit | 300, 400 |
| **The host rota** | A Thursday of your own | 400 |

---

## 11. Decision 9 (revised) — the ninety days, and the exclusion list rewritten

Dependency order unchanged. Dates assume approval on 16 September. Additions to v2 in bold.

**P0 · days 1–30 — Level 100, whole.** T10 JCS canonicalizer first; schema v0.1 on OVERT 1.1; gate SDK
with four outcomes; hash binding; aggregation budget. The Gate Check page: rule box (plain words *and*
YAML), action box, four lens tabs, download; **VH-001 Air Canada as the default scenario**; `beacon share`;
Thursday's first five minutes. **The profile sign-off ask goes to Joe on day 1 (Ken's voice).** **The
credential criteria for 100 and 200 go to the Review Circle by day 20.** Exit: a stranger closes the 100
loop unaided in ten minutes and shows up.

**P1 · days 31–60 — Levels 200 and 300.** Python SDK on PyPI; `beacon gate init`; the retrofit guide on
the Matchmaker; Lantern renders gate decisions and diffs; the catalog's first outside PR; **Knight
Capital as the CI policy-gate exercise**. Then the broker on T0/T1/T3/T5 **with agent identity binding**;
hold queue with decay; stop conditions; gap detection; `beacon coverage`; adversarial suite green, **each
attack citing its corpus case (Cigna PXDX for aggregation, Arup for the hold)**. Ledger live, opt-in;
**credential v1 minted for 100 and 200**. Exit: an outside engineer retrofits their own agent from the
README; a 300 verifies someone else's bundle on a Thursday.

**P2 · days 61–90 — Level 400.** Offline verifier; bundle export with crosswalk; the GitHub Action; the
RFC process; the Foundation publishes its own AAL and coverage honestly; **the 400 exercise on Robodebt
and Horizon**; **credential criteria for 300 and 400 co-signed**; **the joint story with Glacis on the
first outside verification**. Exit: a third party verifies a bundle offline and says so; a 400 hosts a
Thursday.

**Explicitly not in the ninety days.** A hosted service; a dashboard product; any Independent
Attestation Provider operation; model evaluation or red-teaming; any AAL claim above what our own
evidence shows; **certifying any system or implementation against any standard; selling, pricing or
gating the practitioner credential; issuing a standard.** The people-credential is in. Everything that
looks like certifying systems or selling exams is out, and that line is part of the approval.

---

## 12. Success measures

v1's and v2's stand. v3 adds the ones only the whole-estate design can fail:

| Measure | Why it is the honest one |
|---|---|
| Members who close a 100 loop by the **plain-words path** ≥ members who close it by the code path | If only engineers finish, "no matter their skills" was a slogan |
| Profile `aigovops-beacon.v1` registered | Until it is, "conformant" is not a word we may use |
| Credential criteria for all four levels published with the steward's co-signature | The mapping to AALs is only as good as the co-signature |
| Credentials minted, by level, in the Letter, with zero identities | The count we can publish without asking |
| A 300's coverage claim reproduced by a 400 who is not us, on a public-benefits or healthcare scenario | The ladder means something where the harm was largest |
| One corpus-derived issue accepted upstream against OVERT | Alignment is a contribution, not a press release |
| Thursdays hosted by members | Learning to be practitioners, measured |

---

## 13. Risks

v1 §16 and v2 §10 stand. v3 adds:

| Risk | Mitigation |
|---|---|
| The credential reads as the certification ADR-0001 ruled out | The line is written into the exclusion list, STANDARDS.md and the criteria doc: people by the community, systems by the standard; Joe reads the criteria before they ship |
| Glacis does not sign the profile | We still build; every public claim says "targeting OVERT 1.1 conformance; profile registration pending" until it is not; §8's ask goes on day 1 so the wait is theirs, not ours |
| The AAL mapping is read as the Foundation grading systems | §4's two-sentence rule; the credential text names the *pattern*, never a system |
| The corpus's hardest cases make the 300/400 too hard and nobody finishes | 100 and 200 use the two most legible cases (Air Canada, the $1 Chevy); difficulty is in the scenario, never in the tooling; a 200 who stalls at 300 is still a 200 |
| Two skill paths double the build | The plain-words path is the corpus's `gate` field, which already exists for all 100 cases; the compile step is one function |
| The Omnibus moves the date again | The readiness promise names the obligation, not only the date; a moved date is a copy change |

---

## 14. Sixty-minute review agenda

| Time | Item |
|---|---|
| 0:00–0:05 | The rule, read aloud. The four sentences. |
| 0:05–0:12 | v1 Decisions 1–3 confirmed or reopened. |
| 0:12–0:22 | **D6 revised** — the four gates, the cases, the AAL mapping and its two-sentence rule. |
| 0:22–0:27 | **D7, D8** — front door and return, unchanged; confirm. |
| 0:27–0:40 | **D10** — the credential: in, on these terms; the exclusion list rewritten. Does the ADR-0001 line still hold for both founders? |
| 0:40–0:50 | **D11** — Glacis: lock in; the five asks; who sends the note (Ken) and when (day 1). |
| 0:50–0:57 | **D9 revised** — the ninety days; the December 2027 readiness promise. |
| 0:57–1:00 | Who does what by Friday. |

Each decision is recorded as a `design mark` step. Once approved, the exclusion list in §11 is as binding
as the roadmap.

---

## Appendix A — the public one-pager, member edition

**Ship safe AI — never unsafe AI.**

Most AI governance stops at documents. A policy says what should happen; nothing checks whether it did.
When an AI agent can send the email, move the file, or touch the account by itself, a document is not a
control — and when it decides who gets a benefit, a claim, or a loan, a document is a scandal waiting for
its inquiry.

The AiGovOps Foundation builds the missing piece, in the open and for free — and teaches you to run it.

Before an AI system does anything consequential, it has to ask. A gate checks the request against a rule
written in plain, reviewable code and answers one of four ways: go ahead, go ahead but only this far,
wait for a person, or no. Whatever it answers, it leaves a signed receipt that holds no private content
and that anyone can check, offline, without an account and without trusting us.

You can do this in ten minutes, today, in your browser, on a real case: the chatbot whose promise bound
the airline. Write the rule in your own words or in code — both work. Put the action through the gate.
Download the receipt. Read it in your language. Then bring it on Thursday and show someone. That is level
100, and it is the whole practice in miniature.

Everything after that is the same steps, deeper, on harder cases: the bot that agreed to sell a car for a dollar;
the deepfake that moved two hundred million; the insurer that denied claims faster than anyone could read
them; the benefit system that branded tens of thousands of families as fraudsters. The people who have
done it teach the people who are starting, and the marks they earn are receipts on a public chain — the
credential is evidence, not a certificate.

Three tools, four gates, one community. **Umbrella** is where you write the rules. **Beacon** is the gate
that enforces them and signs the proof. **Lantern** reads that proof back in your language. **Thursday**
is where you learn what to do next.

Everything is Apache-2.0, conforms to the open OVERT standard, runs on your own machines, and works
without an internet connection.

*Get to yes. Stay at yes. Recover to yes. Prove it in ten minutes. Then bring it, and be counted.*

## Appendix B — the copy sweep if D6, D10 and D11 are approved

One PR per repo, the same day, Cloud-Mary green. v2's list stands (site heroes and footers, three
READMEs, chatbot intents, Letter line, message-lint), plus:

- STANDARDS.md and ADR-0001's consequences line gain one sentence: *the Foundation credentials
  practitioners; it does not certify systems.*
- Beacon README: the roadmap line about AAL and IAP corrected against OVERT 1.1; profile status line
  kept honest until registration.
- v1 PRD §6: "OVERT Level 1 Core" → "AAL-1 Policy Documentation".
- The Library: the 1/0/? gate law page links the four-outcome mapping.
- Community page: the ladder, the four gates, the readiness promise, the criteria link.

## Appendix C — the note a practitioner sees before the first `beacon share`

Unchanged from v2.

## Appendix D — corpus index used in this document

VH-001 Air Canada · VH-003 Belastingdienst (toeslagenaffaire) · VH-010 Mata v. Avianca · VH-011
UnitedHealth nH Predict · VH-013 Services Australia (Robodebt) · VH-015 Arup · VH-022 Chevrolet of
Watsonville / Fullpath · VH-035 Cigna PXDX · VH-056 Knight Capital · VH-088 Post Office Horizon. All from
batch 2026-W24, verified 100 of 100, 67 primary / 33 strong-secondary.
