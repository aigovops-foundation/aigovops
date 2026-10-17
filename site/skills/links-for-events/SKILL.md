---
name: links-for-events
description: >
  Updates the event link (and any other resource URLs) in the AiGovOps Foundation website
  chatbot and deploys the change live. Use this skill whenever the user mentions a new event,
  wants to update the Luma link, change the newsletter URL, update a LinkedIn or GitHub link,
  or says anything like "new event", "update the event link", "we have a new luma event",
  "change the event URL", "update the chatbot links", "point the chatbot to our new event",
  or "update the site links". Trigger even if the user just pastes a Luma, Substack, LinkedIn,
  or GitHub URL and says "update this" or "use this one now".
---

# Links for Events — AiGovOps Site Link Updater

This skill updates resource URLs in the AiGovOps Foundation website and deploys them live.
All six chatbot links live in one place: `~/aigovops-repo/js/chat.js`, in the `RESOURCES`
object at the top of the file.

## The Six Links

| Key | What it points to | Changes how often |
|-----|------------------|-------------------|
| `newsletter` | Substack subscribe page | Rarely |
| `event` | Current Luma event | Every event 🔄 |
| `ken` | Ken Johnston's LinkedIn | Rarely |
| `bob` | Bob Rapp's LinkedIn | Rarely |
| `beacon` | Beacon GitHub repo | Rarely |
| `lantern` | Lantern GitHub repo | Rarely |

The `event` URL is the one that changes most — update it whenever a new event is posted on Luma.

## Workflow

### Step 1 — Get the new URL

The user will provide it (or paste it). If not, ask: "What's the new URL?"

Confirm which key it's for if it's ambiguous. A `lu.ma/...` URL → `event`. A `substack.com` URL → `newsletter`. `linkedin.com/in/kenjohnston` → `ken`. Etc.

### Step 2 — Edit the file

Open `~/aigovops-repo/js/chat.js`. Find the `RESOURCES` object near the top.
Update the `url` field for the relevant key. Only change `url` — leave `label` and `cta` alone
unless the user specifically asks to change them too.

```js
// Before:
event: {
  url:   'https://lu.ma/aigovops',  // ← old URL
  label: 'Upcoming AiGovOps Event on Luma',
  cta:   'View & Register on Luma →',
},

// After (example):
event: {
  url:   'https://lu.ma/abc123xyz',  // ← new URL
  label: 'Upcoming AiGovOps Event on Luma',
  cta:   'View & Register on Luma →',
},
```

### Step 3 — Commit and push

```bash
cd ~/aigovops-repo

git add js/chat.js
git commit -m "Update event link: <brief description or just the new URL>"

# Push using the stored token (non-interactive):
GIT_TERMINAL_PROMPT=0 git push origin main
```

If the push fails with "fetch first", pull and rebase first:
```bash
git pull --rebase origin main
git push origin main
```

Authentication is handled by the machine's local git credentials — **never embed a
personal access token in this file or any command**. This machine already has `gh`
logged in (`gh auth status` shows the active account) and macOS Keychain holding the
credential, so plain `git pull` / `git push origin main` against the `origin` remote
authenticate non-interactively with no token in sight. If git ever prompts, run
`gh auth setup-git` once to wire `gh` in as the git credential helper.

### Step 4 — Confirm

Tell the user: "Done — the [event / newsletter / etc.] link is updated and will be live on
aigovops-foundation.com within about 60 seconds."

## Updating Multiple Links at Once

If the user provides several URLs in one message, update all of them in a single edit to
`chat.js`, then do one commit that mentions all the changes. Don't do a separate commit per link.

## Key File Locations

```
~/aigovops-repo/
├── js/chat.js          ← ALL six URLs live here (RESOURCES object, top of file)
├── index.html          ← Action card hrefs also reference these URLs (update manually if needed)
└── css/style.css       ← Styling only, no URLs
```

The `index.html` hero action cards have their own `href` attributes that duplicate some of
these URLs (newsletter, event, ken, bob, beacon, lantern). If the user asks to update both
the chatbot AND the hero cards, edit `index.html` too and include it in the same commit.

## If Authentication Fails

If `git push` fails with authentication errors, the local credential has expired or is
missing. Tell the user to re-authenticate `gh` (which stores the credential in the macOS
Keychain — no token is ever written into this repo):
"Run `gh auth login` (choose GitHub.com → HTTPS → login with a browser, or paste a fresh
token with `repo` + `workflow` scopes), then `gh auth setup-git`. After that `git push`
works again with no embedded secret."
