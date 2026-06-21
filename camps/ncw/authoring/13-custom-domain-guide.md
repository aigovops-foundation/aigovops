# Custom Domain Setup: `ncw.aigovops-foundation.com` → `ncwaigovopsfoundation.pplx.app`

**Target subdomain:** `ncw.aigovops-foundation.com`  
**Published Perplexity site:** `https://ncwaigovopsfoundation.pplx.app`  
**Perplexity site_id:** `892c2655-8ba4-4502-9744-94b2595b23d0`  
**Last updated:** June 2026

---

## Part 1 — Honest Assessment

### Does pplx.app support native custom domains?

**No — not as of June 2026.**

Perplexity's own changelog describes `*.pplx.app` sites as launching "without configuring hosting, deployment, DNS, backend infrastructure, or environment variables." There is no custom domain field in the Computer publishing interface, no help center article covering it, and no public roadmap entry. The feature simply does not exist yet. Source: [Perplexity changelog, May 2026](https://www.perplexity.ai/changelog/improved-computer-models-and-enterprise-updates---may-4-2026).

A plain DNS CNAME from `ncw.aigovops-foundation.com` pointing at `ncwaigovopsfoundation.pplx.app` will resolve at the DNS level, but Perplexity's edge servers will reject the request with a 404 or redirect because they only respond to the `ncwaigovopsfoundation.pplx.app` hostname — they don't know about your custom subdomain.

### Three viable approaches, ranked

| Rank | Approach | Effort | Cost | HTTPS | Custom hostname served |
|------|----------|--------|------|-------|------------------------|
| 1 | **Cloudflare Worker reverse proxy** | Low–Medium | Free (100k req/day on free plan) | ✅ Auto | ✅ Yes |
| 2 | **Vercel reverse proxy** | Low–Medium | Free (Hobby plan, fair use) | ✅ Auto | ✅ Yes |
| 3 | **Contact Perplexity support** | Low (ask only) | Included with existing plan | ✅ (if supported) | ✅ If granted |
| 4 | **Redirect/link from main site** | Very low | None | N/A | ❌ URL stays pplx.app |

**Recommended path: Option B — Cloudflare Worker.** If your domain is already managed through Cloudflare (likely for an org like AIGovOps Foundation), this is a 15-minute operation: create one Worker, attach the subdomain. No separate hosting account needed. If your DNS is not on Cloudflare, Option C (Vercel) is equally straightforward and takes about the same time.

---

## Part 2 — Recommended Path: Cloudflare Worker Reverse Proxy

This Worker intercepts every request to `ncw.aigovops-foundation.com`, rewrites the hostname to `ncwaigovopsfoundation.pplx.app`, fetches the response from Perplexity's servers, and streams it back — while the browser URL bar always shows your domain.

### Step 1 — Create the Worker

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com) and navigate to **Workers & Pages → Create**.
2. Name the Worker something recognizable, e.g. `ncw-proxy`.
3. In the code editor, delete the default script and paste the following:

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Rewrite the hostname to the pplx.app origin
    url.hostname = "ncwaigovopsfoundation.pplx.app";

    // Forward the request with the rewritten URL
    const modifiedRequest = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "follow",
    });

    const response = await fetch(modifiedRequest);

    // Return the response as-is; Cloudflare handles HTTPS for your domain
    return response;
  },
};
```

4. Click **Save and Deploy**. The Worker is now live on its default `*.workers.dev` subdomain (ignore that URL).

> **Note on the Host header:** Cloudflare automatically strips and rewrites the `Host` header when you use a Custom Domain attachment (Step 2 below). You do not need to manually set it.

### Step 2 — Attach the Worker to your subdomain

There are two sub-paths here depending on whether `aigovops-foundation.com` is on Cloudflare:

#### If `aigovops-foundation.com` is already a Cloudflare zone (most likely)

1. In the Cloudflare dashboard, go to **Workers & Pages → ncw-proxy → Settings → Domains & Routes → Add → Custom Domain**.
2. Enter: `ncw.aigovops-foundation.com`
3. Click **Add Custom Domain**.

Cloudflare automatically creates the DNS CNAME record and provisions a TLS certificate. You are done with DNS — skip to Step 3.

#### If `aigovops-foundation.com` is NOT on Cloudflare

You need to either:
- Transfer DNS management to Cloudflare (free), or
- Use a Worker Route instead (requires the domain to be in a Cloudflare zone), or
- Use the Vercel approach in Part 3 Option C instead.

To bring the domain into Cloudflare without transferring the registrar: log in to Cloudflare, click **Add a Site**, enter `aigovops-foundation.com`, choose the Free plan, and update the nameservers at your registrar to Cloudflare's (provided during setup). Then come back and complete the Custom Domain attachment above.

### Step 3 — Add a DNS CNAME (only if you used Worker Routes instead of Custom Domain)

If for any reason you used the **Routes** attachment method rather than **Custom Domain**, you also need a DNS record manually:

| Type | Name | Target | Proxy status |
|------|------|--------|--------------|
| CNAME | `ncw` | `ncwaigovopsfoundation.pplx.app` | Proxied (orange cloud) |

**The orange cloud is mandatory** — it routes traffic through the Worker. If you set it to DNS-only (grey cloud), the CNAME will resolve but the Worker won't intercept.

### Step 4 — DNS records by registrar

This section covers what to do if you are adding the CNAME manually (not using the Cloudflare Custom Domain auto-setup).

#### Cloudflare DNS (if domain is on Cloudflare but you're using a Route)
1. Go to your domain → **DNS → Records → Add record**.
2. Type: **CNAME** / Name: `ncw` / Target: `ncwaigovopsfoundation.pplx.app` / Proxy: **Proxied**.
3. Save.

#### GoDaddy
1. Sign in → **My Products** → find `aigovops-foundation.com` → **DNS**.
2. Scroll to **Records** → **Add**.
3. Type: **CNAME** / Host: `ncw` / Points to: `ncwaigovopsfoundation.pplx.app` / TTL: 1 hour (or default).
4. **Save**. GoDaddy requires clicking **Save Changes** at the top of the page.  
   Reference: [GoDaddy CNAME guide](https://www.godaddy.com/help/add-a-cname-record-19236)

#### Namecheap
1. Sign in → **Domain List** → **Manage** next to your domain → **Advanced DNS**.
2. Under **Host Records** → **Add New Record**.
3. Type: **CNAME Record** / Host: `ncw` / Value: `ncwaigovopsfoundation.pplx.app` / TTL: **Automatic**.
4. Click the green checkmark to save.  
   Reference: [Namecheap CNAME guide](https://www.namecheap.com/support/knowledgebase/article.aspx/9646/2237/how-to-create-a-cname-record-for-your-domain/)

#### Google Domains / Squarespace (formerly Google Domains)
Google Domains was acquired by Squarespace in 2023. The DNS interface is now under Squarespace Domains.
1. Sign in to [domains.squarespace.com](https://domains.squarespace.com) → select `aigovops-foundation.com` → **DNS**.
2. Scroll to **Custom Records** → **Add Record**.
3. Type: **CNAME** / Host: `ncw` / Data: `ncwaigovopsfoundation.pplx.app` / TTL: 3600.
4. Save.  
   Reference: [Squarespace DNS records guide](https://support.squarespace.com/hc/en-us/articles/360002101888)

### Step 5 — Verify propagation

Run this from your terminal once the record is saved (DNS typically propagates in 5–30 minutes for a fresh record):

```bash
# Check CNAME resolution
dig ncw.aigovops-foundation.com CNAME +short

# Check full resolution chain
dig ncw.aigovops-foundation.com +trace

# Quick HTTP test
curl -I https://ncw.aigovops-foundation.com
```

Expected output for the `dig` CNAME:
```
ncwaigovopsfoundation.pplx.app.
```

Expected HTTP response: `HTTP/2 200` (or `301`/`302` if Perplexity redirects to a canonical path, which is fine).

On Windows (no `dig`):
```powershell
Resolve-DnsName ncw.aigovops-foundation.com -Type CNAME
```

---

## Part 3 — Fallback Options

### Option B: Cloudflare Worker — already the recommended path above

Covered in Part 2. This is Option A in the ranking.

---

### Option C: Vercel Reverse Proxy

Use this if you prefer not to move to Cloudflare, or if `aigovops-foundation.com` is at a registrar that supports simple CNAME records.

**How it works:** Deploy a minimal project to Vercel with a `vercel.json` that proxies all traffic to `ncwaigovopsfoundation.pplx.app`. Attach your subdomain to that Vercel project. Vercel handles HTTPS automatically.

#### Step 1 — Create the Vercel project

Create a local directory with a single file:

```bash
mkdir ncw-proxy && cd ncw-proxy
```

Create `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "https://ncwaigovopsfoundation.pplx.app/$1"
    }
  ]
}
```

Create a minimal `index.html` (Vercel needs at least one file to deploy):

```html
<!DOCTYPE html>
<html><body>Redirecting...</body></html>
```

#### Step 2 — Deploy to Vercel

```bash
npx vercel --prod
```

Follow the prompts (create a new project, link to your Vercel account). Note the assigned `.vercel.app` URL.

#### Step 3 — Add your custom domain in Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard) → your project → **Settings → Domains**.
2. Enter `ncw.aigovops-foundation.com` → **Add**.
3. Vercel displays the DNS record to create: a CNAME pointing to `cname.vercel-dns.com`.

#### Step 4 — Create the DNS record at your registrar

At whichever registrar manages `aigovops-foundation.com`, create:

| Type | Name/Host | Value | TTL |
|------|-----------|-------|-----|
| CNAME | `ncw` | `cname.vercel-dns.com` | 3600 (or auto) |

Use the same registrar-specific steps described in Part 2, Step 4. The only difference is the target value changes from `ncwaigovopsfoundation.pplx.app` to `cname.vercel-dns.com`.

#### Step 5 — Verify

```bash
dig ncw.aigovops-foundation.com CNAME +short
# Expected: cname.vercel-dns.com.

curl -I https://ncw.aigovops-foundation.com
# Expected: HTTP/2 200
```

> **Vercel fair use note:** Vercel's ToS permits reverse proxying your own services. Per [Vercel community confirmation](https://community.vercel.com/t/question-ongoing-reverse-proxy-via-rewrites-and-fair-use-guidelines/13061), using rewrites to proxy traffic to your own infrastructure is explicitly allowed. The "No Proxies" ToS clause targets VPN/anonymization use cases, not legitimate site proxying. Source: [Vercel KB on reverse proxies](https://vercel.com/kb/guide/vercel-reverse-proxy-rewrites-external).

---

### Option D: Redirect / Link from `aigovops-foundation.com`

The lowest-effort option if you just need people to reach the site quickly. This does **not** mask the URL — the browser will end up showing `ncwaigovopsfoundation.pplx.app` in the address bar.

**Simple HTTP redirect (e.g. if you already run a web server or Cloudflare redirect rule):**

Cloudflare Redirect Rule (no Workers needed):
1. Go to your domain in Cloudflare → **Rules → Redirect Rules → Create Rule**.
2. **When incoming requests match:** Hostname equals `ncw.aigovops-foundation.com`.
3. **Then:** Redirect to `https://ncwaigovopsfoundation.pplx.app` — Type: **301 (Permanent)**, Preserve path: **On**.
4. Save and deploy.

You still need a DNS record for `ncw` to exist so Cloudflare can intercept the request:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| AAAA | `ncw` | `100::` | Proxied |

The `100::` is a dummy IPv6 address — Cloudflare intercepts the request before it ever reaches that address.

**Alternatively**, add a visible link in the navigation or footer of `aigovops-foundation.com`:

```html
<a href="https://ncwaigovopsfoundation.pplx.app">NCW Resource Hub</a>
```

This is the zero-infrastructure fallback. Good enough while waiting for Perplexity to add native custom domain support or while getting the Worker configured.

---

## Part 4 — Verification Checklist

Work through these after DNS changes are live.

### DNS propagation

```bash
# Primary check
dig ncw.aigovops-foundation.com +short

# Check from a specific public resolver (bypasses local cache)
dig @8.8.8.8 ncw.aigovops-foundation.com +short
dig @1.1.1.1 ncw.aigovops-foundation.com +short
```

Global propagation check (web tool): [dnschecker.org](https://dnschecker.org) — enter `ncw.aigovops-foundation.com`, type CNAME. Green checkmarks across regions = propagated.

Typical propagation time: **5–30 minutes** for a fresh record with a low TTL. Up to **48 hours** if you're replacing an existing record with a high TTL.

### HTTPS certificate check

```bash
# Confirm TLS cert is valid and covers the right hostname
curl -vI https://ncw.aigovops-foundation.com 2>&1 | grep -E "subject|issuer|SSL|HTTP"

# Or with openssl
echo | openssl s_client -connect ncw.aigovops-foundation.com:443 -servername ncw.aigovops-foundation.com 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

Expected: certificate issued by Let's Encrypt or Cloudflare, covering `ncw.aigovops-foundation.com`, with a valid `Not After` date.

### Functional smoke test

```bash
# End-to-end: does the page actually load?
curl -L https://ncw.aigovops-foundation.com | head -50
```

Expected: HTML content from the pplx.app site (look for `<title>` tags matching your site name).

### Mobile test

Open `https://ncw.aigovops-foundation.com` on a mobile device (not connected to the same network as your desktop, to avoid cached DNS). Confirm:
- Page loads without certificate warning
- No redirect loop
- Content renders correctly

### Search engine reindex note

The pplx.app URL (`ncwaigovopsfoundation.pplx.app`) may already have some indexing. After setting up the custom domain:

1. **Submit the new URL** to Google Search Console: [search.google.com/search-console](https://search.google.com/search-console) → Add property → `ncw.aigovops-foundation.com`.
2. Use the **URL Inspection tool** to request indexing of `https://ncw.aigovops-foundation.com`.
3. If you want the pplx.app URL de-indexed, add a canonical link tag or ask Perplexity support to set it (though this is secondary — search engines will follow the content signal over time).

Note: if you're using the proxy approach, the page content at both URLs is identical. Google generally consolidates to the canonical URL that appears in the page's `<link rel="canonical">` tag, which Perplexity sets to the `pplx.app` domain. This is a minor SEO consideration, not a functional one.

---

## Part 5 — What to Ask Perplexity Support

If you want to pursue Option A (native pplx.app custom domain support) or if the proxy approaches have limitations you run into, here is a support message template ready to paste:

---

**Subject:** Custom Domain Support Request for pplx.app Published Site

Hi Perplexity Support,

I've published a site through Perplexity Computer that I'd like to serve under a custom subdomain we own. I understand custom domain mapping may not be a publicly documented feature yet, but I wanted to reach out to ask whether it's available (or on the roadmap) for our use case.

**Site details:**
- Current URL: `https://ncwaigovopsfoundation.pplx.app`
- Site ID: `892c2655-8ba4-4502-9744-94b2595b23d0`
- Desired custom domain: `ncw.aigovops-foundation.com`

We own and control the DNS for `aigovops-foundation.com` and can create any required CNAME, TXT, or A records to verify ownership and point the subdomain. We're happy to follow whatever verification flow is needed.

Could you confirm:
1. Whether custom domain mapping is currently supported for `*.pplx.app` sites?
2. If so, what records we need to create and whether there's a self-serve flow or if this needs to be handled by your team?
3. If it's not yet available, is this on the roadmap and is there an ETA?

Thank you.

[Your name]  
AIGovOps Foundation

---

**Where to send this:** [Perplexity Help Center](https://www.perplexity.ai/help-center) → Submit a request, or contact via `support@perplexity.ai` if available in your account.

---

## Quick Reference Summary

| | Option | DNS record needed | Time to live | Custom URL served |
|-|--------|-------------------|--------------|-------------------|
| **#1 Recommended** | Cloudflare Worker | Auto-created by CF Custom Domain | ~15 min | ✅ |
| **#2 Fallback** | Vercel proxy | CNAME → `cname.vercel-dns.com` | ~30 min | ✅ |
| **#3 Ask Perplexity** | Native support (if added) | TBD | TBD | ✅ |
| **#4 Quick hack** | CF redirect rule | AAAA `100::` proxied | ~5 min | ❌ URL changes |
