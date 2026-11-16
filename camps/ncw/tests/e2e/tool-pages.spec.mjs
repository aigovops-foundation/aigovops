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
  test(`Tool page ${slug} — install guide + embedded Foundation walkthrough`, async ({ page }) => {
    const resp = await page.goto(`/tools/${slug}.html`);
    expect(resp.status(), `/tools/${slug}.html must return 200`).toBe(200);

    // The vendor's Official install guide stays — a single absolute https link, new-tab-safe.
    const guide = page.getByRole("link", { name: /official install guide/i });
    await expect(guide, `${slug}: install-guide pill must render`).toBeVisible();
    const href = await guide.getAttribute("href");
    expect(href, `${slug} guide: href must be one absolute https URL, got ${href}`)
      .toMatch(/^https:\/\/[^\s"']+$/);
    expect(href, `${slug} guide: href must not contain a second URL`)
      .not.toMatch(/https?:\/\/[^\s]*https?:\/\//);
    expect(await guide.getAttribute("target"), `${slug} guide: target`).toBe("_blank");
    expect(await guide.getAttribute("rel"), `${slug} guide: rel`).toMatch(/noopener/);

    // The walkthrough is now the self-hosted AiGovOps Foundation video (not a third-party link):
    // an embedded <video> whose source is docs/videos/tools/<slug>.mp4, plus a caption naming it.
    const video = page.locator(`video:has(source[src$="videos/tools/${slug}.mp4"])`);
    await expect(video, `${slug}: Foundation walkthrough video must be embedded`).toBeVisible();
    const caption = page.locator("p", { hasText: /AiGovOps Foundation .*guide/i }).first();
    await expect(caption, `${slug}: video caption must name the Foundation guide`).toBeVisible();
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
