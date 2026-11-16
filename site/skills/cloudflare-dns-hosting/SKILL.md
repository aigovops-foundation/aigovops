---
name: cloudflare-dns-hosting
description: >
  How to put Cloudflare in front of the AiGovOps Foundation GitHub Pages site to fix
  TLS/cert provisioning problems and to host multiple domains from one control plane.
  Use when moving a domain's DNS to Cloudflare, fixing an apex HTTPS/cert error,
  adding another domain that should serve or redirect to the canonical site, or
  debugging a redirect loop / "too many redirects" after enabling the Cloudflare proxy.
  Trigger on "move DNS to Cloudflare", "cert error on the apex", "add a domain",
  "redirect loop", "too many redirects", "set up Cloudflare", "consolidate domains".
---

# Cloudflare + GitHub Pages — DNS, TLS, Multi-Domain

## Why this setup
GitHub Pages issues a TLS cert only for the EXACT domain in its custom-domain field.
That makes apex+www certs fragile and can leave the DNS check "in progress" / cert
unprovisioned for a long time. Putting Cloudflare in front fixes this permanently:
Cloudflare issues and auto-renews certs for every domain and subdomain itself, so
GitHub's per-domain provisioning stops mattering. It also gives one DNS dashboard
for all domains, free CDN, and easy redirects — ideal when consolidating multiple
domains onto one canonical site.

Hosting and management are UNCHANGED: still GitHub repo + GitHub Pages, still managed
via Claude Code through PRs. Cloudflare only sits at the DNS/TLS/CDN layer.

## THE critical setting (this is the #1 failure)
**SSL/TLS encryption mode must be "Full (Strict)" — NEVER "Flexible".**
- GitHub Pages always serves HTTPS and redirects HTTP→HTTPS on its end.
- If Cloudflare is set to **Flexible**, it talks to GitHub over HTTP; GitHub redirects
  to HTTPS; Cloudflare downgrades again → **infinite redirect loop / "too many redirects".**
- **Full (Strict)** = Cloudflare→GitHub over HTTPS with a valid cert (GitHub Pages has
  one for `*.github.io`), which is correct and loop-free.
If you ever see "too many redirects" after enabling the orange-cloud proxy, the cause
is almost always SSL mode set to Flexible. Fix: set it to Full (Strict).

## Prerequisites / known-good baseline FIRST
Before migrating to Cloudflare, get the site healthy on plain GitHub Pages:
- GitHub Pages custom domain = `www.aigovops-foundation.com`, cert issued, www loads
  cleanly over HTTPS. (Apex can be broken at this point — Cloudflare will fix it.)
This gives a rollback point. Do NOT migrate on top of a half-provisioned cert.

## Migration runbook (primary domain) — USER does steps in Cloudflare/registrar

> These steps change nameservers and DNS — irreversible-ish, credentialed actions on
> the user's own accounts. Claude does NOT perform them; Claude prepares values and
> verifies after each step.

1. **Create Cloudflare account** (free) → "Add a site" → enter `aigovops-foundation.com`.
   Choose the Free plan.
2. **Let Cloudflare scan existing DNS.** Review the imported records. Remove anything
   pointing at the old Hostinger/WordPress host.
3. **Set the records** (orange cloud / proxied = ON for apex and www):
   - Apex `@`  → **A** records to GitHub Pages IPs (CNAME flattening also works):
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www`     → **CNAME** → `aigovops-foundation.github.io`
     (NOTE: the new org user-site host — NOT the old `bobrapp.github.io`.)
4. **SSL/TLS → Overview → set mode to "Full (Strict)".**  (Critical — see above.)
5. **SSL/TLS → Edge Certificates → enable "Always Use HTTPS".**
6. **Point the registrar at Cloudflare's nameservers.** Cloudflare gives two
   (e.g. `xxx.ns.cloudflare.com`). At Hostinger (registrar), change the domain's
   nameservers to those two. This is the slow step (propagation up to ~24h, usually
   much faster).
7. **In GitHub Pages settings:** keep custom domain as the canonical choice. With
   Cloudflare proxying + Full (Strict), GitHub's own cert state no longer gates HTTPS,
   but leaving the custom domain set is fine. If GitHub complains, it can be left as
   `www` — Cloudflare handles the apex.
8. **Wait for nameserver propagation**, then verify (Claude can do this part).

## Redirect rule: send apex → www (or www → apex)
Cloudflare → Rules → Redirect Rules. Pick ONE canonical host and 301 the other to it.
Keep it consistent with the GitHub Pages CNAME choice to avoid double-redirects.

## Adding ANOTHER domain later (the multi-domain goal)
For each new domain:
1. Cloudflare → Add a site → enter the new domain → Free plan.
2. Point the new domain's nameservers (at its registrar) to Cloudflare's.
3. Records:
   - To **serve the same site**: same A records (GitHub IPs) + `www` CNAME to
     `aigovops-foundation.github.io`, proxied. Add the domain to GitHub Pages only if
     you want GitHub to recognise it; otherwise a Cloudflare Worker/redirect can map it.
   - To **redirect to the canonical site** (most common for alt domains): a Redirect
     Rule 301-ing the whole domain to `https://www.aigovops-foundation.com/$1`.
4. SSL mode **Full (Strict)** on the new zone too.
5. Verify.

## Registrar consolidation (optional, later)
Domains can be transferred to **Cloudflare Registrar** for at-cost pricing and one
vendor. Not required — Cloudflare DNS works regardless of where the domain is
registered. Do transfers one at a time, well after DNS is stable.

## Verification (Claude can run via browser)
- `https://aigovops-foundation.com` and `https://www.aigovops-foundation.com` both
  load the real site over clean HTTPS (valid cert, no warning).
- One redirects to the other (whichever is canonical), no loop.
- `curl -sI https://<domain>` shows `200` or a single `301`/`302` — never a chain.
- Cert issuer is Cloudflare (or Google Trust Services via Cloudflare), not "in progress".

## Guardrails
- Claude never logs into Cloudflare/registrar or changes nameservers — user-only.
- Always Full (Strict), never Flexible.
- The www target is `aigovops-foundation.github.io` (current org), not `bobrapp.github.io`.
- Keep one canonical host; make every other domain/host 301 to it.
- Migrate one domain at a time; verify before the next.
