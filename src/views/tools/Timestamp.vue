<template>
  <div class="tool-container">
    <!-- 当前时间模块 - 移至顶部 -->
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h3>当前时间</h3>
        </div>
      </template>
      
      <div class="current-time">
        <p>
          <strong>当前日期时间:</strong> {{ currentDateTime }} 
          <el-button size="small" @click="copyToClipboard(currentDateTime)">复制</el-button>
        </p>
        <p>
          <strong>当前秒级时间戳:</strong> {{ currentSecondTimestamp }} 
          <el-button size="small" @click="copyToClipboard(currentSecondTimestamp.toString())">复制</el-button>
        </p>
        <p>
          <strong>当前毫秒级时间戳:</strong> {{ currentMillisecondTimestamp }} 
          <el-button size="small" @click="copyToClipboard(currentMillisecondTimestamp.toString())">复制</el-button>
        </p>
      </div>
    </el-card>
    
    <!-- 时间戳转换工具 -->
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h2>时间戳转换工具</h2>
        </div>
      </template>
      
      <el-form>
        <!-- 时区选择 -->
        <el-form-item label="时区选择">
          <el-select v-model="selectedTimezone" @change="handleTimezoneChange">
            <el-option 
              v-for="tz in timezones" 
              :key="tz.value" 
              :label="tz.label" 
              :value="tz.value" 
            />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <!-- 日期转时间戳 -->
          <el-col :xs="24" :sm="12">
            <el-card shadow="never" class="inner-card">
              <template #header>
                <div class="inner-card-header">日期转时间戳</div>
              </template>
              <el-form-item>
                <el-date-picker
                  v-model="dateValue"
                  type="datetime"
                  placeholder="选择日期和时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  @change="convertDateToTimestamp"
                />
              </el-form-item>
              
              <el-divider content-position="center">转换结果</el-divider>
              
              <el-form-item label="秒级时间戳 (s)">
                <div class="result-row">
                  <el-input v-model="secondTimestamp" readonly />
                  <el-button type="primary" @click="copyToClipboard(secondTimestamp)" :disabled="!secondTimestamp">复制</el-button>
                </div>
              </el-form-item>
              
              <el-form-item label="毫秒级时间戳 (ms)">
                <div class="result-row">
                  <el-input v-model="millisecondTimestamp" readonly />
                  <el-button type="primary" @click="copyToClipboard(millisecondTimestamp)" :disabled="!millisecondTimestamp">复制</el-button>
                </div>
              </el-form-item>
            </el-card>
          </el-col>
          
          <!-- 时间戳转日期 -->
          <el-col :xs="24" :sm="12">
            <el-card shadow="never" class="inner-card">
              <template #header>
                <div class="inner-card-header">时间戳转日期</div>
              </template>
              <el-form-item>
                <el-input 
                  v-model="timestampInput" 
                  placeholder="请输入时间戳" 
                  @input="convertTimestampToDate"
                >
                  <template #append>
                    <el-select v-model="timestampUnit" style="width: 110px" @change="convertTimestampToDate">
                      <el-option label="秒 (s)" value="second" />
                      <el-option label="毫秒 (ms)" value="millisecond" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              
              <el-divider content-position="center">转换结果</el-divider>
              
              <el-form-item label="日期时间">
                <div class="result-row">
                  <el-input v-model="dateTimeResult" readonly />
                  <el-button type="primary" @click="copyToClipboard(dateTimeResult)" :disabled="!dateTimeResult">复制</el-button>
                </div>
              </el-form-item>
              
              <el-form-item label="ISO 8601 格式">
                <div class="result-row">
                  <el-input v-model="isoDateResult" readonly />
                  <el-button type="primary" @click="copyToClipboard(isoDateResult)" :disabled="!isoDateResult">复制</el-button>
                </div>
              </el-form-item>
            </el-card>
          </el-col>
        </el-row>
        
        <el-alert
          v-if="error"
          :title="error"
          type="error"
          show-icon
          style="margin-top: 15px;"
        />
      </el-form>
    </el-card>
    
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h2>JSON格式化与时间戳转换</h2>
        </div>
      </template>
      
      <el-form>
        <el-row :gutter="20">
          <!-- 输入区域 -->
          <el-col :xs="24" :sm="12">
            <el-form-item>
              <el-input
                v-model="jsonInput"
                type="textarea"
                :rows="12"
                placeholder="请输入JSON字符串"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="formatJson">格式化并转换时间戳</el-button>
              <el-button @click="clearJson">清空</el-button>
            </el-form-item>
          </el-col>
          
          <!-- 输出区域 -->
          <el-col :xs="24" :sm="12">
            <el-form-item>
              <el-input
                v-model="formattedJson"
                type="textarea"
                :rows="12"
                readonly
                placeholder="格式化结果将显示在这里"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="copyToClipboard(formattedJson)" :disabled="!formattedJson">复制结果</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-alert
          v-if="jsonError"
          :title="jsonError"
          type="error"
          show-icon
          style="margin-top: 15px;"
        />
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

// 基本格式化日期
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 时区列表
const timezones = [
  { label: 'UTC (协调世界时)', value: 'UTC' },
  { label: 'Asia/Shanghai (北京时间)', value: 'Asia/Shanghai' },
  { label: 'America/New_York (纽约)', value: 'America/New_York' },
  { label: 'Europe/London (伦敦)', value: 'Europe/London' },
  { label: 'Asia/Tokyo (东京)', value: 'Asia/Tokyo' },
  { label: 'Australia/Sydney (悉尼)', value: 'Australia/Sydney' },
  { label: 'Europe/Paris (巴黎)', value: 'Europe/Paris' },
]

const selectedTimezone = ref('Asia/Shanghai')
const dateValue = ref(formatDate(new Date())) // 默认为当前时间
const secondTimestamp = ref('')
const millisecondTimestamp = ref('')
const timestampInput = ref(Date.now().toString()) // 默认为当前时间戳
const timestampUnit = ref<'second' | 'millisecond'>('millisecond') // 默认为毫秒
const dateTimeResult = ref('')
const isoDateResult = ref('')
const error = ref('')

// JSON格式化相关
const jsonInput = ref('')
const formattedJson = ref('')
const jsonError = ref('')

// 当前时间相关
const currentDateTime = ref('')
const currentSecondTimestamp = ref(0)
const currentMillisecondTimestamp = ref(0)
let timer: number | null = null

// 处理时区变更
const handleTimezoneChange = () => {
  updateCurrentTime()
  if (dateValue.value) convertDateToTimestamp()
  if (timestampInput.value) convertTimestampToDate()
}

// 更新当前时间
const updateCurrentTime = () => {
  const now = new Date()
  currentDateTime.value = formatDateWithTimezone(now, selectedTimezone.value)
  currentSecondTimestamp.value = Math.floor(now.getTime() / 1000)
  currentMillisecondTimestamp.value = now.getTime()
}

// 格式化日期（带时区）
const formatDateWithTimezone = (date: Date, timezone: string): string => {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date).replace(/\//g, '-')
  } catch (e) {
    return formatDate(date) // 回退到基本格式化
  }
}

// 格式化日期函数已移至文件顶部

// 日期转时间戳
const convertDateToTimestamp = () => {
  error.value = ''
  if (!dateValue.value) {
    secondTimestamp.value = ''
    millisecondTimestamp.value = ''
    return
  }
  
  try {
    const date = new Date(dateValue.value)
    secondTimestamp.value = Math.floor(date.getTime() / 1000).toString()
    millisecondTimestamp.value = date.getTime().toString()
  } catch (e) {
    error.value = '日期转换失败，请检查输入格式'
    secondTimestamp.value = ''
    millisecondTimestamp.value = ''
  }
}

// 时间戳转日期
const convertTimestampToDate = () => {
  error.value = ''
  if (!timestampInput.value) {
    dateTimeResult.value = ''
    isoDateResult.value = ''
    return
  }
  
  try {
    const timestamp = parseInt(timestampInput.value)
    if (isNaN(timestamp)) {
      throw new Error('无效的时间戳')
    }
    
    // 根据单位转换为毫秒
    const milliseconds = timestampUnit.value === 'second' ? timestamp * 1000 : timestamp
    const date = new Date(milliseconds)
    
    if (date.toString() === 'Invalid Date') {
      throw new Error('无效的时间戳')
    }
    
    dateTimeResult.value = formatDateWithTimezone(date, selectedTimezone.value)
    isoDateResult.value = date.toISOString()
  } catch (e) {
    error.value = '时间戳转换失败，请检查输入是否为有效数字'
    dateTimeResult.value = ''
    isoDateResult.value = ''
  }
}

// 格式化JSON并转换时间戳
const formatJson = () => {
  jsonError.value = ''
  if (!jsonInput.value) {
    formattedJson.value = ''
    return
  }
  
  try {
    // 解析JSON
    const parsedJson = JSON.parse(jsonInput.value)
    
    // 处理JSON中的时间戳
    const processedJson = processJsonTimestamps(parsedJson)
    
    // 格式化输出
    formattedJson.value = JSON.stringify(processedJson, null, 2)
  } catch (e) {
    jsonError.value = 'JSON解析失败，请检查输入格式'
    formattedJson.value = ''
  }
}

// 递归处理JSON中的时间戳
const processJsonTimestamps = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => processJsonTimestamps(item))
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, any> = {}
    for (const key in obj) {
      // 处理可能的时间戳字段
      if (isTimestampField(key, obj[key])) {
        const timestamp = Number(obj[key])
        const date = new Date(timestamp * (isLikelySeconds(timestamp) ? 1000 : 1))
        result[key] = obj[key]
        result[`${key}_formatted`] = formatDateWithTimezone(date, selectedTimezone.value)
      } else {
        result[key] = processJsonTimestamps(obj[key])
      }
    }
    return result
  }
  
  return obj
}

// 判断是否可能是时间戳字段
const isTimestampField = (key: string, value: any): boolean => {
  // 检查字段名是否包含时间戳相关关键词
  const timestampKeywords = ['time', 'timestamp', 'date', 'created', 'updated', 'at']
  const keyLower = key.toLowerCase()
  
  // 检查值是否为数字且在合理的时间戳范围内
  const isNumeric = typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))
  if (!isNumeric) return false
  
  const numValue = Number(value)
  const isReasonableTimestamp = (
    // 秒级时间戳 (2000-2100年范围)
    (numValue > 946684800 && numValue < 4102444800) || 
    // 毫秒级时间戳
    (numValue > 946684800000 && numValue < 4102444800000)
  )
  
  // 如果字段名包含时间戳关键词且值在合理范围内，或者值非常明显是时间戳
  return (timestampKeywords.some(keyword => keyLower.includes(keyword)) && isReasonableTimestamp) || 
         isVeryLikelyTimestamp(numValue)
}

// 判断是否非常可能是时间戳
const isVeryLikelyTimestamp = (value: number): boolean => {
  // 当前时间的秒级和毫秒级时间戳
  const nowSeconds = Math.floor(Date.now() / 1000)
  const nowMillis = Date.now()
  
  // 如果值接近当前时间（前后5年范围内）
  return (
    (Math.abs(value - nowSeconds) < 157680000) || // 5年的秒数
    (Math.abs(value - nowMillis) < 157680000000)   // 5年的毫秒数
  )
}

// 判断是否可能是秒级时间戳
const isLikelySeconds = (value: number): boolean => {
  // 如果数字长度在10位左右，可能是秒级时间戳
  return value < 10000000000
}

// 清空JSON输入和结果
const clearJson = () => {
  jsonInput.value = ''
  formattedJson.value = ''
  jsonError.value = ''
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  if (!text) return
  
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
  } catch (e) {
    ElMessage.error('复制失败，请手动复制')
  }
}

onMounted(() => {
  updateCurrentTime()
  // 每秒更新一次当前时间
  timer = window.setInterval(updateCurrentTime, 1000)
  
  // 初始化时自动执行转换
  convertDateToTimestamp()
  convertTimestampToDate()
})

onUnmounted(() => {
  if (timer !== null) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.tool-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.tool-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inner-card {
  margin-bottom: 15px;
  height: 100%;
}

.inner-card-header {
  font-weight: bold;
  font-size: 16px;
}

.result-row {
  display: flex;
  gap: 10px;
}

.current-time {
  line-height: 2;
}

@media (max-width: 768px) {
  .result-row {
    flex-direction: column;
  }
}
</style>