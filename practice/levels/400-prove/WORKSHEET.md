# Level 400 · Prove it to a stranger — worksheet

**Scenarios:** 470,000 unlawful debts raised on an averaging formula nobody had validated (FailFest
**VH-013, Robodebt**); 26,000–35,000 families branded fraudsters and a government fallen
(**VH-003, the toeslagenaffaire**); twenty years of postmasters prosecuted on software output nobody
could independently verify (**VH-088, Post Office Horizon**).
**Time:** 60 minutes for the worksheet; the Thursday you host is its own hour.
**Skills needed:** either path — the audit gate is about independence, not tooling.
**Train:** Fall 2026 · **live** works today; **fall** lands in P2.

> **Wren says:** the audit gate is about independence, not skill. Any 300 can verify a stranger's bundle by its own VERIFY.md on a phone in airplane mode. Hosting is the hard part; the run-of-show is written for you.

| Step | Minutes | Status |
|---|---|---|
| 1 Read the three cases | 8 | live |
| 2 Verify a stranger's bundle, offline | 15 | live (by `VERIFY.md`) → fall (one command) |
| 3 The premise gate (Robodebt) | 12 | live |
| 4 Evidence to the regulator, complete | 8 | live (policy) → fall (bundle export with crosswalk) |
| 5 Upstream: one issue, one case | 7 | live |
| 6 Host | 5 to plan; 60 to run | live |
| 7 Return | 5 | live |

---

### 1 · Read the three cases (8 min) — live

**Robodebt.** Income averaging as a legal premise for raising debts; a Royal Commission found the scheme
unlawful from the start. Gate: *the mathematical premise of an automated decision system is
independently validated as lawful and sound before a single notice is issued.*

**Toeslagenaffaire.** Nationality and low income as fraud-risk features; clawbacks; children removed;
a cabinet resigned. Gate: *protected attributes and their proxies are barred as risk features; every
adverse decision has meaningful human review.*

**Horizon.** Accounting software's output was treated as evidence of theft for two decades. Gate:
*software outputs accusing people of crimes are independently verifiable; the system's outputs are not
legal evidence on their own.*

All three ran for years because no one outside could check. That is what the audit gate is for.

### 2 · Verify a stranger's bundle, offline (15 min) — live → fall

Take a bundle you did not make — from the catalog, from a 300 who asked, or from Beacon's demo run by
someone else. Copy it to a machine with **no network** (airplane mode counts). Open its `VERIFY.md` and
follow it step by step, without Beacon, without an account, without us.

- Signature verified: ☐ yes ☐ no
- Chain continuous (no gaps in `seq` / `prev_hash`): ☐ yes ☐ no
- Any payload content inside (prompt, output, personal data)? ☐ none ☐ found → it fails
- Statement, in one sentence, with your name: *"I, ______________, verified bundle __________ offline on
  ____________ and found ______________."*

*Fall:* `beacon verify --offline <bundle>` does the mechanics in one command; the sentence stays yours.

### 3 · The premise gate (12 min) — live

Robodebt's decision rule was a formula. Write the policy gate that requires the **premise** to be
validated and receipted before the first notice:

```yaml
  - action: decision.rule.publish          # the formula, the threshold, the risk feature list
    tier: C3
    decision: hold
    approver_role: independent_validator   # not the team that wrote the rule
    constraints:
      evidence_required: [legal_basis, statistical_validation, equity_test_by_cohort]
      expiry: 30d
  - action: notice.issue
    tier: C3
    decision: deny
    unless: receipt_exists(decision.rule.publish)   # no validated premise, no notice — ever
```

Plain-words path — write the same two rules as two sentences a minister could read:
> ______________________________________________________________
> ______________________________________________________________

Name the proxy in your own system that could be a *nationality* or a *low income* in disguise:
______________

### 4 · Evidence to the regulator, complete (8 min) — live policy · fall export

When it goes wrong, what leaves the building? Write the rule: *incident evidence goes to the regulator
complete and unedited* (the corpus's VH-008 gate). Then list what your bundle export must contain for
a reviewer who has never seen your system:

☐ the chain ☐ the policy and its hash ☐ the UCID crosswalk to the framework they care about
(EU AI Act Annex III category / NIST AI RMF function / ISO 42001 clause) ☐ `VERIFY.md` ☐ no payload

*Fall:* `umbrella-conformance bundle` with the crosswalk attached; the regulator lens in Lantern.

### 5 · Upstream — one issue, one case (7 min) — live

Pick the case from steps 1–3 that exposed something the standard or the registries do not yet say.
File **one** of: an issue against the OVERT spec's six domains (cite the case number and the
plain-words gate); a new UCID or crosswalk row to Umbrella by PR; a submission to AIID or the OECD AI
Incidents Monitor. Link: ______________________________

### 6 · Host (5 min to plan) — live

Claim a Thursday on the rota. The run-of-show is fixed: first five minutes are receipts (100s show
theirs); then one 200's diff; then one 300's coverage number; then your verification statement from
step 2; then marks. Your Thursday: ____________ (date).

### 7 · Return (5 min) — live

Mark a 300's step — you are the approver; the mark is a receipt with your key. Land one contributor's
PR. Write the four-sentence story: what you verified, what you found, what you filed upstream, who you
marked.

## No one left behind

| If you… | Then… |
|---|---|
| have no stranger's bundle | Ask Wren for one from the catalog, or take Beacon's demo bundle that a 100 made on Thursday. Independence is about who made it, not how far away they are. |
| cannot host in person | Host the asynchronous Thursday (the second-hour slot): read out the receipts in the thread, mark, and write the four sentences. It counts. |
| are not comfortable filing upstream | File the corpus case to AIID or the OECD monitor instead of the spec; a host can co-sign a spec issue with you. |
| are a policy person, not an engineer | The premise gate (step 3) is the level's heart and it is two sentences a minister could read. Write those; a code-path 400 types them. |

---

**Take-home:** a public verification statement with your name on it; the premise gate in two forms;
an upstream link; a hosted Thursday.
**You are on the host rota.** The next Thursday is yours.

---

## Checklist — one page

*One page. Tick as you go.* · Scenarios VH-013 Robodebt · VH-003 Toeslagenaffaire · VH-088 Horizon · 60 minutes + the Thursday you host

**Before**
- [ ] I am a 300 and I want to steward.

**Verify a stranger, offline**
- [ ] I took a bundle I did not make to a machine with no network.
- [ ] Signature ☐ chain continuity ☐ no payload content — checked by `VERIFY.md`, without Beacon.
- [ ] My one-sentence verification statement carries my name and the date.

**The premise gate (Robodebt)**
- [ ] `decision.rule.publish` is a C3 hold for an independent validator with legal, statistical and equity evidence.
- [ ] `notice.issue` is denied unless the premise receipt exists.
- [ ] I named the proxy in my own system that could be a nationality or a low income in disguise.

**Evidence to the regulator**
- [ ] The export list is complete: chain · policy + hash · UCID crosswalk · `VERIFY.md` · no payload.

**Upstream**
- [ ] One issue, UCID row, or incident submission is filed, with the case number and the gate.

**Host**
- [ ] My Thursday is on the rota; the run-of-show is receipts → diff → coverage → verification → marks.

**Return**
- [ ] I marked a 300 (my key is the approver's). ☐ I landed a contributor's PR. ☐ The four-sentence story is written.
- [ ] Two 400s or a founder marked me 400.

**Never:** ☐ I have not claimed any level for any *system*. Systems get an OVERT AAL and a coverage number from their own evidence.
