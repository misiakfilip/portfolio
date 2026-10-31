import { test, expect, PAGES, VIEWPORTS } from './helpers';

// Screenshoty robione tylko w projekcie chromium; overflow sprawdzany wszedzie.
for (const p of PAGES) for (const w of VIEWPORTS) {
  test(`viewport ${w}px /${p}: overflow poziomy + screenshot`, async ({ page }, info) => {
    await page.setViewportSize({ width: w, height: w < 768 ? 812 : 900 });
    await page.goto(p);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(500);
    const slug = (p || 'home').replace(/\//g, '-');
    if (info.project.name === 'chromium') {
      await page.screenshot({ path: `test-results/raporty/screenshots/${slug}-${w}.png` });
      await page.screenshot({ path: `test-results/raporty/screenshots/${slug}-${w}-full.png`, fullPage: true });
    }
    const o = await page.evaluate(() => {
      const de = document.documentElement;
      const cw = de.clientWidth;
      const wide = [...document.querySelectorAll('body *')]
        .filter(e => e.getBoundingClientRect().right > cw + 1 && getComputedStyle(e).position !== 'fixed')
        .slice(0, 5)
        .map(e => e.tagName + '.' + String((e as HTMLElement).className).slice(0, 60));
      return { sw: de.scrollWidth, cw, wide };
    });
    expect(o.sw, `scrollWidth ${o.sw} > clientWidth ${o.cw}; szerokie: ${o.wide.join(' | ')}`).toBeLessThanOrEqual(o.cw);
  });
}
