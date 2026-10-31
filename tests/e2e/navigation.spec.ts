import { test, expect } from '@playwright/test';
import { collect } from './helpers';

const isMobile = (vw: number) => vw < 768;

test('nawigacja desktop: przyciski przewijaja do sekcji (kotwice)', async ({ page, viewport }) => {
  test.skip(isMobile(viewport!.width), 'tylko desktop');
  await page.goto('');
  await page.waitForSelector('nav.fixed button');
  const ids = ['home', 'about', 'education', 'projects', 'contact'];
  const btns = page.locator('nav.fixed div.hidden > button');
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    expect(await page.locator(`#${id}`).count(), `element #${id}`).toBe(1);
    // przewin najpierw gdzie indziej, aby home tez byl testem
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await btns.nth(i).click();
    await page.waitForTimeout(1500);
    const top = await page.locator(`#${id}`).evaluate(e => Math.round(e.getBoundingClientRect().top));
    expect.soft(Math.abs(top), `#${id} top po kliknieciu`).toBeLessThan(150);
  }
});

test('przelacznik jezyka PL/EN dziala', async ({ page, viewport }) => {
  test.skip(isMobile(viewport!.width), 'desktop');
  await page.goto('');
  const btn = page.locator('nav.fixed').getByRole('button', { name: /^(EN|PL)$/ }).first();
  await btn.waitFor();
  const before = await page.locator('nav.fixed').innerText();
  await btn.click();
  expect(await page.locator('nav.fixed').innerText()).not.toBe(before);
});

test('S-01: menu mobilne otwiera sie bez crashu', async ({ page, viewport }) => {
  test.skip(!isMobile(viewport!.width), 'tylko mobile');
  const c = collect(page);
  await page.goto('');
  await page.waitForSelector('nav');
  const burger = page.locator('nav.fixed button.md\\:hidden');
  await expect(burger).toBeVisible();
  await burger.click();
  await page.waitForTimeout(500);
  expect.soft(c.pageErrors, 'bledy JS po otwarciu menu').toEqual([]);
  expect(await page.locator('nav.fixed').count(), 'nav nadal w DOM (drzewo React nie odmontowane)').toBe(1);
  await expect(page.locator('nav.fixed').getByText(/Wykształcenie|Education/)).toBeVisible();
});

test('menu mobilne: klik w pozycje przewija i zamyka menu', async ({ page, viewport }) => {
  test.skip(!isMobile(viewport!.width), 'tylko mobile');
  await page.goto('');
  await page.locator('nav.fixed button.md\\:hidden').click();
  await page.waitForTimeout(300);
  await page.locator('nav.fixed').getByRole('button', { name: /O mnie|About/ }).click();
  await page.waitForTimeout(1500);
  const top = await page.locator('#about').evaluate(e => Math.round(e.getBoundingClientRect().top));
  expect(Math.abs(top)).toBeLessThan(150);
});

test('przelacznik motywu: istnieje i zmienia klase html.dark', async ({ page, viewport }) => {
  await page.goto('');
  await page.waitForSelector('nav');
  if (isMobile(viewport!.width)) await page.locator('nav.fixed button.md\\:hidden').click();
  const toggle = page.locator('nav.fixed button:has(svg.lucide-sun), nav.fixed button:has(svg.lucide-moon)').filter({ visible: true });
  expect(await toggle.count(), 'widoczny przelacznik motywu').toBeGreaterThan(0);
  const before = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await toggle.first().click();
  const after = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  expect(after).not.toBe(before);
});

test('S-03: brak zdublowanej nawigacji (header + nav)', async ({ page, viewport }) => {
  test.skip(isMobile(viewport!.width), 'desktop');
  await page.goto('');
  await page.waitForSelector('nav');
  expect(await page.locator('header, nav.fixed').filter({ visible: true }).count(), 'liczba widocznych header/nav').toBe(1);
});

test('S-09: ciemny motyw systemowy daje klase dark', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4399/portfolio/');
  await page.waitForSelector('nav');
  const hasDarkClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await ctx.close();
  expect(hasDarkClass, 'klasa dark zgodna z systemowym ciemnym motywem').toBe(true);
});
