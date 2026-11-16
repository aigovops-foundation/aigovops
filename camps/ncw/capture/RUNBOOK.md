# Runbook — the Demo Lab capture rig (a credentials-agent function)

*The rig captures every demo's good path as step-by-step screenshots — automatically,
repeatably, and with every secret living in 1Password. It follows the estate's standing
credential rule (`Omni-Rapp docs/RUNBOOK-credentials.md`): the founders' only manual act
is a login, once; everything else is the machine's job.*

## What it is

Three scripts under `capture/`:

| Script | What it does | Human involvement |
|---|---|---|
| `npm run capture:auth -- <tool …>` | Opens a **headed** browser at each tool's login page; the human signs in; the session (Playwright storageState) is pushed to 1Password as a document | **The one human step.** The rig never touches the login form — logins are credential entry, and credential entry is always the human's move |
| `npm run capture -- <demo-id …> \| --all` | Pulls sessions from 1Password, replays each demo's recipe **headless**, writes `docs/assets/captures/<id>/stepN-*.png` + a date-stamped `manifest.json` the Demo Lab page picks up automatically | none |
| `npm run capture:check` | Reports per-tool session presence + cookie expiry (`✓ / ✗`, exit 2 on any missing) — the probe the credentials agent runs | none |

## Where the secrets live

One 1Password **document** per account, in the `AiGovOps` vault, following the estate slug
convention:

- `ncw-capture-session-chatgpt`
- `ncw-capture-session-claude`
- `ncw-capture-session-google` (covers Gemini, NotebookLM, Sites/Forms/Calendar)
- `ncw-capture-session-copilot`

Session JSON exists on disk only for the lifetime of a run (0600, temp dir, deleted after).
`.capture-sessions/` (the `--keep-local` escape hatch) is gitignored. The `op` CLI
authenticates via a signed-in session or `OP_SERVICE_ACCOUNT_TOKEN` — the service-account
path is the one that works on Macs where the CLI is blocked by a 1Password 7 install.

## The Jeeves wiring (aigovops-agent-credentials)

The credentials agent (`aigovops-agent-credentials`, Guardian) treats the four session
documents like any other credential it coordinates:

1. **Audit** — its existing presence audit extends to the four `ncw-capture-session-*`
   items; `npm run capture:check` in this repo is the concrete probe (read-only, zero-spend,
   exit 2 = alert).
2. **Humans-Do card** — one card per session: *"Sign in once for the NCW capture rig —
   `npm run capture:auth -- <tool>`"*. The card self-ticks when the probe turns ✓, exactly
   like the paste-once credential pipeline.
3. **Schedule** — a weekly `ncw-capture-refresh` schedule runs `capture:check`; on ✓ it runs
   `capture --all` and commits refreshed screenshots (reversible, so automatable under the
   manual-work rule); on ✗ it pings Telegram naming the tool and the exact auth command.
   Bump to daily the week before Aug 11 (free-tier drift window).
4. **Gates** — capturing is generate-and-screenshot only; recipes cannot publish, post,
   send, or record audio. Session *creation* (the login) stays a human act, forever.

The Omni-side registration (GUIDANCE entries for the four slugs + the schedule) is drafted
in the Omni repo as `docs/RUNBOOK-ncw-capture.md` and ships with the next Omni deploy —
that repo's cloud-mary battery gates its own push.

## Recipe coverage

Pilot recipes (free track): **1-1** ChatGPT Search grants · **1-4** Claude Artifact deck ·
**2-4** Claude field card + audit table · **4-1** ChatGPT clinic policy. Add recipes to
`capture/recipes.mjs` as they're proven live; product UIs drift, so every recipe fails
loudly with a `debug-failure.png` rather than capturing the wrong thing.

## Staging rules (inherited from the Demo Lab, non-negotiable)

Synthetic data only (recipes embed their own stand-ins) · nothing publishes or sends ·
bad paths are captured only to the last reversible moment, and those recipes are added
by hand, deliberately, never by default.
