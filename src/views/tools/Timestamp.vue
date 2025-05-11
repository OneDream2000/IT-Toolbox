 <template>
  <div class="tool-container">
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h2>时间戳转换工具</h2>
        </div>
      </template>
      
      <el-form>
        <el-form-item>
          <el-radio-group v-model="mode" size="large">
            <el-radio-button label="dateToTimestamp">日期转时间戳</el-radio-button>
            <el-radio-button label="timestampToDate">时间戳转日期</el-radio-button>
          </el-radio-group>
        </el-form-item>
        
        <!-- 日期转时间戳 -->
        <template v-if="mode === 'dateToTimestamp'">
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
        </template>
        
        <!-- 时间戳转日期 -->
        <template v-else>
          <el-form-item>
            <el-input 
              v-model="timestampInput" 
              placeholder="请输入时间戳" 
              @input="convertTimestampToDate"
            >
              <template #append>
                <el-select v-model="timestampUnit" @change="convertTimestampToDate">
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
        </template>
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
          <h3>当前时间</h3>
        </div>
      </template>
      
      <div class="current-time">
        <p><strong>当前日期时间:</strong> {{ currentDateTime }}</p>
        <p><strong>当前秒级时间戳:</strong> {{ currentSecondTimestamp }} <el-button size="small" @click="copyToClipboard(currentSecondTimestamp.toString())">复制</el-button></p>
        <p><strong>当前毫秒级时间戳:</strong> {{ currentMillisecondTimestamp }} <el-button size="small" @click="copyToClipboard(currentMillisecondTimestamp.toString())">复制</el-button></p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

const mode = ref<'dateToTimestamp' | 'timestampToDate'>('dateToTimestamp')
const dateValue = ref('')
const secondTimestamp = ref('')
const millisecondTimestamp = ref('')
const timestampInput = ref('')
const timestampUnit = ref<'second' | 'millisecond'>('second')
const dateTimeResult = ref('')
const isoDateResult = ref('')
const error = ref('')

// 当前时间相关
const currentDateTime = ref('')
const currentSecondTimestamp = ref(0)
const currentMillisecondTimestamp = ref(0)
let timer: number | null = null

// 更新当前时间
const updateCurrentTime = () => {
  const now = new Date()
  currentDateTime.value = formatDate(now)
  currentSecondTimestamp.value = Math.floor(now.getTime() / 1000)
  currentMillisecondTimestamp.value = now.getTime()
}

// 格式化日期
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

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
    
    dateTimeResult.value = formatDate(date)
    isoDateResult.value = date.toISOString()
  } catch (e) {
    error.value = '时间戳转换失败，请检查输入是否为有效数字'
    dateTimeResult.value = ''
    isoDateResult.value = ''
  }
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
})

onUnmounted(() => {
  if (timer !== null) {
    clearInterval(timer)
  }
})
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