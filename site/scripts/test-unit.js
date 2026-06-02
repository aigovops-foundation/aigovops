#!/usr/bin/env node
// AiGovOps — Unit Tests: chat.js intent classifier
// Run: node scripts/test-unit.js

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
  // ── Positive: should match a specific intent ──
  { input: 'tell me about the newsletter',    expect: 'newsletter' },
  { input: 'how do I subscribe on substack?', expect: 'newsletter' },
  { input: 'sign me up for email updates',    expect: 'newsletter' },
  { input: 'what events are coming up?',      expect: 'event'      },
  { input: 'how do I register on luma?',      expect: 'event'      },
  { input: 'is there an upcoming summit?',    expect: 'event'      },
  { input: "Ken's latest thoughts",           expect: 'ken'        },
  { input: 'show me Johnston linkedin posts', expect: 'ken'        },
  { input: "what's bob been writing lately?", expect: 'bob'        },
  { input: 'rapp on linkedin',                expect: 'bob'        },
  { input: "tell me about beacon",            expect: 'beacon'     },
  { input: 'beacon github repo',              expect: 'beacon'     },
  { input: 'lantern open source tool',        expect: 'lantern'    },
  { input: 'show me the lanturn project',     expect: 'lantern'    }, // typo tolerance
  // ── Negative: should return null ──
  { input: 'how do I fix my server?',         expect: null         },
  { input: 'write me a poem about AI',        expect: null         },
  { input: 'what is AI governance?',          expect: null         },
  { input: 'help me debug my python code',    expect: null         },
  { input: 'who founded the EU AI Act?',      expect: null         },
  { input: 'thanks!',                         expect: null         },
];

let passed = 0, failed = 0;
console.log('\n🧪  Unit Tests — chat.js intent classifier\n');
for (const c of CASES) {
  const result = classify(c.input);
  const ok = result === c.expect;
  if (ok) { passed++; process.stdout.write('  ✅  '); }
  else    { failed++; process.stdout.write('  ❌  '); }
  const got = result ?? 'null';
  const exp = c.expect ?? 'null';
  console.log(`"${c.input}"\n       → got: ${got}  expected: ${exp}${ok ? '' : '  ← FAIL'}\n`);
}
console.log(`  Result: ${passed}/${passed + failed} passed\n`);
if (failed > 0) {
  console.log(`  ❌  ${failed} test(s) failed — fix INTENT_RULES in js/chat.js\n`);
  process.exit(1);
} else {
  console.log('  ✅  All unit tests passed\n');
}
