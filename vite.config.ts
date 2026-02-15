import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'source/index.ts'),
      name: 'Blueprint',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      // Use a regex to externalize lit AND all sub-path imports
      // (e.g. lit/directives/class-map.js, lit/decorators.js, etc.)
      // as well as @lit/* packages like @lit/reactive-element.
      external: [/^lit(\/.*)?$/, /^@lit\//],
      output: {
        globals: {
          lit: 'Lit',
        },
      },
    },
    sourcemap: true,
  },
});
