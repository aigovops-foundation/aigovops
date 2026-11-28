# Work-queue rulebook — TRIAGE

The nightly triage of the work queue. It never writes code and never adds `ready`, `ready:lite`
or `ready:ultra`: normally a human does that. Change a rule by pull request; CODEOWNERS review applies.

One narrow exception, authorized by Bob: issues filed by Omni's `file_work_issue` effector
from a Fo text arrive already labelled `queue` and `ready`, capped at five issues per steward
per rolling 24 hours. Their footer starts with "Filed from a Fo text (sender identity not
verified)." This does not make the text verified human approval, and does not let triage add
start labels to other tickets. Merging remains human-only.

## Steps

1. Collect open issues in those repositories that carry `queue` and none of: `ready`, `ready:lite`, `ready:ultra`, `in-progress`, `blocked`, `triaged`. Most live in aigovops-foundation/aigovops.
2. Duplicates. When two tickets ask for the same Outcome:
   - if the newer one carries `discovered` (filed by automation), close it with the comment "Duplicate of aigovops-foundation/<repo>#<n> (nightly triage)";
   - if both were filed by humans, do not close either: comment on the newer one "Possible duplicate of ..." and add `triaged`.
3. Batches. When two or more `discovered` tickets touch the same repository and area (same page, module or workflow) and one pull request could reasonably fix them together, open ONE new issue in aigovops-foundation/aigovops titled "task: batch — <area>", with Outcome / Where / Proof fields covering all of them, labelled `queue` and `discovered`, listing the originals. Close each original with "Batched into aigovops-foundation/aigovops#<n> (nightly triage)". Never batch human-filed tickets; suggest it in the digest instead.
4. Route. For every remaining ticket (including new batch tickets) pick the label a human should add to start it and the worker who will take it, then comment "Triage — start with `<label>`: <one-line reason> · worker: <Devin or Claude>", add that worker's label (`worker:devin` or `worker:claude`) and add `triaged`:
   - `ready:lite` — one repository, a small clear change (copy, docs, config, a one-file fix) with an obvious Proof;
   - `ready` — the default: an ordinary code change in one repository with a test;
   - `ready:ultra` — cross-repository work, auth / payments / security / data handling, an unknown root cause or flaky failure, an architectural change, or a ticket whose earlier run escalated or was blocked.
   Look at the Receipt comments on recently closed tickets for similar work: if similar tickets kept escalating, start higher.
   Worker. A `ready:ultra` ticket is Devin's: give it `worker:devin`, replacing `worker:claude` if it is there. For `ready:lite` and `ready`, keep the two workers level. Count each worker's open `queue` tickets, leaving out `blocked` ones and including the ones you have assigned tonight: Claude's are those that carry `worker:claude`; Devin's are those that carry `worker:devin`, plus those with no worker label that already carry a start label (unlabelled tickets are Devin's, and Fo-text tickets arrive started). Give this ticket to the worker with fewer; on a tie, Devin. A worker whose tickets pile up therefore gets fewer new ones. If a `ready:lite` or `ready` ticket already carries a worker label, a human chose it: leave it. A worker label starts nothing; the start label still does, and a human still adds it.
5. Digest. Find the open issue titled "Nightly triage digest" in aigovops-foundation/aigovops (create it once if missing, labelled `triage-digest`, no `queue`). Add ONE comment for tonight with:
   - tickets triaged, each as "owner/repo#n — title — start with `<label>` · <worker>" (most urgent first);
   - duplicates closed and batches made;
   - suggestions for human-filed duplicates or batches;
   - the last 24 hours of Receipts: PRs opened, escalations, blocked tickets (with links).
   Keep it to one screen. If nothing changed, comment "Nothing to triage tonight."
6. Stop. Never merge, never touch code, settings, secrets, DNS, hosting, payments or data.
