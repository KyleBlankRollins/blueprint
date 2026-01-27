// @ts-check
import { defineConfig } from 'astro/config';
import lit from '@astrojs/lit';

// https://astro.build/config
export default defineConfig({
  integrations: [lit()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  vite: {
    // Allow importing from the parent source directory
    server: {
      fs: {
        allow: ['..'],
      },
    },
    esbuild: {
      // Enable TypeScript decorators
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          useDefineForClassFields: false,
        },
      },
    },
  },
});
