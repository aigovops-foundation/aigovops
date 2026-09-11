# Level 200 · Retrofit — checklist

*One page. Tick as you go.* · Scenarios VH-022 Chevrolet of Watsonville · VH-056 Knight Capital · 60 minutes · one install

**Before**
- [ ] I am a 100 (a host marked it).
- [ ] I have an agent, script, bot or workflow of my own that calls a tool.
- [ ] Python 3.11+ and git are installed.

**Declare**
- [ ] I listed my agent's three consequential actions, tiered, with "reversible?" answered.
- [ ] `policy.yaml` has one `C3 hold` with an approver, one `C4 deny` with a reason, and `default: deny`.
- [ ] The rules exist in both forms — sentences and YAML — and say the same thing.

**Policy gate**
- [ ] `umbrella-conformance check .` passed.
- [ ] `umbrella-conformance bundle` produced a bundle; `verify` passed on it.

**Read · diff**
- [ ] `lantern read -r compliance` rendered the bundle.
- [ ] I weakened one rule, rebuilt, ran `lantern diff`, wrote down what it said, and put the rule back.
- [ ] I know where in my CI the policy gate would refuse that downgrade.

**Decide · prove**
- [ ] One real tool call went through a gate (tier-1 `aigovops` gate today; the SDK in Fall) and I have its receipt.

**Return**
- [ ] My `policy.yaml` is in a PR to the catalog.
- [ ] Four sentences for the story pipeline are written.
- [ ] Thursday: I paired with a 100 through their first receipt.
- [ ] A 300 or above marked me 200.
