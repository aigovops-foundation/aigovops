# The Hint-Log Spec

**A project of the AiGovOps Foundation × NCW AI Expo 2026**
*"Keep the receipts" — scaled down for one person.*

---

## What a hint-log is

A **hint-log** is one short, structured entry that captures a meaningful AI interaction and records the single most important fact about it: **a human, not the machine, made the final call.**

Hint-logs are the small-scale, individual version of what the AiGovOps Foundation's **Beacon** tool does for enterprises. They are the *receipts side* of the three habits we teach at the Expo:

1. **The two-eyes rule** — never ship an AI output a human hasn't reviewed.
2. **Triangulate hard questions** — check important claims against a real source.
3. **Keep the receipts** — this is where the hint-log lives.

A hint-log is "policy as code," scaled down for individuals. It is how a teacher proves to a parent that AI didn't grade their kid's IEP — a human did. How a small-business owner shows an auditor they reviewed the AI's draft before it went out. How a community leader proves a public claim came from a verified source, not an AI hallucination.

You do not log every AI interaction. You log the ones that matter — the ones where, if someone later asked *"did a person actually check this?"*, you want a clear answer.

---

## The five fields

| # | Field | What goes here |
|---|-------|----------------|
| 1 | **The hint** | The prompt or question you actually asked the AI. |
| 2 | **The answer** | A short summary of what the AI gave back. |
| 3 | **The catch** | What the AI got wrong, missed, or made up. Be specific. |
| 4 | **The human call** | What YOU decided, edited, verified, or did differently. |
| 5 | **The receipt** | A link to the source chat, the doc, the email — wherever the artifact lives. |

The discipline is in fields 3 and 4. If "the catch" is always blank, you are not reading critically. If "the human call" is always "looks good," you are not really in charge — the AI is.

---

## The blank template

```markdown
## Hint-Log — [date] — [your initials]

**1. The hint:** What did you ask the AI? Paste or paraphrase the prompt.

**2. The answer:** What did the AI give back? One- or two-sentence summary.

**3. The catch:** What did it get wrong, miss, or make up?

**4. The human call:** What did YOU decide, edit, verify, or do differently?

**5. The receipt:** Link to the chat / doc / email where the artifact lives.
```

---

## Five worked examples

### 1. A teacher — IEP progress summary

- **The hint:** Summarize Maya's reading running-records into 3 IEP goal options at a 6th-grade reading level.
- **The answer:** Gave 3 goals plus a fluency target of 120 WPM and a tidy parent-facing paragraph.
- **The catch:** The 120 WPM target was invented — not from our assessment data — and it silently dropped her extended-time accommodation.
- **The human call:** Replaced the figure with the real 98 WPM from the running record, restored the accommodation, and rewrote one goal in plainer language.
- **The receipt:** Chat link + final IEP draft v3 in the SpEd Drive folder, initialed JT, 5/14.

### 2. A small-business owner — refund policy

- **The hint:** Write a refund-policy section for our website based on these notes and Washington consumer law.
- **The answer:** Produced a clean policy citing a "30-day statutory refund window."
- **The catch:** Washington has no blanket 30-day statutory refund right — that was a hallucinated legal claim.
- **The human call:** Removed the false legal claim, reframed it as *our* voluntary 30-day policy, and ran the final by our attorney.
- **The receipt:** Perplexity search link to the WA Attorney General page + the attorney's approval email, saved 6/2.

### 3. A community leader — campaign claim

- **The hint:** Draft talking points claiming our river-cleanup removed "X tons" of trash this year.
- **The answer:** Filled in "12 tons" and wrote a confident press paragraph around it.
- **The catch:** The 12-ton figure was AI-guessed; our volunteer logs showed 4.6 tons. Publishing it would have been a false public claim.
- **The human call:** Swapped in the verified 4.6 tons from our logs and linked the logbook in the press kit.
- **The receipt:** Link to the volunteer-log spreadsheet + the AI chat, attached to the board minutes, 6/9.

### 4. A clinic office manager — patient letter

- **The hint:** Draft a plain-language letter explaining a new billing process to patients.
- **The answer:** Wrote a friendly letter that included a specific copay dollar amount.
- **The catch:** The copay amount was fabricated — it pulled a number from nowhere, and the letter implied a policy we don't have.
- **The human call:** Removed the dollar figure, replaced it with "contact our billing office," and stripped any content that touched patient specifics (no PHI ever went into the free tool).
- **The receipt:** Link to the chat + the approved letter in the practice's shared drive, signed off by the office manager, 6/12.

### 5. A nonprofit grant writer — impact statistic

- **The hint:** Help me write the impact section of a grant using these program numbers.
- **The answer:** Wrote a compelling section and added "served over 2,000 families" as a headline stat.
- **The catch:** Our actual number was 1,340 families; the AI rounded up to a number it found persuasive, not true.
- **The human call:** Corrected the figure to 1,340, cited the intake database as the source, and flagged the chat for our ED to double-check before submission.
- **The receipt:** Link to the intake-database export + the chat, filed with the grant application packet, 6/18.

---

## A note on free tools and your data

Most of the tools you'll log against have a free tier. Remember: when a tool is free, you are often paying with your data. Free AI tools generally train on your prompts, uploads, and edits. **Never paste private data — student records, patient info, IEP drafts, customer details — into a free tool.** Use a paid tier with a "do not train" toggle, your organization's enterprise tenant, or keep the content non-sensitive. The hint-log records *that you made that judgment*, too.

---

## The bridge to Beacon

A hint-log is something you keep by hand, for the AI moments that matter to one person.

**When you outgrow a personal hint-log, Beacon does this automatically at the enterprise scale.** The AiGovOps Foundation's Beacon captures the same five things — the hint, the answer, the catch, the human call, and the receipt — across an entire organization, turning the habit into governance enforced in code rather than goodwill. It is the same idea: a personal notebook becomes an organizational system of record, so that anyone who later asks *"did a human actually check this?"* always has a verifiable answer.

Start with a notebook. Graduate to Beacon when the stakes — and the volume — demand it.

---

*AiGovOps Foundation — a 501(c)(3) nonprofit · Apache-2.0 · × NCW Tech Alliance*
*Learn more: https://www.aigovops-foundation.com · https://www.ncwtech.org*
