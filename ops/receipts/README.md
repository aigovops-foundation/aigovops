# Ticket receipts

`tickets.ndjson` is an append-only, hash-chained record of closed queue issues.
Each line contains a `record`, its SHA-256 `hash` over RFC 8785 canonical JSON,
and `"state":"unsigned"`. The hash chain detects in-place edits; without a
signature it does not prove who wrote a row or prevent a complete rewrite.

The record uses profile `aigovops-ticket.v1` and kind `ticket`. It contains only
allowlisted scalar fields; object values and strings over 200 characters are
rejected. The writer reads issue and timeline data from GitHub's API. It never
copies comments or issue/PR body text into a receipt.

| Field | Meaning |
|---|---|
| `repo` | Repository in `owner/name` form. |
| `issue` | Closed queue issue number. |
| `closedAt` | GitHub's issue close timestamp. |
| `stateReason` | GitHub's close reason, or `null`. |
| `startLabel` | First `ready:lite`, `ready`, or `ready:ultra` label added, or `null`. |
| `finalRung` | Last of those labels added, or `null`. |
| `escalations` | Number of rung-label additions minus one, floored at zero. |
| `blocked` | Whether the `blocked` label was ever added. |
| `discovered` | Whether the closed issue has the `discovered` label. |
| `pr` | Number of the merged PR that closed the issue, or `null`. |
| `merged` | Whether a merged closing PR was found. |
| `hoursToPr` | Hours from the first rung label to PR creation, rounded to one decimal, or `null`. |
| `ciConclusion` | Combined conclusion for check runs on the closing PR head, or `null`. |
| `acu` | Always `null` until a reliable source exists. |
| `prev` | Previous row's hash, or `null` for the first row. |

Run `node scripts/ticket-receipt.mjs --verify` to verify the chain.
