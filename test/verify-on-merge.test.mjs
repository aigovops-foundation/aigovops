import assert from "node:assert/strict";
import test from "node:test";

import {
  extractProofUrls,
  isAllowedProofUrl,
  parseIssueReferences,
  settingsFromEnv,
  verifyOnMerge,
} from "../scripts/verify-on-merge.mjs";

const owner = "aigovops-foundation";
const repo = "aigovops";
const mergedPayload = {
  pull_request: {
    merged: true,
    body: "Fixes #12; closes aigovops-foundation/aigovops#13; Resolves other-org/aigovops#14",
  },
};

function fakeGithub(body) {
  const calls = [];
  return {
    calls,
    async getIssue(reference) {
      calls.push({ type: "get", reference });
      return { number: reference.number, body, state: "closed" };
    },
    async createComment(reference, comment) {
      calls.push({ type: "comment", reference, comment });
    },
    async reopenIssue(reference) {
      calls.push({ type: "reopen", reference });
    },
    async addLabel(reference, label) {
      calls.push({ type: "label", reference, label });
    },
  };
}

test("parses closing references and keeps only same-repository issues", () => {
  assert.deepEqual(parseIssueReferences(
    "Fixes #12, closes AIGOVOPS-FOUNDATION/aigovops#13, resolves other-org/aigovops#14, closes aigovops-foundation/other#15",
    owner,
    repo,
  ), [
    { owner, repo, number: 12 },
    { owner: "AIGOVOPS-FOUNDATION", repo, number: 13 },
  ]);
});

test("allows only HTTPS URLs on approved hosts", () => {
  for (const url of [
    "https://aigovops-foundation.com",
    "https://status.aigovops-foundation.com/ready",
    "https://aigovops.github.io/path",
  ]) assert.equal(isAllowedProofUrl(url), true, url);
  for (const url of [
    "http://aigovops-foundation.com",
    "https://aigovops-foundation.com.evil.test",
    "https://github.io",
    "https://aigovops.github.io.evil.test",
    "https://user@aigovops-foundation.com",
  ]) assert.equal(isAllowedProofUrl(url), false, url);
});

test("reads the actual Proof heading, ignores other sections, and caps URLs at five", () => {
  const proof = [
    "### Outcome",
    "https://ignored.aigovops-foundation.com/",
    "### Proof",
    ...Array.from({ length: 6 }, (_, index) => `https://proof-${index}.aigovops-foundation.com/check.`),
    "### Notes",
    "https://also-ignored.aigovops-foundation.com/",
  ].join("\n");
  assert.deepEqual(extractProofUrls(proof), [
    "https://proof-0.aigovops-foundation.com/check",
    "https://proof-1.aigovops-foundation.com/check",
    "https://proof-2.aigovops-foundation.com/check",
    "https://proof-3.aigovops-foundation.com/check",
    "https://proof-4.aigovops-foundation.com/check",
  ]);
});

test("all 2xx Proof URLs get the success comment without reopening", async () => {
  const github = fakeGithub([
    "### Proof",
    "https://aigovops-foundation.com/status https://aigovops.github.io/proof",
    "### Notes",
    "Ignore this https://ignored.aigovops-foundation.com/",
  ].join("\n"));
  const requested = [];
  const sleeps = [];
  const result = await verifyOnMerge({
    payload: mergedPayload,
    owner,
    repo,
    github,
    fetchImpl: async (url) => {
      requested.push(url);
      return { status: 204 };
    },
    sleep: async (ms) => sleeps.push(ms),
    logger: () => {},
    initialWaitMs: 0,
    retryGapMs: 0,
    timeoutMs: 100,
  });
  assert.deepEqual(result, { issues: 2, urls: 4 });
  assert.deepEqual(requested, [
    "https://aigovops-foundation.com/status",
    "https://aigovops.github.io/proof",
    "https://aigovops-foundation.com/status",
    "https://aigovops.github.io/proof",
  ]);
  assert.equal(sleeps.length, 0);
  const comments = github.calls.filter((call) => call.type === "comment");
  assert.equal(comments.length, 2);
  assert.ok(comments.every((call) => call.comment === "Verify on merge: 2/2 Proof URLs answer 2xx"));
  assert.equal(github.calls.some((call) => call.type === "reopen"), false);
  assert.equal(github.calls.some((call) => call.type === "label"), false);
});

test("failed URLs are retried, reopened, blocked, and commented without page content", async () => {
  const body = "### Proof\nhttps://status.aigovops-foundation.com/fail\n### Notes\n";
  const github = fakeGithub(body);
  let requests = 0;
  const result = await verifyOnMerge({
    payload: { pull_request: { merged: true, body: "Fixes #12" } },
    owner,
    repo,
    github,
    fetchImpl: async () => {
      requests++;
      return { status: 503, body: "page secret must not be copied" };
    },
    sleep: async () => {},
    logger: () => {},
    initialWaitMs: 0,
    retryGapMs: 0,
    timeoutMs: 100,
  });
  assert.deepEqual(result, { issues: 1, urls: 1 });
  assert.equal(requests, 3);
  assert.deepEqual(github.calls.filter((call) => ["reopen", "label", "comment"].includes(call.type))
    .map((call) => call.type), ["reopen", "label", "comment"]);
  const comment = github.calls.find((call) => call.type === "comment").comment;
  assert.match(comment, /https:\/\/status\.aigovops-foundation\.com\/fail/);
  assert.match(comment, /HTTP 503/);
  assert.doesNotMatch(comment, /page secret/);
});

test("no allowed Proof URLs do not fetch or change issue state", async () => {
  const github = fakeGithub("### Proof\nhttps://not-allowed.example/path\n### Notes\n");
  let requests = 0;
  const result = await verifyOnMerge({
    payload: { pull_request: { merged: true, body: "Closes #12" } },
    owner,
    repo,
    github,
    fetchImpl: async () => {
      requests++;
      return { status: 200 };
    },
    sleep: async () => {},
    logger: () => {},
    initialWaitMs: 0,
    retryGapMs: 0,
    timeoutMs: 100,
  });
  assert.deepEqual(result, { issues: 0, urls: 0 });
  assert.equal(requests, 0);
  assert.deepEqual(github.calls.map((call) => call.type), ["get"]);
});

test("wait and retry gap can be set to zero for tests", () => {
  assert.deepEqual(settingsFromEnv({
    VERIFY_MERGE_INITIAL_WAIT_MS: "0",
    VERIFY_MERGE_RETRY_GAP_MS: "0",
    VERIFY_MERGE_TIMEOUT_MS: "100",
  }), { initialWaitMs: 0, retryGapMs: 0, timeoutMs: 100 });
});
