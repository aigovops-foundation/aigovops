# Level 300 · Hold — worksheet

**Scenarios:** HK$200M wired after a video call full of deepfaked colleagues (FailFest **VH-015,
Arup**); 300,000 claims denied in two months at 1.2 seconds each (**VH-035, Cigna PXDX**); an
algorithm overruling clinicians on coverage (**VH-011, UnitedHealth nH Predict**).
**Time:** 60 minutes today (tabletop + policy + self-audit); then a week of real traffic when the
operate gate lands. **Skills needed:** either path. This level is mostly judgment; the tools enforce
what you decide here.
**Train:** Fall 2026 · **live** works today; **fall** lands in P1.

> **Wren says:** this level is judgment, not tooling. Everything until *Fall* is pen and paper. Do the Cigna arithmetic out loud — *out of how many?* — and bring the number, or the honest "cannot count yet".

| Step | Minutes | Status |
|---|---|---|
| 1 Read the three cases | 8 | live |
| 2 The hold: name the human, the channel, the expiry | 10 | live (policy) → fall (queue) |
| 3 Aggregation: do Cigna's arithmetic | 10 | live (by hand) → fall (enforced) |
| 4 Identity: who is this agent, under whose authority | 7 | live (policy) → fall (bound by broker) |
| 5 Stop conditions and fail-closed | 5 | live |
| 6 Self-audit with a receipt | 10 | live |
| 7 Coverage: state the number, or state that you cannot | 5 | live → fall (`beacon coverage`) |
| 8 Return | 5 | live |

---

### 1 · Read the three cases (8 min) — live

**Arup, 2024.** A finance employee joined a video call with the CFO and colleagues — all deepfakes —
and made fifteen transfers. Gate: *a face on a video call is not identity verification; high-value
transfers require out-of-band confirmation.*

**Cigna PXDX, 2023.** Doctors "reviewed" and denied claims in batches without opening the files:
300,000 in two months, an average of 1.2 seconds each. Gate: *a human medical reviewer actually reviews
before any claim is denied.*

**nH Predict, 2023.** A model's predicted length of stay was used to cut off post-acute care over
clinicians' judgment. Gate: *a model may inform but never replace clinical judgment in coverage decisions.*

Which of your agent's actions is the Arup one (irreversible, high value)? ______________
Which is the Cigna one (small, fast, and dangerous in volume)? ______________

### 2 · The hold (10 min) — live policy · fall queue

For your C3 action, complete the control. Every blank is mandatory; a hold without an expiry is a
hold nobody clears.

```yaml
  - action: ______________
    tier: C3
    decision: hold
    approver_role: ______________         # a role, and a named person on Thursday
    constraints:
      out_of_band: ______________         # the channel that is NOT the one the request came on
      expiry: ____h                       # an unreleased hold decays to deny — the Library's rule
```

Who releases it at 02:00 on a Sunday? ______________ If nobody, the answer is *deny*, and that is
correct. *Fall:* `beacon hold list` / `beacon hold release`, receipts for the hold and the release.

### 3 · Aggregation — do Cigna's arithmetic (10 min) — live by hand · fall enforced

Cigna's denials were each a small, reversible act. Together they were a C3. **Aggregation is a tier.**

- Your Cigna-shaped action: ______________ Tier alone: C1
- How many of them, in one hour, would equal one irreversible harm? ______
- So: `budget: { per_hour: ______ }`, and above it the tier escalates to C3 and **holds**.

Check the math against the case: 300,000 ÷ 60 days ÷ 8 hours ≈ 625 per hour. Would your budget have
caught it by 09:15 on day one? ☐ yes ☐ no → lower it.

### 4 · Identity — who is this agent, under whose authority (7 min) — live policy · fall bound

Ken's *No More Anonymous Ghosts*: which agent did this, under whose authority? Fill in, for each agent
in `applies_to`:

| Agent | `agent_id` (a key, not a name) | `authority` (the human or role it acts for) |
|---|---|---|
| | | |

An action with no `agent_id` is a **stop condition** — add `identity_unbound` to your
`stop_conditions`. *Fall:* the broker refuses unbound actions and writes the receipt saying so.

### 5 · Stop conditions and fail-closed (5 min) — live

Tick each one your policy names: ☐ unknown_action ☐ policy_unavailable ☐ hash_mismatch
☐ budget_exhausted ☐ key_unavailable ☐ identity_unbound. Then write the sentence:
*"Above C1 this system never fails open."* Sign it: ______________

### 6 · Self-audit with a receipt (10 min) — live

Open the Vendor RFI advisor's **audit-training tool**. Run the self-audit against your system as it
is today. Export the receipt. Record its hash: __________________ — it joins your chain.

### 7 · Coverage — the honest number (5 min) — live → fall

Gate coverage is the share of C2+ actions that were decided by a gate and left a receipt. Today, on
paper: of your agent's C2+ actions last week, how many went through a gate? ______ / ______ =
______ %. If you cannot count them, write **"cannot count yet"** — that is a finding, not a failure.
*Fall:* `beacon coverage` computes it from the chain; ungated actions simply do not count.

### 8 · Return (5 min) — live

Take a bundle from the catalog that you did not make. Before Thursday, read it in the auditor lens and
verify it by its `VERIFY.md`. Say on Thursday what you found. Mentor a 200 through step 4 of their
worksheet.

## No one left behind

| If you… | Then… |
|---|---|
| run no traffic yet | Everything on this worksheet before *Fall* is tabletop. Do it on last month's logs, or on the Cigna numbers in the case. |
| have no approver to name | That is the finding. Write "nobody at 02:00 on Sunday — so it denies" and bring it; a 300 without an approver is a system that fails closed correctly. |
| cannot count coverage | Write "cannot count yet." It is the most common honest answer at 300 and it is marked the same. |
| are not technical | Steps 2, 3, 4 and 7 need no tool at all; they need you to name people, hours and numbers. Skip 5 and 6 until Thursday. |
| find the cases upsetting | They are. Pick one of the three, not all; the mark asks for the hold and the arithmetic, not for reading every case. |

---

**Take-home today:** a C3 control with a named human, an out-of-band channel and an expiry; a budget
that would have caught Cigna by 09:15; an identity table; a self-audit receipt; a coverage number or
an honest "cannot count yet".
**Take-home after a week of traffic (fall):** *gate coverage 9x% over 30 days*, with a hold, a
release, a decay and an aggregation escalation in the chain.
**Next:** [Level 400 — Prove it to a stranger](../400-prove/WORKSHEET.md).
