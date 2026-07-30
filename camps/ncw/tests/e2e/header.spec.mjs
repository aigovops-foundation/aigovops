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

test.describe("Header nav density", () => {
  for (const width of DESKTOP_WIDTHS) {
    test(`fits on one line at ${width}px with room to spare`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await waitForTailwind(page);

      const metrics = await page.evaluate(() => {
        const row = document.querySelector("#site-header header > div");
        const nav = document.querySelector('nav[aria-label="Primary"]');
        const style = getComputedStyle(row);
        const inner =
          row.getBoundingClientRect().width -
          parseFloat(style.paddingLeft) -
          parseFloat(style.paddingRight);

        const links = [...nav.children];
        // Natural single-line width of each link, measured on a clone so a
        // squeezed label reports what it WANTS rather than what it got.
        let need = 0;
        for (const link of links) {
          const clone = link.cloneNode(true);
          clone.style.whiteSpace = "nowrap";
          clone.style.position = "absolute";
          clone.style.visibility = "hidden";
          document.body.appendChild(clone);
          need += clone.getBoundingClientRect().width;
          clone.remove();
        }
        const gap = parseFloat(getComputedStyle(nav).columnGap) || 0;
        need += (links.length - 1) * gap;

        const rowGap = parseFloat(style.columnGap) || 0;
        const brand = row.children[0].getBoundingClientRect().width;
        const right = row.children[2].getBoundingClientRect().width;

        return {
          need: Math.round(need),
          budget: Math.round(inner - brand - right - rowGap * 2),
          tallestLink: Math.max(
            ...links.map((l) => Math.round(l.getBoundingClientRect().height))
          ),
          linkCount: links.length,
        };
      });

      expect(metrics.linkCount, "nav should render every link").toBeGreaterThan(10);

      expect(
        metrics.need,
        `nav needs ${metrics.need}px but only ${metrics.budget}px is available at ` +
          `${width}px. Either shorten a label or reclaim width from the link ` +
          `padding, the nav gap, or the brand subline.`
      ).toBeLessThanOrEqual(metrics.budget);

      // A wrapped label doubles a link's height. Catching this is why we
      // measure height as well as width: whitespace-nowrap should make it
      // impossible, so a tall link means the class was dropped.
      expect(
        metrics.tallestLink,
        `a nav label wrapped to a second line (tallest link ${metrics.tallestLink}px)`
      ).toBeLessThanOrEqual(45);
    });

    test(`CTA is not flex-shrunk at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await waitForTailwind(page);

      const cta = await page.evaluate(() => {
        const el = document.querySelector(
          '#site-header header a[href$="pledge.html"]'
        );
        const actual = el.getBoundingClientRect().width;
        // Measure what the pill wants by taking it out of the flex row.
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
        `"Sign the Pledge" was squeezed from ${cta.natural}px to ${cta.actual}px, ` +
          `which means the header row is overflowing`
      ).toBeGreaterThanOrEqual(cta.natural - 1);
    });
  }

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
