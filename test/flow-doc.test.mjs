// queue/FLOW.md is a picture of queue/WORK.md and must not drift from it: every start label
// and every worker the page names has to be one the rulebook names.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const WORK = read("queue/WORK.md");
const FLOW = read("queue/FLOW.md");

function tableUnder(markdown, heading) {
  const lines = markdown.split("\n");
  const at = lines.findIndex((l) => l.trim() === heading);
  if (at === -1) throw new Error(`queue/WORK.md has no "${heading}" section`);
  const rows = [];
  for (const line of lines.slice(at + 1)) {
    if (line.startsWith("## ")) break;
    if (!line.startsWith("|") || /^\|[\s|:-]+\|$/.test(line)) continue;
    rows.push(line.split("|").slice(1, -1).map((c) => c.trim()));
  }
  return rows.slice(1);
}

const backticked = (cell) => [...cell.matchAll(/`([^`]+)`/g)].map((m) => m[1]);

export function rulebook(work) {
  const startLabels = new Set(tableUnder(work, "## Your rung").flatMap((r) => backticked(r[0])));
  const workerRows = tableUnder(work, "## Workers");
  return {
    startLabels,
    workerLabels: new Set(workerRows.flatMap((r) => backticked(r[0]))),
    workers: new Set(workerRows.map((r) => r[1])),
  };
}

export function namedInFlow(flow) {
  const mermaid = flow.match(/```mermaid\n([\s\S]*?)```/)?.[1] ?? "";
  return {
    startLabels: new Set([...flow.matchAll(/(?<![\w:-])ready(?::[\w-]+)?(?![\w:-])/g)].map((m) => m[0])),
    workerLabels: new Set([...flow.matchAll(/worker:[\w-]+/g)].map((m) => m[0])),
    workers: new Set([...mermaid.matchAll(/\["([^"<]+?)\s*(?:<br\/>[^"]*)?"\]:::worker/g)].map((m) => m[1].trim())),
    hasMermaid: mermaid.length > 0,
  };
}

export function drift(work, flow) {
  const rules = rulebook(work);
  const page = namedInFlow(flow);
  const problems = [];
  for (const kind of ["startLabels", "workerLabels", "workers"]) {
    for (const name of page[kind]) if (!rules[kind].has(name)) problems.push(`${kind}: ${name}`);
  }
  return problems;
}

test("queue/WORK.md's tables still parse into start labels and workers", () => {
  const rules = rulebook(WORK);
  assert.deepEqual([...rules.startLabels].sort(), ["ready", "ready:lite", "ready:ultra"]);
  assert.deepEqual([...rules.workers].sort(), ["Claude", "Devin"]);
  assert.deepEqual([...rules.workerLabels].sort(), ["worker:claude", "worker:devin"]);
});

test("queue/FLOW.md has a Mermaid diagram naming every rung and worker", () => {
  const page = namedInFlow(FLOW);
  const rules = rulebook(WORK);
  assert.ok(page.hasMermaid, "queue/FLOW.md has no ```mermaid block");
  assert.deepEqual([...page.workers].sort(), [...rules.workers].sort());
  assert.deepEqual([...page.startLabels].sort(), [...rules.startLabels].sort());
});

test("queue/FLOW.md names no start label or worker that queue/WORK.md does not", () => {
  assert.deepEqual(drift(WORK, FLOW), []);
});

test("the drift check catches an unknown start label", () => {
  const bad = FLOW.replace("- **lite**: You add `ready:lite`.", "- **lite**: You add `ready:mini`.");
  assert.notEqual(bad, FLOW);
  assert.deepEqual(drift(WORK, bad), ["startLabels: ready:mini"]);
});

test("the drift check catches an unknown worker", () => {
  const bad = FLOW.replace('claude["Claude<br/>', 'codex["Codex<br/>').replace("`ready:ultra`. Always Devin.", "`ready:ultra`. Always Devin. Or `worker:codex`.");
  assert.deepEqual(drift(WORK, bad).sort(), ["workerLabels: worker:codex", "workers: Codex"]);
});

test("queue/WORK.md and CONTRIBUTING.md each link to queue/FLOW.md exactly once", () => {
  const links = (md, target) => [...md.matchAll(/\]\(([^)]+)\)/g)].filter((m) => m[1] === target).length;
  assert.equal(links(WORK, "FLOW.md"), 1, "queue/WORK.md");
  assert.equal(links(read("CONTRIBUTING.md"), "queue/FLOW.md"), 1, "CONTRIBUTING.md");
});
