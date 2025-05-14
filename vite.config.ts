import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { setupBuild } from './build/index'

// https://vite.dev/config/
export default defineConfig({
  build: setupBuild(),
  plugins: [vue()],
  base: "/IT-Toolbox/", // 设置基础路径为仓库名称，确保在GitHub Pages上正确加载资源
});
