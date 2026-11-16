---
name: hostinger-github-pages
description: >
  Full workflow for connecting a Hostinger domain to a GitHub-hosted static website, with
  auto-deploy on every push and ongoing editing via Claude Code. Use this skill whenever
  the user wants to: set up a new static site on a Hostinger domain backed by GitHub,
  edit or update a site that's deployed via GitHub Pages, add pages or redesign content
  on a site managed through this stack, copy or recreate an existing website (Wix, Squarespace,
  etc.) into a clean static HTML/CSS/JS repo on GitHub, configure GitHub Actions or GitHub
  Pages deployment pipelines, set up the Hostinger MCP server in Claude Code, or push changes
  and see them live at a custom domain. Also trigger for phrases like "update my site",
  "add a page to my website", "deploy to Hostinger", "connect my domain to GitHub",
  "set up auto-deploy", or "edit my site in Claude Code".
---

# Hostinger + GitHub Pages: Static Site Workflow

This skill covers the full lifecycle of a static website: set up once, then edit forever
in Claude Code with auto-deploy on every push to `main`.

## Architecture

```
Claude Code (edit) → GitHub repo (main branch) → GitHub Pages (auto-build) → yourdomain.com
                                                                ↑
                                          Hostinger DNS A records point here
```

- **Files live in** a private GitHub repo
- **Every push to `main`** triggers GitHub Pages to rebuild and deploy (~60 seconds)
- **The domain** (managed on Hostinger) resolves to GitHub's servers via DNS A records
- **Hostinger MCP** lets Claude Code query/manage the hosting account programmatically

For detailed reference on each phase, see the files in `references/`:
- `references/hostinger-mcp-setup.md` — Install and configure the Hostinger MCP
- `references/github-auth.md` — GitHub PAT setup and git credential config
- `references/site-structure.md` — HTML/CSS patterns, file layout, common edits
- `references/dns-config.md` — DNS records, GitHub Pages IPs, propagation
- `references/troubleshooting.md` — Common errors and fixes

---

## Quick-Start Decision Tree

**"I want to set up a new site"** → Read all reference files in order (mcp → github → site → dns)

**"I want to copy an existing website"** → Read `references/site-structure.md` (Copying section), then `references/github-auth.md` and `references/dns-config.md`

**"I just want to edit a page and push"** → Jump straight to the Ongoing Editing Workflow below

**"Something is broken"** → Read `references/troubleshooting.md`

---

## Ongoing Editing Workflow

Once the site is set up, editing is a three-step loop:

```bash
cd ~/my-site         # or wherever the repo is cloned

# 1. Edit the files you want to change
#    index.html, blog.html, events.html, css/style.css, etc.

# 2. Commit
git add -A
git commit -m "describe your change here"

# 3. Push — site is live in ~60 seconds
GIT_TERMINAL_PROMPT=0 git push origin main
```

### Common edits
- **Update homepage text**: edit `index.html`
- **Add a blog post card**: add an `<article class="blog-card">` block to `blog.html`
- **Add a new page**: create `newpage.html` copying the header/footer from an existing page, then link to it from the nav
- **Update styles**: edit `css/style.css` — CSS variables are in `:root {}` at the top
- **Add an image**: drop the file in `images/`, reference as `src="images/filename.jpg"`

---

## Key Values to Record

When setting up a site, note these for future sessions:

```
GitHub repo:       https://github.com/username/repo-name
Local clone:       ~/my-site  (or wherever cloned)
Custom domain:     yourdomain.com
Hostinger user:    u40xxxxxxx  (from hosting_listWebsitesV1 response)
GitHub token:      ghp_...     (store in ~/.git-credentials)
```
