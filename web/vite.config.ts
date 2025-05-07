import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

	return {
		preview: {
      allowedHosts: [env.VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS],
    },
    plugins: [react(), svgr(), tsconfigPaths(), vanillaExtractPlugin()],
  };
});
