#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://www.aigovops-foundation.com';
const OUTPUTS = ['llms.txt', 'llms-full.txt'];
const ENTITIES = {
  amp: '&',
  quot: '"',
  apos: "'",
  nbsp: '\u00a0',
  lt: '<',
  gt: '>',
};

function decodeEntities(value) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const hexadecimal = /^#x/i.test(entity);
      const codePoint = Number.parseInt(entity.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function plainText(value) {
  return decodeEntities(value
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function attribute(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = tag.match(new RegExp(`(?:^|\\s)${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : null;
}

function pageInfo(pathname, url = `${BASE_URL}${pathname}`) {
  const relative = pathname === '/' ? 'index.html' : decodeURIComponent(pathname.replace(/^\/+/, ''));
  const file = path.resolve(ROOT, relative);
  if (!file.startsWith(`${ROOT}${path.sep}`)) {
    throw new Error(`Page path escapes repository root: ${pathname}`);
  }
  if (!fs.existsSync(file)) {
    throw new Error(`Sitemap page does not exist: ${pathname} (${relative})`);
  }

  const html = fs.readFileSync(file, 'utf8');
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i);
  if (!titleMatch) throw new Error(`Missing <title> in ${relative}`);

  const descriptions = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map(([tag]) => tag)
    .filter(tag => (attribute(tag, 'name') ?? '').toLowerCase() === 'description');
  const description = descriptions.length ? decodeEntities(attribute(descriptions[0], 'content') ?? '').trim() : '';
  if (!description) throw new Error(`Missing meta description in ${relative}`);

  const headings = tag => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}\\s*>`, 'gi'))]
    .map(match => plainText(match[1]))
    .filter(Boolean);

  return {
    title: plainText(titleMatch[1]),
    description,
    h1: headings('h1')[0] ?? '',
    h2: headings('h2'),
    url,
  };
}

function sitemapPages() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const urls = [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)]
    .map(match => new URL(decodeEntities(match[1].trim())));
  const pages = new Map();

  for (const url of urls) {
    if (url.origin !== BASE_URL) throw new Error(`Unexpected sitemap origin: ${url.origin}`);
    const pathname = decodeURIComponent(url.pathname);
    pages.set(pathname, url.href);
  }
  return pages;
}

const sitemap = sitemapPages();
const pageCache = new Map();
function localPage(pathname) {
  if (!pageCache.has(pathname)) {
    pageCache.set(pathname, pageInfo(pathname, sitemap.get(pathname) ?? `${BASE_URL}${pathname}`));
  }
  return pageCache.get(pathname);
}

const START_PATHS = [
  '/',
  '/blog/what-is-aigovops.html',
  '/frameworks.html',
  '/open-source.html',
  '/library.html',
  '/support.html',
  '/founders.html',
  '/community.html',
];
const OPTIONAL_PATHS = ['/privacy.html', '/terms.html'];
const WRITING_PAGES = [...sitemap.keys()]
  .filter(pathname => pathname.startsWith('/blog/') && pathname.endsWith('.html'))
  .map(localPage);

const EXTERNAL_SECTIONS = [
  {
    heading: 'Standards and tools',
    lines: [
      '- OVERT (external standard): https://overt.is/',
      '- Beacon: https://aigovops-foundation.github.io/aigovops-beacon/',
      '- Umbrella: https://aigovops-foundation.github.io/umbrella-govops/',
      '- Lantern: https://aigovops-foundation.github.io/aigovops-lantern/',
      '- Vendor RFI: https://github.com/aigovops-foundation/aigovops-vendor-rfi',
      '- NCW AI Camp: https://aigovops-foundation.github.io/aigovops-ncw-ai-camp/',
    ],
  },
  {
    heading: 'Practice and community',
    lines: [
      '- Practice site: https://practice.aigovops-foundation.com/',
      '- Thursday page: https://practice.aigovops-foundation.com/docs/THURSDAY.html',
      '- Gate check: https://community.aigovops-foundation.com/gate-check.html',
      '- Community Library (members, free): https://community.aigovops-foundation.com/library/',
    ],
  },
];

function formatPage(page, full) {
  const line = `- [${page.title}](${page.url}): ${page.description}`;
  if (!full) return line;
  const outline = [
    ...(page.h1 ? [`  - H1: ${page.h1}`] : []),
    ...page.h2.map(heading => `  - H2: ${heading}`),
  ];
  return [line, ...outline].join('\n');
}

function formatPages(pages, full) {
  return pages.map(page => formatPage(page, full)).join('\n');
}

function build(full = false) {
  const lines = [
    '# AiGovOps Foundation',
    '',
    '> AiGovOps Foundation is a 501(c)(3) nonprofit that builds open-source AI governance operations — policy as code, signed evidence receipts (Beacon), and tools that conform to OVERT, the open standard for runtime trust, which the Foundation co-stewards with CHAI (Coalition for Health AI). Everything is Apache-2.0.',
    '',
    'The front door offers six actions: become a member, give, join a meeting, read the newsletter, get an audit plan, or book the founders. The Library is free for members; meetings are Thursdays at 15:00 Pacific.',
    '',
    '## Start here',
    formatPages(START_PATHS.map(localPage), full),
    '',
  ];

  for (const section of EXTERNAL_SECTIONS) {
    lines.push(`## ${section.heading}`, ...section.lines, '');
  }

  lines.push(
    '## Writing',
    formatPages(WRITING_PAGES, full),
    '- AiGovOps Substack: https://aigovops.substack.com/',
    '',
    '## Optional',
    formatPages(OPTIONAL_PATHS.map(localPage), full),
    '',
  );

  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}`;
}

const expected = new Map([
  ['llms.txt', build(false)],
  ['llms-full.txt', build(true)],
]);
const checkOnly = process.argv.slice(2).includes('--check');
const unknownArguments = process.argv.slice(2).filter(argument => argument !== '--check');
if (unknownArguments.length) {
  console.error(`Usage: node scripts/build-llms-txt.mjs [--check]`);
  process.exit(2);
}

let failed = false;
for (const output of OUTPUTS) {
  const file = path.join(ROOT, output);
  const content = expected.get(output);
  if (checkOnly) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) {
      console.error(`${output} is out of date; run node scripts/build-llms-txt.mjs`);
      failed = true;
    } else {
      console.log(`${output}: current (${Buffer.byteLength(content)} bytes)`);
    }
  } else {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Wrote ${output} (${Buffer.byteLength(content)} bytes)`);
  }
}
if (failed) process.exit(1);
