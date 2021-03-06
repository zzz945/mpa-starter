var router = require('express').Router()
var json = require('./_utils.js')

json(router, '/is-registered', {
  "code": 200,
  "data": false,
  "msg": "OK",
  "success": true
})

router.post('/register', function (req, res) {
  res.send({
    "code": 200,
    "data": 'token121312412412412412412412412412412',
    "msg": "OK",
    "success": true
  })
})

router.post('/send-code-by-email', function (req, res) {
  res.send({
    "code": 200,
    "data": '',
    "msg": "OK",
    "success": true
  })
})

router.post('/send-code-by-phone', function (req, res) {
  res.send({
    "code": 200,
    "data": '',
    "msg": "OK",
    "success": true
  })
})

module.exports = router
