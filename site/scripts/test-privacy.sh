#!/usr/bin/env bash
# Cloud-Mary privacy tier (M12a) — the site keeps its privacy promises. LOCAL.
# Checks:
#   1. analytics is Plausible ONLY — no gtag/ga.js/GTM/fbq/hotjar/segment/
#      mixpanel/clarity anywhere
#   2. no PII in static link URLs — no email addresses in query strings
#      (mailto: is fine and expected for pledge CTAs)
#   3. iframes only from the estate's own origins
#   4. no cookies set by page JS (document.cookie absent — the Plausible
#      "no cookie banner" claim in index.html must stay true)
#   5. honesty checks: newsletter fine-print present; support page collects
#      no payment/personal data locally (money flows via Stripe / GitHub
#      Sponsors / Open Collective / mailto pledge — never a local form)
# Known handoff (documented, out of scope for the static-link check):
#   index.html's newsletter submit builds substack.com/subscribe?email=… in
#   JS — a user-initiated handoff to the subscription processor, not a link
#   we publish. Tracked as an M12 finding, not a failure.
# Run: bash scripts/test-privacy.sh

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PASS=0; FAIL=0

check() {
  local label="$1" result="$2"
  if [ "$result" = "ok" ]; then
    echo "  ✅  $label"; PASS=$((PASS+1))
  else
    echo "  ❌  $label — $result"; FAIL=$((FAIL+1))
  fi
}

PAGES=()
for f in "$REPO"/*.html; do PAGES+=("$f"); done
for f in "$REPO"/blog/*.html; do PAGES+=("$f"); done
JS_FILES=()
for f in "$REPO"/js/*.js "$REPO"/js/i18n/*.js; do [ -f "$f" ] && JS_FILES+=("$f"); done

echo ""
echo "🛡️   Privacy Tests (M12a)"
echo ""
echo "  Pages: ${#PAGES[@]} html · ${#JS_FILES[@]} js"

# ── 1. Plausible-only analytics ────────────────────────────────────────────
echo ""
echo "  [Analytics — Plausible only, no other trackers]"
TRACKER_RE='googletagmanager|google-analytics\.com|gtag\(|ga\.js|analytics\.js|fbq\(|facebook\.net/.*fbevents|hotjar|segment\.(com|io)|mixpanel|clarity\.ms|matomo|amplitude'
for f in "${PAGES[@]}" "${JS_FILES[@]}"; do
  rel="${f#$REPO/}"
  hits=$(grep -inE "$TRACKER_RE" "$f" | head -2)
  if [ -z "$hits" ]; then
    check "tracker-free: $rel" "ok"
  else
    check "tracker-free: $rel" "non-Plausible tracker: $(echo "$hits" | cut -c1-100 | tr '\n' ' ')"
  fi
done
# And the analytics that IS present must be Plausible
N_PLAUSIBLE=$(grep -l 'plausible\.io' "${PAGES[@]}" | wc -l | tr -d ' ')
[ "$N_PLAUSIBLE" -ge 10 ] \
  && check "Plausible present on content pages ($N_PLAUSIBLE pages)" "ok" \
  || check "Plausible present on content pages" "only $N_PLAUSIBLE page(s) load plausible.io"

# ── 2. No PII (email addresses) in static link query strings ───────────────
echo ""
echo "  [No email addresses in link query strings (mailto: exempt)]"
while IFS='|' read -r rel result; do
  check "no-PII URLs: $rel" "$result"
done < <(python3 - "$REPO" <<'PY'
import re, glob, os, sys
repo = sys.argv[1]
email_re = re.compile(r'[?&][^"]*=[^"&]*[A-Za-z0-9._%+-]+%40|[?&][^"]*=[^"&]*[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}')
for f in sorted(glob.glob(os.path.join(repo, "*.html")) + glob.glob(os.path.join(repo, "blog", "*.html"))):
    rel = os.path.relpath(f, repo)
    bad = []
    for m in re.finditer(r'href="([^"]+)"', open(f, encoding="utf-8").read()):
        h = m.group(1)
        if h.startswith("mailto:"):
            continue
        if "?" in h and email_re.search(h):
            bad.append(h[:80])
    print(f"{rel}|{'ok' if not bad else 'email in query string: ' + bad[0]}")
PY
)

# ── 3. iframes only from estate origins ────────────────────────────────────
echo ""
echo "  [Third-party iframes — estate origins only]"
ESTATE_IFRAME_RE='https://(aigovops-foundation\.github\.io|([a-z0-9-]+\.)?aigovops-foundation\.com)/'
for f in "${PAGES[@]}"; do
  rel="${f#$REPO/}"
  srcs=$(grep -oE '<iframe[^>]+src="[^"]+"' "$f" | grep -oE 'src="[^"]+"' | sed 's/^src="//; s/"$//')
  bad=""
  for s in $srcs; do
    echo "$s" | grep -qE "^$ESTATE_IFRAME_RE" || bad="$bad $s"
  done
  if [ -z "$bad" ]; then
    check "iframe origins: $rel" "ok"
  else
    check "iframe origins: $rel" "non-estate iframe:$bad"
  fi
done

# ── 4. No cookies set by page JS ───────────────────────────────────────────
echo ""
echo "  [No document.cookie anywhere]"
hits=$(grep -rn 'document\.cookie' "${PAGES[@]}" "${JS_FILES[@]}" | head -3)
[ -z "$hits" ] && check "no page JS sets cookies" "ok" \
               || check "no page JS sets cookies" "$(echo "$hits" | cut -c1-120 | tr '\n' ' ')"
# The claim the cookie check protects:
grep -q 'no cookie banner' "$REPO/index.html" \
  && check "index.html still states the cookie-free Plausible claim" "ok" \
  || check "index.html still states the cookie-free Plausible claim" "claim comment removed — re-verify copy honesty"

# ── 5. Honesty — copy promises match behavior ──────────────────────────────
echo ""
echo "  [Copy honesty — collect only what is stated]"
grep -q 'No spam' "$REPO/index.html" \
  && check "newsletter fine-print present (index.html)" "ok" \
  || check "newsletter fine-print present (index.html)" "'No spam' fine-print missing"
# support.html must not collect payment/personal data in a local form:
# giving flows out via Stripe / Sponsors / Open Collective / mailto only.
hits=$(grep -icE '<input[^>]+(type="(text|email|tel|number)"|name="(card|cc|email|name|phone)")' "$REPO/support.html")
[ "$hits" = "0" ] \
  && check "support.html collects no data locally (no input fields)" "ok" \
  || check "support.html collects no data locally (no input fields)" "$hits input field(s) found — update the privacy line"
grep -q 'buy\.stripe\.com' "$REPO/support.html" \
  && check "support giving flows via Stripe checkout (off-site)" "ok" \
  || check "support giving flows via Stripe checkout (off-site)" "Stripe checkout link missing"
# Feedback strip (M12b): once it ships, its privacy line must exist with it.
if grep -q 'aig-feedback' "$REPO/index.html" 2>/dev/null; then
  # The strip is a self-contained injector (feedback.js) — the privacy line ships
  # INSIDE the widget file (one source of truth, rendered on every page), so the
  # check follows the architecture: marker pages must load feedback.js, and
  # feedback.js must carry the honest line.
  if grep -q 'feedback\.js' "$REPO/index.html" \
     && grep -qiE 'no account|only what you type|anonymous' "$REPO/feedback.js" 2>/dev/null \
     && grep -qiE 'no cookies' "$REPO/feedback.js" 2>/dev/null; then
    check "feedback strip ships with an honest privacy line (in feedback.js)" "ok"
  else
    check "feedback strip ships with an honest privacy line (in feedback.js)" "loader or privacy line missing"
  fi
else
  echo "  ⏭️   feedback-strip privacy line — skipped (widget not shipped yet, lands with M12b)"
fi

echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All privacy tests passed" || echo "  ❌  ${FAIL} privacy test(s) failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
