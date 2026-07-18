#!/usr/bin/env bash
# Cloud-Mary security tier (M12a) — security posture of the public site.
# LIVE (network-tolerant): response headers on production, HTTP→HTTPS redirect.
# LOCAL: no http:// links/forms, no secrets in source, external-script
#        allowlist, target=_blank rel=noopener, no eval/Function in handlers.
#
# Header policy (documented): the site is GitHub Pages behind Cloudflare.
# GitHub Pages cannot set custom response headers, and Cloudflare Transform
# Rules are an account-level (steward) surface outside this repo — so missing
# HSTS / X-Content-Type-Options / Referrer-Policy / CSP headers are WARNINGS
# (surfaced, never failures). What IS controllable from this repo — a meta CSP
# if one ships, HTTPS-only links, secret-free source — is checked hard.
# Run: bash scripts/test-security.sh   (SKIP_NETWORK=true skips live checks)

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PASS=0; FAIL=0; WARN=0
SITE="${SITE_URL:-https://www.aigovops-foundation.com}"
TIMEOUT=20

check() {
  local label="$1" result="$2"
  if [ "$result" = "ok" ]; then
    echo "  ✅  $label"; PASS=$((PASS+1))
  else
    echo "  ❌  $label — $result"; FAIL=$((FAIL+1))
  fi
}

warn_if_missing() {
  # Headers GitHub Pages structurally cannot set: warn, never fail.
  local headers="$1" name="$2" note="$3"
  if echo "$headers" | grep -qi "^$name:"; then
    check "header $name present" "ok"
  else
    echo "  ⚠️   header $name absent — $note"; WARN=$((WARN+1))
  fi
}

# Page inventory (mockups/ and .backups/ excluded by construction).
PAGES=()
for f in "$REPO"/*.html; do PAGES+=("$f"); done
for f in "$REPO"/blog/*.html; do PAGES+=("$f"); done
JS_FILES=()
for f in "$REPO"/js/*.js "$REPO"/js/i18n/*.js; do [ -f "$f" ] && JS_FILES+=("$f"); done

echo ""
echo "🔒  Security Tests (M12a)"
echo ""
echo "  Pages: ${#PAGES[@]} html · ${#JS_FILES[@]} js"

# ── 1. Live: response headers + HTTPS enforcement ──────────────────────────
echo ""
echo "  [Live — response headers on $SITE]"
if [ "${SKIP_NETWORK:-false}" = "true" ]; then
  echo "  ⏭️   live checks skipped (--skip-network)"
else
  HEADERS=$(curl -sI --max-time "$TIMEOUT" "$SITE/" 2>/dev/null | tr -d '\r')
  CODE=$(echo "$HEADERS" | head -1 | grep -oE '[0-9]{3}' | head -1)
  if [ -z "$HEADERS" ] || [ "$CODE" = "403" ] || [ "$CODE" = "000" ]; then
    echo "  ⏭️   live checks skipped — network unavailable or egress-blocked (HTTP ${CODE:-none})"
    NET_UNREACHABLE=true   # → exit 3: Cloud-Mary renders the tier SKIPPED, never PASS
  else
    [ "$CODE" = "200" ] && check "$SITE/ answers 200 over HTTPS" "ok" \
                        || check "$SITE/ answers 200 over HTTPS" "HTTP $CODE"
    # HTTP must bounce to HTTPS (this IS controllable: Pages/Cloudflare enforce it)
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "http://www.aigovops-foundation.com/" 2>/dev/null)
    case "$HTTP_CODE" in
      301|302|307|308) check "http:// redirects to https ($HTTP_CODE)" "ok" ;;
      *)               check "http:// redirects to https" "expected 301/302/307/308, got $HTTP_CODE" ;;
    esac
    # Structurally-impossible-on-Pages headers → warnings only
    warn_if_missing "$HEADERS" "strict-transport-security" "GitHub Pages cannot set it; Cloudflare Transform Rule is a steward move"
    warn_if_missing "$HEADERS" "x-content-type-options"    "GitHub Pages cannot set it; content-type is set correctly by Pages"
    warn_if_missing "$HEADERS" "referrer-policy"           "GitHub Pages cannot set it; no PII rides in our URLs (privacy tier)"
    warn_if_missing "$HEADERS" "content-security-policy"   "GitHub Pages cannot set it; meta-CSP would be the repo-side fix"
  fi
fi

# ── 2. Meta CSP (repo-controllable) — checked only if adopted ──────────────
echo ""
echo "  [Meta CSP — repo-side]"
META_CSP=$(grep -l 'http-equiv="Content-Security-Policy"' "${PAGES[@]}" 2>/dev/null)
if [ -z "$META_CSP" ]; then
  echo "  ⚠️   no meta CSP on any page — optional hardening (the only CSP GitHub Pages allows)"; WARN=$((WARN+1))
else
  # Once adopted, it must not undermine itself
  for f in $META_CSP; do
    if grep 'http-equiv="Content-Security-Policy"' "$f" | grep -q "unsafe-eval"; then
      check "meta CSP without unsafe-eval: $(basename "$f")" "allows unsafe-eval"
    else
      check "meta CSP without unsafe-eval: $(basename "$f")" "ok"
    fi
  done
fi

# ── 3. HTTPS-only links & form actions ─────────────────────────────────────
echo ""
echo "  [No http:// in hrefs / actions / script+iframe src]"
for f in "${PAGES[@]}"; do
  rel="${f#$REPO/}"
  hits=$(grep -oE '(href|action|src)="http://[^"]*"' "$f" \
         | grep -v 'localhost\|127\.0\.0\.1' | head -3)
  if [ -z "$hits" ]; then
    check "https-only: $rel" "ok"
  else
    check "https-only: $rel" "plain-http reference(s): $(echo "$hits" | tr '\n' ' ')"
  fi
done

# ── 4. No secrets in source ────────────────────────────────────────────────
echo ""
echo "  [No secrets in html/js source]"
# Known-safe: Plausible custom-event props, Stripe *publishable* checkout
# links (buy.stripe.com is a public URL by design), i18n strings.
SECRET_RE='sk_live_|sk_test_|AKIA[A-Z0-9]{12}|-----BEGIN [A-Z]* PRIVATE KEY|api_key=|apikey=|password=[^"'"'"']|secret=|access_token=|bearer [A-Za-z0-9_\-]{20}'
for f in "${PAGES[@]}" "${JS_FILES[@]}"; do
  rel="${f#$REPO/}"
  hits=$(grep -inE "$SECRET_RE" "$f" | head -3)
  if [ -z "$hits" ]; then
    check "secret-free: $rel" "ok"
  else
    check "secret-free: $rel" "suspicious pattern(s): $(echo "$hits" | cut -c1-120 | tr '\n' ' ')"
  fi
done

# ── 5. External scripts limited to the allowlist ───────────────────────────
echo ""
echo "  [External <script src> allowlist]"
# The estate's sanctioned third-party script hosts:
ALLOW_HOSTS='plausible\.io|fonts\.googleapis\.com|fonts\.gstatic\.com|js\.stripe\.com|community\.aigovops-foundation\.com|aigovops-foundation\.github\.io'
for f in "${PAGES[@]}"; do
  rel="${f#$REPO/}"
  srcs=$(grep -oE '<script[^>]+src="https?://[^"]+"' "$f" | grep -oE 'src="[^"]+"' | sed 's/^src="//; s/"$//')
  bad=""
  for s in $srcs; do
    echo "$s" | grep -qE "https://($ALLOW_HOSTS)/" || bad="$bad $s"
  done
  if [ -z "$bad" ]; then
    check "script allowlist: $rel" "ok"
  else
    check "script allowlist: $rel" "unsanctioned script host:$bad"
  fi
done

# ── 6. target=_blank carries rel=noopener ──────────────────────────────────
echo ""
echo "  [target=_blank ⇒ rel=noopener]"
while IFS='|' read -r rel result; do
  check "noopener: $rel" "$result"
done < <(python3 - "$REPO" <<'PY'
import re, glob, os, sys
repo = sys.argv[1]
for f in sorted(glob.glob(os.path.join(repo, "*.html")) + glob.glob(os.path.join(repo, "blog", "*.html"))):
    rel = os.path.relpath(f, repo)
    bad = [m.group(0)[:90] for m in
           re.finditer(r'<a\b[^>]*target="_blank"[^>]*>', open(f, encoding="utf-8").read())
           if "noopener" not in m.group(0)]
    if bad:
        print(f"{rel}|{len(bad)} _blank link(s) missing rel=noopener; first: {bad[0]}")
    else:
        print(f"{rel}|ok")
PY
)

# ── 7. No eval / Function() smuggled through inline handlers or JS ─────────
echo ""
echo "  [No eval in inline handlers or JS]"
hits=$(grep -rnE 'on[a-z]+="[^"]*\beval\(|on[a-z]+="[^"]*new Function\(' "${PAGES[@]}" | head -3)
[ -z "$hits" ] && check "inline handlers eval-free" "ok" \
               || check "inline handlers eval-free" "$(echo "$hits" | tr '\n' ' ')"
hits=$(grep -rnE '\beval\(|new Function\(' "${JS_FILES[@]}" | head -3)
[ -z "$hits" ] && check "js/ eval-free" "ok" \
               || check "js/ eval-free" "$(echo "$hits" | tr '\n' ' ')"

echo ""
echo "  ${PASS} passed, ${FAIL} failed, ${WARN} warning(s)"
echo ""
if [ $FAIL -gt 0 ]; then
  echo "  ❌  ${FAIL} security test(s) failed"
  echo ""
  exit 1
fi
if [ "${NET_UNREACHABLE:-false}" = "true" ]; then
  # Local checks passed but live checks never ran — exit 3 = "skipped, not
  # passed"; Cloud-Mary renders the tier SKIPPED (never PASS).
  echo "  ⏭️   local security tests passed — live checks unreachable, tier SKIPPED"
  echo ""
  exit 3
fi
if [ $WARN -gt 0 ]; then
  echo "  ✅  All security tests passed ($WARN warning(s) — see header policy note)"
else
  echo "  ✅  All security tests passed"
fi
echo ""
exit 0
