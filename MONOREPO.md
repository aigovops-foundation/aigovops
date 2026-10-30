# Monorepo

`monorepo.json` is the deployment manifest. Each project declares its source path
(the working directory for its optional build command), URL prefix, output directory
relative to the repo root, and legacy redirects. Phase 0
contains only `trunk-docs`; assembly keeps its Pages output byte-for-byte equal to
the current `docs/`.

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
Its test in `scripts/monorepo/monorepo.test.mjs` skips when `git-filter-repo` is not on
PATH (CI installs it, so the test always runs there).

## Migration phases

This is the plan's migration sequence; Phase 0 does not move a project.

| Phase | Moves | Why this order | Effort |
|---|---|---|---|
| 0 | Secret-scan the site's full history; set up path-filtered CI and the assembling `pages.yml` in `aigovops`; write the stub-redirect template and a link test that hits every URL in the demo script | Nothing moves; proves the deploy and the redirects | ~½ session |
| 1 | site + practice + Library + NCW | Content-only, lowest risk; makes www the single front door | ~1 session |
| 2 | Beacon, Umbrella, Lantern, Vendor RFI, One Receipt | Products with Python/Node CI; install commands change | ~1–2 sessions |
| 3 | OpenClaw | Release signing, canary manifest paths and VPS deploys all need re-pointing | ~1 session |
