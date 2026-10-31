import { test, expect, PAGES, collect, isThirdParty } from './helpers';

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

    test('struktura: dokladnie jeden <body>, <main>, <nav>, <h1>, brak formularza', async ({ page }) => {
      await page.goto(p);
      const html = await (await page.request.get(p)).text();
      const count = (re: RegExp) => (html.match(re) ?? []).length;
      expect.soft(count(/<body[\s>]/gi), 'liczba <body> w surowym HTML').toBe(1);
      expect.soft(count(/<main[\s>]/gi), 'liczba <main> w surowym HTML').toBe(1);
      expect.soft(count(/<nav[\s>]/gi), 'liczba <nav> w surowym HTML').toBe(1);
      expect.soft(count(/<h1[\s>]/gi), 'liczba <h1> w surowym HTML').toBe(1);
      expect(await page.locator('form').count(), 'formularze (oczekiwany brak, kontakt przez mailto)').toBe(0);
    });

    test('hierarchia naglowkow: jeden h1, bez przeskokow poziomow, sekcje maja id', async ({ page }) => {
      await page.goto(p);
      if (await page.locator('#repos').count()) await page.locator('#repos').scrollIntoViewIfNeeded();
      await page.waitForLoadState('networkidle').catch(() => {});
      const levels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll(els => els.map(e => Number(e.tagName[1])));
      expect(levels[0], 'pierwszy naglowek').toBe(1);
      expect(levels.filter(l => l === 1).length, 'liczba h1').toBe(1);
      levels.forEach((l, i) => { if (i > 0) expect.soft(l, `naglowek #${i} (h${l}) po h${levels[i - 1]}`).toBeLessThanOrEqual(levels[i - 1] + 1); });
      expect(await page.locator('main section:not([id]):not([aria-labelledby])').count(), 'sekcje bez id/aria-labelledby').toBe(0);
    });

    test('zadnych wysp dla statycznej tresci: podstrony projektow bez astro-island', async ({ page }) => {
      test.skip(!p.includes('projects/'), 'tylko podstrony projektow');
      const html = await (await page.request.get(p)).text();
      expect((html.match(/<astro-island/g) ?? []).length, 'liczba astro-island').toBe(0);
      expect(html, 'skrypty klienckie React').not.toMatch(/client\.[\w-]+\.js/);
    });

    test('SEO: canonical, hreflang, og:title, html[lang] zgodny z jezykiem strony', async ({ page }) => {
      await page.goto(p);
      await expect(page.locator('html')).toHaveAttribute('lang', p.startsWith('en/') ? 'en' : 'pl');
      expect(await page.getAttribute('link[rel=canonical]', 'href')).toContain('https://misiakfilip.github.io/portfolio/');
      expect(await page.locator('meta[property="og:title"]').count()).toBe(1);
      const alternates = await page.locator('link[rel=alternate][hreflang]').evaluateAll(els => els.map(e => e.getAttribute('hreflang')));
      expect(alternates.sort()).toEqual(['en', 'pl', 'x-default']);
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

// Decyzja wlasciciela: przycisk CV jest ukryty, dopoki nie ma public/cv.pdf (config.cvUrl).
// Test pilnuje, ze jesli jakikolwiek link `download` jest widoczny, to wskazuje na istniejacy plik pod base.
test('linki download (np. Pobierz CV) nie sa martwe', async ({ page, request }) => {
  await page.goto('');
  await page.waitForSelector('#home');
  const hrefs = await page.locator('a[download]').evaluateAll(els => els.map(e => (e as HTMLAnchorElement).href));
  for (const url of hrefs) expect((await request.get(url)).status(), `download ${url}`).toBe(200);
});
