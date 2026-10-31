# CLAUDE.md

## Projekt
Osobista strona wizytówka/portfolio Filipa Misiaka (GitHub: misiakfilip). Jedna strona główna z sekcjami (Hero, About, Education, Achievements, Tech, Featured projects, Portfolio/GitHub repos, Contact) oraz podstrony projektów. Treść jest w `src/config.ts` (zawiera markery `ZMIEŃ` do uzupełnienia).

## Stack
- Astro 5.16.3 (output statyczny, bez adaptera), React 19.2 (`@astrojs/react`), Tailwind 4.1 (`@tailwindcss/vite`), lucide-react, TypeScript.
- npm, Node 24 lokalnie (CI używa Node 20).
- Hosting: GitHub Pages, `site: https://misiakfilip.github.io`, `base: /portfolio`. Deploy: `.github/workflows/deploy.yml` (push na `main`).

## Struktura
- `src/pages/index.astro` – strona główna, montuje komponenty React (`client:load`).
- `src/pages/projects/{Arct,brick-breaker,skarbnik}.astro` – podstrony projektów.
- `src/layouts/Layout.astro`, `ProjectLayout.astro` – układy i `<head>`.
- `src/components/*.tsx` – sekcje strony i komponenty projektów.
- `src/config.ts` – dane osobowe, teksty, linki, lista projektów.
- `src/utils/loadGalleryImages.ts` – ładowanie galerii projektu.
- `src/styles/global.css` – style globalne Tailwind.
- `public/` – statyczne zasoby, w tym `public/projects/` (zrzuty ekranu projektów).

## i18n (decyzja architektoniczna)
- Osobne statyczne strony per język (routing plikowy Astro): PL bez prefiksu (`/`, `/projects/<slug>`), EN pod `/en/` (`/en/`, `/en/projects/<slug>`).
- Język wynika z URL, nie ze stanu klienta: przełącznik języka to zwykły `<a>` do odpowiednika strony (`localizedPath`), wyspy React dostają potrzebne teksty jako propsy.
- Teksty UI: `src/i18n/{pl,en}.ts` (typ `Dictionary` z `pl.ts` wymusza ten sam kształt), helpery `useTranslations`, `getLangFromUrl`, `localizedPath` w `src/i18n/index.ts`. Treści projektów: `src/i18n/projects.ts`; dane osobowe w `src/config.ts` kluczowane `pl`/`en`.
- `<html lang>`, `hreflang` (pl/en/x-default), canonical i `og:locale` ustawia `SeoHead` na podstawie propsów `lang` i `path` (ścieżka bez prefiksu języka).

## Komendy
- `npm ci` – instalacja
- `npm run dev` – serwer dev
- `npm run build` – build do `dist/`
- `npm run preview` – podgląd buildu
- `astro check`, lint, testy: jeszcze nie skonfigurowane (`astro check` wymaga `@astrojs/check` i `typescript`).

## Konwencje
- Komponenty sekcji to React `.tsx`, strony i layouty to `.astro`.
- Stylowanie klasami Tailwind inline.
- Aktualnie surowe `<img>` zamiast `astro:assets`.

## Pułapki
- Ścieżki absolutne (`/favicon.svg`, `/projects/...`, `/downloads/...`) nie uwzględniają `base: /portfolio`; używaj `import.meta.env.BASE_URL` z poprawnym ukośnikiem.
- Dodając projekt: nowy plik w `src/pages/projects/`, wpis w `src/config.ts`, obrazy w `public/projects/<nazwa>/`.
- Nie ma formularza kontaktowego (tylko `mailto`), nie ma analityki ani ciasteczek.
- Nie commituj `dist/`, `.astro/`, `node_modules/`.

## Testy i raporty
Playwright, Lighthouse i axe zostaną dodane w Etapie 4 (testy w `tests/e2e/`, raporty w `docs/`).

## Stan audytu
- Notatki: `../Astro-audyt/notatki/01-rekonesans.md`, `../Astro-audyt/notatki/02-komendy.md`
- Notatki z testów i przeglądu: `../Astro-audyt/notatki/03-przeglad-kodu.md`, `../Astro-audyt/notatki/04-testy.md`; dowody w `test-results/raporty/` (lokalnie, w .gitignore)
- Raport: `../Astro-audyt/AUDYT-WYNIKI.md` (40 problemów)
- Plan naprawy: `../Astro-audyt/PLAN-NAPRAWY.md`
- Audyt zakończony; kodu strony nie naprawiamy do zatwierdzenia planu.
- Testy: `npm run test:e2e`, `npm run test:lighthouse`, `npm run test:html` (Playwright w `tests/e2e/`; preview na porcie 4399, base `/portfolio/`).
