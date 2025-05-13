<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="welcome-section">
          <h1>IT工具箱</h1>
          <p>一站式IT开发工具集合，提高您的开发效率</p>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col v-for="tool in toolList" :key="tool.name" :xs="24" :sm="12" :md="8" :lg="6">
        <el-card class="tool-card" shadow="hover" @click="navigateTo(tool.path)">
          <div class="tool-icon">
            <el-icon :size="32">
              <component :is="tool.icon" />
            </el-icon>
          </div>
          <div class="tool-info">
            <h3>{{ tool.name }}</h3>
            <p>{{ tool.description }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Document,
  Timer,
  Link,
  Connection
} from '@element-plus/icons-vue'

const router = useRouter()

interface Tool {
  name: string
  description: string
  path: string
  icon: any
}

const toolList = ref<Tool[]>([
  {
    name: 'Base64编码/解码',
    description: '在线Base64编码和解码工具',
    path: '/base64',
    icon: Document
  },
  {
    name: '时间戳转换',
    description: '时间戳与日期时间互转工具',
    path: '/timestamp',
    icon: Timer
  },
  {
    name: 'URL编码/解码',
    description: 'URL编码和解码工具',
    path: '/url-codec',
    icon: Link
  },
  {
    name: 'JSON格式化',
    description: 'JSON数据格式化和压缩工具',
    path: '/json-format',
    icon: Document
  },
  {
    name: 'MD5/SHA加密工具',
    description: '多种哈希算法加密工具',
    path: '/hash-tools',
    icon: Document
  },
  {
    name: 'AI工具导航',
    description: '优质AI工具资源导航',
    path: '/ai-tools',
    icon: Connection
  }
])

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-section h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: var(--el-color-primary);
}

.welcome-section p {
  font-size: 1.2rem;
  color: var(--el-text-color-secondary);
}

.tool-card {
  height: 160px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tool-card:hover {
  transform: translateY(-5px);
}

.tool-icon {
  margin-bottom: 15px;
  color: var(--el-color-primary);
}

.tool-info {
  text-align: center;
}

.tool-info h3 {
  margin-bottom: 5px;
  font-size: 1.2rem;
}

.tool-info p {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}
</style>