// Skan dist/**/*.html: kazdy src/href/srcset/poster zaczynajacy sie od "/" musi miec prefiks /portfolio/
// (base z astro.config.mjs). Wykrywa tez sklejenia typu "/portfoliofavicon.svg". Bez przegladarki.
// Uzycie: npm run build && npm run test:dist
import fs from 'node:fs';
import path from 'node:path';

const BASE = '/portfolio';
const DIST = process.argv[2] ?? 'dist';

const walk = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : e.name.endsWith('.html') ? [full] : [];
  });

if (!fs.existsSync(DIST)) {
  console.error(`Brak katalogu ${DIST} - uruchom najpierw npm run build.`);
  process.exit(2);
}

const bad = [];
const files = walk(DIST);
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/\s(src|href|srcset|poster|content)="([^"]*)"/g)) {
    const urls = m[1] === 'srcset' ? m[2].split(',').map(v => v.trim().split(/\s+/)[0]) : [m[2]];
    for (const url of urls) {
      if (!url.startsWith('/') || url.startsWith('//')) continue;
      if (url !== BASE && !url.startsWith(`${BASE}/`)) bad.push(`${file}: ${m[1]}="${url}" (brak prefiksu ${BASE}/)`);
    }
  }
  for (const m of html.matchAll(/["'(=]\/portfolio[^/"')\s?#]\S{0,30}/g)) bad.push(`${file}: sklejenie "${m[0]}"`);
}

if (bad.length) {
  console.error(`Znaleziono ${bad.length} problemow ze sciezkami bez base:\n` + bad.join('\n'));
  process.exit(1);
}
console.log(`OK: ${files.length} plikow HTML w ${DIST}/ - wszystkie sciezki absolutne maja prefiks ${BASE}/`);
