<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'

const qrContent = ref('')
const qrSize = ref(200)
const qrColor = ref('#000000')
const qrBgColor = ref('#FFFFFF')
const qrErrorLevel = ref('M')
const qrMargin = ref(4)
const qrImageUrl = ref('')
const qrCanvas = ref<HTMLCanvasElement | null>(null)

// 生成二维码的函数
const generateQrCode = async () => {
  if (!qrContent.value || !qrCanvas.value) return
  
  try {
    const options = {
      width: qrSize.value,
      margin: qrMargin.value,
      color: {
        dark: qrColor.value,
        light: qrBgColor.value
      },
      errorCorrectionLevel: qrErrorLevel.value as 'L' | 'M' | 'Q' | 'H'
    }
    
    // 使用qrcode.js库生成二维码
    await QRCode.toCanvas(qrCanvas.value, qrContent.value, options)
    
    // 将canvas转换为图片URL
    qrImageUrl.value = qrCanvas.value.toDataURL('image/png')
  } catch (error) {
    console.error('生成二维码出错:', error)
  }
}

// 当内容变化时自动生成二维码
watch([qrContent, qrSize, qrColor, qrBgColor, qrErrorLevel, qrMargin], () => {
  if (qrContent.value) {
    generateQrCode()
  }
})

// 组件挂载后初始化
onMounted(() => {
  if (qrContent.value) {
    generateQrCode()
  }
})

// 下载二维码图片
const downloadQrCode = () => {
  if (!qrImageUrl.value) return
  
  const link = document.createElement('a')
  link.href = qrImageUrl.value
  link.download = 'qrcode.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 清空内容
const clearContent = () => {
  qrContent.value = ''
  qrImageUrl.value = ''
}

// 预设内容类型
const contentTypes = [
  { label: '文本', value: 'text', placeholder: '输入文本内容' },
  { label: '网址', value: 'url', placeholder: '输入网址，例如：https://example.com' },
  { label: '电话', value: 'tel', placeholder: '输入电话号码，例如：13812345678' },
  { label: '短信', value: 'sms', placeholder: '输入手机号码' },
  { label: '邮箱', value: 'email', placeholder: '输入邮箱地址' },
  { label: 'Wi-Fi', value: 'wifi', placeholder: '输入Wi-Fi名称' }
]

const selectedType = ref('text')
const smsContent = ref('')
const wifiPassword = ref('')
const wifiType = ref('WPA')
const wifiHidden = ref(false)
const emailSubject = ref('')

// 根据不同类型生成内容
const generateContent = () => {
  switch (selectedType.value) {
    case 'url':
      if (!qrContent.value.startsWith('http')) {
        qrContent.value = 'https://' + qrContent.value
      }
      break
    case 'tel':
      qrContent.value = 'tel:' + qrContent.value
      break
    case 'sms':
      qrContent.value = 'smsto:' + qrContent.value
      if (smsContent.value) {
        qrContent.value += ':' + smsContent.value
      }
      break
    case 'email':
      qrContent.value = 'mailto:' + qrContent.value
      if (emailSubject.value) {
        qrContent.value += '?subject=' + encodeURIComponent(emailSubject.value)
      }
      break
    case 'wifi':
      qrContent.value = `WIFI:T:${wifiType.value};S:${qrContent.value};P:${wifiPassword.value};H:${wifiHidden.value ? 'true' : 'false'};`
      break
  }
  generateQrCode()
}
</script>

<template>
  <div class="qr-generator-container">
    <h1>二维码生成器</h1>
    
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card class="qr-input-card">
          <template #header>
            <div class="card-header">
              <span>二维码内容</span>
              <div>
                <el-button type="primary" @click="generateContent">生成</el-button>
                <el-button @click="clearContent">清空</el-button>
              </div>
            </div>
          </template>
          
          <div class="content-type-selector">
            <el-radio-group v-model="selectedType">
              <el-radio-button 
                v-for="type in contentTypes" 
                :key="type.value" 
                :label="type.value"
              >
                {{ type.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
          
          <div class="content-input">
            <el-input 
              v-model="qrContent" 
              :placeholder="contentTypes.find(t => t.value === selectedType)?.placeholder || '输入内容'"
              @keyup.enter="generateContent"
            />
            
            <!-- 短信特有输入 -->
            <template v-if="selectedType === 'sms'">
              <div class="additional-input">
                <el-input 
                  v-model="smsContent" 
                  type="textarea" 
                  :rows="3" 
                  placeholder="输入短信内容（可选）"
                />
              </div>
            </template>
            
            <!-- 邮箱特有输入 -->
            <template v-if="selectedType === 'email'">
              <div class="additional-input">
                <el-input 
                  v-model="emailSubject" 
                  placeholder="输入邮件主题（可选）"
                />
              </div>
            </template>
            
            <!-- Wi-Fi特有输入 -->
            <template v-if="selectedType === 'wifi'">
              <div class="additional-input">
                <el-input 
                  v-model="wifiPassword" 
                  placeholder="输入Wi-Fi密码（可选）"
                  show-password
                />
                <div class="wifi-options">
                  <el-select v-model="wifiType">
                    <el-option label="WPA/WPA2" value="WPA" />
                    <el-option label="WEP" value="WEP" />
                    <el-option label="无密码" value="nopass" />
                  </el-select>
                  <el-checkbox v-model="wifiHidden">隐藏网络</el-checkbox>
                </div>
              </div>
            </template>
          </div>
          
          <div class="qr-options">
            <h3>二维码选项</h3>
            <el-form label-position="top">
              <el-form-item label="尺寸">
                <el-slider 
                  v-model="qrSize" 
                  :min="100" 
                  :max="500" 
                  :step="10"
                  show-input
                />
              </el-form-item>
              
              <el-form-item label="前景色">
                <el-color-picker v-model="qrColor" show-alpha />
              </el-form-item>
              
              <el-form-item label="背景色">
                <el-color-picker v-model="qrBgColor" show-alpha />
              </el-form-item>
              
              <el-form-item label="错误修正级别">
                <el-radio-group v-model="qrErrorLevel">
                  <el-radio-button label="L">低 (7%)</el-radio-button>
                  <el-radio-button label="M">中 (15%)</el-radio-button>
                  <el-radio-button label="Q">高 (25%)</el-radio-button>
                  <el-radio-button label="H">最高 (30%)</el-radio-button>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="边距">
                <el-slider 
                  v-model="qrMargin" 
                  :min="0" 
                  :max="10" 
                  :step="1"
                  show-input
                />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="10">
        <el-card class="qr-preview-card">
          <template #header>
            <div class="card-header">
              <span>二维码预览</span>
              <el-button type="success" @click="downloadQrCode" :disabled="!qrImageUrl">下载</el-button>
            </div>
          </template>
          
          <div class="qr-preview">
            <canvas ref="qrCanvas" v-show="qrImageUrl"></canvas>
            <img v-if="qrImageUrl" :src="qrImageUrl" alt="二维码" style="display: none;" />
            <el-empty v-else description="请输入内容生成二维码" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.qr-generator-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-type-selector {
  margin-bottom: 20px;
}

.content-input {
  margin-bottom: 20px;
}

.additional-input {
  margin-top: 10px;
}

.wifi-options {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
}

.qr-options {
  margin-top: 20px;
}

.qr-preview-card {
  height: 100%;
}

.qr-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.qr-preview img {
  max-width: 100%;
  border: 1px solid #eee;
}

/* 暗黑模式适配 */
:deep(.dark) .qr-preview img {
  border-color: #333;
}
</style>