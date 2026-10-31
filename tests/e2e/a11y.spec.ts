import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import { PAGES } from './helpers';

for (const p of PAGES) {
  test(`axe /${p}`, async ({ page }, info) => {
    await page.goto(p);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
    const slug = (p || 'home').replace(/\//g, '-');
    const vp = (page.viewportSize()?.width ?? 0) < 768 ? 'mobile' : 'desktop';
    fs.writeFileSync(`test-results/raporty/axe/${slug}-${vp}-${info.project.name}.json`, JSON.stringify(r.violations.map(v => ({
      id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl, nodes: v.nodes.length,
      selectors: v.nodes.slice(0, 8).map(n => n.target.join(' ')),
    })), null, 2));
    const serious = r.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map(v => `${v.id}(${v.impact},${v.nodes.length})`), 'naruszenia serious/critical').toEqual([]);
  });
}
