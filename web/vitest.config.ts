import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
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
