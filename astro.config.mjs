// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://misiakfilip.github.io',
  base: '/portfolio',
  trailingSlash: 'always',
  
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});