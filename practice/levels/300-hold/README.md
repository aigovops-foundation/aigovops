# Level 300 — Hold

> **v3:** owns the **operate gate** · built on **VH-015 Arup** (the hold), **VH-035 Cigna PXDX** (aggregation) and **VH-011 nH Predict** (clinical judgment) · agent identity binding (F15) · maps to the **AAL-3 Automated Monitoring** pattern · mark by a 400. Full activity: [`docs/MEMBER-ACTIVITIES.md`](../../docs/MEMBER-ACTIVITIES.md#level-300--hold--owns-the-operate-gate--a-week-of-real-traffic)

**A week of real traffic. Humans in the loop, budgets, and the broker.**
Status: **decide** — this kit describes what ships in P1 (days 31–60) if PRD v3 is approved.

## Who arrives here

A 200 whose agent touches people, money, or rights — anything at tier C2 or above. This is where the
gate stops being advisory: fail-closed above C1, mandatory stop conditions, and a broker that can only do
what was approved (PRD v1 §3, §5).

## What you practise

| Part | What you do | Tool |
|---|---|---|
| **Declare** | Add a C3 control with a named `approver_role`, per-session and per-day budgets, and the mandatory stop conditions. Add a C4 with a reason | Umbrella's schema, v1 §8 in full |
| **Decide** | Run the agent under real traffic. Holds queue for the approver; releases are receipted; N small actions that add up to a big one escalate the tier | `beacon hold list` / `beacon hold release`; the broker on the Library's `SecretsProvider` and capability dial |
| **Prove** | Every hold and every release has a receipt; the chain has no gaps; `beacon coverage` gives one honest number | `beacon coverage`; `beacon gate test --adversarial` (the nine attacks from v1 §12, green) |
| **Read** | Read your own week in the auditor and regulator lenses. Then pick a bundle from the catalog and read someone else's | Lantern |
| **Return** | Verify another practitioner's bundle before Thursday and say what you found. Last line: *Pick a bundle from the catalog and verify it before Thursday.* | the Community |

## Take-home

A coverage claim you can defend: *gate coverage 9x% over 30 days.* This is a claim about a **system**,
stated in the system's terms (v1 §6). It says nothing about your level, and your level says nothing
about it.

## The return

You verify someone else's bundle on Thursday and say so in front of them. You mentor a 200 through their
first retrofit. A host marks you a 300 after your first public verification.

## What must be true before this kit is called shipped (PRD v2 §8, P1)

- Broker contract on the Library's existing secrets, capability and sandbox primitives (T0, T1, T3, T5)
- Hold queue with expiry; stop conditions complete with tests; chain gap detection
- `beacon coverage`; the adversarial suite green and exposed as `beacon gate test --adversarial`
- The practitioner ledger live, opt-in, hash-only
- **Exit test:** one 300 verifies someone else's bundle on a Thursday and says so
