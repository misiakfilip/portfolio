// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://misiakfilip.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',

  // File-based routing: PL at /, EN under /en/ (see src/i18n/index.ts for the decision).
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  
  // Single small stylesheet: inline it to remove a render-blocking request.
  build: { inlineStylesheets: 'always' },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap({
    filter: (page) => !page.endsWith("/404") && !page.endsWith("/404/"),
    i18n: { defaultLocale: 'pl', locales: { pl: 'pl-PL', en: 'en-US' } },
  })],
});