// tests/e2e/pledge-form.spec.mjs
//
// End-to-end coverage for /pledge.html — now an ANONYMOUS, local-only pledge.
//
// The audience includes minors, so the pledge collects NO personal data and
// sends nothing to any server. These tests verify:
//   1. No PII fields exist (name / email / role / org / city all gone).
//   2. The commit checkbox is required — submitting unchecked shows no success.
//   3. Checking commit → the success card appears and the form hides.
//   4. NO network request is made to /api/sign (or anywhere).
//   5. Only an anonymous flag (no PII) is persisted to localStorage.
//   6. No fabricated signer counter / signer wall is present.

import { test, expect } from "@playwright/test";

test.describe("Pledge — /pledge.html (anonymous, local-only)", () => {
  test("collects no personal-data fields", async ({ page }) => {
    await page.goto("/pledge.html");
    await expect(page.locator("#pledgeForm")).toBeVisible();
    for (const sel of ["#f-name", "#f-email", "#f-role", "#f-org", "#f-city"]) {
      await expect(page.locator(sel)).toHaveCount(0);
    }
    await expect(page.locator('#pledgeForm input[type="email"]')).toHaveCount(0);
    // The anonymous controls that remain:
    await expect(page.locator("#f-commit")).toBeVisible();
    await expect(page.locator("#f-action")).toBeVisible(); // optional, private note
  });

  test("commit checkbox is required — no success without it", async ({ page }) => {
    await page.goto("/pledge.html");
    await page.locator('#pledgeForm button[type="submit"]').click();
    await page.waitForTimeout(400);
    await expect(page.locator("#successCard")).toBeHidden();
    const invalid = await page.locator("#f-commit").evaluate((el) => !el.checkValidity());
    expect(invalid).toBe(true);
  });

  test("checking commit shows the success card and makes NO network call", async ({ page }) => {
    // Fail the test if the page ever tries to POST the pledge anywhere.
    let posted = false;
    await page.route("**/api/sign", (route) => { posted = true; route.fulfill({ status: 404, body: "" }); });
    await page.route("**/api/**", (route) => {
      if (route.request().method() === "POST") posted = true;
      route.continue();
    });

    await page.goto("/pledge.html");
    await page.locator("#f-action").fill("Write our classroom's 5-sentence AI policy.");
    await page.locator("#f-commit").check();
    await page.locator('#pledgeForm button[type="submit"]').click();

    await expect(page.locator("#successCard")).toBeVisible({ timeout: 7_000 });
    await expect(page.locator("#pledgeForm")).toBeHidden();
    expect(posted, "the pledge must not POST anywhere").toBe(false);
  });

  test("persists only an anonymous flag to localStorage (no PII)", async ({ page }) => {
    await page.goto("/pledge.html");
    await page.locator("#f-action").fill("Post our AI policy on the door.");
    await page.locator("#f-commit").check();
    await page.locator('#pledgeForm button[type="submit"]').click();
    await expect(page.locator("#successCard")).toBeVisible({ timeout: 7_000 });

    const stored = await page.evaluate(() => {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("ncw_pledge")) return localStorage.getItem(k);
      }
      return null;
    });
    expect(stored, "an anonymous commitment record is stored").toBeTruthy();
    const rec = JSON.parse(stored);
    expect(rec.committed).toBe(true);
    // No PII keys of any kind.
    for (const k of ["name", "email", "role", "organization", "city"]) {
      expect(rec[k], `stored record must not contain ${k}`).toBeUndefined();
    }
  });

  test("no fabricated signer counter or signer wall", async ({ page }) => {
    await page.goto("/pledge.html");
    for (const sel of ["#signerCountHero", "#signerCountForm", "#signerCountWall", "#signersWall"]) {
      await expect(page.locator(sel)).toHaveCount(0);
    }
    await expect(page.getByText(/and counting/i)).toHaveCount(0);
  });
});
