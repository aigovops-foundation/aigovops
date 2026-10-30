#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DEFAULTS = Object.freeze({
  initialWaitMs: 5 * 60 * 1000,
  retryGapMs: 20 * 1000,
  timeoutMs: 15 * 1000,
});
const MAX_PROOF_URLS = 5;
const MAX_REDIRECTS = 5;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const URL_PATTERN = /https:\/\/[^\s<>"'`]+/gi;
const ISSUE_REFERENCE = /\b(?:fixes|closes|resolves)\s+(?:(?<owner>[A-Za-z0-9_.-]+)\/(?<repo>[A-Za-z0-9_.-]+))?#(?<number>\d+)\b/gi;

export class VerifyOnMergeError extends Error {}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function durationFromEnv(value, fallback) {
  if (value === undefined || value === "") return fallback;
  const duration = Number(value);
  return Number.isFinite(duration) && duration >= 0 ? duration : fallback;
}

export function settingsFromEnv(env = process.env) {
  return {
    initialWaitMs: durationFromEnv(env.VERIFY_MERGE_INITIAL_WAIT_MS, DEFAULTS.initialWaitMs),
    retryGapMs: durationFromEnv(env.VERIFY_MERGE_RETRY_GAP_MS, DEFAULTS.retryGapMs),
    timeoutMs: durationFromEnv(env.VERIFY_MERGE_TIMEOUT_MS, DEFAULTS.timeoutMs),
  };
}

export function parseIssueReferences(body, owner, repo) {
  const references = [];
  const seen = new Set();
  for (const match of String(body || "").matchAll(ISSUE_REFERENCE)) {
    const targetOwner = match.groups.owner || owner;
    const targetRepo = match.groups.repo || repo;
    if (targetOwner.toLowerCase() !== owner.toLowerCase()) continue;
    if (targetRepo.toLowerCase() !== repo.toLowerCase()) continue;
    const number = Number(match.groups.number);
    if (!Number.isSafeInteger(number) || number < 1) continue;
    const key = `${targetOwner.toLowerCase()}/${targetRepo.toLowerCase()}#${number}`;
    if (seen.has(key)) continue;
    seen.add(key);
    references.push({ owner: targetOwner, repo: targetRepo, number });
  }
  return references;
}

export function isAllowedProofUrl(value) {
  let url;
  try {
    url = value instanceof URL ? value : new URL(String(value));
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.username || url.password) return false;
  const hostname = url.hostname.toLowerCase();
  return hostname === "aigovops-foundation.com" ||
    hostname.endsWith(".aigovops-foundation.com") ||
    hostname.endsWith(".github.io") ||
    hostname === "aigovops.org" ||
    hostname.endsWith(".aigovops.org");
}

export function extractProofUrls(issueBody) {
  const lines = String(issueBody || "").split(/\r?\n/);
  const heading = lines.findIndex((line) => /^###\s+Proof\s*$/i.test(line.trim()));
  if (heading < 0) return [];
  let end = lines.length;
  for (let index = heading + 1; index < lines.length; index++) {
    if (/^#{1,6}\s/.test(lines[index].trim())) {
      end = index;
      break;
    }
  }
  const section = lines.slice(heading + 1, end).join("\n");
  const urls = [];
  const seen = new Set();
  for (const match of section.matchAll(URL_PATTERN)) {
    let candidate = match[0];
    while (/[.,;:!?)\]]$/.test(candidate)) candidate = candidate.slice(0, -1);
    if (!candidate || !isAllowedProofUrl(candidate)) continue;
    const normalized = new URL(candidate).href;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    urls.push(normalized);
  }
  return urls;
}

async function checkUrl(url, { fetchImpl, sleep, retryGapMs, timeoutMs }) {
  let status = "network error";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      let currentUrl = url;
      let redirects = 0;
      const signal = AbortSignal.timeout(timeoutMs);
      let response;
      while (true) {
        response = await fetchImpl(currentUrl, {
          method: "GET",
          redirect: "manual",
          signal,
        });
        const location = response.headers?.get?.("location") ||
          response.headers?.location || response.headers?.Location;
        if (!REDIRECT_STATUSES.has(response.status) || !location || redirects >= MAX_REDIRECTS) {
          break;
        }
        const target = new URL(location, currentUrl);
        if (!isAllowedProofUrl(target)) {
          const hostname = target.hostname || target.host || target.protocol.replace(/:$/, "");
          return { url, ok: false, status: `redirect to disallowed host ${hostname}` };
        }
        currentUrl = target.href;
        redirects++;
      }
      status = response.status >= 200 && response.status < 300
        ? String(response.status)
        : `HTTP ${response.status}`;
      if (response.status >= 200 && response.status < 300) {
        return { url, ok: true, status };
      }
    } catch (error) {
      status = error?.name === "TimeoutError" || error?.name === "AbortError"
        ? "timeout"
        : "network error";
    }
    if (attempt < 3 && retryGapMs > 0) await sleep(retryGapMs);
  }
  return { url, ok: false, status };
}

export async function verifyOnMerge({
  payload,
  owner,
  repo,
  github,
  fetchImpl = globalThis.fetch,
  sleep = wait,
  logger = console.log,
  initialWaitMs = DEFAULTS.initialWaitMs,
  retryGapMs = DEFAULTS.retryGapMs,
  timeoutMs = DEFAULTS.timeoutMs,
}) {
  if (payload?.pull_request?.merged !== true) {
    logger("pull request was not merged; verification skipped");
    return { issues: 0, urls: 0 };
  }
  const references = parseIssueReferences(payload.pull_request.body, owner, repo);
  let waited = false;
  let checkedIssues = 0;
  const issuesWithProof = [];

  for (const reference of references) {
    const issue = await github.getIssue(reference);
    const urls = extractProofUrls(issue.body);
    if (urls.length === 0) {
      logger(`no allowed Proof URLs on ${reference.owner}/${reference.repo}#${reference.number}`);
      continue;
    }
    issuesWithProof.push({ reference, urls, urlsToCheck: [] });
  }

  let checkedUrls = 0;
  for (let urlIndex = 0; checkedUrls < MAX_PROOF_URLS; urlIndex++) {
    let allocated = false;
    for (const issue of issuesWithProof) {
      const url = issue.urls[urlIndex];
      if (url === undefined) continue;
      issue.urlsToCheck.push(url);
      checkedUrls++;
      allocated = true;
      if (checkedUrls === MAX_PROOF_URLS) break;
    }
    if (!allocated) break;
  }

  for (const { reference, urls, urlsToCheck } of issuesWithProof) {
    const checked = new Set(urlsToCheck);
    for (const url of urls) {
      if (!checked.has(url)) logger(`${url} not checked (cap)`);
    }
    if (urlsToCheck.length === 0) continue;
    if (!waited) {
      waited = true;
      if (initialWaitMs > 0) {
        logger(`waiting ${initialWaitMs}ms for Pages to deploy`);
        await sleep(initialWaitMs);
      }
    }
    checkedIssues++;
    const results = [];
    for (const url of urlsToCheck) {
      results.push(await checkUrl(url, { fetchImpl, sleep, retryGapMs, timeoutMs }));
    }
    const failed = results.filter((result) => !result.ok);
    if (failed.length === 0) {
      await github.createComment(
        reference,
        `Verify on merge: ${urlsToCheck.length}/${urlsToCheck.length} Proof URLs answer 2xx`,
      );
      continue;
    }

    await github.reopenIssue(reference);
    await github.addLabel(reference, "blocked");
    const failures = failed.map((result) => `- ${result.url} — ${result.status}`).join("\n");
    await github.createComment(reference, `Verify on merge: Proof URL check failed\n\n${failures}`);
  }
  return { issues: checkedIssues, urls: checkedUrls };
}

function apiBase() {
  return (process.env.GITHUB_API_URL || "https://api.github.com").replace(/\/+$/, "");
}

function githubClient(token) {
  async function request(method, path, body) {
    const response = await fetch(`${apiBase()}${path}`, {
      method,
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "x-github-api-version": "2022-11-28",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!response.ok) {
      const error = new VerifyOnMergeError(`GitHub API ${method} returned ${response.status}`);
      error.status = response.status;
      throw error;
    }
    if (response.status === 204) return null;
    return response.json();
  }

  return {
    getIssue: ({ owner, repo, number }) =>
      request("GET", `/repos/${owner}/${repo}/issues/${number}`),
    async reopenIssue({ owner, repo, number }) {
      await request("PATCH", `/repos/${owner}/${repo}/issues/${number}`, { state: "open" });
    },
    async addLabel({ owner, repo, number }, label) {
      try {
        await request("GET", `/repos/${owner}/${repo}/labels/${encodeURIComponent(label)}`);
      } catch (error) {
        if (error.status !== 404) throw error;
        await request("POST", `/repos/${owner}/${repo}/labels`, {
          name: label,
          color: "d73a4a",
          description: "Proof URL did not answer after merge verification",
        });
      }
      await request("POST", `/repos/${owner}/${repo}/issues/${number}/labels`, { labels: [label] });
    },
    async createComment({ owner, repo, number }, body) {
      await request("POST", `/repos/${owner}/${repo}/issues/${number}/comments`, { body });
    },
  };
}

async function main() {
  const repository = process.env.GITHUB_REPOSITORY;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const token = process.env.GITHUB_TOKEN;
  if (!repository || !eventPath || !token) {
    throw new VerifyOnMergeError("GITHUB_REPOSITORY, GITHUB_EVENT_PATH, and GITHUB_TOKEN are required");
  }
  const [owner, repo] = repository.split("/");
  if (!owner || !repo || repository.split("/").length !== 2) {
    throw new VerifyOnMergeError("GITHUB_REPOSITORY must be owner/repo");
  }
  const payload = JSON.parse(readFileSync(eventPath, "utf8"));
  const result = await verifyOnMerge({
    payload,
    owner,
    repo,
    github: githubClient(token),
    ...settingsFromEnv(),
  });
  console.log(`verify-on-merge: checked ${result.urls} Proof URL(s) across ${result.issues} issue(s)`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(`✗ ${error.message}`);
    process.exit(1);
  });
}
