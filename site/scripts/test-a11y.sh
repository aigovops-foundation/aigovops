#!/usr/bin/env bash
# AiGovOps — Accessibility Tests v3
# Tests: ARIA labels, skip link, contrast markers, landmark roles,
#        keyboard nav markers, screen reader cues, form labels
# Run: bash scripts/test-a11y.sh

REPO=~/aigovops-repo
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
check_html "$REPO/index.html" "Chat bubble role=button"            'role="button"'
check_html "$REPO/index.html" "Chat bubble aria-label (open)"      'aria-label="Open AiGovOps assistant"'
check_html "$REPO/index.html" "Chat bubble tabindex=0"             'tabindex="0"'
check_html "$REPO/index.html" "Chat window role=dialog"            'role="dialog"'
check_html "$REPO/index.html" "Chat window aria-modal"             'aria-modal="true"'
check_html "$REPO/index.html" "Chat window aria-label"             'aria-label="AiGovOps Assistant"'
check_html "$REPO/index.html" "Chat messages aria-live=polite"     'aria-live="polite"'
check_html "$REPO/index.html" "Chat close button aria-label"       'aria-label="Close assistant"'

echo ""
echo "  [index.html — Action Cards]"
check_html "$REPO/index.html" "Schedule button aria-label"         'aria-label="Schedule a call with a community leader"'
check_html "$REPO/index.html" "Hero SVG aria-hidden (decorative)"  'aria-hidden="true"'
check_html "$REPO/index.html" "Newsletter card has label text"     'action-label.*Newsletter\|Newsletter.*action-label'

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
check_html "$REPO/index.html" "Chat input has aria-label"          'aria-label="Your message"'
check_html "$REPO/index.html" "Chat send button has aria-label"    'aria-label="Send"'
check_html "$REPO/index.html" "Chat form autocomplete=off"         'autocomplete="off"'

echo ""
echo "  [css/style.css — Accessibility Styles]"
check_html "$REPO/css/style.css" "Skip link defined"               '\.skip-link'
check_html "$REPO/css/style.css" "Skip link focus shows it"        '\.skip-link:focus'
check_html "$REPO/css/style.css" "Chat badge visible style"        '\.chat-badge'

echo ""
echo "  [js/main.js — Post Card Labels]"
check_html "$REPO/js/main.js"  "Post cards have aria-label"        "aria-label="
check_html "$REPO/js/main.js"  "Post cards signal new tab"         "opens in new tab"

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
echo "  [blog.html]"
check_html "$REPO/blog.html"  "blog.html has HTML lang"            '<html lang="en"'
check_html "$REPO/blog.html"  "blog.html has og:title"             'og:title'
check_html "$REPO/blog.html"  "blog.html has favicon"              'favicon'

echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All accessibility tests passed" || echo "  ❌  ${FAIL} test(s) failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
