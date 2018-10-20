const router = require('express').Router()
const Settings = require('../common/settings.js')
const utils = require('./utils')

const DEFAULT_SEO = Settings.DEFAULT_SEO
const DEFAULT_LANG = Settings.DEFAULT_LANG

// 不同语言渲染同一个pug模板
const singleTemplatePages = [
  {
    template: 'internationalization',
    i18n: {
      "en-US": {
        "title": "A MPA Vue.js Project(Text in template can be crawled by search engines)",
      },
      "zh-CN": {
        "title": "多页面Vue.js工程(模板中的文本可以被搜索引擎抓取)",
      },
    }
  }
]

singleTemplatePages.forEach(page => {
  if (typeof page === 'string') page = {template: page}
  if (!page.path) page.path = '/' + page.template

  // 路径中有locale以路径为准
  router.get("/:locale" + page.path, function(req, res, next){
    renderPage(res, page, req.params.locale)
  })

  // 路径中没有locale以cookie为准
  router.get(page.path, function (req, res, next) {
    renderPage(res, page, req.cookies.locale || DEFAULT_LANG)
  })

  function renderPage (res, page, locale) {
    const l = formatLocale(locale)
    // res.render(page.template, Object.assign({}, DEFAULT_SEO, { l }, page.i18n[l], page.locals))
    utils.showPage(res.sendFile, page.template)
  }
})

// 不同语言渲染不同pug模板
const multiTemplatePages = [
  'internationalization-multi',
]

multiTemplatePages.forEach(page => {
  if (typeof page === 'string') page = {template: page}
  if (!page.path) page.path = '/' + page.template

  // 路径中有locale以路径为准
  router.get("/:locale" + page.path, function(req, res, next){
    renderPage(res, page, req.params.locale)
  })

  // 路径中没有locale以cookie为准
  router.get(page.path, function (req, res, next) {
    renderPage(res, page, req.cookies.locale || DEFAULT_LANG)
  })

  function renderPage (res, page, locale) {
    res.render(page.template + '/' + locale, Object.assign({}, DEFAULT_SEO, { locale: formatLocale(locale) }, page.locals))
    utils.showPage(res.sendFile, page.template)
  }
})

/**
 * 将 en-us 转换为 en-US
 */
function formatLocale(str) {
  str = str.split('-')
  return str[0] + '-' + str[1].toUpperCase()
}

module.exports = router
