import { test, expect } from '@playwright/test';
import { PAGES, collect, isThirdParty } from './helpers';

const scrollAll = (page: any) =>
  page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 50));
    }
  });

for (const p of PAGES) {
  const name = '/' + p;
  test.describe(`strona ${name}`, () => {
    test('status 200, tytul, brak bledow konsoli', async ({ page }) => {
      const c = collect(page);
      const res = await page.goto(p);
      expect(res?.status()).toBe(200);
      await page.waitForLoadState('networkidle').catch(() => {});
      expect(await page.title()).not.toBe('');
      expect.soft(c.pageErrors, 'uncaught exceptions').toEqual([]);
      expect.soft(c.consoleErrors.filter(e => !isThirdParty(e)), 'console errors').toEqual([]);
    });

    test('brak nieudanych requestow wlasnych (404 obrazow/favicon/cv)', async ({ page }) => {
      const c = collect(page);
      await page.goto(p);
      await page.waitForLoadState('networkidle').catch(() => {});
      await scrollAll(page);
      await page.waitForTimeout(800);
      expect(c.failed.filter(f => !isThirdParty(f)), 'failed own requests').toEqual([]);
    });

    test('obrazy sie laduja (naturalWidth > 0)', async ({ page }) => {
      await page.goto(p);
      await page.waitForLoadState('networkidle').catch(() => {});
      await scrollAll(page);
      await page.waitForTimeout(500);
      const broken = await page.$$eval('img', imgs => imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.src));
      expect(broken, 'zepsute obrazy').toEqual([]);
    });

    test('favicon: link wskazuje na istniejacy zasob', async ({ page, request }) => {
      await page.goto(p);
      const href = await page.getAttribute('link[rel~="icon"]', 'href');
      expect(href).toBeTruthy();
      const url = new URL(href!, page.url()).toString();
      const r = await request.get(url);
      expect(r.status(), `favicon ${url}`).toBe(200);
    });

    test('wizualne przepelnienie poziome', async ({ page }) => {
      await page.goto(p);
      await page.waitForLoadState('networkidle').catch(() => {});
      const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      expect(o.sw, `scrollWidth ${o.sw} vs clientWidth ${o.cw}`).toBeLessThanOrEqual(o.cw);
    });

    test('struktura: <body>, <main>, brak formularza', async ({ page }) => {
      await page.goto(p);
      const html = await (await page.request.get(p)).text();
      expect.soft(/<body[\s>]/i.test(html), 'surowy HTML zawiera <body>').toBe(true);
      expect.soft(await page.locator('main').count(), 'landmark <main>').toBeGreaterThan(0);
      expect(await page.locator('form').count(), 'formularze (oczekiwany brak, kontakt przez mailto)').toBe(0);
    });
  });
}

test('404: nieistniejaca strona zwraca 404 z wlasna trescia', async ({ page }) => {
  const res = await page.goto('nie-ma-takiej-strony');
  expect(res?.status()).toBe(404);
  const txt = (await page.content()).toLowerCase();
  expect(txt, 'wlasna strona 404').toMatch(/404|nie znaleziono|not found/);
});

test('robots.txt i sitemap istnieja', async ({ request }) => {
  expect.soft((await request.get('/portfolio/robots.txt')).status(), 'robots.txt').toBe(200);
  expect.soft((await request.get('/portfolio/sitemap-index.xml')).status(), 'sitemap-index.xml').toBe(200);
});

test('cv.pdf (link Pobierz CV) dostepny pod base', async ({ page, request }) => {
  await page.goto('');
  await page.waitForSelector('a[download]');
  const href = await page.locator('a[download]').first().getAttribute('href');
  const url = new URL(href!, page.url()).toString();
  expect((await request.get(url)).status(), `CV ${url}`).toBe(200);
});
