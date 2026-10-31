import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:4399/portfolio/';
const pages = {
  home: '', arct: 'projects/Arct', 'brick-breaker': 'projects/brick-breaker', skarbnik: 'projects/skarbnik',
  'en-home': 'en/', 'en-arct': 'en/projects/Arct', 'en-brick-breaker': 'en/projects/brick-breaker', 'en-skarbnik': 'en/projects/skarbnik',
};
const out = 'test-results/raporty/lighthouse';
fs.mkdirSync(out, { recursive: true });
const summary = [];

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
for (const [name, path] of Object.entries(pages)) {
  for (const form of ['mobile', 'desktop']) {
    const flags = { port: chrome.port, output: ['json', 'html'], logLevel: 'error', formFactor: form };
    const config = form === 'desktop'
      ? { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } } }
      : undefined;
    try {
      const r = await lighthouse(BASE + path, flags, config);
      const [json, html] = r.report;
      fs.writeFileSync(`${out}/${name}-${form}.json`, json);
      fs.writeFileSync(`${out}/${name}-${form}.html`, html);
      const l = r.lhr; const a = l.audits;
      summary.push({
        page: name, form,
        performance: Math.round(l.categories.performance.score * 100),
        accessibility: Math.round(l.categories.accessibility.score * 100),
        bestPractices: Math.round(l.categories['best-practices'].score * 100),
        seo: Math.round(l.categories.seo.score * 100),
        lcp: a['largest-contentful-paint'].displayValue, cls: a['cumulative-layout-shift'].displayValue,
        tbt: a['total-blocking-time'].displayValue, fcp: a['first-contentful-paint'].displayValue,
        failedAudits: Object.values(a).filter(x => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode !== 'notApplicable').map(x => x.id),
      });
      console.log(name, form, JSON.stringify(summary.at(-1)));
    } catch (e) {
      console.error('FAIL', name, form, e.message);
      summary.push({ page: name, form, error: e.message });
    }
  }
}
await chrome.kill();
fs.writeFileSync(`${out}/summary.json`, JSON.stringify(summary, null, 2));
