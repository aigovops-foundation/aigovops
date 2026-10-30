import assert from "node:assert/strict";
import test from "node:test";

import {
  appendTicketReceipt,
  buildTicketRecord,
  combinedCheckConclusion,
  extractTicketFields,
  hashRecord,
  verifyChain,
} from "../scripts/ticket-receipt.mjs";

const issue = {
  number: 42,
  closed_at: "2026-10-29T12:00:00Z",
  state_reason: "completed",
  labels: [{ name: "queue" }, { name: "discovered" }],
};
const timeline = [
  { event: "labeled", created_at: "2026-10-29T08:00:00Z", label: { name: "ready:lite" } },
  { event: "labeled", created_at: "2026-10-29T09:00:00Z", label: { name: "ready" } },
  { event: "labeled", created_at: "2026-10-29T10:00:00Z", label: { name: "ready:ultra" } },
  { event: "labeled", created_at: "2026-10-29T11:00:00Z", label: { name: "blocked" } },
];

function closingPr(number = 91) {
  return {
    number,
    body: "Fixes aigovops-foundation/aigovops#42",
    created_at: "2026-10-29T08:30:00Z",
    merged_at: "2026-10-29T11:59:00Z",
    head: { sha: "a".repeat(40) },
  };
}

test("extracts receipt fields from issue and timeline API data", () => {
  const fields = extractTicketFields({
    owner: "aigovops-foundation",
    repo: "aigovops",
    issue,
    timeline,
    pullRequests: [closingPr()],
    ciConclusion: "success",
  });
  assert.deepEqual(fields, {
    repo: "aigovops-foundation/aigovops",
    issue: 42,
    closedAt: issue.closed_at,
    stateReason: "completed",
    startLabel: "ready:lite",
    finalRung: "ready:ultra",
    escalations: 2,
    blocked: true,
    discovered: true,
    pr: 91,
    merged: true,
    hoursToPr: 0.5,
    ciConclusion: "success",
    acu: null,
  });
});

test("counts lite to ready to ultra as two escalations", () => {
  const fields = extractTicketFields({
    owner: "aigovops-foundation",
    repo: "aigovops",
    issue,
    timeline,
    pullRequests: [closingPr()],
    ciConclusion: "success",
  });
  assert.equal(fields.escalations, 2);
});

test("the fixed field allowlist rejects extra data", () => {
  const fields = extractTicketFields({
    owner: "aigovops-foundation",
    repo: "aigovops",
    issue,
    timeline,
  });
  assert.throws(() => buildTicketRecord({ ...fields, comment: "not allowed" }), /allowlist/);
});

test("a valid chain verifies and a tampered row fails", () => {
  const fields = extractTicketFields({
    owner: "aigovops-foundation",
    repo: "aigovops",
    issue,
    timeline,
    pullRequests: [closingPr()],
    ciConclusion: "success",
  });
  const firstRecord = buildTicketRecord(fields);
  const first = { record: firstRecord, hash: hashRecord(firstRecord), state: "unsigned" };
  const secondRecord = buildTicketRecord({ ...fields, issue: 43 }, first.hash);
  const second = { record: secondRecord, hash: hashRecord(secondRecord), state: "unsigned" };
  assert.equal(verifyChain([first, second]).valid, true);
  const tampered = structuredClone(second);
  tampered.record.issue = 99;
  assert.equal(verifyChain([first, tampered]).valid, false);
});

test("an issue without a ready label records a null startLabel", () => {
  const fields = extractTicketFields({
    owner: "aigovops-foundation",
    repo: "aigovops",
    issue,
    timeline: [{ event: "labeled", label: { name: "blocked" } }],
  });
  assert.equal(fields.startLabel, null);
  assert.equal(fields.finalRung, null);
  assert.equal(fields.escalations, 0);
});

test("check runs combine into a single conclusion", () => {
  assert.equal(combinedCheckConclusion([]), null);
  assert.equal(combinedCheckConclusion([{ status: "in_progress" }]), "pending");
  assert.equal(combinedCheckConclusion([{ status: "completed", conclusion: "success" }]), "success");
  assert.equal(combinedCheckConclusion([{ status: "completed", conclusion: "failure" }]), "failure");
});

test("append verifies the previous chain before adding a receipt", async (t) => {
  const { mkdtempSync, readFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const dir = mkdtempSync(join(tmpdir(), "ticket-receipt-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const file = join(dir, "tickets.ndjson");
  const fields = extractTicketFields({
    owner: "aigovops-foundation",
    repo: "aigovops",
    issue,
    timeline,
    pullRequests: [closingPr()],
    ciConclusion: "success",
  });
  const entry = appendTicketReceipt(fields, file);
  const rows = readFileSync(file, "utf8").trim().split("\n").map((line) => JSON.parse(line));
  assert.equal(rows[0].hash, entry.hash);
  assert.equal(verifyChain(rows).valid, true);
});
