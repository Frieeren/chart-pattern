import { defineConfig } from 'vitest/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom'
  },
  plugins: [vanillaExtractPlugin()],
  resolve: {
    alias: {
      "@web": "/src",
    },
  },
});