---
name: cloud-mary
description: >
  Full test suite for the AiGovOps Foundation GitHub Pages + Hostinger deployment stack.
  Runs four levels of testing: unit (chat.js routing logic), e2e (live site behaviour),
  scale (concurrent load), and chaos monkey (failure injection). Use this skill whenever
  the user says "run tests", "test the site", "check everything works", "e2e", "unit test",
  "scale test", "chaos monkey", "cloud-mary", "is the site healthy", "test the chatbot links",
  or "verify the deployment". Also trigger after any link update or site change to verify
  nothing broke.
---

# Cloud-Mary — AiGovOps Site Test Suite

Four test tiers for the GitHub Pages + Hostinger stack, ordered from fastest to most destructive.
Run them in order: unit → e2e → scale → chaos. Stop and fix before going deeper if anything fails.

## Quick-run commands

```bash
cd ~/aigovops-repo

# Unit only (< 5 seconds, no network):
node scripts/test-unit.js

# E2E (live site, needs DNS to be up):
bash scripts/test-e2e.sh

# Scale (50 concurrent requests):
bash scripts/test-scale.sh

# Chaos monkey (intentional breakage + recovery):
bash scripts/test-chaos.sh
```

All scripts live in `~/aigovops-repo/scripts/` — see the Scripts section below for how to
create them. They don't exist yet until you write them for the first time.

---

## Tier 1 — Unit Tests

**What they check:** The chat.js routing logic in isolation — no network, no browser, instant.

**Write and run** `scripts/test-unit.js`:

```js
// scripts/test-unit.js
// Tests the intent-classification logic from chat.js in isolation.
// Run with: node scripts/test-unit.js

const INTENT_RULES = [
  { intent: 'newsletter', keywords: ['newsletter','substack','subscribe','email','updates','weekly','digest'] },
  { intent: 'event',      keywords: ['event','events','luma','meetup','attend','join','register','conference','summit','upcoming','next'] },
  { intent: 'ken',        keywords: ['ken','johnston',"ken's"] },
  { intent: 'bob',        keywords: ['bob','rapp',"bob's"] },
  { intent: 'beacon',     keywords: ['beacon','beakon'] },
  { intent: 'lantern',    keywords: ['lantern','lanturn'] },
];

function classify(text) {
  const lower = text.toLowerCase();
  for (const rule of INTENT_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) return rule.intent;
  }
  return null;
}

const CASES = [
  // Positive cases
  { input: 'tell me about the newsletter',  expect: 'newsletter' },
  { input: 'subscribe to substack',         expect: 'newsletter' },
  { input: 'what events are coming up?',    expect: 'event'      },
  { input: 'how do I register for luma?',   expect: 'event'      },
  { input: "Ken's latest thoughts",         expect: 'ken'        },
  { input: 'show me Johnston posts',        expect: 'ken'        },
  { input: "what's bob been writing?",      expect: 'bob'        },
  { input: 'rapp on linkedin',              expect: 'bob'        },
  { input: 'tell me about beacon',          expect: 'beacon'     },
  { input: 'Lantern github repo',           expect: 'lantern'    },
  // Negative cases — should return null
  { input: 'how do I fix my server?',       expect: null         },
  { input: 'write me a poem',              expect: null         },
  { input: 'what is AI governance?',       expect: null         },
  { input: 'help me debug my code',        expect: null         },
];

let passed = 0, failed = 0;
console.log('\n🧪 Unit Tests — chat.js intent classifier\n');
for (const c of CASES) {
  const result = classify(c.input);
  const ok = result === c.expect;
  if (ok) { passed++; process.stdout.write('  ✅ '); }
  else    { failed++; process.stdout.write('  ❌ '); }
  console.log(`"${c.input}" → ${result ?? 'null'} (expected: ${c.expect ?? 'null'})`);
}
console.log(`\n  ${passed}/${passed+failed} passed\n`);
process.exit(failed > 0 ? 1 : 0);
```

**Pass criteria:** All cases green. Zero failures.

---

## Tier 2 — E2E Tests

**What they check:** The live site — DNS, HTTP responses, page content, link validity.

**Write and run** `scripts/test-e2e.sh`:

```bash
#!/usr/bin/env bash
# scripts/test-e2e.sh
# End-to-end tests for aigovops-foundation.com

SITE="https://aigovops-foundation.com"
PASS=0; FAIL=0

check() {
  local label="$1"; local result="$2"
  if [ "$result" = "ok" ]; then
    echo "  ✅ $label"; ((PASS++))
  else
    echo "  ❌ $label — $result"; ((FAIL++))
  fi
}

echo ""
echo "🌐 E2E Tests — $SITE"
echo ""

# 1. Homepage returns 200
code=$(curl -sL -o /dev/null -w "%{http_code}" "$SITE/")
[ "$code" = "200" ] && check "Homepage 200" "ok" || check "Homepage 200" "got $code"

# 2. Blog page returns 200
code=$(curl -sL -o /dev/null -w "%{http_code}" "$SITE/blog.html")
[ "$code" = "200" ] && check "Blog page 200" "ok" || check "Blog page 200" "got $code"

# 3. Events page returns 200
code=$(curl -sL -o /dev/null -w "%{http_code}" "$SITE/events.html")
[ "$code" = "200" ] && check "Events page 200" "got $code"

# 4. CSS loads
code=$(curl -sL -o /dev/null -w "%{http_code}" "$SITE/css/style.css")
[ "$code" = "200" ] && check "CSS loads" "ok" || check "CSS loads" "got $code"

# 5. Chatbot JS loads
code=$(curl -sL -o /dev/null -w "%{http_code}" "$SITE/js/chat.js")
[ "$code" = "200" ] && check "chat.js loads" "ok" || check "chat.js loads" "got $code"

# 6. Logo image loads
code=$(curl -sL -o /dev/null -w "%{http_code}" "$SITE/images/logo.png")
[ "$code" = "200" ] && check "Logo image loads" "ok" || check "Logo image loads" "got $code"

# 7. Founders image loads
code=$(curl -sL -o /dev/null -w "%{http_code}" "$SITE/images/founders.jpg")
[ "$code" = "200" ] && check "Founders image loads" "ok" || check "Founders image loads" "got $code"

# 8. Key content present on homepage
body=$(curl -sL "$SITE/")
echo "$body" | grep -q "AiGovOps" && check "Brand name in HTML" "ok" || check "Brand name in HTML" "not found"
echo "$body" | grep -q "chat.js" && check "Chatbot JS referenced" "ok" || check "Chatbot JS referenced" "not found"
echo "$body" | grep -q "action-grid" && check "Action grid present" "ok" || check "Action grid present" "not found"

# 9. Server is GitHub Pages (not old Hostinger)
server=$(curl -sLI "$SITE/" | grep -i "^server:" | head -1)
echo "$server" | grep -qi "github" && check "Served by GitHub Pages" "ok" || check "Served by GitHub Pages" "server: $server"

# 10. CNAME file exists in repo
[ -f ~/aigovops-repo/CNAME ] && check "CNAME file in repo" "ok" || check "CNAME file in repo" "missing"

echo ""
echo "  $PASS passed, $FAIL failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
```

**Pass criteria:** All 10 checks green. Pay particular attention to "Served by GitHub Pages" — if this fails, DNS or SSL isn't resolved yet.

---

## Tier 3 — Scale Tests

**What they check:** Site stability under concurrent load (50 simultaneous requests).

**Write and run** `scripts/test-scale.sh`:

```bash
#!/usr/bin/env bash
# scripts/test-scale.sh
# Sends 50 concurrent requests across all pages and measures error rate + latency.
# Requires: curl (built-in on macOS)

SITE="https://aigovops-foundation.com"
CONCURRENCY=50
URLS=("/" "/blog.html" "/events.html" "/css/style.css" "/js/chat.js" "/images/logo.png")

echo ""
echo "⚡ Scale Test — $CONCURRENCY concurrent requests"
echo ""

PASS=0; FAIL=0; TOTAL_MS=0

run_one() {
  local url="$SITE$1"
  local start=$(($(date +%s%N)/1000000))
  local code=$(curl -sL -o /dev/null -w "%{http_code}" "$url")
  local end=$(($(date +%s%N)/1000000))
  local ms=$((end - start))
  echo "$code $ms $url"
}

# Fire all requests in parallel, collect results
TMPFILE=$(mktemp)
for i in $(seq 1 $CONCURRENCY); do
  URL=${URLS[$((i % ${#URLS[@]}))]}
  run_one "$URL" >> "$TMPFILE" &
done
wait

# Analyse
while IFS=' ' read -r code ms url; do
  if [ "$code" = "200" ]; then
    ((PASS++))
    TOTAL_MS=$((TOTAL_MS + ms))
  else
    ((FAIL++))
    echo "  ❌ $code in ${ms}ms — $url"
  fi
done < "$TMPFILE"
rm "$TMPFILE"

AVG_MS=$(( PASS > 0 ? TOTAL_MS / PASS : 0 ))
ERROR_RATE=$(( (FAIL * 100) / (PASS + FAIL) ))

echo "  ✅ $PASS successful"
[ $FAIL -gt 0 ] && echo "  ❌ $FAIL failed"
echo "  📊 Avg latency: ${AVG_MS}ms"
echo "  📊 Error rate:  ${ERROR_RATE}%"
echo ""

# Fail if error rate > 5%
[ $ERROR_RATE -le 5 ] && echo "  ✅ Scale test passed (<= 5% error rate)" || echo "  ❌ Scale test FAILED (${ERROR_RATE}% errors)"
exit $((ERROR_RATE > 5 ? 1 : 0))
```

**Pass criteria:** Error rate ≤ 5%. Average latency < 2000ms (GitHub CDN is usually < 300ms).

---

## Tier 4 — Chaos Monkey

**What they check:** Failure injection and recovery — bad URLs, git conflicts, stale tokens, missing files.

**Write and run** `scripts/test-chaos.sh`:

```bash
#!/usr/bin/env bash
# scripts/test-chaos.sh
# Injects failures and verifies the system recovers correctly.
# ⚠️  This script makes real changes and reverts them — run on a clean working tree.

SITE="https://aigovops-foundation.com"
REPO=~/aigovops-repo
PASS=0; FAIL=0

check() { local l="$1" r="$2"; [ "$r" = "ok" ] && { echo "  ✅ $l"; ((PASS++)); } || { echo "  ❌ $l — $r"; ((FAIL++)); }; }

echo ""
echo "🐒 Chaos Monkey"
echo ""

# Safety check: working tree must be clean
cd "$REPO"
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "  ⚠️  Working tree is dirty — stash changes before running chaos tests."
  exit 1
fi

# ── CHAOS 1: Inject invalid URL into chat.js, verify git catches it ──
echo "  → Chaos 1: inject bad URL"
sed -i.bak "s|url:   'https://lu.ma/aigovops'|url:   'INVALID_URL_CHAOS_TEST'|" js/chat.js
changed=$(grep -c "INVALID_URL_CHAOS_TEST" js/chat.js)
[ "$changed" -ge 1 ] && check "Bad URL injected" "ok" || check "Bad URL injected" "sed failed"
# Revert
mv js/chat.js.bak js/chat.js
grep -q "INVALID_URL_CHAOS_TEST" js/chat.js && check "Revert removed bad URL" "still present" || check "Revert removed bad URL" "ok"

# ── CHAOS 2: Delete a critical file, verify detection ──
echo "  → Chaos 2: remove CNAME"
cp CNAME CNAME.bak
rm CNAME
[ ! -f CNAME ] && check "CNAME removed" "ok" || check "CNAME removed" "still exists"
# Revert
mv CNAME.bak CNAME
[ -f CNAME ] && check "CNAME restored" "ok" || check "CNAME restored" "failed"

# ── CHAOS 3: Corrupt chat.js syntax, verify node catches it ──
echo "  → Chaos 3: syntax error in chat.js"
cp js/chat.js js/chat.js.bak
echo "THIS IS NOT VALID JS }{{{" >> js/chat.js
node --check js/chat.js 2>/dev/null && check "Node accepted broken JS (bad)" "should have failed" || check "Node rejects broken JS" "ok"
mv js/chat.js.bak js/chat.js
node --check js/chat.js 2>/dev/null && check "Node accepts restored JS" "ok" || check "Node accepts restored JS" "syntax error remains"

# ── CHAOS 4: 404 response for non-existent page ──
echo "  → Chaos 4: 404 for missing page"
code=$(curl -sL -o /dev/null -w "%{http_code}" "$SITE/this-page-does-not-exist-xyz.html")
[ "$code" = "404" ] && check "404 for missing page" "ok" || check "404 for missing page" "got $code (expected 404)"

# ── CHAOS 5: Verify git working tree is still clean after chaos ──
echo "  → Chaos 5: working tree clean after recovery"
git diff --quiet && git diff --cached --quiet && check "Working tree clean after chaos" "ok" || check "Working tree clean after chaos" "has uncommitted changes"

echo ""
echo "  $PASS passed, $FAIL failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
```

**Pass criteria:** All 5 chaos scenarios recover cleanly. The working tree must be clean at the end.

---

## Interpreting Results

| Result | Meaning | Action |
|--------|---------|--------|
| Unit ❌ | Routing logic broken | Fix `chat.js` INTENT_RULES |
| E2E — "not GitHub Pages" | DNS still propagating | Wait 30 min, rerun |
| E2E — 404 on pages | File missing from repo | Check git status, push missing files |
| Scale > 5% errors | CDN overloaded or DNS partial | Wait, rerun; escalate if persists |
| Chaos — working tree dirty | Script failed mid-run | `git checkout -- .` to reset |

## Writing the Scripts to the Repo

Before running tests for the first time, create the scripts directory and write each file:

```bash
mkdir -p ~/aigovops-repo/scripts
# Then write each test file as shown above
```

Add to `.gitignore` if you don't want test scripts in the repo (they're safe to commit too).
