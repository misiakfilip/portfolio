# Prompt dla Claude Code: audyt, testy i plan naprawy strony wizytówki/portfolio w Astro

Działasz jako senior frontend developer / QA. Twoim zadaniem jest przeprowadzenie pełnego audytu projektu strony wizytówki/portfolio zbudowanej w Astro, jej przetestowanie oraz przygotowanie planu naprawy wszystkich wykrytych błędów. Pracuj etapami, w podanej kolejności. Na końcu każdego etapu krótko podsumuj wynik i dopiero wtedy przejdź dalej.

## Zasady ogólne

- Na tym etapie NIE naprawiaj błędów w kodzie strony. Zbieraj dowody i dokumentuj. Wyjątek: możesz dodawać pliki testowe, konfigurację testów oraz plik CLAUDE.md.
- Niczego nie usuwaj i nie nadpisuj bez potrzeby. Przed większymi zmianami (instalacja pakietów, zmiana konfiguracji) wypisz, co zamierzasz zrobić.
- Nie zgaduj. Jeśli czegoś nie możesz ustalić z kodu, zapisz to jako "do wyjaśnienia" zamiast wymyślać odpowiedź.
- Jeśli któreś polecenie lub test nie daje się uruchomić, zapisz dokładny błąd i przyczynę, a następnie spróbuj obejść problem albo przejdź dalej.
- Prowadź listę zadań (todo) i na bieżąco zaznaczaj postęp.
- Odpowiadaj po polsku, kod i nazwy techniczne zostaw w oryginale.

## Podział pracy między modele

Do poszczególnych rodzajów zadań używaj subagentów (narzędzie Agent) z odpowiednim modelem, ustawianym parametrem `model`:

- **Haiku**: czytanie i przeszukiwanie. Skanowanie struktury repozytorium, czytanie plików, zbieranie wyników lintu, `astro check` i audytu zależności, wyszukiwanie TODO/FIXME, martwych linków i wzorców w kodzie. Haiku ma tylko zbierać i streszczać fakty (z lokalizacją plik:linia), bez wyciągania wniosków i bez edycji.
- **Sonnet**: zwykła praca. Pisanie CLAUDE.md, konfiguracja i pisanie testów (Playwright, Lighthouse, axe), uruchamianie buildu i testów, analiza ich wyników, przygotowanie raportu `docs/AUDYT-WYNIKI.md`. Sonnet to model domyślny dla całej sesji.
- **Opus**: planowanie i rozumowanie. Analiza przyczyn źródłowych błędów, ocena ważności problemów, wybór strategii testowania oraz opracowanie `docs/PLAN-NAPRAWY.md` (priorytety, zależności, ryzyko regresji). Opus ma dostać gotowe, zebrane wyniki od pozostałych modeli, a nie czytać całego repozytorium od zera.

Zasady:
- Przekazuj subagentom pełny kontekst w prompcie (cel, zakres, format odpowiedzi), bo każdy startuje od zera.
- Zadania niezależne (np. czytanie różnych części projektu) uruchamiaj równolegle.
- Wyniki subagentów zapisuj do plików (np. `docs/notatki/`), żeby kolejne etapy mogły z nich korzystać bez ponownego czytania kodu.
- Nie używaj droższego modelu, jeśli wystarczy tańszy: Opus tylko tam, gdzie trzeba myśleć, Haiku wszędzie, gdzie wystarczy przeczytać i zreferować.

## Etap 1: Rekonesans projektu

1. Przeskanuj strukturę repozytorium (drzewo katalogów, pliki konfiguracyjne w katalogu głównym).
2. Ustal i zapisz:
   - wersję Astro, Node, menedżer pakietów (npm/yarn/pnpm), tryb renderowania (statyczny / SSR / hybrydowy) i użyty adapter (np. Netlify, Vercel, Cloudflare, Node),
   - zawartość `astro.config.*`: integracje (React, Svelte, Tailwind, MDX, sitemap itp.), ustawienia `site`, `base`, `output`, i18n,
   - język (JS/TypeScript), konfigurację TS, ESLint, Prettier,
   - strukturę `src/` (pages, layouts, components, content, styles, assets) i katalog `public/`,
   - kolekcje treści (content collections), schematy, źródło treści (Markdown/MDX/CMS),
   - obsługę obrazów (`astro:assets`, `<Image>`, formaty, rozmiary), fonty, ikony, animacje, JavaScript po stronie klienta (wyspy, dyrektywy `client:*`),
   - formularz kontaktowy i jego backend (endpoint, usługa zewnętrzna, zabezpieczenie przed spamem), analitykę, ciasteczka i zgody,
   - SEO: tagi meta, Open Graph, canonical, sitemap, robots.txt, dane strukturalne, favicon, manifest,
   - skrypty z `package.json`, istniejące testy, CI/CD, sposób wdrożenia i hosting,
   - listę wszystkich podstron i nawigację (menu, stopka, linki wewnętrzne i zewnętrzne).
3. Zidentyfikuj od razu widoczne ryzyka: przestarzałe lub podatne zależności (`npm outdated`, `npm audit` lub odpowiednik), brakujące pliki, martwy kod, TODO/FIXME, twardo zakodowane sekrety i klucze API, nieużywane zasoby.

## Etap 2: Plik CLAUDE.md

Utwórz w katalogu głównym projektu plik `CLAUDE.md` (jeśli już istnieje, najpierw go przeczytaj i uzupełnij zamiast nadpisywać). Plik ma być zwięzły i praktyczny, bo będzie czytany na początku każdej przyszłej sesji. Zawartość:

- krótki opis projektu (czyja to strona, do czego służy, jakie ma sekcje),
- stos technologiczny z wersjami,
- struktura katalogów z jednozdaniowym opisem każdego ważnego miejsca,
- komendy: instalacja, serwer deweloperski, build, podgląd buildu (`preview`), `astro check`, lint, testy,
- konwencje kodu, stylowania i nazewnictwa, które zauważyłeś w projekcie,
- jak dodawać nową podstronę, projekt do portfolio lub wpis w kolekcji treści (jeśli projekt ma takie mechanizmy),
- jak uruchamiać testy (Playwright, Lighthouse) i gdzie trafiają raporty,
- znane pułapki, ograniczenia środowiska i rzeczy, których nie wolno ruszać,
- sekcja "Stan audytu" z odnośnikiem do plików z wynikami (patrz niżej).

Nie wpisuj tam sekretów ani rzeczy, które da się odczytać wprost z kodu w kilka sekund.

## Etap 3: Przegląd kodu i testy statyczne

1. Uruchom wszystko, co projekt już ma: `astro check`, typecheck, lint, istniejące testy, audyt zależności oraz pełny build produkcyjny. Zapisz pełne wyniki, w tym ostrzeżenia z buildu.
2. Przejrzyj kod pod kątem błędów i ryzyk typowych dla stron w Astro, m.in.:
   - niepotrzebny JavaScript po stronie klienta, zbyt szerokie użycie dyrektyw `client:*`, zbędne frameworki,
   - nieoptymalne obrazy (brak wymiarów, brak `alt`, zbyt duże pliki, brak nowoczesnych formatów, brak lazy loading), ładowanie fontów (FOUT/FOIT, brak `font-display`, brak preload),
   - błędy w układach i komponentach (zduplikowane tagi `<head>`, brak `lang`, zły hierarchia nagłówków, niezamknięte elementy),
   - dostępność (kontrast, focus, nawigacja klawiaturą, role ARIA, etykiety formularzy, `prefers-reduced-motion`),
   - SEO i udostępnianie (brakujące lub zduplikowane `title`/`description`, błędne canonical, brak obrazka OG, błędny sitemap lub robots),
   - formularz kontaktowy: walidacja, obsługa błędów, ochrona przed spamem, prywatność danych,
   - bezpieczeństwo i prywatność: nagłówki, zewnętrzne skrypty, ciasteczka, zgody, wycieki sekretów w kodzie klienta,
   - responsywność i kompatybilność przeglądarek w samym CSS (twarde szerokości, przepełnienia, jednostki viewportu na mobile),
   - poprawność linków wewnętrznych i zewnętrznych, ścieżki przy ustawionym `base`, wersje językowe.
3. Każde znalezisko zapisz z dokładnym miejscem (plik:linia), opisem, wpływem i pewnością (potwierdzone / podejrzenie).

## Etap 4: Testowanie strony

Cel: zbudować i uruchomić stronę, sprawdzić ją w działaniu i zebrać dowody (screenshoty, logi, raporty).

**A. Playwright (automatyczne testy E2E):**
- Zainstaluj Playwright i przeglądarki, jeśli ich brakuje. Testuj na buildzie produkcyjnym (`astro build` + `astro preview`), a nie tylko na serwerze deweloperskim.
- Uruchom testy w Chromium, Firefox i WebKit oraz w emulacji urządzeń mobilnych i kilku szerokościach viewportu (telefon, tablet, laptop, duży ekran).
- Napisz scenariusze: wejście na każdą podstronę z mapy strony (status 200, brak błędów w konsoli, brak nieudanych requestów), nawigacja menu (także mobilne menu rozwijane), przewijanie i kotwice, przełącznik motywu lub języka (jeśli jest), formularz kontaktowy (poprawne dane, puste pola, błędne dane, błąd sieci), strona 404.
- Sprawdź linki: wszystkie linki wewnętrzne mają działać, a zewnętrzne zwracać poprawny status (zapisz wyniki).
- Zrób testy wizualne: screenshoty kluczowych stron na różnych viewportach i szukaj przepełnień, nachodzących elementów i ucinania treści.
- Zbieraj: screenshoty, trace lub wideo Playwrighta, błędy z konsoli, nieudane requesty sieciowe.
- Zapisz testy w repozytorium (np. katalog `tests/e2e/`) i dodaj skrypt w `package.json`.

**B. Drugie narzędzie: Lighthouse i axe:**
- Uruchom Lighthouse (CLI lub `@lhci/cli`) dla każdej podstrony w wersji mobilnej i desktopowej: wydajność, dostępność, najlepsze praktyki, SEO. Zapisz wyniki i najważniejsze metryki (LCP, CLS, INP/TBT).
- Uruchom `@axe-core/playwright` na wszystkich podstronach i zapisz naruszenia dostępności z ich ważnością.
- Jeśli któreś narzędzie nie działa w środowisku, napisz to wprost, podaj przyczynę i zaproponuj alternatywę (np. samo axe-core lub `pa11y`).
- Opcjonalnie sprawdź walidację HTML (np. `html-validate`) oraz rozmiar paczek po buildzie.

Dla każdego scenariusza zapisz: wynik (przeszedł/nie przeszedł), kroki odtworzenia, oczekiwane i faktyczne zachowanie oraz ścieżkę do dowodów.

## Etap 5: Raport z wyników

Utwórz plik `docs/AUDYT-WYNIKI.md` zawierający:
- podsumowanie (liczba przetestowanych stron i scenariuszy, liczba wykrytych problemów według ważności, wyniki Lighthouse w tabeli),
- tabelę wszystkich problemów: ID, tytuł, kategoria (błąd funkcjonalny / wydajność / dostępność / SEO / UI i responsywność / bezpieczeństwo / zależności), ważność (krytyczny / wysoki / średni / niski), źródło wykrycia (analiza kodu / Playwright / Lighthouse / axe / build), lokalizacja w kodzie, kroki odtworzenia, dowody,
- listę rzeczy, których nie udało się sprawdzić, wraz z powodem.

Usuń duplikaty i pogrupuj problemy wynikające z tej samej przyczyny źródłowej (np. jeden zły layout powielający błąd na wszystkich podstronach).

## Etap 6: Plan naprawy

Na podstawie raportu utwórz `docs/PLAN-NAPRAWY.md`:
- zadania uporządkowane według priorytetu i zależności (najpierw krytyczne i blokujące, potem szybkie wygrane, potem reszta),
- dla każdego zadania: powiązane ID problemów, analiza przyczyny źródłowej, proponowane rozwiązanie (które pliki i jakie zmiany), szacowany nakład (S/M/L), ryzyko regresji, sposób weryfikacji (który test lub jaki wynik Lighthouse ma być osiągnięty po naprawie),
- sugerowany podział na kolejne kroki lub commity oraz propozycja, które testy dodać jako zabezpieczenie przed regresją (w tym budżety wydajności w Lighthouse CI),
- krótka lista pytań do mnie, jeśli któraś decyzja wymaga mojego wyboru (np. zmiana treści, wyglądu, usługi formularza).

## Zakończenie

Po zakończeniu wypisz: ścieżki wszystkich utworzonych plików, krótkie podsumowanie najważniejszych problemów (maks. 10 punktów) oraz to, co proponujesz zrobić jako pierwsze. Nie rozpoczynaj naprawiania błędów, dopóki nie potwierdzę planu.
