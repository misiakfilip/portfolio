// src/components/Navigation.tsx
import React from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: 'pl' | 'en';
  setLanguage: (value: 'pl' | 'en') => void;
  name: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  name,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const t = {
    home: { pl: "Start", en: "Home" },
    about: { pl: "O mnie", en: "About" },
    education: { pl: "Wykształcenie", en: "Education" },
    projects: { pl: "Projekty", en: "Projects" },
    contact: { pl: "Kontakt", en: "Contact" },
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-white/10 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => scrollToSection('home')}
            className="text-2xl font-bold text-gray-900 dark:text-white hover:text-cyan-400 dark:hover:text-purple-400 transition-colors"
          >
            {name}
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {['home', 'about', 'education', 'projects', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-gray-700 dark:text-gray-300 hover:text-cyan-400 dark:hover:text-purple-400 transition-colors font-medium"
              >
                {t[section as keyof typeof t][language]}
              </button>
            ))}
            
            <button
              onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              {language === 'pl' ? 'EN' : 'PL'}
            </button>
            
            {/* <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-gray-700" />
              )}
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-900 dark:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-purple-500/30">
          <div className="px-6 py-4 space-y-3">
            {['home', 'about', 'experience', 'projects', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-cyan-400 dark:hover:text-purple-400 py-2"
              >
                {t[section as keyof typeof t][language]}
              </button>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')}
                className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {language === 'pl' ? 'EN' : 'PL'}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-slate-800"
              >
                {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;