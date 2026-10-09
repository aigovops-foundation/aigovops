import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const BASE = new URL(BASE_URL);
const RESULTS_DIR = path.join(ROOT, 'test-results', 'personas');
const PERSONAS = [
  { id: 'founder', page: 'for-founders.html', title: 'AI governance for startup founders' },
  { id: 'enterprise', page: 'for-enterprise.html', title: 'AI governance for enterprise governance leads' },
  { id: 'student', page: 'for-students.html', title: 'AI governance for students' },
  { id: 'researcher', page: 'for-researchers.html', title: 'AI governance for researchers' },
  { id: 'regulator', page: 'for-regulators.html', title: 'AI governance for regulators and policy staff' },
  { id: 'contributor', page: 'for-contributors.html', title: 'AI governance for open-source contributors' },
];
const failures = [];
const statusCache = new Map();
const scorecard = {
  baseUrl: BASE.href,
  generatedAt: new Date().toISOString(),
  status: 'running',
  journeys: [],
};

function record(condition, message) {
  if (!condition) failures.push(message);
}

function isUnexpectedConsoleError(locationUrl, text, baseUrl = BASE.href) {
  const cspResourceUrl = /refused to load/i.test(text)
    ? text.match(/https?:\/\/[^\s"'<>]+/i)?.[0]
    : null;
  const resourceUrl = cspResourceUrl || locationUrl;
  if (!resourceUrl) return true;

  try {
    return new URL(resourceUrl, baseUrl).origin === new URL(baseUrl).origin;
  } catch {
    return true;
  }
}

function runSelfTest() {
  const baseUrl = 'https://www.aigovops-foundation.com/';
  const cases = [
    {
      name: 'ignores Cloudflare Insights CSP errors',
      locationUrl: 'https://www.aigovops-foundation.com/for-founders.html',
      text: "Refused to load the script 'https://static.cloudflareinsights.com/beacon.min.js/abc' because it violates the Content Security Policy.",
      expected: false,
    },
    {
      name: 'fails on same-origin script errors',
      locationUrl: 'https://www.aigovops-foundation.com/js/main.js',
      text: 'Failed to load resource',
      expected: true,
    },
    {
      name: 'fails on errors without a URL',
      locationUrl: '',
      text: 'Uncaught TypeError: value is undefined',
      expected: true,
    },
    {
      name: 'ignores Plausible cross-origin errors',
      locationUrl: 'https://plausible.io/js/script.js',
      text: 'Failed to load resource',
      expected: false,
    },
  ];

  for (const testCase of cases) {
    assert.equal(
      isUnexpectedConsoleError(testCase.locationUrl, testCase.text, baseUrl),
      testCase.expected,
      testCase.name,
    );
  }
  console.log(`Persona journey console filter: ${cases.length} passed, 0 failed`);
}

async function readWidths(page) {
  const widths = {};
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const measurement = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    const contentWidth = Math.max(measurement.document, measurement.body);
    widths[width] = {
      viewport: measurement.viewport,
      document: measurement.document,
      body: measurement.body,
      noHorizontalOverflow: contentWidth <= width,
    };
    record(widths[width].noHorizontalOverflow, `${page.url()}: horizontal overflow at ${width}px (${contentWidth}px)`);
  }
  return widths;
}

async function externalStatus(url, api) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    let headStatus = null;
    let getStatus = null;
    let errorMessage = null;
    try {
      const response = await api.fetch(url, { method: 'HEAD', timeout: 10_000 });
      headStatus = response.status();
      if (headStatus < 400) return { status: headStatus, method: 'HEAD', attempts: attempt + 1 };
    } catch (error) {
      errorMessage = error.message;
    }
    try {
      const response = await api.get(url, { timeout: 10_000 });
      getStatus = response.status();
      if (getStatus < 400) return { status: getStatus, method: 'GET', attempts: attempt + 1, headStatus };
    } catch (error) {
      errorMessage = error.message;
    }
    if (attempt === 1) return { status: getStatus ?? headStatus, method: 'GET', attempts: attempt + 1, headStatus, error: errorMessage };
  }
  return { status: null, method: 'GET', attempts: 2 };
}

async function sameOriginStatus(url, browser) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const probe = await browser.newPage();
    try {
      const response = await probe.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
      const status = response?.status() ?? null;
      await probe.close();
      if (status !== null && status < 400) return { status, method: 'navigation', attempts: attempt + 1 };
      if (attempt === 1) return { status, method: 'navigation', attempts: attempt + 1 };
    } catch (error) {
      await probe.close();
      if (attempt === 1) return { status: null, method: 'navigation', attempts: attempt + 1, error: error.message };
    }
  }
  return { status: null, method: 'navigation', attempts: 2 };
}

async function getStepLinkStatus(url, browser, api) {
  if (!statusCache.has(url)) {
    const operation = new URL(url).origin === BASE.origin
      ? sameOriginStatus(url, browser)
      : externalStatus(url, api);
    statusCache.set(url, operation);
  }
  return statusCache.get(url);
}

async function run() {
  const { chromium, request } = await import('playwright');
  await fs.mkdir(RESULTS_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 900 },
    ignoreHTTPSErrors: true,
  });
  const api = await request.newContext({ timeout: 10_000, ignoreHTTPSErrors: true });
  let indexScreenshotSaved = false;

  try {
    for (const persona of PERSONAS) {
      const journey = {
        id: persona.id,
        page: `/${persona.page}`,
        status: 'running',
        timings: {},
        widths: {},
        stepLinks: [],
        clicksToSuccess: { fromPersonaPage: 2, fromHome: 3 },
        screenshots: [],
      };
      const failuresAtStart = failures.length;
      scorecard.journeys.push(journey);
      const page = await context.newPage();
      const sameOriginConsoleErrors = [];
      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        const location = message.location();
        const source = location.url || '';
        const text = message.text();
        if (isUnexpectedConsoleError(source, text, BASE.href)) {
          sameOriginConsoleErrors.push({ text, source });
        }
      });

      try {
        const homeStart = performance.now();
        const homeResponse = await page.goto(BASE.href, { waitUntil: 'domcontentloaded', timeout: 10_000 });
        journey.timings.homeDOMContentLoadedMs = Math.round(performance.now() - homeStart);
        record(homeResponse !== null && homeResponse.status() < 400, `${persona.id}: homepage response is below 400`);
        record(journey.timings.homeDOMContentLoadedMs < 3_000, `${persona.id}: homepage DOMContentLoaded under 3 seconds`);

        if (!indexScreenshotSaved) {
          const indexPath = path.join(RESULTS_DIR, 'index-390.png');
          await page.screenshot({ path: indexPath, fullPage: true });
          scorecard.indexScreenshot = indexPath;
          journey.screenshots.push(indexPath);
          indexScreenshotSaved = true;
        }

        journey.homeWidths = await readWidths(page);
        const chip = page.locator(`.persona-chips a[href="${persona.page}"]`);
        record(await chip.count() === 1, `${persona.id}: homepage chip exists exactly once`);
        const landingStart = performance.now();
        await Promise.all([
          page.waitForURL((url) => url.pathname === new URL(persona.page, BASE).pathname, {
            waitUntil: 'domcontentloaded',
            timeout: 10_000,
          }),
          chip.click(),
        ]);
        journey.timings.personaDOMContentLoadedMs = Math.round(performance.now() - landingStart);
        record(journey.timings.personaDOMContentLoadedMs < 3_000, `${persona.id}: page DOMContentLoaded under 3 seconds`);
        record(await page.locator('h1').innerText() === persona.title, `${persona.id}: chip lands on the expected persona page`);

        journey.widths = await readWidths(page);
        for (const width of [1280, 390]) {
          const screenshotPath = path.join(RESULTS_DIR, `${persona.id}-${width}.png`);
          await page.setViewportSize({ width, height: 900 });
          await page.screenshot({ path: screenshotPath, fullPage: true });
          journey.screenshots.push(screenshotPath);
        }

        const stepLinks = await page.locator('.persona-steps li a').evaluateAll((anchors) =>
          anchors.map((anchor) => ({ text: anchor.innerText.trim(), href: anchor.href })),
        );
        for (const link of stepLinks) {
          const result = await getStepLinkStatus(link.href, browser, api);
          journey.stepLinks.push({ ...link, ...result, ok: result.status !== null && result.status < 400 });
          record(result.status !== null && result.status < 400, `${persona.id}: step link ${link.href} returned ${result.status ?? 'no response'}`);
        }

        const stepThree = page.locator('.persona-steps > li').nth(2).locator('a.btn-primary');
        const expected = new URL(await stepThree.evaluate((anchor) => anchor.href));
        const successStart = performance.now();
        await Promise.all([
          page.waitForURL((url) => url.origin === expected.origin && url.pathname === expected.pathname, {
            waitUntil: 'commit',
            timeout: 10_000,
          }),
          stepThree.click(),
        ]);
        journey.timings.stepThreeNavigationMs = Math.round(performance.now() - successStart);
        journey.success = { href: expected.href, navigated: true };
        record(true, `${persona.id}: step three navigates`);
        record(sameOriginConsoleErrors.length === 0, `${persona.id}: no same-origin console errors${sameOriginConsoleErrors.length ? ` (${sameOriginConsoleErrors.map((item) => item.text).join('; ')})` : ''}`);
        journey.consoleErrors = sameOriginConsoleErrors;
        journey.status = failures.length === failuresAtStart ? 'passed' : 'failed';
      } catch (error) {
        journey.status = 'failed';
        journey.error = error.message;
        failures.push(`${persona.id}: ${error.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await api.dispose();
    await context.close();
    await browser.close();
  }

  scorecard.status = failures.length === 0 ? 'passed' : 'failed';
  scorecard.failures = failures;
  const scorecardPath = path.join(RESULTS_DIR, 'scorecard.json');
  await fs.writeFile(scorecardPath, `${JSON.stringify(scorecard, null, 2)}\n`);
  console.log(`Persona journey scorecard: ${scorecardPath}`);
  console.log(`Journeys: ${scorecard.journeys.filter((journey) => journey.status === 'passed').length}/${PERSONAS.length} passed`);
  if (failures.length) {
    for (const failure of failures) console.error(`FAIL: ${failure}`);
    process.exitCode = 1;
  }
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
} else {
  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
