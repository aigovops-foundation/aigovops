#!/usr/bin/env bash
# Cloud-Mary happy tier — LIVE happy-path journeys against production.
# Walks the visitor's golden paths end-to-end with curl: the porch (homepage),
# Come Join → community platform, the Library, support → Stripe checkout link,
# community ways-to-contribute, a blog post, the NCW AI Camp, and the membership
# wall (auth/verify must bounce anonymous visitors to /signin.html).
# Run: bash scripts/test-happy.sh

PASS=0; FAIL=0
SITE="${SITE_URL:-https://www.aigovops-foundation.com}"
COMMUNITY="${COMMUNITY_URL:-https://community.aigovops-foundation.com}"
LIBRARY_URL="${LIBRARY_URL:-https://aigovops-foundation.github.io/aigovops-library-june-ken-bob/}"
CAMP_URL="${CAMP_URL:-https://www.aigovops-foundation.com/camps/ncw/}"
STRIPE_URL="https://buy.stripe.com/bJe7sKbi214M7qJ1t75J603"
BLOG_POST="$SITE/blog/what-is-aigovops.html"
TIMEOUT=20

check() {
  local label="$1" result="$2"
  if [ "$result" = "ok" ]; then
    echo "  ✅  $label"; PASS=$((PASS+1))
  else
    echo "  ❌  $label — $result"; FAIL=$((FAIL+1))
  fi
}

http_code()    { curl -sL -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$1" 2>/dev/null; }
http_code_nr() { curl -s  -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$1" 2>/dev/null; }  # no redirect-follow
body()         { curl -sL --max-time "$TIMEOUT" "$1" 2>/dev/null; }

echo ""
echo "😊  Happy-Path Journey Tests — live production"
echo ""

# Pre-flight: same sandbox-egress guard as the E2E tier.
PREFLIGHT=$(http_code "$SITE/")
if [ "$PREFLIGHT" = "403" ] || [ "$PREFLIGHT" = "000" ]; then
  echo "  ⏭️   SKIPPED — sandbox egress proxy blocks external requests (HTTP $PREFLIGHT)"
  echo "  ℹ️   Happy-path tests run correctly from an unrestricted network"
  echo ""
  # exit 3 = "skipped, not passed" — Cloud-Mary renders this tier SKIPPED
  exit 3
fi

# ── Journey 1: the porch — homepage loads and makes the promise ────────────
echo "  [Journey 1 — arrive on the porch]"
code=$(http_code "$SITE/")
[ "$code" = "200" ] && check "$SITE/ → 200" "ok" || check "$SITE/ → 200" "HTTP $code"
if body "$SITE/" | grep -qF "Pick what you came to do"; then
  check "Homepage asks \"Pick what you came to do\"" "ok"
else
  check "Homepage asks \"Pick what you came to do\"" "front-door prompt missing from live homepage"
fi

# ── Journey 2: Come Join → the community platform answers ──────────────────
echo ""
echo "  [Journey 2 — Come Join → community platform]"
code=$(http_code_nr "$COMMUNITY/")
if [ "$code" = "200" ] || [ "$code" = "302" ]; then
  check "$COMMUNITY/ answers (200 or 302, got $code)" "ok"
else
  check "$COMMUNITY/ answers (200 or 302)" "HTTP $code — Come Join lands on a dead door"
fi

# ── Journey 3: the Library link works ──────────────────────────────────────
echo ""
echo "  [Journey 3 — read the Library]"
code=$(http_code "$LIBRARY_URL")
[ "$code" = "200" ] && check "Library → 200" "ok" \
                    || check "Library → 200" "HTTP $code — Library link broken ($LIBRARY_URL)"

# ── Journey 4: support → live Stripe checkout ──────────────────────────────
echo ""
echo "  [Journey 4 — support the Foundation → Stripe]"
code=$(http_code "$SITE/support.html")
[ "$code" = "200" ] && check "support.html → 200" "ok" || check "support.html → 200" "HTTP $code"
SUPPORT_BODY=$(body "$SITE/support.html")
if echo "$SUPPORT_BODY" | grep -qF "$STRIPE_URL"; then
  check "support.html carries the live Stripe link" "ok"
else
  check "support.html carries the live Stripe link" "$STRIPE_URL not found on the live page"
fi
code=$(http_code "$STRIPE_URL")
[ "$code" = "200" ] && check "Stripe checkout → 200" "ok" \
                    || check "Stripe checkout → 200" "HTTP $code — payment link unreachable"
if body "$STRIPE_URL" | grep -qiF "no longer active"; then
  check "Stripe link is active" "Stripe reports the payment link is no longer active"
else
  check "Stripe link is active" "ok"
fi

# ── Journey 5: community page — ways to contribute ─────────────────────────
echo ""
echo "  [Journey 5 — find a way to contribute]"
if body "$SITE/write.html" | grep -qF 'id="topics"'; then
  check "write.html lists open topics (#topics)" "ok"
else
  check "write.html lists open topics (#topics)" "anchor missing on live page"
fi

# ── Journey 6: read a blog post ────────────────────────────────────────────
echo ""
echo "  [Journey 6 — read a blog post]"
code=$(http_code "$BLOG_POST")
[ "$code" = "200" ] && check "$BLOG_POST → 200" "ok" || check "$BLOG_POST → 200" "HTTP $code"

# ── Journey 7: the NCW AI Camp ─────────────────────────────────────────────
echo ""
echo "  [Journey 7 — visit the NCW AI Camp]"
code=$(http_code "$CAMP_URL")
[ "$code" = "200" ] && check "Camp → 200" "ok" || check "Camp → 200" "HTTP $code ($CAMP_URL)"

# ── Journey 8: the membership wall holds ───────────────────────────────────
echo ""
echo "  [Journey 8 — membership wall holds for anonymous visitors]"
VERIFY_URL="$COMMUNITY/api/auth/verify"
hdrs=$(curl -s -o /dev/null -D - --max-time "$TIMEOUT" "$VERIFY_URL" 2>/dev/null)
code=$(echo "$hdrs" | head -1 | grep -o '[0-9][0-9][0-9]' | head -1)
loc=$(echo "$hdrs" | grep -i '^location:' | tr -d '\r' | awk '{print $2}')
if [ "$code" = "302" ]; then
  check "auth/verify → 302 (anonymous redirected)" "ok"
else
  check "auth/verify → 302 (anonymous redirected)" "HTTP ${code:-no-response} — wall may be open"
fi
if echo "$loc" | grep -q "/signin\.html"; then
  check "auth/verify redirects toward /signin.html" "ok"
else
  check "auth/verify redirects toward /signin.html" "Location: ${loc:-none}"
fi

echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All happy-path journeys passed" || echo "  ❌  ${FAIL} happy-path check(s) failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
