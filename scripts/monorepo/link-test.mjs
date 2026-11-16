#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mapUrl } from "./redirect-stub.mjs";

const TIMEOUT_MS = 20_000;
const RETRIES = 2;
const CONCURRENCY = 6;

function hasAnchor(html, anchor) {
  const markup = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, "");
  for (const tag of markup.matchAll(/<[a-z][^>]*>/gi)) {
    const attributes = tag[0].slice(1).matchAll(
      /(?:^|\s)([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g,
    );
    for (const attribute of attributes) {
      const name = attribute[1].toLowerCase();
      const value = attribute[2] ?? attribute[3] ?? attribute[4];
      if ((name === "id" || name === "name") && value === anchor) return true;
    }
  }
  return false;
}

function redirectBases(html) {
  const values = new Map();
  for (const meta of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = new Map();
    for (const attribute of meta[0].matchAll(
      /(?:^|\s)([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g,
    )) {
      attributes.set(
        attribute[1].toLowerCase(),
        attribute[2] ?? attribute[3] ?? attribute[4],
      );
    }
    const name = attributes.get("name")?.toLowerCase();
    if (!["aigovops-redirect-from", "aigovops-redirect-to"].includes(name)) continue;
    const content = (attributes.get("content") ?? "").replace(
      /&(amp|quot|#39|lt|gt);/g,
      (entity) => ({
        "&amp;": "&",
        "&quot;": '"',
        "&#39;": "'",
        "&lt;": "<",
        "&gt;": ">",
      })[entity],
    );
    values.set(name, content);
  }
  const from = values.get("aigovops-redirect-from");
  const to = values.get("aigovops-redirect-to");
  return from && to ? { from, to } : null;
}

async function check(entry) {
  let result;
  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    let viaStub = false;
    let mappedUrl = null;
    try {
      let response = await fetch(entry.url, {
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      let html = await response.text();
      if ([200, 404].includes(response.status)) {
        const bases = redirectBases(html);
        const mapped = bases && mapUrl(bases.from, bases.to, response.url);
        if (mapped) {
          const destination = new URL(mapped);
          destination.hash = new URL(entry.url).hash;
          mappedUrl = destination.href;
          viaStub = true;
          response = await fetch(mappedUrl, {
            redirect: "follow",
            signal: AbortSignal.timeout(TIMEOUT_MS),
          });
          html = await response.text();
        }
      }
      const anchorFound = !entry.anchor || hasAnchor(html, entry.anchor);
      const finalUrl = mappedUrl ?? response.url;
      const prefixMatches = !entry.expectFinalPrefix || finalUrl.startsWith(entry.expectFinalPrefix);
      const passed = response.status === 200 && anchorFound && prefixMatches;
      result = {
        entry,
        status: response.status,
        finalUrl,
        anchorFound,
        prefixMatches,
        passed,
        viaStub,
        attempts: attempt + 1,
        error: "",
      };
      if (passed || attempt === RETRIES) return result;
    } catch (error) {
      result = {
        entry,
        status: "ERR",
        finalUrl: entry.url,
        anchorFound: !entry.anchor,
        prefixMatches: !entry.expectFinalPrefix,
        passed: false,
        viaStub,
        attempts: attempt + 1,
        error: error.message,
      };
      if (attempt === RETRIES) return result;
    }
  }
  return result;
}

async function runChecks(entries) {
  const results = new Array(entries.length);
  for (let offset = 0; offset < entries.length; offset += CONCURRENCY) {
    const batch = entries.slice(offset, offset + CONCURRENCY);
    results.splice(offset, batch.length, ...(await Promise.all(batch.map(check))));
  }
  return results;
}

function printTable(results) {
  console.log("RESULT\tHTTP\tATTEMPTS\tVIA\tANCHOR\tURL\tFINAL URL");
  for (const result of results) {
    console.log([
      result.passed ? "PASS" : "FAIL",
      result.status,
      result.attempts,
      result.viaStub ? "via stub" : "",
      result.entry.anchor ?? "",
      result.entry.url,
      result.finalUrl,
    ].join("\t"));
    if (result.error) console.log(`  error: ${result.error}`);
    else if (!result.anchorFound) console.log(`  missing anchor: ${result.entry.anchor}`);
    else if (!result.prefixMatches) {
      console.log(`  expected final prefix: ${result.entry.expectFinalPrefix}`);
    }
  }
  const failed = results.filter((result) => !result.passed).length;
  console.log(`${results.length} URLs checked: ${results.length - failed} passed, ${failed} failed`);
  return failed;
}

export { check, hasAnchor, printTable, runChecks };

export function parseArgs(args) {
  if (args.length === 0) return false;
  if (args.length === 1 && args[0] === "--cutover") return true;
  throw new Error("usage: node scripts/monorepo/link-test.mjs [--cutover]");
}

export async function loadEntries(cutover = false) {
  const name = cutover ? "estate-urls.cutover.json" : "estate-urls.json";
  const entries = JSON.parse(await readFile(new URL(`./${name}`, import.meta.url), "utf8"));
  if (!Array.isArray(entries)) throw new Error(`${name} must be an array`);
  return entries;
}

if (
  !process.env.NODE_TEST_CONTEXT &&
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  try {
    const cutover = parseArgs(process.argv.slice(2));
    const entries = await loadEntries(cutover);
    const failed = printTable(await runChecks(entries));
    if (failed) process.exitCode = 1;
  } catch (error) {
    console.error(`link-test: ${error.message}`);
    process.exitCode = 1;
  }
}
