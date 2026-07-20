# Wix Change Log

Version-controlled record of every change applied to the live Wix site for AiGovOps Foundation, with BEFORE/AFTER screenshots and rollback instructions.

## How this works

- Each change = one numbered folder (`NNN-short-slug/`) = one atomic, revertable unit.
- Each folder contains:
  - `CHANGE.md` — what changed, why, exact field values, status (planned/applied)
  - `ROLLBACK.md` — step-by-step instructions to undo the change inside the Wix Harmony editor
  - `BEFORE.png` — screenshot of the Wix editor before the change
  - `AFTER.png` — screenshot after the change is applied
- Each step is a separate git commit, so `git revert <sha>` rolls back the changelog record.
- Wix itself is not git-backed, so undo inside Wix is manual via `ROLLBACK.md` or via Wix Site History (toolbar cloud icon). Each `CHANGE.md` records the Wix Site History timestamp for pairing.

## Index (newest first)

| # | Block | Status | Folder |
|---|-------|--------|--------|
| 001 | Header / Nav | planned | [001-header-nav](./001-header-nav/) |

## Source of truth

Mapping spec: [`../WIX-MAPPING.md`](../WIX-MAPPING.md)  
Live reference: https://www.aigovops-foundation.com/
