// tests/e2e/launcher-clearance.spec.mjs
//
// Regression guard for the pledge success card vs. the floating Jeeves launcher.
//
// The launcher (.jv-btn) is NOT ours: shared.js injects it from the Foundation
// site's jeeves-widget.js, and it is shared by every AiGovOps property, so this
// repo can only design around it. It is position:fixed at right:20px/bottom:20px,
// min-height:46px, z-index 2147483000 — it permanently owns the bottom-right
// ~141x66px of the viewport and paints above the page.
//
// The bug (present since #42, when the newsletter CTA became the last thing in
// the card): with only `p-8` (32px) of padding beneath it, the CTA sat inside
// that 66px band. Scrolling to read the end of the card parked "Get the weekly
// note" under the launcher on every phone size measured — 43-87px of the target
// covered — so a thumb aiming at the CTA opened Jeeves instead. Fixed by
// reserving the launcher's footprint (`pb-20`) on phones.
//
// This test deliberately BLOCKS the real widget and injects a stand-in with the
// same geometry. Depending on a live cross-origin script from another site would
// make the gate flaky and would couple this repo's CI to the Foundation site's
// availability. If the widget's own geometry ever changes, update LAUNCHER below
// to match jeeves-widget.js.

import { test, expect } from "@playwright/test";

// Mirrors the .jv-btn rule in the Foundation site's jeeves-widget.js.
const LAUNCHER = `.jv-btn{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:flex;
  align-items:center;gap:8px;background:#2B2B28;color:#fff;border:none;border-radius:30px;
  padding:11px 16px 11px 12px;min-height:46px;opacity:.94;
  font:600 13.5px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}`;

const ACTIONS = {
  "Get the free toolkit": '#successCard a[href="resources.html"]',
  "Sign another": "#signAnother",
  "Get the weekly note": '#successCard a[href*="substack"]',
  // #46 added this below the weekly-note CTA, so it — not the newsletter
  // button — is now the bottom-most interactive element in the card.
  "Join the AiGovOps community": '#successCard a[href*="community.aigovops"]',
};

// KNOWN GAP, tracked separately — these tests cover the card scrolled to its
// end, which is the position the reserved padding governs. They do NOT cover
// the post-commit resting position that pledge.js picks with
// scrollIntoView({block:"center"}). After #46 lengthened the card to ~939px
// against a ~664px phone viewport, centring it leaves the weekly-note CTA
// under the launcher at that one position on 360x640 (33px), 375x667 (32px)
// and 390x664 (22px). The reserved padding improves every one of those but
// cannot close them, because where a centred card's middle falls depends on
// cardHeight - viewportHeight. Closing it needs a scroll-anchor decision:
// block:"end" measures clear on all six phone sizes but scrolls "Thank you
// for committing" off the top, so it is a product call, not a lint fix.

async function commitAndSettle(page) {
  // Keep the gate independent of the Foundation site being reachable.
  await page.route("**/jeeves-widget.js", (route) => route.abort());
  await page.goto("/pledge.html");
  await page.addStyleTag({ content: LAUNCHER });
  await page.evaluate(() => {
    const b = document.createElement("button");
    b.className = "jv-btn";
    b.setAttribute("aria-label", "Jeeves — ask, watch the tour, or open the map");
    b.textContent = "Ask Jeeves";
    document.body.appendChild(b);
  });

  await page.locator("#f-commit").check();
  await page.locator('#pledgeForm button[type="submit"]').click();
  await expect(page.locator("#successCard")).toBeVisible({ timeout: 7_000 });
  // custom.css sets html{scroll-behavior:smooth}; pin it so the scroll below is
  // instant and boxes are never measured mid-animation.
  await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
  await page.waitForTimeout(900); // let the card's own scrollIntoView finish
}

function intersects(a, b) {
  const x = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const y = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  return x > 0 && y > 0 ? { x: Math.round(x), y: Math.round(y) } : null;
}

test.describe("Pledge success card clears the Jeeves launcher", () => {
  test("reserves at least the launcher's height below the last action", async ({ page }) => {
    await commitAndSettle(page);
    const { padding, isPhone } = await page.evaluate(() => ({
      padding: parseFloat(getComputedStyle(document.getElementById("successCard")).paddingBottom),
      isPhone: window.innerWidth < 640,
    }));
    if (isPhone) {
      // 20px offset + 46px button = the band the launcher owns.
      expect(padding, "success card must reserve the launcher's 66px band on phones")
        .toBeGreaterThanOrEqual(66);
    } else {
      // Desktop is unchanged: the card is centred and narrow, the launcher is
      // hard right, and they never share horizontal space.
      expect(padding).toBeLessThan(66);
    }
  });

  test("no card action sits under the launcher when the card is read to the end", async ({ page }) => {
    await commitAndSettle(page);

    // The natural stopping point: scroll until the card's bottom edge meets the
    // bottom of the screen. This is where the collision used to happen.
    await page.evaluate(() => {
      const c = document.getElementById("successCard");
      const top = window.scrollY + c.getBoundingClientRect().top;
      window.scrollTo({ top: top + c.offsetHeight - window.innerHeight, behavior: "instant" });
    });
    await page.waitForTimeout(150);

    const jv = await page.locator(".jv-btn").boundingBox();
    for (const [label, sel] of Object.entries(ACTIONS)) {
      const box = await page.locator(sel).boundingBox();
      const hit = intersects(jv, box);
      expect(hit, `"${label}" must not be covered by the Jeeves launcher (overlap ${
        hit ? `${hit.x}x${hit.y}px` : "none"})`).toBeNull();
    }
  });

  test("a tap on the weekly-note CTA reaches the CTA, not the launcher", async ({ page }) => {
    await commitAndSettle(page);
    await page.evaluate(() => {
      const c = document.getElementById("successCard");
      const top = window.scrollY + c.getBoundingClientRect().top;
      window.scrollTo({ top: top + c.offsetHeight - window.innerHeight, behavior: "instant" });
    });
    await page.waitForTimeout(150);

    // Sample across the CTA, including the right-hand end nearest the launcher,
    // which is where a right-handed thumb lands and where the overlap began.
    const reached = await page.evaluate(() => {
      const cta = document.querySelector('#successCard a[href*="substack"]');
      const r = cta.getBoundingClientRect();
      return [0.25, 0.5, 0.75, 0.95].map((f) => {
        const el = document.elementFromPoint(r.left + r.width * f, r.top + r.height / 2);
        return el && (el === cta || cta.contains(el));
      });
    });
    expect(reached, "every sampled point on the CTA must hit the CTA itself")
      .toEqual([true, true, true, true]);
  });
});
