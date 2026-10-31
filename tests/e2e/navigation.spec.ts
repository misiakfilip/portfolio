import { test, expect, collect } from './helpers';

const isMobile = (vw: number) => vw < 768;
const IDS = ['home', 'about', 'education', 'projects', 'contact'];
const desktopLinks = 'nav > div > div > div.hidden > a[href^="#"]';

test('nawigacja desktop: przyciski przewijaja do sekcji (kotwice)', async ({ page, viewport }) => {
  test.skip(isMobile(viewport!.width), 'tylko desktop');
  await page.goto('');
  const links = page.locator(desktopLinks);
  await expect(links).toHaveCount(IDS.length);
  for (let i = 0; i < IDS.length; i++) {
    const id = IDS[i];
    expect(await page.locator(`#${id}`).count(), `element #${id}`).toBe(1);
    // przewin najpierw gdzie indziej, aby home tez byl testem
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await links.nth(i).click();
    await page.waitForTimeout(1500);
    const top = await page.locator(`#${id}`).evaluate(e => Math.round(e.getBoundingClientRect().top));
    expect.soft(Math.abs(top), `#${id} top po kliknieciu`).toBeLessThan(150);
  }
});

test('przelacznik jezyka to zwykly link do odpowiednika strony (PL <-> EN)', async ({ page, viewport }) => {
  test.skip(isMobile(viewport!.width), 'desktop');
  await page.goto('');
  const toEn = page.locator('nav').getByRole('link', { name: /^EN:/ });
  await expect(toEn).toHaveAttribute('href', /\/portfolio\/en\/$/);
  const plText = await page.locator('nav').innerText();
  await toEn.click();
  await expect(page).toHaveURL(/\/portfolio\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.locator('nav').innerText()).not.toBe(plText);
  await page.locator('nav').getByRole('link', { name: /^PL:/ }).click();
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
});

test('S-01: menu mobilne otwiera sie bez bledow i pokazuje pozycje', async ({ page, viewport }) => {
  test.skip(!isMobile(viewport!.width), 'tylko mobile');
  const c = collect(page);
  await page.goto('');
  const burger = page.locator('nav summary');
  await expect(burger).toBeVisible();
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await burger.click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await expect(page.locator('#mobile-menu').getByText(/Wykształcenie|Education/)).toBeVisible();
  expect(c.pageErrors, 'bledy JS po otwarciu menu').toEqual([]);
});

test('menu mobilne: klik w pozycje przewija i zamyka menu', async ({ page, viewport }) => {
  test.skip(!isMobile(viewport!.width), 'tylko mobile');
  await page.goto('');
  await page.locator('nav summary').click();
  await page.locator('#mobile-menu').getByRole('link', { name: /O mnie|About/ }).click();
  await page.waitForTimeout(1500);
  const top = await page.locator('#about').evaluate(e => Math.round(e.getBoundingClientRect().top));
  expect(Math.abs(top)).toBeLessThan(150);
  await expect(page.locator('#mobile-menu')).toBeHidden();
});

test('menu mobilne: Escape zamyka menu', async ({ page, viewport }) => {
  test.skip(!isMobile(viewport!.width), 'tylko mobile');
  await page.goto('');
  await page.locator('nav summary').click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu')).toBeHidden();
});

test('menu mobilne zawiera te same pozycje i link jezyka co nawigacja desktop', async ({ page }) => {
  await page.goto('');
  const hrefs = (sel: string) => page.locator(sel).evaluateAll(els => els.map(e => e.getAttribute('href')));
  const desktop = await hrefs(`${desktopLinks}, nav > div > div > div.hidden > a[hreflang]`);
  const mobile = await hrefs('#mobile-menu a');
  expect(desktop.length).toBeGreaterThan(IDS.length);
  expect(mobile).toEqual(desktop);
});

// Z-14 (przelacznik jasny/ciemny) jest osobnym etapem; testy ponizej zostaja jako wymaganie do spelnienia.
test('przelacznik motywu: istnieje i zmienia klase html.dark', async ({ page, viewport }) => {
  test.fixme(true, 'Z-14: przelacznik motywu jeszcze nie zaimplementowany');
  await page.goto('');
  if (isMobile(viewport!.width)) await page.locator('nav summary').click();
  const toggle = page.locator('nav button[aria-label*="otyw"], nav button[aria-label*="heme"]').filter({ visible: true });
  expect(await toggle.count(), 'widoczny przelacznik motywu').toBeGreaterThan(0);
  const before = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await toggle.first().click();
  const after = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  expect(after).not.toBe(before);
});

test('S-03: brak zdublowanej nawigacji (header + nav)', async ({ page, viewport }) => {
  test.skip(isMobile(viewport!.width), 'desktop');
  await page.goto('');
  expect(await page.locator('header, nav').filter({ visible: true }).count(), 'liczba widocznych header/nav').toBe(1);
});

test('S-09: ciemny motyw systemowy daje klase dark', async ({ browser }) => {
  test.fixme(true, 'Z-14: klasa dark ustawiana skryptem w <head> jeszcze nie istnieje');
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4399/portfolio/');
  const hasDarkClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await ctx.close();
  expect(hasDarkClass, 'klasa dark zgodna z systemowym ciemnym motywem').toBe(true);
});
