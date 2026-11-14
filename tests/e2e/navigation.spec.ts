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

test('przelacznik motywu: zmienia klase html.dark, aria-pressed i zapamietuje wybor', async ({ page, viewport }) => {
  await page.goto('');
  if (isMobile(viewport!.width)) await expect(page.locator('nav summary')).toBeVisible();
  const toggle = page.locator('nav button[data-theme-toggle]').filter({ visible: true });
  await expect(toggle).toHaveCount(1);
  await expect(toggle).toHaveAttribute('aria-label', /Motyw|theme/i);
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains('dark'));
  const before = await isDark();
  await expect(toggle).toHaveAttribute('aria-pressed', String(before));
  await toggle.click();
  expect(await isDark()).toBe(!before);
  await expect(toggle).toHaveAttribute('aria-pressed', String(!before));
  // wybor przetrwa przeladowanie i dotyczy tez podstrony projektu (bez mignieciem: klasa jest ustawiona przed renderem)
  await page.goto('projects/Arct');
  expect(await isDark()).toBe(!before);
  await page.locator('nav button[data-theme-toggle]').filter({ visible: true }).click();
  expect(await isDark()).toBe(before);
});

test('przelacznik motywu: dziala tez gdy localStorage jest niedostepny', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  const c = collect(page);
  await page.goto('');
  await page.locator('nav button[data-theme-toggle]').filter({ visible: true }).click();
  expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true);
  expect(c.pageErrors).toEqual([]);
});

test('S-03: brak zdublowanej nawigacji (header + nav)', async ({ page, viewport }) => {
  test.skip(isMobile(viewport!.width), 'desktop');
  await page.goto('');
  expect(await page.locator('header, nav').filter({ visible: true }).count(), 'liczba widocznych header/nav').toBe(1);
});

for (const scheme of ['dark', 'light'] as const) {
  test(`S-09: systemowy motyw ${scheme} ustawia klase dark przed renderem`, async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: scheme });
    const page = await ctx.newPage();
    await page.goto('http://localhost:4399/portfolio/');
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(scheme === 'dark');
    // zapisany wybor wygrywa z systemem
    await page.evaluate(() => localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'light' : 'dark'));
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(scheme !== 'dark');
    await ctx.close();
  });
}
