# Level 200 — Retrofit

> **v3:** owns the **policy gates** · built on **VH-022 Chevrolet of Watsonville** (your agent) and **VH-056 Knight Capital** (your pipeline) · maps to the **AAL-2 Process Records** pattern · mark by a 300+. Full activity: [`docs/MEMBER-ACTIVITIES.md`](../../docs/MEMBER-ACTIVITIES.md#level-200--retrofit--owns-the-policy-gates--30-minutes--one-install)

**Thirty minutes. Gate one real agent of your own.**
Status: **decide** — this kit describes what ships in P1 (days 31–60) if PRD v3 is approved.

## Who arrives here

A 100 who has something of their own that calls a tool: an agent, a script, a workflow, a bot. The
retrofit path is the path most adopters are actually on (PRD v1 §10), which is why this level exists
before the broker and the hold.

## What you practise

| Part | What you do | Tool |
|---|---|---|
| **Declare** | `beacon gate init` writes a `policy.yaml` scaffold with tiers C0–C4. You fill in three real actions your agent takes and give each a tier and a decision | Umbrella's schema |
| **Decide** | Wrap your agent's tool calls: `decision = gate.check(intent)`; only the broker executes, and only what was approved | `pip install aigovops-beacon`, the Python SDK |
| **Prove** | Run your agent. `beacon gate check` shows the per-session chain and produces the bundle | Beacon |
| **Read** | `lantern read bundle/` in your lens; change one line of policy, run again, `lantern diff run1/ run2/` | Lantern |
| **Return** | `beacon share` — your policy goes to the community catalog as a PR; your story goes to the content folder as a draft. Last line: *Pair with a 100 Thursday.* | the Community |

## Take-home

Your `policy.yaml`, one receipt chain, one diff showing what a policy change did to a real run.

## The worked example

The Global Inclusion Matchmaker (PRD v1 §10, reference implementation 2) is retrofitted in this
directory as the worked example, so the README a stranger follows and the reference implementation the
Foundation maintains are one artifact.

## The return

Your policy is reviewed by a steward like any policy PR (a policy change is a governed event — v1 §8).
Your story ships through the existing content pipeline. On Thursday you pair with a 100 and watch them
close their first loop; a host marks you a 200 when your policy lands.

## What must be true before this kit is called shipped (PRD v2 §8, P1)

- Python SDK on PyPI; `beacon gate init`; the retrofit guide written against the Matchmaker
- Lantern renders gate decisions; `diff` works across two gate runs
- The community policy catalog accepts its first PR from someone who is not a founder
- **Exit test:** one outside engineer retrofits their own agent from this README without us
