---
title: The one-dollar Tahoe — why a system prompt is not a rule
date: 2026-09-22
author: Bob Rapp
summary: In 2023 a dealer's chatbot agreed to sell a 2024 Chevy Tahoe for $1 and called it a legally binding offer. Nobody lost a truck. Everybody learned that a polite instruction to an LLM is not a gate. Level 200 starts here.
---
In December 2023 a Chevrolet dealership in Watsonville, California put a ChatGPT-powered chatbot
on its website. A visitor prompt-injected it into agreeing to sell a 2024 Chevy Tahoe for one
dollar — and into calling that "a legally binding offer." Others got the same bot to write Python
and to recommend a Ford.

The dealer pulled the bot. The vendor defended the deployment. No Tahoe left the lot for a dollar.
The harm was embarrassment, and a public demonstration of something every team with a bot already
suspects: a consumer LLM behind a thin system prompt can be talked into anything. This is VH-022 in
the Foundation's hundred verified AI harms.

## The gate that would have caught it

The corpus writes the gate in one sentence: *system prompts are not security boundaries;
consequential commitments require deterministic rules, not LLM goodwill.*

Read that twice, because it is the whole of level 200. The instruction "do not agree to sell
anything" lives inside the model's context, where the next message can outvote it. A rule lives
outside the model, in a gate that sees the action the bot is about to take — `customer.commit`
carrying a price — and refuses it whatever the conversation said. The model can be as charming as
it likes. The gate does not read the chat; it reads the action.

That is the difference between a promise and a policy. The Air Canada case (last week's story, and
the level-100 door) taught that an AI's promise binds the company. The Tahoe teaches the next
thing: you cannot keep the promise by asking the model nicely. You keep it with a rule the model
cannot rewrite.

## What it looks like as three lines

At level 200 the same rule is written twice — once in plain words a colleague could enforce, once
as YAML a pipeline can enforce — and both produce the same receipt:

```yaml
policy: retrofit-v1
controls:
  - action: customer.commit
    tier: C3           # irreversible, financial
    decision: deny     # a bot never commits money; a person does
```

Put that beside your agent and run the policy gate in CI. Now weaken it — change `deny` to
`allow` — and open the pull request. The merge is refused, and the refusal leaves a receipt: which
rule changed, who changed it, what the diff was. That refused merge is the level-200 artifact.
Nobody sells a Tahoe for a dollar, and if someone tries to make it possible, the attempt is on the
record before it ships.

## If you have a bot already

This is the second door in the café — *I have a bot or an agent already, and I'm not sure it's safe
to ship.* The hour is sixty minutes and one install. You read this case and Knight Capital, list
your agent's three consequential actions, write the policy, validate it, change one line, and watch
the diff. Then you bring it on Thursday at 15:00 Pacific, where a host marks it.

If you do not have a bot yet, take the first door instead, or run the ten-minute Gate Check and keep
the card. Either way: the rule goes outside the model. Sit down. What brought you in?

— [The café](https://www.aigovops-foundation.com/academy.html?src=letter#problem) · [Level 200 worksheet](https://www.aigovops-foundation.com/practice/levels/200-retrofit/WORKSHEET.html) · [VH-022 in the cases](https://www.aigovops-foundation.com/f-ai-friday.html?id=VH-022)
