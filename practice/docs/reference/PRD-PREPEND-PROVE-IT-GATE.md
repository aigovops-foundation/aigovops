# Get to Yes via the Pre-pend–Prove-it Gate

**PRD v1 — draft for review**
Owner: Bob Rapp · Reviewers: Bob Rapp, Ken Johnston · Date: 10 September 2026
Programme: Labor-Day-Big-Redesign · Status: **decide** (nothing here is live; no code has changed)
Repo home when approved: `docs/PRD-PREPEND-PROVE-IT-GATE.md` in the Omni repo, mirrored to the site as a story

> **Note (11 Sept 2026):** this is the v1 source thinking, preserved verbatim. It is superseded on
> persona, packaging and roadmap by [`PRD-OPEN-SOURCE-UNIFIED.md`](PRD-OPEN-SOURCE-UNIFIED.md) (v2,
> the practitioner ladder), which keeps sections 3, 5–9, 11–13 of this document as its architecture
> by reference.

---

## 0. Summary in one paragraph

The Foundation's three open-source projects were built bottom-up and now overlap. This PRD gives them
one architecture and one rule: **for any consequential AI action, there is no direct path from the model
to the tool.** Every consequential action is proposed as a structured intent, decided against policy
before it runs, executed by a broker that can only do the thing that was approved, and left behind as a
signed receipt anyone can verify offline. Umbrella declares the policy, Beacon decides and signs, Lantern
reads the result back in the reviewer's own language. That is the Pre-pend–Prove-it Gate, and it is the
engineering expression of the message we already agreed on: *get to yes, stay at yes, recover to yes,
prove it in ten minutes.*

---

## 1. Why now

Three forces have converged since June:

1. **The projects drifted.** Beacon, Lantern and Umbrella each grew a sensible scope on its own. Read the
   three repo descriptions side by side and a newcomer cannot tell which one they should install first,
   or what the other two add. The site has at least one stale rename still visible on the Umbrella-GovOps
   page.
2. **The market moved from documentation to evidence.** Glacis published OVERT 1.0 in June 2026 and is
   now at 1.1 — an open, royalty-free standard for runtime proof that defines six governance domains and
   four assurance levels (overt.is). Their own framing is that policies and dashboards cannot prove what
   an AI workflow did, and that runtime controls and signed receipts can. Our Beacon receipts already use
   the OVERT 1.0 envelope in Lantern's test fixtures. We are closer to this world than we have said out loud.
3. **We know who we are building for.** The 1 September design sync named the primary early member: a
   manager trying to govern AI agents, whose unmet need is a ten-minute value test with a tangible
   take-home artifact. A signed receipt bundle produced by a real gate decision *is* that artifact.

What is missing is not more governance content. It is a single technical claim that is ours, that is
checkable, and that a stranger can reproduce in ten minutes.

---

## 2. Where the three projects actually stand today

This matters because the proposal below either preserves or breaks shipped work.

| Project | Repo | What it is today |
|---|---|---|
| **Beacon** | `aigovops-foundation/aigovops-beacon` | Verifiable AI governance — discover, sign, hand the auditor a bundle. The signer. Emits NDJSON receipts on the OVERT 1.0 envelope. |
| **Lantern** | `aigovops-foundation/aigovops-lantern` | Python CLI, v0.1.1, 103 tests / 87% coverage, Apache-2.0, DCO enforced. `read`, `diff`, `explain`; four role lenses (engineer, compliance, auditor, regulator); text/markdown/json output. Tagline in every release note: **"Beacon signs. Lantern reads."** v0.2 web viewer and v0.3 GitHub Action are open issues. |
| **Umbrella** | `aigovops-foundation/umbrella-govops` | Governance as executable code — YAML policy orchestration mapping NIST AI RMF and EU AI Act to CI/CD checks, with signed evidence bundles. Holds the UCID registry that `lantern explain` reads. |

Also in the estate and relevant: the **AiGovOps Library** (private, ticket-by-ticket) already has the
runtime primitives this architecture needs — `SecretsProvider` (T0), gate ↔ secrets wiring (T1), the
capability dial with hard caps (T5), and the process sandbox boundary (T3). **T10, the JCS canonicalizer,
is the next Library ticket and is a hard dependency of everything here** — it is the root cause of the
sign/verify bugs found during T3, and a receipt chain that cannot canonicalize cannot be verified by a
stranger.

**The honest conflict.** The draft that prompted this PRD proposed making Lantern the pre-action
enforcement layer. Lantern is already shipped as the reader. Reassigning it would orphan a tested CLI,
invalidate its install instructions, and contradict the one sentence we have repeated in every release.
Section 4 resolves this as an explicit decision rather than a silent rename.

---

## 3. The rule

> **No direct model-to-tool path for consequential actions.**

Everything else in this document exists to make that rule true, checkable, and cheap to adopt.

```
  model or agent
        │  proposes a structured action intent
        ▼
  ┌───────────────────────────────────────────────┐
  │  THE GATE                                     │
  │  policy decision before anything runs         │
  │  allow · constrain · hold for a human · deny  │
  └───────────────────────────────────────────────┘
        │  decision bound to the hash of this exact payload
        ▼
  bounded broker / sandbox
        │  executes only the approved action, with only the
        │  credentials that action needs, for only as long as it needs them
        ▼
  signed receipt  ──▶  chained, verifiable offline, no payload inside
        │
        ▼
  policy catalog, assurance reporting, next policy revision
```

The load-bearing detail is the binding. The broker refuses to execute anything whose canonical hash does
not match the payload the gate approved. Without that binding, a gate is advisory and an agent can drift
between the decision and the act.

---

## 4. Decision 1 — project boundaries

Three options. All three keep Umbrella where it is.

**Option A — as originally drafted.** Umbrella governs · Lantern gates · Beacon proves.
*Cost:* contradicts shipped Lantern v0.1.1, orphans the role-lens reader that auditors already like,
breaks "Beacon signs, Lantern reads" everywhere it appears, and confuses anyone who has installed the CLI.

**Option B — add a fourth component.** Keep Beacon and Lantern as they are; introduce a new gate project.
*Cost:* a fourth name to explain on a site where we have just finished collapsing to one message and four
services. Name sprawl is the failure mode we are trying to fix.

**Option C — recommended. Declare · Decide-and-prove · Read.**

| | Verb | Scope |
|---|---|---|
| **Umbrella** | declares | Policy as code, the UCID registry, framework crosswalks, capability thresholds, the inventory of governed systems, the incident and procurement workflows. The place a policy is written and reviewed. |
| **Beacon** | decides and proves | The gate SDK and the broker contract, plus the receipt it already signs. New surface: `beacon gate check`. Decision and receipt are one act — separating them creates a window in which a decision exists with no proof. |
| **Lantern** | reads | Unchanged. Gains one thing: gate decisions render in all four role lenses, and `lantern diff` can show what changed between two gate runs. |

Option C costs no rework of shipped semantics, gives the Gate Check service a literal command
(`beacon gate check` produces the ten-minute take-home bundle), and leaves Lantern's v0.2 web viewer and
v0.3 GitHub Action issues intact — they become the viewer and the CI wrapper for gate decisions.

**Recommendation: Option C.** The rest of this PRD is written in Option C's terms. Appendix B lists what
changes if the founders pick A instead.

Whichever is chosen, one PR sweeps every page on the site, every README, and the chatbot intent copy in
the same commit. Half a rename is worse than no rename, and we already have one visible on the
Umbrella-GovOps page.

---

## 5. Action taxonomy and consequence tiers

Policy is unusable if every action is treated the same. Five tiers, and the tier is what selects the
control, not the model or the vendor.

| Tier | Description | Default gate behaviour |
|---|---|---|
| **C0** | Read-only, ephemeral, no external side effect | Allow; receipts sampled, not required |
| **C1** | Internal write, fully reversible | Allow with constraints; receipt required |
| **C2** | External effect on a system or a person, reversible | Constrain + rate limit + budget; receipt required |
| **C3** | Irreversible, financial, or rights-affecting | Hold for a named human; receipt required for the hold *and* the release |
| **C4** | Prohibited by policy | Deny; receipt required (a denial is evidence too) |

Rules that follow from the tiers:

- **Aggregation is a tier.** N C1 actions that together equal a C3 action get treated as C3. Every gate
  keeps a cumulative budget per session, per agent, per subject. This is the single most likely bypass
  and it must be closed in P0, not later.
- **Stop conditions are mandatory, not configurable:** unknown tier, policy fetch failure on C2+,
  expired or unreadable credential, canonicalization failure, hash mismatch at the broker, budget
  exhausted, signing key unavailable. Each produces a deny plus a receipt recording why.
- **Fail-closed above C1.** C0 and C1 may fail open if the deployer configures it, and the receipt
  records that it ran in degraded mode. C2 and above never fail open.

---

## 6. Decision 2 — one assurance ladder, not three

The originating draft proposed a six-rung Foundation ladder (A0–A5). We should not ship it. We would then
have three ladders in public at once: OVERT's four assurance levels, the site's three certification tiers
(Compatible / Certified / Verified), and a new A0–A5. Nobody outside the Foundation would know what a
claim meant, which is exactly the confusion the whole architecture is meant to end.

**Proposal:** borrow the ladder, own the coverage number.

- **Assurance level:** adopt OVERT's four levels verbatim and state ours honestly. Glacis scopes its own
  runtime product at OVERT Level 1 Core; a nonprofit claiming more than a funded vendor would not survive
  contact with a reviewer.
- **Gate coverage:** the percentage of consequential actions (C2+) in a given system that were decided by
  a gate and left a verifiable receipt. This is ours, it is a single number, it is measurable from the
  receipts themselves, and it is the honest answer to "how governed is this system, really."
- **Certification tiers** stay as they are on the site, and are redefined in terms of the two numbers
  above so all three finally mean one thing.

A claim then reads: *OVERT Level 1, gate coverage 96% over 30 days, verified by <name>.* That is a
sentence a procurement reviewer can check.

---

## 7. Decision 3 — interoperability posture toward OVERT and Glacis

**Proposal: compatible, independent, not dependent.**

- We target OVERT 1.1 conformance for our receipt envelope and say so publicly. It is published
  royalty-free and citable, which is precisely the condition under which a Foundation should adopt rather
  than fork.
- We keep the Foundation's own verifier, so nothing we publish requires a Glacis account, a Glacis
  dashboard, or any hosted service — ours or theirs — to check.
- We stay implementation-neutral in all docs: OVERT is a standard we conform to, Glacis is one
  implementation of it, and we are another. We do not position against them and we do not resell them.
- We contribute upstream where our public-interest use cases expose gaps in the standard (community
  nonprofits, rural and Indigenous programmes, university research) — those users are not in a commercial
  vendor's core market, and that is exactly where a foundation earns its standing.
- **Zero-egress by design**, same posture as OVERT: receipts carry hashes and ranges, never prompts,
  never responses, never payloads. This is not only a privacy property; it is what makes a receipt safe
  for a grantee to hand to a funder.

Open question for Ken: do we approach Glacis about a formal liaison before or after we publish
conformance? Recommendation: after. Publish first, then talk, so the conversation is about two working
implementations rather than an intention.

---

## 8. Policy as code

Policy lives in Umbrella, in the YAML it already uses, extended with the gate vocabulary. Sketch:

```yaml
policy: grant-assistant-v1
applies_to:
  system: community-grant-assistant
  agents: ["drafting-agent", "budget-agent"]
controls:
  - ucid: UCID-ACT-001            # crosswalks to NIST AI RMF + EU AI Act in the registry
    action: email.send
    tier: C3
    decision: hold
    approver_role: program_officer
    constraints:
      recipients_max: 1
      attachments: deny
      budget: { per_session: 3, per_day: 20 }
  - ucid: UCID-ACT-014
    action: document.write
    tier: C1
    decision: allow
    constraints:
      path_allow: ["drafts/**"]
      path_deny: ["submitted/**", "**/*.signed.*"]
  - ucid: UCID-ACT-031
    action: payment.*
    tier: C4
    decision: deny
    reason: "No agent in this system may move money. Ever."
stop_conditions: [unknown_action, policy_unavailable, hash_mismatch, budget_exhausted, key_unavailable]
receipts:
  required_from_tier: C1
  chain: per_session
```

Three properties this schema must hold to:

1. **A policy change is itself a governed event** with its own receipt, so "who weakened the rule and
   when" is answerable. Policy PRs require review by a steward and the merge emits a receipt.
2. **Deny is default for unknown actions.** An action not in the catalog is not a C0.
3. **Policies validate in CI** before they can be merged — Umbrella already runs CI checks, so this is an
   extension of a working pattern, not a new one.

---

## 9. The receipt

One object, appended to a per-session chain. Field names illustrative; the normative shape is whatever
OVERT 1.1 requires plus our extensions in a namespaced block.

| Field | Purpose |
|---|---|
| `seq`, `prev_hash` | Chain position. Gaps are detectable, which is what makes receipt suppression an attack that fails loudly. |
| `action_hash` | Canonical hash (JCS) of the exact action payload. The broker re-computes this and refuses on mismatch. |
| `tier`, `ucid[]` | What kind of action, and which controls applied. |
| `decision` | allow / constrain / hold / deny |
| `constraints_applied[]` | What was actually narrowed, not what was available |
| `approver` | Present only for holds; identity plus the time of release |
| `policy_id`, `policy_hash` | Which version of which policy decided this |
| `stopped_by` | Populated when a stop condition fired |
| `degraded` | True when a lower tier ran fail-open |
| `ts`, `key_id`, `sig` | Signing metadata |

Never in a receipt: prompt text, model output, file contents, personal data. If a reviewer needs to see
content, they get it from the deployer's own system, matched by hash.

---

## 10. Decision 4 — the first three reference implementations

The rule for choosing these: each must be a real public-interest use, must produce a take-home bundle in
under ten minutes, and should reuse something we already have rather than inventing a repo.

1. **Community grant assistant.** A small nonprofit drafts a grant application with an agent. The gate
   holds `email.send` for a program officer and denies anything that touches money. Take-home artifact:
   the bundle that proves no agent submitted anything a human had not released. Closest to the Gate Check
   demo and the easiest to film.
2. **Global Inclusion Matchmaker, gated.** We already have the repo — the G20 rural and Indigenous
   resource app. Adding a gate to an existing public-interest app is a stronger demonstration than a
   greenfield one, and it shows the retrofit path, which is the path most adopters are actually on.
   *(Proposed in place of the originally drafted rural health assistant: health data raises consent and
   PHI questions that would slow the first ninety days, and we can reach the same audience without them.)*
3. **University research coding agent.** A coding agent with repo write access. The gate constrains paths,
   denies force-push and secret access, and holds anything touching published data. This one ships as the
   GitHub Action, which closes Lantern's open v0.3 issue and puts the gate where engineers already look.

Each ships with: the Umbrella policy file, a runnable script, a sample bundle, and a Lantern render in all
four role lenses. Each gets one story on the site through the existing content folder pipeline.

---

## 11. Requirements

**Functional**

- F1. A structured action-intent schema, versioned, with a conformance test suite.
- F2. Gate SDK in Python first (matches Lantern and the Library), with a documented wire protocol so other
  languages can implement it without our code.
- F3. Four decision outcomes with constraint objects, not booleans.
- F4. Broker contract: least-privilege credentials, scoped to one approved action, short-lived, revoked on
  completion. Reuses the Library's `SecretsProvider` and capability dial rather than a new mechanism.
- F5. Hash binding between decision and execution, enforced at the broker.
- F6. Human hold queue with a named approver, an expiry, and a receipt for both the hold and the release.
- F7. Chained receipts with gap detection.
- F8. Offline verifier — no network, no account, no Foundation service.
- F9. Evidence bundle export suitable for handing to a funder, an auditor, or a procurement reviewer.
- F10. Lantern renders gate decisions in all four role lenses; `diff` works across two gate runs.

**Non-functional**

- N1. Added latency for a policy decision: p95 ≤ 50 ms, excluding human holds.
- N2. Zero-egress: no payload content in any receipt, enforced by a test, not by convention.
- N3. Fail-closed at C2 and above.
- N4. Apache-2.0 code, DCO enforced, spec text under a royalty-free covenant.
- N5. Runs air-gapped. A deployer with no internet can still gate, sign, and verify.
- N6. No required hosted dependency, including ours.
- N7. Adoption cost: a working gate on an existing agent in under thirty minutes of engineer time.

---

## 12. Test strategy and adversarial scenarios

Test tiers follow the pattern Lantern already uses (unit / e2e / schema / scale / chaos) and the site's
Cloud-Mary convention, so nothing new needs to be learned by a contributor.

Adversarial cases, each of which must have a named test before P0 closes:

| Attack | Required behaviour |
|---|---|
| Prompt injection telling the agent to skip the gate | Impossible by construction — the agent has no credential to reach the tool directly |
| Aggregation: many C1 actions summing to a C3 | Cumulative budget escalates the tier and holds |
| Time-of-check / time-of-use drift | Broker rejects on hash mismatch |
| Receipt suppression | Chain gap detected by the verifier |
| Replay of an old approval | Approvals bound to session, payload hash and expiry |
| Policy downgrade by PR | Policy change emits its own receipt; steward review required |
| Credential exfiltration through the broker | Short-lived, single-action scope, revoked on completion |
| Signing key unavailable | Stop condition; deny with a receipt recording the reason |
| A deployer running the gate in advisory mode and claiming coverage | Coverage is computed from receipts, so an ungated action simply does not count |

---

## 13. Open-source governance

- Apache-2.0 for code; DCO sign-off, already enforced on Lantern.
- Spec text separate from implementation, published royalty-free so a competitor can implement it without
  asking us.
- Two stewards (the founders) plus a public RFC process for spec changes; every spec change carries a
  rationale and a migration note.
- Semantic versioning on the receipt schema, with the verifier required to read one major version back.
- Security policy, coordinated disclosure window, and a published key rotation procedure before any
  external pilot.
- Repository structure after approval:

```
aigovops-foundation/
  umbrella-govops/     policy as code, UCID registry, framework crosswalks
  aigovops-beacon/     gate SDK, broker contract, signer, verifier
    spec/              action intent + receipt schema (versioned, royalty-free)
  aigovops-lantern/    reader, role lenses, web viewer (v0.2), GitHub Action (v0.3)
  reference/           the three reference implementations, one directory each
```

---

## 14. Decision 5 — the ninety days

Three arcs, each ending in something a stranger can run. Dates assume approval on 16 September.

**P0 · days 1–30 — one gate, one action.**
T10 JCS canonicalizer lands first; it blocks everything downstream. Then: intent and receipt schema v0.1
on OVERT 1.1; gate SDK with four outcomes; cumulative budget and the aggregation rule; hash binding;
Umbrella gate vocabulary plus UCID crosswalk; Lantern renders gate decisions; reference implementation 1
end to end; `beacon gate check` produces a downloadable bundle from the site in under ten minutes.

**P1 · days 31–60 — the broker and the hold.**
Broker contract on the Library's existing secrets, capability and sandbox primitives; human hold queue
with expiry; stop conditions complete with tests; chain gap detection; reference implementation 2;
the adversarial suite green; first outside engineer reproduces a bundle without our help.

**P2 · days 61–90 — proof that travels.**
Offline verifier released; evidence bundle export with framework crosswalk; the GitHub Action
(Lantern v0.3); reference implementation 3; publish our OVERT level and gate coverage honestly; one
third party verifies a bundle we did not hand-hold them through and says so publicly.

Anything not on this list is P3. Explicitly **not** in the ninety days: a hosted service, a dashboard
product, a certification business, model evaluation or red-teaming, and any claim above OVERT Level 1.

---

## 15. Success measures

- A stranger produces a verified bundle from `beacon gate check` in under ten minutes, unaided. *(This is
  the practitioner-experience gap named on 1 September; it is the one that matters most.)*
- Three reference implementations running, each with a published bundle.
- One external party verifies a bundle offline and publishes that they did.
- Gate coverage above 95% on all three reference implementations.
- At least one outside contributor lands a policy or a reference implementation.
- Zero receipts containing payload content, enforced by test.

---

## 16. Risks

| Risk | Mitigation |
|---|---|
| T10 slips and the receipt chain stays unverifiable | T10 is day 1 of P0 and nothing else starts until it is green |
| The rename is done halfway and the site contradicts the repos | One sweeping PR, Cloud-Mary green, all 22 footers and the chatbot copy in the same commit |
| We claim an assurance level we cannot defend | State OVERT Level 1 and the coverage number; never a level above what we can demonstrate |
| A commercial standard-owner changes the standard under us | Our verifier is ours; conformance is a claim we can re-scope without rewriting the gate |
| Scope creep into a hosted product | Section 14's exclusion list is part of the approval, not a note |
| Two founders, limited hours | P0 is deliberately one action, one policy, one reference implementation |
| Latency makes adopters disable the gate | N1 budget, and the degraded-mode receipt makes disabling visible rather than silent |

---

## 17. Sixty-minute review agenda

| Time | Item |
|---|---|
| 0:00–0:05 | The rule, read aloud. Does it survive both founders' objections? |
| 0:05–0:20 | **Decision 1** — project boundaries. A, B or C. |
| 0:20–0:30 | **Decision 2** — one assurance ladder; drop A0–A5; adopt OVERT levels plus gate coverage. |
| 0:30–0:40 | **Decision 3** — OVERT conformance now, Glacis conversation after publication. |
| 0:40–0:50 | **Decision 4** — the three reference implementations, and swapping rural health for the Matchmaker. |
| 0:50–0:58 | **Decision 5** — approve the ninety days and the exclusion list. |
| 0:58–1:00 | Who does what by Friday. |

Each decision is recorded as a `design mark` step and, once approved, the exclusion list in section 14
becomes as binding as the roadmap.

---

## Appendix A — the public one-pager

**Ship safe AI — never unsafe AI.**

Most AI governance stops at documents. A policy says what should happen; nothing checks whether it did.
When an AI agent can send the email, move the file, or touch the account by itself, a document is not a
control.

The AiGovOps Foundation builds the missing piece, in the open and for free.

Before an AI system does anything consequential, it has to ask. A gate checks the request against policy
written in plain, reviewable code and answers one of four ways: go ahead, go ahead but only this far,
wait for a person, or no. Whatever it answers, it leaves a signed receipt — proof that the check ran,
what it decided, and which rules applied. The receipt holds no private content, so it is safe to hand to
a funder, a regulator, or a customer. Anyone can check it, offline, without an account and without
trusting us.

Three tools, one loop. **Umbrella** is where you write the rules. **Beacon** is the gate that enforces
them and signs the proof. **Lantern** reads that proof back in your language, whether you are an
engineer, a compliance lead, an auditor, or a regulator.

Everything is Apache-2.0, conforms to the open OVERT standard, runs on your own machines, and works
without an internet connection.

*Get to yes. Stay at yes. Recover to yes. Prove it in ten minutes.*

---

## Appendix B — what changes if Option A is chosen

If the founders prefer Umbrella governs · Lantern gates · Beacon proves:

- Lantern v0.1.1's reader commands move to a new project and the current package is deprecated with a
  migration note; every release note's tagline is retired.
- Lantern's open issues #2 (web viewer) and #3 (GitHub Action) re-home to that new project.
- Beacon narrows to signing and verification only, and the decision-to-receipt window becomes a documented
  gap we must close another way.
- The site sweep grows: three repo descriptions, the chatbot's Lantern/Beacon routing intents, the
  Umbrella-GovOps page, and every story that used the old tagline.
- Add roughly two weeks to P0 for the migration, which pushes reference implementation 3 out of the
  ninety days.

The architecture works either way. Option C is recommended only because it costs two weeks less and
breaks nothing that is already installed.
