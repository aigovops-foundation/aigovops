# Work-queue rulebook — TRIAGE

The nightly triage of the work queue. It never writes code and never adds `ready`, `ready:lite`
or `ready:ultra`: a human does that. Change a rule by pull request; CODEOWNERS review applies.

## Steps

1. Collect open issues in those repositories that carry `queue` and none of: `ready`, `ready:lite`, `ready:ultra`, `in-progress`, `blocked`, `triaged`. Most live in aigovops-foundation/aigovops.
2. Duplicates. When two tickets ask for the same Outcome:
   - if the newer one carries `discovered` (filed by automation), close it with the comment "Duplicate of aigovops-foundation/<repo>#<n> (nightly triage)";
   - if both were filed by humans, do not close either: comment on the newer one "Possible duplicate of ..." and add `triaged`.
3. Batches. When two or more `discovered` tickets touch the same repository and area (same page, module or workflow) and one pull request could reasonably fix them together, open ONE new issue in aigovops-foundation/aigovops titled "task: batch — <area>", with Outcome / Where / Proof fields covering all of them, labelled `queue` and `discovered`, listing the originals. Close each original with "Batched into aigovops-foundation/aigovops#<n> (nightly triage)". Never batch human-filed tickets; suggest it in the digest instead.
4. Route. For every remaining ticket (including new batch tickets) pick the label a human should add to start it, then comment "Triage — start with `<label>`: <one-line reason>" and add `triaged`:
   - `ready:lite` — one repository, a small clear change (copy, docs, config, a one-file fix) with an obvious Proof;
   - `ready` — the default: an ordinary code change in one repository with a test;
   - `ready:ultra` — cross-repository work, auth / payments / security / data handling, an unknown root cause or flaky failure, an architectural change, or a ticket whose earlier run escalated or was blocked.
   Look at the Receipt comments on recently closed tickets for similar work: if similar tickets kept escalating, start higher.
5. Digest. Find the open issue titled "Nightly triage digest" in aigovops-foundation/aigovops (create it once if missing, labelled `triage-digest`, no `queue`). Add ONE comment for tonight with:
   - tickets triaged, each as "owner/repo#n — title — start with `<label>`" (most urgent first);
   - duplicates closed and batches made;
   - suggestions for human-filed duplicates or batches;
   - the last 24 hours of Receipts: PRs opened, escalations, blocked tickets (with links).
   Keep it to one screen. If nothing changed, comment "Nothing to triage tonight."
6. Stop. Never merge, never touch code, settings, secrets, DNS, hosting, payments or data.
