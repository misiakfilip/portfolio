import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import { test, expect, PAGES } from './helpers';

const SCHEMES = ['light', 'dark'] as const;

for (const scheme of SCHEMES) for (const p of PAGES) {
  test(`axe /${p} (${scheme})`, async ({ page }, info) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto(p);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(scheme === 'dark');
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
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
