#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const URL_LIST = new URL("./estate-urls.json", import.meta.url);
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

async function check(entry) {
  let result;
  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    try {
      const response = await fetch(entry.url, {
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const html = await response.text();
      const anchorFound = !entry.anchor || hasAnchor(html, entry.anchor);
      const prefixMatches = !entry.expectFinalPrefix || response.url.startsWith(entry.expectFinalPrefix);
      const passed = response.status === 200 && anchorFound && prefixMatches;
      result = {
        entry,
        status: response.status,
        finalUrl: response.url,
        anchorFound,
        prefixMatches,
        passed,
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
  console.log("RESULT\tHTTP\tATTEMPTS\tANCHOR\tURL\tFINAL URL");
  for (const result of results) {
    console.log([
      result.passed ? "PASS" : "FAIL",
      result.status,
      result.attempts,
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

export { check, hasAnchor, runChecks };

if (
  !process.env.NODE_TEST_CONTEXT &&
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  try {
    const entries = JSON.parse(await readFile(URL_LIST, "utf8"));
    if (!Array.isArray(entries)) throw new Error("estate-urls.json must be an array");
    const failed = printTable(await runChecks(entries));
    if (failed) process.exitCode = 1;
  } catch (error) {
    console.error(`link-test: ${error.message}`);
    process.exitCode = 1;
  }
}
