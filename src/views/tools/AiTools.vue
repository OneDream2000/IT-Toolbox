<template>
  <div class="tool-container">
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h2>AI工具导航</h2>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索AI工具..."
          prefix-icon="Search"
          clearable
        />
      </div>
      
      <el-tabs v-model="activeCategory">
        <el-tab-pane v-for="category in categories" :key="category.id" :label="category.name" :name="category.id">
          <div class="tools-grid">
            <el-card 
              v-for="tool in filteredTools(category.id)" 
              :key="tool.id"
              class="ai-tool-card"
              shadow="hover"
              @click="openToolUrl(tool.url)"
            >
              <div class="tool-icon">
                <el-icon :size="32">
                  <component :is="tool.icon || 'Connection'" />
                </el-icon>
              </div>
              <div class="tool-info">
                <h3>{{ tool.name }}</h3>
                <p class="tool-desc">{{ tool.description }}</p>
                <div class="tool-tags">
                  <el-tag v-for="tag in tool.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import {
  Connection,
  ChatDotRound,
  PictureFilled,
  VideoCamera,
  Edit,
  Promotion,
  DataAnalysis,
  Monitor,
  Cpu
} from '@element-plus/icons-vue'

interface AiTool {
  id: string
  name: string
  description: string
  url: string
  category: string
  tags: string[]
  icon?: any
}

interface Category {
  id: string
  name: string
}

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = ref<Category[]>([
  { id: 'all', name: '全部' },
  { id: 'chat', name: '聊天对话' },
  { id: 'image', name: '图像生成' },
  { id: 'video', name: '视频生成' },
  { id: 'writing', name: '文本创作' },
  { id: 'coding', name: '编程开发' },
  { id: 'productivity', name: '效率工具' }
])

const aiTools = ref<AiTool[]>([
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI开发的大型语言模型，可以进行自然对话、回答问题、创作内容等',
    url: 'https://chat.openai.com',
    category: 'chat',
    tags: ['对话', 'AI助手', '问答'],
    icon: ChatDotRound
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic开发的AI助手，擅长自然对话和长文本处理',
    url: 'https://claude.ai',
    category: 'chat',
    tags: ['对话', 'AI助手', '长文本'],
    icon: ChatDotRound
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: '强大的AI图像生成工具，通过文本描述创建高质量艺术图像',
    url: 'https://www.midjourney.com',
    category: 'image',
    tags: ['图像生成', '艺术创作'],
    icon: PictureFilled
  },
  {
    id: 'dalle',
    name: 'DALL-E',
    description: 'OpenAI开发的AI图像生成系统，可根据文本描述创建图像',
    url: 'https://openai.com/dall-e-3',
    category: 'image',
    tags: ['图像生成', '创意设计'],
    icon: PictureFilled
  },
  {
    id: 'runway',
    name: 'Runway',
    description: 'AI视频生成和编辑工具，可创建和修改视频内容',
    url: 'https://runwayml.com',
    category: 'video',
    tags: ['视频生成', '视频编辑'],
    icon: VideoCamera
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    description: 'AI视频创建平台，可生成逼真的AI人物视频',
    url: 'https://www.synthesia.io',
    category: 'video',
    tags: ['视频生成', 'AI人物'],
    icon: VideoCamera
  },
  {
    id: 'jasper',
    name: 'Jasper',
    description: 'AI写作助手，帮助创建营销文案、博客文章等内容',
    url: 'https://www.jasper.ai',
    category: 'writing',
    tags: ['写作', '内容创作'],
    icon: Edit
  },
  {
    id: 'copy',
    name: 'Copy.ai',
    description: 'AI文案生成工具，适用于营销、社交媒体等内容创作',
    url: 'https://www.copy.ai',
    category: 'writing',
    tags: ['写作', '营销文案'],
    icon: Edit
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI编程助手，提供代码建议和自动完成功能',
    url: 'https://github.com/features/copilot',
    category: 'coding',
    tags: ['编程', '代码生成'],
    icon: Cpu
  },
  {
    id: 'replit-ghostwriter',
    name: 'Replit Ghostwriter',
    description: 'Replit平台的AI编程助手，帮助编写和解释代码',
    url: 'https://replit.com/site/ghostwriter',
    category: 'coding',
    tags: ['编程', '代码生成'],
    icon: Cpu
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    description: 'Notion集成的AI助手，帮助写作、总结和组织信息',
    url: 'https://www.notion.so/product/ai',
    category: 'productivity',
    tags: ['效率', '写作', '组织'],
    icon: Monitor
  },
  {
    id: 'otter',
    name: 'Otter.ai',
    description: 'AI语音转文字和会议记录工具',
    url: 'https://otter.ai',
    category: 'productivity',
    tags: ['语音转文字', '会议记录'],
    icon: Promotion
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    description: 'AI搜索引擎，提供准确的信息和引用来源',
    url: 'https://www.perplexity.ai',
    category: 'productivity',
    tags: ['搜索', '信息查询'],
    icon: DataAnalysis
  }
])

// 根据搜索和分类过滤工具
const filteredTools = (categoryId: string) => {
  return aiTools.value.filter(tool => {
    // 搜索过滤
    const matchesSearch = searchQuery.value === '' || 
      tool.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    // 分类过滤
    const matchesCategory = categoryId === 'all' || tool.category === categoryId
    
    return matchesSearch && matchesCategory
  })
}

// 打开工具URL
const openToolUrl = (url: string) => {
  ElMessageBox.confirm(
    `您即将访问外部网站: ${url}`,
    '提示',
    {
      confirmButtonText: '访问',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    window.open(url, '_blank')
  }).catch(() => {})
}
</script>

<style scoped>
.tool-container {
  max-width: 1200px;
  margin: 0 auto;
}

.tool-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.ai-tool-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.3s;
}

.ai-tool-card:hover {
  transform: translateY(-5px);
}

.tool-icon {
  margin-bottom: 15px;
  color: var(--el-color-primary);
}

.tool-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.tool-desc {
  color: var(--el-text-color-secondary);
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>