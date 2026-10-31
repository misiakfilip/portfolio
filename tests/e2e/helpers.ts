import { Page } from '@playwright/test';
export const PAGES = ['', 'projects/Arct', 'projects/brick-breaker', 'projects/skarbnik'];
export const VIEWPORTS = [375, 768, 1280, 1920];

export function collect(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failed: string[] = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text() + ' @' + (m.location().url || '')); });
  page.on('pageerror', e => pageErrors.push(String(e)));
  page.on('requestfailed', r => failed.push(`FAILED ${r.url()} ${r.failure()?.errorText}`));
  page.on('response', r => { if (r.status() >= 400) failed.push(`HTTP ${r.status()} ${r.url()}`); });
  return { consoleErrors, pageErrors, failed };
}

/** Hosty zewnetrzne, ktorych bledow (limity API, YouTube) nie przypisujemy stronie. */
export const isThirdParty = (s: string) => /youtube|ytimg|googlevideo|api\.github\.com|raw\.githubusercontent|jsdelivr/.test(s);
