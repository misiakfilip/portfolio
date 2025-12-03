// src/config.ts
export const config = {
  // Podstawowe info
  name: "Filip Misiak",
  username: "misiakfilip",
  title: {
    pl: "Full-Stack Developer",
    en: "Full-Stack Developer"
  },
  bio: {
    pl: "Pasjonat tworzenia aplikacji webowych i mobilnych. Specjalizuję się w React, Node.js i technologiach cloud.",
    en: "Passionate about creating web and mobile applications. I specialize in React, Node.js and cloud technologies."
  },
  
  // Social links
  social: {
    github: "https://github.com/misiakfilip",
    linkedin: "https://linkedin.com/in/twoj-profil", // ZMIEŃ!
    email: "twoj.email@example.com", // ZMIEŃ!
    twitter: "", // Opcjonalnie
  },
  
  // CV
  cvUrl: "/cv.pdf", // Umieść plik cv.pdf w public/
  
  // Google Analytics
  googleAnalyticsId: "G-XXXXXXXXXX", // ZMIEŃ na swoje ID lub zostaw puste
  
  // Technologie (będą pokazane jako ikony)
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
    { name: "Unity", icon: "devicon-unity-original" },
    { name: "Unreal Engine", icon: "devicon-unrealengine-original" },
    { name: "Android", icon: "devicon-android-plain" },
    { name: ".NET", icon: "devicon-dotnetcore-plain" },
    { name: "SQL", icon: "devicon-mysql-plain" },
    { name: "MongoDB", icon: "devicon-mongodb-plain" },
  ],
  
  // Timeline doświadczenia
  experience: {
    pl: [
      {
        period: "2023 - Teraz",
        title: "Full-Stack Developer",
        company: "Nazwa Firmy", // ZMIEŃ!
        description: "Tworzenie aplikacji webowych w React i Node.js. Zarządzanie bazami danych i API.",
        technologies: ["React", "Node.js", "TypeScript", "MongoDB"]
      },
      {
        period: "2021 - 2023",
        title: "Junior Developer",
        company: "Inna Firma", // ZMIEŃ!
        description: "Rozwój aplikacji mobilnych w React Native. Współpraca z zespołem backend.",
        technologies: ["React Native", "JavaScript", "Firebase"]
      },
      // Dodaj więcej...
    ],
    en: [
      {
        period: "2023 - Present",
        title: "Full-Stack Developer",
        company: "Company Name",
        description: "Building web applications with React and Node.js. Managing databases and APIs.",
        technologies: ["React", "Node.js", "TypeScript", "MongoDB"]
      },
      {
        period: "2021 - 2023",
        title: "Junior Developer",
        company: "Other Company",
        description: "Developing mobile apps in React Native. Collaborating with backend team.",
        technologies: ["React Native", "JavaScript", "Firebase"]
      },
      // Add more...
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
      {
        title: "React Advanced Course",
        issuer: "Udemy",
        date: "2022",
        icon: "📜"
      },
      // Dodaj więcej...
    ],
    en: [
      {
        title: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023",
        icon: "🏆"
      },
      {
        title: "React Advanced Course",
        issuer: "Udemy",
        date: "2022",
        icon: "📜"
      },
      // Add more...
    ]
  },
  
  // Featured Projects (spoza GitHub lub highlight z GitHub)
  featuredProjects: {
    pl: [
      {
        title: "Aplikacja E-commerce",
        description: "Pełna aplikacja sklepu internetowego z systemem płatności i zarządzaniem produktami.",
        image: "/projects/ecommerce.jpg", // Umieść w public/projects/
        technologies: ["React", "Node.js", "Stripe", "MongoDB"],
        demoUrl: "https://demo.example.com",
        githubUrl: "", // Jeśli nie ma na GitHub
        featured: true
      },
      {
        title: "Portfolio Generator",
        description: "Narzędzie do automatycznego generowania portfolio na podstawie danych z GitHub.",
        image: "/projects/portfolio-gen.jpg",
        technologies: ["Astro", "TypeScript", "GitHub API"],
        demoUrl: "https://demo2.example.com",
        githubUrl: "https://github.com/misiakfilip/portfolio-generator",
        featured: true
      },
      // Dodaj więcej...
    ],
    en: [
      {
        title: "E-commerce Application",
        description: "Full e-commerce store with payment system and product management.",
        image: "/projects/ecommerce.jpg",
        technologies: ["React", "Node.js", "Stripe", "MongoDB"],
        demoUrl: "https://demo.example.com",
        githubUrl: "",
        featured: true
      },
      {
        title: "Portfolio Generator",
        description: "Tool for automatically generating portfolios based on GitHub data.",
        image: "/projects/portfolio-gen.jpg",
        technologies: ["Astro", "TypeScript", "GitHub API"],
        demoUrl: "https://demo2.example.com",
        githubUrl: "https://github.com/misiakfilip/portfolio-generator",
        featured: true
      },
      // Add more...
    ]
  }
};

export type Config = typeof config;