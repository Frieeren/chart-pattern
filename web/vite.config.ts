import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';


// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), svgr(), tsconfigPaths(), vanillaExtractPlugin()],
});
