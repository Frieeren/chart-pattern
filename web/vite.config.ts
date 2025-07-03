import { sentryVitePlugin } from '@sentry/vite-plugin';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import { compression } from 'vite-plugin-compression2';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    preview: {
      allowedHosts: [env.VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS],
    },
    server: {
      port: 8000,
      proxy: {
        '/api': {
          target: 'http://localhost:8001',
          changeOrigin: true,
          rewrite: path => path.replace(/^api/, '/api'),
        },
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('node_modules')) {
              if (id.includes('apexcharts')) {
                return 'apexcharts';
              }
              if (id.includes('react-apexcharts')) {
                return 'react-apexcharts';
              }
            }
          },
        },
      },
    },
    plugins: [
      react(),
      svgr(),
      tsconfigPaths(),
      vanillaExtractPlugin(),
      compression(),
      visualizer(),
      sentryVitePlugin({
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        authToken: env.SENTRY_AUTH_TOKEN,
        sourcemaps: {
          assets: './dist/**',
          filesToDeleteAfterUpload: './dist/**/*.map',
        },
      }),
      legacy({
        targets: ['chrome >= 64', 'safari >= 12'],
        polyfills: true,
        modernPolyfills: true,
      }),
    ],
  };
});
