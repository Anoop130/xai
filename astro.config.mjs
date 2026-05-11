import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// read deployment env vars with safe defaults for local dev
// eslint-disable-next-line no-undef
const site = process.env.SITE_URL ?? 'http://localhost:4321';
// eslint-disable-next-line no-undef
const base = process.env.BASE_PATH ?? '';

export default defineConfig({
  site,
  base,
  integrations: [
    react(),
    // disable auto base styles so global.css controls injection order
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
});
