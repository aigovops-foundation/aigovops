#!/usr/bin/env bash
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# DEPRECATED — superseded by test-e2e-v3.sh / test-scale-v3.sh
# Kept for reference only. Not called by cloud-mary.sh or automation-v3.yml.

# AiGovOps — E2E Tests: live site validation
# Run: bash scripts/test-e2e.sh

SITE="https://www.aigovops-foundation.com"
PASS=0; FAIL=0

check() {
  local label="$1" result="$2"
  if [ "$result" = "ok" ]; then
    echo "  ✅  $label"; PASS=$((PASS+1))
  else
    echo "  ❌  $label — $result"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "🌐  E2E Tests — $SITE"
echo ""

# 1-3: Page availability
for path in "/" "/blog.html" "/events.html"; do
  code=$(curl -sL -o /dev/null -w "%{http_code}" "$SITE$path")
  label="$path returns 200"
  [ "$code" = "200" ] && check "$label" "ok" || check "$label" "HTTP $code"
done

# 4-7: Static assets
for asset in "/css/style.css" "/js/main.js" "/js/chat.js" "/images/logo.png" "/images/founders.jpg"; do
  code=$(curl -sL -o /dev/null -w "%{http_code}" "$SITE$asset")
  [ "$code" = "200" ] && check "$asset loads" "ok" || check "$asset loads" "HTTP $code"
done

# 8: Brand content present
body=$(curl -sL "$SITE/")
echo "$body" | grep -q "AiGovOps" \
  && check "Brand name in homepage HTML" "ok" \
  || check "Brand name in homepage HTML" "not found"

# 9: Chatbot widget present
echo "$body" | grep -q "chat-bubble\|chatBubble\|chat.js" \
  && check "Chatbot element referenced" "ok" \
  || check "Chatbot element referenced" "not found"

# 10: Action grid present
echo "$body" | grep -q "action-grid\|action-card" \
  && check "One-click action grid present" "ok" \
  || check "One-click action grid present" "not found"

# 11: CNAME correct (check local file)
cname_content=$(cat $REPO/CNAME 2>/dev/null)
echo "$cname_content" | grep -q "aigovops-foundation.com" \
  && check "CNAME file correct" "ok" \
  || check "CNAME file correct" "content: $cname_content"

# 12: Modern host — GitHub Pages, or Cloudflare fronting it (not the old Hostinger).
# The site now sits behind Cloudflare, which proxies GitHub Pages and masks the origin
# `server:` header, so we accept either signal and rely on the CNAME + DNS checks above.
server=$(curl -sLI "$SITE/" | grep -i "^server:" | head -1 | tr -d '\r')
echo "$server" | grep -qiE "github|cloudflare" \
  && check "Served by GitHub Pages / Cloudflare (not Hostinger)" "ok" \
  || check "Served by GitHub Pages / Cloudflare (not Hostinger)" "$server"

# 13: www redirect works
www_code=$(curl -sL -o /dev/null -w "%{http_code}" "https://www.aigovops-foundation.com/")
[ "$www_code" = "200" ] \
  && check "www.aigovops-foundation.com resolves" "ok" \
  || check "www.aigovops-foundation.com resolves" "HTTP $www_code (DNS may still propagate)"

echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All E2E tests passed" || echo "  ❌  ${FAIL} test(s) failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
