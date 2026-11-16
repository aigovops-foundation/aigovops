// Automated step-by-step capture of the demo good paths.
//
//   npm run capture -- 1-1 1-4          capture specific demos
//   npm run capture -- --all            capture every demo with a recipe
//   npm run capture:check               session health only, no browser
//
// For each demo: pulls the tool's browser session from 1Password
// (op://AiGovOps/ncw-capture-session-<tool> — falls back to a local
// .capture-sessions/<tool>.json), replays the recipe headless, and writes
//   docs/assets/captures/<demo-id>/stepN-<slug>.png
//   docs/assets/captures/manifest.json   (date-stamped; the Demo Lab page
//                                         picks this up automatically)
//
// Guardrails, enforced by construction:
// - recipes contain only generate-and-screenshot steps — nothing publishes,
//   posts, sends, or records audio
// - synthetic data only (the recipes embed their own demo stand-ins)
// - session JSON exists on disk only for the lifetime of the run (0600, temp),
//   unless auth was run with --keep-local

import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { TOOLS, VAULT, SESSIONS_DIR, CAPTURES_DIR } from "./tools.mjs";
import { RECIPES, COMPOSERS } from "./recipes.mjs";

const argv = process.argv.slice(2);
const checkOnly = argv.includes("--check");
const all = argv.includes("--all");
const ids = argv.filter((a) => !a.startsWith("--"));

function op(...cmd) {
  return execFileSync("op", cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function fetchSession(toolKey) {
  const tool = TOOLS[toolKey];
  const local = path.join(SESSIONS_DIR, `${toolKey}.json`);
  if (fs.existsSync(local)) return { file: local, source: "local", temp: false };
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "ncw-cap-")), `${toolKey}.json`);
  try {
    op("document", "get", tool.opItem, "--vault", VAULT, "--out-file", tmp);
    fs.chmodSync(tmp, 0o600);
    return { file: tmp, source: `op://${VAULT}/${tool.opItem}`, temp: true };
  } catch {
    return null;
  }
}

function sessionHealth(file) {
  try {
    const state = JSON.parse(fs.readFileSync(file, "utf8"));
    const cookies = state.cookies || [];
    if (!cookies.length) return { ok: false, why: "no cookies" };
    const horizon = Date.now() / 1000 + 7 * 86400;
    const expiring = cookies.filter((c) => c.expires > 0 && c.expires < horizon).length;
    return { ok: true, cookies: cookies.length, expiringWithin7d: expiring };
  } catch (e) {
    return { ok: false, why: String(e) };
  }
}

function cleanup(sess) {
  if (sess && sess.temp) {
    try { fs.rmSync(path.dirname(sess.file), { recursive: true, force: true }); } catch {}
  }
}

// ---------- check mode: the credentials-agent probe ----------
if (checkOnly) {
  let missing = 0;
  for (const key of Object.keys(TOOLS)) {
    const sess = fetchSession(key);
    if (!sess) { console.log(`✗ ${key}: no session (run: npm run capture:auth -- ${key})`); missing++; continue; }
    const h = sessionHealth(sess.file);
    console.log(
      h.ok
        ? `✓ ${key}: ${h.cookies} cookies (${h.expiringWithin7d} expiring <7d) — ${sess.source}`
        : `✗ ${key}: unreadable (${h.why}) — ${sess.source}`
    );
    if (!h.ok) missing++;
    cleanup(sess);
  }
  process.exit(missing ? 2 : 0);
}

// ---------- capture mode ----------
const targets = all ? Object.keys(RECIPES) : ids;
if (!targets.length) {
  console.error("usage: npm run capture -- <demo-id …> | --all | --check");
  process.exit(1);
}

async function findComposer(page, toolKey) {
  for (const sel of COMPOSERS[toolKey] || []) {
    const loc = page.locator(sel).first();
    try {
      if (await loc.isVisible({ timeout: 3000 })) return loc;
    } catch {}
  }
  return null;
}

const manifestPath = path.join(CAPTURES_DIR, "manifest.json");
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};

for (const id of targets) {
  const recipe = RECIPES[id];
  if (!recipe) { console.error(`no recipe for ${id} — add one to capture/recipes.mjs`); continue; }
  const sess = fetchSession(recipe.tool);
  if (!sess) { console.error(`✗ ${id}: no session for ${recipe.tool} — run capture:auth first`); continue; }

  const outDir = path.join(CAPTURES_DIR, id);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: sess.file,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const steps = [];
  let n = 0;

  try {
    for (const step of recipe.steps) {
      if (step.goto) await page.goto(step.goto, { waitUntil: "domcontentloaded" });
      if (step.sleep) await page.waitForTimeout(step.sleep * 1000);
      if (step.type) {
        const composer = await findComposer(page, recipe.tool);
        if (!composer) throw new Error(`composer not found for ${recipe.tool} (UI drift? update COMPOSERS)`);
        await composer.click();
        try {
          await composer.fill(step.type);
        } catch {
          await page.keyboard.type(step.type, { delay: 5 });
        }
      }
      if (step.send) await page.keyboard.press("Enter");
      if (step.waitResponse) await page.waitForTimeout(step.waitResponse * 1000);
      if (step.click) await page.locator(step.click).first().click();
      if (step.shot) {
        n++;
        const file = `step${n}-${step.shot}.png`;
        await page.screenshot({ path: path.join(outDir, file) });
        steps.push({ file, caption: step.caption || step.shot });
        console.log(`  ${id} step ${n}: ${step.shot}`);
      }
    }
    manifest[id] = {
      captured: new Date().toISOString().slice(0, 10),
      track: recipe.track,
      title: recipe.title,
      steps,
    };
    console.log(`✓ ${id}: ${steps.length} steps captured`);
  } catch (e) {
    await page.screenshot({ path: path.join(outDir, "debug-failure.png") }).catch(() => {});
    console.error(`✗ ${id}: ${e.message} (debug-failure.png saved)`);
  } finally {
    await browser.close();
    cleanup(sess);
  }
}

fs.mkdirSync(CAPTURES_DIR, { recursive: true });
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`manifest written: ${manifestPath}`);
