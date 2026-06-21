# NCW AI Partnership Pledge — 5-Email Post-Event Drip Sequence
**From:** Ken Johnston & Bob Rapp, AiGovOps Foundation
**To:** Everyone who signed the NCW AI Partnership Pledge at AI Expo 2026, Wenatchee (August 11, 2026)
**Written for:** ConvertKit / Mailchimp / Loops / Substack

---

## How to Use This Sequence

**Setup notes for whoever loads this into your email platform:**

1. **Tags needed:** `ncw-pledge-signer`, `{{ROLE}}` (populated at sign-up: `educator`, `smb-owner`, `community-leader`, `student`, `parent`, `other`), `{{CITY}}`, `{{NAME}}`, `{{ONE_THING}}` (the signer's free-text "one thing I'll do this week" answer from the Pledge form).

2. **Trigger:** Add contact to this sequence when they complete the Pledge form at aigovops-foundation.com/ncw-pledge. Email 1 fires the morning after the event (August 12), regardless of when they submitted — set the trigger anchor to August 12 at 7:00 AM PDT for all attendees collected at the event. Future signers enter the sequence on Day 1 from their sign date.

3. **Send times:** All emails go out at 7:00 AM PDT. Studies consistently show early morning delivery outperforms afternoon for mission-driven and professional lists.

4. **Role-based conditional content:** Email 1 and Email 4 contain conditional mini-camp recommendations keyed to `{{ROLE}}`. Most platforms (ConvertKit, Loops, Mailchimp) support `{% if role == "educator" %}` conditional blocks — instructions are in-line below each block.

5. **Loom links in Email 2:** These are placeholders. Ken or Bob should record a 2-minute video before August 15 showing how they personally would do their "one thing" using AI as a partner. Upload to Loom, paste the link in place of `[LOOM_LINK_PLACEHOLDER]`.

6. **Footer links:** Every email ends with the same 3-link footer. Keep these consistent. Update URLs if the Foundation changes domains.

7. **Unsubscribe:** Every email includes a standard unsubscribe line. Your platform will auto-generate the unsubscribe link — place it at `[UNSUBSCRIBE_LINK]` in the footer.

8. **Reply handling:** Emails 2, 3, and 5 explicitly ask for replies. Route those to a shared inbox (e.g., ncw@aigovops-foundation.com) that Ken or Bob actually check. A real reply to a real person is worth more than any automation.

---

## Email 1 — Day 1 (August 12, morning after)

**From:** Ken Johnston & Bob Rapp, AiGovOps Foundation <ncw@aigovops-foundation.com>
**To:** {{NAME}}
**Subject:** You signed it. Here's what comes next.

---

{{NAME}},

Yesterday, in a room with 299 other people in Wenatchee, you signed something real.

The NCW AI Partnership Pledge isn't a bumper sticker. It's a commitment that AI will be a partner in your work — not a shortcut around the hard parts, not a thing your organization bans in a panic, but a tool you govern well, disclose honestly, and hold accountable. That's a harder thing to sign than most people realize, and you signed it anyway.

You told us the one thing you'd do this week: **{{ONE_THING}}**.

We're holding you to that. Not because we're keeping score, but because that specific thing — the one that came to mind when you wrote it down — is the right first move. It's your first move. Don't overthink it.

To help:

**Watch the recording.** The centerpiece plenary is now posted — the live Deep Think demo, the Model Council run on the real Wenatchee 4th-grade question, and the full Q&A including the hard ones. [Link: aigovops-foundation.com/ncw-recording] The breakout decks (Cool Tools, Cool Schools, The Rules, Build It in 60) are in the same folder.

**Your first mini-camp, matched to your role:**

<!-- CONDITIONAL BLOCK — show only the matching role -->
*If {{ROLE}} = educator:* Start with **Scenario 3: The Burned-Out Teacher** — specifically "Move 2: Differentiate any reading in 2 minutes." Pick one passage you need to teach next week. Paste it. See what happens. Total time: 10 minutes. [aigovops-foundation.com/mini-camps]

*If {{ROLE}} = smb-owner:* Start with **Scenario 4: The 5-Hours-Back Camp** — specifically "Move 1: Email drafting." Train Gemini once on your voice and draft one reply you've been putting off. [aigovops-foundation.com/mini-camps]

*If {{ROLE}} = community-leader:* Start with **Scenario 5A: The Civic Action Camp** — specifically "Move 1: Sharpen the problem." Bring one real community concern you've been sitting on. Let AI help you make it specific enough to act on. [aigovops-foundation.com/mini-camps]

*If {{ROLE}} = student or other:* Start with **Scenario 1B or 1C: The Go Deeper Lab** — pick one question that doesn't have a Google-able answer and run the Model Council on it. [aigovops-foundation.com/mini-camps]
<!-- END CONDITIONAL BLOCK -->

We'll check in on Thursday.

— Ken & Bob, AiGovOps Foundation

---

**[Sign the Pledge](https://aigovops-foundation.com/ncw-pledge) · [Get the Toolkit](https://aigovops-foundation.com) · [Join the Community](https://community.aigovopsfoundation.org)**

*You're receiving this because you signed the NCW AI Partnership Pledge at AI Expo 2026. [Unsubscribe]([UNSUBSCRIBE_LINK])*

---

## Email 2 — Day 4 (August 15)

**From:** Ken Johnston & Bob Rapp, AiGovOps Foundation <ncw@aigovops-foundation.com>
**To:** {{NAME}}
**Subject:** Did you do the thing?

---

{{NAME}},

Four days ago you wrote down one thing you'd do this week: **{{ONE_THING}}**.

Did you do it?

If yes — genuinely, good. Reply and tell us what happened. We read every one.

If no — also good to know, and we're not here to shame you. Life in {{CITY}} is busy, and "I'll do one new thing this week" is much harder than it sounds in a convention center on a Tuesday afternoon. We know. We've been the person with the good intention and the full calendar.

Here's what actually gets in the way, in our experience:

The blank page. The "I don't know where to start." The nagging feeling that doing it wrong is worse than not doing it. All of that is a normal first-week AI feeling. Here's Ken (or Bob) showing what it actually looks like to start:

**Watch: [LOOM_LINK_PLACEHOLDER]** — 2 minutes. No production value. Just what the first move looks like from someone who's been doing this a while.

**One new mini-camp for you this week:**

<!-- CONDITIONAL BLOCK -->
*If {{ROLE}} = educator:* **Scenario 3, Move 4: The parent-email softener.** You have at least one email in your drafts right now that you've been avoiding. Try the move. It takes three minutes. [aigovops-foundation.com/mini-camps]

*If {{ROLE}} = smb-owner:* **Scenario 4, Move 5: Rehearse the hard conversation.** There's a conversation you've been putting off — a refund, a vendor dispute, a pricing conversation. Rehearse it with AI first. [aigovops-foundation.com/mini-camps]

*If {{ROLE}} = community-leader:* **Scenario 5A, Move 3: Draft your 1-page case for action.** You sharpened the problem on day one. Now put it on paper. This is the version you bring to a board, a council, or an ally. [aigovops-foundation.com/mini-camps]

*If {{ROLE}} = student or other:* **Scenario 2B or 2C: The Second Chance Lab.** Pick one thing you've felt stuck on. Ask AI to explain it three different ways until one clicks. Then teach it back in your own words. [aigovops-foundation.com/mini-camps]
<!-- END CONDITIONAL BLOCK -->

One question for you — just reply: **What got in the way?**

Not rhetorically. We're tracking this. Every answer helps us make the next version of this work better for the next room.

— Ken & Bob

---

**[Sign the Pledge](https://aigovops-foundation.com/ncw-pledge) · [Get the Toolkit](https://aigovops-foundation.com) · [Join the Community](https://community.aigovopsfoundation.org)**

*You're receiving this because you signed the NCW AI Partnership Pledge at AI Expo 2026. [Unsubscribe]([UNSUBSCRIBE_LINK])*

---

## Email 3 — Day 10 (August 21)

**From:** Ken Johnston & Bob Rapp, AiGovOps Foundation <ncw@aigovops-foundation.com>
**To:** {{NAME}}
**Subject:** What other NCW signers are doing (10 days in)

---

{{NAME}},

Ten days out from the Expo. Here's what some of your fellow NCW signers are actually doing — with their permission, and without their names.

---

**The middle-school science teacher in East Wenatchee:**

She left the Expo with "Scenario 3, Move 2" in her pocket — the differentiate-any-reading-in-2-minutes move. On Tuesday morning, she tried it on a chapter about ecosystems she's taught the same way for six years. "I pasted it in, asked for three reading levels, and in 90 seconds I had something for my ELL kids that I'd been meaning to build for two years. I cried a little. That's embarrassing to say. But I'd been so behind." She spent the hour she saved calling a parent she'd been putting off. The parent cried too.

---

**The orchard supply company owner in Chelan:**

He came to "The Rules" breakout convinced he was going to find out he was doing everything wrong. He was doing one thing wrong: pasting customer quotes (with names) into a free AI tool to draft testimonials. He fixed it in 10 minutes — anonymize, then paste. "The weird thing is I feel better about using it now that I have a rule. Before it was this vague thing I was probably messing up. Now I have a checklist." He's now drafted a five-sentence business AI policy and printed it in the break room.

---

**The nonprofit board chair in Cashmere:**

She runs a food-access organization covering three counties. She used Scenario 5A, Move 2 — asked three AIs the same question about food insecurity data in rural Eastern Washington, then compared the answers. "Two of them cited the same study. One cited a different one. I looked them all up. The different one was better — the two models were both citing a summary of a summary and the third one found the primary source." She's now using that primary data in her board presentation next month.

---

**The high school counselor in Quincy:**

He tried the "Model Council" approach for the first time on a question he'd been wrestling with: how to approach a conversation with a student family about AI and academic dishonesty. Three models. One synthesizer. "The synthesizer surfaced something none of the three individual answers said: that the conversation works better when you lead with the student's goal, not the policy violation. That was the most useful therapy-adjacent advice I've gotten in a while, and it came from asking four AIs to disagree with each other."

---

These are real stories. This is what the Pledge looks like in practice — not a grand gesture, but four specific moves that made four specific weeks slightly better and slightly more honest.

You're part of this community now. We've set up a space where NCW signers can share what's working, ask questions, and see what others are building:

**Join us at [community.aigovopsfoundation.org](https://community.aigovopsfoundation.org)**

The community is on Circle. Free to join. We're there most days. The best conversations so far have been in the "what got in the way" thread — it turns out the friction points are more useful than the success stories.

**One ask:** If something has worked for you in the last ten days, post it. One paragraph. Your story is the one someone in your role needs to read.

— Ken & Bob

---

**[Sign the Pledge](https://aigovops-foundation.com/ncw-pledge) · [Get the Toolkit](https://aigovops-foundation.com) · [Join the Community](https://community.aigovopsfoundation.org)**

*You're receiving this because you signed the NCW AI Partnership Pledge at AI Expo 2026. [Unsubscribe]([UNSUBSCRIBE_LINK])*

---

## Email 4 — Day 18 (August 29)

**From:** Ken Johnston & Bob Rapp, AiGovOps Foundation <ncw@aigovops-foundation.com>
**To:** {{NAME}}
**Subject:** Ready for the next hard thing?

---

{{NAME}},

You've been doing the basics for two and a half weeks. Some of them stuck. Some didn't. That's normal — and it's enough to be ready for the next step.

The NCW AI Partnership Pledge has seven points. The first weeks are usually about points 1 and 5 — AI as partner, and disclose always. The next layer is point 3: **govern AI like you engineer it — with checklists, evidence, and reviews.**

That means taking stock of what AI you're actually using, and making sure it can hold up to scrutiny. Not because regulators are coming for you (though that's changing), but because the Pledge says you keep the receipts. You can't keep receipts for tools you haven't inventoried.

Here's what we recommend, matched to where you are:

---

<!-- CONDITIONAL BLOCK -->

**If {{ROLE}} = educator or administrator:**

**NCESD + aiEDU follow-up workshops.** The North Central Educational Service District and aiEDU.org have upcoming sessions designed for exactly this moment — the "I've tried a few things, now I need a system" step. These are free or low-cost, region-specific, and built for educators, not IT teams. [ncwtech.org/ai-in-action] for the full schedule.

Also: the AiGovOps Foundation's **Beacon tool** (Apache-2.0, free) can scan your Google Workspace and identify every AI tool in use across your school or district — with FERPA and COPPA review status for each one. If you want help standing it up, reply to this email. We will help you personally. [aigovops-foundation.com]

---

**If {{ROLE}} = smb-owner:**

**The Glean evaluation guide.** You've been doing the free-tier moves. For ~$20-30/user/month, Glean searches across your Drive, Slack, email, and CRM and answers questions with your business's actual permissions respected. Before you decide whether to upgrade, here's a one-page guide to whether Glean (or a similar tool) makes sense for your size and situation: [aigovops-foundation.com/glean-guide] *(Note: update with actual URL when the guide is live.)*

Also: Beacon is for businesses too. If a customer, your bank, or your insurer asks "what AI is in your business and what's your policy?" — Beacon is how you answer that in under 60 seconds. [aigovops-foundation.com]

---

**If {{ROLE}} = community-leader or local government:**

**The 1-page municipal AI ordinance template.** We promised this at the Expo and it's ready. Three sections: what you use AI for, what you will never use AI for without human review, and how you disclose it publicly. Fits on one page. Defensible. Modular. Available at [aigovops-foundation.com/municipal-template].

NCW could be the first region in Washington State where every city government has a one-page public AI policy. That's not a small thing — that's a model the rest of the state copies. The template is the first step.

---

**If {{ROLE}} = student or parent:**

**The AiGovOps Foundation Beacon tool (free)** can help you understand what AI tools your school is using and what student data they touch. If your district won't answer that question directly, Beacon is a tool you can bring to the conversation. [aigovops-foundation.com]

Also: the AI Bill of Rights for Education says a qualified human must make final evaluative decisions about a student's work. If you have a specific concern about AI grading or discipline in your school, reply to this email. We'll help you navigate it.

<!-- END CONDITIONAL BLOCK -->

---

**Three paths. Pick one.** You don't have to do all three. One solid next step, done well, is worth more than three half-done.

The Pledge says we govern like we engineer: checklists, evidence, reviews. This week, the checklist starts with one question: **do you know every AI tool that touches your work, your students, or your customers?**

If yes — excellent. You're ahead. Share how you did it in the community.
If no — that's the work. And we'll help you do it.

— Ken & Bob

---

**[Sign the Pledge](https://aigovops-foundation.com/ncw-pledge) · [Get the Toolkit](https://aigovops-foundation.com) · [Join the Community](https://community.aigovopsfoundation.org)**

*You're receiving this because you signed the NCW AI Partnership Pledge at AI Expo 2026. [Unsubscribe]([UNSUBSCRIBE_LINK])*

---

## Email 5 — Day 30 (September 10)

**From:** Ken Johnston & Bob Rapp, AiGovOps Foundation <ncw@aigovops-foundation.com>
**To:** {{NAME}}
**Subject:** 30 days in — what changed?

---

{{NAME}},

Thirty days ago you were in a convention center in Wenatchee, writing down one thing you'd do that week.

We want to know what happened.

Not the polished version. The real one. What worked, what didn't, what surprised you, what you meant to try and didn't get to. We're asking everyone who signed — and we mean it when we say the answers will matter.

**Reply to this email with your 30-day update.** Two paragraphs is plenty. Three questions if it helps:

1. What did you actually change or try in the last 30 days?
2. What got in the way, or what felt harder than it should?
3. What's the one thing you'd tell someone who was standing where you stood on August 11?

We're collecting every response. They will directly inform **Pledge v2.0** — the next revision of the NCW AI Partnership Pledge, which we're planning to publish before the end of 2026. Your experience is the data. If you want to be credited by name when we quote you, say so. If you want to stay anonymous, your story still counts.

---

**What's coming next:**

The NCW Tech Alliance is launching the **AI in Action follow-up series** this fall — free, monthly, regional sessions that take the work from the Expo and keep it moving. Each session follows the same discipline as the Expo: you arrive, you try something, you leave with something that works. Dates and registration at [ncwtech.org/ai-in-action].

The AiGovOps Foundation is also running regional office hours for NCW signers. Thirty minutes with Ken or Bob, free, to work through whatever is stuck — your AI inventory, your classroom policy, your municipal ordinance draft, your Beacon setup. Book at [aigovops-foundation.com/office-hours] *(Note: update URL when booking link is live.)*

---

**One last ask — the most important one:**

You know someone who wasn't in that room on August 11. A colleague, a neighbor, a city council member, a parent on your school's advisory committee. Someone who should be part of this conversation and isn't yet.

**Forward this email and ask them to sign.** Or use this link: [aigovops-foundation.com/ncw-pledge].

The Pledge gets stronger with every person who signs it. The community gets more useful with every story added. The region gets harder to dismiss as a proof point when more people in it have made the same commitment.

You've done the 30 days. Now bring one more person in.

Thank you for signing. Thank you for doing the work. We'll see you in the fall.

— Ken & Bob, AiGovOps Foundation

---

**[Sign the Pledge](https://aigovops-foundation.com/ncw-pledge) · [Get the Toolkit](https://aigovops-foundation.com) · [Join the Community](https://community.aigovopsfoundation.org)**

*You're receiving this because you signed the NCW AI Partnership Pledge at AI Expo 2026. [Unsubscribe]([UNSUBSCRIBE_LINK])*

---

*NCW AI Partnership Pledge Drip Sequence v1.0 · AiGovOps Foundation · Ken Johnston & Bob Rapp · August 2026*
