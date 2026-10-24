#!/usr/bin/env bash
# AiGovOps — Accessibility Tests v3
# Tests: ARIA labels, skip link, contrast markers, landmark roles,
#        keyboard nav markers, screen reader cues, form labels
# Run: bash scripts/test-a11y.sh

REPO=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
PASS=0; FAIL=0

check() {
  local label="$1" result="$2"
  if [ "$result" = "ok" ]; then
    echo "  ✅  $label"; PASS=$((PASS+1))
  else
    echo "  ❌  $label — $result"; FAIL=$((FAIL+1))
  fi
}

check_html() {
  local file="$1" label="$2" pattern="$3"
  grep -q "$pattern" "$file" \
    && check "$label" "ok" \
    || check "$label" "pattern not found: $pattern"
}

check_absent() {
  local file="$1" label="$2" pattern="$3"
  grep -q "$pattern" "$file" \
    && check "$label" "FOUND (should be absent): $pattern" \
    || check "$label" "ok"
}

echo ""
echo "♿  Accessibility Tests v3"
echo ""

# ── index.html ────────────────────────────────────────────────────────────
echo "  [index.html — Structure & Landmarks]"
check_html "$REPO/index.html" "Skip-to-content link present"       'skip-link'
check_html "$REPO/index.html" "Skip link targets #main-content"    'href="#main-content"'
check_html "$REPO/index.html" "main-content anchor id present"     'id="main-content"'
check_html "$REPO/index.html" "<header> landmark"                  '<header'
check_html "$REPO/index.html" "<footer> landmark"                  '<footer'
check_html "$REPO/index.html" "<nav> landmark in header"           '<nav class="main-nav"'
check_html "$REPO/index.html" "HTML lang attribute"                '<html lang="en"'

echo ""
echo "  [index.html — Chatbot Accessibility]"
check_html "$REPO/index.html" "Chat messages aria-live=polite"     'aria-live="polite"'

echo ""
echo "  [index.html — Action Cards]"
check_html "$REPO/academy.html" "Wren portrait has alt text"        'alt="Wren, the practitioner at the table"'
check_html "$REPO/index.html" "Hero SVG aria-hidden (decorative)"  'aria-hidden="true"'
# M14 dead-simple: Newsletter demoted from action card to a quiet hero link
check_html "$REPO/index.html" "Newsletter quiet link has visible text" '>Newsletter</a>'

echo ""
echo "  [index.html — Meta & Language]"
check_html "$REPO/index.html" "og:title present"                   'og:title'
check_html "$REPO/index.html" "og:description present"             'og:description'
check_html "$REPO/index.html" "og:image present"                   'og:image'
check_html "$REPO/index.html" "twitter:card present"               'twitter:card'
check_html "$REPO/index.html" "Favicon 32px linked"                'favicon-32'
check_html "$REPO/index.html" "Apple touch icon linked"            'apple-touch-icon'

echo ""
echo "  [index.html — Forms & Inputs]"

echo ""
echo "  [css/style.css — Accessibility Styles]"
check_html "$REPO/css/style.css" "Skip link defined"               '\.skip-link'
check_html "$REPO/css/style.css" "Skip link focus shows it"        '\.skip-link:focus'
check_html "$REPO/css/style.css" "Chat badge visible style"        '\.chat-badge'

echo ""
echo "  [js/main.js — Post Card Labels]"
check_absent "$REPO/js/main.js" "Post cards rely on visible text for their name" "aria-label="
check_html "$REPO/js/main.js"  "Post cards keep safe new-tab behavior"   'target="_blank" rel="noopener"'

echo ""
echo "  [js/chat.js — Keyboard Navigation]"
check_html "$REPO/js/chat.js"  "Enter key opens chat"              "Enter"
check_html "$REPO/js/chat.js"  "Space key opens chat"              "' '"
check_html "$REPO/js/chat.js"  "Escape key closes chat"            "Escape"

echo ""
echo "  [schedule.js — Modal Accessibility]"
check_html "$REPO/js/schedule.js" "Modal role=dialog"              'role="dialog"'
check_html "$REPO/js/schedule.js" "Modal aria-modal"               'aria-modal="true"'
check_html "$REPO/js/schedule.js" "Modal aria-label"               'aria-label="Schedule a Call"'
check_html "$REPO/js/schedule.js" "Close button aria-label"        'aria-label="Close"'
check_html "$REPO/js/schedule.js" "Schedule btn accessible label"  'aria-label\|role'

echo ""
echo "  [Contrast — CSS Variable Audit]"
# Verify muted color was updated from failing value
check_absent "$REPO/css/style.css" "Old failing muted color absent (#666680)" '#666680'
check_html   "$REPO/css/style.css" "Updated muted color present"              'muted:'
# Verify hero sub-text was updated
check_absent "$REPO/css/style.css" "Old low-contrast hero sub absent (#c4c0e0)" '#c4c0e0'

echo ""
echo "  [brand — the licence and the standard, once]"
check_html "$REPO/index.html" "EU AI Act badge"                    'EU AI Act'

echo ""
echo "  [one voice at the door — no assistant widget on the home page (Walk run 2)]"
check_absent "$REPO/index.html" "No chat bubble on the home page" 'id="chatBubble"'
check_html "$REPO/css/style.css" "Teal CSS variable defined"       '\-\-teal:'
check_html "$REPO/css/style.css" "Teal-accessible defined"         'teal-accessible'
check_html "$REPO/css/style.css" "Monospace eyebrow CSS"           'Courier New.*eyebrow\|eyebrow.*Courier'
# Verify teal #1d9e75 contrast: 5.69:1 on dark — passing WCAG AA
python3 -c "
def rl(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in(0,2,4)]
    lin=lambda c: c/12.92 if c<=0.04045 else((c+0.055)/1.055)**2.4
    r,g,b=lin(r),lin(g),lin(b); return 0.2126*r+0.7152*g+0.0722*b
def cr(c1,c2): l1,l2=rl(c1),rl(c2); a,b=max(l1,l2),min(l1,l2); return(a+.05)/(b+.05)
ratio=cr('#1d9e75','#0d0d1a')
print('ok' if ratio>=4.5 else f'fail:{ratio:.2f}')
" | grep -q "^ok$" \
  && check "Teal (#1d9e75) on dark bg passes WCAG AA (≥4.5:1)" "ok" \
  || check "Teal (#1d9e75) on dark bg passes WCAG AA (≥4.5:1)" "contrast below 4.5"

echo ""
