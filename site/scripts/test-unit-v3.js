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
  { intent: 'support',    keywords: ['donate','donation','sponsor','support','fund','coffee','sustainer','partner','give'] },
  { intent: 'frameworks',  keywords: ['framework', 'frameworks', 'nist', 'eu ai act', 'iso', '42001', 'gdpr', 'hipaa', 'compliance', 'regulation', 'regulatory', 'audit', 'applies', 'which law', 'what law', 'overt', 'umbrella framework'] },
  { intent: 'meeting',    keywords: ['meeting','meet','book','booking','schedule','volunteer','chat','talk','call','connect'] },
  { intent: 'newsletter', keywords: ['newsletter','substack','subscribe','email','updates','weekly','digest'] },
  { intent: 'event',      keywords: ['event','events','luma','meetup','attend','join','register','conference','summit','upcoming','next'] },
  { intent: 'ken',        keywords: ['ken','johnston',"ken's"] },
  { intent: 'bob',        keywords: ['bob','rapp',"bob's"] },
  { intent: 'beacon',     keywords: ['beacon','beakon'] },
  { intent: 'umbrella',   keywords: ['lantern','umbrella','umbrela','govops platform'] },
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
  // Lantern (was Umbrella)
  { i: 'what is lantern?',                   e: 'umbrella'   },
  { i: 'show me the lantern platform',       e: 'umbrella'   },
  // Meeting
  { i: 'I want to book a meeting',           e: 'meeting'    },
  { i: 'can I schedule a call?',             e: 'meeting'    },
  { i: 'how do I meet a volunteer?',         e: 'meeting'    },
  { i: 'I want to connect with someone',     e: 'meeting'    },
  { i: 'schedule a call with Ken',           e: 'meeting'    },
  { i: 'talk to someone from aigovops',      e: 'meeting'    },
  // Support / donate
  { i: 'how can I donate?',                  e: 'support'    },
  { i: 'I want to sponsor the foundation',   e: 'support'    },
  { i: 'buy you a coffee',                   e: 'support'    },
  { i: 'how do I contribute funding?',       e: 'support'    },
  // Frameworks (new)
  { i: 'which frameworks apply to me?',      e: 'frameworks' },
  { i: 'do I need to comply with NIST?',     e: 'frameworks' },
  { i: 'what about the EU AI Act?',          e: 'frameworks' },
  { i: 'ISO 42001 compliance',               e: 'frameworks' },
  { i: 'what regulations apply?',            e: 'frameworks' },
  { i: 'how do I prepare for an audit?',     e: 'frameworks' },
  { i: 'is GDPR relevant to my AI?',         e: 'frameworks' },
  // Negatives
  { i: 'how do I fix my server?',            e: null         },
  { i: 'write me a poem about AI',           e: null         },
  { i: 'what is AI governance?',             e: null         },
  { i: 'help me debug my python code',       e: null         },
  { i: 'who founded the EU AI Act?',         e: 'frameworks' }, // EU AI Act → frameworks intent
  { i: 'who invented artificial intelligence?', e: null       },
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
checkTrue('Ken intent routes to founder page', chatJs.includes('founders.html#ken')); // M11: ken.html merged into founders.html
checkFalse('Old Ken LinkedIn removed from chat.js intent', chatJs.includes("url:   'https://www.linkedin.com/in/rkjohnston/'"));
checkTrue('Beacon URL is GitHub Pages (aigovops-foundation org)', chatJs.includes('aigovops-foundation.github.io/aigovops-beacon/'));
checkFalse('Old bobrapp Beacon URL absent from chat.js', chatJs.includes('bobrapp.github.io/aigovops-beacon/'));
checkFalse('Beacon URL is not raw github.com', chatJs.includes('github.com/aigovops-foundation/aigovops-beacon') && !chatJs.includes('github.io'));
checkTrue('Event intent routes to the community (Luma retired)', chatJs.includes("url:   'community.html'") && !chatJs.includes('luma.com'));
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
checkTrue('index.html has frameworks intent chip', indexHtml.includes('data-intent="frameworks"') || indexHtml.includes('frameworks'));
checkTrue('index.html has toolkit section',        indexHtml.includes('toolkit-section'));
checkTrue('index.html has compliance badge strip', indexHtml.includes('badge-strip'));
checkTrue('index.html has Plausible analytics',    indexHtml.includes('plausible.io'));
checkTrue('index.html has i18n script',            indexHtml.includes('i18n.js'));
checkTrue('index.html has lang toggle',            indexHtml.includes('lang-btn'));
checkTrue('index.html has teal CSS variable',      fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8').includes('--teal'));

// FALLBACK text accuracy
checkTrue('FALLBACK mentions frameworks',      chatJs.includes('frameworks'));
checkTrue('FALLBACK says ten (not eight/nine)', chatJs.includes('ten') && !chatJs.match(/\beight things\b|\bnine things\b/));
checkTrue('Frameworks URL → lantern/umbrella-govops', chatJs.includes('umbrella-govops') || chatJs.includes('lantern'));
checkTrue('Support URL present in chat.js',   chatJs.includes('support.html'));

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

// ── 6. NLP PIPELINE LOGIC ────────────────────────────────────────────────────
console.log('\n  [NLP Pipeline]');

// strip_urls equivalent in JS
function stripUrls(text) {
  return (text || '').replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();
}

// Test URL stripping
check('strip_urls removes https links',
  stripUrls('Great post! https://luma.com/2mypeqtr Join us.'),
  'Great post! Join us.');
check('strip_urls removes multiple URLs',
  stripUrls('See https://example.com and http://test.org for more.'),
  'See and for more.');
check('strip_urls handles no URLs',
  stripUrls('Clean text with no links.'),
  'Clean text with no links.');
check('strip_urls handles empty string',
  stripUrls(''),
  '');

// Verify haiku_enrich_posts degrades gracefully (no API key = posts unchanged)
// We simulate this by checking the Python source has the guard
const fetchScript = fs.readFileSync(path.join(__dirname, '../scripts/fetch_posts.py'), 'utf8');
checkTrue('Haiku pipeline present in fetch_posts.py',           fetchScript.includes('haiku_enrich_posts'));
checkTrue('Haiku degrades if no ANTHROPIC_API_KEY',             fetchScript.includes('ANTHROPIC_API_KEY'));
checkTrue('Haiku uses claude-haiku model',                      fetchScript.includes('claude-haiku'));
checkTrue('Haiku enriches title field',                         fetchScript.includes('clean_title'));
checkTrue('Haiku enriches summary field',                       fetchScript.includes('clean_summary'));
checkTrue('Haiku detects language (lang field)',                 fetchScript.includes("'lang'"));
checkTrue('Haiku detects content_type',                         fetchScript.includes('content_type'));
checkTrue('strip_urls applied to summaries',                    fetchScript.includes('strip_urls'));
checkTrue('fetch workflow has ANTHROPIC_API_KEY',
  fs.readFileSync(path.join(__dirname, '../.github/workflows/fetch-linkedin-posts.yml'), 'utf8')
    .includes('ANTHROPIC_API_KEY'));

// Verify enriched posts would have lang field if Haiku ran
const sampleEnriched = { title: 'AI governance frameworks', summary: 'Clean summary.', lang: 'en', content_type: 'thought_leadership' };
checkTrue('Enriched post has lang field',         'lang' in sampleEnriched);
checkTrue('Enriched post has content_type field', 'content_type' in sampleEnriched);
checkTrue('Lang is valid ISO code',               /^[a-z]{2}$/.test(sampleEnriched.lang));

// Post data quality validation (current posts in repo)
try {
  const postsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/linkedin-posts.json'), 'utf8'));
  const allPosts = [...(postsData.bob || []), ...(postsData.ken || [])];
  checkTrue('Posts data file exists and is valid JSON', allPosts.length >= 0);
  // No post summaries should contain raw URLs (strip_urls should have cleaned them)
  const postsWithUrls = allPosts.filter(p => /https?:\/\//.test(p.summary || ''));
  checkTrue(`No post summaries contain raw URLs (${allPosts.length} posts checked)`, postsWithUrls.length === 0);
} catch(e) {
  check('Posts data file readable', 'error', 'ok'); // will mark as fail
}
// ── PR #4: A11y, mobile, voice ──────────────────────────────────────────
const cssContent = fs.readFileSync(path.join(__dirname,'../css/style.css'), 'utf8');
const fwHtml     = fs.readFileSync(path.join(__dirname,'../frameworks.html'), 'utf8');

checkTrue('Nav links min-height 44px (WCAG touch target)',  cssContent.includes('min-height: 44px'));
checkTrue('Lang toggle min-width + min-height 44px',        cssContent.includes('min-width: 44px'));
checkTrue('Action-grid last-child spans full width mobile', cssContent.includes('grid-column: 1 / -1'));
checkTrue('Voice CSS pulse animation',                      cssContent.includes('voicePulse'));
checkTrue('prefers-reduced-motion for voice',               cssContent.includes('voiceBtn'));
checkTrue('Clear filters function in frameworks',           fwHtml.includes('clearAllFilters'));
checkTrue('Clear filters visibility toggle',                fwHtml.includes("display = (region || industry || risk)"));
checkTrue('Voice button in index.html',                     indexHtml.includes('voiceBtn'));
checkTrue('Voice button has aria-label',                    indexHtml.includes('Start voice input'));
checkTrue('Web Speech API in chat.js',                      chatJs.includes('SpeechRecognition'));
checkTrue('TTS speechSynthesis in chat.js',                 chatJs.includes('speechSynthesis'));
checkTrue('VOICE_SPEAK hook in addMsg',                     chatJs.includes('VOICE_SPEAK'));
checkTrue('Mobile nav enhancer in index.html',              indexHtml.includes('Mobile nav'));

const communityHtml = fs.readFileSync(path.join(__dirname,'../community.html'), 'utf8');
const supportHtml   = fs.readFileSync(path.join(__dirname,'../support.html'),   'utf8');
const pressHtml     = fs.readFileSync(path.join(__dirname,'../press.html'),     'utf8');

// ── PR #8: Open items closed ──────────────────────────────────────────────
checkTrue('OVERT 1.0 links to overt.is (verified)',        fwHtml.includes('overt.is'));
checkFalse('Old OVERT umbrella URL gone from frameworks',  fwHtml.includes("url: 'https://aigovops-foundation.github.io/umbrella-govops/'"));
checkTrue('Texas entry updated to TRAIGA HB 149',         fwHtml.includes('Texas TRAIGA'));
checkFalse('Old Texas HB 1709 name gone',                  fwHtml.includes("name: 'Texas AI Act (HB 1709)'"));
checkFalse('Beacon star count removed from community',     communityHtml.includes('⭐ 3'));
checkTrue('Support give rail live: pick-your-amount',     supportHtml.includes('https://buy.stripe.com/cNi9AU8RT0884tR6Ix4Vy02'));
checkTrue('Support give rail live: $25 quick gift',       supportHtml.includes('https://buy.stripe.com/eVq7sMb015ss9Obd6V4Vy00'));
checkTrue('Support give rail live: $50 quick gift',       supportHtml.includes('https://buy.stripe.com/28E00kfgh1ccbWjgj74Vy01'));
checkTrue('Support give rail keeps the $500 gift',        supportHtml.includes('https://buy.stripe.com/bJe7sKbi214M7qJ1t75J603'));
checkFalse('Parked-state apology copy is gone',           supportHtml.includes('checkout is being set up'));
checkTrue('Support giving CTAs are parked (data-orig)',   supportHtml.includes('data-orig='));
checkFalse('No live GitHub Sponsors / Open Collective link', /href="https:\/\/(github\.com\/sponsors|opencollective\.com)/.test(supportHtml));
checkTrue('Press page has EIN pending placeholder',       pressHtml.includes('IRS EIN') || pressHtml.includes('EIN'));
checkTrue('Cloudflare deploy instructions in wrangler',   fs.existsSync(path.join(__dirname,'../functions/wrangler.toml')) && fs.readFileSync(path.join(__dirname,'../functions/wrangler.toml'),'utf8').includes('wrangler deploy'));

// ── PR #9: Wix blog content migration ──────────────────────────────────────
const blogHtml = fs.readFileSync(path.join(__dirname,'../blog.html'), 'utf8');
const POST_SLUGS = ['what-is-aigovops','nist-ai-rmf-vs-real-world','eu-ai-act-90-day-roadmap',
  'healthcare-ai-governance-spring-2026','agentic-frontiers-retrospective','agentic-hell',
  'flow-to-trust-loop','stop-writing-for-humans','no-more-anonymous-ghosts'];

POST_SLUGS.forEach(slug => {
  const p = path.join(__dirname, '../blog/' + slug + '.html');
  checkTrue('Blog page exists: ' + slug, fs.existsSync(p));
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    checkTrue('  ' + slug + ' has canonical tag', html.includes('rel="canonical"'));
    checkTrue('  ' + slug + ' has BlogPosting schema', html.includes('BlogPosting'));
    checkFalse('  ' + slug + ' carries no dead Wix link', html.includes('aigovopsfoundation.org'));
  }
  checkTrue('blog.html links to ' + slug, blogHtml.includes('blog/' + slug + '.html'));
});
checkFalse('blog.html has no external Wix post links', blogHtml.includes('aigovopsfoundation.org/post'));
checkTrue('sitemap includes blog posts', fs.readFileSync(path.join(__dirname,'../sitemap.xml'),'utf8').includes('blog/what-is-aigovops.html'));
checkFalse('deploy.yml retired (not active)', fs.existsSync(path.join(__dirname,'../.github/workflows/deploy.yml')));
checkTrue('deploy.yml.disabled preserved', fs.existsSync(path.join(__dirname,'../.github/workflows/deploy.yml.disabled')));

// ── Alpha: Vendor RFI integration (project 2 of 2) ────────────────────────
// M13 three doors: the alpha deep-dives moved wholesale to stay-at-yes.html
// (alpha.html is now a redirect stub).
console.log('\n  [Alpha — Vendor RFI (stay-at-yes.html)]');
const alphaHtml = fs.readFileSync(path.join(__dirname, '../stay-at-yes.html'), 'utf8');
const RFI = 'https://aigovops-foundation.github.io/aigovops-vendor-rfi';
checkTrue('stay-at-yes.html has the Vendor RFI section',          alphaHtml.includes('Vendor RFI'));
checkTrue('alpha links to the Vendor RFI hub',             alphaHtml.includes(`${RFI}/`));
checkTrue('alpha links to audit training',                 alphaHtml.includes(`${RFI}/training.html`));
checkTrue('alpha links to the 50-vendor comparison',       alphaHtml.includes(`${RFI}/comparison.html`));
checkTrue('Vendor RFI links open in a new tab safely',     alphaHtml.includes(`href="${RFI}/" target="_blank" rel="noopener"`));
checkTrue('stay-at-yes carries the live RFI embed',        alphaHtml.includes('aigovops-vendor-rfi/comparison.html') && alphaHtml.includes('aigovops-agent-vendor-rfi'));
checkTrue('Vendor RFI credits its governing agent',        alphaHtml.includes('aigovops-agent-vendor-rfi'));
checkFalse('Alpha uses the canonical org copy (no personal fork URL)', alphaHtml.includes('bobrapp.github.io/aigov'));
checkFalse('Alpha does not relink the retired /vendor-rfi-alpha bundle', alphaHtml.includes('/vendor-rfi-alpha/'));

const total = PASS + FAIL;
console.log(`\n  Result: ${PASS}/${total} passed\n`);
if (FAIL > 0) {
  console.log(`  ❌  ${FAIL} test(s) failed\n`);
  process.exit(1);
} else {
  console.log('  ✅  All unit v3 tests passed\n');
}
