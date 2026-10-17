// tests/e2e/header.spec.mjs
//
// Guards the shared header, whose failure modes are all invisible to the
// other specs: nothing 404s, nothing overflows, and axe sees a valid
// document even when the brand wordmark is display:none at every width or
// the CTA has been silently flex-shrunk to a squashed pill.
//
// Two regressions this exists to catch:
//
//   1. The wordmark carried `hidden xs:block`, but no page defines a
//      screens.xs breakpoint, so the Tailwind CDN never emitted an
//      `xs:block` utility and its own `.hidden` won on source order. The
//      brand was a bare logo everywhere for months.
//
//   2. The header row is capped at max-w-7xl, so usable width stops growing
//      past a 1280px viewport. When the row's fixed-width children exceed
//      it, `whitespace-nowrap` stops the nav from wrapping -- so the
//      overflow lands on the CTA as a flex-shrink instead, which looks like
//      a styling nit rather than the layout failure it is. We measure the
//      CTA against its own natural width to catch that.

import { test, expect } from "@playwright/test";

// Wait for the Tailwind CDN to inject its stylesheet. It loads async and
// AFTER custom.css, so measuring before it lands reports pre-Tailwind
// geometry. `position: sticky` on the header only exists in Tailwind's
// sheet, which makes it a reliable "styles have applied" signal.
async function waitForTailwind(page) {
  await page.waitForFunction(
    () => {
      const header = document.querySelector("#site-header header");
      return header && getComputedStyle(header).position === "sticky";
    },
    null,
    { timeout: 15000 }
  );
}

const DESKTOP_WIDTHS = [1280, 1440, 1920];

test.describe("Header brand wordmark", () => {
  test("is visible at every width, not just wide ones", async ({ page }) => {
    for (const width of [390, 640, 1024, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await waitForTailwind(page);

      const mark = page.locator("#site-header header span.font-serif").first();
      await expect(mark, `wordmark must be visible at ${width}px`).toBeVisible();
      await expect(mark).toHaveText(/NCW AI Expo/);
    }
  });

  test("shows the date subline only where the desktop nav is not competing", async ({ page }) => {
    const subline = () =>
      page.locator("#site-header header span.font-serif span").first();

    // Hamburger widths: the nav is hidden, so the row has room for both lines.
    await page.setViewportSize({ width: 640, height: 900 });
    await page.goto("/");
    await waitForTailwind(page);
    await expect(subline()).toBeVisible();

    // Desktop nav widths: the subline costs ~41px the row does not have.
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await waitForTailwind(page);
    await expect(subline()).toBeHidden();
  });
});

test.describe("Simplified shared navigation", () => {
  test("keeps four primary links and groups the remaining destinations in keyboard-accessible More", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await waitForTailwind(page);

    const primary = await page.locator('nav[aria-label="Primary"]').evaluate((nav) =>
      [...nav.children].filter((el) => el.matches("a[data-nav]")).map((el) => el.textContent.trim())
    );
    expect(primary).toEqual(["Home", "Your day", "Pledge", "Tools"]);

    const more = page.locator('nav[aria-label="Primary"] > details');
    const summary = more.locator("summary");
    await expect(summary).toHaveText("More ▾");
    await expect(more.locator("a[data-nav]")).toHaveText([
      "The Plan",
      "Centerpiece",
      "Mini-Camps",
      "Workshop",
      "Demo Lab",
      "Courses",
      "Hint-Logs",
      "Resources",
      "Support",
      "About",
    ]);
    await summary.focus();
    await page.keyboard.press("Space");
    await expect(more).toHaveAttribute("open", "");
  });

  test("marks Your day active on the attendee guide", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/kit/attendee-guide.html");
    await waitForTailwind(page);
    const yourDay = page.locator('nav[aria-label="Primary"] a[data-nav="day"]');
    await expect(yourDay).toHaveAttribute("href", "../kit/attendee-guide.html");
    expect(await yourDay.evaluate((el) => el.classList.contains("bg-orchard/8"))).toBe(true);
    const moreSummary = page.locator('nav[aria-label="Primary"] > details > summary');
    expect(await moreSummary.evaluate((el) => el.classList.contains("bg-orchard/8"))).toBe(false);
  });

  test("uses the same keyboard-accessible More menu in the mobile drawer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await waitForTailwind(page);
    await page.locator("#menuBtn").click();
    await expect(page.locator("#mobileMenu")).toBeVisible();
    await expect(page.locator("#mobileMenu > a")).toHaveText([
      "Home",
      "Your day",
      "Pledge",
      "Tools",
    ]);

    const more = page.locator("#mobileMenu > details");
    const summary = more.locator("summary");
    await summary.focus();
    await page.keyboard.press("Space");
    await expect(more).toHaveAttribute("open", "");
    await expect(more.locator("a")).toHaveCount(10);
  });

  for (const width of DESKTOP_WIDTHS) {
    test(`desktop pledge action is not flex-shrunk at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await waitForTailwind(page);

      const cta = await page.evaluate(() => {
        const el = document.querySelector("#pledgeHeaderAction");
        const actual = el.getBoundingClientRect().width;
        const clone = el.cloneNode(true);
        clone.style.position = "absolute";
        clone.style.visibility = "hidden";
        clone.style.whiteSpace = "nowrap";
        document.body.appendChild(clone);
        const natural = clone.getBoundingClientRect().width;
        clone.remove();
        return { actual: Math.round(actual), natural: Math.round(natural) };
      });

      expect(
        cta.actual,
        `the pledge action was squeezed from ${cta.natural}px to ${cta.actual}px`
      ).toBeGreaterThanOrEqual(cta.natural - 1);
    });
  }

  test("mobile pledge action stays clear of the launcher's documented footprint", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await waitForTailwind(page);
    const cta = page.locator("#pledgeStickyMobile");
    await expect(cta).toBeHidden();
    await page.evaluate(() => {
      const hero = document.getElementById("home-hero");
      window.scrollTo(0, hero.offsetTop + hero.offsetHeight);
    });
    await expect(cta).toBeVisible();
    const rect = await page.locator("#pledgeStickyMobile").boundingBox();
    expect(rect).not.toBeNull();
    const launcherTop = 844 - 20 - 46;
    expect(rect.y + rect.height).toBeLessThanOrEqual(launcherTop);
  });

  test("hamburger replaces the nav below xl, and never both at once", async ({ page }) => {
    for (const [width, expectNav] of [
      [1024, false],
      [1279, false],
      [1280, true],
    ]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await waitForTailwind(page);

      const nav = page.locator('nav[aria-label="Primary"]');
      const burger = page.locator("#menuBtn");

      if (expectNav) {
        await expect(nav, `nav should show at ${width}px`).toBeVisible();
        await expect(burger, `hamburger should hide at ${width}px`).toBeHidden();
      } else {
        await expect(nav, `nav should hide at ${width}px`).toBeHidden();
        await expect(burger, `hamburger should show at ${width}px`).toBeVisible();
      }
    }
  });

  test("Foundation bar is the first body element on the landing page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await waitForTailwind(page);
    await expect(page.locator("body > nav.agf-bar")).toBeVisible();
    const firstElement = await page.locator("body > *").first().getAttribute("class");
    expect(firstElement).toBe("agf-bar");
  });
});

test("Language toggle round-trips between the English and Spanish editions", async ({ page }) => {
  for (const [from, to] of [
    ["/workshop.html", "/es/workshop.html"],
    ["/checklist.html", "/es/checklist.html"],
  ]) {
    await page.goto(from);
    await page.getByRole("link", { name: "Español" }).click();
    await expect(page).toHaveURL(new RegExp(`${to.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}$`));
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await page.getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(new RegExp(`${from.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}$`));
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  }
});

test("Survey buttons stay disabled until a real form URL is pasted in", async ({ page }) => {
  for (const path of ["/survey.html", "/survey-after.html"]) {
    await page.goto(path);
    const button = page.locator("#formLink");
    await expect(button).toBeVisible();

    const href = await button.getAttribute("href");
    if (href && href !== "#") {
      // A form URL has been pasted in — it must be a real external link.
      expect(href, `${path}: FORM_URL should be absolute`).toMatch(/^https:\/\//);
      expect(await button.getAttribute("target")).toBe("_blank");
      expect(await button.getAttribute("rel")).toMatch(/noopener/);
    } else {
      // No form yet. The button must say so rather than looking clickable
      // and pointing at "#", which would read as a broken form.
      expect(href, `${path}: placeholder button must not keep href="#"`).toBeNull();
      await expect(button).toHaveAttribute("aria-disabled", "true");
      await expect(button).not.toHaveText(/open the survey form/i);
    }
  }
});
