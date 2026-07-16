#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  apply-stripe-links.sh — finish the parked giving rails with Stripe links  ║
# ╚══════════════════════════════════════════════════════════════════════════╝
#
# The support page ships in a PARKED state: every giving CTA points at the GitHub
# org and carries its intended destination in a data-orig attribute, and a
# "giving-interim" notice tells donors checkout is being set up. When Ken (the
# Stripe admin) sends the four Stripe Payment Links, run this ONE command to make
# the page live:
#
#   bash scripts/apply-stripe-links.sh <DONATE> <CONTRIBUTOR> <SUSTAINER> <FOUNDING>
#
# where each argument is a https://buy.stripe.com/... Payment Link. It:
#   1. validates all four URLs are buy.stripe.com AND return 200 AND are not
#      deactivated ("link is no longer active") — BEFORE touching any file;
#   2. maps each parked CTA by its data-orig URL:
#        …contributor… → CONTRIBUTOR   …sustainer… → SUSTAINER
#        …founding…     → FOUNDING      everything else (donate/bare sponsor/OC) → DONATE
#      sets each href to the Stripe link, removes data-orig, and enforces
#      target="_blank" rel="noopener" on the giving CTAs;
#   3. strips the giving-interim block (markers included) and points the JS coffee
#      button at the DONATE link;
#   4. updates the literal-string unit-test assertions to the Stripe end-state;
#   5. runs the full Cloud-Mary gate, then ships its own PR per the deploy workflow.
#
# Idempotent: re-running after it has been applied is a clean no-op. Abort-loud:
# any bad URL or unexpected state stops before a single edit. Offline self-test:
#   bash scripts/apply-stripe-links.sh --selftest
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SUPPORT="$REPO/support.html"
UNIT="$REPO/scripts/test-unit-v3.js"
RUN_GATE=true
SHIP_PR=true

die() { echo "❌ apply-stripe-links: $*" >&2; exit 1; }

# ── the HTML/JS transform (pure; used by the real run AND the self-test) ─────
# argv: <support.html> <DONATE> <CONTRIBUTOR> <SUSTAINER> <FOUNDING>
# exit 0 = applied, 2 = nothing to do (already live), 1 = error
transform() {
python3 - "$@" <<'PY'
import re, sys
path, DONATE, CONTRIBUTOR, SUSTAINER, FOUNDING = sys.argv[1:6]
URLS = {"DONATE": DONATE, "CONTRIBUTOR": CONTRIBUTOR, "SUSTAINER": SUSTAINER, "FOUNDING": FOUNDING}
html = open(path, encoding="utf-8").read()

if "data-orig=" not in html and "giving-interim:start" not in html:
    print("already applied — no data-orig attributes and no interim block; nothing to do.")
    sys.exit(2)

def stripe_for(data_orig: str) -> str:
    d = data_orig.lower()
    if "contributor" in d: return URLS["CONTRIBUTOR"]
    if "sustainer" in d:   return URLS["SUSTAINER"]
    if "founding" in d:    return URLS["FOUNDING"]
    return URLS["DONATE"]

changes = []

def fix_anchor(m: "re.Match") -> str:
    tag = m.group(0)
    orig = re.search(r'\sdata-orig="([^"]*)"', tag)
    if not orig:
        return tag
    dest = stripe_for(orig.group(1))
    changes.append((orig.group(1), dest))
    tag = re.sub(r'\shref="[^"]*"', f' href="{dest}"', tag, count=1)
    tag = re.sub(r'\sdata-orig="[^"]*"', "", tag, count=1)
    if 'target="_blank"' not in tag:
        tag = tag[:-1] + ' target="_blank">'
    if "rel=" not in tag:
        tag = tag[:-1] + ' rel="noopener">'
    return tag

html = re.sub(r"<a\b[^>]*>", fix_anchor, html)

# JS coffee button: point it at DONATE and drop its data-orig + interim comment.
html = re.sub(
    r'[ \t]*//[^\n]*giving-interim[^\n]*\n'
    r'(?:[ \t]*//[^\n]*\n)?'
    r"[ \t]*btn\.href = '[^']*';\n"
    r"[ \t]*btn\.setAttribute\('data-orig',[^\n]*\n",
    f"    btn.href = {DONATE!r};\n", html)
# Fallback: any lingering btn data-orig setAttribute (idempotence safety).
html = re.sub(r"[ \t]*btn\.setAttribute\('data-orig',[^\n]*\n", "", html)

# Strip the giving-interim block, markers included.
html = re.sub(r"\n?[ \t]*<!-- giving-interim:start.*?giving-interim:end -->",
              "", html, flags=re.S)

if "data-orig=" in html:
    print("ERROR: data-orig attributes remain after transform — aborting.", file=sys.stderr)
    sys.exit(1)
if "giving-interim:start" in html:
    print("ERROR: giving-interim block remains after transform — aborting.", file=sys.stderr)
    sys.exit(1)

open(path, "w", encoding="utf-8").write(html)
for src, dest in changes:
    print(f"  {src}  ->  {dest}")
print(f"applied {len(changes)} CTA(s) + JS coffee button; interim block stripped.")
sys.exit(0)
PY
}

# ── update the literal-string unit-test assertions to the Stripe end-state ──
update_unit_tests() {
python3 - "$UNIT" <<'PY'
import sys
path = sys.argv[1]
src = open(path, encoding="utf-8").read()
parked = [
 "checkTrue('Support page has parked-state Stripe notice',  supportHtml.includes('checkout is being set up'));",
 "checkTrue('Support giving CTAs are parked (data-orig)',   supportHtml.includes('data-orig='));",
 "checkFalse('No live GitHub Sponsors / Open Collective link', /href=\"https:\\/\\/(github\\.com\\/sponsors|opencollective\\.com)/.test(supportHtml));",
]
live = "\n".join([
 "checkTrue('Support page giving CTAs are live Stripe links', supportHtml.includes('buy.stripe.com'));",
 "checkFalse('Parked-state notice removed',                  supportHtml.includes('checkout is being set up'));",
 "checkFalse('No parked data-orig attributes remain',        supportHtml.includes('data-orig='));",
 "checkFalse('No live GitHub Sponsors / Open Collective link', /href=\"https:\\/\\/(github\\.com\\/sponsors|opencollective\\.com)/.test(supportHtml));",
])
block = "\n".join(parked)
if block in src:
    open(path, "w", encoding="utf-8").write(src.replace(block, live))
    print("unit-test assertions updated to the Stripe end-state.")
elif "supportHtml.includes('buy.stripe.com')" in src:
    print("unit-test assertions already at the Stripe end-state — no change.")
else:
    print("WARNING: expected parked-state assertions not found; review scripts/test-unit-v3.js.", file=sys.stderr)
PY
}

# ── offline self-test: transform a copy of the real page + prove idempotence ─
selftest() {
  echo "🧪 apply-stripe-links self-test (offline, no network)"
  local tmp; tmp="$(mktemp -d)"
  cp "$SUPPORT" "$tmp/support.html"
  local D="https://buy.stripe.com/test_DONATE" C="https://buy.stripe.com/test_CONTRIB"
  local S="https://buy.stripe.com/test_SUSTAIN" F="https://buy.stripe.com/test_FOUND"
  transform "$tmp/support.html" "$D" "$C" "$S" "$F" >/dev/null || die "transform failed"
  local fail=0
  chk() { if eval "$2"; then echo "  ✅ $1"; else echo "  ❌ $1"; fail=1; fi; }
  chk "all data-orig removed"                 '! grep -q "data-orig=" "$tmp/support.html"'
  chk "interim block stripped"                '! grep -q "giving-interim:start" "$tmp/support.html"'
  chk "contributor CTA -> CONTRIBUTOR link"   'grep -q "href=\"$C\"" "$tmp/support.html"'
  chk "sustainer CTA -> SUSTAINER link"       'grep -q "href=\"$S\"" "$tmp/support.html"'
  chk "founding CTA -> FOUNDING link"         'grep -q "href=\"$F\"" "$tmp/support.html"'
  chk "donate/bare/OC CTAs -> DONATE link"    'grep -q "href=\"$D\"" "$tmp/support.html"'
  chk "no leftover org-parked giving hrefs"   '[ "$(grep -c "href=\"https://github.com/aigovops-foundation\"" "$tmp/support.html")" = "0" ]'
  chk "JS coffee button -> DONATE"            'grep -q "btn.href = .https://buy.stripe.com/test_DONATE" "$tmp/support.html"'
  chk "giving CTAs keep target=_blank"        '[ "$(grep -c "href=\"https://buy.stripe.com/test_" "$tmp/support.html")" -ge 9 ]'
  # Idempotence: a second run must be a clean no-op (exit 2).
  set +e; transform "$tmp/support.html" "$D" "$C" "$S" "$F" >/dev/null 2>&1; local rc=$?; set -e
  chk "second run is a no-op (already applied)" '[ "$rc" = "2" ]'
  rm -rf "$tmp"
  [ "$fail" = "0" ] && { echo "🧪 self-test PASSED"; exit 0; } || die "self-test FAILED"
}

# ── arg parsing ─────────────────────────────────────────────────────────────
ARGS=()
for a in "$@"; do
  case "$a" in
    --selftest) selftest ;;
    --no-gate)  RUN_GATE=false ;;
    --no-pr)    SHIP_PR=false ;;
    -h|--help)  sed -n '2,45p' "$0"; exit 0 ;;
    -*)         die "unknown flag: $a" ;;
    *)          ARGS+=("$a") ;;
  esac
done
[ "${#ARGS[@]}" -eq 4 ] || die "need exactly 4 buy.stripe.com URLs: DONATE CONTRIBUTOR SUSTAINER FOUNDING (got ${#ARGS[@]})"
DONATE="${ARGS[0]}"; CONTRIBUTOR="${ARGS[1]}"; SUSTAINER="${ARGS[2]}"; FOUNDING="${ARGS[3]}"

# ── validate every URL BEFORE touching anything (abort-loud) ─────────────────
echo "🔎 validating Stripe links…"
for pair in "DONATE=$DONATE" "CONTRIBUTOR=$CONTRIBUTOR" "SUSTAINER=$SUSTAINER" "FOUNDING=$FOUNDING"; do
  name="${pair%%=*}"; url="${pair#*=}"
  [[ "$url" =~ ^https://buy\.stripe\.com/ ]] || die "$name is not a buy.stripe.com Payment Link: $url"
  code="$(curl -sSL -o /tmp/_stripe_body.$$ -w '%{http_code}' --max-time 25 "$url")" || die "$name unreachable: $url"
  [ "$code" = "200" ] || { rm -f /tmp/_stripe_body.$$; die "$name returned HTTP $code (expected 200): $url"; }
  if grep -qi "link is no longer active" /tmp/_stripe_body.$$; then
    rm -f /tmp/_stripe_body.$$; die "$name is a DEACTIVATED Stripe link (200 but 'link is no longer active'): $url"
  fi
  rm -f /tmp/_stripe_body.$$
  echo "  ✅ $name → $url"
done

# ── transform (idempotent) ──────────────────────────────────────────────────
echo "✍️  applying Stripe links to support.html…"
set +e
transform "$SUPPORT" "$DONATE" "$CONTRIBUTOR" "$SUSTAINER" "$FOUNDING"
rc=$?
set -e
if [ "$rc" = "2" ]; then
  echo "ℹ️  support.html is already live (no parked state) — nothing to do."
  exit 0
elif [ "$rc" != "0" ]; then
  die "transform failed (rc=$rc) — support.html left unchanged."
fi
update_unit_tests

# ── Cloud-Mary gate ─────────────────────────────────────────────────────────
if [ "$RUN_GATE" = "true" ]; then
  echo "☁️  running Cloud-Mary gate…"
  bash "$REPO/scripts/cloud-mary.sh" || die "Cloud-Mary gate failed — review before shipping."
fi

# ── ship the PR per the deploy workflow ─────────────────────────────────────
if [ "$SHIP_PR" = "true" ]; then
  echo "🚀 shipping PR…"
  cd "$REPO"
  BR="feat/stripe-giving-links-live"
  git checkout -b "$BR" 2>/dev/null || git checkout "$BR"
  git add support.html scripts/test-unit-v3.js
  git commit -m "feat(support): activate Stripe Payment Links on the giving rails

Map each parked CTA to its buy.stripe.com Payment Link (validated 200 +
non-deactivated), remove data-orig, strip the giving-interim block, point the
coffee button at the DONATE link, and move the unit-test assertions to the
Stripe end-state. Generated by scripts/apply-stripe-links.sh."
  git push -u origin "$BR"
  URL="$(gh pr create --title 'feat(support): activate Stripe Payment Links' \
        --body 'Automated by scripts/apply-stripe-links.sh: parked giving rails now point at validated buy.stripe.com Payment Links; interim notice removed.' \
        --base main --head "$BR")"
  gh pr merge "$URL" --squash --delete-branch=false
  git checkout main && git fetch origin main && git merge --ff-only origin/main
  echo "✅ shipped: $URL"
fi

echo "✅ Stripe links live. Verify: curl -s https://www.aigovops-foundation.com/support.html | grep -c buy.stripe.com"
