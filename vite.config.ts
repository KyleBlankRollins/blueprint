import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Discover all component directories for per-component entry points.
const componentsDir = resolve(__dirname, 'source/components');
const componentEntries: Record<string, string> = {};

for (const name of readdirSync(componentsDir, { withFileTypes: true })) {
  if (name.isDirectory()) {
    const componentFile = resolve(componentsDir, name.name, `${name.name}.ts`);
    componentEntries[`components/${name.name}`] = componentFile;
  }
}

// Discover all icon entry files for per-icon entry points.
const iconEntriesDir = resolve(
  __dirname,
  'source/components/icon/icons/entries'
);
const iconEntries: Record<string, string> = {};

for (const file of readdirSync(iconEntriesDir)) {
  if (file.endsWith('.ts')) {
    const iconName = file.replace('.ts', '');
    iconEntries[`icons/${iconName}`] = resolve(iconEntriesDir, file);
  }
}

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'source/index.ts'),
        ...componentEntries,
        ...iconEntries,
      },
      formats: ['es'],
      cssFileName: 'index',
    },
    rollupOptions: {
      // Use a regex to externalize lit AND all sub-path imports
      // (e.g. lit/directives/class-map.js, lit/decorators.js, etc.)
      // as well as @lit/* packages like @lit/reactive-element.
      external: [/^lit(\/.*)?$/, /^@lit\//],
      output: {
        // Preserve the entry point directory structure in dist/.
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name]-[hash].js',
      },
    },
    sourcemap: true,
  },
});
