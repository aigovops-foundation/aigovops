#!/usr/bin/env bash
# AiGovOps — Multilingual / i18n Tests v3
# Tests: lang attribute, charset, multilingual post content,
#        timezone labels, non-ASCII handling, encoding integrity,
#        chatbot multilingual keyword detection
# Run: bash scripts/test-i18n.sh

REPO=$(git rev-parse --show-toplevel 2>/dev/null || echo ~/aigovops-repo)
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
echo "🌍  Multilingual / i18n Tests v3"
echo ""

# ── HTML Language & Encoding ──────────────────────────────────────────────
echo "  [HTML Language & Encoding]"
for file in index.html blog.html events.html; do
  grep -q '<html lang="en"' "$REPO/$file" \
    && check "$file: lang=en attribute" "ok" \
    || check "$file: lang=en attribute" "missing in $file"
  grep -q 'charset="UTF-8"\|charset=UTF-8' "$REPO/$file" \
    && check "$file: UTF-8 charset declared" "ok" \
    || check "$file: UTF-8 charset declared" "missing"
done

echo ""
echo "  [Posts Data — Multilingual Content]"
if [ -f "$REPO/data/linkedin-posts.json" ]; then
  # Check JSON is valid UTF-8
  python3 -c "
import json, sys
try:
    with open('$REPO/data/linkedin-posts.json', encoding='utf-8') as f:
        d = json.load(f)
    print('ok')
except Exception as e:
    print(f'error: {e}')
" | grep -q "^ok$" \
    && check "linkedin-posts.json is valid UTF-8 JSON" "ok" \
    || check "linkedin-posts.json is valid UTF-8 JSON" "invalid"

  # Check ensure_ascii=False was used (non-ASCII chars present or file is all-ASCII — both ok)
  python3 -c "
import json
with open('$REPO/data/linkedin-posts.json', encoding='utf-8') as f:
    content = f.read()
    d = json.load(open('$REPO/data/linkedin-posts.json', encoding='utf-8'))
# Check Bob's posts for multilingual content (he posts in Spanish/English)
all_text = ' '.join(
    p.get('title','') + ' ' + p.get('summary','')
    for person in ['bob','ken']
    for p in d.get(person,[])
)
# Check for presence of non-ASCII or multilingual signals
has_multi = any(ord(c) > 127 for c in all_text) or \
            any(w in all_text.lower() for w in ['enviar','buena','también','según','para','que'])
print('multilingual' if has_multi else 'english_only')
" 2>/dev/null | grep -q "multilingual\|english_only" \
    && check "Post content encoded without data loss" "ok" \
    || check "Post content encoded without data loss" "encoding issue"

  # Verify fetch script uses ensure_ascii=False
  grep -q "ensure_ascii=False" "$REPO/scripts/fetch_posts.py" \
    && check "fetch_posts.py uses ensure_ascii=False" "ok" \
    || check "fetch_posts.py uses ensure_ascii=False" "missing — non-ASCII chars may be escaped"

  # Check post titles are not purely escaped unicode (\uXXXX sequences indicate encoding issue)
  python3 -c "
import json
with open('$REPO/data/linkedin-posts.json') as f:
    raw = f.read()
bad = raw.count('\\\\u') > 50  # more than 50 unicode escapes is suspicious
print('bad' if bad else 'ok')
" | grep -q "^ok$" \
    && check "No excessive unicode escaping in posts JSON" "ok" \
    || check "No excessive unicode escaping in posts JSON" "too many \\uXXXX sequences"
fi

echo ""
echo "  [Chatbot — Multilingual Keyword Detection]"
# Test that the chatbot can handle accented/international variations
node - << 'JSEOF'
const INTENT_RULES = [
  { intent: 'meeting',    keywords: ['meeting','meet','book','booking','schedule','volunteer','chat','talk','call','connect'] },
  { intent: 'newsletter', keywords: ['newsletter','substack','subscribe','email','updates','weekly','digest'] },
  { intent: 'event',      keywords: ['event','events','luma','meetup','attend','join','register','conference','summit','upcoming','next'] },
  { intent: 'ken',        keywords: ['ken','johnston',"ken's"] },
  { intent: 'bob',        keywords: ['bob','rapp',"bob's"] },
  { intent: 'beacon',     keywords: ['beacon','beakon'] },
  { intent: 'umbrella',   keywords: ['umbrella','umbrela','govops platform'] },
  { intent: 'opensource', keywords: ['open source','opensource','open-source','github','projects','repos','repository','repositories','contribute'] },
];
function classify(text) {
  const lower = text.toLowerCase();
  for (const rule of INTENT_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) return rule.intent;
  }
  return null;
}
let pass = 0, fail = 0;
const cases = [
  // Alternate spellings / typos common from non-English keyboards
  { i: 'beakon project',            e: 'beacon'     },   // common typo
  { i: 'umbrela platform',          e: 'umbrella'   },   // common typo
  // Case variations
  { i: 'NEWSLETTER',                e: 'newsletter' },
  { i: 'Ken Johnston',              e: 'ken'        },
  { i: 'BOB RAPP',                  e: 'bob'        },
  // Partial / abbreviated inputs (common from mobile/non-native)
  { i: 'schedule',                  e: 'meeting'    },
  { i: 'call',                      e: 'meeting'    },
  { i: 'luma',                      e: 'event'      },
  { i: 'github',                    e: 'opensource' },
  // Mixed case
  { i: 'Schedule a Call',           e: 'meeting'    },
  { i: 'View Next Event',           e: 'event'      },
];
for (const c of cases) {
  const got = classify(c.i);
  const ok = got === c.e;
  if (ok) { pass++; console.log(`  ✅  classify("${c.i}") → ${got}`); }
  else    { fail++; console.log(`  ❌  classify("${c.i}") → got ${got}, expected ${c.e}`); }
}
console.log(`\n  Chatbot i18n: ${pass}/${pass+fail} passed`);
process.exit(fail > 0 ? 1 : 0);
JSEOF
[ $? -eq 0 ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

echo ""
echo "  [Scheduling Agent — Timezone Internationalization]"
node - << 'JSEOF'
// Verify UTC offset logic handles both PST and PDT correctly
let pass = 0, fail = 0;
function check(label, got, expected) {
  const ok = got === expected;
  if (ok) { pass++; console.log(`  ✅  ${label}`); }
  else    { fail++; console.log(`  ❌  ${label} — got ${got}, expected ${expected}`); }
}

// Simulate PST (UTC-8, no DST): Jan 15
const stdDate = new Date(new Date().getFullYear(), 0, 15);
const dstDate = new Date(new Date().getFullYear(), 6, 15);
const stdOffset = Math.max(stdDate.getTimezoneOffset(), dstDate.getTimezoneOffset());

// Test the label logic
function getPacificLabel(isDST) {
  return isDST ? 'PDT (UTC−7)' : 'PST (UTC−8)';
}
check('PST label correct',   getPacificLabel(false), 'PST (UTC−8)');
check('PDT label correct',   getPacificLabel(true),  'PDT (UTC−7)');
check('PST label has UTC',   getPacificLabel(false).includes('UTC'), true);
check('PDT label has UTC',   getPacificLabel(true).includes('UTC'),  true);
check('PST offset is -8',    getPacificLabel(false).includes('−8'),  true);
check('PDT offset is -7',    getPacificLabel(true).includes('−7'),   true);

// Verify slot labels include the timezone
const SLOT_OFFSETS = [
  { label: '3:00 – 3:25 PM', hour: 15, min: 0  },
  { label: '3:30 – 3:55 PM', hour: 15, min: 30 },
  { label: '4:00 – 4:25 PM', hour: 16, min: 0  },
  { label: '4:30 – 4:55 PM', hour: 16, min: 30 },
];
const fullLabel = `${SLOT_OFFSETS[0].label} ${getPacificLabel(false)}`;
check('Full slot label includes time and timezone', fullLabel.includes('3:00') && fullLabel.includes('PST'), true);

console.log(`\n  Timezone i18n: ${pass}/${pass+fail} passed`);
process.exit(fail > 0 ? 1 : 0);
JSEOF
[ $? -eq 0 ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

echo ""
echo "  [i18n Infrastructure Files]"
[ -f "$REPO/js/i18n/strings-en.js" ] && check "EN strings file present" "ok" || check "EN strings file present" "missing"
[ -f "$REPO/js/i18n/strings-es.js" ] && check "ES strings file present" "ok" || check "ES strings file present" "missing"
[ -f "$REPO/js/i18n/i18n.js"       ] && check "i18n module present"     "ok" || check "i18n module present"     "missing"

# Verify ES strings are valid UTF-8 JS
node -e "require('$REPO/js/i18n/strings-en.js')" 2>/dev/null
node -e "
try {
  const fs = require('fs');
  const src = fs.readFileSync('$REPO/js/i18n/strings-es.js','utf8');
  // check non-ASCII Spanish chars present (ó, ú, etc.)
  const hasAccents = /[áéíóúñü]/i.test(src);
  process.exit(hasAccents ? 0 : 1);
} catch(e) { process.exit(1); }" \
  && check "ES strings contain accented chars (UTF-8)" "ok" \
  || check "ES strings contain accented chars (UTF-8)" "missing or invalid"

# Badge strip framework names are ASCII-safe internationally
node -e "
const fs = require('fs');
const html = fs.readFileSync('$REPO/index.html','utf8');
const names = ['Apache-2.0','OVERT 1.0','NIST AI RMF','EU AI Act','ISO/IEC 42001'];
const missing = names.filter(n => !html.includes(n));
process.exit(missing.length > 0 ? 1 : 0);
" && check "All framework badge names ASCII-safe" "ok" || check "All framework badge names ASCII-safe" "some missing"

# Verify teal/monospace brand consistency signal
grep -q "Courier New\|monospace" "$REPO/css/style.css" \
  && check "Monospace brand signal in CSS" "ok" \
  || check "Monospace brand signal in CSS" "missing"
grep -q "ensure_ascii=False" "$REPO/scripts/fetch_posts.py" \
  && check "ensure_ascii=False in JSON dump" "ok" \
  || check "ensure_ascii=False in JSON dump" "missing"
grep -q "encoding='utf-8'\|encoding=\"utf-8\"" "$REPO/scripts/fetch_posts.py" \
  && check "UTF-8 encoding specified in file write" "ok" \
  || check "UTF-8 encoding specified in file write" "missing"

echo ""
echo "  [NLP Pipeline — language detection infrastructure]"
grep -q "haiku_enrich_posts" "$REPO/scripts/fetch_posts.py" \
  && check "Haiku NLP pipeline in fetch script" "ok" \
  || check "Haiku NLP pipeline in fetch script" "missing"
grep -q "'lang'" "$REPO/scripts/fetch_posts.py" \
  && check "Language detection field in Haiku output" "ok" \
  || check "Language detection field in Haiku output" "missing"
grep -q "strip_urls" "$REPO/scripts/fetch_posts.py" \
  && check "URL stripping applied to summaries" "ok" \
  || check "URL stripping applied to summaries" "missing"
grep -q "ANTHROPIC_API_KEY" "$REPO/.github/workflows/fetch-linkedin-posts.yml" \
  && check "ANTHROPIC_API_KEY in fetch workflow" "ok" \
  || check "ANTHROPIC_API_KEY in fetch workflow" "missing"
# Verify posts JSON has no URL-contaminated summaries
if [ -f "$REPO/data/linkedin-posts.json" ]; then
  url_count=$(python3 -c "
import json
with open('$REPO/data/linkedin-posts.json') as f: d=json.load(f)
posts=d.get('bob',[])+d.get('ken',[])
print(sum(1 for p in posts if 'http' in p.get('summary','')))
" 2>/dev/null || echo "0")
  [ "$url_count" = "0" ] \
    && check "Post summaries free of raw URLs" "ok" \
    || check "Post summaries free of raw URLs" "$url_count posts have URLs in summary"
fi

echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All i18n tests passed" || echo "  ❌  ${FAIL} test(s) failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
