import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://fungi.moe',
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    // @fungi/ui is a workspace package consumed as raw .astro/.tsx source (no build step of
    // its own) — keep it out of esbuild's dependency pre-bundling scan (which doesn't know
    // how to read .astro files) and force it through Vite's normal transform pipeline for
    // the SSR server bundle instead of being left as an external node_modules import.
    ssr: {
      noExternal: ['@fungi/ui'],
    },
    optimizeDeps: {
      exclude: ['@fungi/ui'],
    },
  },
  i18n: {
    defaultLocale: 'hu',
    locales: ['hu', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
