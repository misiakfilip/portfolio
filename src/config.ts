// src/config.ts
export const config = {
  // Podstawowe info
  name: "Filip Misiak",
  username: "misiakfilip",
  title: {
    pl: "Software Engineer – Web, Mobile & Games",
    en: "Software Engineer – Web, Mobile & Games"
  },

  bio: {
    pl: "Pasjonat tworzenia aplikacji webowych, mobilnych oraz gier komputerowych. Specjalizuję się w technologiach takich jak React, Node.js, Astro, Unity, Unreal Engine, a także w rozwiązaniach cloud i automatyzacji procesów biznesowych.",
    en: "Passionate about creating web and mobile applications, as well as computer games. I specialize in technologies like React, Node.js, Astro, Unity, Unreal Engine, as well as cloud solutions and business process automation."
  },
  
  // Social links
  social: {
    github: "https://github.com/misiakfilip",
    linkedin: "https://linkedin.com/in/filip-misiak", // ZMIEŃ!
    email: "filip.misiak11@gmail.com", // ZMIEŃ!
    twitter: "", // Opcjonalnie
  },
  
  // CV
  cvUrl: "/cv.pdf", // Umieść plik cv.pdf w public/
  
  // Google Analytics
  googleAnalyticsId: "G-XXXXXXXXXX", // ZMIEŃ na swoje ID lub zostaw puste
  
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
    { name: "Unity", icon: "devicon-unity-original-wordmark" },
    { name: "Unreal Engine", icon: "devicon-unrealengine-original" },
    { name: "Android", icon: "devicon-android-plain" },
    { name: ".NET", icon: "devicon-dotnetcore-plain" },
    { name: "SQL", icon: "devicon-mysql-plain" },
    { name: "MongoDB", icon: "devicon-mongodb-plain" },
    { name: "Power Apps", icon: "🟣" },
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
      school: "Zespół Szkół Elektrycznych i Informatycznych w Katowicach",
      website: "https://zseeim.edu.pl/",
      period: "2019",
      icon: "🎓"
    },
    {
      title: "Licencjat z informatyki – Programowanie gier i aplikacji mobilnych",
      school: "Uniwersytet Ekonomiczny w Katowicach",
      website: "https://www.ue.katowice.pl/",
      period: "2024",
      icon: "🎓"
    },
    {
      title: "Magisterka z informatyki – Analiza danych",
      school: "Uniwersytet Ekonomiczny w Katowicach",
      website: "https://www.ue.katowice.pl/",
      period: "w trakcie",
      icon: "🎓"
    }
  ],
  en: [
    {
      title: "IT Technician",
      school: "Zespół Szkół Elektrycznych i Informatycznych w Katowicach",
      website: "https://zseeim.edu.pl/",
      period: "2019",
      icon: "🎓"
    },
    {
      title: "Bachelor of Computer Science – Game and Mobile App Programming",
      school: "University of Economics in Katowice",
      website: "https://www.ue.katowice.pl/",
      period: "2024",
      icon: "🎓"
    },
    {
      title: "Master of Computer Science – Data Analysis",
      school: "University of Economics in Katowice",
      website: "https://www.ue.katowice.pl/",
      period: "in progress",
      icon: "🎓"
    }
  ]
},
  
  // Certyfikaty i osiągnięcia
  achievements: {
    pl: [
      {
        title: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023",
        icon: "🏆"
      },
    ],
    en: [
      {
        title: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023",
        icon: "🏆"
      },
    ]
  },
  
  // Featured Projects (spoza GitHub lub highlight z GitHub)
  featuredProjects: {
    pl: [
      {
        title: "Blog Najlepszy muzyczny adres",
        description: "Blog muzyczny stworzony z wykorzystaniem Payload CMS.",
        image: "./projects/blog.jpg", 
        technologies: ["React", "Node.js", "TypeScript", "Payload CMS"],
        demoUrl: "https://payload-website-starter-one-rust.vercel.app/posts",
        githubUrl: "", 
        featured: true
      },
      {
        title: "Arakanoid",
        description: "Gra stworzona w Unity wzorująca się na klasycznej grze Arkanoid.",
        image: "./projects/arkanoid.jpg",
        technologies: ["Unity", "C#"],
        demoUrl: "https://demo2.example.com",
        githubUrl: "https://github.com/misiakfilip/arkanoid",
        featured: true
      },
    ],
    en: [
      {
        title: "Best Music Blog",
        description: "A music blog created using Payload CMS.",
        image: "./projects/blog.jpg", 
        technologies: ["React", "Node.js", "TypeScript", "Payload CMS"],
        demoUrl: "https://payload-website-starter-one-rust.vercel.app/posts",
        githubUrl: "", 
        featured: true
      },
      {
        title: "Arkanoid",
        description: "A Unity game inspired by the classic Arkanoid game.",
        image: "./projects/arkanoid.jpg",
        technologies: ["Unity", "C#"],
        demoUrl: "https://demo2.example.com",
        githubUrl: "https://github.com/misiakfilip/arkanoid",
        featured: true
      },
    ]
  }
};

export type Config = typeof config;