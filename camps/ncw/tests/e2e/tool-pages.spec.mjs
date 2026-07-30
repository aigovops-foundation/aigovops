// tests/e2e/tool-pages.spec.mjs
//
// Coverage for docs/tools/*.html. These pages were previously invisible to
// the suite: a11y.spec.mjs and responsive.spec.mjs only enumerate top-level
// landing pages, so 16 tool pages could break without a single test failing.
//
// The pages are generated from a table of research, so the thing most likely
// to go wrong is a data problem rather than a layout problem: a "Get set up"
// row missing its buttons, a malformed href (two URLs joined into one, which
// has happened), or a link that lost its target/rel pair. Those are what we
// assert here, per page, on desktop and mobile.
//
// TOOL_PAGES is a hard-coded list on purpose. Deriving it by globbing the
// directory would let a page be silently deleted and still pass.

import { test, expect } from "@playwright/test";

const TOOL_PAGES = [
  "bolt",
  "chatgpt",
  "chatprd",
  "claude",
  "gamma",
  "gemini",
  "glean",
  "granola",
  "khanmigo",
  "lovable",
  "magic-patterns",
  "n8n",
  "notebooklm",
  "perplexity",
  "replit",
  "wispr-flow",
];

// lab-tools.html is an index page, not a tool profile, so it has no
// "Get set up" row. It still gets the structural checks below.
const ALL_PAGES = [...TOOL_PAGES, "lab-tools"];

for (const slug of TOOL_PAGES) {
  test(`Tool page ${slug} — Get set up row has both working pills`, async ({ page }) => {
    const resp = await page.goto(`/tools/${slug}.html`);
    expect(resp.status(), `/tools/${slug}.html must return 200`).toBe(200);

    const guide = page.getByRole("link", { name: /official install guide/i });
    const video = page.getByRole("link", { name: /watch the walkthrough/i });

    await expect(guide, `${slug}: install-guide pill must render`).toBeVisible();
    await expect(video, `${slug}: walkthrough pill must render`).toBeVisible();

    for (const [label, pill] of [["guide", guide], ["video", video]]) {
      const href = await pill.getAttribute("href");
      // A single absolute https URL and nothing else. This is the exact
      // shape that regressed before: two URLs joined by " · " in one href.
      expect(href, `${slug} ${label}: href must be one absolute https URL, got ${href}`)
        .toMatch(/^https:\/\/[^\s"']+$/);
      expect(href, `${slug} ${label}: href must not contain a second URL`)
        .not.toMatch(/https?:\/\/[^\s]*https?:\/\//);

      // External links open in a new tab and must not leak window.opener.
      expect(await pill.getAttribute("target"), `${slug} ${label}: target`).toBe("_blank");
      expect(await pill.getAttribute("rel"), `${slug} ${label}: rel`).toMatch(/noopener/);
    }

    // The walkthrough pill is followed by a caption naming the video and
    // its length. An empty caption means the data row lost its metadata.
    const caption = page.locator("p", { hasText: /·\s*\d+\s*min/ }).first();
    await expect(caption, `${slug}: video caption must name a duration`).toBeVisible();
  });
}

for (const slug of ALL_PAGES) {
  test(`Tool page ${slug} — renders chrome with no horizontal scroll`, async ({ page }) => {
    await page.goto(`/tools/${slug}.html`);
    await page.waitForLoadState("domcontentloaded");

    // Tool pages live in a subdirectory and rely on data-base="../" for the
    // shared chrome to resolve its links. If that attribute is dropped the
    // footer still injects but every link 404s, so assert the attribute too.
    await expect(page.locator("body")).toHaveAttribute("data-base", "../");
    await expect(page.locator("#site-footer footer")).toBeAttached();
    await expect(page.locator("h1").first()).toBeVisible();

    await page.waitForTimeout(400);
    const { scrollWidth, viewport } = await page.evaluate(() => ({
      scrollWidth: Math.max(
        document.documentElement.scrollWidth,
        document.body ? document.body.scrollWidth : 0
      ),
      viewport: window.innerWidth,
    }));
    expect(
      scrollWidth,
      `/tools/${slug}.html: document wider than viewport ` +
        `(scrollWidth=${scrollWidth}, viewport=${viewport})`
    ).toBeLessThanOrEqual(viewport + 1);
  });
}

test("Every tool page links back to the Tools index", async ({ page }) => {
  for (const slug of TOOL_PAGES) {
    await page.goto(`/tools/${slug}.html`);
    const back = page.locator('a[href="../tools.html"]').first();
    await expect(back, `${slug} must link back to ../tools.html`).toBeAttached();
  }
});
