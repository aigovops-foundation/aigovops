# Security Plan — AiGovOps Foundation Site
**Version:** 1.0 | **Date:** 2026-06-03

---

## 1. Threat model

| Threat | Likelihood | Impact | Control |
|--------|-----------|--------|---------|
| API key exposure in client JS | Medium | High | Cloudflare Worker proxy; PROXY_URL pattern |
| Secret leakage via Git history | Low | High | GitHub Secrets only; never in code |
| Supply chain attack via CDN | Low | High | cdnjs.cloudflare.com allowlist; SRI (future) |
| Malicious GitHub Actions workflow | Low | High | Branch protection, required PR reviews |
| XSS via post content | Medium | Medium | HTML is rendered from trusted internal JSON |
| Clickjacking | Low | Low | X-Frame-Options header (GitHub Pages default) |
| Phishing via look-alike domain | Low | Medium | HSTS via GitHub Pages HTTPS enforcement |
| FTP credential compromise | Low | High | SSH key auth preferred; FTP as fallback only |
| CORS bypass on Worker | Low | High | CORS origin allowlist in Worker code |
| DDoS on Worker | Low | Medium | Cloudflare Workers rate limiting (built-in) |

---

## 2. Secrets management

**Principle:** No secrets in code or git history. All secrets in GitHub Actions encrypted store.

| Secret | Rotation cadence | Owner |
|--------|-----------------|-------|
| `ANTHROPIC_API_KEY` | Rotate every 90 days or on personnel change | Bob Rapp |
| `KEN_LINKEDIN_RSS` | Rotate if RSS URL changes | Ken Johnston |
| `BOB_LINKEDIN_RSS` | Rotate if RSS URL changes | Bob Rapp |
| `FTP_SERVER`, `FTP_USERNAME` | Rotate every 90 days | Bob Rapp |
| `SSH_*` keys and credentials | Rotate every 90 days | Bob Rapp |

**Audit:** Review GitHub Secrets last-updated dates quarterly. Remove unused secrets immediately.

**Emergency:** If any secret is suspected compromised:
1. Rotate at the provider (Anthropic Console / Hostinger control panel)
2. Update GitHub Secret within 1 hour
3. Review GitHub Actions logs for suspicious runs
4. Notify Ken Johnston and Bob Rapp

---

## 3. API key exposure risk (frameworks agent)

**Current state:** `PROXY_URL = ''` in `js/chat.js` means the frameworks agent falls back to a direct browser call to the Anthropic API. This means:
- The API key is NOT in the source code (no key in `chat.js`)
- However, without a proxy, the browser call has no API key — the direct fallback only works if a key is somehow available client-side

**Recommendation:** Deploy `functions/frameworks-agent.js` to Cloudflare Workers ASAP, set `PROXY_URL`, and revoke any API keys that were ever tested client-side.

**Status:** Worker code written, deploy pending (Bob/Ken to action).

---

## 4. Branch protection policy

Enforced on the `main` branch:
- No direct pushes to `main` (all changes via PR)
- Require PR review before merge (1 reviewer minimum)
- Require status checks to pass (Cloud-Mary automation-v3.yml)
- No force pushes
- No branch deletion

**Current state:** Not yet enforced in GitHub settings (to action: Settings → Branches → Branch protection rules).

---

## 5. Content Security Policy (future)

GitHub Pages does not support custom HTTP headers without a proxy. When the site moves to a CDN or Cloudflare:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{nonce}' https://plausible.io https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://plausible.io https://api.anthropic.com https://*.workers.dev https://graph.microsoft.com;
  font-src 'self';
  frame-ancestors 'none';
```

**Interim:** Inline scripts in HTML pages use `nonce`-free patterns. No `eval()`.

---

## 6. HTTPS and transport security

- GitHub Pages enforces HTTPS on custom domains — **enabled** ✅
- HSTS is set by GitHub Pages CDN headers
- TLS 1.2+ enforced (GitHub Pages default)
- Hostinger CNAME resolves to GitHub Pages CDN — inherits security posture

---

## 7. Third-party dependencies

| Dependency | Type | Risk | Mitigation |
|------------|------|------|------------|
| Plausible.io script | External JS | CDN compromise | Use SRI hash (future); Plausible is open-source |
| cdnjs.cloudflare.com | CDN | CDN compromise | SRI hashes on all CDN resources (future) |
| Anthropic API | API | Availability | Graceful fallback in chat.js |
| Microsoft 365 Graph | API | Availability | Scheduling agent degrades to mailto: |
| Cloudflare Workers | Compute | Availability | Direct fallback in chat.js |

---

## 8. Responsible disclosure

Security issues should be reported to:
- Bob Rapp: `bob.rapp@aigovops.community`
- Ken Johnston: `ken.johnston@aigovops.community`

Response SLA: acknowledge within 48 hours, patch within 14 days for high severity.

**Note:** The site has no user data, no authentication, and no payment processing. The primary security concern is API key protection and supply chain integrity.

---

## 9. Compliance notes (501(c)(3) context)

- No PII collected or stored on-site (cookieless analytics, mailto: forms only)
- GDPR: Plausible is EU-based, cookieless, no consent banner required
- CCPA: No sale of personal data; no data collected
- Donation links route to GitHub Sponsors and Open Collective — payment processing handled by those platforms (PCI DSS scope is theirs, not ours)
