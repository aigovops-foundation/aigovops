// One-time (per expiry) session capture — the ONLY human step in the rig.
//
//   npm run capture:auth -- chatgpt claude google copilot
//
// For each tool: opens a headed browser at the login page, the HUMAN signs in
// (the rig never touches credentials — that's the estate's irreversibility
// boundary applied to logins), then presses Enter here. The browser session
// (Playwright storageState) is pushed to 1Password as a document at
// op://AiGovOps/ncw-capture-session-<tool>, where the credentials agent can
// audit it like any other secret. Local plaintext is removed unless
// --keep-local is passed (kept under .capture-sessions/, which is gitignored).
//
// op auth: works with a signed-in `op` CLI or OP_SERVICE_ACCOUNT_TOKEN in the
// shell (the service-account path is the one that works on Macs where the op
// CLI is blocked by a 1Password 7 install).

import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { TOOLS, VAULT, SESSIONS_DIR } from "./tools.mjs";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const keepLocal = process.argv.includes("--keep-local");
const skipOp = process.argv.includes("--no-op"); // local-only mode

const wanted = args.length ? args : Object.keys(TOOLS);

function op(...cmd) {
  return execFileSync("op", cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function opAvailable() {
  try {
    op("--version");
    return true;
  } catch {
    return false;
  }
}

function pushToOp(item, file) {
  // create if missing, else replace — idempotent re-auth
  try {
    op("document", "get", item, "--vault", VAULT, "--out-file", "/dev/null");
    op("document", "edit", item, file, "--vault", VAULT);
    return "updated";
  } catch {
    op("document", "create", file, "--vault", VAULT, "--title", item, "--file-name", `${item}.json`);
    return "created";
  }
}

const ask = (q) =>
  new Promise((res) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(q, (a) => { rl.close(); res(a); });
  });

if (!skipOp && !opAvailable()) {
  console.error(
    "op CLI not available. Sign in to op, set OP_SERVICE_ACCOUNT_TOKEN, or pass --no-op to keep sessions local-only."
  );
  process.exit(1);
}

fs.mkdirSync(SESSIONS_DIR, { recursive: true });

for (const key of wanted) {
  const tool = TOOLS[key];
  if (!tool) { console.error(`unknown tool: ${key}`); process.exit(1); }

  console.log(`\n=== ${tool.label} ===`);
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(tool.loginUrl);

  console.log("Sign in in the opened browser window. The rig does not touch the login form.");
  await ask("Press Enter here once you are signed in… ");

  const stateFile = path.join(SESSIONS_DIR, `${key}.json`);
  await context.storageState({ path: stateFile });
  fs.chmodSync(stateFile, 0o600);
  await browser.close();

  if (!skipOp) {
    const verb = pushToOp(tool.opItem, stateFile);
    console.log(`session ${verb} at op://${VAULT}/${tool.opItem}`);
    if (!keepLocal) { fs.unlinkSync(stateFile); console.log("local copy removed"); }
    else console.log(`local copy kept (0600): ${stateFile}`);
  } else {
    console.log(`session saved locally only (0600): ${stateFile}`);
  }
}

console.log("\nDone. Run `npm run capture:check` to verify session health.");
