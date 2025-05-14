import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { setupBuild } from './build/index'

// https://vite.dev/config/
export default defineConfig({
  build: setupBuild(),
  plugins: [vue()],
  base: "./", // 设置基础路径，确保在GitHub Pages上正确加载资源
});
