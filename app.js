require('colors')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const useragent = require('express-useragent')

const env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
const proxy = require('./proxy.js')

const config = require('./bin/config.js')
const PackageConfig = require('./package.json')

console.log('Using Node %s'.green.bold, process.version)

const app = express()

if (env === 'dev') {
  console.log('Using Development Env Config'.cyan.inverse)
  if (process.env.HMR) {
    console.log('Using HMR')
    require('./bin/hmr.js')(app)
  }
  app.locals.isdev = true
  app.locals.pretty = true
  app.use(morgan('dev'))
} else {
  console.log('Using Production Env Config'.red.inverse)
  app.locals.isdev = false
  app.locals.pretty = false
}

if (env === 'dev') {
  app.use(require('./mock'))
}

proxy(app)
app.use(useragent.express())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

/* server static files */
app.use(express.static(config.paths.publicRoot))

/* 404 */
app.use(function(req, res) {
  res.status(404);
  res.sendFile(`${config.paths.publicRoot}/404/index.html`)
})

/* 500 */
app.use(function(error, req, res, next) {
  res.status(500);
  res.sendFile(`${config.paths.publicRoot}/500/index.html`)
})

const port = config.port
app.listen(port, function() {
  console.log(PackageConfig.name + ' started on port ' + String(port).red.bold + '...')
})