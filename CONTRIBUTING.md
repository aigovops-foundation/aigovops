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

- `queue` — every ticket carries it (set by the templates).
- `ready` — a human adds it when the ticket is clear enough to start. Automation
  picks up `ready` tickets, works on a branch, opens a pull request that links the
  ticket, and stops there. A human merges.
- `blocked` — waiting on a decision, a secret, or a person. Say which in a comment.
- `estate-health`, `estate-uptime` — tickets filed by the Library's monitors.
- `ready:lite` — starts a LITE automation run, for small, clear changes.
- `ready:ultra` — starts an ULTRA automation run, for hard or escalated tickets.
- `in-progress` — an automation run owns the ticket; it is removed when the run ends.
- `discovered` — a side problem filed by automation instead of fixed inline.
- `triaged` — the nightly triage has suggested a start label.

A run that cannot finish escalates one step: lite → `ready` → `ready:ultra` → `blocked`.

A ticket is done when its pull request merges and its **Proof** holds on the live
estate. Close it from the PR body with the fully qualified form,
`Fixes aigovops-foundation/aigovops#N` — a bare `closes #N` in another repository's
pull request points at that repository's issue N, not the ticket.

Open an issue or PR. Be precise and honest; don't overclaim.
