// Content of the project subpages, shared by /projects/<slug> (PL) and /en/projects/<slug> (EN).
// Language-independent data (links, files, gallery) is defined once per project; texts live in
// `content.pl` / `content.en`. Strings may contain <strong>/<em>: they are trusted, authored here
// and rendered with set:html.
import type { Lang } from './index';

type Localized = Record<Lang, string>;

/** A titled block of the technical documentation / challenges: heading, paragraphs, then a list. */
export interface ProjectSection {
  heading: string;
  paragraphs?: string[];
  items?: string[];
}

export interface ProjectContent {
  title: string;
  description: string;
  technologies: string[];
  about: string[];
  features: string[];
  docs: ProjectSection[];
  challenges?: ProjectSection[];
}

export interface Project {
  /** Prefix of gallery files in src/assets/projects/ (e.g. "arct" -> arct-*.png). */
  galleryPrefix?: string;
  /** Alt text per gallery file name (PL+EN). */
  imageAlts?: Record<string, Localized>;
  /** YouTube video id; the video section appears once it is set. */
  videoId?: string;
  /** Repository URL; the GitHub button appears once it is set. */
  github?: string;
  /** Demo URL; the Demo button appears once it is set. */
  demo?: string;
  downloads: Array<{ href: string; label: Localized; icon: 'pdf' | 'file' | 'code' }>;
  links: Array<{ href: string; label: Localized; description: Localized }>;
  content: Record<Lang, ProjectContent>;
}

export type ProjectSlug = 'Arct' | 'brick-breaker' | 'skarbnik';

export const projects: Record<ProjectSlug, Project> = {
  Arct: {
    galleryPrefix: 'arct',
    // TODO(owner): zweryfikuj opisy (alt) - wywnioskowane z nazw plików; popraw na faktyczną zawartość zrzutów.
    imageAlts: {
      'arct.jpg': { pl: 'Okładka gry Arct', en: 'Arct key art' },
      'arct-moonboard.jpg': { pl: 'Moodboard z inspiracjami wizualnymi gry Arct', en: 'Arct visual inspiration moodboard' },
      'arct-menu.png': { pl: 'Menu główne gry Arct', en: 'Arct main menu' },
      'arct-settings.png': { pl: 'Ekran ustawień w grze Arct', en: 'Arct settings screen' },
      'arct-pouse.png': { pl: 'Menu pauzy w grze Arct', en: 'Arct pause menu' },
      'arct-quests.png': { pl: 'Dziennik zadań w grze Arct', en: 'Arct quest log' },
      'arct-eq.png': { pl: 'Ekwipunek bohatera w grze Arct', en: 'Arct player inventory' },
      'arct-dialog1.png': { pl: 'Scena dialogowa w grze Arct (1)', en: 'Arct dialogue scene (1)' },
      'arct-dialog2.png': { pl: 'Scena dialogowa w grze Arct (2)', en: 'Arct dialogue scene (2)' },
      'arct-fish.png': { pl: 'Łowienie ryb w grze Arct', en: 'Fishing in Arct' },
      'arct-level1.png': { pl: 'Pierwszy poziom gry Arct', en: 'Arct, level 1' },
      'arct-level2.png': { pl: 'Drugi poziom gry Arct', en: 'Arct, level 2' },
      'arct-ship.png': { pl: 'Statek Belgica w grze Arct (1)', en: 'The Belgica ship in Arct (1)' },
      'arct-ship2.png': { pl: 'Statek Belgica w grze Arct (2)', en: 'The Belgica ship in Arct (2)' },
      'arct-ship3.png': { pl: 'Statek Belgica w grze Arct (3)', en: 'The Belgica ship in Arct (3)' },
      'arct-night.png': { pl: 'Nocna scena w grze Arct', en: 'Night scene in Arct' },
      'arct-sunset.png': { pl: 'Zachód słońca w grze Arct', en: 'Sunset in Arct' },
    },
    // TODO(owner): podaj poprawny URL repozytorium (misiakfilip/arct zwraca 404) w polu `github`.
    // TODO(owner): wpisz ID filmu z YouTube w `videoId` - sekcja wideo pojawi się sama.
    downloads: [
      {
        href: '/downloads/Arct-GDD.pdf',
        label: { pl: 'Arct GDD', en: 'Arct GDD' },
        icon: 'pdf',
      },
    ],
    links: [
      {
        href: 'https://UnrealEngine.com/',
        label: { pl: 'Unreal Engine', en: 'Unreal Engine' },
        description: { pl: 'Oficjalna strona silnika Unreal', en: 'Official website of the Unreal engine' },
      },
    ],
    content: {
      pl: {
        title: 'Arct',
        description:
          'Narracyjna gra dokumentalna oparta na historycznej wyprawie statku Belgica (1897–1899), łącząca edukację, narrację i elementy survivalu.',
        technologies: ['Unreal Engine', 'Blueprints', 'Narrative Design', 'Game Design'],
        about: [
          'Projekt koncentruje się na wykorzystaniu medium gier wideo do przekazywania treści historycznych i edukacyjnych.',
          'Gra opowiada o pierwszej w historii wyprawie antarktycznej, podczas której statek <strong>Belgica</strong> został uwięziony w lodach Morza Bellingshausena. Gracz wciela się w członków ekspedycji, uczestnicząc w codziennym życiu załogi, badaniach naukowych oraz walce o przetrwanie w ekstremalnych warunkach.',
          'Projekt łączy elementy przygodowej gry narracyjnej, dokumentu historycznego oraz subtelne mechaniki survival horroru, które służą budowaniu napięcia i oddaniu psychologicznych aspektów izolacji.',
        ],
        features: [
          'Narracyjna struktura oparta na autentycznych wydarzeniach historycznych',
          'Interakcje dialogowe z historycznymi członkami ekspedycji',
          'Wykorzystanie oryginalnych zapisków dziennikowych jako elementu narracji',
          'Segmenty edukacyjne dotyczące geografii, biologii i geologii',
          'Eksploracja statku Belgica i otoczenia antarktycznego',
          'Elementy survivalu budujące napięcie i poczucie zagrożenia',
          'Silny nacisk na immersję i atmosferę',
          'Projekt gry zgodny z założeniami gier poważnych (serious games)',
        ],
        docs: [
          {
            heading: 'Architektura',
            paragraphs: [
              'Projekt gry został opisany w głównym dokumencie koncepcyjnym (GDD), który obejmuje założenia narracyjne, mechaniczne oraz edukacyjne. Implementacja prototypu miała na celu weryfikację kluczowych założeń projektu.',
            ],
            items: [
              '<strong>System narracji</strong> – dialogi, dzienniki, wydarzenia fabularne',
              '<strong>System eksploracji</strong> – poruszanie się po statku i otoczeniu',
              '<strong>System postaci</strong> – historyczni członkowie wyprawy',
              '<strong>Elementy survivalowe</strong> – ograniczone zasoby, napięcie psychologiczne',
            ],
          },
          {
            heading: 'Zastosowane technologie',
            items: [
              'Silnik gry: Unreal Engine',
              'Blueprints – logika prototypu',
              'Narzędzia graficzne – photobashing i edycja materiałów źródłowych',
              'Materiały historyczne jako baza narracyjna',
            ],
          },
        ],
        challenges: [
          {
            heading: '1. Połączenie dokumentu i gry',
            paragraphs: [
              'Wyzwaniem było zachowanie równowagi pomiędzy wiernością historyczną a atrakcyjnością interaktywnej narracji. Rozwiązaniem było zastosowanie dialogów i dzienników jako głównego nośnika wiedzy.',
            ],
          },
          {
            heading: '2. Budowanie napięcia bez klasycznej akcji',
            paragraphs: [
              'Zamiast intensywnej rozgrywki akcji wykorzystano elementy survival horroru: izolację, ograniczoną widoczność oraz dźwięk, aby oddać psychologiczny aspekt wyprawy.',
            ],
          },
          {
            heading: '3. Ograniczenia prototypu',
            paragraphs: [
              'Prototyp skupia się na kluczowych mechanikach narracyjnych i atmosferze, rezygnując z pełnej skali zawartości na rzecz czytelnej demonstracji koncepcji.',
            ],
          },
        ],
      },
      en: {
        title: 'Arct',
        description:
          'A narrative documentary game based on the historic voyage of the ship Belgica (1897–1899), combining education, storytelling and survival elements.',
        technologies: ['Unreal Engine', 'Blueprints', 'Narrative Design', 'Game Design'],
        about: [
          'The project explores how the video game medium can convey historical and educational content.',
          'The game tells the story of the first Antarctic expedition in history, during which the ship <strong>Belgica</strong> became trapped in the ice of the Bellingshausen Sea. The player takes the role of expedition members, taking part in the crew’s daily life, scientific work and the struggle to survive in extreme conditions.',
          'The project blends an adventure narrative game, a historical documentary and subtle survival-horror mechanics that build tension and convey the psychological side of isolation.',
        ],
        features: [
          'Narrative structure based on authentic historical events',
          'Dialogue interactions with the real members of the expedition',
          'Original diary entries used as part of the narration',
          'Educational segments on geography, biology and geology',
          'Exploration of the Belgica and the Antarctic surroundings',
          'Survival elements that build tension and a sense of danger',
          'Strong focus on immersion and atmosphere',
          'Game design following the principles of serious games',
        ],
        docs: [
          {
            heading: 'Architecture',
            paragraphs: [
              'The game is described in the main game design document (GDD), which covers the narrative, mechanical and educational assumptions. The prototype was implemented to verify the key assumptions of the project.',
            ],
            items: [
              '<strong>Narrative system</strong> – dialogues, diaries, story events',
              '<strong>Exploration system</strong> – moving around the ship and its surroundings',
              '<strong>Character system</strong> – the historical members of the expedition',
              '<strong>Survival elements</strong> – limited resources, psychological tension',
            ],
          },
          {
            heading: 'Technologies used',
            items: [
              'Game engine: Unreal Engine',
              'Blueprints – prototype logic',
              'Graphic tools – photobashing and editing of source materials',
              'Historical materials as the narrative foundation',
            ],
          },
        ],
        challenges: [
          {
            heading: '1. Combining a documentary and a game',
            paragraphs: [
              'The challenge was to balance historical accuracy with engaging interactive storytelling. The solution was to use dialogues and diaries as the main carriers of knowledge.',
            ],
          },
          {
            heading: '2. Building tension without classic action',
            paragraphs: [
              'Instead of intense action gameplay, survival-horror elements were used: isolation, limited visibility and sound, to convey the psychological side of the expedition.',
            ],
          },
          {
            heading: '3. Prototype limitations',
            paragraphs: [
              'The prototype focuses on the key narrative mechanics and the atmosphere, giving up full-scale content in favour of a clear demonstration of the concept.',
            ],
          },
        ],
      },
    },
  },

  'brick-breaker': {
    galleryPrefix: 'brick-breaker-',
    // TODO(owner): zweryfikuj opisy (alt) - wywnioskowane z nazw plików; popraw na faktyczną zawartość zrzutów.
    imageAlts: {
      'brick-breaker-menu.png': { pl: 'Menu główne gry Retro Brick Breaker', en: 'Retro Brick Breaker main menu' },
      'brick-breaker-game.png': { pl: 'Rozgrywka w grze Retro Brick Breaker (1)', en: 'Retro Brick Breaker gameplay (1)' },
      'brick-breaker-game2.png': { pl: 'Rozgrywka w grze Retro Brick Breaker (2)', en: 'Retro Brick Breaker gameplay (2)' },
      'brick-breaker-end.png': { pl: 'Ekran końcowy gry Retro Brick Breaker', en: 'Retro Brick Breaker end screen' },
    },
    github: 'https://github.com/misiakfilip/retro-brick-breaker',
    // TODO(owner): wpisz ID filmu z YouTube w `videoId` - sekcja wideo pojawi się sama.
    downloads: [
      {
        href: 'https://github.com/misiakfilip/retro-brick-breaker',
        label: { pl: 'Kod źródłowy (GitHub)', en: 'Source code (GitHub)' },
        icon: 'code',
      },
    ],
    links: [
      {
        href: 'https://unity.com/',
        label: { pl: 'Unity Engine', en: 'Unity Engine' },
        description: { pl: 'Oficjalna strona silnika Unity', en: 'Official website of the Unity engine' },
      },
      {
        href: 'https://play.unity.com/api/v1/games/game/c479b58a-bbc7-447c-93bb-204a03f6cecc/build/latest/frame',
        label: { pl: 'Unity Play', en: 'Unity Play' },
        description: { pl: 'Link do gry na Unity Play', en: 'Link to the game on Unity Play' },
      },
    ],
    content: {
      pl: {
        title: 'Retro Brick Breaker',
        description:
          'Gra inspirowana klasycznymi grami Arcade typu brick breaker z nowoczesnymi mechanikami i efektami wizualnymi.',
        technologies: ['Unity', 'C#', '.NET', 'Game Design'],
        about: [
          'Gra zawiera zaawansowane mechaniki rozgrywki, system power-upów, automatyczne generowanie poziomów oraz tablice najlepszych wyników.',
        ],
        features: [
          'System power-upów wpływających na rozgrywkę',
          'Dynamiczny system fizyki piłki',
          'System highscore’ów z zapisem lokalnym',
          'Efekty wizualne i dźwiękowe',
          'Menu główne z ustawieniami',
        ],
        docs: [
          {
            heading: 'Architektura',
            paragraphs: [
              'Projekt wykorzystuje wzorzec MVC (Model-View-Controller) do separacji logiki biznesowej od warstwy prezentacji. Główne moduły:',
            ],
            items: [
              '<strong>Sesja</strong> - Singleton zarządzający stanem gry',
              '<strong>LevelManager</strong> - System generowania i ładowania poziomów',
              '<strong>PowerUp</strong> - Obsługa power-upów i efektów',
              '<strong>Pilka</strong> - Zaawansowana fizyka piłki',
              '<strong>Controller</strong> - System sterowania',
            ],
          },
          {
            heading: 'Technologie',
            items: [
              '<strong>Unity 2021.3 LTS</strong> - Silnik gry',
              '<strong>C# 9.0</strong> - Język programowania',
              '<strong>Unity Physics 2D</strong> - System fizyki',
              '<strong>TextMeshPro</strong> - Rendering tekstu',
            ],
          },
        ],
      },
      en: {
        title: 'Retro Brick Breaker',
        description:
          'A game inspired by classic arcade brick breaker titles, with modern mechanics and visual effects.',
        technologies: ['Unity', 'C#', '.NET', 'Game Design'],
        about: [
          'The game features advanced gameplay mechanics, a power-up system, automatic level generation and high-score tables.',
        ],
        features: [
          'Power-up system that changes the gameplay',
          'Dynamic ball physics system',
          'High-score system with local saving',
          'Visual and sound effects',
          'Main menu with settings',
        ],
        docs: [
          {
            heading: 'Architecture',
            paragraphs: [
              'The project uses the MVC (Model-View-Controller) pattern to separate business logic from the presentation layer. Main modules:',
            ],
            items: [
              '<strong>Sesja</strong> - singleton managing the game state',
              '<strong>LevelManager</strong> - level generation and loading system',
              '<strong>PowerUp</strong> - handling of power-ups and effects',
              '<strong>Pilka</strong> - advanced ball physics',
              '<strong>Controller</strong> - input and control system',
            ],
          },
          {
            heading: 'Technologies',
            items: [
              '<strong>Unity 2021.3 LTS</strong> - game engine',
              '<strong>C# 9.0</strong> - programming language',
              '<strong>Unity Physics 2D</strong> - physics system',
              '<strong>TextMeshPro</strong> - text rendering',
            ],
          },
        ],
      },
    },
  },

  skarbnik: {
    galleryPrefix: 'skarbnik',
    // TODO(owner): zweryfikuj opisy (alt) - wywnioskowane z nazw plików; popraw na faktyczną zawartość zrzutów.
    imageAlts: {
      'skarbnik.jpg': { pl: 'Ekran główny aplikacji Skarbnik', en: 'Skarbnik app main screen' },
      'skarbnik2.jpg': { pl: 'Widok aplikacji Skarbnik (2)', en: 'Skarbnik app view (2)' },
      'skarbnik3.png': { pl: 'Widok mobilny aplikacji Skarbnik', en: 'Skarbnik app mobile view' },
      'skarbnik4.png': { pl: 'Widok aplikacji Skarbnik na komputerze (1)', en: 'Skarbnik app desktop view (1)' },
      'skarbnik5.png': { pl: 'Widok aplikacji Skarbnik na komputerze (2)', en: 'Skarbnik app desktop view (2)' },
    },
    // TODO(owner): podaj poprawny URL repozytorium (misiakfilip/skarbnk to prawdopodobnie literówka) w polu `github`.
    // TODO(owner): wgraj public/downloads/skarbnik-gdd.pdf i dodaj wpis do `downloads` - sekcja "Pliki do pobrania" pojawi się sama.
    // TODO(owner): wpisz ID filmu z YouTube w `videoId` - sekcja wideo pojawi się sama.
    downloads: [],
    links: [
      {
        href: 'https://Unity.com/',
        label: { pl: 'Unity Engine', en: 'Unity Engine' },
        description: { pl: 'Oficjalna strona silnika Unity', en: 'Official website of the Unity engine' },
      },
    ],
    content: {
      pl: {
        title: 'Skarbnik – Gra Survival Horror',
        description:
          'Narracyjna gra survival horror FPP osadzona w kopalni na Górnym Śląsku w okresie międzywojennym, inspirowana słowiańską mitologią.',
        technologies: ['Unity', 'C#', 'HDRP', 'Game Design', 'Narrative Design'],
        about: [
          '<strong>„Skarbnik”</strong> to autorska gra typu survival horror z perspektywy pierwszej osoby, tworzona w silniku Unity. Akcja rozgrywa się w zawalonej kopalni na terenie Górnego Śląska w okresie dwudziestolecia międzywojennego.',
          'Gracz wciela się w Niklausa Pieruna – górnika, który po katastrofie górniczej zostaje uwięziony pod ziemią i musi odnaleźć drogę ucieczki, jednocześnie mierząc się z nadprzyrodzonym antagonistą – Skarbnikiem, duchem kopalni znanym ze słowiańskich wierzeń.',
          'Projekt skupia się na budowaniu napięcia poprzez światło, dźwięk, eksplorację oraz narrację środowiskową, zamiast bezpośredniej walki.',
        ],
        features: [
          'Perspektywa pierwszej osoby (FPP)',
          'Narracyjny survival horror',
          'Eksploracja klaustrofobicznych lokacji kopalni',
          'Zarządzanie światłem (latarnia, ciemność jako zagrożenie)',
          'Dynamiczna obecność antagonisty – Skarbnika',
          'Narracja środowiskowa (notatki, ślady, dźwięki)',
          'Elementy słowiańskiej mitologii',
        ],
        docs: [
          {
            heading: 'Architektura projektu',
            paragraphs: [
              'Projekt oparty jest na modularnej architekturze, z wyraźnym podziałem odpowiedzialności pomiędzy systemami rozgrywki, AI oraz narracji.',
            ],
          },
          {
            heading: 'Technologie',
            items: [
              '<strong>Unity 6.3 LTS</strong> – silnik gry',
              '<strong>C#</strong> – logika rozgrywki',
              '<strong>HDRP</strong> – realistyczne oświetlenie i cienie',
            ],
          },
        ],
        challenges: [
          {
            heading: '1. Budowanie strachu bez jump scare’ów',
            paragraphs: ['Rozwiązanie: oparcie rozgrywki na dźwięku, ograniczonym świetle oraz nieprzewidywalnym zachowaniu Skarbnika.'],
          },
          {
            heading: '2. Nawigacja w kopalni',
            paragraphs: ['Rozwiązanie: projekt labiryntowy z charakterystycznymi punktami orientacyjnymi i narracyjnym prowadzeniem gracza.'],
          },
          {
            heading: '3. Atmosfera historyczna',
            paragraphs: ['Rozwiązanie: stylizacja lokacji, rekwizyty, język i dźwięki inspirowane realiami Górnego Śląska lat 20. XX wieku.'],
          },
        ],
      },
      en: {
        title: 'Skarbnik – Survival Horror Game',
        description:
          'A narrative first-person survival horror game set in a mine in Upper Silesia in the interwar period, inspired by Slavic mythology.',
        technologies: ['Unity', 'C#', 'HDRP', 'Game Design', 'Narrative Design'],
        about: [
          '<strong>Skarbnik</strong> (“the Treasurer”) is an original first-person survival horror game made in Unity. It takes place in a collapsed mine in Upper Silesia during the interwar period.',
          'The player takes the role of Niklaus Pierun, a miner who is trapped underground after a mining disaster and has to find a way out while facing a supernatural antagonist – the Treasurer, the spirit of the mine known from Slavic folklore.',
          'The project builds tension through light, sound, exploration and environmental storytelling rather than direct combat.',
        ],
        features: [
          'First-person perspective (FPP)',
          'Narrative survival horror',
          'Exploration of claustrophobic mine locations',
          'Light management (the lantern, darkness as a threat)',
          'Dynamic presence of the antagonist – the Treasurer',
          'Environmental storytelling (notes, traces, sounds)',
          'Elements of Slavic mythology',
        ],
        docs: [
          {
            heading: 'Project architecture',
            paragraphs: [
              'The project is built on a modular architecture with a clear separation of responsibilities between the gameplay, AI and narrative systems.',
            ],
          },
          {
            heading: 'Technologies',
            items: [
              '<strong>Unity 6.3 LTS</strong> – game engine',
              '<strong>C#</strong> – gameplay logic',
              '<strong>HDRP</strong> – realistic lighting and shadows',
            ],
          },
        ],
        challenges: [
          {
            heading: '1. Building fear without jump scares',
            paragraphs: ['Solution: gameplay based on sound, limited light and the unpredictable behaviour of the Treasurer.'],
          },
          {
            heading: '2. Navigating the mine',
            paragraphs: ['Solution: a labyrinth-like design with distinctive landmarks and narrative guidance of the player.'],
          },
          {
            heading: '3. Historical atmosphere',
            paragraphs: ['Solution: stylised locations, props, language and sounds inspired by the realities of 1920s Upper Silesia.'],
          },
        ],
      },
    },
  },
};

export const projectSlugs = Object.keys(projects) as ProjectSlug[];
