#!/usr/bin/env bash
# Cloud-Mary design tier — garden-warm (M6b) design-system conformance. LOCAL, no network.
# Checks every top-level page + blog post against the aigovops-july-2026 system:
#   1. links css/garden.css (blog pages via ../css/garden.css)
#   2. footer carries the exact creed line
#   3. token drift: every --garden-* value in design/aigovops-july-2026/tokens.css
#      appears identically in css/garden.css (tokens.css is SOURCE OF TRUTH)
#   4. retired navy skin is gone from page <style> blocks (#0d1a2e, #0a2318,
#      the old "linear-gradient(135deg, var(--dark)" hero signature)
#   5. index.html loads garden.css before porch.css
# Recipe: mockups/m6-porch/CONVERSION-GUIDE.md · Run: bash scripts/test-design.sh

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

CREED="Ship safe AI — never unsafe AI: get to yes, stay at yes, recover to yes, and keep the garden of humanity growing."
TOKENS="$REPO/design/aigovops-july-2026/tokens.css"
GARDEN="$REPO/css/garden.css"

# Page inventory: every top-level *.html + every blog/*.html.
# (mockups/ and .backups/ are excluded by construction — globs never enter them.)
TOP_PAGES=()
for f in "$REPO"/*.html; do TOP_PAGES+=("$(basename "$f")"); done
BLOG_PAGES=()
for f in "$REPO"/blog/*.html; do BLOG_PAGES+=("blog/$(basename "$f")"); done

# _style_blocks FILE → prints only the page's <style>…</style> content.
# SVG islands are stripped FIRST: inline <svg> markup may carry legacy fills
# (e.g. the admin estate map keeps navy node rects under the console
# exception) and may embed its own <style> for animations — neither is page
# skin, so neither is scanned.
_style_blocks() {
  python3 - "$1" <<'PY'
import re, sys
s = open(sys.argv[1], encoding="utf-8", errors="replace").read()
s = re.sub(r"<svg\b.*?</svg>", "", s, flags=re.S | re.I)
for m in re.findall(r"<style\b[^>]*>(.*?)</style>", s, flags=re.S | re.I):
    print(m)
PY
}

echo ""
echo "🎨  Design-System Tests (garden-warm / aigovops-july-2026)"
echo ""
echo "  Pages: ${#TOP_PAGES[@]} top-level + ${#BLOG_PAGES[@]} blog"

# ── 1. Every page links the shared garden.css ──────────────────────────────
echo ""
echo "  [garden.css linked on every page]"
# Self-contained pages that load neither style.css nor the garden overlay:
# their compliance is garden-token re-pointing in their own CSS (verified by
# the navy check + creed check, which still apply). Documented exemption per
# DESIGN-SYSTEM.md's console rule — do NOT add pages here casually.
STANDALONE_SELF_CONTAINED='status.html jeeves-brief.html jeeves-console.html jeeves-demo.html jeeves-estate.html jeeves-front.html'
for page in "${TOP_PAGES[@]}"; do
  case " $STANDALONE_SELF_CONTAINED " in *" $page "*)
    check "garden.css: $page (standalone — token re-point, exempt from link)" "ok"
    continue;;
  esac
  if grep -q 'href="css/garden\.css"' "$REPO/$page"; then
    check "garden.css: $page" "ok"
  else
    check "garden.css: $page" "no <link> to css/garden.css"
  fi
done
for page in "${BLOG_PAGES[@]}"; do
  if grep -q 'href="\.\./css/garden\.css"' "$REPO/$page"; then
    check "garden.css: $page" "ok"
  else
    check "garden.css: $page" "no <link> to ../css/garden.css"
  fi
done

# ── 2. Every page's footer carries the creed ───────────────────────────────
echo ""
echo "  [Footer creed on every page]"
for page in "${TOP_PAGES[@]}" "${BLOG_PAGES[@]}"; do
  if grep -qF "$CREED" "$REPO/$page"; then
    check "creed: $page" "ok"
  else
    check "creed: $page" "creed line missing"
  fi
done

# ── 3. Token drift: tokens.css (canonical) vs css/garden.css ───────────────
echo ""
echo "  [Token drift — design/aigovops-july-2026/tokens.css → css/garden.css]"
if [ ! -f "$TOKENS" ]; then
  check "tokens.css present" "missing: design/aigovops-july-2026/tokens.css"
elif [ ! -f "$GARDEN" ]; then
  check "css/garden.css present" "missing: css/garden.css"
else
  # _decl_value FILE NAME → the declared value, comments stripped, spaces collapsed
  _decl_value() {
    sed -n "s/^[[:space:]]*$2:[[:space:]]*\([^;]*\);.*/\1/p" "$1" \
      | head -1 | tr -s ' \t' ' ' | sed 's/^ *//; s/ *$//'
  }
  TOKEN_NAMES=$(grep -o '^[[:space:]]*--garden-[a-z0-9-]*:' "$TOKENS" | tr -d ' \t:' | sort -u)
  for name in $TOKEN_NAMES; do
    canon=$(_decl_value "$TOKENS" "$name")
    local_v=$(_decl_value "$GARDEN" "$name")
    if [ -z "$local_v" ]; then
      check "token $name" "missing from css/garden.css"
    elif [ "$canon" = "$local_v" ]; then
      check "token $name" "ok"
    else
      check "token $name" "drift: canonical [$canon] vs garden.css [$local_v]"
    fi
  done
fi

# ── 4. Retired navy skin gone from page <style> blocks ─────────────────────
echo ""
echo "  [Retired navy skin absent from <style> blocks]"
RETIRED_GROUNDS='#0d1a2e #0a2318'
RETIRED_GRADIENT='linear-gradient(135deg, var(--dark)'
for page in "${TOP_PAGES[@]}" "${BLOG_PAGES[@]}"; do
  styles=$(_style_blocks "$REPO/$page")
  found=""
  for sig in $RETIRED_GROUNDS; do
    echo "$styles" | grep -qiF "$sig" && found="$found $sig"
  done
  echo "$styles" | grep -qF "$RETIRED_GRADIENT" && found="$found old-navy-hero-gradient"
  if [ -z "$found" ]; then
    check "no navy skin: $page" "ok"
  else
    check "no navy skin: $page" "retired value(s) still in <style>:$found"
  fi
done

# ── 5. index.html loads garden.css before porch.css ────────────────────────
echo ""
echo "  [index.html stylesheet order]"
G_LINE=$(grep -n 'href="css/garden\.css"' "$REPO/index.html" | head -1 | cut -d: -f1)
P_LINE=$(grep -n 'href="css/porch\.css"' "$REPO/index.html" | head -1 | cut -d: -f1)
if [ -z "$G_LINE" ]; then
  check "index.html: garden.css before porch.css" "garden.css not linked"
elif [ -z "$P_LINE" ]; then
  check "index.html: garden.css before porch.css" "porch.css not linked"
elif [ "$G_LINE" -lt "$P_LINE" ]; then
  check "index.html: garden.css before porch.css (lines $G_LINE < $P_LINE)" "ok"
else
  check "index.html: garden.css before porch.css" "porch.css (line $P_LINE) loads first (garden at $G_LINE)"
fi

echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All design-system tests passed" || echo "  ❌  ${FAIL} design test(s) failed (expected while M6b page conversions land)"
echo ""
exit $((FAIL > 0 ? 1 : 0))
