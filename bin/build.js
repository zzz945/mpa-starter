const ora = require('ora')
const webpack = require('webpack')
const utils = require('./utils.js')
const getConfig = require('./webpack.prod.conf')
const fs = require('fs')
const config = require('./config.js')
const upload = require('./qiniu-uploader')

let entrys = utils.getEntries() // compile all entries by default

if (process.env.PAGE) {
  entrys = entrys.filter(entry => {
    const pages = process.env.PAGE.split(',')
    return !!pages.find(p => p === entry.name)
  })
  if (!entrys.length) {
    console.log(('Entry ' + process.env.PAGE + ' not found').red.inverse)
    return
  }
}

utils.printEntries(entrys)

const configs = entrys.map(entry => getConfig(entry))

const spinner = ora('Building')
spinner.start()

// https://webpack.js.org/configuration/configuration-types/#exporting-multiple-configurations
webpack(configs, function (err, stats) {
  spinner.stop()
  if (err) {
    errorHandler(err)
    return
  }
  process.stdout.write(stats.toString('normal') + '\n\n')
  fs.writeFileSync(config.paths.compilationStatsOutput, JSON.stringify(stats.toJson(), null, 2))

  if (process.env.UPLOAD) {
    upload().then(function(res) {
      console.log('Upload done'.bgGreen.black)
    })
  }
})

function errorHandler (err) {
  console.error(err.stack || err)
  if (err.details) {
    console.error(err.details)
  }
}
