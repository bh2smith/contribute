import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative assets also support a catalog hosted under a URL subdirectory.
  base: './',
  test: { environment: 'jsdom', include: ['src/**/*.test.ts'] },
});
