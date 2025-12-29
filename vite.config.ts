import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Blueprint',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['lit'],
      output: {
        globals: {
          lit: 'Lit'
        }
      }
    },
    sourcemap: true
  },
  server: {
    open: '/demo/'
  }
});