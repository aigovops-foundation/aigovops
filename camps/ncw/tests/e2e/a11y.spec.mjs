// tests/e2e/a11y.spec.mjs
//
// Automated accessibility coverage via axe-core. Runs across every key
// landing page on desktop + mobile viewports (the Playwright projects).
//
// We FAIL the build on any "critical" or "serious" violations and report
// "moderate" violations as warnings (visible in the HTML report) so we
// keep the bar high without blocking unrelated PRs on cosmetic issues.

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  "/",
  "/centerpiece.html",
  "/mini-camps.html",
  "/tools.html",
  "/hint-logs.html",
  "/pledge.html",
  "/resources.html",
  "/about.html",
  "/plan.html",
];

const BLOCKING_IMPACTS = new Set(["critical", "serious"]);

for (const path of PAGES) {
  test(`Accessibility: ${path}`, async ({ page }, testInfo) => {
    // Disable all animations/transitions BEFORE navigation so the
    // page never spends time mid-transition. axe-core computes contrast
    // against the CURRENT computed opacity; a half-faded element
    // shows as light gray and false-fails the contrast check.
    await page.addInitScript(() => {
      const style = document.createElement("style");
      style.textContent = `
        *, *::before, *::after {
          transition: none !important;
          animation: none !important;
        }
        .fade-in { opacity: 1 !important; transform: none !important; }
      `;
      (document.head || document.documentElement).appendChild(style);
    });

    await page.goto(path);
    await page.waitForLoadState("domcontentloaded");
    // Belt-and-suspenders: also force-reveal any .fade-in that the
    // observer missed. Page is now fully static.
    await page.evaluate(() => {
      document
        .querySelectorAll(".fade-in")
        .forEach((el) => el.classList.add("shown"));
    });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // Color-contrast on Tailwind utility shades is noisy in CI headless
      // chrome (anti-aliasing differences). We keep it ENABLED but exclude
      // a couple of known-decorative regions if needed in future.
      .analyze();

    const blocking = results.violations.filter((v) =>
      BLOCKING_IMPACTS.has(v.impact)
    );
    const advisory = results.violations.filter(
      (v) => !BLOCKING_IMPACTS.has(v.impact)
    );

    // Attach the full axe report regardless of outcome.
    await testInfo.attach(`axe-${path.replace(/[^a-z0-9]/gi, "_") || "root"}.json`, {
      body: JSON.stringify(
        { url: path, violations: results.violations, passes: results.passes.length },
        null,
        2
      ),
      contentType: "application/json",
    });

    if (advisory.length > 0) {
      console.warn(
        `[a11y advisory] ${path}: ${advisory.length} non-blocking issues — ` +
          advisory.map((v) => v.id).join(", ")
      );
    }

    expect(
      blocking,
      blocking
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.help} ` +
            `(${v.nodes.length} node${v.nodes.length === 1 ? "" : "s"}) — ${v.helpUrl}`
        )
        .join("\n")
    ).toEqual([]);
  });
}
