# CLAUDE.md

## Projekt
Osobista strona wizytówka/portfolio Filipa Misiaka (GitHub: misiakfilip). Jedna strona główna z sekcjami (Hero, About, Education, Achievements, Tech, Featured projects, Portfolio/GitHub repos, Contact) oraz podstrony projektów. Treść jest w `src/config.ts` (zawiera markery `ZMIEŃ` do uzupełnienia).

## Stack
- Astro 7.4 (Vite 8, kompilator Rust) (output statyczny, bez adaptera), React 19.2 (`@astrojs/react` 7.1), Tailwind 4.3 (`@tailwindcss/vite`, konfiguracja tylko w `global.css`), lucide-react, `marked` + `dompurify` (tylko modal README, ładowane dynamicznie), TypeScript.
- npm, Node 24 lokalnie; CI (build, deploy i test) Node 22 (`22` w setup-node), bo Astro 7 wymaga >= 22.23.4, a `@lhci/cli` i `lighthouse` 13 >= 22.19.
- Hosting: GitHub Pages, `site: https://misiakfilip.github.io`, `base: /portfolio`. Deploy: `.github/workflows/deploy.yml` (push na `main`).

## Struktura
- `src/pages/index.astro`, `src/pages/en/index.astro` – strona główna PL/EN (cienkie wrappery na `components/HomePage.astro`).
- `src/pages/projects/[slug].astro`, `src/pages/en/projects/[slug].astro` – podstrony projektów (`getStaticPaths` z `src/i18n/projects.ts`, render w `components/ProjectPage.astro`).
- `src/layouts/Layout.astro`, `ProjectLayout.astro` – układy i `<head>` (`lang`, `path` → `SeoHead`: canonical, hreflang, OG).
- `src/components/*.astro` – statyczne sekcje strony głównej (Nav, Hero, Timeline, FeaturedProjects, Contact), `Background`, `ThemeScript` (inline w `<head>`), `ThemeToggle`, `BrandIcon` (inline SVG GitHub/LinkedIn/YouTube); `components/project/*.astro` – sekcje podstron projektów.
- Wyspy React (jedyne, `client:visible`): `components/TechCarousel.tsx`, `components/GitHubRepos.tsx` (+ `RepoModal.tsx` na natywnym `<dialog>`, `utils/githubRepos.ts` – fetch REST API z cache w sessionStorage, `utils/renderReadme.ts` – marked + DOMPurify, `import()` dopiero po otwarciu modala). Nic innego nie jest hydratowane.
- `src/i18n/` – słowniki `pl.ts`/`en.ts`, `projects.ts` (treści podstron), helpery. `src/config.ts` – dane osobowe, projekty wyróżnione, `pinnedRepos`.
- `src/utils/loadGalleryImages.ts`, `withBase.ts`, `youtube.ts` (atrybuty iframe: nocookie, lazy); `src/styles/global.css`; `src/assets/` (obrazy optymalizowane przez astro:assets, `projects/` zrzuty ekranu, `avatar.webp`); `public/` (tylko statyczne: favicon, robots).

## i18n (decyzja architektoniczna)
- Osobne statyczne strony per język (routing plikowy Astro): PL bez prefiksu (`/`, `/projects/<slug>`), EN pod `/en/` (`/en/`, `/en/projects/<slug>`).
- Język wynika z URL, nie ze stanu klienta: przełącznik języka to zwykły `<a>` do odpowiednika strony (`localizedPath`), wyspy React dostają potrzebne teksty jako propsy.
- Teksty UI: `src/i18n/{pl,en}.ts` (typ `Dictionary` z `pl.ts` wymusza ten sam kształt), helpery `useTranslations`, `localizedPath`, `otherLang` w `src/i18n/index.ts`. Treści projektów: `src/i18n/projects.ts`; dane osobowe w `src/config.ts` kluczowane `pl`/`en`.
- `<html lang>`, `hreflang` (pl/en/x-default), canonical i `og:locale` ustawia `SeoHead` na podstawie propsów `lang` i `path` (ścieżka bez prefiksu języka).

## Motyw
- Przełącznik jasny/ciemny: klasa `dark` na `<html>` (`@custom-variant dark` w `global.css`), ustawiana przed renderem przez `ThemeScript` (localStorage `theme`, w razie braku `prefers-color-scheme`), przycisk `ThemeToggle` (mały skrypt, bez Reacta).
- Kolory przez tokeny semantyczne w `global.css` (`text-fg`, `text-body`, `text-muted`, `bg-card`, `border-line`, `text-accent`, `text-accent-2`, `bg-chip text-chip-fg`) – bez par `dark:`; obie palety mają kontrast >= 4.5:1 (axe `color-contrast` = 0 w obu). Tło strony jest też w `body` (`--page`), bo axe nie widzi gradientu `fixed`.
- `prefers-reduced-motion` wyłączone globalnie w `global.css`; fokus: jedna reguła `:focus-visible`.

## Komendy
- `npm ci` – instalacja
- `npm run dev` – serwer dev
- `npm run build` – build do `dist/`
- `npm run preview` – podgląd buildu
- `npx astro check` – typy (0 errors / 0 warnings / 0 hints), `npm run test:images` – budżet rozmiaru obrazów w `dist/`, `npm run test:dist` – skan `dist/**/*.html` pod kątem prefiksu `/portfolio/`.

- `npm run test:lhci` – Lighthouse CI (`lighthouserc.json`, 8 stron x 3 przebiegi, mobile; asercje: 4 kategorie >= 0.95, CLS <= 0.1, LCP <= 2500, TBT <= 200, brak błędów konsoli, skrypty <= 50 kB, obrazy <= 250 kB na stronę; ok. 4,5 min lokalnie).

## CI (`.github/workflows/deploy.yml`)
- Triggery: `push` na `main` (testy + deploy), `pull_request` (build + testy, bez deployu), `workflow_dispatch` z opcją `full` (FULL=1: Firefox, WebKit, iPhone).
- Job `test`: build, `astro check`, `test:dist`, `test:images`, Playwright (chromium + mobile-chrome; raport `playwright-report` jako artefakt przy porażce), `test:lhci`, `npm audit --audit-level=critical --omit=dev` (informacyjnie, `continue-on-error` do migracji na Astro 7). `deploy` wymaga `build` i `test`, działa tylko dla push na `main`.

## Konwencje
- Wszystko bez stanu to `.astro` (zero JS); React tylko dla interaktywnych wysp. Ikony: `lucide-react` renderowane po stronie serwera.
- Stylowanie klasami Tailwind inline.
- Obrazy przez `astro:assets` (`<Picture>`/`<Image>`: AVIF+WebP, srcset, width/height); pliki w `src/assets/` (zrzuty projektów: `src/assets/projects/`, wyszukiwanie po nazwie w `src/utils/projectImages.ts`), nie w `public/`. Alt zrzutów: `imageAlts` w `src/i18n/projects.ts`.

## Pułapki
- Wideo YouTube pokazuje się dopiero po wpisaniu `videoId` w `src/i18n/projects.ts` (walidacja ID w `utils/youtube.ts`).
- Ścieżki absolutne (`/favicon.svg`, `/projects/...`, `/downloads/...`) nie uwzględniają `base: /portfolio`; używaj `import.meta.env.BASE_URL` z poprawnym ukośnikiem.
- Dodając projekt: wpis w `src/i18n/projects.ts` (pl+en), wpis w `src/config.ts` (`featuredProjects` pl+en, `slug` gdy jest podstrona), obrazy w `src/assets/projects/` (+ `imageAlts` w `projects.ts`).
- Nie ma formularza kontaktowego (tylko `mailto`), nie ma analityki ani ciasteczek.
- Nie commituj `dist/`, `.astro/`, `node_modules/`.

## Testy i raporty
Testy w `tests/e2e/` mockują `api.github.com` (fixture w `helpers.ts`); nie zależą od limitu API. Preview na porcie 4399, base `/portfolio/`; wyniki i screenshoty (jasny/ciemny) w `test-results/raporty/` (lokalnie, w .gitignore).
- `npm run test:e2e` – Chromium + Pixel 7; pełna macierz (Firefox, WebKit, iPhone): `FULL=1` (PowerShell: `$env:FULL=1; npx playwright test --grep-invert @external`).
- Specyfikacje: `a11y` (axe z `wcag22aa`, oba motywy, reduced motion), `repo-modal` (klawiatura, XSS, obrazy), `youtube`, `navigation` (w tym motyw), `home`, `i18n`, `links`, `pages`, `visual`.
- `npm run test:lighthouse` (wszystkie 8 stron, mobile+desktop; `ONLY=home,en-home` ogranicza), `npm run test:html`.

## Raporty audytu (poza repo)
`../Astro-audyt/` (AUDYT-WYNIKI.md, PLAN-NAPRAWY.md, DECYZJE.md, notatki/). Zadania Z-14, Z-15, Z-16, Z-18, Z-20 zrobione; Z-13 i Z-21 (CI) zrobione; zostaje Astro 7.
