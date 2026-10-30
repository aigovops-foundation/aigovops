#!/usr/bin/env node

import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const LEDGER = join(ROOT, "ops", "receipts", "tickets.ndjson");
export const PROFILE = "aigovops-ticket.v1";
export const FIELDS = Object.freeze([
  "profile", "kind", "repo", "issue", "closedAt", "stateReason",
  "startLabel", "finalRung", "escalations", "blocked", "discovered",
  "pr", "merged", "hoursToPr", "ciConclusion", "acu", "prev",
]);

const DATA_FIELDS = FIELDS.filter((field) => !["profile", "kind", "prev"].includes(field));
const REQUIRED_FIELDS = DATA_FIELDS;
const RUNGS = new Set(["ready:lite", "ready", "ready:ultra"]);
const MAX_STRING_LENGTH = 200;
const PAGE_SIZE = 100;

export class TicketReceiptError extends Error {}

export function canonicalize(value) {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TicketReceiptError("canonical JSON cannot contain a non-finite number");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) =>
      `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  }
  throw new TicketReceiptError("canonical JSON accepts only JSON values");
}

function validateRecord(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new TicketReceiptError("receipt record must be a plain object");
  }
  for (const [key, value] of Object.entries(record)) {
    if (!FIELDS.includes(key)) throw new TicketReceiptError(`"${key}" is not in the ticket receipt allowlist`);
    if (value !== null && typeof value === "object") {
      throw new TicketReceiptError(`"${key}" is an object; ticket receipts carry scalar values only`);
    }
    if (typeof value === "string" && value.length > MAX_STRING_LENGTH) {
      throw new TicketReceiptError(`"${key}" exceeds ${MAX_STRING_LENGTH} characters`);
    }
    if (typeof value === "number" && !Number.isFinite(value)) {
      throw new TicketReceiptError(`"${key}" must be a finite number`);
    }
  }
  if (record.profile !== PROFILE || record.kind !== "ticket") {
    throw new TicketReceiptError("receipt profile or kind is invalid");
  }
  for (const key of REQUIRED_FIELDS) {
    if (!Object.hasOwn(record, key) || record[key] === undefined) {
      throw new TicketReceiptError(`"${key}" is required`);
    }
  }
  if (typeof record.repo !== "string" || !record.repo) throw new TicketReceiptError('"repo" must be a non-empty string');
  if (!Number.isInteger(record.issue) || record.issue < 1) throw new TicketReceiptError('"issue" must be a positive integer');
  if (record.closedAt !== null && typeof record.closedAt !== "string") throw new TicketReceiptError('"closedAt" must be a string or null');
  if (record.stateReason !== null && typeof record.stateReason !== "string") throw new TicketReceiptError('"stateReason" must be a string or null');
  for (const key of ["startLabel", "finalRung", "ciConclusion"]) {
    if (record[key] !== null && typeof record[key] !== "string") {
      throw new TicketReceiptError(`"${key}" must be a string or null`);
    }
  }
  if (!Number.isInteger(record.escalations) || record.escalations < 0) {
    throw new TicketReceiptError('"escalations" must be a non-negative integer');
  }
  for (const key of ["blocked", "discovered", "merged"]) {
    if (typeof record[key] !== "boolean") throw new TicketReceiptError(`"${key}" must be a boolean`);
  }
  if (record.pr !== null && (!Number.isInteger(record.pr) || record.pr < 1)) {
    throw new TicketReceiptError('"pr" must be a positive integer or null');
  }
  if (record.hoursToPr !== null && (!Number.isFinite(record.hoursToPr) || typeof record.hoursToPr !== "number")) {
    throw new TicketReceiptError('"hoursToPr" must be a finite number or null');
  }
  if (record.acu !== null) throw new TicketReceiptError('"acu" is not available and must remain null');
  if (record.prev !== null && (typeof record.prev !== "string" || !/^[0-9a-f]{64}$/.test(record.prev))) {
    throw new TicketReceiptError('"prev" must be null or a SHA-256 hash');
  }
}

export function buildTicketRecord(fields, prev = null) {
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    throw new TicketReceiptError("ticket fields must be an object");
  }
  for (const key of Object.keys(fields)) {
    if (!DATA_FIELDS.includes(key)) throw new TicketReceiptError(`"${key}" is not in the ticket receipt allowlist`);
  }
  const record = { profile: PROFILE, kind: "ticket" };
  for (const key of DATA_FIELDS) {
    if (!Object.hasOwn(fields, key)) throw new TicketReceiptError(`"${key}" is required`);
    record[key] = fields[key];
  }
  record.prev = prev;
  validateRecord(record);
  return record;
}

export const hashRecord = (record) =>
  createHash("sha256").update(canonicalize(record), "utf8").digest("hex");

export function readLedger(file = LEDGER) {
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8").split("\n").filter((line) => line.trim()).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch {
      throw new TicketReceiptError(`${file}:${index + 1} is not JSON`);
    }
  });
}

export function verifyChain(entries) {
  const problems = [];
  let previous = null;
  for (const [index, entry] of entries.entries()) {
    const label = `entry ${index + 1}`;
    if (!entry || typeof entry !== "object" || !entry.record || typeof entry.record !== "object") {
      problems.push(`${label}: no record`);
      continue;
    }
    try {
      validateRecord(entry.record);
    } catch (error) {
      problems.push(`${label}: ${error.message}`);
    }
    try {
      if (hashRecord(entry.record) !== entry.hash) problems.push(`${label}: hash does not match its record`);
    } catch (error) {
      problems.push(`${label}: ${error.message}`);
    }
    if (entry.record.prev !== previous) problems.push(`${label}: prev does not match the previous entry hash`);
    if (entry.state !== "unsigned") problems.push(`${label}: state is not unsigned`);
    previous = typeof entry.hash === "string" ? entry.hash : null;
  }
  return { valid: problems.length === 0, problems, total: entries.length };
}

export function appendTicketReceipt(fields, file = LEDGER) {
  const entries = readLedger(file);
  const current = verifyChain(entries);
  if (!current.valid) throw new TicketReceiptError(`existing chain is invalid: ${current.problems.join("; ")}`);
  const previous = entries.length ? entries[entries.length - 1].hash : null;
  const record = buildTicketRecord(fields, previous);
  const entry = { record, hash: hashRecord(record), state: "unsigned" };
  mkdirSync(dirname(file), { recursive: true });
  appendFileSync(file, `${JSON.stringify(entry)}\n`);
  return entry;
}

function labelName(value) {
  return typeof value === "string" ? value : value?.name;
}

function timestamp(value) {
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : null;
}

function repositoryCoordinates(fullName, repositoryUrl, owner, repo) {
  const parts = typeof fullName === "string" ? fullName.split("/") : [];
  if (parts.length === 2 && parts.every(Boolean)) return { owner: parts[0], repo: parts[1] };
  try {
    const url = new URL(repositoryUrl);
    const path = url.pathname.match(/^\/repos\/([^/]+)\/([^/]+)\/?$/);
    if (url.protocol === "https:" && url.hostname === "api.github.com" && path) {
      return { owner: decodeURIComponent(path[1]), repo: decodeURIComponent(path[2]) };
    }
  } catch {
    return { owner, repo };
  }
  return { owner, repo };
}

export function referencedPullRequestCandidates(timeline, owner, repo) {
  const candidates = new Map();
  for (const event of timeline) {
    if (!["cross-referenced", "referenced"].includes(event.event)) continue;
    const sources = [event.source?.issue, event.source?.pull_request, event.source];
    for (const source of sources) {
      if (source?.pull_request && Number.isInteger(source.number) && source.number > 0) {
        const coordinates = repositoryCoordinates(
          event.source?.issue?.repository?.full_name || source.repository?.full_name,
          event.source?.issue?.repository_url || source.repository_url,
          owner,
          repo,
        );
        const candidate = { ...coordinates, number: source.number };
        candidates.set(`${candidate.owner}/${candidate.repo}#${candidate.number}`, candidate);
      }
    }
  }
  return [...candidates.values()];
}

export function referencedPullRequestNumbers(timeline) {
  return [...new Set(referencedPullRequestCandidates(timeline, "", "").map(({ number }) => number))];
}

export function closesIssue(body, owner, repo, issueNumber, prOwner = owner, prRepo = repo) {
  const pattern = /\b(?:fixes|closes|resolves)\s+(?:(?<owner>[A-Za-z0-9_.-]+)\/(?<repo>[A-Za-z0-9_.-]+))?#(?<issue>\d+)\b/gi;
  for (const match of String(body || "").matchAll(pattern)) {
    if (Number(match.groups.issue) !== issueNumber) continue;
    if (match.groups.owner) {
      if (match.groups.owner.toLowerCase() !== owner.toLowerCase() ||
        match.groups.repo.toLowerCase() !== repo.toLowerCase()) continue;
    } else if (prOwner.toLowerCase() !== owner.toLowerCase() ||
      prRepo.toLowerCase() !== repo.toLowerCase()) continue;
    return true;
  }
  return false;
}

function pullRequestRepository(pull, owner, repo) {
  return repositoryCoordinates(pull._receiptRepository, null, owner, repo);
}

export function selectMergedClosingPr(pullRequests, owner, repo, issue, timeline = []) {
  const closedAt = timestamp(issue.closed_at);
  const latestReopenedAt = timeline.reduce((latest, event) => {
    if (event.event !== "reopened") return latest;
    const reopenedAt = timestamp(event.created_at);
    return reopenedAt !== null && (latest === null || reopenedAt > latest) ? reopenedAt : latest;
  }, null);
  return pullRequests.filter((pr) => {
    const prRepository = pullRequestRepository(pr, owner, repo);
    const mergedAt = timestamp(pr.merged_at);
    return mergedAt !== null &&
      (closedAt === null || mergedAt <= closedAt) &&
      (latestReopenedAt === null || mergedAt > latestReopenedAt) &&
      closesIssue(pr.body, owner, repo, issue.number, prRepository.owner, prRepository.repo);
  })
    .sort((a, b) => timestamp(b.merged_at) - timestamp(a.merged_at))[0] || null;
}

export function combinedCheckConclusion(checkRuns) {
  if (!checkRuns.length) return null;
  if (checkRuns.some((run) => run.status !== "completed")) return "pending";
  if (checkRuns.some((run) =>
    ["failure", "timed_out", "cancelled", "action_required", "startup_failure", "stale"].includes(run.conclusion)
  )) return "failure";
  if (checkRuns.some((run) => run.conclusion === "neutral")) return "neutral";
  return "success";
}

export function extractTicketFields({ owner, repo, issue, timeline, pullRequests = [], ciConclusion = null }) {
  const rungEvents = timeline
    .map((event, index) => ({ event, index, name: labelName(event.label) }))
    .filter(({ event, name }) => event.event === "labeled" && RUNGS.has(name))
    .sort((a, b) => (timestamp(a.event.created_at) ?? 0) - (timestamp(b.event.created_at) ?? 0) || a.index - b.index);
  const first = rungEvents[0] || null;
  const final = rungEvents[rungEvents.length - 1] || null;
  const startAt = first ? timestamp(first.event.created_at) : null;
  const pr = selectMergedClosingPr(pullRequests, owner, repo, issue, timeline);
  const prCreatedAt = pr ? timestamp(pr.created_at) : null;
  const hoursToPr = startAt !== null && prCreatedAt !== null
    ? Number(((prCreatedAt - startAt) / 3_600_000).toFixed(1))
    : null;
  const labels = (issue.labels || []).map(labelName);

  return {
    repo: `${owner}/${repo}`,
    issue: issue.number,
    closedAt: issue.closed_at || null,
    stateReason: issue.state_reason || null,
    startLabel: first?.name || null,
    finalRung: final?.name || null,
    escalations: rungEvents.slice(1).reduce(
      (count, current, index) => count + Number(current.name !== rungEvents[index].name),
      0,
    ),
    blocked: timeline.some((event) => event.event === "labeled" && labelName(event.label) === "blocked"),
    discovered: labels.includes("discovered"),
    pr: pr?.number ?? null,
    merged: Boolean(pr),
    hoursToPr,
    ciConclusion: pr ? ciConclusion : null,
    acu: null,
  };
}

function apiBase() {
  return (process.env.GITHUB_API_URL || "https://api.github.com").replace(/\/+$/, "");
}

async function apiGet(path) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new TicketReceiptError("GITHUB_TOKEN is required");
  const response = await fetch(`${apiBase()}${path}`, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "x-github-api-version": "2022-11-28",
    },
  });
  if (!response.ok) {
    const error = new TicketReceiptError(`GitHub API returned ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function apiList(path, field = null) {
  const output = [];
  for (let page = 1; page <= 100; page++) {
    const separator = path.includes("?") ? "&" : "?";
    const data = await apiGet(`${path}${separator}per_page=${PAGE_SIZE}&page=${page}`);
    const rows = field ? data[field] : data;
    if (!Array.isArray(rows)) throw new TicketReceiptError(`GitHub API did not return a list for ${path}`);
    output.push(...rows);
    if (rows.length < PAGE_SIZE) return output;
  }
  throw new TicketReceiptError(`GitHub API pagination limit reached for ${path}`);
}

async function readCheckRuns(sha, repository) {
  const runs = [];
  for (let page = 1; page <= 100; page++) {
    const data = await apiGet(`/repos/${repository}/commits/${sha}/check-runs?per_page=${PAGE_SIZE}&page=${page}`);
    if (!Array.isArray(data.check_runs)) throw new TicketReceiptError("GitHub checks API did not return check runs");
    runs.push(...data.check_runs);
    if (data.check_runs.length < PAGE_SIZE) return runs;
  }
  throw new TicketReceiptError("GitHub checks API pagination limit reached");
}

export async function collectPullRequests(timeline, owner, repo, issue, {
  fetchPullRequest = ({ owner: prOwner, repo: prRepo, number }) =>
    apiGet(`/repos/${prOwner}/${prRepo}/pulls/${number}`),
  logger = (status) => console.log(`skipping candidate PR (HTTP ${status})`),
} = {}) {
  const candidates = [];
  for (const candidate of referencedPullRequestCandidates(timeline, owner, repo)) {
    try {
      const pull = await fetchPullRequest(candidate);
      candidates.push({ ...pull, _receiptRepository: `${candidate.owner}/${candidate.repo}` });
    } catch (error) {
      if (error?.status === 403 || error?.status === 404) {
        logger(error.status);
        continue;
      }
      throw error;
    }
  }
  return candidates.filter((pull) => {
    const prRepository = pullRequestRepository(pull, owner, repo);
    return pull.merged_at && closesIssue(
      pull.body,
      owner,
      repo,
      issue.number,
      prRepository.owner,
      prRepository.repo,
    );
  });
}

async function main(argv) {
  const entries = readLedger();
  if (argv.includes("--verify")) {
    const result = verifyChain(entries);
    console.log(`ticket-receipt: ${result.total} receipt(s)`);
    for (const problem of result.problems) console.error(`  - ${problem}`);
    if (!result.valid) return 1;
    console.log("✓ ticket receipt chain is intact");
    return 0;
  }

  const eventPath = process.env.GITHUB_EVENT_PATH;
  const repository = process.env.GITHUB_REPOSITORY;
  if (!eventPath || !repository) throw new TicketReceiptError("GITHUB_EVENT_PATH and GITHUB_REPOSITORY are required");
  const event = JSON.parse(readFileSync(eventPath, "utf8"));
  const issuePayload = event.issue;
  if (!issuePayload || issuePayload.pull_request) {
    console.log("not an issue close event; no ticket receipt");
    return 0;
  }
  if (!(issuePayload.labels || []).some((label) => labelName(label) === "queue")) {
    console.log("issue does not carry the queue label; no ticket receipt");
    return 0;
  }

  const [owner, repo] = repository.split("/");
  if (!owner || !repo || repository.split("/").length !== 2) {
    throw new TicketReceiptError("GITHUB_REPOSITORY must be owner/repo");
  }
  const issue = await apiGet(`/repos/${owner}/${repo}/issues/${issuePayload.number}`);
  const timeline = await apiList(`/repos/${owner}/${repo}/issues/${issue.number}/timeline`);
  const pullRequests = await collectPullRequests(timeline, owner, repo, issue);
  const pr = selectMergedClosingPr(pullRequests, owner, repo, issue, timeline);
  const ciConclusion = pr?.head?.sha
    ? await readCheckRuns(pr.head.sha, pr._receiptRepository)
      .then(combinedCheckConclusion)
      .catch(() => null)
    : null;
  const fields = extractTicketFields({ owner, repo, issue, timeline, pullRequests, ciConclusion });
  const entry = appendTicketReceipt(fields);
  console.log(`appended unsigned ticket receipt for ${owner}/${repo}#${issue.number} (${entry.hash})`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2)).then((code) => process.exit(code), (error) => {
    console.error(`✗ ${error.message}`);
    process.exit(1);
  });
}
