import { test, expect, collect, isThirdParty, MOCK_REPOS } from './helpers';

const SECTIONS = ['home', 'about', 'education', 'projects', 'repos', 'contact'];
const NAV_ITEMS = 5;
const REPOS_URL = '**/api.github.com/users/*/repos*';

for (const [lang, path] of [['pl', ''], ['en', 'en/']] as const) {
  test.describe(`strona glowna (${lang})`, () => {
    test('API GitHub zablokowane: sekcje widoczne, komunikat bledu, brak spinnera i bledow JS', async ({ page }) => {
      await page.route('**/api.github.com/**', route => route.abort());
      const c = collect(page);
      await page.goto(path);
      for (const id of SECTIONS) await expect(page.locator(`#${id}`), `#${id}`).toBeAttached();
      for (const id of SECTIONS.filter(s => s !== 'repos')) await expect(page.locator(`#${id}`)).toBeVisible();
      await page.locator('#repos').scrollIntoViewIfNeeded();
      await expect(page.locator('#repos [role=alert]')).toBeVisible();
      await expect(page.locator('#repos [role=alert] button')).toHaveCount(1); // "Sprobuj ponownie"
      await expect(page.locator('.animate-spin')).toHaveCount(0);
      await expect(page.getByText(/Loading portfolio/i)).toHaveCount(0);
      // nawet bez API strona nie jest pusta
      await expect(page.locator('#projects')).toContainText('Retro Brick Breaker');
      expect(c.pageErrors, 'uncaught exceptions').toEqual([]);
      expect(c.consoleErrors.filter(e => !isThirdParty(e)), 'console errors').toEqual([]);
    });

    test('limit API (403): komunikat o limicie, a po ponowieniu lista repozytoriow', async ({ page }) => {
      let calls = 0;
      await page.route(REPOS_URL, route => (++calls === 1 ? route.fulfill({ status: 403, json: { message: 'rate limit' } }) : route.fulfill({ json: MOCK_REPOS })));
      await page.goto(path);
      await page.locator('#repos').scrollIntoViewIfNeeded();
      await expect(page.locator('#repos [role=alert]')).toContainText(lang === 'pl' ? 'Limit zapytań' : 'rate limit');
      await page.locator('#repos [role=alert] button').click();
      await expect(page.locator('#repos [role=alert]')).toHaveCount(0);
      await expect(page.locator('#repos h4').first()).toBeVisible();
      expect(calls).toBe(2);
    });

    test('repozytoria: kuratorowana lista, sortowanie po aktywnosci, forki ukryte, jedno zadanie na wejscie', async ({ page }) => {
      let calls = 0;
      await page.route(REPOS_URL, route => { calls++; return route.fulfill({ json: MOCK_REPOS }); });
      await page.goto(path);
      await page.locator('#repos').scrollIntoViewIfNeeded();
      const names = page.locator('#repos h4');
      await expect(names.first()).toBeVisible();
      // przypiete (config.pinnedRepos) na poczatku, w zadanej kolejnosci
      await expect(names.nth(0)).toHaveText('recipe');
      await expect(names.nth(1)).toHaveText('impostor-demo');
      // reszta wg aktywnosci, bez forkow; strona po 6
      await expect(names.nth(2)).toHaveText('sample-repo-1');
      await expect(page.locator('#repos h4', { hasText: 'forked-lib' })).toHaveCount(0);
      await expect(names).toHaveCount(2 + 6);
      await page.getByRole('button', { name: lang === 'pl' ? 'Pokaż więcej' : 'Show more' }).click();
      await expect(names).toHaveCount(2 + 9);
      await page.getByLabel(lang === 'pl' ? 'Pokaż forki' : 'Show forks').check();
      await expect(page.locator('#repos h4', { hasText: 'forked-lib' })).toHaveCount(1);
      // cache w sessionStorage: ponowne wejscie nie wysyla zadania
      await page.reload();
      await page.locator('#repos').scrollIntoViewIfNeeded();
      await expect(page.locator('#repos h4').first()).toBeVisible();
      expect(calls, 'zadania do api.github.com (z cache po reloadzie)').toBe(1);
    });

    test('bez JavaScriptu tresc sekcji jest w HTML', async ({ browser }) => {
      const ctx = await browser.newContext({ javaScriptEnabled: false });
      const page = await ctx.newPage();
      await page.goto('http://localhost:4399/portfolio/' + path);
      for (const id of SECTIONS) await expect(page.locator(`#${id}`), `#${id}`).toBeAttached();
      await expect(page.locator('h1')).toContainText('Filip Misiak');
      await expect(page.locator('#about')).toContainText('Comtrade');
      await expect(page.locator('#education')).toContainText(lang === 'pl' ? 'Studia I Stopnia' : 'Bachelor');
      await expect(page.locator('#projects')).toContainText('Skarbnik');
      await expect(page.locator('#contact a[href^="mailto:"]').first()).toBeAttached();
      // wszystkie technologie sa w DOM (karuzela renderuje je po stronie serwera)
      expect(await page.locator('section[aria-labelledby=tech-title] li').count()).toBeGreaterThanOrEqual(18);
      // menu mobilne jest natywnym <details> - ma te same pozycje bez JS
      expect(await page.locator('details#mobile-nav a[href^="#"]').count()).toBe(NAV_ITEMS);
      await ctx.close();
    });

    test('tylko dwie wyspy React (karuzela i repozytoria), brak spinnera "Loading portfolio"', async ({ page }) => {
      const html = await (await page.request.get(path)).text();
      expect((html.match(/<astro-island/g) ?? []).length).toBe(2);
      expect(html).not.toMatch(/Loading portfolio/i);
      expect(html, "spinner w znacznikach").not.toMatch(/class="[^"]*animate-spin/);
      expect(html).not.toMatch(/client="load"/);
    });

    test('karuzela technologii: reduced motion = brak auto-przewijania, przycisk pauzy dziala', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      const group = page.locator('[aria-roledescription=carousel]');
      await group.scrollIntoViewIfNeeded();
      const active = group.locator('button[aria-current]');
      await expect(active).toHaveCount(1);
      const before = await active.getAttribute('aria-label');
      await page.waitForTimeout(4600);
      expect(await active.getAttribute('aria-label'), 'aktywny slajd nie zmienia sie przy reduced motion').toBe(before);
      // uzytkownik moze jawnie wznowic, a potem wstrzymac
      await group.getByRole('button', { name: /Resume|Wznów/ }).click();
      await expect(group.getByRole('button', { name: /Pause|Wstrzymaj/ })).toBeVisible();
    });

    test('karuzela technologii: bez reduced motion przewija sie i da sie wstrzymac', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto(path);
      const group = page.locator('[aria-roledescription=carousel]');
      await group.scrollIntoViewIfNeeded();
      const label = () => group.locator('button[aria-current]').getAttribute('aria-label');
      const before = await label();
      await expect.poll(label, { timeout: 8000 }).not.toBe(before);
      await group.getByRole('button', { name: /Pause|Wstrzymaj/ }).click();
      await page.mouse.move(0, 0);
      const paused = await label();
      await page.waitForTimeout(4600);
      expect(await label()).toBe(paused);
    });
  });
}
