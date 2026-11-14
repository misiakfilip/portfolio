// Budzet rozmiaru obrazow w dist/ (po optymalizacji astro:assets). Bez przegladarki.
// Uzycie: npm run build && npm run test:images
// Przed optymalizacja (public/projects serwowane 1:1 + duplikaty w dist): 62 MB obrazow, dist 63 MB.
import fs from 'node:fs';
import path from 'node:path';

const DIST = process.argv[2] ?? 'dist';
const TOTAL_MB = 10;      // suma wszystkich obrazow w dist
const SINGLE_KB = 400;    // pojedynczy plik (najwiekszy wariant AVIF/WebP)
const RASTER = /\.(png|jpe?g|webp|avif|gif)$/i;

const walk = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });

if (!fs.existsSync(DIST)) {
  console.error(`Brak katalogu ${DIST} - uruchom najpierw npm run build.`);
  process.exit(2);
}

const files = walk(DIST).filter(f => /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f)).map(f => ({ f, size: fs.statSync(f).size }));
const total = files.reduce((s, x) => s + x.size, 0);
const errors = [];
for (const x of files.filter(x => RASTER.test(x.f) && x.size > SINGLE_KB * 1024)) errors.push(`${x.f}: ${(x.size / 1024).toFixed(0)} kB > ${SINGLE_KB} kB`);
for (const x of files.filter(x => /\.(png|jpe?g)$/i.test(x.f))) errors.push(`${x.f}: surowy PNG/JPEG w dist (powinien isc przez astro:assets)`);
if (total > TOTAL_MB * 1024 * 1024) errors.push(`suma obrazow ${(total / 1048576).toFixed(1)} MB > ${TOTAL_MB} MB`);

console.log(`Obrazy w dist: ${files.length} plikow, ${(total / 1048576).toFixed(1)} MB (budzet ${TOTAL_MB} MB)`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('OK');
