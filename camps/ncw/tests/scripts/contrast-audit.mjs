// One-shot script: run axe on each page and print only the color-contrast
// nodes (html snippet + bg/fg colors) so we can map them to Tailwind classes.
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  "/", "/centerpiece.html", "/mini-camps.html", "/tools.html",
  "/hint-logs.html", "/pledge.html", "/resources.html",
  "/about.html", "/plan.html",
];
const BASE = "http://127.0.0.1:4173";

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.addInitScript(() => {
  const s = document.createElement("style");
  s.textContent = `*,*::before,*::after{transition:none!important;animation:none!important}.fade-in{opacity:1!important;transform:none!important}`;
  (document.head || document.documentElement).appendChild(s);
});
const seen = new Set();
for (const p of PAGES) {
  await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    document.querySelectorAll(".fade-in").forEach((el) => el.classList.add("shown"));
  });
  const res = await new AxeBuilder({ page })
    .withTags(["wcag2aa", "wcag21aa"])
    .analyze();
  const cc = res.violations.find((v) => v.id === "color-contrast");
  if (!cc) continue;
  console.log(`\n=== ${p}  (${cc.nodes.length} nodes) ===`);
  for (const n of cc.nodes.slice(0, 30)) {
    const html = n.html.replace(/\s+/g, " ").slice(0, 180);
    const msg = (n.failureSummary || "").replace(/\s+/g, " ");
    const sig = html.replace(/\d+/g, "");
    if (seen.has(sig)) continue;
    seen.add(sig);
    console.log("  HTML:", html);
    console.log("  REASON:", msg.slice(0, 240));
  }
}
await browser.close();
