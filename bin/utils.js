const glob = require('glob')
const config = require('./config.js')

function getEntries() {
  const srcPath = config.paths.src
  const pagesPath = srcPath + '/pages'
  const manifests = glob.sync(pagesPath + "/**/__page_manifest__.js")
  return manifests.map(manifestFilePath => {
    const manifest = require(manifestFilePath)
    return {
      ...manifest,
      jsName: manifest.js.substring(manifest.js.indexOf('/')+1, manifest.js.lastIndexOf('.')),
      manifestFilePath,
      pageSrcDir: manifestFilePath.substring(0, manifestFilePath.lastIndexOf('/'))
    }
  })
}

function printEntries(entries) {
  console.log('Entries'.cyan.bold)
  entries.forEach(entry => {
    console.log(entry)
  })
}

/**
 * 将 en-us 转换为 en-US
 */
function formatLocale(str) {
  str = str.split('-')
  return str[0] + '-' + str[1].toUpperCase()
}

exports.getEntries = getEntries
exports.printEntries = printEntries
exports.formatLocale = formatLocale