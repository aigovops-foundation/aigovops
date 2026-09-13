---
title: Seconds each — the hold that Cigna's PXDX never had
date: 2026-10-06
author: Bob Rapp
summary: ProPublica reported that Cigna's PXDX process let medical directors deny large batches of claims in seconds each, often without opening the patient's file. The gate is a human who actually reviews before a denial — and the arithmetic of what "actually" means when the batch is a thousand deep. Level 300.
---
In 2023 ProPublica reported that Cigna used an automated review process called PXDX that let
medical directors deny large batches of claims in seconds each, often without opening the patient
file. Class actions followed in California. Cigna denies that the algorithm decided anything. And
California passed SB 1120, which restricts utilization-management denials made by an algorithm
alone. This is VH-035 in the Foundation's hundred verified AI harms.

Notice what the law had to say out loud: *a person must actually review.* Not "a person is in the
loop." A signature on a batch is a person in the loop. The question level 300 asks is the one the
regulators ended up asking — out of how many?

## The gate that would have caught it

The corpus writes it: *a human medical reviewer actually reviews before any claim is denied; batch
denials without records review are off the table.*

That is a hold. Every denial is a consequential action against a person, tier C3, and the gate's
answer is not yes or no but *held* — for a named human, through a named channel, with an expiry.
The reviewer opens the file and releases the hold, or does not, and either way there is a receipt
with their name on it. If nobody acts before the expiry, the hold decays to no: the claim is not
denied by default, it is not decided by default.

Then the arithmetic. If one reviewer is releasing holds at the rate of seconds each, a hundred an
hour, a thousand a day, the gate should notice — because "actually reviews" has a floor, and a
person who is releasing faster than a file can be opened is not reviewing. Aggregation is the level
300 word for this: a count over a window, with a line beyond which the gate escalates instead of
releasing. Cigna's number, whatever it was, would have tripped it in the first hour.

## What you write at level 300

Three things, on paper first. The hold: which action, which human by role, which channel, how long
before it decays. The aggregation: how many releases per reviewer per hour before the gate stops
releasing and escalates. The identity: which agent is proposing these actions, under whose
authority, so that a hold is never released by the thing that asked for it.

Then the honest number. Level 300 ends with a coverage statement: of the consequential actions your
system takes, how many pass through a gate? Nine in ten is a number. "Cannot count yet" is also a
number, and it is the one most people bring on their first Thursday. Both are marked; a guess is
not.

## The hour

This is the third door in the café — *it's already running, and nobody can say who's watching it or
how to stop it.* Sixty minutes today, pen and paper, and a week of traffic later. Read Arup, Cigna
and nH Predict; name the human, the channel and the expiry; do Cigna's arithmetic; write your stop
conditions; then bring it on Thursday at 09:00 Pacific, where a host marks it.

Seconds each was never a review. Sit down. What brought you in?

— [The café](https://www.aigovops-foundation.com/?src=letter#problem) · [Level 300 worksheet](https://aigovops-foundation.github.io/practice/levels/300-hold/WORKSHEET.html) · [VH-035 in the cases](https://www.aigovops-foundation.com/f-ai-friday.html?id=VH-035)
