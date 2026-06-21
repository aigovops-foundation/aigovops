import { chromium, webkit } from "@playwright/test";
import { devices } from "@playwright/test";

for (const [name, browserType, deviceName] of [
  ["chromium", chromium, "Desktop Chrome"],
  ["pixel5", chromium, "Pixel 5"],  // android emulated on chromium
]) {
  try {
    const browser = await browserType.launch();
    const ctx = await browser.newContext(devices[deviceName]);
    const page = await ctx.newPage();
    await page.goto("http://127.0.0.1:4173/plan.html", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const result = await page.evaluate(() => {
      const a = document.querySelector('a.text-orchard');
      if (!a) return "no link found";
      const cs = getComputedStyle(a);
      return { color: cs.color, classes: a.className.slice(0, 80) };
    });
    console.log(`${name}:`, JSON.stringify(result));
    await browser.close();
  } catch (e) { console.log(`${name} error:`, e.message); }
}
