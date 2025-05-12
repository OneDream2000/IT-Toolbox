import { createRouter, createWebHistory } from 'vue-router'
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
  {
    path: '/ai-tools',
    name: 'aiTools',
    component: () => import('../views/tools/AiTools.vue'),
    meta: {
      title: 'AI工具导航'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `IT工具箱 - ${to.meta.title || ''}` 
  next()
})

export default router