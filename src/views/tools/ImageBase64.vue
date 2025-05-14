<template>
  <div class="tool-container">
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h2>图片 Base64 编码/解码工具</h2>
        </div>
      </template>
      
      <el-tabs v-model="mainTab" class="main-tabs">
        <el-tab-pane label="图片转Base64" name="encode">
          <el-form>
            <el-form-item>
              <el-upload
                class="image-uploader"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleFileChange"
                accept="image/*"
              >
            <div class="upload-area" v-if="!imageUrl">
              <el-icon class="upload-icon"><Plus /></el-icon>
              <div class="upload-text">点击或拖拽图片到此处</div>
            </div>
            <div v-else class="preview-container">
              <img :src="imageUrl" class="preview-image" />
              <div class="image-info" v-if="imageInfo">
                <div>{{ imageInfo.name }}</div>
                <div>{{ imageInfo.size }}</div>
                <div>{{ imageInfo.dimensions }}</div>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        
        <el-form-item v-if="imageUrl">
          <div class="button-group">
            <el-button type="primary" @click="handleEncode">生成 Base64</el-button>
            <el-button @click="handleClear">清空</el-button>
          </div>
        </el-form-item>
        
        <el-divider v-if="base64Result" content-position="center">Base64 编码结果</el-divider>
        
        <template v-if="base64Result">
          <el-tabs v-model="activeTab" class="result-tabs">
            <el-tab-pane label="Data URI" name="dataUri">
              <el-form-item>
                <el-input
                  v-model="dataUriCode"
                  type="textarea"
                  :rows="4"
                  placeholder="Data URI 格式"
                  readonly
                />
                <div class="copy-button">
                  <el-button type="primary" size="small" @click="handleCopy(dataUriCode)">复制</el-button>
                </div>
              </el-form-item>
            </el-tab-pane>
            
            <el-tab-pane label="CSS" name="css">
              <el-form-item>
                <el-input
                  v-model="cssCode"
                  type="textarea"
                  :rows="4"
                  placeholder="CSS 代码"
                  readonly
                />
                <div class="copy-button">
                  <el-button type="primary" size="small" @click="handleCopy(cssCode)">复制</el-button>
                </div>
              </el-form-item>
            </el-tab-pane>
            
            <el-tab-pane label="HTML" name="html">
              <el-form-item>
                <el-input
                  v-model="htmlCode"
                  type="textarea"
                  :rows="4"
                  placeholder="HTML 代码"
                  readonly
                />
                <div class="copy-button">
                  <el-button type="primary" size="small" @click="handleCopy(htmlCode)">复制</el-button>
                </div>
              </el-form-item>
            </el-tab-pane>
            
            <el-tab-pane label="纯 Base64" name="base64">
              <el-form-item>
                <el-input
                  v-model="pureBase64"
                  type="textarea"
                  :rows="4"
                  placeholder="纯 Base64 编码"
                  readonly
                />
                <div class="copy-button">
                  <el-button type="primary" size="small" @click="handleCopy(pureBase64)">复制</el-button>
                </div>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="Base64转图片" name="decode">
          <el-form>
            <el-form-item>
              <el-input
                v-model="decodeInput"
                type="textarea"
                :rows="6"
                placeholder="请输入Base64字符串（可以是完整的Data URI或纯Base64编码）"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleDecode">解码并预览</el-button>
              <el-button @click="clearDecodeInput">清空</el-button>
            </el-form-item>
            
            <el-divider v-if="decodedImageUrl" content-position="center">预览结果</el-divider>
            
            <el-form-item v-if="decodedImageUrl">
              <div class="decoded-image-container">
                <img :src="decodedImageUrl" class="decoded-image" />
                <div class="image-actions">
                  <el-button type="primary" size="small" @click="handleDownloadImage">下载图片</el-button>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

interface ImageInfo {
  name: string
  size: string
  dimensions: string
}

const mainTab = ref('encode')
const imageUrl = ref('')
const imageFile = ref<File | null>(null)
const imageInfo = ref<ImageInfo | null>(null)
const base64Result = ref('')
const error = ref('')
const activeTab = ref('dataUri')

// Base64解码相关
const decodeInput = ref('')
const decodedImageUrl = ref('')

// 计算属性：不同格式的代码
const dataUriCode = computed(() => base64Result.value ? base64Result.value : '')
const pureBase64 = computed(() => {
  if (!base64Result.value) return ''
  return base64Result.value.split(',')[1] || ''
})
const cssCode = computed(() => {
  if (!base64Result.value) return ''
  return `.element {\n  background-image: url(${base64Result.value});\n}`
})
const htmlCode = computed(() => {
  if (!base64Result.value) return ''
  return `<img src="${base64Result.value}" alt="Base64 encoded image" />`
})

// 处理文件选择
const handleFileChange = (file: any) => {
  if (!file) {
    handleClear()
    return
  }
  
  imageFile.value = file.raw
  
  // 验证文件类型
  if (!file.raw.type.startsWith('image/')) {
    error.value = '请选择图片文件'
    handleClear()
    return
  }
  
  // 验证文件大小（限制为 5MB）
  if (file.raw.size > 5 * 1024 * 1024) {
    error.value = '图片大小不能超过 5MB'
    handleClear()
    return
  }
  
  error.value = ''
  
  // 创建预览 URL
  imageUrl.value = URL.createObjectURL(file.raw)
  
  // 获取图片信息
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      imageInfo.value = {
        name: file.raw.name,
        size: formatFileSize(file.raw.size),
        dimensions: `${img.width} × ${img.height}`
      }
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file.raw)
  
  // 自动转换为Base64
  handleEncode()
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

// 生成 Base64
const handleEncode = () => {
  if (!imageFile.value) {
    error.value = '请先选择图片'
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    base64Result.value = e.target?.result as string
  }
  reader.onerror = () => {
    error.value = '图片编码失败，请重试'
  }
  reader.readAsDataURL(imageFile.value)
}

// 清空
const handleClear = () => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
  }
  imageUrl.value = ''
  imageFile.value = null
  imageInfo.value = null
  base64Result.value = ''
  error.value = ''
}

// 复制结果到剪贴板
const handleCopy = async (text: string) => {
  if (!text) return
  
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
  } catch (e) {
    ElMessage.error('复制失败，请手动复制')
  }
}

// Base64解码相关函数
const handleDecode = () => {
  if (!decodeInput.value) {
    error.value = '请输入Base64字符串'
    return
  }
  
  error.value = ''
  try {
    // 处理输入的Base64字符串
    let base64String = decodeInput.value.trim()
    
    // 如果不是以data:开头，尝试添加合适的前缀
    if (!base64String.startsWith('data:')) {
      // 尝试检测图片类型，默认为image/png
      base64String = `data:image/png;base64,${base64String}`
    }
    
    // 创建图片URL
    decodedImageUrl.value = base64String
  } catch (e) {
    error.value = 'Base64解码失败，请检查输入是否正确'
    decodedImageUrl.value = ''
  }
}

const clearDecodeInput = () => {
  decodeInput.value = ''
  decodedImageUrl.value = ''
  error.value = ''
}

const handleDownloadImage = () => {
  if (!decodedImageUrl.value) return
  
  const link = document.createElement('a')
  link.href = decodedImageUrl.value
  link.download = `decoded-image-${new Date().getTime()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.tool-container {
  max-width: 800px;
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

.image-uploader {
  width: 100%;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 200px;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #409EFF;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  color: #606266;
}

.preview-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

.image-info {
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.result-tabs {
  margin-top: 20px;
}

.copy-button {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

.main-tabs {
  margin-bottom: 20px;
}

.decoded-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.decoded-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
  margin-bottom: 10px;
}

.image-actions {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }
}
</style>