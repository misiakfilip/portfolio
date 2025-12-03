//src/components/Portfolio.tsx
import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Hero from './Hero';
import TechCarousel from './TechCarousel';
import About from './About';
import Achievements from './Achievements';
import FeaturedProjects from './FeaturedProjects';
import GitHubRepos from './GitHubRepos';
import Contact from './Contact';

interface GitHubUser {
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface Config {
  name: string;
  username: string;
  title: { pl: string; en: string };
  bio: { pl: string; en: string };
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
  technologies: Array<{ name: string; icon: string }>;
  experience: {
    pl: Array<{
      period: string;
      title: string;
      company: string;
      description: string;
      technologies: string[];
    }>;
    en: Array<{
      period: string;
      title: string;
      company: string;
      description: string;
      technologies: string[];
    }>;
  };
  achievements: {
    pl: Array<{ title: string; issuer: string; date: string; icon: string }>;
    en: Array<{ title: string; issuer: string; date: string; icon: string }>;
  };
  featuredProjects: {
    pl: Array<{
      title: string;
      description: string;
      image?: string;
      technologies: string[];
      demoUrl?: string;
      githubUrl?: string;
      featured: boolean;
    }>;
    en: Array<{
      title: string;
      description: string;
      image?: string;
      technologies: string[];
      demoUrl?: string;
      githubUrl?: string;
      featured: boolean;
    }>;
  };
}

interface PortfolioProps {
  config: Config;
}

const Portfolio: React.FC<PortfolioProps> = ({ config }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState<'pl' | 'en'>('pl');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGitHubUser();
  }, []);

  const fetchGitHubUser = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${config.username}`);
      if (response.ok) {
        const data: GitHubUser = await response.json();
        setUserData(data);
      }
      setLoading(false);
    } catch (err) {
      console.error('GitHub user fetch error:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-white text-xl">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 transition-colors">
        
        {/* Navigation */}
        <Navigation
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          language={language}
          setLanguage={setLanguage}
          name={config.name}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Hero */}
        <Hero
          name={config.name}
          title={config.title[language]}
          bio={config.bio[language]}
          userData={userData}
          social={config.social}
          language={language}
        /> 

        {/*Technologies Carousel */}
        <TechCarousel
          technologies={config.technologies}
          language={language}
        />

        {/* About & Timeline */}
        <About
          experience={config.experience[language]}
          language={language}
        />

        {/* Achievements */}
        <Achievements
          achievements={config.achievements[language]}
          language={language}
        />

        {/* Featured Projects */}
        <FeaturedProjects
          projects={config.featuredProjects[language]}
          language={language}
        />

        {/* GitHub Repositories */}
        <GitHubRepos
          username={config.username}
          language={language}
        />

        {/* Contact */}
        <Contact
          name={config.name}
          email={config.social.email}
          github={config.social.github}
          linkedin={config.social.linkedin}
          language={language}
        />

        {/* Footer */}
        <footer className="py-8 border-t border-gray-200 dark:border-purple-500/30 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} {config.name}.{' '}
              {language === 'pl' 
                ? 'Wszystkie prawa zastrzeżone. Projekty automatycznie synchronizowane z GitHub.' 
                : 'All rights reserved. Projects automatically synced with GitHub.'}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;