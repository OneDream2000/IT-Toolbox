import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/base64',
    name: 'base64',
    component: () => import('../views/tools/Base64.vue'),
    meta: {
      title: 'Base64编码/解码'
    }
  },
  {
    path: '/image-base64',
    name: 'imageBase64',
    component: () => import('../views/tools/ImageBase64.vue'),
    meta: {
      title: '图片Base64编码'
    }
  },
  {
    path: '/timestamp',
    name: 'timestamp',
    component: () => import('../views/tools/Timestamp.vue'),
    meta: {
      title: '时间戳转换'
    }
  },
  {
    path: '/url-codec',
    name: 'urlCodec',
    component: () => import('../views/tools/UrlCodec.vue'),
    meta: {
      title: 'URL编码/解码'
    }
  },
  {
    path: '/json-format',
    name: 'jsonFormat',
    component: () => import('../views/tools/JsonFormat.vue'),
    meta: {
      title: 'JSON格式化'
    }
  },
  {    path: '/ai-tools',    name: 'aiTools',    component: () => import('../views/tools/AiTools.vue'),    meta: {      title: 'AI工具导航'    }  },
  {
    path: '/hash-tools',
    name: 'hashTools',
    component: () => import('../views/tools/HashTools.vue'),
    meta: {
      title: 'MD5/SHA加密工具'
    }
  },
  {
    path: '/regex-tester',
    name: 'regexTester',
    component: () => import('../views/tools/RegexTester.vue'),
    meta: {
      title: '正则表达式测试器'
    }
  },
  {
    path: '/qr-generator',
    name: 'qrGenerator',
    component: () => import('../views/tools/QrGenerator.vue'),
    meta: {
      title: '二维码生成器'
    }
  },
  {
    path: '/case-converter',
    name: 'caseConverter',
    component: () => import('../views/tools/CaseConverter.vue'),
    meta: {
      title: '英文字母大小写转换'
    }
  }]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = `IT工具箱 - ${to.meta.title || ''}` 
  next()
})

export default router