// tests/api/sign.test.mjs
//
// Unit tests for docs/api/sign.js — the pledge submission endpoint.
// Uses Node's built-in test runner (node --test). No extra deps.
//
// We import the handler with a dynamic ESM import and drive it with
// minimal req/res mocks that mimic the Vercel/Node serverless shape.

import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const handlerUrl = pathToFileURL(
  path.resolve("docs/api/sign.js")
).href;
const { default: handler } = await import(handlerUrl);

/** Build a minimal mock res object that records what was returned. */
function mockRes() {
  const res = {
    statusCode: 0,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end() {
      return this;
    },
  };
  return res;
}

test("POST returns 200 and ok:true with a thank-you message", () => {
  const res = mockRes();
  handler(
    {
      method: "POST",
      body: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        role: "Educator",
        organization: "Wenatchee Schools",
        city: "Wenatchee",
        action: "Write a 5-sentence AI policy",
        commit: true,
      },
    },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.ok(res.body, "response body must be present");
  assert.equal(res.body.ok, true, "ok must be true on success");
  assert.match(
    String(res.body.message),
    /thank you/i,
    "message should thank the signer"
  );
});

test("GET is rejected with 405 (Method Not Allowed)", () => {
  const res = mockRes();
  handler({ method: "GET" }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.body.ok, false);
});

test("PUT is rejected with 405", () => {
  const res = mockRes();
  handler({ method: "PUT", body: {} }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.body.ok, false);
});

test("DELETE is rejected with 405", () => {
  const res = mockRes();
  handler({ method: "DELETE" }, res);
  assert.equal(res.statusCode, 405);
});

test("POST with empty body still returns 200 (graceful stub)", () => {
  // The current stub does not validate fields server-side — the
  // landing page enforces required fields client-side. We document
  // that contract here so future server-side validation is an
  // intentional change, not an accidental regression.
  const res = mockRes();
  handler({ method: "POST", body: {} }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
});

test("Response is JSON-serializable (no functions, no cycles)", () => {
  const res = mockRes();
  handler({ method: "POST", body: { name: "Test" } }, res);
  const serialized = JSON.stringify(res.body);
  assert.ok(serialized.length > 0);
  assert.doesNotThrow(() => JSON.parse(serialized));
});
