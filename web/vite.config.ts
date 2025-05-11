import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { compression } from "vite-plugin-compression2";
import { visualizer } from "rollup-plugin-visualizer";

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
          rewrite: (path) => path.replace(/^api/, '/api')
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes("node_modules")) {
              if (id.includes("apexcharts")) {
                return "apexcharts";
              }
              if (id.includes("react-apexcharts")) {
                return "react-apexcharts";
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
    ],
  };
});
