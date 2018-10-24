import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import { pageInit as _pageInit } from './_page-common.js'

export function pageInit (params = {}) {
  const {
    customI18N, // 可选。页面额外需要引入的国际化翻译
    vue, // 必需。创建vue实例需要的参数
    routes, // 必需
  } = params

  const router = new VueRouter({
    routes,
    mode: 'history',
  })

  vue.router = router
  _pageInit ({
    customI18N,
    vue
  })
}