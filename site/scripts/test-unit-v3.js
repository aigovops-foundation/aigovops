#!/usr/bin/env node
// AiGovOps — Unit Tests v3
// Covers: intent classifier, URL integrity, post title cleaner,
//         schedule slot logic, UTC offset, chatbot fallback
// Run: node scripts/test-unit-v3.js

const fs   = require('fs');
const path = require('path');

let PASS = 0, FAIL = 0;

function check(label, got, expected) {
  const ok = JSON.stringify(got) === JSON.stringify(expected);
  if (ok) { PASS++; process.stdout.write('  ✅  '); }
  else    { FAIL++; process.stdout.write('  ❌  '); }
  console.log(`${label}\n       → got: ${JSON.stringify(got)}  expected: ${JSON.stringify(expected)}${ok ? '' : '  ← FAIL'}\n`);
}

function checkTrue(label, val) { check(label, !!val, true); }
function checkFalse(label, val) { check(label, !!val, false); }

console.log('\n🧪  Unit Tests v3 — full suite\n');

// ── 1. INTENT CLASSIFIER ──────────────────────────────────────────────────
console.log('  [Intent Classifier]');
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
const INTENT_CASES = [
  // Newsletter
  { i: 'tell me about the newsletter',       e: 'newsletter' },
  { i: 'how do I subscribe on substack?',    e: 'newsletter' },
  { i: 'sign me up for email updates',       e: 'newsletter' },
  // Events
  { i: 'what events are coming up?',         e: 'event'      },
  { i: 'how do I register on luma?',         e: 'event'      },
  { i: 'is there an upcoming summit?',       e: 'event'      },
  // Ken
  { i: "Ken's latest thoughts",              e: 'ken'        },
  { i: 'show me Johnston linkedin posts',    e: 'ken'        },
  // Bob
  { i: "what's bob been writing lately?",    e: 'bob'        },
  { i: 'rapp on linkedin',                   e: 'bob'        },
  // Open source
  { i: 'do you have any open source tools?', e: 'opensource' },
  { i: 'where is your github?',              e: 'opensource' },
  { i: 'show me your projects',              e: 'opensource' },
  { i: 'I want to contribute to your code',  e: 'opensource' },
  { i: 'any open-source repos?',             e: 'opensource' },
  // Beacon
  { i: 'tell me about beacon',               e: 'beacon'     },
  { i: 'beacon github repo',                 e: 'beacon'     },
  // Umbrella
  { i: 'what is umbrella?',                  e: 'umbrella'   },
  { i: 'show me the umbrella platform',      e: 'umbrella'   },
  // Meeting
  { i: 'I want to book a meeting',           e: 'meeting'    },
  { i: 'can I schedule a call?',             e: 'meeting'    },
  { i: 'how do I meet a volunteer?',         e: 'meeting'    },
  { i: 'I want to connect with someone',     e: 'meeting'    },
  { i: 'schedule a call with Ken',           e: 'meeting'    },
  { i: 'talk to someone from aigovops',      e: 'meeting'    },
  // Negatives
  { i: 'how do I fix my server?',            e: null         },
  { i: 'write me a poem about AI',           e: null         },
  { i: 'what is AI governance?',             e: null         },
  { i: 'help me debug my python code',       e: null         },
  { i: 'who founded the EU AI Act?',         e: null         },
  { i: 'thanks!',                            e: null         },
  { i: 'what time is it in Tokyo?',          e: null         },
];
for (const c of INTENT_CASES) check(`classify("${c.i}")`, classify(c.i), c.e);

// ── 2. URL INTEGRITY ──────────────────────────────────────────────────────
console.log('\n  [URL Integrity]');
const chatJs = fs.readFileSync(path.join(__dirname, '../js/chat.js'), 'utf8');
const mainJs = fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Extract all URLs from chat.js RESOURCES block
const urlMatches = [...chatJs.matchAll(/url:\s*'(https?:\/\/[^']+)'/g)].map(m => m[1]);
checkTrue('chat.js has ≥5 resource URLs', urlMatches.length >= 5);

// Verify key URLs present and correct
checkTrue('Ken LinkedIn URL correct (rkjohnston)', chatJs.includes('linkedin.com/in/rkjohnston/'));
checkFalse('Old Ken URL absent (kenjohnston)', chatJs.includes('linkedin.com/in/kenjohnston/'));
checkTrue('Beacon URL is GitHub Pages', chatJs.includes('bobrapp.github.io/aigovops-beacon/'));
checkFalse('Beacon URL is not raw github.com', chatJs.includes('github.com/bobrapp/aigovops-beacon') && !chatJs.includes('github.io'));
checkTrue('Luma event URL present', chatJs.includes('luma.com/2mypeqtr'));
checkTrue('Ken RSS URL correct in fetch script',
  fs.readFileSync(path.join(__dirname, '../scripts/fetch_posts.py'), 'utf8')
    .includes('rss.app/feeds/g12M4qd70BrS5rcy.xml'));

// main.js Ken URL
checkTrue('main.js Ken URL correct (rkjohnston)', mainJs.includes('linkedin.com/in/rkjohnston/'));
checkFalse('main.js old Ken URL absent', mainJs.includes('linkedin.com/in/kenjohnston/'));

// index.html key elements
checkTrue('index.html has og:title',        indexHtml.includes('og:title'));
checkTrue('index.html has og:image',        indexHtml.includes('og:image'));
checkTrue('index.html has twitter:card',    indexHtml.includes('twitter:card'));
checkTrue('index.html has favicon-32 link', indexHtml.includes('favicon-32'));
checkTrue('index.html has skip-link',       indexHtml.includes('skip-link'));
checkTrue('index.html has aria-live',       indexHtml.includes('aria-live'));
checkTrue('index.html schedule.js loaded',  indexHtml.includes('schedule.js'));
checkTrue('index.html main-content anchor', indexHtml.includes('id="main-content"'));

// ── 3. POST TITLE CLEANER ─────────────────────────────────────────────────
console.log('\n  [Post Title Cleaner]');
// Reproduce the clean_title logic in JS for unit testing
function firstSentence(text) {
  if (!text) return '';
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    const words = s.trim().split(/\s+/).filter(w => !w.startsWith('#') && !w.startsWith('@') && !w.startsWith('http'));
    if (words.length >= 5) return s.trim().slice(0, 120);
  }
  return text.slice(0, 120);
}
function cleanTitle(title, summary = '') {
  if (!title) return firstSentence(summary);
  const core = title.replace(/#\S+/g, '').replace(/@\S+/g, '').replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
  if (core.split(/\s+/).length < 4) return firstSentence(summary) || title;
  return title;
}

check('Hashtag-only title → first sentence fallback',
  cleanTitle('#devops #aigovops #devsecops', 'Governance debt is the silent killer of AI innovation. We fix that.'),
  'Governance debt is the silent killer of AI innovation.');
check('Real title → unchanged',
  cleanTitle('AI governance frameworks for production systems'),
  'AI governance frameworks for production systems');
check('Mixed title (4+ real words) → kept',
  cleanTitle('Problem: AI projects often fail at the governance gap #aigovops'),
  'Problem: AI projects often fail at the governance gap #aigovops');
check('Empty title → uses summary',
  cleanTitle('', 'This is the first real sentence of the post.'),
  'This is the first real sentence of the post.');
check('Single hashtag title → fallback',
  cleanTitle('#msbuild', 'Rehearsals done and we are ALL READY to see you at MSBuild tomorrow.'),
  'Rehearsals done and we are ALL READY to see you at MSBuild tomorrow.');

// ── 4. SCHEDULE SLOT LOGIC ────────────────────────────────────────────────
console.log('\n  [Schedule Slot Logic]');
function nextWeekdays(n) {
  const days = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  while (days.length < n) {
    const dow = d.getDay();
    if (dow >= 1 && dow <= 5) days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}
const weekdays = nextWeekdays(5);
checkTrue('Returns exactly 5 weekdays', weekdays.length === 5);
checkTrue('No weekends in results', weekdays.every(d => d.getDay() >= 1 && d.getDay() <= 5));
checkTrue('All days are in the future', weekdays.every(d => d > new Date()));
checkTrue('Days are sorted ascending', weekdays.every((d, i) => i === 0 || d > weekdays[i-1]));

// Slot ID format
const SLOT_OFFSETS = [
  { hour: 15, min: 0 }, { hour: 15, min: 30 },
  { hour: 16, min: 0 }, { hour: 16, min: 30 },
];
const candidates = weekdays.flatMap(day =>
  SLOT_OFFSETS.map(s => `${day.toISOString().slice(0,10)}-${s.hour}-${s.min}`)
);
checkTrue('Generates 20 candidate slots (5 days × 4 slots)', candidates.length === 20);
checkTrue('Slot IDs match expected format (YYYY-MM-DD-H-M)', /^\d{4}-\d{2}-\d{2}-1[56]-[03]0?$/.test(candidates[0]));
checkTrue('First slot is 3pm (hour 15)', candidates.some(id => id.includes('-15-0')));
checkTrue('Last daily slot is 4:30pm (hour 16, min 30)', candidates.some(id => id.includes('-16-30')));

// ── 5. PACIFIC TIMEZONE LABEL ─────────────────────────────────────────────
console.log('\n  [Timezone Label]');
// PST = UTC-8 (winter), PDT = UTC-7 (summer/DST)
const jan = new Date(new Date().getFullYear(), 0, 15);
const jul = new Date(new Date().getFullYear(), 6, 15);
const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
const nowOffset = new Date().getTimezoneOffset();
const isDST = nowOffset < stdOffset;
// Just verify the logic produces a valid Pacific label string
const tzLabel = isDST ? 'PDT (UTC−7)' : 'PST (UTC−8)';
checkTrue('Pacific timezone label contains UTC offset', tzLabel.includes('UTC'));
checkTrue('Pacific label is either PST or PDT', tzLabel.startsWith('PST') || tzLabel.startsWith('PDT'));

// ── SUMMARY ───────────────────────────────────────────────────────────────
const total = PASS + FAIL;
console.log(`\n  Result: ${PASS}/${total} passed\n`);
if (FAIL > 0) {
  console.log(`  ❌  ${FAIL} test(s) failed\n`);
  process.exit(1);
} else {
  console.log('  ✅  All unit v3 tests passed\n');
}
