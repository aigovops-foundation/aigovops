# Open-Source-Unified — the Practitioner Ladder

**PRD v2 — draft for review**
Owner: Bob Rapp · Reviewers: Bob Rapp, Ken Johnston · Date: 11 September 2026
Programme: Labor-Day-Big-Redesign · Project: Open-Source-Unified-Sept-2026 · Status: **decide**
(nothing here is live; no code has changed)
Supersedes: [`PRD-PREPEND-PROVE-IT-GATE.md`](PRD-PREPEND-PROVE-IT-GATE.md) (v1, 10 Sept) on persona,
packaging and roadmap. v1's architecture — the rule, the tiers, the assurance ladder, the OVERT posture,
the policy schema, the receipt, the requirements and the adversarial suite — is kept whole and referenced
by section number below rather than restated.

---

## 0. Summary in one paragraph

v1 gave the Foundation's three open-source projects one architecture and one rule. v2 changes what the
architecture is *for*. It is not for a manager persona and it is not for the three repos; it is for a
**practitioner**, at whatever level they are at — 100, 200, 300 or 400 — who needs a small set of simple
tools to **begin practising every part of AiGovOps at once**, and whose practice, by design, brings them
back to the community where they learn to be practitioners. Every level touches all five parts of the
practice — *declare, decide, prove, read, return* — at increasing depth, with the same three project names
and the same handful of commands throughout. Level 100 is the Gate Check service. Level 400 is a steward
who hosts Thursday. The ninety days are re-cut so that each arc ships one whole level, not one layer of
the stack. The message does not change: *get to yes, stay at yes, recover to yes, prove it in ten minutes.*
What changes is who the sentence is addressed to, and where the tools send them next.

---

## 1. What changed from v1 — the altered logic

| | v1 (10 Sept) | v2 (this document) |
|---|---|---|
| Organising principle | The architecture (the Gate) and the three repos | The practitioner and their level of practice |
| Who it is for | One primary early member: a manager governing AI agents | Anyone, placed on a four-rung ladder by practice, not by job title |
| Unit of adoption | A project (install Beacon, then Lantern, then Umbrella) | A level (a kit of simple tools that exercises every part at once) |
| What "complete" means | A stranger produces a bundle in ten minutes | A stranger produces a bundle in ten minutes *and comes back on Thursday* |
| Roadmap arcs | Layers of the stack: gate → broker → verifier | Whole levels: 100 → 200 + 300 → 400, each usable on the day it ships |
| Role lenses | The audience segmentation | Lenses stay; they are *how you read*, never *how far you are* |
| The community | Service #3 of four, downstream of the Gate Check | The learning mechanism; every tool at every level ends by returning the practitioner to it |
| Depth model | Additive: more features over time | Spiral: the same five parts at every level, deeper each time; no level adds a new noun |

Three sentences carry the whole change. **Each practitioner starts where they are.** **Each level practises
all the parts, not one part.** **The tools bring you back, because the community is where you become a
practitioner — the tools only get you started.**

---

## 2. The practitioner, not the persona

v1's persona was right about the need (a ten-minute value test with a tangible take-home) and too narrow
about the person. v1's own reference implementations already contradict it: a program officer at a small
nonprofit, the rural and Indigenous programmes behind the Matchmaker, a university research group with a
coding agent — plus the four lenses Lantern already ships for the engineer, the compliance lead, the
auditor and the regulator. They are not one persona. They are one *practice* at four depths.

A **practitioner** is anyone who has run the loop once — declared a rule, put an action through a gate,
kept the receipt, read it back, and brought it to someone else. That definition does not mention a job,
a company size, or a vendor. It is the only membership test the ladder needs.

A **level** describes how far a practitioner's practice reaches, never how good their system is. This
matters because v1 Decision 2 correctly refused a fourth assurance ladder for *systems*. The 100–400
ladder is on a different axis — people — and section 4 keeps them apart with a rule: **no level number is
ever a claim about a system's assurance.** Systems get OVERT levels and a gate coverage number. People get
a practice level. The two never appear in the same sentence.

---

## 3. The rule, and the five parts of the practice

The rule is unchanged from v1 §3 and is read aloud at the top of every review:

> **No direct model-to-tool path for consequential actions.**

What v2 adds is the practitioner's view of the loop that makes the rule true. Five parts. Every level
practises all five; the depth changes, the parts do not.

| Part | Verb | Project | What the practitioner actually does |
|---|---|---|---|
| 1 | **Declare** | Umbrella | Writes a rule in reviewable code — an action, a tier, a decision |
| 2 | **Decide** | Beacon | Puts a real action through the gate and gets one of four answers |
| 3 | **Prove** | Beacon | Keeps the signed receipt; later, the chain; later, the coverage number |
| 4 | **Read** | Lantern | Reads the receipt back in their own lens — engineer, compliance, auditor, regulator |
| 5 | **Return** | the Community | Brings the artifact to other practitioners; is seen doing it; learns the next step from them |

Part 5 is the alteration. In v1 the loop ended at the receipt and the site's loop picked up separately
(story → build → Gate Check → subscribe → membership → cohort welcome → Thursday → recap → next story).
In v2 the tools *are* the on-ramp to that loop: every kit's last command ends with the practitioner
holding something to show on Thursday and an explicit invitation to show it. The community is not
downstream of the tools. It is the fifth part of the practice, and the one where the learning happens.

Option C from v1 §4 (Umbrella declares · Beacon decides-and-proves · Lantern reads) is preserved exactly;
v2 only names the fifth verb and gives it a home.

---

## 4. Decision 6 — the ladder

Four levels, numbered the way courses are numbered so nobody has to explain the ordering. Each row is a
whole practice, not a feature list. The **tools** column is deliberately short: the discipline of v2 is
that a level never adds a noun, only depth on the same five verbs.

| Level | Name | Who arrives here | Practises all five parts as… | Simple tools (all there is) | Time | Take-home | The return |
|---|---|---|---|---|---|---|---|
| **100** | **Begin** | Anyone. The manager from 1 Sept, a student, a compliance lead, an engineer's first look | Declare one rule · decide one action · prove one receipt · read it in one lens · bring it | The Gate Check page in the browser. Nothing installed. | 10 min | `bundle-<hash>.zip` with `VERIFY.md` | The bundle hash goes on your Gate Card; cohort welcome; **show the receipt in the first five minutes of Thursday** |
| **200** | **Retrofit** | A 100 who has an agent, a script, or a workflow of their own | Declare a real policy with tiers · gate your own tool calls · keep a per-session chain · diff two runs · publish | `pip install aigovops-beacon` · `beacon gate init` · `gate.check()` in your code · `beacon gate check` · `lantern read` / `lantern diff` | 30 min | Your `policy.yaml`, one chain, one diff | Your policy lands in the community catalog by PR; **your story ships through the content pipeline**; you pair with a 100 on Thursday |
| **300** | **Hold** | A 200 whose agent touches people, money, or rights | Declare C3 with a named approver and budgets · hold and release · prove both with gap detection · read as auditor and regulator · verify someone else's | `beacon hold list` / `release` · budgets in `policy.yaml` · the broker on the Library's `SecretsProvider` · `beacon gate test --adversarial` · `beacon coverage` | 1 week of real traffic | A coverage claim: *gate coverage 9x% over 30 days* | **You verify another practitioner's bundle on Thursday and say so**; you mentor a 200 |
| **400** | **Prove it to a stranger** | A 300 who is ready to steward | Contribute a crosswalk or UCID to Umbrella · run a reference implementation end to end · publish a public offline verification · write a lens · host | `beacon verify --offline` · `umbrella-conformance bundle` · the GitHub Action (Lantern v0.3) · the RFC process | Ongoing | A public verification statement with your name on it; a steward role | **You host a Thursday**; you land a contributor's PR; you mark a 300's step |

Three rules keep the ladder honest:

- **Every level is the whole loop.** A 100 who has only declared a rule is not a 100 yet. The level is
  granted for the loop closed, never for a part completed.
- **Levels are marked in the community, not self-certified.** A host marks a step the way `design mark`
  marks a programme step: ledgered, reversible, attributable. The tools make the artifact; the people make
  the mark.
- **Nothing at any level is a system claim.** A 400 practitioner can be running a system at OVERT Level 1
  with 40% gate coverage, and must say so.

**Recommendation:** adopt the four levels and the three rules as written. Appendix B lists the copy that
changes on the site, in the READMEs and in the chatbot intents if this is approved.

---

## 5. Decision 7 — the simple tools, and one front door

v1 §11 F2 already committed to a Python gate SDK with a documented wire protocol. v2 adds the
practitioner's constraints on top of it:

- **One install per level, and level 100 has none.** Beacon's home page is already a self-running
  demo that generates a key, signs with JCS and assembles a real downloadable bundle client-side. Level 100
  is that page with one rule box and one action box added, and a Lantern render in four lens tabs. It is
  the Gate Check service, made literal.
- **Five verbs, three names, at every level.** `declare` is a file in Umbrella's YAML. `decide` and
  `prove` are `beacon gate …`. `read` is `lantern …`. `return` is `beacon share` — which does exactly one
  thing: prints the bundle hash and the Thursday link, and, if the practitioner opts in, posts the *hash*
  (never the bundle, never a payload) to their Gate Card. Nothing else ships under a new name.
- **The 100 bundle must verify with the 400 tool.** No mock receipts, no demo-only schema. The browser
  page and the offline verifier share the same spec and the same fixtures. This is what makes the ladder
  one thing rather than a tutorial track next to a product.
- **The kits are directories, not a product.** Each level is a directory in one repo (`levels/100-begin`
  … `levels/400-prove`), each holding a README a stranger can follow, the example policy, the runnable
  script and the expected bundle. The kits only *call* Umbrella, Beacon and Lantern; they never fork them.

**The front door — the one real naming decision in v2.** Working name for the project is
`Open-Source-Unified-Sept-2026`. Two options for the public repo that holds the kits:

- **Option 1 — recommended: `aigovops-foundation/practice`.** One new repo, no new tool. Its README is
  the ladder table above. Each level directory is the kit. The three engines keep their names, their
  taglines and their release cadences. Adds one noun the site already uses ("practice") and zero
  commands.
- **Option 2: a meta-CLI `aigovops`** that wraps the three. *Cost:* a fourth tool to version, document
  and explain, and exactly the name sprawl v1 Decision 1 spent a page avoiding.

Whichever is chosen, `reference/` from v1 §13 moves inside the kits: reference implementation 1 *is* the
100 scenario, implementation 2 *is* the 200 worked example, implementation 3 *is* the 400 GitHub Action.
They stop being a fourth thing to maintain.

---

## 6. Decision 8 — the return: how the tools bring practitioners back

This is the part v1 did not have, and the part that decides whether the ladder produces practitioners or
downloads. The mechanism has to be built into the tools, cheap for the founders, and honest about what it
records.

**The practitioner ledger.** When a practitioner closes a loop, `beacon share` can append one receipt to
the Foundation's own chain: action `practice.complete`, tier C1, payload hash only, signed by the
Foundation key. It records *that* a loop was closed at a level, by a key the practitioner controls, at a
time — and nothing else. No name, no bundle, no content. The practitioner keeps the pairing between their
key and their name; the community sees a hash until they choose to show the receipt on Thursday.

Why this and not a database of members:

- It is the architecture eating its own cooking. The Foundation's community is governed by the same
  receipts it asks a grantee to trust.
- Zero-egress by construction, so a practitioner inside a regulated employer can take part without
  asking anyone.
- `jeeves numbers` can count it for the Tuesday Letter without the Letter learning anyone's identity.
- A host's mark ("Priya is now a 300") is itself a `practice.mark` receipt with the host as approver —
  the same hold-and-release shape as v1 §5's C3, applied to people.

**The four returns**, one per level, each a single command's last line:

| After… | The tool's last line says | Which feeds the redesign loop at |
|---|---|---|
| 100 | *Your bundle hash is on your Gate Card. Bring it Thursday 09:00 — the first five minutes are for receipts.* | Gate Check → subscribe → cohort welcome → Thursday |
| 200 | *Your policy is a PR. Your story is a draft in the content folder. Pair with a 100 Thursday.* | story.md → build → recap → next story |
| 300 | *Pick a bundle from the catalog and verify it before Thursday. Say what you found.* | Thursday ritual → recap |
| 400 | *You are on the host rota. The next Thursday is yours.* | Thursday ritual, hosted by a member, not a founder |

The last row is the strategic one. Ken hosts Thursday today. The ladder exists so that within ninety days
a 400 hosts one, and within a year most of them are hosted by 400s. That is what "learning to be
practitioners" cashes out to: the community teaches itself, and the founders keep the two jobs the
redesign left them — Ken writes and clicks Publish; Bob says yes or no.

**Recommendation:** adopt the practitioner ledger as opt-in from day one, with the host mark as the only
way a level changes. Appendix C has the privacy note a practitioner sees before opting in.

---

## 7. Preserved from v1, by reference

These sections of v1 are adopted into v2 unchanged. They are listed so the review can skip them and so a
reader of v2 alone knows where the engineering truth lives.

| v1 section | What it fixes | v2 status |
|---|---|---|
| §3 The rule | No direct model-to-tool path; hash binding at the broker | Unchanged |
| §4 Decision 1 | Option C: Umbrella declares · Beacon decides-and-proves · Lantern reads | Unchanged; v2 adds the fifth verb, *return* |
| §5 Tiers C0–C4 | Aggregation is a tier; mandatory stop conditions; fail-closed above C1 | Unchanged |
| §6 Decision 2 | One assurance ladder for systems: OVERT levels + gate coverage | Unchanged; v2 §2 adds the people/systems separation rule |
| §7 Decision 3 | Compatible, independent, not dependent toward OVERT/Glacis; zero-egress | Unchanged |
| §8 Policy as code | The YAML sketch; policy change is a governed event; deny unknown | Unchanged; the 100 kit's rule is a three-line subset of it |
| §9 The receipt | Field table; never payload content | Unchanged; the ledger uses the same shape |
| §11 Requirements F1–F10, N1–N7 | The build contract | Unchanged; v2 adds F11–F13 below |
| §12 Adversarial suite | Nine named attacks, each with a test before P0 closes | Unchanged; becomes the 300 kit's `--adversarial` |
| §13 Open-source governance | Apache-2.0, DCO, RFC process, spec/impl separation | Unchanged; `reference/` folds into the kits |

**Added requirements**

- F11. Each level kit runs end to end from its README by a stranger, with no founder present, in the
  time stated in section 4. Tested by a named person who is not us, before the level is called shipped.
- F12. `beacon share` and the practitioner ledger: hash-only, opt-in, revocable by the practitioner
  deleting their key, counted by `jeeves numbers`.
- F13. The browser bundle from level 100 verifies with the offline verifier from level 400 — one spec,
  one fixture set, enforced in CI across both repos.
- N8. A level never introduces a new tool name. Enforced by the site's message-lint tier the same way the
  one-message copy is.

---

## 8. Decision 9 — the ninety days, re-cut by level

v1 cut the ninety days by layer of the stack: gate, then broker, then verifier. That order is still the
dependency order and it does not change. What changes is what each arc *ships*: a whole level a stranger
can use on the day it lands, not a layer that only means something once the next one arrives. Dates assume
approval on 16 September.

**P0 · days 1–30 — Level 100, whole.**
T10 JCS canonicalizer lands first and nothing else starts until it is green (unchanged). Then the pieces
level 100 cannot fake: intent and receipt schema v0.1 on OVERT 1.1; gate SDK with four outcomes; hash
binding; the aggregation budget (closed in P0 because it is the most likely bypass, unchanged from v1).
Then the level itself: the Gate Check page grows a rule box, an action box and four lens tabs; the grant
assistant scenario becomes the page's default; `beacon share` prints the hash and the Thursday link; the
first five minutes of Thursday become receipt time. **Exit test:** a stranger closes the 100 loop, unaided,
in ten minutes, and shows up.

**P1 · days 31–60 — Levels 200 and 300.**
Python SDK on PyPI; `beacon gate init` scaffold; the retrofit guide, written against the Matchmaker so
reference implementation 2 and the 200 worked example are one artifact; Lantern renders gate decisions and
`diff` works across two runs; the community policy catalog accepts its first PR. Then 300: broker contract
on the Library's existing secrets, capability and sandbox primitives; hold queue with expiry; stop
conditions complete with tests; chain gap detection; `beacon coverage`; the adversarial suite green and
exposed as `beacon gate test --adversarial`. The practitioner ledger goes live, opt-in. **Exit test:** one
outside engineer retrofits their own agent from the 200 README without us; one 300 verifies someone else's
bundle on a Thursday and says so.

**P2 · days 61–90 — Level 400.**
Offline verifier released; evidence bundle export with framework crosswalk; the GitHub Action (Lantern
v0.3, reference implementation 3); the RFC process opens; we publish our own OVERT level and gate coverage
honestly. **Exit test:** one third party verifies a bundle offline and publishes that they did; one 400
hosts a Thursday.

Anything not on this list is P3. Explicitly **not** in the ninety days, unchanged from v1 and extended by
one line: a hosted service, a dashboard product, a certification business, model evaluation or
red-teaming, any claim above OVERT Level 1 — **and any badge, credential or exam.** Levels are marks made
by hosts on Thursday. The moment they are sold, or self-issued, the ladder is a fourth assurance scheme
and v1 Decision 2 was for nothing.

---

## 9. Success measures, per level

v1's measures (a stranger's ten-minute bundle; three reference implementations; one external
verification; coverage above 95% on our own systems; one outside contributor; zero payload content by
test) all stand. v2 adds the ones only a ladder can fail:

| Level | The number | Why it is the honest one |
|---|---|---|
| 100 | Share of people who close the 100 loop **and appear on a Thursday** within 14 days | A download is not a practitioner; a receipt shown to a person is |
| 200 | Policies landed in the catalog by people who are not us | The retrofit path is the path most adopters are on (v1 §10) |
| 300 | Bundles verified by a practitioner *other than the one who made them* | The community checks itself before a regulator does |
| 400 | Thursdays hosted by a member, not a founder | The only measure of "learning to be practitioners" that cannot be gamed |
| all | Ledger receipts counted by `jeeves numbers` in the Tuesday Letter, with zero identities in the Letter | Growth we can publish without asking anyone's permission |

---

## 10. Risks

v1 §16's table stands. The ladder adds four of its own.

| Risk | Mitigation |
|---|---|
| The ladder reads as a certification and collides with the system tiers | Section 2's separation rule; levels never appear beside OVERT levels or coverage numbers; no badge, ever |
| Level 100 becomes a demo that does not verify, and the ladder is a tutorial next to a product | F13: the browser bundle verifies with the offline verifier, enforced in CI in both repos |
| Nobody returns; the tools work and the Thursdays are empty | The return is the tool's last line, not a newsletter; the first five minutes of Thursday are reserved for 100s; measured at 14 days |
| The ledger is read as surveillance | Hash-only, opt-in, revocable by deleting a key; the privacy note in Appendix C is shown before the first share |
| Founders host forever | P2 exit test is a member-hosted Thursday; the rota is a 400 tool, not a founder task |
| Two founders, limited hours (unchanged) | P0 is one level, one page, one scenario; nothing in 200–400 starts until a stranger has closed the 100 loop |

---

## 11. Sixty-minute review agenda

Decisions 1–5 from v1 are taken first, as scheduled for 16 September, because v2 depends on them. If the
founders want a single session, the agenda below folds both.

| Time | Item |
|---|---|
| 0:00–0:05 | The rule, read aloud. Then the three sentences from §1, read aloud. |
| 0:05–0:15 | v1 **Decisions 1–3** (Option C; one assurance ladder; OVERT posture). Confirm or reopen. |
| 0:15–0:30 | **Decision 6** — the four levels and the three rules. Does "every level is the whole loop" survive? |
| 0:30–0:40 | **Decision 7** — one front door: `practice` repo, no meta-CLI; the 100 bundle verifies with the 400 tool. |
| 0:40–0:50 | **Decision 8** — the return: the practitioner ledger, opt-in, hash-only; host marks are the only level changes. |
| 0:50–0:58 | **Decision 9** — the ninety days by level, and the extended exclusion list (no badges, credentials, exams). |
| 0:58–1:00 | Who does what by Friday. Ken: the Thursday five-minute receipt slot and the host rota copy. Bob: T10, the `practice` repo, the 100 page. |

Each decision is recorded as a `design mark` step. Once approved, the exclusion list in section 8 is as
binding as the roadmap.

---

## Appendix A — the public one-pager, practitioner edition

**Ship safe AI — never unsafe AI.**

Most AI governance stops at documents. A policy says what should happen; nothing checks whether it did.
When an AI agent can send the email, move the file, or touch the account by itself, a document is not a
control.

The AiGovOps Foundation builds the missing piece, in the open and for free — and teaches you to run it,
in the open and for free.

Before an AI system does anything consequential, it has to ask. A gate checks the request against a rule
written in plain, reviewable code and answers one of four ways: go ahead, go ahead but only this far,
wait for a person, or no. Whatever it answers, it leaves a signed receipt. The receipt holds no private
content, so it is safe to hand to a funder, a regulator, or a customer. Anyone can check it, offline,
without an account and without trusting us.

You can do this in ten minutes, today, in your browser. Write one rule. Put one action through the gate.
Download the receipt. Read it in your own language — engineer, compliance, auditor, regulator. Then bring
it on Thursday and show someone. That is level 100, and it is the whole practice in miniature.

Everything after that is the same five steps, deeper: gate your own agent; hold the risky actions for a
person and prove you did; verify a stranger's proof and let a stranger verify yours. The people who have
done it teach the people who are starting. Nobody sells you a badge.

Three tools, five steps, one community. **Umbrella** is where you write the rules. **Beacon** is the gate
that enforces them and signs the proof. **Lantern** reads that proof back in your language. **Thursday**
is where you learn what to do next.

Everything is Apache-2.0, conforms to the open OVERT standard, runs on your own machines, and works
without an internet connection.

*Get to yes. Stay at yes. Recover to yes. Prove it in ten minutes. Then bring it.*

---

## Appendix B — the copy sweep if Decision 6 is approved

One PR, one commit, Cloud-Mary green, the same day — the rule from v1 §4 applies unchanged.

- Site: the Gate Check card on every hero and all 22 footers gains *"Level 100 · ten minutes"*; the
  Community page gains the ladder table; the Thursday event copy reserves the first five minutes for
  receipts; the chatbot's routing intents learn "what level am I" and "how do I get to 200".
- READMEs: each of the three repos gains one line under its title — *"Part of the AiGovOps practice.
  Start at level 100: <link>."* Taglines, verbs and release cadences do not change.
- The Tuesday Letter gains one line from `jeeves numbers`: loops closed this week, by level, no names.
- `tests/message-lint.txt` gains the four level names and the five verbs, and rejects any new tool noun.

## Appendix C — the note a practitioner sees before the first `beacon share`

> Sharing appends one signed line to the Foundation's public chain. The line says that a key you control
> closed a level-N loop at this time. It does not contain your name, your bundle, your policy or anything
> you gated. Nobody can connect the key to you unless you show them. Deleting the key ends the connection.
> You can practise every level without ever sharing; the only thing sharing does is let a host mark your
> level on Thursday.

## Appendix D — v1 → v2 crosswalk for the reviewers

| v1 | v2 |
|---|---|
| §1 Why now — three forces | Unchanged; a fourth force is the people who actually showed up (§2) |
| §2 Where the projects stand | Unchanged; note Beacon's browser demo is the seed of level 100 |
| §10 Decision 4 — three reference implementations | Kept; they become the 100 scenario, the 200 worked example and the 400 GitHub Action (§5) |
| §14 Decision 5 — ninety days by layer | Re-cut by level (§8); the dependency order is identical |
| §15 Success measures | Kept; per-level measures added (§9) |
| §17 Agenda | Folded (§11) |
| Appendix A one-pager | Practitioner edition (Appendix A) |
| Appendix B Option A fallback | Still applies to v1 Decision 1; unchanged |
