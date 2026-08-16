import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'engine',
          environment: 'node',
          include: ['tests/engine/**/*.test.js', 'tests/core/**/*.test.js'],
        },
      },
      {
        // UI templating touches DOM-adjacent APIs, so it needs a document.
        test: {
          name: 'ui',
          environment: 'jsdom',
          include: ['tests/ui/**/*.test.js'],
        },
      },
    ],
  },
});
