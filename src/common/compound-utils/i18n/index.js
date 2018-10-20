import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cookies from 'cookies-js'
import Settings from 'root/common/settings.js'
// import ElementUI from 'element-ui'

export function i18nInit (params = {}) {
  const {
    customI18N, // 可选。页面额外需要引入的国际化翻译
    vue, // 必需。创建vue实例需要的参数
  } = params

  Vue.use(VueI18n)
  const i18n = new VueI18n({
    locale: $LB.locale,
    fallbackLocale: 'en-US',
    messages: customI18N || {},
    silentTranslationWarn: process.env.NODE_ENV === 'development'
  })

  // ElementUI.locale(ElementUI.lang.zhCN)

  var html = document.querySelector("html");
  html.classList.add($LB.locale);

  vue.i18n = i18n
}

export function changeLocale (locale) {
  let prevLocale = $LB.locale
  if (locale === prevLocale) return

  cookies.set('locale', locale)

  prevLocale = prevLocale.toLowerCase()
  locale = locale.toLowerCase()

  const l = window.location
  let url

  if (locale === Settings.DEFAULT_LANG) {
    // 默认locale没有前缀
    const pathname = l.pathname.replace(`/${prevLocale}`, '')
    url = `//${l.host}${pathname}${l.search}${l.hash}`
  } else {
    // 其他的locale需要增加前缀，比如 https://www.lingobus.com/zh-CN/teacher-overview
    const pathname = l.pathname.replace(`/${prevLocale}`, `/${locale}`)
    url = `//${l.host}/${locale}${pathname === '/' ? '' : pathname}${l.search}${l.hash}`
  }
  // 更新history并且reload
  location.replace(url)
}