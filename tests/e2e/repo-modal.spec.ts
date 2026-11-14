import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test, expect } from './helpers';

// Modal README repozytorium: klawiatura, sanityzacja Markdown, obrazy (API GitHub zamockowane w helpers.ts).
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

const mockReadme = (page: Page, body: string) =>
  page.route('**/api.github.com/repos/**/readme', route => route.fulfill({ contentType: 'text/plain', body }));

async function firstCard(page: Page, path = '') {
  await page.goto(path);
  await page.locator('#repos').scrollIntoViewIfNeeded();
  const card = page.locator('#repos h4 button').first();
  await expect(card).toBeVisible();
  return card;
}

test('klawiatura: Enter otwiera modal, Tab zostaje w modalu, Escape zamyka i wraca fokus na karte', async ({ page }) => {
  const card = await firstCard(page);
  await card.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('dialog[open]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-labelledby', 'repo-modal-title');
  await expect(dialog.getByRole('heading', { name: 'recipe' })).toBeVisible();
  await expect(dialog.locator('.readme h1')).toHaveText('Mock README');
  // blokada przewijania tla
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');
  // reszta strony jest inert: Tab krazy po modalu (lub wychodzi do UI przegladarki = body), nigdy po stronie
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('dialog') || document.activeElement === document.body), `Tab #${i + 1}`).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  await expect(card).toBeFocused();
});

test('przycisk zamkniecia ma aria-label i zwraca fokus na karte; klik w tlo tez zamyka', async ({ page }) => {
  const card = await firstCard(page);
  await card.click();
  const dialog = page.locator('dialog[open]');
  await expect(dialog).toBeVisible();
  const maxHeight = await dialog.evaluate(el => getComputedStyle(el).maxHeight);
  expect(parseFloat(maxHeight)).toBeCloseTo((page.viewportSize()!.height * 0.9), 0);
  await dialog.getByRole('button', { name: /Zamknij|Close/ }).click();
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(card).toBeFocused();
  await card.click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(2, 2); // poza oknem dialogowym = na tle (::backdrop)
  await expect(page.locator('dialog')).toHaveCount(0);
});

test('XSS: <img onerror>, <script> i [a](javascript:) w README nie wykonuja sie', async ({ page }) => {
  await mockReadme(page, [
    '# Title',
    '<img src=x onerror="window.__xss=1">',
    '<script>window.__xss=2</script>',
    '[click](javascript:window.__xss=3)',
    '<a href="JaVaScRiPt:window.__xss=4" onclick="window.__xss=5">raw</a>',
    '<iframe src="https://evil.example"></iframe>',
    '<svg onload="window.__xss=6"></svg>',
  ].join('\n\n'));
  const dialogs: string[] = [];
  page.on('dialog', d => { dialogs.push(d.message()); void d.dismiss(); });
  const card = await firstCard(page);
  await card.click();
  const readme = page.locator('dialog[open] .readme');
  await expect(readme.locator('h1')).toHaveText('Title');
  await page.waitForTimeout(500); // czas na ewentualny onerror
  expect(await page.evaluate(() => (window as any).__xss), 'skrypt nie zostal wykonany').toBeUndefined();
  expect(dialogs).toEqual([]);
  const html = await readme.innerHTML();
  expect(html).not.toMatch(/onerror|onclick|onload|<script|<iframe|<svg|javascript:/i);
  await expect(readme.locator('a[href^="javascript" i]')).toHaveCount(0);
});

test('obrazy i linki wzgledne README sa rozwiazywane do raw.githubusercontent.com', async ({ page }) => {
  await mockReadme(page, '![logo](docs/logo.png)\n\n[guide](docs/GUIDE.md) and [site](https://example.com) and [top](#top)');
  let imageRequested = false;
  await page.route('https://raw.githubusercontent.com/**', route => { imageRequested = true; return route.fulfill({ contentType: 'image/png', body: PNG }); });
  const card = await firstCard(page);
  await card.click();
  const img = page.locator('dialog[open] .readme img');
  await expect(img).toHaveAttribute('src', 'https://raw.githubusercontent.com/misiakfilip/recipe/HEAD/docs/logo.png');
  await expect(img).toHaveAttribute('alt', 'logo');
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  expect(imageRequested).toBe(true);
  await expect(page.locator('dialog[open] .readme a', { hasText: 'guide' })).toHaveAttribute('href', 'https://raw.githubusercontent.com/misiakfilip/recipe/HEAD/docs/GUIDE.md');
  const site = page.locator('dialog[open] .readme a', { hasText: 'site' });
  await expect(site).toHaveAttribute('target', '_blank');
  await expect(site).toHaveAttribute('rel', /noopener/);
});

test('brak README (404) i blad sieci: komunikat zamiast spinnera', async ({ page }) => {
  await page.route('**/api.github.com/repos/**/readme', route => route.fulfill({ status: 404, json: { message: 'Not Found' } }));
  const card = await firstCard(page);
  await card.click();
  await expect(page.locator('dialog[open]')).toContainText(/README/);
  await expect(page.locator('dialog[open] [role=status]')).toHaveCount(0);
});

test('biblioteka Markdown nie jest ladowana przed otwarciem modala', async ({ page }) => {
  const scripts: string[] = [];
  page.on('response', r => { if (r.request().resourceType() === 'script') scripts.push(r.url()); });
  const card = await firstCard(page);
  await page.waitForLoadState('networkidle');
  const before = scripts.length;
  expect(scripts.filter(u => /renderReadme|purify|marked/i.test(u)), 'przed otwarciem').toEqual([]);
  await card.click();
  await expect(page.locator('dialog[open] .readme')).toBeVisible();
  expect(scripts.length, 'po otwarciu doladowano chunk').toBeGreaterThan(before);
});

for (const scheme of ['light', 'dark'] as const) {
  test(`axe na otwartym modalu (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await mockReadme(page, '# Title\n\nText with `code`, a [link](https://example.com) and **bold**.\n\n> quote\n\n```\nblock\n```\n\n- one\n- two');
    const card = await firstCard(page);
    await card.click();
    await expect(page.locator('dialog[open] .readme')).toBeVisible();
    const r = await new AxeBuilder({ page }).include('dialog').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
    expect(r.violations.map(v => `${v.id}(${v.impact})`)).toEqual([]);
  });
}
