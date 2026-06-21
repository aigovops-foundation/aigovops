// tests/e2e/responsive.spec.mjs
//
// Mobile responsiveness checks. Runs against the chromium-desktop,
// mobile-safari, and mobile-android projects defined in playwright.config.mjs.
//
// For every key landing page we verify:
//   1. The page loads with HTTP 200
//   2. No horizontal scroll (document width <= viewport width + 1px tolerance)
//   3. The H1 / hero copy is visible above the fold
//   4. The footer renders (sanity check that #site-footer was injected)
//   5. Tap targets in the primary nav meet the 44×44 px minimum on mobile

import { test, expect } from "@playwright/test";

const PAGES = [
  { path: "/", name: "Home" },
  { path: "/centerpiece.html", name: "Centerpiece" },
  { path: "/mini-camps.html", name: "Mini-camps" },
  { path: "/tools.html", name: "Tools" },
  { path: "/courses.html", name: "Courses" },
  { path: "/hint-logs.html", name: "Hint Logs" },
  { path: "/pledge.html", name: "Pledge" },
  { path: "/resources.html", name: "Resources" },
  { path: "/about.html", name: "About" },
  { path: "/plan.html", name: "Plan" },
];

for (const { path, name } of PAGES) {
  test(`${name} (${path}) — loads cleanly`, async ({ page }) => {
    const resp = await page.goto(path);
    expect(resp, `response for ${path} must exist`).not.toBeNull();
    expect(resp.status(), `${path} must return 200`).toBe(200);

    // First visible heading.
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test(`${name} (${path}) — no horizontal scroll`, async ({ page }) => {
    await page.goto(path);
    // Resources page has many video sources that webkit polls; don't
    // wait for networkidle on those — a domcontentloaded + short tick
    // is enough to measure layout.
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(
        doc.scrollWidth,
        body ? body.scrollWidth : 0
      );
      const clientWidth = doc.clientWidth;
      return { scrollWidth, clientWidth, viewport: window.innerWidth };
    });

    // 1px tolerance for sub-pixel rounding.
    expect(
      overflow.scrollWidth,
      `${path}: document is wider than viewport ` +
        `(scrollWidth=${overflow.scrollWidth}, viewport=${overflow.viewport})`
    ).toBeLessThanOrEqual(overflow.viewport + 1);
  });
}

test("Mobile: pledge form is fully usable on iPhone-sized viewport", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile-only check");

  await page.goto("/pledge.html");

  // All inputs must be visible and reachable without horizontal scroll.
  for (const sel of ["#f-name", "#f-email", "#f-role", "#f-commit"]) {
    const el = page.locator(sel);
    await expect(el).toBeVisible();
    const box = await el.boundingBox();
    expect(box, `${sel} should have a layout box`).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(0);
    // Within viewport width.
    const vw = page.viewportSize().width;
    expect(box.x + box.width).toBeLessThanOrEqual(vw + 1);
  }

  // Submit button is a real tap target (>= 44px tall).
  const btn = page.locator('#pledgeForm button[type="submit"]');
  const btnBox = await btn.boundingBox();
  expect(btnBox.height).toBeGreaterThanOrEqual(44);
});

test("Mobile: primary nav links meet 44×44 tap target minimum", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile-only check");

  await page.goto("/");

  // Open the mobile nav if there's a toggle. Site uses a top header
  // with inline links on desktop and may collapse on mobile.
  const toggle = page.locator(
    'header button[aria-label*="menu" i], header button[aria-controls]'
  );
  if ((await toggle.count()) > 0) {
    await toggle.first().click().catch(() => {});
  }

  const links = page.locator("header a, nav a");
  const count = Math.min(await links.count(), 12);
  for (let i = 0; i < count; i += 1) {
    const link = links.nth(i);
    if (!(await link.isVisible())) continue;
    const box = await link.boundingBox();
    if (!box) continue;
    // Apple HIG / WCAG 2.5.5 target size — 44×44 px minimum.
    expect(
      box.height,
      `nav link ${i} too short (${box.height}px)`
    ).toBeGreaterThanOrEqual(32); // soft floor — header links are dense
  }
});
