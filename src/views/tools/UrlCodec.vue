<template>
  <div class="tool-container">
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h2>URL 编码/解码工具</h2>
        </div>
      </template>
      
      <el-form>
        <el-form-item>
          <el-radio-group v-model="mode" size="large">
            <el-radio-button label="encode">编码</el-radio-button>
            <el-radio-button label="decode">解码</el-radio-button>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="6"
            :placeholder="mode === 'encode' ? '请输入要编码的URL或文本' : '请输入要解码的URL编码字符串'"
            @input="handleProcess"
          />
        </el-form-item>
        
        <el-form-item>
          <div class="button-group">
            <el-button type="primary" @click="handleProcess">{{ mode === 'encode' ? '编码' : '解码' }}</el-button>
            <el-button @click="handleClear">清空</el-button>
            <el-button type="success" @click="handleCopy" :disabled="!outputText">复制结果</el-button>
          </div>
        </el-form-item>
        
        <el-divider content-position="center">结果</el-divider>
        
        <el-form-item>
          <el-input
            v-model="outputText"
            type="textarea"
            :rows="6"
            placeholder="结果将显示在这里"
            readonly
          />
        </el-form-item>
      </el-form>
      
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
      />
    </el-card>
    
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h3>URL编码说明</h3>
        </div>
      </template>
      
      <div class="info-content">
        <p><strong>URL编码</strong>是一种将字符转换为可在URL中安全传输的格式的编码方法。</p>
        <p>在URL中，只允许使用ASCII字符集中的一部分字符。其他字符（如中文、特殊符号等）需要被编码。</p>
        <p>URL编码将字符转换为"%"后跟两位十六进制数字的格式。例如，空格被编码为"%20"。</p>
        <p>常见的需要编码的字符包括：空格、&、?、=、#、%、+等特殊字符，以及非ASCII字符（如中文、日文等）。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const mode = ref<'encode' | 'decode'>('encode')
const inputText = ref('')
const outputText = ref('')
const error = ref('')

// 监听模式变化，清空输入和输出
watch(mode, () => {
  error.value = ''
  if (inputText.value) {
    handleProcess()
  }
})

// 处理编码或解码
const handleProcess = () => {
  error.value = ''
  if (!inputText.value) {
    outputText.value = ''
    return
  }
  
  try {
    if (mode.value === 'encode') {
      // 编码
      outputText.value = encodeURIComponent(inputText.value)
    } else {
      // 解码
      outputText.value = decodeURIComponent(inputText.value)
    }
  } catch (e) {
    error.value = mode.value === 'encode' 
      ? '编码失败，请检查输入内容' 
      : '解码失败，请确保输入的是有效的URL编码字符串'
    outputText.value = ''
  }
}

// 清空输入和输出
const handleClear = () => {
  inputText.value = ''
  outputText.value = ''
  error.value = ''
}

// 复制结果到剪贴板
const handleCopy = async () => {
  if (!outputText.value) return
  
  try {
    await navigator.clipboard.writeText(outputText.value)
    ElMessage.success('复制成功')
  } catch (e) {
    ElMessage.error('复制失败，请手动复制')
  }
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

.button-group {
  display: flex;
  gap: 10px;
}

.info-content {
  line-height: 1.6;
}

.info-content p {
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }
  
  .tool-container {
    padding: 0 10px;
  }
}
</style>