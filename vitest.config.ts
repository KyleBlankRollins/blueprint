import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['source/**/*.test.ts'],
    watch: false, // Disable watch mode by default - run once and exit
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['source/**/*.ts'],
      exclude: [
        'source/**/*.test.ts',
        'source/**/*.stories.ts',
        'source/**/*.style.ts',
      ],
    },
  },
});
