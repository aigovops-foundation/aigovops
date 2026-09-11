# Level 200 · Retrofit — worksheet

**Scenarios:** the bot that agreed to sell a Tahoe for $1 (FailFest **VH-022, Chevrolet of
Watsonville / Fullpath**) and the deploy that lost $440M in 45 minutes (**VH-056, Knight Capital**).
**Time:** 60 minutes. **Install:** Python 3.11+, git; one `pip install` from source.
**Skills needed:** either. The plain-words path writes the rules as sentences and lets the tools render
them; the code path writes YAML and reads the sentences back.
**Train:** Fall 2026 · **live** works today; **fall** lands in the Fall release.

| Step | Minutes | Status |
|---|---|---|
| 1 Read both cases | 5 | live |
| 2 List your agent's three consequential actions | 10 | live |
| 3 Declare the policy | 10 | live |
| 4 Policy gate: validate it, build a bundle | 10 | live |
| 5 Read it, change one line, diff | 10 | live |
| 6 Gate one real call | 10 | live (tier-1 gate) → fall (SDK) |
| 7 Return | 5 | live |

---

### 1 · Read both cases (5 min) — live

**VH-022.** A dealership's customer-service bot, prompted to "agree with anything the customer says",
agreed to sell a 2024 Tahoe for $1 and called it a legally binding offer. Gate: *system prompts are not
security boundaries; consequential commitments require deterministic rules, not LLM goodwill.*

**VH-056.** Knight Capital deployed new trading code to seven of eight servers; the eighth ran old code
with a repurposed flag. Forty-five minutes, $440 million. Gate: *algorithmic systems with market-moving
authority have deploy gating, kill switches and rehearsed rollback.*

One is about the agent. One is about the pipeline that ships the agent. You will gate both.

### 2 · Your agent's three consequential actions (10 min) — live

Pick something of yours that calls a tool: a chatbot, a script, a workflow, a coding agent. List the
three actions it can take that would matter if it took them wrongly, and tier each:

| # | Action (as the system names it) | Who or what it affects | Tier | Reversible? |
|---|---|---|---|---|
| 1 | `______________` | | C_ | ☐ |
| 2 | `______________` | | C_ | ☐ |
| 3 | `______________` | | C_ | ☐ |

If none is C2 or above, your agent does not need a gate yet — write that down; it is a finding.

### 3 · Declare the policy (10 min) — live

**Plain-words path.** Write one sentence per action, in the corpus's style — *"a commitment to a
customer is never made by the model alone."*

**Code path.** Put the three controls in `policy.yaml` (template beside this worksheet). Include one
`C3 hold` with an `approver_role`, and one `C4 deny` with a `reason`. Unknown actions are denied by
default; write that line too.

Whichever path you took, produce the other: read the YAML aloud as sentences, or have a colleague on
the code path type your sentences in. Byte-identical receipts later depend on the rule being one rule.

### 4 · Policy gate — validate it, build a bundle (10 min) — live

```bash
pipx install git+https://github.com/aigovops-foundation/umbrella-govops   # or: pip install .
umbrella-conformance check .            # the policy gate: the rule is valid or it does not run
umbrella-conformance bundle --out ./out # a signable evidence bundle
umbrella-conformance verify ./out/bundle.tar.gz
```

Record: check ☐ passed ☐ failed (what it said: ______________). Bundle path: ______________

*Fall:* `pipx install umbrella-conformance` from PyPI; the gate vocabulary (tiers, decisions,
constraints, stop conditions) validated by name; the policy catalog accepts your file by PR.

### 5 · Read it, change one line, diff (10 min) — live

```bash
pip install git+https://github.com/aigovops-foundation/aigovops-lantern.git
lantern read -f markdown -r compliance ./out/<receipts>.ndjson
```

Now weaken one rule — turn the `C3 hold` into `C1 allow` — rebuild, and:

```bash
lantern diff -r engineer ./before.ndjson ./after.ndjson
```

Write what the diff said changed: ______________________________________

Put the rule back. This is the Knight Capital gate: a policy change is itself a governed event. In
your CI, the policy gate refuses the merge until a reviewer sees that diff. *(Fall: the Lantern GitHub
Action posts it on the PR.)*

### 6 · Gate one real call (10 min) — live with the tier-1 gate · fall with the SDK

**Live.** The Foundation's `aigovops` repo runs the gate alone with zero dependencies:
`node packages/cli/src/cli.mjs up --tier 1` from a clone (see its README). Point one of your agent's
tool calls through it for one run and keep the receipt it writes.

**Fall.** `pip install aigovops-beacon` · `beacon gate init` · wrap the call:
`decision = gate.check(intent)` — only the broker executes, and only what was approved.

Either way, record the one receipt: seq ____ · decision ______ · action hash __________

### 7 · Return (5 min) — live

Open a PR that adds your `policy.yaml` to this repo under `catalog/<your-system>/` (fall: the Umbrella
catalog). Write four sentences for the story pipeline: what the agent does, what it must never do, what
the gate said, what changed. Thursday: pair with a 100 and watch them get their first receipt.

---

**Take-home:** your policy in the catalog; one bundle; one diff; one refused downgrade.
**Next:** [Level 300 — Hold](../300-hold/WORKSHEET.md), when the agent touches people, money or rights.
