#!/usr/bin/env bash
# Cloud-Mary arch tier (M12a) — structural integrity of the site. LOCAL.
# Checks:
#   1. every internal href (files + #anchors) in top-level + blog pages
#      resolves — root-absolute paths resolve from the repo root; JS template
#      literals and <script> bodies are excluded; M11 redirect stubs count
#      as real targets
#   2. every page has exactly one canonical; every indexable (non-noindex)
#      page has exactly one og:title
#   3. sitemap.xml entries all resolve to real files and include no
#      retired/noindex/meta-refresh stubs
#   4. CSS load order style.css → garden.css on every page that loads both
#      (standalone consoles load neither — exempt by construction)
#   5. no orphan pages: every indexable page reachable within 2 hops from
#      index.html + sitemap; stubs and noindex consoles (404/admin/status)
#      are exempt
#   6. redirect stubs (any page with meta-refresh) carry noindex +
#      meta-refresh + canonical
#   7. no shipped page or served JS links the retired Library github.io
#      mirror — the Library is served gated at community…/library/
# Run: bash scripts/test-arch.sh

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
echo "🏛️   Architecture Tests (M12a)"

# The heavy lifting is one python pass; it emits "label|result" lines the
# house check() renders, so counts and style match every other tier.
# (command substitution + here-string, the pattern test-design.sh proves out
#  on macOS bash 3.2 — process substitution mis-parses this heredoc there)
LINES=$(python3 - "$REPO" <<'PY'
import re, os, sys, glob

repo = sys.argv[1]
os.chdir(repo)
TPL = "$" + "{"  # JS template-literal marker (split so bash 3.2 heredoc scan never sees it)
pages = sorted(glob.glob("*.html") + glob.glob("blog/*.html"))

def read(p): return open(p, encoding="utf-8", errors="replace").read()
def no_scripts(s): return re.sub(r"<script\b.*?</script>", "", s, flags=re.S | re.I)

STUBS  = {p for p in pages if re.search(r'http-equiv="refresh"', read(p), re.I)}
NOIDX  = {p for p in pages if re.search(r'name="robots"[^>]*noindex', read(p), re.I)}

def emit(label, result="ok"): print(f"{label}|{result}")
def section(name): print(f"@section|{name}")

def resolve(page, href):
    path = href.split("#")[0].split("?")[0]
    if not path:
        return page  # same-page anchor
    if path.startswith("/"):
        return os.path.normpath(path[1:])
    return os.path.normpath(os.path.join(os.path.dirname(page), path))

# ── 1. internal href + anchor resolution ──────────────────────────────────
section("Internal links + anchors resolve (stubs count as real)")
for p in pages:
    s = read(p)
    body = no_scripts(s)
    ids = set(re.findall(r'id="([^"]+)"', s)) | set(re.findall(r"id='([^']+)'", s))
    bad = []
    for m in re.finditer(r'href="([^"]+)"', body):
        h = m.group(1)
        if re.match(r"^(https?:|mailto:|tel:|javascript:|data:)", h) or TPL in h:
            continue
        if h.startswith("#"):
            if h != "#" and h[1:] not in ids:
                bad.append(h)
            continue
        target = resolve(p, h)
        if not os.path.exists(target):
            bad.append(h)
            continue
        if "#" in h and target.endswith(".html"):
            anchor = h.split("#", 1)[1]
            ts = read(target)
            if anchor and f'id="{anchor}"' not in ts and f"id='{anchor}'" not in ts:
                bad.append(h)
    emit(f"links resolve: {p}", "ok" if not bad else f"{len(bad)} broken: {' '.join(bad[:3])}")

# ── 2. canonical + og:title ───────────────────────────────────────────────
section("Exactly one canonical everywhere; one og:title on indexable pages")
for p in pages:
    s = read(p)
    n_canon = len(re.findall(r'rel="canonical"', s))
    emit(f"one canonical: {p}", "ok" if n_canon == 1 else f"found {n_canon}")
for p in pages:
    if p in NOIDX:
        continue  # noindex consoles/stubs are not shared into social cards
    n_og = len(re.findall(r'(property|name)="og:title"', read(p)))
    emit(f"one og:title: {p}", "ok" if n_og == 1 else f"found {n_og}")

# ── 3. sitemap.xml ────────────────────────────────────────────────────────
section("sitemap.xml — entries resolve, no retired/noindex stubs")
sm = read("sitemap.xml")
entries = re.findall(r"<loc>https://www\.aigovops-foundation\.com/([^<]*)</loc>", sm)
for e in entries:
    f = e if e else "index.html"
    if not os.path.exists(f):
        emit(f"sitemap entry resolves: /{e}", "file missing")
    elif f in STUBS:
        emit(f"sitemap entry indexable: /{e}", "meta-refresh redirect stub listed in sitemap")
    elif f in NOIDX:
        emit(f"sitemap entry indexable: /{e}", "noindex page listed in sitemap")
    else:
        emit(f"sitemap entry ok: /{e}")
listed = {e if e else "index.html" for e in entries}
# (The sitemap need not be exhaustive, only honest — reachability of unlisted
#  indexable pages is what the orphan check below guards.)
emit("sitemap lists index.html", "ok" if "index.html" in listed else "homepage missing")

# ── 4. CSS load order style.css → garden.css ──────────────────────────────
section("CSS order — style.css before garden.css wherever both load")
for p in pages:
    s = read(p)
    st, ga = s.find("css/style.css"), s.find("css/garden.css")
    if st < 0 and ga < 0:
        emit(f"css order: {p} (standalone — loads neither, exempt)")
    elif st < 0:
        emit(f"css order: {p} (garden-only, self-contained)")
    elif ga < 0:
        emit(f"css order: {p}", "loads style.css but not garden.css")
    else:
        emit(f"css order: {p}", "ok" if st < ga else "garden.css loads before style.css")

# ── 5. orphan pages ───────────────────────────────────────────────────────
section("No orphans — indexable pages reachable in ≤2 hops (stubs/consoles exempt)")
def links_of(p):
    out = set()
    for m in re.finditer(r'href="([^"]+)"', no_scripts(read(p))):
        h = m.group(1)
        if re.match(r"^(https?:|mailto:|tel:|javascript:|#|data:)", h) or TPL in h:
            continue
        t = resolve(p, h)
        if t.endswith(".html") and os.path.exists(t):
            out.add(t)
    return out
seeds = {"index.html"} | {e for e in listed if os.path.exists(e)}
reach, frontier = set(seeds), set(seeds)
for _ in range(2):
    nxt = set()
    for p in frontier:
        nxt |= links_of(p)
    frontier = nxt - reach
    reach |= nxt
for p in pages:
    if p in STUBS:
        emit(f"reachable: {p} (redirect stub — exempt)")
    elif p in NOIDX:
        emit(f"reachable: {p} (noindex console/fallback — exempt)")
    else:
        emit(f"reachable: {p}", "ok" if p in reach else "orphan — not linked from index/nav/footer/sitemap within 2 hops")

# ── 6b. retired Library mirror — nothing may link the dead github.io URL ──
section("Retired Library mirror — no shipped page or served JS links it")
MIRROR = "aigovops-foundation.github.io/aigovops-library-june-ken-bob"
served_js = sorted(set(glob.glob("*.js") + glob.glob("js/**/*.js", recursive=True)))
for p in pages + served_js:
    emit(f"no retired-mirror link: {p}",
         "ok" if MIRROR not in read(p) else "links the retired github.io mirror — use https://community.aigovops-foundation.com/library/")

# ── 6. redirect stubs — noindex + meta-refresh + canonical ────────────────
section("Redirect stubs carry noindex + meta-refresh + canonical")
for p in sorted(STUBS):
    s = read(p)
    probs = []
    if p not in NOIDX:
        probs.append("no noindex")
    if not re.search(r'http-equiv="refresh"[^>]*url=', s, re.I):
        probs.append("meta-refresh has no url=")
    if 'rel="canonical"' not in s:
        probs.append("no canonical")
    emit(f"stub contract: {p}", "ok" if not probs else ", ".join(probs))
PY
)

while IFS='|' read -r label result; do
  [ -z "$label" ] && continue
  if [ "$label" = "@section" ]; then
    echo ""
    echo "  [$result]"
  else
    check "$label" "$result"
  fi
done <<< "$LINES"

echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All architecture tests passed" || echo "  ❌  ${FAIL} architecture test(s) failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
