<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const route = useRoute()
const activeIndex = computed(() => route.path)
const isDarkMode = ref(false)

const toggleDarkMode = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    document.body.setAttribute('class', 'dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.body.removeAttribute('class')
    localStorage.setItem('theme', 'light')
  }
}

// 初始化主题
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
    document.body.setAttribute('class', 'dark')
  }
}

// 使用onMounted确保在DOM加载完成后初始化主题
onMounted(() => {
  initTheme()
})
</script>

<template>
  <el-config-provider :locale="zhCn" :button="{ autoInsertSpace: true }" :message="{ max: 3 }" :size="'default'" :z-index="3000">
    <div class="app-container">
      <el-container>
        <el-header height="60px">
          <div class="header-container">
            <div class="logo">
              <router-link to="/">
                <h1>IT工具箱</h1>
              </router-link>
            </div>
            <el-menu
              mode="horizontal"
              :ellipsis="false"
              router
              :default-active="activeIndex"
            >
              <el-menu-item index="/">首页</el-menu-item>
              <el-sub-menu index="tools">
                <template #title>工具集</template>
                <el-menu-item index="/base64">Base64编码/解码</el-menu-item>
                <el-menu-item index="/image-base64">图片Base64编码</el-menu-item>
                <el-menu-item index="/timestamp">时间戳转换</el-menu-item>
                <el-menu-item index="/url-codec">URL编码/解码</el-menu-item>
                <el-menu-item index="/json-format">JSON格式化</el-menu-item>
                <el-menu-item index="/hash-tools">MD5/SHA加密工具</el-menu-item>
                <el-menu-item index="/regex-tester">正则表达式测试器</el-menu-item>
                <el-menu-item index="/qr-generator">二维码生成器</el-menu-item>
              </el-sub-menu>
              <el-menu-item index="/ai-tools">AI工具导航</el-menu-item>
            </el-menu>
            <div class="theme-switch">
              <el-switch
                v-model="isDarkMode"
                @change="toggleDarkMode"
                inline-prompt
                active-text="暗"
                inactive-text="亮"
              />
            </div>
          </div>
        </el-header>
        
        <el-main>
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
        
        <el-footer height="60px">
          <div class="footer-content">
            <p>© {{ new Date().getFullYear() }} IT工具箱 | 一站式IT开发工具集合</p>
          </div>
        </el-footer>
      </el-container>
    </div>
  </el-config-provider>
</template>

<style>
/* 暗黑模式样式 */
html.dark {
  color-scheme: dark;
}

html.dark body {
  background-color: #1a1a1a;
  color: #f5f5f5;
}

html.dark .el-card {
  background-color: #252525;
  border-color: #333;
  color: #f5f5f5;
}

html.dark .el-header {
  background-color: #252525;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

html.dark .el-footer {
  background-color: #252525;
  color: #f5f5f5;
}

html.dark .el-menu {
  background-color: #252525;
}

html.dark .el-menu--horizontal > .el-menu-item {
  color: #f5f5f5;
}

html.dark .el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
  color: #f5f5f5;
}

html.dark .el-menu--horizontal > .el-menu-item.is-active {
  color: var(--el-color-primary);
}

html.dark .logo h1 {
  color: #f5f5f5;
}

html.dark .el-main {
  background-color: #1a1a1a;
}
/* 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

#app {
  height: 100%;
}

.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.header-container {
  display: flex;
  align-items: center;
  height: 100%;
}

.logo {
  margin-right: 20px;
}

.logo a {
  text-decoration: none;
}

.theme-switch {
  margin-left: 20px;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--el-color-primary);
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}

.el-footer {
  background-color: #fff;
  border-top: 1px solid #e6e6e6;
}

.footer-content {
  text-align: center;
  line-height: 60px;
  color: var(--el-text-color-secondary);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
