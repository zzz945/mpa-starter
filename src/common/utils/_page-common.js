import Vue from 'vue'

import parseQuery, { encodeQuery } from 'utils/_parse-query.js'
import { i18nInit } from 'utils/i18n'

export function pageInit (params = {}) {
  const {
    customI18N, // 可选。页面额外需要引入的国际化翻译
    vue, // 必需。创建vue实例需要的参数
  } = params

  window.$LB.query = parseQuery(location.search)

  i18nInit({vue, customI18N})

  if (!vue.el) {
    vue.el = "#root"
  }

  new Vue(vue)
}