// src/components/Navigation.tsx
import React from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

// Single source of truth for nav items (desktop and mobile menus).
const SECTIONS = ['home', 'about', 'education', 'projects', 'contact'] as const;
type Section = (typeof SECTIONS)[number];

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
  const t: Record<Section, { pl: string; en: string }> = {
    home: { pl: "Start", en: "Home" },
    about: { pl: "O mnie", en: "About" },
    education: { pl: "Wykształcenie", en: "Education" },
    projects: { pl: "Projekty", en: "Projects" },
    contact: { pl: "Kontakt", en: "Contact" },
  };

  const closeMenu = () => setMobileMenuOpen(false);
  const nextLanguage = language === 'pl' ? 'en' : 'pl';
  const a11y = {
    nav: { pl: 'Główna nawigacja', en: 'Main navigation' },
    menu: { pl: 'Menu', en: 'Menu' },
    switchLang: { pl: 'EN: przełącz język na angielski', en: 'PL: switch language to Polish' },
    theme: { pl: 'Przełącz motyw', en: 'Toggle theme' },
  };
  const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 rounded';

  return (
    <nav aria-label={a11y.nav[language]} className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-white/10 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a
            href="#home"
            onClick={closeMenu}
            className={`text-2xl font-bold text-gray-900 dark:text-white hover:text-cyan-400 dark:hover:text-purple-400 transition-colors ${focusRing}`}
          >
            {name}
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {SECTIONS.map(section => (
              <a
                key={section}
                href={`#${section}`}
                className={`text-gray-700 dark:text-gray-300 hover:text-cyan-400 dark:hover:text-purple-400 transition-colors font-medium ${focusRing}`}
              >
                {t[section][language]}
              </a>
            ))}
            
            <button
              onClick={() => setLanguage(nextLanguage)}
              aria-label={a11y.switchLang[language]}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
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
            aria-label={a11y.menu[language]}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className={`md:hidden p-2 text-gray-900 dark:text-white ${focusRing}`}
          >
            {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-purple-500/30">
          <div className="px-6 py-4 space-y-3">
            {SECTIONS.map(section => (
              <a
                key={section}
                href={`#${section}`}
                onClick={closeMenu}
                className={`block w-full text-left text-gray-700 dark:text-gray-300 hover:text-cyan-400 dark:hover:text-purple-400 py-2 ${focusRing}`}
              >
                {t[section][language]}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setLanguage(nextLanguage)}
                aria-label={a11y.switchLang[language]}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {language === 'pl' ? 'EN' : 'PL'}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                aria-label={a11y.theme[language]}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 px-3 py-2 rounded-lg bg-gray-200 dark:bg-slate-800"
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