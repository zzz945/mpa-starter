const router = require('express').Router()
const config = require('../bin/config.js')

const pages = [
  'add-edit-search',
  {
    path: '/add-edit-search/add',
    name: 'add-edit-search',
  },
  {
    path: '/add-edit-search/edit/:id',
    name: 'add-edit-search',
  },
]

pages.forEach(page => {
  if (typeof page === 'string') page = {name: page}
  if (!page.path) page.path = '/' + page.name

  router.get(page.path, function (req, res) {
    res.sendFile(config.paths.assetsRoot + '/pages/' + page.name + '/index.html')
  })
})

module.exports = router
