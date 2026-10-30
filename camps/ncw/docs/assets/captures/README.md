# Captured walkthroughs — the capture rig's output lands here

`docs/assets/js/demos.js` fetches `manifest.json` on every Demo Lab page load and renders a
screenshot strip for any demo the manifest knows about.

**`manifest.json` is committed as `{}` on purpose.** Until the rig has run, there are no
captures — and an absent file makes that fetch a 404 in every visitor's network log. The
page itself is fine either way (the fetch is `r.ok ? r.json() : {}`, and a demo with no
entry renders without a strip), so this is noise, not breakage. An empty manifest is the
honest way to say "no captures yet" and keeps the console clean in front of a room.

Do not delete it. `capture/capture-demos.mjs` **reads this file and merges into it**, so a
committed `{}` is exactly the starting state the rig expects — it is overwritten with real
entries the first time a recipe captures successfully.

To populate it, see `capture/RUNBOOK.md`. Short version: `npm run capture:auth -- <tool>`
once per tool (headed, a human signs in — the rig never touches a login form), then
`npm run capture -- --all`.
