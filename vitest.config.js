import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'engine',
          environment: 'node',
          include: ['tests/engine/**/*.test.js', 'tests/core/**/*.test.js'],
          exclude: ['tests/engine/regression.test.js'],
        },
      },
      {
        // UI templating touches DOM-adjacent APIs, so it needs a document.
        test: {
          name: 'ui',
          environment: 'jsdom',
          include: ['tests/ui/**/*.test.js', 'tests/engine/regression.test.js'],
        },
      },
      {
        // Tests of the test harness itself — nothing here imports `src/`. Its
        // own project so that a rule about what CI may claim cannot be mistaken
        // for a rule about what the product does.
        test: {
          name: 'harness',
          environment: 'node',
          include: ['tests/harness/**/*.test.js'],
        },
      },
    ],
  },
});
