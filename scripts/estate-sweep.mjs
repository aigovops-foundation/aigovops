#!/usr/bin/env node
// The estate sweep: one read of every estate repository (main CI, open PRs, open issues), a
// one-screen digest, and an opt-in merge of PRs a person has labelled `automerge`.
//
// Report first. The only write it can make to code is a merge, and only when ALL of these hold
// (evaluateAutomerge): the PR is open, not a draft, targets the default branch, GitHub reports it
// `clean`, every check on its head commit finished green, nobody's latest review requests
// changes, no hold label or "HOLD" title, and the `automerge` label was added by a person with
// write access AFTER GitHub first saw the head commit (its earliest check suite; reruns keep that
// time) and no force-push followed the label — so a push after labelling needs a new label. The
// merge pins that head SHA, so a race loses rather than merging unseen code. Anything the token
// cannot read (checks, reviews, timeline) blocks the merge: unknown is not green.
//
// Private repositories appear in the digest and --json as counts only: no titles, links or names.
//
// Unknown is not green: a repository the token cannot read is reported as "no access".
//
// Usage: node scripts/estate-sweep.mjs [--markdown <file|->] [--json <file> [--full]] [--post] [--merge]
// Tokens: ESTATE_TOKEN_<OWNER> (e.g. ESTATE_TOKEN_BOBRAPP), else ESTATE_SWEEP_TOKEN, else GITHUB_TOKEN.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const CONFIG_PATH = join(ROOT, "queue", "estate-repos.json");
const WRITE_PERMISSIONS = new Set(["admin", "maintain", "write"]);
const GREEN = new Set(["success", "skipped", "neutral"]);
const RED_CI = new Set(["failure", "timed_out", "startup_failure", "action_required"]);
const DAY = 24 * 60 * 60 * 1000;

export class EstateSweepError extends Error {}

export function loadConfig(path = CONFIG_PATH) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function tokenFor(owner, env = process.env) {
  const key = `ESTATE_TOKEN_${owner.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
  return env[key] || env.ESTATE_SWEEP_TOKEN || env.GITHUB_TOKEN || "";
}

export function client({ env = process.env, fetchImpl = globalThis.fetch } = {}) {
  return async function gh(method, path, body) {
    const owner = path.split("/")[2] || "";
    const token = tokenFor(owner, env);
    const res = await fetchImpl(`https://api.github.com${path}`, {
      method,
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "aigovops-estate-sweep",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = { message: text.slice(0, 200) }; }
    return { status: res.status, data };
  };
}

const labelNames = (pr) => (pr.labels || []).map((l) => (typeof l === "string" ? l : l.name));

// Decide whether one PR may be merged. Pure: every input is already fetched.
export function evaluateAutomerge({ pr, defaultBranch, checkRuns = [], statuses = [], reviews = [],
  labelEvents = [], suites = [], permissions = {}, unreadable = [], config }) {
  const reasons = [];
  const label = config.automergeLabel;
  const labels = labelNames(pr);
  if (!labels.includes(label)) return { eligible: false, reasons: [`no \`${label}\` label`] };
  if (pr.state !== "open") reasons.push("not open");
  if (pr.draft) reasons.push("draft");
  if (pr.base?.ref !== defaultBranch) reasons.push(`targets ${pr.base?.ref}, not ${defaultBranch}`);
  for (const what of unreadable) reasons.push(`cannot read ${what} with this token`);
  const hold = labels.filter((l) => config.holdLabels.includes(l));
  if (hold.length) reasons.push(`hold label: ${hold.join(", ")}`);
  if (/^\s*\[?HOLD\b/i.test(pr.title || "")) reasons.push("title says HOLD");
  if (pr.mergeable_state !== "clean") reasons.push(`GitHub merge state is ${pr.mergeable_state ?? "unknown"}`);

  const latestStatus = new Map();
  for (const s of statuses) {
    const prev = latestStatus.get(s.context);
    if (!prev || s.created_at > prev.created_at) latestStatus.set(s.context, s);
  }
  if (checkRuns.length + latestStatus.size === 0) reasons.push("no checks ran on the head commit");
  const unfinished = checkRuns.filter((c) => c.status !== "completed").map((c) => c.name);
  const red = checkRuns.filter((c) => c.status === "completed" && !GREEN.has(c.conclusion)).map((c) => c.name);
  for (const s of latestStatus.values()) {
    if (s.state === "pending") unfinished.push(s.context);
    else if (s.state !== "success") red.push(s.context);
  }
  if (unfinished.length) reasons.push(`checks still running: ${unfinished.join(", ")}`);
  if (red.length) reasons.push(`checks not green: ${red.join(", ")}`);

  const latestReview = new Map();
  for (const r of reviews) {
    if (!r.user || r.state === "COMMENTED" || r.state === "PENDING") continue;
    latestReview.set(r.user.login, r.state);
  }
  const blockers = [...latestReview].filter(([, s]) => s === "CHANGES_REQUESTED").map(([u]) => u);
  if (blockers.length) reasons.push(`changes requested by ${blockers.join(", ")}`);

  const labelled = labelEvents.filter((e) => e.event === "labeled" && e.label?.name === label).at(-1);
  if (!labelled) {
    reasons.push("cannot see who added the label");
  } else {
    const who = labelled.actor?.login;
    if (labelled.actor?.type === "Bot") reasons.push(`label added by a bot (${who})`);
    else if (!WRITE_PERMISSIONS.has(permissions[who])) reasons.push(`label added by ${who}, who lacks write access`);
    const firstSeen = (suites.length ? suites.map((x) => x.created_at)
      : [...checkRuns.map((c) => c.started_at || c.created_at), ...statuses.map((x) => x.created_at)])
      .filter(Boolean).sort()[0];
    const forcePushed = labelEvents.some((e) => e.event === "head_ref_force_pushed" && e.created_at > labelled.created_at);
    if ((firstSeen && labelled.created_at < firstSeen) || forcePushed) {
      reasons.push("new commits since the label was added: re-add it");
    }
  }
  return { eligible: reasons.length === 0, reasons };
}

function age(iso, now) {
  return Math.floor((now - Date.parse(iso)) / DAY);
}

async function sweepRepo(gh, full, config, now, { merge, mergeBudget }) {
  const out = { repo: full, access: true, ci: [], prs: [], issues: { open: 0, queue: 0, blocked: 0, stale: 0 },
    merged: [], skipped: [], errors: [] };
  const meta = await gh("GET", `/repos/${full}`);
  if (meta.status !== 200) return { ...out, access: false, errors: [`repo: HTTP ${meta.status}`] };
  out.private = Boolean(meta.data.private);
  if (meta.data.archived) return { ...out, archived: true };
  const defaultBranch = meta.data.default_branch;

  const runs = await gh("GET", `/repos/${full}/actions/runs?branch=${encodeURIComponent(defaultBranch)}&per_page=50`);
  if (runs.status === 200) {
    const seen = new Set();
    for (const r of runs.data.workflow_runs || []) {
      // Dependabot update jobs ("dynamic") report the default branch too; they are not main's CI.
      if (seen.has(r.name) || r.status !== "completed" || r.event === "dynamic") continue;
      seen.add(r.name);
      out.ci.push({ name: r.name, conclusion: r.conclusion, url: r.html_url });
    }
  } else out.errors.push(`actions: HTTP ${runs.status}`);

  const issues = await gh("GET", `/repos/${full}/issues?state=open&per_page=100`);
  if (issues.status === 200) {
    for (const i of issues.data.filter((x) => !x.pull_request)) {
      const ls = labelNames(i);
      out.issues.open += 1;
      if (ls.includes("queue")) out.issues.queue += 1;
      if (ls.includes("blocked")) out.issues.blocked += 1;
      if (age(i.updated_at, now) > 60) out.issues.stale += 1;
    }
  } else out.errors.push(`issues: HTTP ${issues.status}`);

  const pulls = await gh("GET", `/repos/${full}/pulls?state=open&per_page=100`);
  if (pulls.status !== 200) { out.errors.push(`pulls: HTTP ${pulls.status}`); return out; }
  for (const p of pulls.data) {
    const entry = { number: p.number, title: p.title, url: p.html_url, draft: p.draft, author: p.user?.login,
      labels: labelNames(p), ageDays: age(p.created_at, now), idleDays: age(p.updated_at, now) };
    out.prs.push(entry);
    if (!entry.labels.includes(config.automergeLabel)) continue;

    const [pr, checks, suites, status, reviews, events] = await Promise.all([
      gh("GET", `/repos/${full}/pulls/${p.number}`),
      gh("GET", `/repos/${full}/commits/${p.head.sha}/check-runs?per_page=100`),
      gh("GET", `/repos/${full}/commits/${p.head.sha}/check-suites?per_page=100`),
      gh("GET", `/repos/${full}/commits/${p.head.sha}/statuses?per_page=100`),
      gh("GET", `/repos/${full}/pulls/${p.number}/reviews?per_page=100`),
      gh("GET", `/repos/${full}/issues/${p.number}/timeline?per_page=100`),
    ]);
    const unreadable = [[pr, "the pull request"], [checks, "check runs"], [suites, "check suites"],
      [status, "commit statuses"], [reviews, "reviews"], [events, "the timeline"]]
      .filter(([r]) => r.status !== 200).map(([r, what]) => `${what} (HTTP ${r.status})`);
    const labelEvents = events.status === 200 ? events.data : [];
    const who = labelEvents.filter((e) => e.event === "labeled" && e.label?.name === config.automergeLabel).at(-1)?.actor?.login;
    const permissions = {};
    if (who) {
      const perm = await gh("GET", `/repos/${full}/collaborators/${encodeURIComponent(who)}/permission`);
      if (perm.status === 200) permissions[who] = perm.data.permission;
    }
    const verdict = evaluateAutomerge({ pr: pr.data || {}, defaultBranch, checkRuns: checks.data?.check_runs || [],
      statuses: status.status === 200 ? status.data : [], reviews: reviews.status === 200 ? reviews.data : [],
      labelEvents, suites: suites.status === 200 ? suites.data.check_suites || [] : [], permissions, unreadable, config });
    if (!verdict.eligible) { out.skipped.push({ ...entry, reasons: verdict.reasons }); continue; }
    if (!merge) { out.skipped.push({ ...entry, reasons: ["eligible; merge not enabled on this run"] }); continue; }
    if (mergeBudget.left <= 0) { out.skipped.push({ ...entry, reasons: ["eligible; merge cap for this run reached"] }); continue; }
    const method = config.mergeMethod?.[full] || config.mergeMethod?.default || "squash";
    const res = await gh("PUT", `/repos/${full}/pulls/${p.number}/merge`, { merge_method: method, sha: p.head.sha });
    if (res.status === 200 && res.data?.merged) {
      mergeBudget.left -= 1;
      out.merged.push({ ...entry, sha: res.data.sha, by: who, method });
    } else {
      out.skipped.push({ ...entry, reasons: [`merge refused: HTTP ${res.status} ${res.data?.message || ""}`.trim()] });
    }
  }
  return out;
}

export async function runSweep({ gh, config, now = Date.now(), merge = false }) {
  const mergeBudget = { left: config.maxMergesPerRun ?? 10 };
  const repos = [];
  for (const full of config.repos) {
    try {
      repos.push(await sweepRepo(gh, full, config, now, { merge, mergeBudget }));
    } catch (err) {
      repos.push({ repo: full, access: false, ci: [], prs: [], issues: {}, merged: [], skipped: [],
        errors: [`sweep failed: ${err.message}`] });
    }
  }
  return { generatedAt: new Date(now).toISOString(), merge, repos };
}

// A refusal reason without names, check names or API messages.
export function redactReason(r) {
  if (/who lacks write access$/.test(r)) return "label added by someone without write access";
  if (/^label added by a bot/.test(r)) return "label added by a bot";
  return r.replace(/\s*\((?!HTTP \d+\))[^)]*\)/g, "").replace(/:.*$/, "").replace(/ by .*$/, "");
}

// What may leave the machine: private repositories keep only counts and merge outcomes by number.
export function publicView(result) {
  const strip = (p) => ({ number: p.number, draft: p.draft, labels: [], ageDays: p.ageDays, idleDays: p.idleDays,
    title: "(private)", url: "", ...(p.reasons ? { reasons: p.reasons.map(redactReason) } : {}), ...(p.method ? { method: p.method, by: "(private)" } : {}) });
  return { ...result, repos: result.repos.map((r) => (r.private
    ? { ...r, ci: r.ci.map((c) => ({ ...c, name: "(private workflow)", url: "" })), prs: r.prs.map(strip),
      merged: r.merged.map(strip), skipped: r.skipped.map(strip) }
    : r)) };
}

const short = (full) => full.split("/")[1];
const link = (r, p) => (p.url ? `[${short(r)}#${p.number}](${p.url})` : `${short(r)} (private) PR`);

export function renderDigest(fullResult, config) {
  const result = publicView(fullResult);
  const day = result.generatedAt.slice(0, 10);
  const lines = [`## Estate sweep — ${day}`, ""];
  const reachable = result.repos.filter((r) => r.access && !r.archived);
  const redCi = reachable.flatMap((r) => r.ci.filter((c) => RED_CI.has(c.conclusion)).map((c) => ({ r, c })));
  const merged = reachable.flatMap((r) => r.merged.map((p) => ({ r, p })));
  const skipped = reachable.flatMap((r) => r.skipped.map((p) => ({ r, p })));
  const waiting = reachable.filter((r) => !r.private).flatMap((r) => r.prs.filter((p) => !p.draft && !p.labels.includes(config.automergeLabel))
    .map((p) => ({ r, p })));
  const stale = reachable.filter((r) => !r.private).flatMap((r) => r.prs.filter((p) => p.idleDays > (config.staleDays ?? 30)).map((p) => ({ r, p })));

  lines.push(`${reachable.length} repos read · ${redCi.length} red workflows on main · `
    + `${reachable.reduce((n, r) => n + r.prs.length, 0)} open PRs · ${merged.length} merged by \`${config.automergeLabel}\``, "");
  if (redCi.length) {
    lines.push("**Red on main**");
    for (const { r, c } of redCi) lines.push(`- ${short(r.repo)}: ${c.url ? `[${c.name}](${c.url})` : c.name} — ${c.conclusion}`);
    lines.push("");
  }
  if (merged.length) {
    lines.push(`**Merged (\`${config.automergeLabel}\`)**`);
    for (const { r, p } of merged) lines.push(`- ${link(r.repo, p)} ${p.title} — labelled by @${p.by}, ${p.method}`);
    lines.push("");
  }
  if (skipped.length) {
    lines.push(`**\`${config.automergeLabel}\` but not merged**`);
    for (const { r, p } of skipped) lines.push(`- ${link(r.repo, p)} — ${p.reasons.join("; ")}`);
    lines.push("");
  }
  if (waiting.length) {
    lines.push("**Ready PRs waiting on a person** (add `" + config.automergeLabel + "` to let the sweep merge once green)");
    for (const { r, p } of waiting.slice(0, 15)) lines.push(`- ${link(r.repo, p)} ${p.title} (${p.ageDays}d)`);
    if (waiting.length > 15) lines.push(`- …and ${waiting.length - 15} more`);
    lines.push("");
  }
  if (stale.length) {
    lines.push(`**Idle over ${config.staleDays ?? 30} days:** ` + stale.map(({ r, p }) => link(r.repo, p)).join(", "), "");
  }
  lines.push("| Repo | Main CI | Open PRs (drafts) | Issues (queue / blocked) |", "|---|---|---|---|");
  for (const r of result.repos) {
    if (!r.access) { lines.push(`| ${short(r.repo)} | no access | — | — |`); continue; }
    if (r.archived) { lines.push(`| ${short(r.repo)} | archived | — | — |`); continue; }
    const red = r.ci.filter((c) => RED_CI.has(c.conclusion)).length;
    const ci = r.ci.length === 0 ? "no runs" : red ? `${red} red of ${r.ci.length}` : "green";
    const drafts = r.prs.filter((p) => p.draft).length;
    lines.push(`| ${short(r.repo)} | ${ci} | ${r.prs.length} (${drafts}) | ${r.issues.open} (${r.issues.queue} / ${r.issues.blocked}) |`);
  }
  const errs = result.repos.filter((r) => r.errors.length);
  if (errs.length) lines.push("", "Not read: " + errs.map((r) => `${short(r.repo)} (${r.errors.join(", ")})`).join("; "));
  return lines.join("\n") + "\n";
}

export async function postDigest(gh, config, markdown) {
  const repo = config.digestRepo;
  const found = await gh("GET", `/repos/${repo}/issues?state=open&labels=${encodeURIComponent(config.digestLabel)}&per_page=100`);
  if (found.status !== 200) throw new EstateSweepError(`cannot list digest issues: HTTP ${found.status}`);
  let issue = found.data.find((i) => i.title === config.digestTitle && !i.pull_request);
  if (!issue) {
    await gh("POST", `/repos/${repo}/labels`, { name: config.digestLabel, color: "c5def5" });
    const made = await gh("POST", `/repos/${repo}/issues`, { title: config.digestTitle, labels: [config.digestLabel],
      body: "One comment per run of `scripts/estate-sweep.mjs` (`.github/workflows/estate-sweep.yml`)." });
    if (made.status !== 201) throw new EstateSweepError(`cannot create digest issue: HTTP ${made.status}`);
    issue = made.data;
  }
  const c = await gh("POST", `/repos/${repo}/issues/${issue.number}/comments`, { body: markdown });
  if (c.status !== 201) throw new EstateSweepError(`cannot comment on digest: HTTP ${c.status}`);
  return { issue: issue.number, comment: c.data.html_url };
}

function arg(argv, name) {
  const i = argv.indexOf(name);
  return i === -1 ? undefined : argv[i + 1];
}

async function main(argv) {
  const config = loadConfig();
  const gh = client();
  const result = await runSweep({ gh, config, merge: argv.includes("--merge") });
  const markdown = renderDigest(result, config);
  const jsonOut = arg(argv, "--json");
  if (jsonOut) writeFileSync(jsonOut, JSON.stringify(argv.includes("--full") ? result : publicView(result), null, 1) + "\n");
  const mdOut = arg(argv, "--markdown");
  if (mdOut && mdOut !== "-") writeFileSync(mdOut, markdown);
  if (!mdOut || mdOut === "-") process.stdout.write(markdown);
  if (argv.includes("--post")) {
    const posted = await postDigest(gh, config, markdown);
    console.error(`digest posted: ${posted.comment}`);
    if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, `digest_issue=${posted.issue}\n`, { flag: "a" });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
