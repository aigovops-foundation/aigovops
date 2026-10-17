# Monorepo

`monorepo.json` is the deployment manifest. Each project declares its source path
(the working directory for its optional build command), URL prefix, output directory
relative to the repo root, optional excluded path segments, and legacy redirects.
Phase 1 imports the Foundation site, Practice, and NCW with history; no live URL
changes until cutover.

Run the Pages assembler locally with:

```bash
node scripts/monorepo/assemble.mjs
```

It writes the combined site to ignored `_site/`. The redirect template can be
generated with:

```bash
node scripts/monorepo/redirect-stub.mjs \
  --from https://aigovops-foundation.github.io/aigovops-beacon/ \
  --to https://www.aigovops-foundation.com/beacon/ \
  --out /tmp/beacon-redirect
```

To import a repository with its history, install `git-filter-repo` first
(`brew install git-filter-repo` on macOS), then run from this repository:

```bash
scripts/monorepo/import-repo.sh <git-url> <branch> <dest-path> \
  [--drop-path <path>]... [--replace-text <file>]
```

The import script refuses dirty trees and existing destinations. It rewrites the
source history into the destination path, fetches it, and merges it without pushing.

## Workflow secrets

Add these repository secrets to `aigovops` before cutover:

| Secret | Used by |
|---|---|
| `ANTHROPIC_API_KEY` | `site-automation-v3`, `site-fetch-linkedin-posts`, `site-publish-content` |
| `BOB_LINKEDIN_RSS` | `site-fetch-linkedin-posts` |
| `KEN_LINKEDIN_RSS` | `site-fetch-linkedin-posts` |
| `POSTIZ_API_KEY` | `site-linkedin-tuesday` |

## Cutover runbook

1. Add the workflow secrets listed above to `aigovops`.
2. Refresh the imports before merging the Phase 1 PR. Since the importer refuses
   existing destinations, do not rerun it in the Phase 1 worktree. From a clean
   checkout on the Phase 1 branch, create a temporary worktree from fresh
   `origin/main`, run all three imports there, then merge that refresh branch into
   the Phase 1 branch:
   ```bash
   git fetch origin main:refs/remotes/origin/main
   refresh_id=$(date +%s)
   refresh_branch="devin/${refresh_id}-refresh-imports"
   refresh_dir="../aigovops-refresh-${refresh_id}"
   git worktree add -b "$refresh_branch" "$refresh_dir" origin/main
   (
     cd "$refresh_dir"
     scripts/monorepo/import-repo.sh \
       https://github.com/aigovops-foundation/aigovops-foundation-site-redesign-June2026-ken-and-bob.git \
       main site --drop-path transcripts --drop-path .backups \
       --replace-text /Users/devin/govops-wiki/plans/scan/site-replace-token.txt
     scripts/monorepo/import-repo.sh \
       https://github.com/aigovops-foundation/practice.git main practice
     scripts/monorepo/import-repo.sh \
       https://github.com/aigovops-foundation/aigovops-ncw-ai-camp.git main camps/ncw
   )
   git merge --no-edit "$refresh_branch"
   ```
   Re-run the full-history Gitleaks scan and token count, and get both to 0,
   before you merge.
3. Disable the workflows in the site, Practice and NCW repos so they stop committing
   to the old copies.
4. Remove the custom domain from the Foundation site repository's Pages settings.
5. Merge the Phase 1 monorepo PR, then set the `aigovops` Pages custom domain to
   `www.aigovops-foundation.com` and enforce HTTPS.
6. Merge the Practice and NCW redirect-stub PRs.
7. Run `node scripts/monorepo/link-test.mjs --cutover`.
8. After the cutover link test passes, remove the PRE-CUTOVER URL alternation from
   `site-link-check.yml`'s `skip_pattern` (retain `/cdn-cgi/`), the Practice URL
   exclusion from `practice-link-check.yml`, and the pre-cutover remaps from the
   Site persona-journey test.
9. Archive the old repositories only after a week of green checks.

After cutover, deep links under `github.io/aigovops/` land at `www` paths; trunk
documentation is now served under `/aigovops/`.

The current live-estate check uses `estate-urls.json`. The post-cutover check uses
`estate-urls.cutover.json` via `--cutover`.

## Migration phases

This is the plan's migration sequence; Phase 0 does not move a project.

| Phase | Moves | Why this order | Effort |
|---|---|---|---|
| 0 | Secret-scan the site's full history; set up path-filtered CI and the assembling `pages.yml` in `aigovops`; write the stub-redirect template and a link test that hits every URL in the demo script | Nothing moves; proves the deploy and the redirects | ~½ session |
| 1 | Foundation site + Practice + NCW (Library and Omni remain separate) | Content-only, lowest risk; makes www the single front door | ~1 session |
| 2 | Beacon, Umbrella, Lantern, Vendor RFI, One Receipt | Products with Python/Node CI; install commands change | ~1–2 sessions |
| 3 | OpenClaw | Release signing, canary manifest paths and VPS deploys all need re-pointing | ~1 session |
