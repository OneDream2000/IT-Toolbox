<template>
  <div class="tool-container">
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h2>英文字母大小写转换工具</h2>
        </div>
      </template>
      
      <el-form>
        <el-form-item>
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="6"
            placeholder="请输入需要转换的英文文本"
            @input="handleProcess"
          />
        </el-form-item>
        
        <el-form-item>
          <el-radio-group v-model="convertType" size="large">
            <el-radio-button label="upper">全部大写</el-radio-button>
            <el-radio-button label="lower">全部小写</el-radio-button>
            <el-radio-button label="capitalize">首字母大写</el-radio-button>
            <el-radio-button label="title">单词首字母大写</el-radio-button>
            <el-radio-button label="titleCase">标题格式大写</el-radio-button>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <div class="form-btn">
            <el-button class="btn btn-success" @click="letterConvert('blank2unline')">空格→下划线</el-button>
            <el-button class="btn btn-success" @click="letterConvert('blank2camel')">下划线&空格→驼峰</el-button>
            <el-button class="btn btn-success" @click="letterConvert('camel2unline')">驼峰→下划线</el-button>
            <el-button class="btn btn-success" @click="letterConvert('camel2blank')">驼峰→空格</el-button>
            <el-button class="btn btn-success" @click="letterConvert('blank2midline')">空格→中横线</el-button>
            <el-button class="btn btn-success" @click="letterConvert('unline2midline')">下划线→中横线</el-button>
            <el-button class="btn btn-success" @click="letterConvert('midline2unline')">中横线→下划线</el-button>
            <el-button class="btn btn-success" @click="letterConvert('unline2blank')">下划线→空格</el-button>
            <el-button class="btn btn-success" @click="letterConvert('unline2dot')">下划线→小数点</el-button>
            <el-button class="btn btn-success" @click="letterConvert('dot2unline')">小数点→下划线</el-button>
            <el-button class="btn btn-success" @click="letterConvert('blank2br')">空格→换行</el-button>
            <el-button class="btn btn-success" @click="letterConvert('br2blank')">换行→空格</el-button>
            <el-button class="btn btn-success" @click="letterConvert('del_punctuation')">清除符号</el-button>
            <el-button class="btn btn-success" @click="letterConvert('del_blank')">清除空格</el-button>
            <el-button class="btn btn-success" @click="letterConvert('del_linebreak')">清除换行</el-button>
          </div>
        </el-form-item>
        
        <el-form-item>
          <div class="button-group">
            <el-button type="primary" @click="handleProcess" :disabled="!inputText">转换</el-button>
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
    </el-card>
    
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h3>大小写转换说明</h3>
        </div>
      </template>
      
      <div class="info-content">
        <h4>大小写转换</h4>
        <p><strong>全部大写：</strong>将所有字母转换为大写形式。</p>
        <p><strong>全部小写：</strong>将所有字母转换为小写形式。</p>
        <p><strong>首字母大写：</strong>仅将文本的第一个字母转换为大写，其余字母转换为小写。</p>
        <p><strong>单词首字母大写：</strong>将每个单词的首字母转换为大写，其余字母转换为小写。</p>
        <p><strong>标题格式大写：</strong>遵循标题大写规则，主要单词首字母大写，次要单词（如a, an, the, and等）保持小写，除非它们是标题的第一个或最后一个单词。</p>
        
        <h4>格式转换</h4>
        <p><strong>空格→下划线：</strong>将文本中的空格替换为下划线。</p>
        <p><strong>下划线&空格→驼峰：</strong>将下划线或空格分隔的文本转换为驼峰命名格式。</p>
        <p><strong>驼峰→下划线：</strong>将驼峰命名格式转换为下划线分隔的格式。</p>
        <p><strong>驼峰→空格：</strong>将驼峰命名格式转换为空格分隔的格式。</p>
        <p><strong>空格→中横线：</strong>将文本中的空格替换为中横线。</p>
        <p><strong>下划线→中横线：</strong>将文本中的下划线替换为中横线。</p>
        <p><strong>中横线→下划线：</strong>将文本中的中横线替换为下划线。</p>
        <p><strong>下划线→空格：</strong>将文本中的下划线替换为空格。</p>
        <p><strong>下划线→小数点：</strong>将文本中的下划线替换为小数点。</p>
        <p><strong>小数点→下划线：</strong>将文本中的小数点替换为下划线。</p>
        <p><strong>空格→换行：</strong>将文本中的空格替换为换行符。</p>
        <p><strong>换行→空格：</strong>将文本中的换行符替换为空格。</p>
        
        <h4>清除功能</h4>
        <p><strong>清除符号：</strong>删除文本中的所有标点符号，只保留字母、数字、空格和中文字符。</p>
        <p><strong>清除空格：</strong>删除文本中的所有空格。</p>
        <p><strong>清除换行：</strong>删除文本中的所有换行符。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const inputText = ref('')
const outputText = ref('')
const convertType = ref('upper')

// 文本格式转换函数
const letterConvert = (type: string) => {
  if (!inputText.value) {
    ElMessage.warning('请先输入需要转换的文本')
    return
  }
  
  let result = ''
  
  switch (type) {
    case 'blank2unline': // 空格→下划线
      result = inputText.value.replace(/\s+/g, '_')
      break
    case 'blank2camel': // 下划线&空格→驼峰
      result = inputText.value.replace(/[_\s]+(\w)/g, (_, letter) => letter.toUpperCase())
      break
    case 'camel2unline': // 驼峰→下划线
      result = inputText.value.replace(/([A-Z])/g, '_$1').toLowerCase()
      break
    case 'camel2blank': // 驼峰→空格
      result = inputText.value.replace(/([A-Z])/g, ' $1').trim()
      break
    case 'blank2midline': // 空格→中横线
      result = inputText.value.replace(/\s+/g, '-')
      break
    case 'unline2midline': // 下划线→中横线
      result = inputText.value.replace(/_+/g, '-')
      break
    case 'midline2unline': // 中横线→下划线
      result = inputText.value.replace(/-+/g, '_')
      break
    case 'unline2blank': // 下划线→空格
      result = inputText.value.replace(/_+/g, ' ')
      break
    case 'unline2dot': // 下划线→小数点
      result = inputText.value.replace(/_+/g, '.')
      break
    case 'dot2unline': // 小数点→下划线
      result = inputText.value.replace(/\.+/g, '_')
      break
    case 'blank2br': // 空格→换行
      result = inputText.value.replace(/\s+/g, '\n')
      break
    case 'br2blank': // 换行→空格
      result = inputText.value.replace(/\n+/g, ' ')
      break
    case 'del_punctuation': // 清除符号
      result = inputText.value.replace(/[^\w\s\u4e00-\u9fa5]/g, '')
      break
    case 'del_blank': // 清除空格
      result = inputText.value.replace(/\s+/g, '')
      break
    case 'del_linebreak': // 清除换行
      result = inputText.value.replace(/\n+/g, '')
      break
    default:
      result = inputText.value
  }
  
  outputText.value = result
}

// 次要单词列表（不大写的单词，除非是第一个或最后一个单词）
const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in', 'of', 'up', 'as', 'so', 'yet', 'off', 'if', 'per', 'via', 'out']

// 监听转换类型变化，自动更新结果
watch(convertType, () => {
  if (inputText.value) {
    handleProcess()
  }
})

// 处理转换
const handleProcess = () => {
  if (!inputText.value) {
    outputText.value = ''
    return
  }
  
  switch (convertType.value) {
    case 'upper':
      outputText.value = inputText.value.toUpperCase()
      break
    case 'lower':
      outputText.value = inputText.value.toLowerCase()
      break
    case 'capitalize':
      outputText.value = capitalizeFirstLetter(inputText.value)
      break
    case 'title':
      outputText.value = toTitleCase(inputText.value)
      break
    case 'titleCase':
      outputText.value = toHeadlineCase(inputText.value)
      break
    default:
      outputText.value = inputText.value
  }
}

// 首字母大写，其余小写
const capitalizeFirstLetter = (text: string): string => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// 每个单词首字母大写
const toTitleCase = (text: string): string => {
  if (!text) return ''
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

// 标题格式大写（APA Style）
const toHeadlineCase = (text: string): string => {
  if (!text) return ''
  
  const words = text.toLowerCase().split(/\s+/)
  const result = words.map((word, index) => {
    // 如果是第一个或最后一个单词，或者不是次要单词，则首字母大写
    if (index === 0 || index === words.length - 1 || !minorWords.includes(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }
    return word
  })
  
  return result.join(' ')
}

// 清空输入和输出
const handleClear = () => {
  inputText.value = ''
  outputText.value = ''
}

// 复制结果
const handleCopy = () => {
  if (outputText.value) {
    navigator.clipboard.writeText(outputText.value)
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
.tool-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
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

.form-btn {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.form-btn .el-button {
  margin: 0;
  font-size: 13px;
}

.info-content {
  line-height: 1.8;
}
</style>