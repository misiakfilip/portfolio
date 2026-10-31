# CLAUDE.md

## Projekt
Osobista strona wizytówka/portfolio Filipa Misiaka (GitHub: misiakfilip). Jedna strona główna z sekcjami (Hero, About, Education, Achievements, Tech, Featured projects, Portfolio/GitHub repos, Contact) oraz podstrony projektów. Treść jest w `src/config.ts` (zawiera markery `ZMIEŃ` do uzupełnienia).

## Stack
- Astro 5.16.3 (output statyczny, bez adaptera), React 19.2 (`@astrojs/react`), Tailwind 4.1 (`@tailwindcss/vite`), lucide-react, TypeScript.
- npm, Node 24 lokalnie (CI używa Node 20).
- Hosting: GitHub Pages, `site: https://misiakfilip.github.io`, `base: /portfolio`. Deploy: `.github/workflows/deploy.yml` (push na `main`).

## Struktura
- `src/pages/index.astro`, `src/pages/en/index.astro` – strona główna PL/EN (cienkie wrappery na `components/HomePage.astro`).
- `src/pages/projects/[slug].astro`, `src/pages/en/projects/[slug].astro` – podstrony projektów (`getStaticPaths` z `src/i18n/projects.ts`, render w `components/ProjectPage.astro`).
- `src/layouts/Layout.astro`, `ProjectLayout.astro` – układy i `<head>` (`lang`, `path` → `SeoHead`: canonical, hreflang, OG).
- `src/components/*.astro` – statyczne sekcje strony głównej (Nav, Hero, Timeline, FeaturedProjects, Contact), `components/project/*.astro` – sekcje podstron projektów.
- Wyspy React (jedyne, `client:visible`): `components/TechCarousel.tsx`, `components/GitHubRepos.tsx` (+ `RepoModal.tsx`, `utils/githubRepos.ts` – fetch REST API z cache w sessionStorage). Nic innego nie jest hydratowane.
- `src/i18n/` – słowniki `pl.ts`/`en.ts`, `projects.ts` (treści podstron), helpery. `src/config.ts` – dane osobowe, projekty wyróżnione, `pinnedRepos`.
- `src/utils/loadGalleryImages.ts`, `withBase.ts`; `src/styles/global.css`; `public/` (zasoby statyczne, `public/projects/` zrzuty ekranu, `public/avatar.webp`).

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
- `npx astro check` – typy (0 errors), `npm run test:dist` – skan `dist/**/*.html` pod kątem prefiksu `/portfolio/`.

## Konwencje
- Wszystko bez stanu to `.astro` (zero JS); React tylko dla interaktywnych wysp. Ikony: `lucide-react` renderowane po stronie serwera.
- Stylowanie klasami Tailwind inline.
- Aktualnie surowe `<img>` zamiast `astro:assets`.

## Pułapki
- Ścieżki absolutne (`/favicon.svg`, `/projects/...`, `/downloads/...`) nie uwzględniają `base: /portfolio`; używaj `import.meta.env.BASE_URL` z poprawnym ukośnikiem.
- Dodając projekt: wpis w `src/i18n/projects.ts` (pl+en), wpis w `src/config.ts` (`featuredProjects` pl+en ze `slug`), obrazy w `public/projects/`.
- Nie ma formularza kontaktowego (tylko `mailto`), nie ma analityki ani ciasteczek.
- Nie commituj `dist/`, `.astro/`, `node_modules/`.

## Testy i raporty
Testy w `tests/e2e/` mockują `api.github.com` (fixture w `helpers.ts`); nie zależą od limitu API.

## Stan audytu
- Notatki: `../Astro-audyt/notatki/01-rekonesans.md`, `../Astro-audyt/notatki/02-komendy.md`
- Notatki z testów i przeglądu: `../Astro-audyt/notatki/03-przeglad-kodu.md`, `../Astro-audyt/notatki/04-testy.md`; dowody w `test-results/raporty/` (lokalnie, w .gitignore)
- Raport: `../Astro-audyt/AUDYT-WYNIKI.md` (40 problemów)
- Plan naprawy: `../Astro-audyt/PLAN-NAPRAWY.md`
- Audyt zakończony; kodu strony nie naprawiamy do zatwierdzenia planu.
- Testy: `npm run test:e2e`, `npm run test:lighthouse`, `npm run test:html` (Playwright w `tests/e2e/`; preview na porcie 4399, base `/portfolio/`).
