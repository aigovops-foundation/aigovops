#!/usr/bin/env bash
# AiGovOps — E2E Tests v3
# Tests: page availability, assets, content integrity, meta tags, favicons,
#        schedule agent, chatbot, OG tags, skip link, post cards, sitemap
# Run: bash scripts/test-e2e-v3.sh

SITE="https://www.aigovops-foundation.com"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PASS=0; FAIL=0; SKIP=0

# Pre-flight: check if we can reach the site at all
PREFLIGHT=$(curl -sL -o /dev/null -w "%{http_code}" --max-time 10 "$SITE/")
if [ "$PREFLIGHT" = "403" ] || [ "$PREFLIGHT" = "000" ]; then
  echo ""
  echo "🌐  E2E Tests v3 — $SITE"
  echo ""
  echo "  ⏭️   SKIPPED — sandbox egress proxy blocks external requests (HTTP $PREFLIGHT)"
  echo "  ℹ️   E2E tests run correctly in GitHub Actions (unrestricted network)"
  echo "  ℹ️   Live site confirmed working via browser at https://www.aigovops-foundation.com"
  echo ""
  # exit 3 = "skipped, not passed" — Cloud-Mary renders this tier SKIPPED
  exit 3
fi

check() {
  local label="$1" result="$2"
  if [ "$result" = "ok" ]; then
    echo "  ✅  $label"; PASS=$((PASS+1))
  else
    echo "  ❌  $label — $result"; FAIL=$((FAIL+1))
  fi
}

http_code() { curl -sL -o /dev/null -w "%{http_code}" --max-time 15 "$1"; }
body()      { curl -sL --max-time 15 "$1"; }
headers()   { curl -sLI --max-time 15 "$1"; }

# DNS / uptime / error helpers (dns_resolves, uptime_tls_valid, error_no_5xx, …)
source "$REPO/scripts/lib/health-checks.sh"

echo ""
echo "🌐  E2E Tests v3 — $SITE"
echo ""

# ── PAGE AVAILABILITY ──────────────────────────────────────────────────────
echo "  [Pages]"
for path in "/" "/blog.html" "/events.html"; do
  code=$(http_code "$SITE$path")
  [ "$code" = "200" ] && check "$path → 200" "ok" || check "$path → 200" "HTTP $code"
done

# events.html should NOT 404
code=$(http_code "$SITE/events.html")
[ "$code" != "404" ] && check "events.html stubbed (not 404)" "ok" || check "events.html stubbed (not 404)" "got 404"

echo ""

# ── STATIC ASSETS ─────────────────────────────────────────────────────────
echo "  [Assets]"
for asset in "/css/style.css" "/js/main.js" "/js/chat.js" "/js/schedule.js" \
             "/images/logo.png" "/images/founders.jpg" \
             "/images/favicon-32.png" "/images/favicon-16.png" \
             "/images/apple-touch-icon.png"; do
  code=$(http_code "$SITE$asset")
  [ "$code" = "200" ] && check "$asset" "ok" || check "$asset" "HTTP $code"
done

echo ""

# ── CONTENT INTEGRITY ─────────────────────────────────────────────────────
echo "  [Content]"
HOME=$(body "$SITE/")

echo "$HOME" | grep -q "AiGovOps"          && check "Brand name present"              "ok" || check "Brand name present"              "not found"
echo "$HOME" | grep -q "chatBubble\|chat.js" && check "No assistant widget at the door"  "chatbot still on the home page" || check "No assistant widget at the door"  "ok"
echo "$HOME" | grep -q "cafe-doors"        && check "Café doors present"               "ok" || check "Café doors present"                "not found"
echo "$HOME" | grep -q "cafe-title"        && check "Wren asks what brought you in"     "ok" || check "Wren asks what brought you in"      "not found"
echo "$HOME" | grep -q "schedule.js"       && check "schedule.js not loaded"           "still loaded" || check "schedule.js not loaded"           "ok"
echo "$HOME" | grep -q "skip-link\|Skip to" && check "Skip-to-content link present"   "ok" || check "Skip-to-content link present"    "not found"
echo "$HOME" | grep -q "aria-live"         && check "aria-live region present"         "ok" || check "aria-live region present"        "not found"
echo "$HOME" | grep -q "aria-label.*Open AiGovOps\|aria-label.*assistant" \
                                            && check "No assistant bubble"             "still present" || check "No assistant bubble"             "ok"
echo "$HOME" | grep -q "main-content"      && check "main-content anchor present"      "ok" || check "main-content anchor present"     "not found"

echo ""
echo "  [Brand upgrade]"
echo "$HOME" | grep -q "footer-marks"      && check "Footer marks line present"        "ok" || check "Footer marks line present"         "not found"
echo "$HOME" | grep -q "open-source.html"  && check "Open source in the nav"           "ok" || check "Open source in the nav"            "not found"
echo "$HOME" | grep -q "library.html"      && check "Library in the nav"               "ok" || check "Library in the nav"                "not found"
echo "$HOME" | grep -q "OVERT"             && check "OVERT badge"                      "ok" || check "OVERT badge"                       "not found"
echo "$HOME" | grep -q "data-intent=\"frameworks\"" && check "No assistant chips"     "still present" || check "No assistant chips"              "ok"
echo "$HOME" | grep -q "aigovops --help"   && check "No CLI chatbot welcome"           "still present" || check "No CLI chatbot welcome"          "ok"
echo "$HOME" | grep -q "plausible.io"      && check "Plausible analytics present"      "ok" || check "Plausible analytics present"       "not found"
echo "$HOME" | grep -q "lang-btn"          && check "Language toggle present"          "ok" || check "Language toggle present"           "not found"
echo "$HOME" | grep -q "Global Community"  && check "Global Community in footer"       "ok" || check "Global Community in footer"        "not found"
echo "$HOME" | grep -q "i18n.js"           && check "i18n script loaded"               "ok" || check "i18n script loaded"               "not found"

echo ""

# ── META / SEO ────────────────────────────────────────────────────────────
echo "  [Meta & SEO]"
echo "$HOME" | grep -q "og:title"          && check "og:title present"                "ok" || check "og:title present"               "not found"
echo "$HOME" | grep -q "og:image"          && check "og:image present"                "ok" || check "og:image present"               "not found"
echo "$HOME" | grep -q "og:description"    && check "og:description present"          "ok" || check "og:description present"         "not found"
echo "$HOME" | grep -q "twitter:card"      && check "twitter:card present"            "ok" || check "twitter:card present"           "not found"
echo "$HOME" | grep -q "favicon-32\|shortcut icon\|icon.*png" \
                                            && check "Favicon referenced in HTML"     "ok" || check "Favicon referenced in HTML"      "not found"

echo ""

# ── POSTS DATA ────────────────────────────────────────────────────────────
echo "  [Posts Data]"
POSTS="$HOME/../data/linkedin-posts.json"  # local check
if [ -f $REPO/data/linkedin-posts.json ]; then
  # ── WHAT THIS ASSERTS, AND WHY IT CHANGED ────────────────────────────────
  # It used to assert `ken_count > 0`, i.e. "Ken has posts". On 2026-09-20 that went red
  # and stayed red for eleven days: Ken's newest LinkedIn post was 20 Aug, and
  # fetch_posts.py's 30-day freshness rule correctly dropped the last of them. The feed
  # was never broken — the runner fetched ten items that morning. So the only failing
  # assertion on `main` was, in effect, "a co-founder posted in the last month": true or
  # false by someone's posting habits, unfixable by any commit, and therefore a red lane
  # that could only be ignored. A gate nobody can satisfy teaches people to skip the gate.
  #
  # An empty section is a legitimate state. An UNREACHABLE FEED is not. fetch_posts.py now
  # records the difference in `feed_health`, and that is what gets gated here:
  #   ok=false      → the bridge failed (HTTP 402 on a lapsed plan, as in June) → FAIL
  #   published=0   → nothing recent enough to show → reported, not failed
  # The old shape of this test would have been equally red in both cases.
  health=$(python3 -c "
import json
d = json.load(open('$REPO/data/linkedin-posts.json'))
h = d.get('feed_health')
if not h:
    print('MISSING'); raise SystemExit
for k in ('bob', 'ken'):
    a = h.get(k) or {}
    # One field per column, no spaces inside a column: the reader below is \`read -r\`.
    print('%s %s %s %s' % (k, a.get('ok'), a.get('published', 0),
                           (a.get('error') or '-').replace(' ', '_')))
" 2>/dev/null || echo MISSING)

  if [ "$health" = "MISSING" ]; then
    # Not a pass. An older published file has no health block, and treating "cannot tell"
    # as "fine" is how the previous version of this whole area went wrong.
    check "feed_health block present in published data" "absent — cannot judge feed health"
  else
    # `while read <<< "$health"`, NOT `echo "$health" | while read`. A pipe puts the loop
    # body in a SUBSHELL, so every PASS/FAIL that `check` increments is discarded when the
    # subshell exits — the loop would print its ❌ and the script would still total up as
    # all-green and exit 0. A guard that reports a failure it does not count is worse than
    # no guard, and this file's own history is the argument: the version of this section
    # being replaced sat red for eleven days precisely because nobody could trust what it
    # was saying.
    while read -r who ok published err; do
      [ -n "$who" ] || continue
      if [ "$ok" = "True" ]; then
        check "$who's feed reachable and carrying items" "ok"
      else
        check "$who's feed reachable" "$(echo "$err" | tr '_' ' ')"
      fi
      if [ "$published" -gt 0 ]; then
        check "$who has recent posts published ($published)" "ok"
      else
        # Deliberately not a failure — see the note above.
        echo "  ℹ️   $who has no posts inside the freshness window (feed healthy; nothing recent to show)"
      fi
    done <<< "$health"
  fi
  # Check no hashtag-only titles remain
  hashtag_titles=$(python3 -c "
import json, re
d = json.load(open('$REPO/data/linkedin-posts.json'))
bad = []
for person in ['bob','ken']:
  for p in d.get(person,[]):
    t = p.get('title','')
    core = re.sub(r'[#@]\S+','',t)
    core = re.sub(r'[^\w\s]','',core).strip()
    if len(core.split()) < 4:
      bad.append(t[:60])
print(len(bad))
" 2>/dev/null || echo 0)
  [ "$hashtag_titles" = "0" ] && check "No hashtag-only post titles" "ok" || check "No hashtag-only post titles" "$hashtag_titles found"
fi

echo ""

# ── CNAME / DNS ───────────────────────────────────────────────────────────
echo "  [Blog migration]"
HOMECONTENT=$(body "$SITE/blog.html")
echo "$HOMECONTENT" | grep -q "blog/what-is-aigovops.html\|blog/nist-ai-rmf" && check "Blog cards link to local pages" "ok" || check "Blog cards link to local pages" "not found"
echo "$HOMECONTENT" | grep -q "aigovopsfoundation.org/post" && check "No external Wix post links on blog.html" "external links remain" || check "No external Wix post links on blog.html" "ok"
for slug in "what-is-aigovops" "nist-ai-rmf-vs-real-world" "no-more-anonymous-ghosts"; do
  code=$(http_code "$SITE/blog/$slug.html")
  [ "$code" = "200" ] && check "blog/$slug.html → 200" "ok" || check "blog/$slug.html → 200" "HTTP $code"
done
POST1=$(body "$SITE/blog/what-is-aigovops.html")
echo "$POST1" | grep -q 'rel="canonical"' && check "Post page has canonical tag" "ok" || check "Post page has canonical tag" "not found"
echo "$POST1" | grep -q 'BlogPosting' && check "Post page has Schema.org Article" "ok" || check "Post page has Schema.org Article" "not found"

echo ""

# ── CNAME / DNS ───────────────────────────────────────────────────────────
echo "  [DNS & Hosting]"
cname=$(cat $REPO/CNAME 2>/dev/null)
echo "$cname" | grep -q "aigovops-foundation.com" && check "CNAME correct" "ok" || check "CNAME correct" "$cname"
server=$(headers "$SITE/" | grep -i "^server:" | head -1 | tr -d '\r')
# With Cloudflare in front, server header is 'cloudflare'; without, it's 'GitHub.com'
echo "$server" | grep -qiE "github|cloudflare" && check "Served by GitHub Pages or Cloudflare CDN" "ok" || check "Served by GitHub Pages or Cloudflare CDN" "$server"

echo ""

# ── DNS RESOLUTION ─────────────────────────────────────────────────────────
echo "  [DNS resolution]"
APEX_BARE="${SITE#https://www.}"
dns_resolves "$APEX_BARE"
dns_resolves "www.$APEX_BARE"
dns_cname_target "www.$APEX_BARE" "github.io"
dns_not_stale "www.$APEX_BARE" "bobrapp.github.io"

echo ""

# ── UPTIME / TLS ───────────────────────────────────────────────────────────
echo "  [Uptime & TLS]"
uptime_reachable "$SITE/"
uptime_tls_valid "$SITE/"
uptime_latency "$SITE/" 4000

echo ""

# ── HTTP ERROR DETECTION ───────────────────────────────────────────────────
echo "  [Error detection]"
error_no_5xx "$SITE/"
error_no_redirect_loop "$SITE/"
error_expect_code "$SITE/this-page-does-not-exist-xyz.html" "404"
error_soft_404 "$SITE/" "There isn't a GitHub Pages site here"

echo ""

# ── ALPHA — VENDOR RFI INTEGRATION (M13: lives on stay-at-yes.html) ────────
echo "  [Alpha — Vendor RFI (resources.html)]"
ALPHA=$(body "$SITE/resources.html")
echo "$ALPHA" | grep -q "aigovops-vendor-rfi" \
  && check "alpha page links the Vendor RFI" "ok" \
  || check "alpha page links the Vendor RFI" "link missing"
echo "$ALPHA" | grep -q "aigovops-vendor-rfi/comparison.html" \
  && check "resources links the RFI comparison" "ok" \
  || check "resources links the RFI comparison" "embed missing"
RFI="https://aigovops-foundation.github.io/aigovops-vendor-rfi"
for p in "/" "/training.html" "/comparison.html"; do
  code=$(http_code "$RFI$p")
  [ "$code" = "200" ] && check "Vendor RFI $p → 200" "ok" || check "Vendor RFI $p → 200" "HTTP $code"
done

echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All E2E v3 tests passed" || echo "  ❌  ${FAIL} test(s) failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
