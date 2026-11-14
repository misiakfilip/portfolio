import { test, expect } from '@playwright/test';
import { isYouTubeId, youtubeIframeAttrs } from '../../src/utils/youtube';

// Wideo sa ukryte do czasu podania ID (config), wiec sciezka renderowania jest testowana na podstawionym ID.
test('iframe YouTube: nocookie, lazy, title, referrerpolicy, bez autoplay', () => {
  const a = youtubeIframeAttrs('abcDEF12345', 'Rozgrywka');
  expect(a.src).toBe('https://www.youtube-nocookie.com/embed/abcDEF12345');
  expect(a.loading).toBe('lazy');
  expect(a.title).toBe('Rozgrywka');
  expect(a.referrerpolicy).toBe('strict-origin-when-cross-origin');
  expect(a.allow).not.toContain('autoplay');
  expect(a.allowfullscreen).toBe(true);
});

test('iframe YouTube: nieprawidlowe ID jest odrzucane (blad builda zamiast zlego URL)', () => {
  for (const bad of ['', 'short', 'abc"onload="x', 'abcDEF12345/../x', 'abcDEF1234 ']) {
    expect(isYouTubeId(bad), bad).toBe(false);
    expect(() => youtubeIframeAttrs(bad, 't')).toThrow();
  }
});

test('podstrony projektow nie zawieraja iframe, dopoki nie ma videoId', async ({ request }) => {
  for (const p of ['projects/Arct', 'projects/brick-breaker', 'projects/skarbnik']) {
    const html = await (await request.get(p)).text();
    expect(html, p).not.toMatch(/<iframe|youtube/i);
  }
});
