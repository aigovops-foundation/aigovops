#!/usr/bin/env node
// The trunk's test gate.
//
// This used to be a bare `node --test`, which discovers every test-shaped file
// in the whole tree. That was right while the trunk held only its own code. If
// independent product tests are added here, they may require dependencies the
// trunk does not install. Bare discovery would run them and the gate would go
// red for a reason that has nothing to do with the trunk.
//
// So the gate is scoped to what the trunk actually owns and can install: the
// npm workspaces declared in package.json. The workspace list stays the single
// source of truth — add a workspace and it is covered automatically; nothing
// here needs editing.
//
// Products are NOT covered by this gate. Each canonical repository owns its
// product's CI and dependencies — see products/README.md.
//
// Why an explicit file list rather than passing directories or a glob: Node 20
// (what CI pins) treats a directory argument as a search root, Node 22 treats it
// as a module to execute, and glob arguments need Node 21+. An explicit list of
// files behaves identically on every version.

import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, dirname, basename, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SKIP_DIRS = new Set(["node_modules", ".git"]);

// Node's own default test-file patterns, kept in step so that scoping the gate
// narrows WHERE it looks without changing WHAT it counts as a test.
const TEST_FILE = /^(test|.+[.\-_]test)\.[cm]?js$|^test-.+\.[cm]?js$/;
const RUNNABLE = /\.[cm]?js$/;

function workspaceRoots() {
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const globs = pkg.workspaces ?? [];
  if (globs.length === 0) throw new Error("package.json declares no workspaces — the gate has nothing to cover");
  return globs;
}

async function expand(glob) {
  if (!glob.includes("*")) return [glob];
  const [prefix, rest] = [glob.slice(0, glob.indexOf("*")), glob.slice(glob.indexOf("*"))];
  if (rest !== "*") throw new Error(`unsupported workspace glob: ${glob} (only a trailing /* is handled)`);
  const base = prefix.replace(/\/$/, "");
  const entries = await readdir(join(ROOT, base), { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && !SKIP_DIRS.has(e.name)).map((e) => `${base}/${e.name}`);
}

async function walk(dir, inTestDir, found) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // a declared workspace that is not on disk is caught by the empty check below
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      await walk(full, inTestDir || e.name === "test", found);
    } else if (e.isFile()) {
      const match = inTestDir ? RUNNABLE.test(e.name) : TEST_FILE.test(basename(e.name));
      if (match) found.push(relative(ROOT, full));
    }
  }
}

const roots = [];
for (const glob of workspaceRoots()) roots.push(...(await expand(glob)));

const files = [];
for (const root of roots) await walk(join(ROOT, root), false, files);
files.sort();

// A gate that finds nothing must fail, not pass. Silence is not success.
if (files.length === 0) {
  console.error(`no test files found under: ${roots.join(", ")}`);
  console.error("either the workspaces moved or the gate is broken — refusing to report green");
  process.exit(1);
}

console.log(`# gate: ${files.length} test file(s) across ${roots.length} workspace(s)`);
const run = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit", cwd: ROOT });
process.exit(run.status ?? 1);
