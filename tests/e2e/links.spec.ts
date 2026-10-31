import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { PAGES } from './helpers';

const ORIGIN = 'http://localhost:4399';
const external: Record<string, string[]> = {};
const results: any[] = [];

test('linki wewnetrzne (wszystkie) zwracaja 200 i maja base', async ({ page, request }, info) => {
  test.skip(info.project.name !== 'chromium', 'raz');
  const bad: string[] = [];
  const seen = new Set<string>();
  for (const p of PAGES) {
    await page.goto(p);
    await page.waitForLoadState('networkidle').catch(() => {});
    const hrefs = await page.$$eval('a[href]', as => as.map(a => (a as HTMLAnchorElement).href));
    const raw = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')!));
    for (const h of hrefs) {
      const u = new URL(h);
      if (u.protocol === 'mailto:' || u.protocol === 'tel:') continue;
      if (u.origin !== ORIGIN) { (external[h] ||= []).push('/' + p); continue; }
      const key = u.origin + u.pathname;
      if (seen.has(key)) continue;
      seen.add(key);
      const r = await request.get(key);
      results.push({ type: 'internal', from: '/' + p, url: key, status: r.status() });
      if (r.status() >= 400) bad.push(`${r.status()} ${key} (z /${p})`);
    }
    for (const h of raw) if (h.startsWith('/') && !h.startsWith('/portfolio')) bad.push(`href bez base: ${h} (z /${p})`);
  }
  fs.writeFileSync('test-results/raporty/data/links-internal.json', JSON.stringify(results, null, 2));
  expect(bad, 'zepsute linki wewnetrzne').toEqual([]);
});

test('linki zewnetrzne: status HEAD/GET', async ({ request, browser }, info) => {
  test.skip(info.project.name !== 'chromium', 'raz');
  test.setTimeout(300_000);
  const pg = await browser.newPage();
  for (const p of PAGES) {
    await pg.goto(ORIGIN + '/portfolio/' + p);
    await pg.waitForLoadState('networkidle').catch(() => {});
    for (const h of await pg.$$eval('a[href]', as => as.map(a => (a as HTMLAnchorElement).href))) {
      const u = new URL(h);
      if (u.protocol.startsWith('http') && u.origin !== ORIGIN) (external[h] ||= []).push('/' + p);
    }
  }
  await pg.close();
  const out: any[] = [];
  const bad: string[] = [];
  for (const [url, from] of Object.entries(external)) {
    let status: number | string = 'ERR';
    try {
      let r = await request.head(url, { timeout: 15000, maxRedirects: 5 });
      if (r.status() >= 400) r = await request.get(url, { timeout: 15000, maxRedirects: 5 });
      status = r.status();
    } catch (e: any) { status = 'ERR ' + String(e.message).split('\n')[0]; }
    out.push({ url, from: [...new Set(from)], status });
    const ok = typeof status === 'number' && (status < 400 || status === 999 || status === 429);
    if (!ok) bad.push(`${status} ${url}`);
  }
  fs.writeFileSync('test-results/raporty/data/links-external.json', JSON.stringify(out, null, 2));
  expect(bad, 'zepsute linki zewnetrzne (999/429 tolerowane)').toEqual([]);
});

test('placeholdery w opublikowanej tresci', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium', 'raz');
  const found: string[] = [];
  for (const p of PAGES) {
    await page.goto(p);
    await page.waitForLoadState('networkidle').catch(() => {});
    const html = await page.content();
    for (const re of [/example\.com/, /twoj-profil/, /dQw4w9WgXcQ/, /ZMIEŃ/]) if (re.test(html)) found.push(`${re} na /${p}`);
  }
  expect(found, 'placeholdery').toEqual([]);
});
