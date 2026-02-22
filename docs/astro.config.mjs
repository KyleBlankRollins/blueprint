// @ts-check
import { defineConfig } from 'astro/config';
import lit from '@astrojs/lit';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [lit(), mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  vite: {
    optimizeDeps: {
      include: ['@krollins/blueprint'],
    },
    ssr: {
      noExternal: ['@krollins/blueprint'],
    },
  },
});
