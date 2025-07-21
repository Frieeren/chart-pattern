import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.tsx'],
    globals: true,
    environment: 'jsdom',
  },
  plugins: [vanillaExtractPlugin()],
  resolve: {
    alias: {
      '@web': '/src',
    },
  },
});
