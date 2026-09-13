---
title: A face is not a signature — Arup, and the transfer that needed a second channel
date: 2026-10-27
author: Bob Rapp
summary: In 2024 a finance employee at Arup's Hong Kong office joined a video call where the CFO and every colleague were AI deepfakes, then made fifteen transfers totalling HK$200 million. The gate is that a face on a call is not identity, and a high-value transfer waits for a confirmation the caller cannot fake. Level 300, the hold.
---
In early 2024 a finance employee in Arup's Hong Kong office was invited to a video conference. The
chief financial officer was there, and colleagues; they looked and sounded right. They were all AI
deepfakes, built from public footage. On their instruction the employee executed fifteen transfers
to five accounts — HK$200 million, about US$25.6 million — in a single day. The funds were not
recovered. Arup confirmed in May 2024 that it had been the victim. This is VH-015 in the
Foundation's hundred verified AI harms.

The lesson the case carries is the one nobody wanted: *seeing and hearing a colleague is no longer
proof of anything.* The employee did what a careful person does — took the call, checked the faces,
followed the instruction of the most senior person in the room. Every one of those checks was
against a channel the attacker controlled.

## The gate that would have caught it

The corpus writes it: *a face on a video call is not identity verification; high-value transfers
require out-of-band confirmation.*

Out-of-band is the whole of it. The transfer is a consequential action — C3, irreversible,
financial — and the gate's answer is a hold: for a named human, through a channel the requester did
not choose, with an expiry. The employee's phone rings from a number in the directory, or the
transfer waits for a second signature from someone who was not on the call. If nobody confirms
before the expiry, the hold decays to no. Fifteen transfers become fifteen holds, and the first one
that decays is the alarm.

This is the same shape as last month's Cigna story, from the other side. There the hold was missing
because the batch was too fast to review. Here it was missing because the review happened inside
the channel being attacked. In both, the fix is not a smarter reviewer; it is a gate that does not
take the requester's word for who the requester is.

## Identity, under whose authority

Level 300 has a step most people skip on the first pass: *who is this agent, under whose
authority?* Arup's deepfakes were an identity attack on humans. The version that will arrive in
your systems is an identity attack on agents — a tool call that claims to come from the finance
bot, or a bot that claims to act for the CFO. The gate binds every action to an identity that was
issued, not asserted, and refuses the unbound ones. A hold released by the thing that asked for it
is not a hold.

## The hour

This is the third door in the café — *it's already running, and nobody can say who's watching it or
how to stop it.* Sixty minutes on paper: read Arup, Cigna and nH Predict; write the hold with its
human, channel and expiry; do the arithmetic; name the identity; then bring it on Thursday at 15:00
Pacific, where a host marks it.

The faces were perfect. The channel was theirs. Sit down. What brought you in?

— [The café](https://www.aigovops-foundation.com/?src=letter#problem) · [Level 300 worksheet](https://aigovops-foundation.github.io/practice/levels/300-hold/WORKSHEET.html) · [VH-015 in the cases](https://www.aigovops-foundation.com/f-ai-friday.html?id=VH-015)
