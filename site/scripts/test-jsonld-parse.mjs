import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IGNORED = new Set(
  fs.readFileSync(path.join(ROOT, 'scripts', 'asset-version-excludes.txt'), 'utf8')
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean),
);

function findHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      if (IGNORED.has(entry.name)) return [];
      return findHtmlFiles(path.join(directory, entry.name));
    }
    return entry.isFile() && entry.name.endsWith('.html')
      ? [path.join(directory, entry.name)]
      : [];
  });
}

function attributeValue(attributes, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = attributes.match(
    new RegExp(`(?:^|\\s)${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
  );
  return match ? match.slice(1).find((value) => value !== undefined) ?? '' : '';
}

const htmlFiles = findHtmlFiles(ROOT);
const errors = [];
let blockCount = 0;

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const scripts = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  for (const match of source.matchAll(scripts)) {
    if (attributeValue(match[1], 'type').trim().toLowerCase() !== 'application/ld+json') continue;
    blockCount += 1;
    try {
      JSON.parse(match[2].trim());
    } catch (error) {
      errors.push(`${path.relative(ROOT, file)} block ${blockCount}: ${error.message}`);
    }
  }
}

if (blockCount === 0) errors.push('No JSON-LD blocks found');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`✅ ${blockCount} JSON-LD blocks parsed with JSON.parse across ${htmlFiles.length} HTML files`);
}
