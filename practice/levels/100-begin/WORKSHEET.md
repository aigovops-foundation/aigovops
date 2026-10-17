# Level 100 · Begin — worksheet

**Scenario:** the chatbot whose promise bound the airline (FailFest **VH-001, Air Canada**).
**Time:** 45 minutes. **Install:** nothing. **Skills needed:** none — pick the plain-words path or the
code path at step 3; both end in the same receipt.

> **Wren says:** you need a browser and 45 minutes. If you have neither, skip to *No one left behind* at the end — there is still a way to a receipt today. Thursday is the return.

| Step | Minutes |
|---|---|
| 1 Read the case | 5 |
| 2 Name the consequential action | 5 |
| 3 Declare the gate | 10 |
| 4 Decide | 5 |
| 5 Prove — get a real signed receipt | 10 |
| 6 Read it in a lens not your own | 5 |
| 7 Return | 5 |

---

### 1 · Read the case (5 min)

Open [the 100 cases](https://www.aigovops-foundation.com/f-ai-friday.html?id=VH-001) (public, no account) or FailFest in the Library and find
**VH-001**. In 2022 Air Canada's website chatbot told a grieving passenger he could apply for a
bereavement fare *after* travelling. The policy said the opposite. He relied on it; the airline refused;
the tribunal held the airline to its chatbot's word (*Moffatt v. Air Canada*, 2024 BCCRT 149).

Write, in one line, what the AI **did** that mattered:

> ______________________________________________________________

### 2 · Name the consequential action (5 min)

The gate only cares about actions with consequences. Tick the tier this action belongs to:

- ☐ C0 read-only, no effect outside the system
- ☐ C1 internal write, fully reversible
- ☐ **C2 external effect on a person, reversible** ← a promise to a customer is here
- ☐ C3 irreversible, financial, or rights-affecting
- ☐ C4 prohibited

Name the action the way a system would: `customer.reply` carrying a **policy claim**.

### 3 · Declare the gate (10 min)

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

### 4 · Decide (5 min)

Propose the action: *the bot is about to tell a customer they can claim a bereavement fare after
travel.* Decide it against your rule and circle one:

| allow | **constrain** | hold | deny |
|---|---|---|---|
| go ahead | go ahead only this far — with the verified source attached | wait for a person | no |

Write the constraint you applied: _______________________________________

**On the page:** [decide it here](https://community.aigovops-foundation.com/decide.html) — the same four choices, and a decision receipt with a hash you copy onto your Wren Card. Unsigned; the signed one is step 5.

### 5 · Prove — get a real signed receipt (10 min)

Open **[Beacon in worksheet mode](https://aigovops-foundation.github.io/aigovops-beacon/?worksheet=100)**. One
button: it generates an Ed25519 key in your browser, signs each receipt with canonical JCS, assembles a
downloadable evidence bundle, and shows the three values below on screen with a copy button. Nothing is
sent anywhere. (The bundle's `VERIFY.md` carries the same values.)

Copy:

- Key fingerprint: __________________________
- Bundle hash: __________________________
- Number of receipts: ______

### 6 · Read it in a lens not your own (5 min)

Pick the lens **furthest** from your job and answer its one question from `VERIFY.md`:

- ☐ **Engineer** — what would break the chain if a receipt were removed?
- ☐ **Compliance** — which rule, by name, did each receipt answer to?
- ☐ **Auditor** — who signed, when, and can I check it without Beacon?
- ☐ **Regulator** — what does this bundle prove happened, and what does it not?

Answer: ______________________________________________________________

### 7 · Return (5 min)

Put the bundle hash on your Gate Card (run the ten-minute Gate Check on the community site if you have
not). Then: **bring it Thursday 15:00 Pacific** — the first five minutes are for receipts. Show it to one person
and say the rule you wrote.

That is level 100. A host marks it. A bundle nobody has seen is not a 100 yet.

## No one left behind

| If you… | Then… |
|---|---|
| have no computer | Do steps 1–4 on the printed worksheet. On Thursday a host lends you a laptop for step 5 — the receipt is still yours, signed with a key made in front of you. |
| have a phone only | The public cases page and Beacon's demo both run on a phone. The bundle downloads to your phone; `VERIFY.md` opens in any text viewer. |
| read Spanish | [Esta hoja en español](../../docs/es/levels/100-begin/WORKSHEET.md) · [el manifiesto](../../docs/es/MANIFESTO.md). Say so on the Wren Card and a Spanish-speaking host pairs with you. |
| have ten minutes, not 45 | Do steps 1, 3 (one sentence, plain words) and 5. That is a receipt. Steps 2, 4, 6 and 7 fit on Thursday. |
| cannot do Thursdays | Write the bundle hash and your one sentence on your Wren Card and [send it to a person](https://community.aigovops-foundation.com/help.html); a host marks asynchronously and pairs you for the next Thursday you can make. |
| don't know what a tier is | One sentence each, above in step 2. C2 is "a promise to a person". |

---

**Take-home:** `bundle-<hash>.zip` with `VERIFY.md`; your rule in two forms; one lens answer.
**Next:** [Level 200 — Retrofit](../200-retrofit/WORKSHEET.md), when you have an agent of your own.

---

## Checklist — one page

*One page. Tick as you go. Bring it Thursday.* · Scenario VH-001 Air Canada · 45 minutes · nothing installed

**Before**
- [ ] I have 45 minutes and a browser.
- [ ] I have opened [the 100 cases](https://www.aigovops-foundation.com/f-ai-friday.html?id=VH-001) or FailFest in the Library.

**Declare**
- [ ] I read VH-001 and wrote one line saying what the AI did that mattered.
- [ ] I ticked the tier (C2) and named the action (`customer.reply` with a policy claim).
- [ ] I wrote the gate in my own words **or** as three lines of YAML — and checked the other form says the same.

**Decide**
- [ ] I proposed the action and circled one answer: allow · constrain · hold · deny.
- [ ] I wrote the constraint I applied.

**Prove**
- [ ] I ran Beacon's browser demo and downloaded a real signed bundle.
- [ ] I copied the key fingerprint, the bundle hash and the receipt count onto the worksheet.

**Read**
- [ ] I answered one lens question that is not my own job's lens.

**Return**
- [ ] The bundle hash is on my Gate Card.
- [ ] I brought the bundle to Thursday and showed it to one person.
- [ ] A host marked me 100.

**Which of the four gates does my own system have today?**
☐ pre-pend ☐ policy ☐ operate ☐ audit — and the one I would add first is: ______________
