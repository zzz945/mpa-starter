const router = require('express').Router()
const config = require('../bin/config.js')
const Settings = require('../common/settings.js')

function applyRouter(app) {
  // render index
  router.get('/', function (req, res) {
    res.sendFile(config.paths.assetsRoot + '/pages/index/index.html')
  })

  // index i18n
  Settings.SUPPORTED_LANGS.forEach(lang => {
    if (lang !== Settings.DEFAULT_LANG) {
      router.get('/' + lang, function (req, res) {
        res.sendFile(config.paths.assetsRoot + '/pages/index/' + lang + '/index.html')
      })
    }
  })

  // render other pages
  const pages = [
    'bem',
    'mobile-layout1',
    'mobile-layout2',
    'mobile-layout3',
    'mobile-layout4',
    'lazyload',
    'login',
    'register',
    'reset-password',
    'dynamic-import',
  ]

  pages.forEach(page => {
    if (typeof page === 'string') page = {name: page}
    if (!page.path) page.path = '/' + page.name

    // other page i18n
    router.get('/:locale' + page.path, function (req, res) {
      res.sendFile(config.paths.assetsRoot + '/pages/' + page.name + '/' + req.params.locale + '/index.html')
    })

    router.get(page.path, function (req, res) {
      res.sendFile(config.paths.assetsRoot + '/pages/' + page.name + '/index.html')
    })
  })

  // app.use(require('./i18n'))
  app.use(require('./add-edit-search'))
  app.use(router)
}

module.exports = applyRouter
