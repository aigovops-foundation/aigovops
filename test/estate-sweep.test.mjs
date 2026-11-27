import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateAutomerge, publicView, renderDigest, runSweep, tokenFor } from "../scripts/estate-sweep.mjs";

const config = { automergeLabel: "automerge", holdLabels: ["hold", "do-not-merge", "blocked"], maxMergesPerRun: 10,
  staleDays: 30, mergeMethod: { default: "squash" }, repos: ["acme/site"] };

function ready(overrides = {}) {
  return {
    pr: { state: "open", draft: false, title: "fix: link", base: { ref: "main" }, mergeable_state: "clean",
      labels: [{ name: "automerge" }] },
    defaultBranch: "main",
    checkRuns: [{ name: "ci", status: "completed", conclusion: "success", started_at: "2026-11-26T10:00:00Z" }],
    statuses: [],
    reviews: [],
    labelEvents: [{ event: "labeled", label: { name: "automerge" }, actor: { login: "bob", type: "User" },
      created_at: "2026-11-26T11:00:00Z" }],
    permissions: { bob: "admin" },
    config,
    ...overrides,
  };
}

test("a clean, green PR labelled by a writer after its checks started is eligible", () => {
  assert.deepEqual(evaluateAutomerge(ready()), { eligible: true, reasons: [] });
});

test("no label means no merge, whatever else holds", () => {
  const r = evaluateAutomerge(ready({ pr: { ...ready().pr, labels: [] } }));
  assert.equal(r.eligible, false);
});

for (const [name, overrides, reason] of [
  ["draft", { pr: { ...ready().pr, draft: true } }, /draft/],
  ["hold label", { pr: { ...ready().pr, labels: [{ name: "automerge" }, { name: "hold" }] } }, /hold label/],
  ["HOLD title", { pr: { ...ready().pr, title: "HOLD for Bob: skip list" } }, /HOLD/],
  ["not the default branch", { pr: { ...ready().pr, base: { ref: "release" } } }, /targets release/],
  ["behind or blocked", { pr: { ...ready().pr, mergeable_state: "blocked" } }, /merge state is blocked/],
  ["a red check", { checkRuns: [{ name: "ci", status: "completed", conclusion: "failure", started_at: "2026-11-26T10:00:00Z" }] }, /not green: ci/],
  ["a running check", { checkRuns: [{ name: "ci", status: "in_progress", started_at: "2026-11-26T10:00:00Z" }] }, /still running/],
  ["no checks at all", { checkRuns: [] }, /no checks ran/],
  ["a failing commit status", { statuses: [{ context: "deploy", state: "failure", created_at: "2026-11-26T10:00:00Z" }] }, /not green: deploy/],
  ["changes requested", { reviews: [{ user: { login: "ken" }, state: "CHANGES_REQUESTED" }] }, /changes requested by ken/],
  ["label by a non-writer", { permissions: { bob: "read" } }, /lacks write access/],
  ["label by a bot", { labelEvents: [{ event: "labeled", label: { name: "automerge" }, actor: { login: "x[bot]", type: "Bot" }, created_at: "2026-11-26T11:00:00Z" }] }, /bot/],
  ["label before the latest push", { labelEvents: [{ event: "labeled", label: { name: "automerge" }, actor: { login: "bob", type: "User" }, created_at: "2026-11-26T09:00:00Z" }] }, /re-add it/],
  ["label actor unknown", { labelEvents: [] }, /cannot see who/],
]) {
  test(`refuses: ${name}`, () => {
    const r = evaluateAutomerge(ready(overrides));
    assert.equal(r.eligible, false);
    assert.match(r.reasons.join("; "), reason);
  });
}

test("a CI rerun after the label does not invalidate it; the check suite keeps the push time", () => {
  const r = evaluateAutomerge(ready({
    suites: [{ created_at: "2026-11-26T10:00:00Z" }],
    checkRuns: [{ name: "ci", status: "completed", conclusion: "success", started_at: "2026-11-26T12:00:00Z" }],
  }));
  assert.deepEqual(r, { eligible: true, reasons: [] });
});

test("a force-push after the label invalidates it, even onto an older green commit", () => {
  const r = evaluateAutomerge(ready({
    suites: [{ created_at: "2026-11-26T08:00:00Z" }],
    labelEvents: [...ready().labelEvents, { event: "head_ref_force_pushed", created_at: "2026-11-26T11:30:00Z" }],
  }));
  assert.match(r.reasons.join("; "), /re-add it/);
});

test("anything the token cannot read blocks the merge", () => {
  const r = evaluateAutomerge(ready({ unreadable: ["reviews (HTTP 403)"] }));
  assert.equal(r.eligible, false);
  assert.match(r.reasons.join("; "), /cannot read reviews/);
});

test("a later approval clears an earlier change request; a stale status is superseded", () => {
  const r = evaluateAutomerge(ready({
    reviews: [{ user: { login: "ken" }, state: "CHANGES_REQUESTED" }, { user: { login: "ken" }, state: "APPROVED" }],
    statuses: [{ context: "d", state: "failure", created_at: "2026-11-26T10:00:00Z" },
      { context: "d", state: "success", created_at: "2026-11-26T10:30:00Z" }],
  }));
  assert.deepEqual(r, { eligible: true, reasons: [] });
});

test("per-owner tokens win over the shared one", () => {
  const env = { ESTATE_TOKEN_BOBRAPP: "b", ESTATE_SWEEP_TOKEN: "s", GITHUB_TOKEN: "g" };
  assert.equal(tokenFor("bobrapp", env), "b");
  assert.equal(tokenFor("aigovops-foundation", env), "s");
  assert.equal(tokenFor("x", { GITHUB_TOKEN: "g" }), "g");
});

function fakeGitHub(routes) {
  const calls = [];
  const gh = async (method, path, body) => {
    calls.push({ method, path, body });
    const key = `${method} ${path.split("?")[0]}`;
    return routes[key] ?? { status: 404, data: { message: "Not Found" } };
  };
  return { gh, calls };
}

const NOW = Date.parse("2026-11-26T12:00:00Z");
const listed = { number: 7, title: "docs: fix", html_url: "https://github.com/acme/site/pull/7", draft: false,
  user: { login: "devin" }, labels: [{ name: "automerge" }], created_at: "2026-11-25T00:00:00Z",
  updated_at: "2026-11-26T00:00:00Z", head: { sha: "abc" } };
const base = {
  "GET /repos/acme/site": { status: 200, data: { default_branch: "main", archived: false } },
  "GET /repos/acme/site/actions/runs": { status: 200, data: { workflow_runs: [
    { name: "ci", status: "completed", conclusion: "success", html_url: "u1" },
    { name: "ci", status: "completed", conclusion: "failure", html_url: "older" },
    { name: "npm update", event: "dynamic", status: "completed", conclusion: "failure", html_url: "bot" }] } },
  "GET /repos/acme/site/issues": { status: 200, data: [{ labels: [{ name: "queue" }], updated_at: "2026-11-20T00:00:00Z" }] },
  "GET /repos/acme/site/pulls": { status: 200, data: [listed] },
  "GET /repos/acme/site/pulls/7": { status: 200, data: { ...ready().pr } },
  "GET /repos/acme/site/commits/abc/check-runs": { status: 200, data: { check_runs: ready().checkRuns } },
  "GET /repos/acme/site/commits/abc/statuses": { status: 200, data: [] },
  "GET /repos/acme/site/pulls/7/reviews": { status: 200, data: [] },
  "GET /repos/acme/site/issues/7/timeline": { status: 200, data: ready().labelEvents },
  "GET /repos/acme/site/commits/abc/check-suites": { status: 200, data: { check_suites: [{ created_at: "2026-11-26T10:00:00Z" }] } },
  "GET /repos/acme/site/collaborators/bob/permission": { status: 200, data: { permission: "admin" } },
  "PUT /repos/acme/site/pulls/7/merge": { status: 200, data: { merged: true, sha: "m1" } },
};

test("report-only run never calls the merge endpoint", async () => {
  const { gh, calls } = fakeGitHub(base);
  const result = await runSweep({ gh, config, now: NOW });
  assert.equal(calls.some((c) => c.method === "PUT"), false);
  assert.deepEqual(result.repos[0].ci, [{ name: "ci", conclusion: "success", url: "u1" }]);
  assert.match(result.repos[0].skipped[0].reasons[0], /merge not enabled/);
});

test("merge run merges the eligible PR pinned to its head SHA", async () => {
  const { gh, calls } = fakeGitHub(base);
  const result = await runSweep({ gh, config, now: NOW, merge: true });
  const put = calls.find((c) => c.method === "PUT");
  assert.deepEqual(put.body, { merge_method: "squash", sha: "abc" });
  assert.equal(result.repos[0].merged[0].by, "bob");
  assert.match(renderDigest(result, config), /Merged \(`automerge`\)[\s\S]*site#7/);
});

test("the merge cap stops merges once reached", async () => {
  const { gh, calls } = fakeGitHub(base);
  await runSweep({ gh, config: { ...config, maxMergesPerRun: 0 }, now: NOW, merge: true });
  assert.equal(calls.some((c) => c.method === "PUT"), false);
});

test("an unreadable repository is reported as no access, not green", async () => {
  const { gh } = fakeGitHub({});
  const result = await runSweep({ gh, config, now: NOW });
  assert.equal(result.repos[0].access, false);
  assert.match(renderDigest(result, config), /\| site \| no access \|/);
});

test("a 403 on check runs (fine-grained token, private repo) is a refusal, not 'no checks'", async () => {
  const { gh, calls } = fakeGitHub({ ...base, "GET /repos/acme/site/commits/abc/check-runs": { status: 403, data: {} } });
  const result = await runSweep({ gh, config, now: NOW, merge: true });
  assert.equal(calls.some((c) => c.method === "PUT"), false);
  assert.match(result.repos[0].skipped[0].reasons.join("; "), /cannot read check runs \(HTTP 403\)/);
});

test("private repositories leave only counts: no titles, links or names in the digest or JSON", async () => {
  const { gh } = fakeGitHub({ ...base, "GET /repos/acme/site": { status: 200, data: { default_branch: "main", private: true } } });
  const result = await runSweep({ gh, config, now: NOW, merge: true });
  const out = JSON.stringify(publicView(result)) + renderDigest(result, config);
  assert.doesNotMatch(out, /docs: fix|pull\/7|devin|"bob"|@bob/);
  assert.match(renderDigest(result, config), /\| site \| green \| 1 \(0\) \|/);
});
