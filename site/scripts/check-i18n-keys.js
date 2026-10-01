#!/usr/bin/env node
// i18n key integrity — duplicate keys at any depth, and every referenced key resolving.
//
// THE BUG THIS GUARDS (#155). `window.I18N = { founders: {…}, …, founders: {…} }` is
// legal JavaScript: the parser never errors, it silently keeps the LAST block and every
// key in the first becomes unreachable. `founders` and `footer` were each declared twice
// in both strings files. Because js/i18n/i18n.js only overwrites an element's text when
// the lookup returns something truthy, English pages kept their correct static text and
// SPANISH pages silently kept the English footer, across twenty-five-plus pages, with
// nothing failing anywhere.
//
// WHY THIS IS A FILE AND NOT A `node -e "…"` IN test-i18n.sh. The review council
// (2026-09-30) found the previous inline version had a dead escape comparison: inside a
// bash double-quoted string, the eight backslashes of `'\\\\\\\\'` collapsed to four, so
// Node compared a single character against a TWO-character string. That comparison was
// unconditionally false, escaped quotes were never skipped, and one ordinary apostrophe
// in UI copy ('don\'t') would desynchronise the brace-depth walk and make the duplicate
// check report ok on a file that had duplicates. The strings files only escaped that by
// happening to use double quotes. Two escaping layers is not a thing to be careful
// about, it is a thing to remove: scripts/test-arch.sh already learned this and carries a
// comment saying so.
//
// Three fixes over the inline version, all three found by the council:
//   1. real file   — one escaping layer, so `'\\'` means a backslash.
//   2. ANY depth   — the old walk only checked depth 0, which is ~20 of ~120 keys;
//                    the same silent-drop semantics apply to every nested object.
//   3. recursive   — the old HTML scan used a non-recursive readdirSync, so all 16
//                    pages under blog/ and blog/es/ contributed nothing.
//
// Run:  node scripts/check-i18n-keys.js [repo-root]

'use strict';

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const LANGS = ['en', 'es'];
const SKIP_DIRS = new Set(['.git', 'node_modules', '.backups', '__pycache__', 'design']);

let failures = [];

// ── Every HTML page, at any depth ────────────────────────────────────────────
function htmlFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) htmlFiles(path.join(dir, entry.name), acc);
    } else if (entry.name.endsWith('.html')) {
      acc.push(path.join(dir, entry.name));
    }
  }
  return acc;
}

// ── Duplicate keys, at any nesting depth ─────────────────────────────────────
// A hand-rolled scan rather than a parse, because the input is a JS source file and the
// thing being detected is legal syntax that no parser will complain about. Tracks a
// stack of key-sets, one per open brace, so `{ a: { x:1, x:2 } }` is caught as well as
// `{ a:1, a:2 }`.
function duplicateKeys(src, label) {
  const start = src.indexOf('{');
  const end = src.lastIndexOf('}');
  if (start === -1 || end <= start) {
    failures.push(`${label}: could not find the I18N object literal`);
    return [];
  }
  const body = src.slice(start + 1, end);

  const stack = [new Map()];          // depth -> key -> first index seen
  const dupes = [];
  const keyRe = /([A-Za-z_$][\w$]*|"[^"]*"|'[^']*')\s*:/y;

  for (let i = 0; i < body.length; i++) {
    const c = body[i];

    // Comments, which the old inline walk did not handle at all — a `// footer: …`
    // line would have been read as a key and reported as a FALSE duplicate.
    if (c === '/' && body[i + 1] === '/') {
      i = body.indexOf('\n', i); if (i === -1) break; continue;
    }
    if (c === '/' && body[i + 1] === '*') {
      const close = body.indexOf('*/', i + 2);
      i = close === -1 ? body.length : close + 1; continue;
    }

    if (c === '{' || c === '[') { stack.push(new Map()); continue; }
    if (c === '}' || c === ']') { if (stack.length > 1) stack.pop(); continue; }

    // String literals, with escapes ACTUALLY skipped. This single backslash is the
    // whole reason this file exists.
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      i++;
      while (i < body.length && body[i] !== quote) {
        if (body[i] === '\\') i++;     // skip the escaped character, whatever it is
        i++;
      }
      continue;
    }

    keyRe.lastIndex = i;
    const m = keyRe.exec(body);
    if (m && m.index === i) {
      // Not a key if it is a ternary's colon or similar; a bare identifier followed by
      // ':' inside an object literal is a key, and that is all this file parses.
      const raw = m[1];
      const key = raw.startsWith('"') || raw.startsWith("'") ? raw.slice(1, -1) : raw;
      const here = stack[stack.length - 1];
      if (here.has(key)) {
        dupes.push(`${key} (depth ${stack.length - 1}, declared twice)`);
      }
      here.set(key, i);
      i += m[0].length - 1;
    }
  }
  return dupes;
}

// ── Run ──────────────────────────────────────────────────────────────────────
const pages = htmlFiles(REPO);
const keys = new Set();
const keyOwners = new Map();          // key -> the first page that referenced it
const refRe = /data-i18n(?:-html)?="([^"]+)"/g;

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = refRe.exec(html))) {
    keys.add(m[1]);
    if (!keyOwners.has(m[1])) keyOwners.set(m[1], path.relative(REPO, file));
  }
}

const tables = {};
for (const lang of LANGS) {
  const file = path.join(REPO, 'js', 'i18n', `strings-${lang}.js`);
  const src = fs.readFileSync(file, 'utf8');

  for (const d of duplicateKeys(src, `strings-${lang}.js`)) {
    failures.push(`strings-${lang}.js: duplicate key ${d}`);
  }

  const sandbox = {};
  try {
    new Function('window', src)(sandbox);
  } catch (e) {
    failures.push(`strings-${lang}.js: does not evaluate (${e.message})`);
    continue;
  }
  tables[lang] = sandbox.I18N;
}

function resolve(table, key) {
  let val = table;
  for (const part of key.split('.')) val = val && val[part];
  return val;
}

for (const lang of LANGS) {
  if (!tables[lang]) continue;
  for (const key of keys) {
    const val = resolve(tables[lang], key);
    if (val === undefined) {
      failures.push(`${lang}: ${key} is referenced by ${keyOwners.get(key)} but not defined`);
    } else if (typeof val === 'string' && val.trim() === '') {
      // i18n.js applies a value only `if (val)`, so '' is indistinguishable from
      // missing at runtime: a Spanish visitor silently gets the English fallback.
      failures.push(`${lang}: ${key} is defined but EMPTY — i18n.js treats that as absent`);
    }
  }
}

// Key-set parity between the two tables, independent of HTML usage — the keys consumed
// programmatically (chips.*, chatbot.* in js/chat.js) appear in no data-i18n attribute
// and were invisible to every previous check.
function flatten(obj, prefix = '', acc = new Set()) {
  for (const [k, v] of Object.entries(obj || {})) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, p, acc);
    else acc.add(p);
  }
  return acc;
}
if (tables.en && tables.es) {
  const en = flatten(tables.en), es = flatten(tables.es);
  for (const k of en) if (!es.has(k)) failures.push(`es: missing ${k} (present in en)`);
  for (const k of es) if (!en.has(k)) failures.push(`en: missing ${k} (present in es)`);
}

const summary = `${pages.length} pages, ${keys.size} referenced keys, ` +
  `${tables.en ? flatten(tables.en).size : 0} keys per language`;

if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`(${summary})`);
  process.exit(1);
}
console.log(summary);
process.exit(0);
