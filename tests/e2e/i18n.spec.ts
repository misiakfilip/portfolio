import { test, expect, PAGES_PL, PAGES_EN } from './helpers';

// Slowa interfejsu, ktore nie moga pojawic sie w obcojezycznej wersji strony.
const PL_ONLY = ['Wyróżnione', 'Skontaktuj', 'Wykształcenie', 'Zobacz projekt', 'Powrót', 'Główne funkcje', 'Zrzuty ekranu', 'Dokumentacja', 'Przydatne linki', 'Cześć', 'Wszystkie prawa', 'Pobierz', 'Znaleziono', 'Ładowanie'];
const EN_ONLY = ['Featured Projects', 'Get In Touch', 'View project', 'Back to', 'Key features', 'Screenshots', 'Technical documentation', 'Useful links', 'All rights reserved', 'Found:', 'Loading'];

const bodyText = async (page: import('@playwright/test').Page, path: string) => {
  await page.goto(path);
  if (await page.locator('#repos').count()) await page.locator('#repos').scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle').catch(() => {});
  return page.locator('body').innerText();
};

for (const path of PAGES_EN) {
  test(`EN /${path}: brak polskich tekstow interfejsu i opisow`, async ({ page }) => {
    const text = await bodyText(page, path);
    const found = PL_ONLY.filter(w => text.includes(w));
    expect(found, 'polskie teksty na stronie EN').toEqual([]);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
}

for (const path of PAGES_PL) {
  test(`PL /${path}: brak angielskich tekstow interfejsu`, async ({ page }) => {
    const text = await bodyText(page, path);
    const found = EN_ONLY.filter(w => text.includes(w));
    expect(found, 'angielskie teksty na stronie PL').toEqual([]);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
  });
}

for (const [i, plPath] of PAGES_PL.entries()) {
  test(`przelacznik jezyka na /${plPath} prowadzi do odpowiednika i z powrotem (zwykly link)`, async ({ page }) => {
    await page.goto(plPath);
    const openMenu = async () => { if (await page.locator('nav summary').isVisible()) await page.locator('nav summary').click(); };
    await openMenu();
    const toEn = page.locator('nav a[hreflang="en"]:visible').first();
    expect(await toEn.getAttribute('href')).toMatch(new RegExp(`/portfolio/${PAGES_EN[i].replace(/\/$/, '')}/?$`));
    await toEn.click();
    await expect(page).toHaveURL(new RegExp(`/portfolio/${PAGES_EN[i]}$`.replace(/\/\$$/, '/?$')));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await openMenu();
    await page.locator('nav a[hreflang="pl"]:visible').first().click();
    await expect(page).toHaveURL(new RegExp(`/portfolio/${plPath}/?$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
  });
}

test('podstrony projektow EN maja przetlumaczony tytul, opis i sekcje', async ({ page }) => {
  await page.goto('en/projects/skarbnik');
  await expect(page.locator('h1')).toContainText('Survival Horror Game');
  await expect(page.locator('main h2')).toContainText(['About the project', 'Key features', 'Screenshots', 'Technical documentation', 'Design challenges', 'Useful links']);
});
