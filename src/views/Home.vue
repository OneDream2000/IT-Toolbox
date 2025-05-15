<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="welcome-section">
          <img src="/ItToolbox.svg" alt="IT Toolbox Logo" />
          <h1>IT工具箱</h1>
        </div>
        <p class="welcome-subtitle">一站式IT开发工具集合，提高您的开发效率</p>
      </el-col>
    </el-row>

    <!-- 搜索和分类筛选区域 -->
    <el-row :gutter="20" class="search-filter-section">
      <el-col :span="24">
        <el-input
          v-model="searchQuery"
          placeholder="搜索工具..."
          prefix-icon="Search"
          clearable
          @clear="resetSearch"
        />
      </el-col>
    </el-row>

    <!-- 分类标签 -->
    <el-row :gutter="20" class="category-section">
      <el-col :span="24">
        <div class="category-tags">
          <el-tag
            :effect="selectedCategory === '' ? 'dark' : 'plain'"
            @click="filterByCategory('')"
            class="category-tag"
          >
            全部
          </el-tag>
          <el-tag
            v-for="category in categories"
            :key="category"
            :effect="selectedCategory === category ? 'dark' : 'plain'"
            @click="filterByCategory(category)"
            class="category-tag"
          >
            {{ category }}
          </el-tag>
        </div>
      </el-col>
    </el-row>

    <!-- 工具卡片列表 -->
    <el-row :gutter="20">
      <el-col
        v-for="tool in filteredTools"
        :key="tool.name"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <el-card
          class="tool-card"
          shadow="hover"
          @click="navigateTo(tool.path)"
        >
          <div class="tool-icon">
            <el-icon :size="32">
              <component :is="tool.icon" />
            </el-icon>
          </div>
          <div class="tool-info">
            <h3>{{ tool.name }}</h3>
            <p>{{ tool.description }}</p>
          </div>
          <div class="tool-tags">
            <el-tag size="small" effect="plain">{{ tool.category }}</el-tag>
            <el-tag size="small" type="success" v-if="tool.isNew" effect="light"
              >新</el-tag
            >
            <el-tag size="small" type="warning" v-if="tool.isHot" effect="light"
              >热门</el-tag
            >
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 无结果提示 -->
    <el-empty
      v-if="filteredTools.length === 0"
      description="没有找到匹配的工具"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Document,
  Timer,
  Link,
  Connection,
  Search,
  Picture,
  Crop,
  Key,
  Monitor,
  Histogram,
} from "@element-plus/icons-vue";

const router = useRouter();

interface Tool {
  name: string;
  description: string;
  path: string;
  icon: any;
  category: string;
  isNew?: boolean;
  isHot?: boolean;
}

// 搜索和分类筛选
const searchQuery = ref("");
const selectedCategory = ref("");

// 工具列表
const toolList = ref<Tool[]>([
  {
    name: "Base64编码/解码",
    description: "在线Base64编码和解码工具",
    path: "/base64",
    icon: Document,
    category: "编码转换",
    isHot: true,
  },
  {
    name: "图片Base64编码",
    description: "图片转Base64编码工具",
    path: "/image-base64",
    icon: Picture,
    category: "编码转换",
  },
  {
    name: "时间戳转换",
    description: "时间戳与日期时间互转工具",
    path: "/timestamp",
    icon: Timer,
    category: "时间工具",
    isHot: true,
  },
  {
    name: "URL编码/解码",
    description: "URL编码和解码工具",
    path: "/url-codec",
    icon: Link,
    category: "编码转换",
  },
  {
    name: "JSON格式化",
    description: "JSON数据格式化和压缩工具",
    path: "/json-format",
    icon: Document,
    category: "编码转换",
    isHot: true,
  },
  {
    name: "MD5/SHA加密工具",
    description: "多种哈希算法加密工具",
    path: "/hash-tools",
    icon: Key,
    category: "安全工具",
  },
  {
    name: "正则表达式测试器",
    description: "在线测试和验证正则表达式",
    path: "/regex-tester",
    icon: Monitor,
    category: "开发工具",
    isNew: true,
  },
  {
    name: "二维码生成器",
    description: "生成自定义二维码图片",
    path: "/qr-generator",
    icon: Crop,
    category: "图像工具",
    isNew: true,
  },
  {
    name: "AI工具导航",
    description: "优质AI工具资源导航",
    path: "/ai-tools",
    icon: Connection,
    category: "AI工具",
  },
]);

// 获取所有分类
const categories = computed(() => {
  const categorySet = new Set(toolList.value.map((tool) => tool.category));
  return Array.from(categorySet);
});

// 根据搜索和分类筛选工具
const filteredTools = computed(() => {
  return toolList.value.filter((tool) => {
    // 分类筛选
    const categoryMatch =
      selectedCategory.value === "" || tool.category === selectedCategory.value;

    // 搜索筛选
    const searchMatch =
      searchQuery.value === "" ||
      tool.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tool.description
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.value.toLowerCase());

    return categoryMatch && searchMatch;
  });
});

// 分类筛选方法
const filterByCategory = (category: string) => {
  selectedCategory.value = category;
};

// 重置搜索
const resetSearch = () => {
  searchQuery.value = "";
};

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
@import "../assets/style/home.css";

.home-container {
  padding: 20px;
}

.welcome-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: var(--el-text-color-secondary);
  margin-bottom: 30px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 30px;
}

.search-filter-section {
  margin-bottom: 20px;
}

.category-section {
  margin-bottom: 20px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-tag {
  cursor: pointer;
  user-select: none;
}

.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
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
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.tool-icon {
  margin-bottom: 15px;
  color: var(--el-color-primary);
}

.tool-info {
  text-align: center;
  width: 100%;
}

.tool-info h3 {
  margin-bottom: 5px;
  font-size: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tool-info p {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
}
</style>
