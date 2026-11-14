import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import { test, expect, PAGES } from './helpers';

const SCHEMES = ['light', 'dark'] as const;

for (const scheme of SCHEMES) for (const p of PAGES) {
  test(`axe /${p} (${scheme})`, async ({ page }, info) => {
    // reduced motion: no carousel auto-advance or fade-in mid-scan (semi-transparent text would skew contrast)
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto(p);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(scheme === 'dark');
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
    const slug = (p || 'home').replace(/\//g, '-');
    const vp = (page.viewportSize()?.width ?? 0) < 768 ? 'mobile' : 'desktop';
    fs.writeFileSync(`test-results/raporty/axe/${slug}-${scheme}-${vp}-${info.project.name}.json`, JSON.stringify(r.violations.map(v => ({
      id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl, nodes: v.nodes.length,
      selectors: v.nodes.slice(0, 8).map(n => n.target.join(' ')),
    })), null, 2));
    const serious = r.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map(v => `${v.id}(${v.impact},${v.nodes.length})`), 'naruszenia serious/critical').toEqual([]);
    expect(r.violations.filter(v => v.id === 'color-contrast').map(v => v.nodes.map(n => n.target.join(' '))), 'color-contrast').toEqual([]);
  });
}

test('prefers-reduced-motion: tlo i karuzela nie sa animowane', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('');
  const state = await page.evaluate(() => {
    const bg = document.querySelector('.animate-gradient')!;
    return { duration: getComputedStyle(bg).animationDuration, scroll: getComputedStyle(document.documentElement).scrollBehavior };
  });
  expect(parseFloat(state.duration)).toBeLessThan(0.001);
  expect(state.scroll).toBe('auto');
});
