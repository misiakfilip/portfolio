import { test, expect, PAGES, collect, isThirdParty } from './helpers';

// Obrazy: wymiary (brak CLS), sensowny alt, lazy poza pierwszym ekranem, brak 404.
for (const p of PAGES) {
  test.describe(`obrazy /${p}`, () => {
    test('kazdy img ma width, height i alt rozny od nazwy pliku', async ({ page }) => {
      await page.goto(p);
      const imgs = await page.$$eval('img', els =>
        els.map(i => ({ src: i.currentSrc || i.src, w: i.getAttribute('width'), h: i.getAttribute('height'), alt: i.getAttribute('alt') })),
      );
      expect(imgs.length).toBeGreaterThan(0);
      for (const i of imgs) {
        expect(Number(i.w), `width ${i.src}`).toBeGreaterThan(0);
        expect(Number(i.h), `height ${i.src}`).toBeGreaterThan(0);
        expect((i.alt ?? '').trim(), `alt ${i.src}`).not.toBe('');
        const file = decodeURIComponent(i.src.split('/').pop()!.split('?')[0]);
        const stem = file.replace(/\.\w+$/, '').replace(/\.[\w-]+$/, '').toLowerCase();
        const alt = i.alt!.trim().toLowerCase();
        expect(alt, `alt wyglada jak nazwa pliku: ${i.src}`).not.toMatch(/\.(png|jpe?g|webp|avif|svg)$/);
        expect(alt, `alt == nazwa pliku: ${i.src}`).not.toBe(stem);
        expect(alt, `alt == nazwa pliku: ${i.src}`).not.toBe(file.toLowerCase());
      }
    });

    test('obrazy ponizej pierwszego ekranu maja loading=lazy', async ({ page }) => {
      await page.goto(p);
      const vh = page.viewportSize()!.height;
      const imgs = await page.$$eval('img', els =>
        els.map(i => ({ src: i.src, top: i.getBoundingClientRect().top + window.scrollY, loading: i.getAttribute('loading') })),
      );
      for (const i of imgs.filter(i => i.top > vh)) {
        expect(i.loading, `below the fold: ${i.src}`).toBe('lazy');
      }
    });

    test('brak 404 obrazow po przewinieciu calej strony', async ({ page }) => {
      const c = collect(page);
      await page.goto(p);
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 40));
        }
      });
      await page.waitForLoadState('networkidle').catch(() => {});
      const bad = c.failed.filter(f => !isThirdParty(f) && /\.(png|jpe?g|webp|avif|svg)\b/i.test(f));
      expect(bad).toEqual([]);
    });
  });
}
