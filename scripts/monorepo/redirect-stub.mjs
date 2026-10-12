#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function mapUrl(fromBase, toBase, href) {
  try {
    const from = new URL(fromBase);
    const to = new URL(toBase);
    const current = new URL(href);
    if (
      from.origin !== current.origin ||
      from.search ||
      from.hash ||
      to.search ||
      to.hash
    ) {
      return null;
    }

    const fromPath = from.pathname.endsWith("/") ? from.pathname : `${from.pathname}/`;
    const fromRoot = fromPath === "/" ? "/" : fromPath.slice(0, -1);
    let subPath;
    if (current.pathname === fromRoot || current.pathname === fromPath) subPath = "";
    else if (current.pathname.startsWith(fromPath)) subPath = current.pathname.slice(fromPath.length);
    else return null;

    const toPath = to.pathname.endsWith("/") ? to.pathname : `${to.pathname}/`;
    const mapped = new URL(to.href);
    mapped.pathname = `${toPath}${subPath}`;
    mapped.search = current.search;
    mapped.hash = current.hash;
    return mapped.href;
  } catch {
    return null;
  }
}

function htmlEscape(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function scriptString(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function validateBase(value, name) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.search || url.hash) {
    throw new Error(`--${name} must be an HTTP(S) base URL without query or fragment`);
  }
  return url.href;
}

export function renderStub(fromBase, toBase) {
  const from = validateBase(fromBase, "from");
  const to = validateBase(toBase, "to");
  const inlineMapUrl = `const mapUrl = (${mapUrl.toString()});`;
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="canonical" href="${htmlEscape(to)}">
  <title>Page moved</title>
</head>
<body>
  <p>This page has moved. <a href="${htmlEscape(to)}">Continue to the new site</a>.</p>
  <script>
    ${inlineMapUrl}
    const mapped = mapUrl(${scriptString(from)}, ${scriptString(to)}, window.location.href);
    if (mapped) window.location.replace(mapped);
  </script>
</body>
</html>
`;
  return html;
}

export async function writeStub(fromBase, toBase, out) {
  const directory = resolve(out);
  const html = renderStub(fromBase, toBase);
  await mkdir(directory, { recursive: true });
  await Promise.all([
    writeFile(resolve(directory, "index.html"), html),
    writeFile(resolve(directory, "404.html"), html),
  ]);
}

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const key = args[index];
    if (!["--from", "--to", "--out"].includes(key) || options[key]) {
      throw new Error(`unexpected or duplicate argument: ${key}`);
    }
    const value = args[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`missing value for ${key}`);
    options[key] = value;
    index += 1;
  }
  for (const key of ["--from", "--to", "--out"]) {
    if (!options[key]) throw new Error(`required argument: ${key}`);
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  await writeStub(options["--from"], options["--to"], options["--out"]);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`redirect-stub: ${error.message}`);
    process.exitCode = 1;
  });
}
