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
  
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap({ filter: (page) => !page.endsWith("/404") && !page.endsWith("/404/") })],
});