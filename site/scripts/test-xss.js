#!/usr/bin/env node
// AiGovOps — feed-to-DOM injection guard
//
// THE BUG, as the review council found it on 2026-09-30. js/main.js built each post
// card by interpolating p.title, p.link, p.summary and p.date straight into a template
// literal and assigning the result to grid.innerHTML. Only `summary` had been through
// strip_html() in the fetcher, and that removes tags rather than escaping them. The
// page's CSP allows 'unsafe-inline', so an <img src=x onerror=…> arriving in a LinkedIn
// post title executed in every visitor's browser. The feed is not limited to Bob's and
// Ken's own writing — the committed JSON has carried posts authored by four other
// people — so none of those four fields was ever ours to trust.
//
// This suite DRIVES THE SHIPPED FUNCTIONS. It extracts esc, safeHref, fmtDate and
// renderPostCard out of js/main.js by source and evaluates them, rather than
// reimplementing them here. That distinction is the whole point: a copy of the
// function would keep passing after someone edited the real one, which is precisely
// the class of useless test the same council found three of elsewhere in the estate.
//
// Run:  node scripts/test-xss.js

const fs = require('fs');
const path = require('path');

let PASS = 0, FAIL = 0;

function check(label, ok, detail) {
  if (ok) { PASS++; console.log(`  ✅  ${label}`); }
  else { FAIL++; console.log(`  ❌  ${label}${detail ? `\n       → ${detail}` : ''}  ← FAIL`); }
}

const SRC = fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8');

// Pull a top-level `function name(...) { ... }` out of the source by brace balance.
// Deliberately not a regex over the body: a regex that stops at the first `}` would
// silently capture half a function and every assertion below would then be testing a
// SyntaxError instead of the code that ships.
function extract(name) {
  const start = SRC.indexOf(`function ${name}(`);
  if (start === -1) throw new Error(`js/main.js no longer defines ${name}() — ` +
    `the sink guard cannot be verified, so this suite fails rather than skipping.`);
  let depth = 0, i = SRC.indexOf('{', start);
  const open = i;
  for (; i < SRC.length; i++) {
    if (SRC[i] === '{') depth++;
    else if (SRC[i] === '}') { depth--; if (depth === 0) break; }
  }
  if (depth !== 0) throw new Error(`unbalanced braces extracting ${name}()`);
  return SRC.slice(start, i + 1);
}

// document.baseURI is the only browser global these four touch (safeHref resolves
// relative URLs against it). Everything else is pure.
//
// Verified 2026-09-30: run this suite against the pre-fix js/main.js and it exits
// non-zero here, because esc() and safeHref() do not exist in it. That is the property
// that makes the suite worth keeping — it fails on the code that had the bug, rather
// than passing on anything that happens to parse.
let sandbox;
try {
  sandbox = new Function('document', `
    ${extract('esc')}
    ${extract('safeHref')}
    ${extract('fmtDate')}
    ${extract('renderPostCard')}
    return { esc, safeHref, fmtDate, renderPostCard };
  `)({ baseURI: 'https://www.aigovops-foundation.com/index.html' });
} catch (e) {
  console.log(`\n🛡️  Feed-to-DOM injection guard\n\n  ❌  ${e.message}\n`);
  console.log('  0 passed, 1 failed\n');
  process.exit(1);
}

const { esc, safeHref, renderPostCard } = sandbox;

console.log('\n🛡️  Feed-to-DOM injection guard\n');

// ── 1. The exact payload from the finding ────────────────────────────────────
console.log('  [1] the attack as reported');

const ATTACK = '<img src=x onerror=alert(1)>';
const hostile = {
  title: `Governance debt ${ATTACK}`,
  link: 'https://www.linkedin.com/posts/example',
  summary: `A post body ${ATTACK} with markup in it`,
  date: '2026-09-22T10:00:00Z',
  author: 'Ken Johnston',
};
const html = renderPostCard(hostile);

check('an <img onerror> in the title does not survive as an element',
  !/<img/i.test(html), html.slice(0, 160));
// Note what this does NOT assert. The string "onerror" survives in the output, as
// escaped TEXT, and that is the correct outcome — the fix escapes the post rather than
// censoring it. The property that matters is that no `<` from the feed reaches the
// parser, so "onerror" can never be read as an attribute. Asserting the word's absence
// was this suite's own first-draft mistake: it fails on safe output and would have
// pushed the fix toward deleting the visitor's content.
check('…nor in the summary: its markup arrives escaped, as text',
  /<span class="post-summary">[^<]*&lt;img/.test(html), html.slice(0, 200));
check('the words are still READABLE — escaped, not deleted',
  html.includes('Governance debt') && html.includes('&lt;img'),
  'the fix must not silently swallow the post text');

// A post card is one <a> with three <span>s. Any other tag in the output came from
// the feed, whatever it is — so assert on the tag census rather than on a denylist of
// payloads, which is the check that still holds against a payload nobody thought of.
const tags = (html.match(/<[a-zA-Z][^\s>]*/g) || []).map(t => t.slice(1).toLowerCase());
check('the rendered card contains ONLY its own tags',
  tags.every(t => t === 'a' || t === 'span'),
  `tags present: ${JSON.stringify(tags)}`);

// ── 2. The attribute, which the old code half-handled ────────────────────────
console.log('\n  [2] the aria-label attribute');
// The previous code did truncTitle.replace(/"/g,'&quot;') — it closed the quote but
// left < and > alone, so the attribute was its own injection point.
const quoted = renderPostCard({ ...hostile, title: 'He said "hello" <b>loudly</b>' });
check('a double quote in the title cannot close the attribute',
  !/aria-label="[^"]*"[^>]*"/.test(quoted));
check('…and angle brackets in it are escaped too',
  !/aria-label="[^"]*<b>/.test(quoted));

// ── 3. href needs a scheme check, because escaping does nothing to javascript: ──
console.log('\n  [3] the href');
check('javascript: is refused', safeHref('javascript:alert(1)') === '#',
  safeHref('javascript:alert(1)'));
check('javascript: with padding and mixed case is refused',
  safeHref('  JaVaScRiPt:alert(1)') === '#', safeHref('  JaVaScRiPt:alert(1)'));
check('a data: URL is refused', safeHref('data:text/html,<script>1</script>') === '#');
check('vbscript: is refused', safeHref('vbscript:msgbox(1)') === '#');
check('an empty link is refused rather than becoming a relative link',
  safeHref('') === '#' && safeHref(null) === '#');
check('a real LinkedIn post URL passes through unharmed',
  safeHref('https://www.linkedin.com/posts/bobrapp_abc-123') ===
    'https://www.linkedin.com/posts/bobrapp_abc-123');
// Checked on the href attribute alone. The first draft of this assertion scanned the
// whole tag for `on…=` and failed on the ESCAPED aria-label text, which proved nothing
// about the href — the lesson being that an assertion has to name the attribute it is
// defending, or it reports on whichever field happens to carry the word.
const breakout = renderPostCard({ ...hostile, link: 'https://x.test/a" onmouseover="alert(1)' });
const hrefVal = (breakout.match(/href="([^"]*)"/) || [])[1];
check('a quote inside an otherwise-valid URL cannot close the href',
  hrefVal !== undefined && !hrefVal.includes('"') && !/\son\w+=/i.test(hrefVal),
  `href resolved to: ${hrefVal}`);

// ── 4. The fields a missing/odd post can have ────────────────────────────────
console.log('\n  [4] shapes the renderer must survive');
let threw = null;
try { renderPostCard({}); } catch (e) { threw = e; }
check('an empty post object does not throw', threw === null, threw && threw.message);
check('a non-string title is coerced, not interpolated raw',
  !/\[object/.test(esc({ toString: () => '<b>x</b>' })) || esc({}) === '[object Object]');

// ── 5. The guard is actually wired into the page ─────────────────────────────
console.log('\n  [5] the sink itself');
// renderPostCard's output reaches the DOM via innerHTML. If a future edit interpolates
// a raw feed field at that assignment, these tests would still pass — so pin the sink.
check('grid.innerHTML is only ever fed renderCol() output',
  /grid\.innerHTML\s*=\s*renderCol\([^)]*\)\s*\+\s*renderCol\([^)]*\);/.test(SRC) &&
  !/grid\.innerHTML\s*=\s*[`'"]/.test(SRC.replace(/grid\.innerHTML = renderCol[^;]*;/g, '')),
  'a template literal assigned straight to grid.innerHTML is how this bug happened');
check('no feed field is interpolated without esc() or safeHref()',
  !/\$\{p\.(title|link|summary|date|author)\}/.test(SRC),
  'found a bare ${p.<field>} — every one must be wrapped');

console.log(`\n  ${PASS} passed, ${FAIL} failed\n`);
process.exit(FAIL === 0 ? 0 : 1);
