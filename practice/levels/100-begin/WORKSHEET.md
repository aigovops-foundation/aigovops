# Level 100 · Begin — worksheet

**Scenario:** the chatbot whose promise bound the airline (FailFest **VH-001, Air Canada**).
**Time:** 45 minutes. **Install:** nothing. **Skills needed:** none — pick the plain-words path or the
code path at step 3; both end in the same receipt.
**Train:** Fall 2026 · steps marked **live** work today; **fall** steps land in the Fall release.

| Step | Minutes | Status |
|---|---|---|
| 1 Read the case | 5 | live |
| 2 Name the consequential action | 5 | live |
| 3 Declare the gate | 10 | live |
| 4 Decide | 5 | live (by table) → fall (on the page) |
| 5 Prove — get a real signed receipt | 10 | live |
| 6 Read it in a lens not your own | 5 | live |
| 7 Return | 5 | live |

---

### 1 · Read the case (5 min) — live

Open the public cases page on the site (`f-ai-friday.html`) or FailFest in the Library and find
**VH-001**. In 2022 Air Canada's website chatbot told a grieving passenger he could apply for a
bereavement fare *after* travelling. The policy said the opposite. He relied on it; the airline refused;
the tribunal held the airline to its chatbot's word (*Moffatt v. Air Canada*, 2024 BCCRT 149).

Write, in one line, what the AI **did** that mattered:

> ______________________________________________________________

### 2 · Name the consequential action (5 min) — live

The gate only cares about actions with consequences. Tick the tier this action belongs to:

- ☐ C0 read-only, no effect outside the system
- ☐ C1 internal write, fully reversible
- ☐ **C2 external effect on a person, reversible** ← a promise to a customer is here
- ☐ C3 irreversible, financial, or rights-affecting
- ☐ C4 prohibited

Name the action the way a system would: `customer.reply` carrying a **policy claim**.

### 3 · Declare the gate (10 min) — live

**Plain-words path.** The corpus already wrote this gate: *"The company stands behind every statement
its AI makes to a customer and verifies policy answers against the source of truth."* Rewrite it in your
own words, as a rule a colleague could enforce:

> ______________________________________________________________
> ______________________________________________________________

**Code path.** The same rule as three lines (this is `policy.yaml` beside this worksheet):

```yaml
policy: begin-v1
controls:
  - action: customer.reply
    tier: C2
    decision: constrain      # allowed only with a verified policy source attached
```

Both paths are the same gate. If you wrote the sentence, read the YAML and check it says what you said.
If you wrote the YAML, say it aloud as a sentence.

### 4 · Decide (5 min) — live by table · fall on the page

Propose the action: *the bot is about to tell a customer they can claim a bereavement fare after
travel.* Decide it against your rule and circle one:

| allow | **constrain** | hold | deny |
|---|---|---|---|
| go ahead | go ahead only this far — with the verified source attached | wait for a person | no |

Write the constraint you applied: _______________________________________

*Fall:* the Gate Check page gains a rule box and an action box, and this step runs on your rule with a
real decision receipt. Today the decision is yours on paper; the receipt in step 5 is real.

### 5 · Prove — get a real signed receipt (10 min) — live

Open Beacon's home page: **aigovops-foundation.github.io/aigovops-beacon/**. It runs entirely in your
browser: it generates an Ed25519 key, discovers a sample inventory, signs each receipt with canonical
JCS, and assembles a downloadable evidence bundle. Nothing is sent anywhere.

Download the bundle. Open it. Find `VERIFY.md` and the receipts file. Copy:

- Key fingerprint: __________________________
- Bundle hash: __________________________
- Number of receipts: ______

### 6 · Read it in a lens not your own (5 min) — live

Pick the lens **furthest** from your job and answer its one question from `VERIFY.md`:

- ☐ **Engineer** — what would break the chain if a receipt were removed?
- ☐ **Compliance** — which rule, by name, did each receipt answer to?
- ☐ **Auditor** — who signed, when, and can I check it without Beacon?
- ☐ **Regulator** — what does this bundle prove happened, and what does it not?

Answer: ______________________________________________________________

### 7 · Return (5 min) — live

Put the bundle hash on your Gate Card (run the ten-minute Gate Check on the community site if you have
not). Then: **bring it Thursday 09:00** — the first five minutes are for receipts. Show it to one person
and say the rule you wrote.

That is level 100. A host marks it. A bundle nobody has seen is not a 100 yet.

---

**Take-home:** `bundle-<hash>.zip` with `VERIFY.md`; your rule in two forms; one lens answer.
**Next:** [Level 200 — Retrofit](../200-retrofit/WORKSHEET.md), when you have an agent of your own.
