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
// The residual, fixed separately: `pb-20` governs where the card ENDS, so it
// only ever protected the read-to-end position. It could not protect the
// resting position that pledge.js scrolls to right after someone commits,
// because a centred card puts a different element in the band on every phone.
// pledge.js now solves for that position instead — see settleOnSuccess() — and
// the matrix at the bottom of this file holds both positions at five widths.
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

// The confirmation heading — a fresh signer must be able to see this at the
// position the page comes to rest at, or nothing tells them it worked.
const CONFIRMATION = "#successCard h3";

// Widths named in the fix, with the viewport heights they ship with. 320x568
// is the tightest case in the wild: a 1129px card against a 568px screen.
const PHONES = [
  { w: 320, h: 568 },
  { w: 360, h: 640 },
  { w: 375, h: 667 },
  { w: 390, h: 664 },
  { w: 412, h: 823 },
];

async function addLauncher(page) {
  await page.addStyleTag({ content: LAUNCHER });
  await page.evaluate(() => {
    const b = document.createElement("button");
    b.className = "jv-btn";
    b.setAttribute("aria-label", "Jeeves — ask, watch the tour, or open the map");
    b.textContent = "Ask Jeeves";
    document.body.appendChild(b);
  });
}

async function commitAndSettle(page, { launcher = true } = {}) {
  // Keep the gate independent of the Foundation site being reachable.
  await page.route("**/jeeves-widget.js", (route) => route.abort());
  await page.goto("/pledge.html");
  if (launcher) await addLauncher(page);

  await page.locator("#f-commit").check();
  await page.locator('#pledgeForm button[type="submit"]').click();
  await expect(page.locator("#successCard")).toBeVisible({ timeout: 7_000 });
  // custom.css sets html{scroll-behavior:smooth}; pin it so the scroll below is
  // instant and boxes are never measured mid-animation.
  await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
  await page.waitForTimeout(900); // let the card's own resting scroll finish
}

// The natural stopping point: scroll until the card's bottom edge meets the
// bottom of the screen.
async function scrollToEnd(page) {
  await page.evaluate(() => {
    const c = document.getElementById("successCard");
    const top = window.scrollY + c.getBoundingClientRect().top;
    window.scrollTo({ top: top + c.offsetHeight - window.innerHeight, behavior: "instant" });
  });
  await page.waitForTimeout(150);
}

function intersects(a, b) {
  const x = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const y = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  return x > 0 && y > 0 ? { x: Math.round(x), y: Math.round(y) } : null;
}

// Every action, measured against the launcher, with a readable failure.
async function expectAllActionsClear(page, where) {
  const jv = await page.locator(".jv-btn").boundingBox();
  for (const [label, sel] of Object.entries(ACTIONS)) {
    const box = await page.locator(sel).boundingBox();
    const hit = intersects(jv, box);
    expect(
      hit,
      `${where}: "${label}" must not be covered by the Jeeves launcher ` +
        `(action x ${Math.round(box.x)}-${Math.round(box.x + box.width)}, ` +
        `y ${Math.round(box.y)}-${Math.round(box.y + box.height)}; ` +
        `launcher x ${Math.round(jv.x)}-${Math.round(jv.x + jv.width)}, ` +
        `y ${Math.round(jv.y)}-${Math.round(jv.y + jv.height)}; ` +
        `overlap ${hit ? `${hit.x}x${hit.y}px` : "none"})`
    ).toBeNull();
  }
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
    await scrollToEnd(page); // where the collision used to happen
    await expectAllActionsClear(page, "read to the end");
  });

  test("a tap on the weekly-note CTA reaches the CTA, not the launcher", async ({ page }) => {
    await commitAndSettle(page);
    await scrollToEnd(page);

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

// ---------------------------------------------------------------------------
// The residual that `pb-20` could not reach: the position the page comes to
// rest at right after someone commits. pledge.js solves for that position now
// (settleOnSuccess), so BOTH positions have to hold at every phone width — and
// the confirmation has to survive the solving, or we have traded one bug for
// a worse one.
// ---------------------------------------------------------------------------
test.describe("Resting position after committing", () => {
  for (const { w, h } of PHONES) {
    test(`${w}x${h}: confirmation is visible and every action clears the launcher`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await commitAndSettle(page);

      // (1) A fresh signer must be able to read that it worked.
      const confirm = await page.locator(CONFIRMATION).boundingBox();
      expect(confirm, "the confirmation heading must be laid out").not.toBeNull();
      expect(
        confirm.y,
        `${w}x${h}: "Thank you for committing." must not be above the fold ` +
          `(top y ${Math.round(confirm.y)})`
      ).toBeGreaterThanOrEqual(0);
      expect(
        confirm.y + confirm.height,
        `${w}x${h}: "Thank you for committing." must not be below the fold ` +
          `(bottom y ${Math.round(confirm.y + confirm.height)} of ${h})`
      ).toBeLessThanOrEqual(h);

      // (2) …at the resting position, and (3) again once they read to the end.
      await expectAllActionsClear(page, `${w}x${h} resting`);
      await scrollToEnd(page);
      await expectAllActionsClear(page, `${w}x${h} read to the end`);
    });
  }

  test("stays clear even if the launcher script never loads", async ({ page }) => {
    // The widget is injected from another origin and can arrive late (or, on a
    // slow connection, after someone has already committed). pledge.js falls
    // back to the geometry jeeves-widget.js ships with, so the resting position
    // must clear a launcher that only shows up afterwards.
    await page.setViewportSize({ width: 390, height: 664 });
    await commitAndSettle(page, { launcher: false });
    await addLauncher(page);
    await page.waitForTimeout(100);
    await expectAllActionsClear(page, "launcher arrived late");
  });
});

test.describe("Desktop is left alone", () => {
  test("rests exactly where scrollIntoView({block:'center'}) always put it", async ({ page }) => {
    test.skip(page.viewportSize().width < 640, "phone-width project");
    await commitAndSettle(page);

    // The strict form of "desktop unaffected": where the card fits the screen
    // and nothing shares the launcher's column, settleOnSuccess must hand off
    // to the very same call it replaced — same pixel, not merely a similar one.
    const { rested, centred } = await page.evaluate(() => {
      const rested = window.scrollY;
      document
        .getElementById("successCard")
        .scrollIntoView({ behavior: "instant", block: "center" });
      return { rested, centred: window.scrollY };
    });
    expect(rested, `resting scrollY ${rested} must equal centred scrollY ${centred}`)
      .toBe(centred);
  });
});
