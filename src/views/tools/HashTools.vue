<template>
  <div class="hash-tools-container">
    <el-card class="hash-card">
      <template #header>
        <div class="card-header">
          <h2>MD5/SHA加密工具</h2>
        </div>
      </template>
      
      <el-form>
        <el-form-item label="输入文本">
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="5"
            placeholder="请输入需要加密的文本"
          />
        </el-form-item>
        
        <el-form-item>
          <el-radio-group v-model="hashType">
            <el-radio label="md5">MD5</el-radio>
            <el-radio label="sha1">SHA-1</el-radio>
            <el-radio label="sha256">SHA-256</el-radio>
            <el-radio label="sha512">SHA-512</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="generateHash" :disabled="!inputText">
            生成哈希值
          </el-button>
          <el-button @click="clearAll">清空</el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="hashResult" class="result-container">
        <el-divider>哈希结果</el-divider>
        <div class="result-box">
          <p>{{ hashResult }}</p>
          <el-button size="small" type="primary" @click="copyResult">
            复制结果
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import CryptoJS from 'crypto-js'

const inputText = ref('')
const hashType = ref('md5')
const hashResult = ref('')

const generateHash = () => {
  if (!inputText.value) {
    ElMessage.warning('请输入需要加密的文本')
    return
  }
  
  switch (hashType.value) {
    case 'md5':
      hashResult.value = CryptoJS.MD5(inputText.value).toString()
      break
    case 'sha1':
      hashResult.value = CryptoJS.SHA1(inputText.value).toString()
      break
    case 'sha256':
      hashResult.value = CryptoJS.SHA256(inputText.value).toString()
      break
    case 'sha512':
      hashResult.value = CryptoJS.SHA512(inputText.value).toString()
      break
    default:
      hashResult.value = CryptoJS.MD5(inputText.value).toString()
  }
}

const clearAll = () => {
  inputText.value = ''
  hashResult.value = ''
}

const copyResult = () => {
  if (hashResult.value) {
    navigator.clipboard.writeText(hashResult.value)
      .then(() => {
        ElMessage.success('已复制到剪贴板')
      })
      .catch(() => {
        ElMessage.error('复制失败')
      })
  }
}
</script>

<style scoped>
.hash-tools-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-container {
  margin-top: 20px;
}

.result-box {
  background-color: var(--el-fill-color-light);
  padding: 15px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  word-break: break-all;
}

.result-box p {
  margin: 0;
  flex: 1;
  font-family: monospace;
}
</style>