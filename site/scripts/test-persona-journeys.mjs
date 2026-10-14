import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const BASE = new URL(BASE_URL);
const PRE_CUTOVER_URL_REMAPS = [
  // PRE-CUTOVER remap: remove after cutover (MONOREPO.md step 8)
  {
    from: /^https:\/\/www\.aigovops-foundation\.com\/practice\/(.*)$/,
    to: 'https://practice.aigovops-foundation.com/$1',
  },
  // PRE-CUTOVER remap: remove after cutover (MONOREPO.md step 8)
  {
    from: /^https:\/\/www\.aigovops-foundation\.com\/camps\/ncw\/(.*)$/,
    to: 'https://aigovops-foundation.github.io/aigovops-ncw-ai-camp/$1',
  },
];
const RESULTS_DIR = path.join(ROOT, 'test-results', 'personas');
const PERSONAS = [
  { id: 'founder', page: 'for-founders.html', title: 'AI governance for startup founders', englishChipLabel: 'Startup founder', spanishChipLabel: 'Fundador/a de startup', successHref: 'https://community.aigovops-foundation.com/gate-check.html?src=persona-founder' },
  { id: 'enterprise', page: 'for-enterprise.html', title: 'AI governance for enterprise governance leads', englishChipLabel: 'Enterprise governance lead', spanishChipLabel: 'Líder de gobernanza empresarial', successHref: 'https://github.com/aigovops-foundation/aigovops-vendor-rfi' },
  { id: 'student', page: 'for-students.html', title: 'AI governance for students', englishChipLabel: 'Student', spanishChipLabel: 'Estudiante', successHref: 'https://www.aigovops-foundation.com/practice/levels/100-begin/WORKSHEET.html?src=persona-student' },
  { id: 'researcher', page: 'for-researchers.html', title: 'AI governance for researchers', englishChipLabel: 'Researcher', spanishChipLabel: 'Investigador/a', successHref: 'https://community.aigovops-foundation.com/library/find.html?src=persona-researcher', accessGatePath: '/library-rules.html' },
  { id: 'regulator', page: 'for-regulators.html', title: 'AI governance for regulators and policy staff', englishChipLabel: 'Regulator / policy', spanishChipLabel: 'Regulador/a o políticas públicas', successHref: 'https://aigovops-foundation.github.io/aigovops-beacon/#demo' },
  { id: 'contributor', page: 'for-contributors.html', title: 'AI governance for open-source contributors', englishChipLabel: 'Open-source contributor', spanishChipLabel: 'Colaborador/a de código abierto', successHref: 'https://github.com/aigovops-foundation/aigovops-beacon/blob/main/CONTRIBUTING.md' },
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

function remapPreCutoverUrl(url) {
  for (const { from, to } of PRE_CUTOVER_URL_REMAPS) {
    if (from.test(url)) return url.replace(from, to);
  }
  return url;
}

async function checkHomepageChipLabels(page, language) {
  await page.waitForFunction(
    (expectedLanguage) => document.documentElement.lang === expectedLanguage
      && document.querySelector(`.lang-btn[data-lang="${expectedLanguage}"]`)?.classList.contains('lang-active'),
    language,
    { timeout: 10_000 },
  );
  const labels = (await page.locator('.persona-chips a.persona-chip').allTextContents())
    .map((label) => label.trim());
  const expected = PERSONAS.map((persona) =>
    language === 'es' ? persona.spanishChipLabel : persona.englishChipLabel,
  );
  record(
    labels.length === expected.length && labels.every((label, index) => label === expected[index]),
    `${language.toUpperCase()} homepage persona chips match the expected labels`,
  );
  record(
    labels.every((label) => !label.includes('[object')),
    `${language.toUpperCase()} homepage persona chips contain no [object`,
  );
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
  const remapCases = [
    {
      input: 'https://www.aigovops-foundation.com/practice/levels/100-begin/WORKSHEET.html?src=persona#start',
      expected: 'https://practice.aigovops-foundation.com/levels/100-begin/WORKSHEET.html?src=persona#start',
    },
    {
      input: 'https://www.aigovops-foundation.com/camps/ncw/docs/?q=1#x',
      expected: 'https://aigovops-foundation.github.io/aigovops-ncw-ai-camp/docs/?q=1#x',
    },
    {
      input: 'https://www.aigovops-foundation.com/open-source.html',
      expected: 'https://www.aigovops-foundation.com/open-source.html',
    },
  ];
  for (const testCase of remapCases) {
    assert.equal(remapPreCutoverUrl(testCase.input), testCase.expected);
  }
  console.log(`Persona journey pre-cutover URL remaps: ${remapCases.length} passed, 0 failed`);

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
    const remappedUrl = remapPreCutoverUrl(url);
    const operation = new URL(remappedUrl).origin === BASE.origin
      ? sameOriginStatus(remappedUrl, browser)
      : externalStatus(remappedUrl, api);
    statusCache.set(url, operation);
  }
  return statusCache.get(url);
}

async function run() {
  const { chromium, request } = await import('playwright');
  const indexHtml = await fs.readFile(path.join(ROOT, 'index.html'), 'utf8');
  const staticChipLabels = [...indexHtml.matchAll(/<a class="persona-chip"[^>]*>([^<]*)<\/a>/g)]
    .map(([, label]) => label.trim());
  const expectedEnglishChipLabels = PERSONAS.map((persona) => persona.englishChipLabel);
  record(
    staticChipLabels.length === expectedEnglishChipLabels.length
      && staticChipLabels.every((label, index) => label === expectedEnglishChipLabels[index]),
    'homepage static chip text matches the expected English labels',
  );
  await fs.mkdir(RESULTS_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 900 },
    ignoreHTTPSErrors: true,
  });
  await context.route(
    /^https:\/\/www\.aigovops-foundation\.com\/(?:practice|camps\/ncw)\//,
    async (route) => route.continue({ url: remapPreCutoverUrl(route.request().url()) }),
  );
  const api = await request.newContext({ timeout: 10_000, ignoreHTTPSErrors: true });
  let indexScreenshotSaved = false;

  try {
    const spanishContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      ignoreHTTPSErrors: true,
    });
    try {
      const spanishPage = await spanishContext.newPage();
      await spanishPage.addInitScript("localStorage.setItem('aigovops-lang', 'es')");
      await spanishPage.goto(BASE.href, { waitUntil: 'domcontentloaded', timeout: 10_000 });
      await spanishPage.waitForFunction(
        () => document.documentElement.lang === 'es',
        null,
        { timeout: 10_000 },
      );
      await checkHomepageChipLabels(spanishPage, 'es');
      await spanishPage.evaluate(() => document.fonts.ready);
      const spanishLastCardBottom = await spanishPage.locator('.six-card').last().evaluate(
        (card) => card.getBoundingClientRect().bottom,
      );
      scorecard.spanishHomeLastCardBottom = Math.round(spanishLastCardBottom * 100) / 100;
      record(
        spanishLastCardBottom <= 800,
        `Spanish homepage: last six-card fits at 1280×800 (${Math.round(spanishLastCardBottom)}px)`,
      );
      for (const persona of PERSONAS) {
        await spanishPage.goto(new URL(persona.page, BASE).href, {
          waitUntil: 'domcontentloaded',
          timeout: 10_000,
        });
        await spanishPage.waitForFunction(
          () => document.documentElement.lang === 'es',
          null,
          { timeout: 10_000 },
        );
        if (persona.id === 'founder') {
          await spanishPage.waitForSelector('.aig-feedback');
          const spanishFeedback = await spanishPage.evaluate(() => ({
            question: document.querySelector('.aig-fb-q')?.textContent,
            more: document.querySelector('.aig-fb-more')?.textContent,
            placeholder: document.querySelector('.aig-feedback textarea')?.placeholder,
          }));
          record(
            spanishFeedback.question === '¿Te resultó útil esta página?'
              && spanishFeedback.more === 'Cuéntanos más'
              && spanishFeedback.placeholder === '¿Qué funcionó y qué no…?',
            'Feedback widget renders Spanish visible and form strings',
          );
          await spanishPage.evaluate(() => window.I18N_SET('en'));
          await spanishPage.waitForFunction(
            () => document.querySelector('.aig-fb-q')?.textContent === 'Was this page helpful?',
            null,
            { timeout: 10_000 },
          );
          await spanishPage.evaluate(() => window.I18N_SET('es'));
          await spanishPage.waitForFunction(
            () => document.querySelector('.aig-fb-q')?.textContent === '¿Te resultó útil esta página?',
            null,
            { timeout: 10_000 },
          );
        }
        const spanishHeading = (await spanishPage.locator('.persona-hero h1').textContent())?.trim();
        record(spanishHeading !== persona.title, `${persona.id}: Spanish H1 differs from English`);
        const stepOneLink = spanishPage.locator('.persona-steps .persona-step:first-child a.btn-primary');
        const stepOneHref = await stepOneLink.getAttribute('href');
        const expected = new URL(persona.successHref);
        if (expected.hostname === 'community.aigovops-foundation.com') {
          const actual = new URL(stepOneHref, spanishPage.url());
          record(actual.searchParams.get('lang') === 'es', `${persona.id}: community step-1 CTA has lang=es`);
          record(
            actual.searchParams.get('src') === expected.searchParams.get('src'),
            `${persona.id}: community step-1 CTA preserves src`,
          );
        }
      }
    } finally {
      await spanishContext.close();
    }

    for (const persona of PERSONAS) {
      const journey = {
        id: persona.id,
        page: `/${persona.page}`,
        status: 'running',
        timings: {},
        widths: {},
        stepLinks: [],
        clicksToSuccess: { fromPersonaPage: 1, fromHome: 2 },
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
        await page.addInitScript("localStorage.setItem('aigovops-lang', 'en')");
        const homeResponse = await page.goto(BASE.href, { waitUntil: 'domcontentloaded', timeout: 10_000 });
        journey.timings.homeDOMContentLoadedMs = Math.round(performance.now() - homeStart);
        record(homeResponse !== null && homeResponse.status() < 400, `${persona.id}: homepage response is below 400`);
        record(journey.timings.homeDOMContentLoadedMs < 3_000, `${persona.id}: homepage DOMContentLoaded under 3 seconds`);
        if (persona.id === PERSONAS[0].id) await checkHomepageChipLabels(page, 'en');

        if (!indexScreenshotSaved) {
          const indexPath = path.join(RESULTS_DIR, 'index-390.png');
          await page.screenshot({ path: indexPath, fullPage: true });
          scorecard.indexScreenshot = indexPath;
          journey.screenshots.push(indexPath);
          indexScreenshotSaved = true;
        }

        journey.homeWidths = await readWidths(page);
        for (const width of [1280, 390]) {
          await page.setViewportSize({ width, height: 800 });
          const firstCard = await page.locator('.six-card').first().evaluate((card) => {
            const rect = card.getBoundingClientRect();
            return { top: rect.top, bottom: rect.bottom };
          });
          record(firstCard.top < 800, `${persona.id}: first six-card starts above the fold at ${width}×800 (${Math.round(firstCard.top)}px)`);
          if (width === 390) {
            record(firstCard.bottom <= 800, `${persona.id}: first six-card fits at 390×800 (${Math.round(firstCard.bottom)}px)`);
          }
          if (width === 1280) {
            const lastCardBottom = await page.locator('.six-card').last().evaluate((card) => card.getBoundingClientRect().bottom);
            record(lastCardBottom <= 800, `${persona.id}: last six-card fits at 1280×800 (${Math.round(lastCardBottom)}px)`);
          }
        }
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

        const successStep = page.locator('.persona-steps > li').first().locator('a.btn-primary');
        const successHref = await successStep.evaluate((anchor) => anchor.href);
        const expected = new URL(persona.successHref);
        record(successHref === expected.href, `${persona.id}: step 1 href matches success target`);
        const successStart = performance.now();
        const expectedSearchTarget = `${expected.pathname.slice(1)}${expected.search}`;
        const isSuccessNavigation = (url) => url.href === expected.href || (
          persona.accessGatePath &&
          url.origin === expected.origin &&
          url.pathname === persona.accessGatePath &&
          url.searchParams.get('next') === expectedSearchTarget
        );
        await Promise.all([
          page.waitForURL(isSuccessNavigation, {
            waitUntil: 'commit',
            timeout: 10_000,
          }),
          successStep.click(),
        ]);
        journey.timings.stepOneNavigationMs = Math.round(performance.now() - successStart);
        journey.success = { href: expected.href, navigatedTo: page.url(), navigated: true };
        record(true, `${persona.id}: step 1 reaches its success target or access gate`);
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
