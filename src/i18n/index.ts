// i18n architecture (decision): Astro file-based routing with one static page per language.
//   PL (default, no prefix): /          /projects/<slug>
//   EN:                      /en/       /en/projects/<slug>
// The language is a property of the URL, never of client state: pages are rendered statically
// in the right language, the language switch is a plain <a> to the counterpart page, and React
// islands receive the few strings they need as props. Texts: src/i18n/{pl,en}.ts (UI) and
// src/i18n/projects.ts (project subpages); structured content in src/config.ts is keyed by lang.
import { withBase } from '../utils/withBase';
import { pl, type Dictionary } from './pl';
import { en } from './en';

export type { Dictionary };
export const languages = { pl: 'Polski', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'pl';
export const otherLang = (lang: Lang): Lang => (lang === 'pl' ? 'en' : 'pl');

/** Open Graph locale for each language. */
export const ogLocale: Record<Lang, string> = { pl: 'pl_PL', en: 'en_US' };

const dictionaries: Record<Lang, Dictionary> = { pl, en };

/** Returns the typed dictionary for a language (`const t = useTranslations(lang)`). */
export function useTranslations(lang: Lang): Dictionary {
  return dictionaries[lang];
}

/** Detects the language from the URL, ignoring Astro's `base` (e.g. /portfolio/en/ -> "en"). */
export function getLangFromUrl(url: URL): Lang {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const path = base && url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname;
  const [first] = path.split('/').filter(Boolean);
  return first === 'en' ? 'en' : defaultLang;
}

/**
 * Builds a base-aware URL for a language-neutral route.
 * localizedPath('en', '/projects/Arct') -> "/portfolio/en/projects/Arct"; localizedPath('pl') -> "/portfolio/".
 */
export function localizedPath(lang: Lang, path = '/'): string {
  const clean = '/' + path.replace(/^\/+/, '');
  if (lang === defaultLang) return withBase(clean);
  return withBase(clean === '/' ? '/en/' : `/en${clean}`);
}

export { format } from './format';
