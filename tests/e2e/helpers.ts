import { test as base, expect, type Page } from '@playwright/test';

export { expect };

/** Language-neutral page list; PL pages have no prefix, EN pages live under en/. */
const SLUGS = ['', 'projects/Arct', 'projects/brick-breaker', 'projects/skarbnik'];
export const PAGES_PL = SLUGS;
export const PAGES_EN = SLUGS.map(s => (s ? `en/${s}` : 'en/'));
export const PAGES = [...PAGES_PL, ...PAGES_EN];
export const VIEWPORTS = [320, 375, 768, 1280, 1920];

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

/** Repozytoria zwracane przez zamockowane api.github.com (nigdy nie zalezymy od limitu zapytan). */
export const MOCK_REPOS = [
  { name: 'recipe', language: 'JavaScript', fork: false },
  { name: 'impostor-demo', language: 'TypeScript', fork: false },
  { name: 'forked-lib', language: 'Python', fork: true },
  ...Array.from({ length: 9 }, (_, i) => ({ name: `sample-repo-${i + 1}`, language: i % 2 ? 'C#' : 'Python', fork: false })),
].map((r, i) => ({
  id: i + 1,
  name: r.name,
  description: `Description of ${r.name}`,
  html_url: `https://github.com/misiakfilip/${r.name}`,
  homepage: null,
  stargazers_count: i,
  forks_count: 0,
  language: r.language,
  pushed_at: new Date(Date.UTC(2025, 0, 30 - i)).toISOString(),
  topics: ['demo'],
  fork: r.fork,
}));

export async function mockGithub(page: Page) {
  await page.route('**/api.github.com/users/*/repos*', route => route.fulfill({ json: MOCK_REPOS }));
  await page.route('**/api.github.com/repos/**/readme', route => route.fulfill({ contentType: 'text/plain', body: '# Mock README' }));
}

/** `test` z automatycznie zamockowanym GitHub API w kazdym tescie. */
export const test = base.extend({
  page: async ({ page }, use) => {
    await mockGithub(page);
    await use(page);
  },
});
