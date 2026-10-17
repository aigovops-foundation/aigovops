---
title: Not evidence on its own — Horizon, and the receipt a stranger can check
date: 2026-10-20
author: Bob Rapp
summary: For twenty-five years the UK Post Office prosecuted more than 700 subpostmasters on the say-so of its Horizon accounting system. Not AI — included for the lesson. The gate is that a system's output accusing a person is independently verifiable, and is not legal evidence by itself. Level 400, the audit gate.
---
Between 1999 and 2024 the UK Post Office used an accounting system called Horizon, built by
Fujitsu. When Horizon's figures showed a shortfall, the Post Office treated the figures as proof
and prosecuted the subpostmaster. More than 700 people were accused of theft or false accounting on
the basis of system errors. There were prison sentences, bankruptcies and suicides across two
decades.

The reckoning came slowly and then all at once: a 2024 television drama, an Act of Parliament that
quashed the convictions en masse, and a statutory inquiry that was still hearing evidence in 2025.
This is VH-088 in the Foundation's hundred verified AI harms — and the corpus is careful to say
that Horizon was not AI. It is included for the lesson, as the ancestor of Robodebt, MiDAS and the
Dutch toeslagenaffaire: a system's output was treated as the truth about a person, and nobody could
check it.

## The gate that would have caught it

The corpus writes it: *software outputs accusing people of crimes are independently verifiable; the
system's outputs are not legal evidence on their own.*

Two clauses, and the second is the one that matters. It is not enough that the output *could* be
checked by the vendor, on the vendor's machine, with the vendor's tools. The check has to be
possible for a stranger — a defence lawyer, an auditor, a subpostmaster's daughter — offline,
without an account, and without trusting the party whose system is doing the accusing.

That is the audit gate, and it is the whole reason the practice ends in a receipt rather than a
dashboard. A receipt is signed. Its hash is bound to the action and to the policy that allowed it.
A bundle of them carries a `VERIFY.md` that says how to check every one of them with nothing but
the bundle and a public key. If Horizon's shortfall figures had come with that, the first
prosecution would have been the last, because the first defence would have verified the chain and
found the gap.

## What level 400 asks of you

You are given a bundle you did not make. On a laptop with the network off, you follow `VERIFY.md`
and write a statement: who signed, when, which policy each receipt answered to, what would break
the chain if a receipt were removed — and what this bundle does *not* prove. The last part is the
skill. The Post Office's mistake was not only trusting its system; it was not knowing where the
system's evidence stopped.

Then you host. Level 400 is the only level whose mark requires that you have run a Thursday, because
the audit gate is a practice you hold for other people, not a thing you finish for yourself.

## The hour

This is the fourth door in the café. Read Robodebt, Toeslagenaffaire and Horizon; verify a
stranger's bundle offline; write the regulator's view; bring your statement on Thursday at 15:00
Pacific, where a host marks it — and then host the next one.

The figures were never the evidence. Sit down. What brought you in?

— [The café](https://www.aigovops-foundation.com/?src=letter#problem) · [Level 400 worksheet](https://practice.aigovops-foundation.com/levels/400-prove/WORKSHEET.html) · [VH-088 in the cases](https://www.aigovops-foundation.com/f-ai-friday.html?id=VH-088)
