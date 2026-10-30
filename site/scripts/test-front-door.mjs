// Front-door tests (Oct 2026): the simple home page, the Academy, Members and Write.
// Runs against BASE_URL (a local http.server on pull requests, the live site nightly).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = new URL(process.env.BASE_URL || 'http://localhost:8080');
const OUT = path.join(ROOT, 'test-results', 'front-door');
const failures = [];
const notes = [];
const record = (ok, msg) => { (ok ? notes : failures).push(msg); };
const statusCache = new Map();
// Substack answers GitHub's datacenter IPs with 403 (bot wall) while serving browsers 200;
// a 403 from these hosts means "exists, blocked the robot", not "broken link".
const BOT_WALLED_HOSTS = ['aigovops.substack.com'];

async function status(url, api) {
  if (!statusCache.has(url)) {
    statusCache.set(url, (async () => {
      const walled = BOT_WALLED_HOSTS.includes(new URL(url).hostname);
      const fetchOnce = async () => { const r = await api.get(url, { maxRedirects: 10 }); return r.status() === 403 && walled ? 200 : r.status(); };
      try { return await fetchOnce(); } catch { try { return await fetchOnce(); } catch { return null; } }
    })());
  }
  return statusCache.get(url);
}

async function withLang(browser, lang, viewport) {
  const ctx = await browser.newContext({ viewport, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  await page.addInitScript(`localStorage.setItem('aigovops-lang', '${lang}')`);
  return { ctx, page };
}

async function run() {
  const { chromium, request } = await import('playwright');
  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const api = await request.newContext({ timeout: 15_000, ignoreHTTPSErrors: true, extraHTTPHeaders: { 'user-agent': 'Mozilla/5.0 aigovops-front-door-test' } });
  try {
    // 1. Home: the Gate Check, four tasks and the Academy bar fit. English only since 2026-10-19 (no language toggle).
    for (const lang of ['en']) {
      for (const [w, h] of [[1280, 800], [390, 844]]) {
        const { ctx, page } = await withLang(browser, lang, { width: w, height: h });
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        await page.goto(BASE.href, { waitUntil: 'networkidle', timeout: 20_000 });
        await page.waitForFunction((l) => document.documentElement.lang === l, lang, { timeout: 10_000 });
        await page.evaluate(() => document.fonts.ready);
        const cards = await page.locator('.task-card').count();
        record(cards === 5, `${lang} ${w}: home has the Gate Check plus four task cards (${cards})`);
        // The Gate Check leads the door (22 Oct estate review): the first card, src-tagged.
        const gateHref = await page.locator('.task-card').first().locator('a').first().getAttribute('href');
        record(/^https:\/\/community\.aigovops-foundation\.com\/gate-check\.html\?src=home/.test(gateHref || ''), `${lang} ${w}: first home card runs the Gate Check (${gateHref})`);
        const h1 = (await page.locator('h1').innerText()).trim();
        record(h1.length > 0 && !h1.includes('[object'), `${lang} ${w}: h1 renders (${h1})`);
        if (w === 1280) {
          const bar = await page.locator('a.academy-bar').evaluate((b) => b.getBoundingClientRect().bottom);
          record(bar <= 800, `${lang} 1280×800: the Gate Check, four tasks and the Academy bar fit above the fold (${Math.round(bar)}px)`);
        } else {
          const first = await page.locator('.task-card').first().evaluate((c) => c.getBoundingClientRect().bottom);
          record(first <= 844, `${lang} 390×844: first task card fits (${Math.round(first)}px)`);
        }
        const texts = await page.locator('.task-card h2, .task-card p:not(.task-msg), .academy-bar').allTextContents();
        record(texts.every((t) => !t.includes('[object') && t.trim().length > 0), `${lang} ${w}: no empty or [object] copy on the home cards`);
        const luma = await page.locator('#nextMeetingLink').getAttribute('href');
        record(/^https:\/\/(luma\.com|lu\.ma)\//.test(luma || ''), `${lang} ${w}: meeting button points at Luma (${luma})`);
        const whenText = (await page.locator('#nextMeeting').innerText()).trim();
        record(whenText.length > 0, `${lang} ${w}: next-meeting line has text (${whenText})`);
        record(!/teams/i.test(await page.content()), `${lang} ${w}: the private Teams call is not mentioned on the home page`);
        record(errors.length === 0, `${lang} ${w}: no page errors on home${errors.length ? ` (${errors.join('; ')})` : ''}`);
        await page.screenshot({ path: path.join(OUT, `home-${w}-${lang}.png`), fullPage: w === 390 });
        if (w === 1280) {
          await Promise.all([
            page.waitForURL((u) => u.pathname.endsWith('/academy.html'), { timeout: 10_000 }),
            page.locator('a.academy-bar').click(),
          ]);
          record(true, `${lang}: Academy bar lands on academy.html`);
        }
        await ctx.close();
      }
    }

    // 2. Academy: four doors, extras, and every link answers.
    {
      const { ctx, page } = await withLang(browser, 'en', { width: 1280, height: 800 });
      await page.goto(new URL('academy.html', BASE).href, { waitUntil: 'networkidle', timeout: 20_000 });
      for (const id of ['research', 'learn', 'practice', 'audit-ready', 'badges', 'peers', 'new', 'start', 'problem', 'ten']) {
        record(await page.locator(`#${id}`).count() === 1, `academy: #${id} exists once`);
      }
      const chips = await page.locator('.persona-chips a.persona-chip').count();
      record(chips === 6, `academy: six persona chips (${chips})`);
      const links = await page.locator('.doors a, .academy-extras a').evaluateAll((as) => as.map((a) => a.href));
      record(links.length >= 25, `academy: doors carry ${links.length} links`);
      for (const href of [...new Set(links)]) {
        const s = await status(href, api);
        record(s !== null && s < 400, `academy link ${href} → ${s ?? 'no response'}`);
      }
      const badges = await page.locator('#badges').innerText();
      record(!/members[- ]only|free/i.test(badges), 'academy: badges copy stays neutral on free vs members-only');
      await page.screenshot({ path: path.join(OUT, 'academy-1280-en.png'), fullPage: true });
      await ctx.close();
    }

    // 3. Old home anchors redirect to the Academy.
    for (const anchor of ['start', 'problem', 'ten']) {
      const { ctx, page } = await withLang(browser, 'en', { width: 1280, height: 800 });
      await page.goto(new URL(`index.html#${anchor}`, BASE).href, { waitUntil: 'domcontentloaded', timeout: 20_000 });
      await page.waitForURL((u) => u.pathname.endsWith('/academy.html'), { timeout: 10_000 }).catch(() => {});
      record(page.url().endsWith(`/academy.html#${anchor}`), `index.html#${anchor} redirects to academy.html#${anchor} (${page.url()})`);
      await ctx.close();
    }

    // 4. Members: four tiers (three paid + free), yearly / no refunds, buttons go somewhere real.
    {
      const { ctx, page } = await withLang(browser, 'en', { width: 1280, height: 800 });
      await page.goto(new URL('members.html', BASE).href, { waitUntil: 'networkidle', timeout: 20_000 });
      const prices = await page.locator('.tier-price').allInnerTexts();
      record(prices.length === 4 && /\$12\b/.test(prices[0]) && /\$120\b/.test(prices[1]) && /\$1,200\b/.test(prices[2]) && /\$0\b/.test(prices[3]), `members: four tiers priced $12 / $120 / $1,200 / $0 (${prices.map((p) => p.replace(/\s+/g, ' ')).join(' | ')})`);
      const body = await page.locator('main').innerText();
      record(/no questions asked|sin preguntas/i.test(body), 'members: the free tier says no questions asked');
      record(/no refunds/i.test(body) && /yearly/i.test(body), 'members: says yearly and no refunds');
      const hrefs = await page.locator('.tier-card a.btn').evaluateAll((as) => as.map((a) => [a.getAttribute('href'), a.dataset.stripePending || '']));
      const free = await page.locator('.tier-card a.btn[data-form-pending="free"], .tier-card a.btn[data-free]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      record(free.length === 1 && !/buy\.stripe\.com|checkout\.stripe\.com/.test(free[0]) && (/^mailto:bob\.rapp@aigovops\.community\?/.test(free[0]) || /^https:\/\//.test(free[0])), `members: the free button is a request, never a payment link (${free[0]})`);
      record(/free if \$12 is a barrier/i.test(await page.locator('meta[name="description"]').getAttribute('content') || ''), 'members: the search/social description mentions the free tier');
      record(hrefs.length === 4 && hrefs.every(([h]) => /^https:\/\/buy\.stripe\.com\//.test(h) || /^mailto:bob\.rapp@aigovops\.community\?/.test(h)), 'members: each button is a Stripe Payment Link or the interim mailto');
      for (const [h, pending] of hrefs) if (h.startsWith('https://')) { const s = await status(h, api); record(s !== null && s < 400, `members: Stripe link ${h} → ${s}`); if (pending) record(false, `members: ${h} still carries data-stripe-pending`); }
      record(!/teams/i.test(body), 'members: no mention of the private Teams call');
      await page.screenshot({ path: path.join(OUT, 'members-1280-en.png'), fullPage: true });
      await ctx.close();
    }

    // 5. Write: four steps, six topics, a working send-a-draft target.
    {
      const { ctx, page } = await withLang(browser, 'en', { width: 1280, height: 800 });
      await page.goto(new URL('write.html', BASE).href, { waitUntil: 'networkidle', timeout: 20_000 });
      record(await page.locator('.steps li').count() === 4, 'write: four steps');
      record(await page.locator('.topics ul li').count() >= 6, 'write: at least six open topics');
      const href = await page.locator('.topics a.btn').getAttribute('href');
      record(/^https:\/\/(forms\.gle|docs\.google\.com)\//.test(href || '') || /^mailto:bob\.rapp@aigovops\.community\?/.test(href || ''), `write: Send a draft goes to the form or the interim mailto (${href})`);
      if ((href || '').startsWith('https://')) { const s = await status(href, api); record(s !== null && s < 400, `write: form link → ${s}`); }
      await page.screenshot({ path: path.join(OUT, 'write-1280-en.png'), fullPage: true });
      await ctx.close();
    }

    // 6. The Luma data file is well-formed and fresh enough.
    {
      const r = await api.get(new URL('data/next-meeting.json', BASE).href);
      record(r.status() === 200, `next-meeting.json → ${r.status()}`);
      let d = null; try { d = await r.json(); } catch {}
      record(d !== null && 'title' in d && 'start' in d && 'url' in d && 'updated' in d, 'next-meeting.json has title/start/url/updated');
      if (d) {
        record(/^https:\/\/(luma\.com|lu\.ma)\//.test(d.url), `next-meeting.json url is on Luma (${d.url})`);
        record(d.start === null || !Number.isNaN(Date.parse(d.start)), `next-meeting.json start parses (${d.start})`);
        const ageDays = (Date.now() - Date.parse(d.updated)) / 86_400_000;
        if (BASE.hostname !== 'localhost' && BASE.hostname !== '127.0.0.1') record(ageDays < 3, `next-meeting.json updated within 3 days (${ageDays.toFixed(1)} days)`);
        record(!/teams/i.test(JSON.stringify(d)), 'next-meeting.json never names Teams');
      }
    }

    // 7. Every page on the new path is in the sitemap.
    {
      const r = await api.get(new URL('sitemap.xml', BASE).href);
      const xml = r.status() === 200 ? await r.text() : '';
      for (const p of ['academy.html', 'members.html', 'write.html']) record(xml.includes(`/${p}</loc>`), `sitemap lists ${p}`);
    }
  } finally {
    await api.dispose();
    await browser.close();
  }
  const scorecard = { baseUrl: BASE.href, generatedAt: new Date().toISOString(), passed: notes.length, failed: failures.length, failures };
  await fs.writeFile(path.join(OUT, 'scorecard.json'), `${JSON.stringify(scorecard, null, 2)}\n`);
  console.log(`Front door (${BASE.href}): ${notes.length} passed, ${failures.length} failed`);
  for (const f of failures) console.error(`FAIL: ${f}`);
  if (failures.length) process.exitCode = 1;
}

run().catch((e) => { console.error(e); process.exitCode = 1; });
