<script setup lang="ts">
import { ref, reactive } from 'vue'

const regexInput = ref('')
const testString = ref('')
const flags = reactive({
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false,
  unicode: false,
  sticky: false
})

interface MatchResult {
  fullMatch: string;
  groups: string[];
  index?: number;
}

const matches = ref<MatchResult[]>([])
const hasError = ref(false)
const errorMessage = ref('')

const testRegex = () => {
  matches.value = []
  hasError.value = false
  errorMessage.value = ''
  
  if (!regexInput.value) {
    return
  }
  
  try {
    // 构建正则表达式标志
    let flagsStr = ''
    if (flags.global) flagsStr += 'g'
    if (flags.ignoreCase) flagsStr += 'i'
    if (flags.multiline) flagsStr += 'm'
    if (flags.dotAll) flagsStr += 's'
    if (flags.unicode) flagsStr += 'u'
    if (flags.sticky) flagsStr += 'y'
    
    // 创建正则表达式
    const regex = new RegExp(regexInput.value, flagsStr)
    
    // 执行匹配
    if (flags.global) {
      const allMatches = [...testString.value.matchAll(regex)]
      matches.value = allMatches.map(match => {
        return {
          fullMatch: match[0],
          groups: match.slice(1),
          index: match.index
        }
      })
    } else {
      const match = testString.value.match(regex)
      if (match) {
        matches.value = [{
          fullMatch: match[0],
          groups: match.slice(1),
          index: match.index
        }]
      }
    }
  } catch (error) {
    hasError.value = true
    errorMessage.value = (error as Error).message
  }
}

const clearAll = () => {
  regexInput.value = ''
  testString.value = ''
  matches.value = []
  hasError.value = false
  errorMessage.value = ''
}

const examples = [
  { name: '邮箱验证', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', sample: 'test@example.com' },
  { name: '手机号验证', pattern: '1[3-9]\d{9}', sample: '13812345678' },
  { name: '身份证号', pattern: '(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)', sample: '110101199001011234' },
  { name: 'URL验证', pattern: 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)', sample: 'https://example.com' },
  { name: 'IP地址', pattern: '((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)', sample: '192.168.1.1' }
]

const loadExample = (example: { pattern: string, sample: string }) => {
  regexInput.value = example.pattern
  testString.value = example.sample
  testRegex()
}
</script>

<template>
  <div class="regex-tester-container">
    <h1>正则表达式测试工具</h1>
    
    <el-card class="regex-card">
      <template #header>
        <div class="card-header">
          <span>正则表达式</span>
          <div>
            <el-button type="primary" @click="testRegex">测试</el-button>
            <el-button @click="clearAll">清空</el-button>
          </div>
        </div>
      </template>
      
      <div class="regex-input-container">
        <div class="regex-input-wrapper">
          <span class="regex-delimiter">/</span>
          <el-input 
            v-model="regexInput" 
            placeholder="输入正则表达式" 
            class="regex-input"
            @keyup.enter="testRegex"
          />
          <span class="regex-delimiter">/</span>
          <div class="regex-flags">
            <el-checkbox v-model="flags.global" label="g" border size="small" />
            <el-checkbox v-model="flags.ignoreCase" label="i" border size="small" />
            <el-checkbox v-model="flags.multiline" label="m" border size="small" />
            <el-checkbox v-model="flags.dotAll" label="s" border size="small" />
            <el-checkbox v-model="flags.unicode" label="u" border size="small" />
            <el-checkbox v-model="flags.sticky" label="y" border size="small" />
          </div>
        </div>
      </div>
      
      <div class="flag-descriptions">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="g">全局匹配</el-descriptions-item>
          <el-descriptions-item label="i">忽略大小写</el-descriptions-item>
          <el-descriptions-item label="m">多行匹配</el-descriptions-item>
          <el-descriptions-item label="s">点号匹配所有字符</el-descriptions-item>
          <el-descriptions-item label="u">Unicode模式</el-descriptions-item>
          <el-descriptions-item label="y">粘性匹配</el-descriptions-item>
        </el-descriptions>
      </div>
      
      <div class="test-string-container">
        <h3>测试文本</h3>
        <el-input 
          v-model="testString" 
          type="textarea" 
          :rows="5" 
          placeholder="输入要测试的文本"
          @keyup.ctrl.enter="testRegex"
        />
      </div>
      
      <div class="examples-container">
        <h3>常用示例</h3>
        <div class="examples-list">
          <el-button 
            v-for="example in examples" 
            :key="example.name"
            @click="loadExample(example)"
            size="small"
            type="info"
            plain
          >
            {{ example.name }}
          </el-button>
        </div>
      </div>
      
      <div v-if="hasError" class="error-container">
        <el-alert
          :title="errorMessage"
          type="error"
          show-icon
        />
      </div>
      
      <div v-else-if="matches.length > 0" class="results-container">
        <h3>匹配结果 ({{ matches.length }})</h3>
        <el-table :data="matches" style="width: 100%">
          <el-table-column prop="index" label="位置" width="80" />
          <el-table-column prop="fullMatch" label="匹配内容" />
          <el-table-column label="捕获组">
            <template #default="{ row }">
              <div v-if="row.groups && row.groups.length > 0">
                <div v-for="(group, index) in row.groups" :key="index">
                  组 {{ index + 1 }}: {{ group }}
                </div>
              </div>
              <span v-else>无捕获组</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <div v-else-if="regexInput && testString" class="no-matches">
        <el-empty description="没有找到匹配项" />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.regex-tester-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.regex-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.regex-input-container {
  margin-bottom: 20px;
}

.regex-input-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.regex-delimiter {
  font-size: 24px;
  margin: 0 5px;
  color: var(--el-text-color-primary);
}

.regex-input {
  flex: 1;
}

.regex-flags {
  display: flex;
  gap: 5px;
  margin-left: 10px;
}

.flag-descriptions {
  margin-bottom: 20px;
}

.test-string-container {
  margin-bottom: 20px;
}

.examples-container {
  margin-bottom: 20px;
}

.examples-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.error-container {
  margin-top: 20px;
}

.results-container {
  margin-top: 20px;
}

.no-matches {
  margin-top: 20px;
  text-align: center;
}

/* 暗黑模式适配 */
:deep(.dark) .regex-delimiter {
  color: var(--el-text-color-primary);
}
</style>