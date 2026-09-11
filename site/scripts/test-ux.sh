#!/usr/bin/env bash
# Cloud-Mary ux tier (M12a) — UX heuristics across the site. LOCAL.
# Checks:
#   1. main-nav identical (labels + order) to index.html on every page that
#      carries it (admin.html's console nav is a documented exception)
#   2. exactly one h1 per page (status.html console exempt — reported finding)
#   3. porch CTA budget — hero primary CTAs (.action-card / .btn*) ≤ 6/page
#   4. creed footer PRESENT on every page (exactness is the design tier's
#      job — this only asserts presence, no duplicated logic)
#   5. viewport meta everywhere
#   6. skip-link on every nav-bearing page + blog posts; focus-visible styles
#      live in the shared CSS chain
#   7. feedback strip (.aig-feedback) on content pages — CONDITIONAL: skipped
#      with a note until the widget ships (M12b)
# Standalone/self-contained pages (no site chrome by design — matches the
# design tier's console exemption): status.html, jeeves-brief/console/estate,
# f-ai-friday.html (landing page, no site nav — tracked as an M12 finding).
# Run: bash scripts/test-ux.sh

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

echo ""
echo "🧭  UX Heuristic Tests (M12a)"

LINES=$(python3 - "$REPO" <<'PY'
import re, os, sys, glob

repo = sys.argv[1]
os.chdir(repo)
pages = sorted(glob.glob("*.html") + glob.glob("blog/*.html"))

def read(p): return open(p, encoding="utf-8", errors="replace").read()

STUBS      = {p for p in pages if re.search(r'http-equiv="refresh"', read(p), re.I)}
NON_STUBS  = [p for p in pages if p not in STUBS]
# Standalone/self-contained pages: no site chrome by design (see header note).
STANDALONE = {"status.html", "jeeves-brief.html", "jeeves-console.html",
              "jeeves-estate.html", "f-ai-friday.html"}
CONSOLES   = {"admin.html"}  # carries a reduced console nav on purpose

def emit(label, result="ok"): print(f"{label}|{result}")
def section(name): print(f"@section|{name}")

def nav_labels(p):
    m = re.search(r'<nav class="main-nav"[^>]*>(.*?)</nav>', read(p), re.S)
    if not m:
        return None
    return [re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", a)).strip()
            for a in re.findall(r"<a\b[^>]*>(.*?)</a>", m.group(1), re.S)]

# ── 1. nav consistency ────────────────────────────────────────────────────
section("main-nav labels+order match index.html (consoles exempt)")
ref = nav_labels("index.html")
emit("index.html defines the reference nav",
     "ok" if ref else "no <nav class=\"main-nav\"> on index.html")
for p in NON_STUBS:
    if p == "index.html" or p.startswith("blog/"):
        continue  # blog posts carry the slim blog chrome, not the main nav
    labels = nav_labels(p)
    if p in CONSOLES:
        emit(f"nav: {p} (console nav — documented exception)")
    elif p in STANDALONE:
        emit(f"nav: {p} (standalone — no site nav by design)")
    elif labels is None:
        emit(f"nav: {p}", "main-nav missing")
    elif labels == ref:
        emit(f"nav: {p}")
    else:
        emit(f"nav: {p}", f"labels/order differ: {' | '.join(labels)}")

# ── 2. exactly one h1 ─────────────────────────────────────────────────────
section("Exactly one h1 per page")
for p in pages:
    n = len(re.findall(r"<h1\b", read(p)))
    if p == "status.html" and n == 0:
        # Known M12 finding: the status console renders its title outside an
        # h1. Exempt (noindex console) — add an h1 when it is next touched.
        emit(f"one h1: {p} (console, 0 h1 — known finding, exempt)")
    else:
        emit(f"one h1: {p}", "ok" if n == 1 else f"found {n}")

# ── 3. porch CTA budget ───────────────────────────────────────────────────
section("Hero CTA budget — primary CTAs (.action-card/.btn) ≤ 6")
for p in NON_STUBS:
    s = read(p)
    m = re.search(r'<(section|div|header)\b[^>]*class="[^"]*\bhero\b[^"]*"[^>]*>(.*?)</\1>', s, re.S)
    if not m:
        emit(f"cta budget: {p} (no hero region)")
        continue
    ctas = [a for a in re.findall(r'<a\b[^>]*class="([^"]*)"[^>]*>', m.group(2))
            if re.search(r"\b(action-card|btn)", a)]
    n = len(ctas)
    emit(f"cta budget: {p} ({n} primary CTA{'s' if n != 1 else ''})",
         "ok" if n <= 6 else f"{n} primary CTAs in the hero — over the ≤6 budget")

# ── 4. creed footer presence (design tier owns exactness) ─────────────────
section("Creed footer present (presence only — design tier checks the words)")
for p in pages:
    emit(f"creed present: {p}",
         "ok" if "Prove it in ten minutes." in read(p) else "creed footer missing")

# ── 5. viewport meta ──────────────────────────────────────────────────────
section("Viewport meta everywhere")
for p in pages:
    emit(f"viewport: {p}", "ok" if 'name="viewport"' in read(p) else "viewport meta missing")

# ── 6. skip-link + focus-visible ──────────────────────────────────────────
section("Skip-link on chrome-bearing pages; focus-visible in the CSS chain")
for p in NON_STUBS:
    if p in STANDALONE:
        emit(f"skip-link: {p} (standalone — no site chrome, exempt)")
        continue
    if "skip-link" in read(p):
        emit(f"skip-link: {p}")
    else:
        emit(f"skip-link: {p}", "skip-link missing")
for css in ("css/style.css", "css/garden.css"):
    emit(f"focus-visible styles: {css}",
         "ok" if os.path.exists(css) and "focus-visible" in read(css) else "no :focus-visible rules")

# ── 7. feedback strip (conditional until M12b ships) ──────────────────────
section("Feedback strip (.aig-feedback) on content pages")
shipped = any("aig-feedback" in read(p) for p in pages)
if not shipped:
    emit("feedback strip", "@skip")
else:
    content = [p for p in NON_STUBS
               if (p not in STANDALONE and p not in CONSOLES
                   and p not in {"404.html"})]
    for p in content:
        emit(f"feedback strip: {p}",
             "ok" if "aig-feedback" in read(p) else "aig-feedback strip missing")
PY
)

while IFS='|' read -r label result; do
  [ -z "$label" ] && continue
  if [ "$label" = "@section" ]; then
    echo ""
    echo "  [$result]"
  elif [ "$result" = "@skip" ]; then
    echo "  ⏭️   skipped — widget not shipped yet; this check arms itself when .aig-feedback lands (M12b)"
  else
    check "$label" "$result"
  fi
done <<< "$LINES"

echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All UX heuristic tests passed" || echo "  ❌  ${FAIL} UX test(s) failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
