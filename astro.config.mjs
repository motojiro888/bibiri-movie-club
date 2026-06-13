import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://motojiro888.github.io',
  base: '/bibiri-movie-club',
  integrations: [sitemap()],
});