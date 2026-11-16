// tests/api/pledge-anonymity.test.mjs
//
// Child-safety regression guard for the pledge (replaces the old
// tests/api/sign.test.mjs, which covered a submission endpoint that has been
// intentionally removed).
//
// The pledge is used by a general audience that INCLUDES MINORS, so it must
// collect no personal data and send nothing to any server. These static checks
// (Node's built-in test runner, no browser, no deps) fail loudly if a future
// change reintroduces PII collection or a submission endpoint.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const pledgeHtml = readFileSync(path.resolve("docs/pledge.html"), "utf8");
const pledgeJs = readFileSync(path.resolve("docs/assets/js/pledge.js"), "utf8");

test("no pledge submission endpoint is present (docs/api/sign.js removed)", () => {
  assert.equal(
    existsSync(path.resolve("docs/api/sign.js")),
    false,
    "docs/api/sign.js must not exist — the pledge collects nothing and posts nowhere"
  );
});

test("pledge.js does not POST to any server", () => {
  assert.ok(!/fetch\s*\(\s*['"`]\/api\/sign/.test(pledgeJs), "pledge.js must not POST to /api/sign");
  assert.ok(!/fetch\s*\(/.test(pledgeJs.replace(/\/\*[\s\S]*?\*\//g, "")), "pledge.js must make no network requests");
});

test("pledge.html collects no personal-data fields", () => {
  // No email input at all.
  assert.ok(!/type\s*=\s*["']email["']/i.test(pledgeHtml), "no email input allowed");
  // None of the old PII field ids/names.
  for (const id of ["f-name", "f-email", "f-role", "f-org", "f-city"]) {
    assert.ok(!pledgeHtml.includes(`id="${id}"`), `PII field #${id} must be gone`);
  }
  for (const name of ['name="name"', 'name="email"', 'name="role"', 'name="organization"', 'name="city"']) {
    assert.ok(!pledgeHtml.includes(name), `PII field ${name} must be gone`);
  }
});

test("no fabricated signer counts or seeded signer wall", () => {
  assert.ok(!/BASELINE/.test(pledgeJs), "no fabricated BASELINE count");
  assert.ok(!/SEED_SIGNERS/.test(pledgeJs), "no seeded fake signers");
  for (const id of ["signerCountHero", "signerCountForm", "signerCountWall", "signersWall"]) {
    assert.ok(!pledgeHtml.includes(id), `fabricated counter/wall #${id} must be gone`);
  }
  assert.ok(!/and counting/i.test(pledgeHtml), 'no "and counting" fake tally');
});

test("the anonymous commitment control is still present", () => {
  assert.ok(pledgeHtml.includes('id="pledgeForm"'), "the pledge form remains");
  assert.ok(pledgeHtml.includes('id="f-commit"'), "the commit checkbox remains");
  assert.ok(pledgeHtml.includes('id="successCard"'), "the success confirmation remains");
  assert.ok(/privacy\.html/.test(pledgeHtml), "links to the privacy page");
});
