<template>
  <div class="tool-container">
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h2>JSON格式化工具</h2>
        </div>
      </template>
      
      <div class="operation-panel">
        <el-button-group>
          <el-button type="primary" @click="formatJson">格式化</el-button>
          <el-button @click="compactJson">压缩</el-button>
          <el-button @click="clearData">清空</el-button>
          <el-button @click="copyResult" :disabled="!outputText">复制结果</el-button>
        </el-button-group>
        
        <div class="indent-selector">
          <span>缩进：</span>
          <el-radio-group v-model="indentSize" size="small">
            <el-radio-button :label="2">2空格</el-radio-button>
            <el-radio-button :label="4">4空格</el-radio-button>
            <el-radio-button :label="-1">Tab</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      
      <div class="input-output-container">
        <div class="input-area">
          <h3>输入JSON</h3>
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="12"
            placeholder="请输入JSON字符串"
          />
        </div>
        
        <div class="output-area">
          <h3>格式化结果</h3>
          <el-input
            v-model="outputText"
            type="textarea"
            :rows="12"
            readonly
            placeholder="结果将显示在这里"
          />
        </div>
      </div>
      
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
        style="margin-top: 15px"
      />
      
      <div class="tips-section">
        <h3>使用说明</h3>
        <ul>
          <li><strong>格式化：</strong>将JSON字符串格式化为易读的格式</li>
          <li><strong>压缩：</strong>将JSON字符串压缩为单行格式</li>
          <li><strong>缩进：</strong>选择格式化后的缩进空格数</li>
          <li>支持复杂的JSON对象和数组</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const inputText = ref('')
const outputText = ref('')
const error = ref('')
const indentSize = ref(2)

// 格式化JSON
const formatJson = () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请先输入JSON字符串')
    return
  }
  
  try {
    // 解析JSON字符串为对象
    const jsonObj = JSON.parse(inputText.value)
    // 根据选择的缩进重新格式化
    const indent = indentSize.value === -1 ? '\t' : ' '.repeat(indentSize.value)
    outputText.value = JSON.stringify(jsonObj, null, indent)
    error.value = ''
  } catch (err: any) {
    error.value = `JSON解析错误: ${err.message}`
    outputText.value = ''
  }
}

// 压缩JSON
const compactJson = () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请先输入JSON字符串')
    return
  }
  
  try {
    // 解析JSON字符串为对象，然后压缩输出（无缩进）
    const jsonObj = JSON.parse(inputText.value)
    outputText.value = JSON.stringify(jsonObj)
    error.value = ''
  } catch (err: any) {
    error.value = `JSON解析错误: ${err.message}`
    outputText.value = ''
  }
}

// 清空输入和结果
const clearData = () => {
  inputText.value = ''
  outputText.value = ''
  error.value = ''
}

// 复制结果到剪贴板
const copyResult = () => {
  navigator.clipboard.writeText(outputText.value)
    .then(() => {
      ElMessage.success('已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
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

.operation-panel {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.indent-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-output-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.input-area h3,
.output-area h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1rem;
  color: var(--el-text-color-primary);
}

.tips-section {
  background-color: var(--el-fill-color-light);
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
}

.tips-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.tips-section ul {
  margin: 0;
  padding-left: 20px;
}

.tips-section li {
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .input-output-container {
    grid-template-columns: 1fr;
  }
  
  .operation-panel {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .indent-selector {
    margin-top: 10px;
  }
}
</style>