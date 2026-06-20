#!/usr/bin/env node
/* AIGovOps Vendor RFI — CI integrity check.
 * 1) vendors-data.js schema (catches malformed catalog/correction PRs).
 * 2) HTML sanity: every page declares lang/title/canonical, and every local link resolves.
 * Run: node scripts/check-site.js   (exit 1 on any failure)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
let fail = 0;
const bad = (m) => { console.log('  ❌ ' + m); fail++; };
const good = (m) => console.log('  ✅ ' + m);

// ── 1. vendor data ────────────────────────────────────────────────────────
console.log('\n  [vendors-data.js]');
const sb = {};
new Function(fs.readFileSync(path.join(ROOT, 'vendors-data.js'), 'utf8') +
  '\n;this.M=VENDOR_META;this.C=VENDOR_CATEGORIES;this.V=VENDORS;').call(sb);
const { M, C, V } = sb;

if (!M || !/^\d{4}-\d{2}-\d{2}$/.test(M.lastReviewed || '')) bad('VENDOR_META.lastReviewed must be an ISO date');
else good('lastReviewed = ' + M.lastReviewed);
if (!M || !(M.cadenceDays > 0)) bad('VENDOR_META.cadenceDays must be a positive number');

const catIds = new Set((C || []).map(c => c.id));
if (!C || C.length < 1) bad('VENDOR_CATEGORIES is empty');
else (C.length === catIds.size) ? good(C.length + ' categories, unique ids') : bad('duplicate category ids');
for (const c of C || []) if (!c.id || !c.label || !c.note) bad('category missing id/label/note: ' + JSON.stringify(c));

const OSS = new Set(['yes', 'partial', 'no']);
if (!Array.isArray(V) || V.length < 1) bad('VENDORS is empty');
const seen = new Set();
for (const v of V || []) {
  const id = (v.cat || '?') + '/' + (v.name || '?');
  if (!v.name) bad('vendor missing name');
  if (!catIds.has(v.cat)) bad(`${id}: unknown category "${v.cat}"`);
  for (const f of ['best', 'gap', 'pricing', 'frameworks']) if (!v[f]) bad(`${id}: missing ${f}`);
  if (!OSS.has(v.oss)) bad(`${id}: oss must be yes|partial|no (got "${v.oss}")`);
  if (!Array.isArray(v.tags) || !v.tags.length) bad(`${id}: tags must be a non-empty array`);
  if (seen.has(id)) bad('duplicate vendor: ' + id);
  seen.add(id);
}
if (!fail) good(`${(V || []).length} vendors valid across ${(C || []).length} categories`);

// ── 2. HTML sanity + local-link integrity ─────────────────────────────────
console.log('\n  [HTML pages]');
const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))
  .concat(fs.existsSync(path.join(ROOT, 'docs'))
    ? fs.readdirSync(path.join(ROOT, 'docs')).filter(f => f.endsWith('.html')).map(f => 'docs/' + f) : []);
for (const rel of pages) {
  const file = path.join(ROOT, rel);
  const html = fs.readFileSync(file, 'utf8');
  if (!/<html[^>]*\blang=/.test(html)) bad(`${rel}: missing <html lang>`);
  if (!/<title>[^<]+<\/title>/.test(html)) bad(`${rel}: missing <title>`);
  if (!/rel="canonical"/.test(html)) bad(`${rel}: missing canonical link`);
  // local link/src targets must exist on disk
  for (const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|data:|tel:)/.test(u)) continue;
    const target = path.normalize(path.join(path.dirname(file), u.replace(/[?].*$/, '')));
    if (!fs.existsSync(target)) bad(`${rel}: broken local link → ${u}`);
  }
}
if (!fail) good(`${pages.length} pages: lang/title/canonical present, all local links resolve`);

console.log(`\n  ${fail ? '❌ ' + fail + ' issue(s)' : '✅ site integrity OK'}\n`);
process.exit(fail ? 1 : 0);
