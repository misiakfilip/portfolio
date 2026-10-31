// src/config.ts
export interface FeaturedProject {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  /** Route slug of the project subpage (see src/i18n/projects.ts); set together with hasDetailPage. */
  slug?: string;
  hasDetailPage?: boolean;
  featured: boolean;
}

export const config = {
  // Podstawowe info
  name: "Filip Misiak",
  username: "misiakfilip",
  title: {
    pl: "Software Engineer",
    en: "Software Engineer"
  },

  bio: {
    pl: "Pasjonat tworzenia aplikacji webowych, mobilnych oraz gier komputerowych. Specjalizuję się w technologiach takich jak React, Node.js, Unity i Unreal Engine.",
    en: "Passionate about creating web and mobile applications, as well as computer games. I specialize in technologies like React, Node.js, Unity and Unreal Engine."
  },
  
  // Social links
  social: {
    github: "https://github.com/misiakfilip",
    linkedin: "https://linkedin.com/in/filip-misiak-031090281",
    email: "filip.misiak11@gmail.com",
  },
  
  // "Pinned" repositories on the home page: a curated list of repo names, fetched live from the
  // public REST API together with the rest of the repos (no token needed, nothing secret in the
  // client). The GitHub "pinned" list itself is only exposed by the GraphQL API, which requires
  // an auth token that must not ship in client code, so the list is maintained here instead.
  // Names that do not exist (or are forks of other people's projects) are simply skipped.
  // TODO(owner): potwierdź, które repozytoria mają być wyróżnione.
  pinnedRepos: ["recipe", "impostor-demo"],

  // CV
  // TODO(owner): wgraj public/cv.pdf i ustaw cvUrl: "/cv.pdf" - przycisk "Pobierz CV" pojawi się sam.
  cvUrl: undefined as string | undefined,

  // Technology icons
  technologies: [
    { name: "Python", icon: "devicon-python-plain" },
    { name: "Java", icon: "devicon-java-plain" },
    { name: "JavaScript", icon: "devicon-javascript-plain" },
    { name: "TypeScript", icon: "devicon-typescript-plain" },
    { name: "C#", icon: "devicon-csharp-plain" },
    { name: "PHP", icon: "devicon-php-plain" },
    { name: "HTML5", icon: "devicon-html5-plain" },
    { name: "CSS3", icon: "devicon-css3-plain" },
    { name: "React", icon: "devicon-react-original" },
    { name: "Node.js", icon: "devicon-nodejs-plain" },
    { name: "Astro", icon: "devicon-astro-plain" },
    { name: "Unreal Engine", icon: "devicon-unrealengine-original" },
    { name: "Android", icon: "devicon-android-plain" },
    { name: ".NET", icon: "devicon-dotnetcore-plain" },
    { name: "SQL", icon: "devicon-mysql-plain" },
    { name: "MongoDB", icon: "devicon-mongodb-plain" },
    { name: "Unity", icon: "🎮" },
    { name: "Power Apps", icon: "⚡" },
  ],
  
// Timeline doświadczenia
experience: {
  pl: [
    {
      period: "2019",
      title: "Serwisant – Praktykant",
      company: "Comtrade",
      description: "Miesięczna praktyka jako serwisant sprzętu komputerowego. Diagnozowanie usterek, modernizacja podzespołów oraz wsparcie techniczne dla klientów.",
      technologies: ["Hardware", "Serwis IT", "Diagnostyka"]
    },
    {
      period: "2023",
      title: "Praktykant – Tworzenie aplikacji biznesowych",
      company: "TIM S.A.",
      description: "Dwumiesięczne praktyki polegające na budowaniu aplikacji biznesowych z wykorzystaniem Power Apps. Automatyzacja procesów i integracja z usługami Microsoft.",
      technologies: ["Power Apps", "Microsoft 365", "Power Automate"]
    },
    {
      period: "2024",
      title: "Praktykant – Wsparcie Wdrożeń ERP",
      company: "Albus-IT",
      description: "Czteromiesięczna praktyka przy wdrożeniach systemu ERP (enova365): pomoc przy migracji danych, konfiguracji systemu, integracji modułów oraz testowaniu procesów biznesowych.",
      technologies: ["enova365", "ERP", "Migracja danych", "Integracje systemowe"]
    }
  ],
  en: [
    {
      period: "2019",
      title: "IT Technician Intern",
      company: "Comtrade",
      description: "One-month internship involving computer hardware servicing, troubleshooting, component upgrades and providing technical support to customers.",
      technologies: ["Hardware", "IT Service", "Diagnostics"]
    },
    {
      period: "2023",
      title: "Business Apps Intern",
      company: "TIM S.A.",
      description: "Two-month internship focused on building business applications using Power Apps. Process automation and integration with Microsoft services.",
      technologies: ["Power Apps", "Microsoft 365", "Power Automate"]
    },
    {
      period: "2024",
      title: "ERP Implementation Intern",
      company: "Albus-IT",
      description: "Four-month internship supporting the implementation of the enova365 ERP system. Responsibilities included assisting with data migration, system configuration, module integration and testing business processes.",
      technologies: ["enova365", "ERP", "Data Migration", "System Integrations"]
    }
  ]
},
  // Wykształcenie
education: {
  pl: [
    {
      title: "Technik informatyk",
      school: "Zespół Szkół Elektronicznych Elektrycznych i Mechanicznych w Bielsku-Białej im. Jędrzeja Śniadeckiego",
      website: "https://zseeim.edu.pl/",
      period: "2019",
      icon: "🎓"
    },
    {
      title: "Studia I Stopnia, kierunek: informatyka, specjalizacja: Programowanie gier i aplikacji mobilnych",
      school: "Uniwersytet Ekonomiczny w Katowicach",
      website: "https://www.ue.katowice.pl/",
      period: "2024",
      icon: "🎓"
    },
    {
      title: "Studia II Stopnia, kierunek: informatyka, specjalizacja: Analiza danych",
      school: "Uniwersytet Ekonomiczny w Katowicach",
      website: "https://www.ue.katowice.pl/",
      period: "w trakcie",
      icon: "🎓"
    }
  ],
  en: [
    {
      title: "IT Technician",
      school: "Zespół Szkół Elektronicznych Elektrycznych i Mechanicznych w Bielsku-Białej im. Jędrzeja Śniadeckiego",
      website: "https://zseeim.edu.pl/",
      period: "2019",
      icon: "🎓"
    },
    {
      title: "Bachelor of Computer Science, specialization: Game and Mobile App Programming",
      school: "University of Economics in Katowice",
      website: "https://www.ue.katowice.pl/",
      period: "2024",
      icon: "🎓"
    },
    {
      title: "Master of Computer Science, specialization: Data Analysis",
      school: "University of Economics in Katowice",
      website: "https://www.ue.katowice.pl/",
      period: "in progress",
      icon: "🎓"
    }
  ]
},
  
  // Featured Projects (spoza GitHub lub highlight z GitHub)
  featuredProjects: {
    pl: <FeaturedProject[]>[
      {
        title: "Blog Najlepszy muzyczny adres",
        description: "Blog muzyczny stworzony z wykorzystaniem Payload CMS.",
        image: "/projects/blog.jpg", 
        technologies: ["React", "Node.js", "TypeScript", "Payload CMS"],
        demoUrl: "https://payload-website-starter-one-rust.vercel.app/posts",
        githubUrl: "", 
        featured: true
      },
      {
        title: "Retro Brick Breaker",
        description: "Gra stworzona w Unity wzorująca się na klasycznych grach Arcade.",
        image: "/projects/retro-brick-breaker.png",
        technologies: ["Unity", "C#"],
        demoUrl: "https://play.unity.com/api/v1/games/game/c479b58a-bbc7-447c-93bb-204a03f6cecc/build/latest/frame",
        githubUrl: "", // TODO(owner): URL repozytorium Brick Breaker (ukryte do potwierdzenia)
        slug: "brick-breaker",
        hasDetailPage: true,
        featured: true
      },
      {
        title: "Arct",
        description: "Narracyjna gra dokumentalna stworzona w Unreal Engine 5, skupiona na interaktywnej opowieści i immersji. Projekt bada połączenie narracji dokumentalnej z mechanikami gier.",
        image: "/projects/arct.svg",
        technologies: ["Unreal Engine 5", "Blueprints", "C++"],
        demoUrl: "",
        githubUrl: "",
        slug: "Arct",
        hasDetailPage: true,
        featured: true
      },
      {
        title: "Skarbnik: Duch kopalni",
        description: "Survival horror osadzony w polskiej kopalni, inspirowany słowiańską mitologią. Gra kładzie nacisk na atmosferę, narrację środowiskową i psychologiczny horror.",
        image: "/projects/skarbnik.jpg",
        technologies: ["Unity", "C#"],
        demoUrl: "",
        githubUrl: "",
        slug: "skarbnik",
        hasDetailPage: true,
        featured: true
      },
      {
        title: "Impostor",
        description: "Imprezowa gra mobilna stworzona w React Native, przeznaczona do wspólnej zabawy w grupie. Projekt skupia się na prostych zasadach, szybkiej rozgrywce i interakcji między graczami.",
        image: "/projects/impostor.png",
        technologies: ["React Native", "JavaScript"],
        demoUrl: "https://github.com/misiakfilip/impostor-demo/releases/download/v1.0.0/impostor.apk",
        githubUrl: "",
        featured: false
      },
      {
        title: "recipE",
        description: "Aplikacja mobilna do zapisywania i zarządzania przepisami kulinarnymi. Umożliwia organizację, edycję i szybki dostęp do własnej bazy przepisów.",
        image: "/projects/recipe.png",
        technologies: ["React Native", "JavaScript"],
        demoUrl: "",
        githubUrl: "https://github.com/misiakfilip/recipe",
        featured: false
      }

    ],
    en: <FeaturedProject[]>[
      {
        title: "Best Music Blog",
        description: "A music blog created using Payload CMS.",
        image: "/projects/blog.jpg", 
        technologies: ["React", "Node.js", "TypeScript", "Payload CMS"],
        demoUrl: "https://payload-website-starter-one-rust.vercel.app/posts",
        githubUrl: "", 
        featured: true
      },
      {
        title: "Retro Brick Breaker",
        description: "A Unity game inspired by the classic arcade games.",
        image: "/projects/retro-brick-breaker.png",
        technologies: ["Unity", "C#"],
        demoUrl: "", // TODO(owner): adres demo wersji EN (nieznany)
        githubUrl: "", // TODO(owner): URL repozytorium Brick Breaker (ukryte do potwierdzenia)
        slug: "brick-breaker",
        hasDetailPage: true,
        featured: true
      },
      {
        title: "Arct",
        description: "A narrative documentary game developed in Unreal Engine 5, focused on interactive storytelling and immersion. The project explores documentary-driven game design.",
        image: "/projects/arct.svg",
        technologies: ["Unreal Engine 5", "Blueprints", "C++"],
        demoUrl: "",
        githubUrl: "",
        slug: "Arct",
        hasDetailPage: true,
        featured: true
      },
      {
        title: "Skarbnik: Spirit of the Mine",
        description: "A survival horror set in a Polish coal mine, inspired by Slavic mythology. The game focuses on atmosphere, environmental storytelling, and psychological horror.",
        image: "/projects/skarbnik.jpg",
        technologies: ["Unity", "C#"],
        demoUrl: "",
        githubUrl: "",
        slug: "skarbnik",
        hasDetailPage: true,
        featured: true
      },
      {
        title: "Impostor",
        description: "A party mobile game developed in React Native, designed for group play. The project focuses on simple rules, fast-paced gameplay, and player interaction.",
        image: "/projects/impostor.png",
        technologies: ["React Native", "JavaScript"],
        demoUrl: "https://github.com/misiakfilip/impostor-demo/releases/download/v1.0.0/impostor.apk",
        githubUrl: "",
        featured: false
      },
      {
        title: "recipE",
        description: "A mobile application for storing and managing cooking recipes. It allows users to organize, edit, and quickly access their personal recipe collection.",
        image: "/projects/recipe.png",
        technologies: ["React Native", "JavaScript"],
        demoUrl: "",
        githubUrl: "https://github.com/misiakfilip/recipe",
        featured: false
      }

    ]
  }
};

export type Config = typeof config;