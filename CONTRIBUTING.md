# Contributing

Thanks for helping govern AI responsibly.

- **Gates are binary.** Every control returns PASS or FAIL — never MAYBE.
  A new check must define both its pass condition and its mitigation path.
- **Zero runtime dependencies** in the core. Node 20+ standard library only.
- **Tests:** add a `test/*.test.mjs` using `node:test` + `node:assert`.
  CI runs `node --test`; keep it green.
- **Humans hold the keys.** Never automate an irreversible move (publishing,
  credential entry, access changes) without an explicit human gate.

## The work queue

GitHub Issues on this repository are the Foundation's one work queue — for every
estate repository, not just this one. Work enters as a ticket (use the templates),
never as a side channel.
Who taps what, as a diagram: [queue/FLOW.md](queue/FLOW.md).

- `queue` — every ticket carries it (set by the templates).
- `ready` — normally a human adds it when the ticket is clear enough to start; the narrow
  Fo text intake exception is defined in [queue/TRIAGE.md](queue/TRIAGE.md). Automation
  picks up `ready` tickets, works on a branch, opens a pull request that links the
  ticket, and stops there. A human merges.
- `blocked` — waiting on a decision, a secret, or a person. Say which in a comment.
- `estate-health`, `estate-uptime` — tickets filed by the Library's monitors.
- `ready:lite` — starts a LITE automation run, for small, clear changes.
- `ready:ultra` — starts an ULTRA automation run, for hard or escalated tickets.
- `worker:devin`, `worker:claude` — which agent works the ticket. The nightly triage sets it to
  keep the two level; a human may change it before adding the start label. No worker label means
  Devin, and `ready:ultra` tickets are always Devin's. It starts nothing by itself. Rules: [queue/WORK.md](queue/WORK.md).
- `in-progress` — an automation run owns the ticket; it is removed when the run ends.
- `discovered` — a side problem filed by automation instead of fixed inline.
- `triaged` — the nightly triage has suggested a start label.
- `automerge` — on a pull request in any estate repository: a person with write access lets the
  nightly estate sweep merge it once it is green and clean. Push again and you must re-add it. Rules:
  [scripts/estate-sweep.mjs](scripts/estate-sweep.mjs); skill: `.claude/skills/estate-sweep/`.

A run that cannot finish escalates one step: lite → `ready` → `ready:ultra` → `blocked`.

A ticket is done when its pull request merges and its **Proof** holds on the live
estate. Close it from the PR body with the fully qualified form,
`Fixes aigovops-foundation/aigovops#N` — a bare `closes #N` in another repository's
pull request points at that repository's issue N, not the ticket.

Open an issue or PR. Be precise and honest; don't overclaim.
