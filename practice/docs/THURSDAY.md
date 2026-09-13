# Thursday — the run-of-show and the mark ritual

## Next Thursday

<p class="thursday-next"><strong><span data-thursday="date">the next Thursday</span> · <span data-thursday="time">15:00 Pacific</span></strong> · <span data-thursday="host">Ken</span> hosts.</p>

<p><strong>Join:</strong> <a data-thursday="join" href="https://community.aigovops-foundation.com/events.html">the link is on the community events page</a>.
Bring a receipt, or come to watch one. The date above is computed; the link is set once in
<code>assets/thursday.js</code> and every Thursday page reads it.</p>

<script src="../assets/thursday.js"></script>

## Run-of-show (60 minutes, Ken hosts until a 400 does)

| Minute | What happens | Who |
|---|---|---|
| 0–5 | **Receipts.** Every 100 shows a bundle hash and says the rule they wrote. No slides. | the 100s |
| 5–15 | One 200 shows a diff: what one policy change did to a real run. | a 200 |
| 15–25 | One 300 says a coverage number — or "cannot count yet" — and who could reproduce it. | a 300 |
| 25–35 | One 400 reads a verification statement of someone else's bundle, offline. | a 400 |
| 35–50 | The case of the week (FailFest) — the gate that would have caught it, in plain words, then as code. | the host |
| 50–58 | **Marks.** The host reads each mark aloud (the line below). | the host |
| 58–60 | Who hosts next; who is pairing with whom; the Tuesday Letter line. | the host |

The second-hour Thursday (for people who cannot make 15:00 Pacific) is proposed, not yet on the calendar; say so on your Wren Card and a host pairs you.

## The mark line — the receipt until the receipt exists

One line per mark, written by the host into the Thursday recap (the recap becomes next week's story):

```
MARK · <level> · <first name or "a member", with permission> · <bundle or artifact hash, first 12> · host <host's name> · <date>
```

Example: `MARK · 100 · Bob · 7f3a9c1e02bd · host Ken · 2026-09-17`

Rules: a mark names a level, never a system; the hash is the artifact's, never its content; "with
permission" means the person said yes on the call; a mark can be corrected by the same host in the next
recap. When `practice.mark` receipts exist, the host's line is generated from the receipt, not typed.

## What the host writes after

One file, ten minutes: `docs/thursdays/YYYY-MM-DD.md` from the template — the mark lines, one paragraph
of what stung, who hosts next, the pairs. The Monday keeper turns it into Tuesday's story. No file,
no Thursday story; the queued corpus case goes instead.

## What the host brings

- The manifesto, printed, one per table.
- A laptop that can run Beacon's browser demo — for anyone who came without one (the *no one left behind* table).
- The case of the week, from FailFest.
- Last week's recap, for the marks that were promised.

---

<small>Adopted 11 September 2026 (advice item 6). The mark ritual works before the ledger exists; when
`practice.mark` receipts land (Library #88), the mark line above becomes the receipt's human-readable form.</small>
