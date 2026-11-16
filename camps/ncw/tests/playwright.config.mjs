// tests/playwright.config.mjs
//
// Playwright config for NCW AI Camp landing site.
// Serves the static /docs folder on :4173 and runs three projects:
//   - chromium-desktop  (1280×800)
//   - mobile-safari     (iPhone 13 — 390×844)
//   - mobile-android    (Pixel 5    — 393×851)

import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never", outputFolder: "../playwright-report" }]]
    : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
    },
    {
      name: "mobile-android",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npx http-server docs -p 4173 -s -c-1",
    port: PORT,
    cwd: "..",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
