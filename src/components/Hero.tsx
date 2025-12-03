// src/components/Hero.tsx
import React from 'react';
import { Github, Linkedin, Mail, Download } from 'lucide-react';

interface GitHubUser {
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface HeroProps {
  name: string;
  title: string;
  bio: string;
  userData: GitHubUser | null;
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
  language: 'pl' | 'en';
}

const Hero: React.FC<HeroProps> = ({ name, title, bio, userData, social, language }) => {
  const t = {
    greeting: { pl: 'Cześć, jestem', en: "Hi, I'm" },
    viewGitHub: { pl: 'Zobacz GitHub', en: 'View GitHub' },
    contact: { pl: 'Kontakt', en: 'Contact' },
    downloadCV: { pl: 'Pobierz CV', en: 'Download CV' },
    repos: { pl: 'Repozytoriów', en: 'Repos' },
    followers: { pl: 'Obserwujących', en: 'Followers' },
  };

  return (
    <section id="home" className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              {t.greeting[language]}{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-400">
                {name}
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-4 font-semibold">
              {title}
            </p>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
              {bio}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center md:justify-start flex-wrap mb-8">
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Github size={20} />
                {t.viewGitHub[language]}
              </a>
              
              <a
                href={`mailto:${social.email}`}
                className="px-6 py-3 bg-gray-800 dark:bg-slate-800 hover:bg-gray-700 dark:hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Mail size={20} />
                {t.contact[language]}
              </a>
              
              <a
                href="/cv.pdf"
                download
                className="px-6 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg flex items-center gap-2 transition-colors font-semibold transform hover:-translate-y-0.5"
              >
                <Download size={20} />
                {t.downloadCV[language]}
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-6 justify-center md:justify-start">
              <a 
                href={social.github} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors transform hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={28} />
              </a>
              <a 
                href={social.linkedin} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={28} />
              </a>
              <a 
                href={`mailto:${social.email}`}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors transform hover:scale-110"
                aria-label="Email"
              >
                <Mail size={28} />
              </a>
            </div>
          </div>

          {/* Avatar + Stats */}
          {userData && (
            <div className="shrink-0">
              <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                    <img
                      src={userData.avatar_url}
                      alt={name}
                      className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-purple-500 shadow-2xl object-cover"
                    />
                
                {/* Stats Badge */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-full px-8 py-3 shadow-xl border-2 border-purple-500/30 backdrop-blur-sm">
                  <div className="flex gap-8 text-center">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-2xl">
                        {userData.public_repos}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {t.repos[language]}
                      </div>
                    </div>
                    <div className="border-l-2 border-gray-200 dark:border-gray-700"></div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-2xl">
                        {userData.followers}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {t.followers[language]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;