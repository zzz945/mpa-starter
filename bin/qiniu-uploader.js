require('colors')
const glob = require('glob')
const $path = require('path')
const $util = require('util')
const qiniu = require('qiniu')
const config = require('./config.js')
const tokens = require('../tokens.js').qiniu
const mac = new qiniu.auth.digest.Mac(tokens.ak, tokens.sk)
const bucketManager = new qiniu.rs.BucketManager(mac, config);

const OVERWRITE = false

const qiniuConfig = new qiniu.conf.Config()
// 空间对应的机房
qiniuConfig.zone = qiniu.zone.Zone_na1
// 是否使用https域名
qiniuConfig.useHttpsDomain = true

const formUploader = new qiniu.form_up.FormUploader(qiniuConfig)

/**
 *  获取上传token
 * @param {*} overwrite 是否覆盖
 * @param {*} key 如果覆盖为true, 需要文件key
 */
function getToken(key = '') {
  let scope = tokens.bucket

  if (OVERWRITE) {
    if (!key) return console.log('overwrite fail', 'overwrite token need file key!')
    scope += ':' + key
  }
  const putPolicy = new qiniu.rs.PutPolicy({ scope: scope })
  return putPolicy.uploadToken(mac)
}

/**
 * @param {*} file 文件完整路径
 * @param {*} onProgress 上传
 * @param {*} overwrite 是否覆盖
 */
function uploadOneFile(filePath) {
  const destPath = $path.relative(config.paths.publicRoot, filePath)
  const token = getToken(destPath)
  return new Promise((resolve, reject) => {
    //额外参数
    const params = {}
    // svg 需要指定mime
    if (/svg$/i.test($path.extname(filePath))) {
      params.mimeType = 'image/svg+xml'
    }
    // html js css需指定编码，否则会出现中文乱码问题
    else if (/js$/i.test($path.extname(filePath))) {
      params.mimeType = 'application/javascript; charset=utf-8'
    }
    else if (/html$/i.test($path.extname(filePath))) {
      params.mimeType = 'text/html; charset=utf-8'
    }
    else if (/css$/i.test($path.extname(filePath))) {
      params.mimeType = 'text/css; charset=utf-8'
    }

    var putExtra = new qiniu.form_up.PutExtra(params)

    formUploader.putFile(token,
      destPath,
      filePath,
      putExtra,
      (respErr, respBody, respInfo) => {
      if (respErr) {
        throw respErr
      }
      if (respInfo.statusCode == 200 || respInfo.statusCode == 614) {
        resolve({
          respInfo: respInfo,
          file: filePath
        })
      } else {
        console.log($util.inspect(respInfo))
        throw respInfo
      }
    })
  })
}

function listAll (bucket) {
  return new Promise ((resolve, reject) => {
    let ret = []
    list()

    function list (nextMarker) {
      bucketManager.listPrefix(bucket, nextMarker?{maker: nextMarker}:null, function (err, respBody, respInfo) {
        if (err) {
          return reject(err);
        }
        if (respInfo.statusCode == 200) {
          //如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
          //指定options里面的marker为这个值
          const nextMarker = respBody.marker;
          const items = respBody.items;
          ret = ret.concat(items.map(item => item.key))
          if (nextMarker) list(nextMarker)
          else resolve(ret)
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
          reject()
        }
      })
    }
  })
}

function cleanBucket (bucket) {
  return listAll(bucket).then(items => {
    //每个operations的数量不可以超过1000个，如果总数量超过1000，需要分批发送
    const perGroup = 1000
    const groupCount = Math.ceil(items.length/perGroup)
    const groups = []
    let left = items.length
    for (let i = 0; i < groupCount; i++) {
      const start = perGroup*i
      const end = start + Math.min(perGroup, left)
      groups[i] = items.slice(start, end)
      left -= perGroup
    }

    groups.forEach(group => {
      const deleteOperations = group.map(file => qiniu.rs.deleteOp(bucket, file))
      bucketManager.batch(deleteOperations, function(err, respBody, respInfo) {
        if (err) {
          console.log(err);
          //throw err;
        } else {
          // 200 is success, 298 is part success
          if (parseInt(respInfo.statusCode / 100) == 2) {
            respBody.forEach(function(item) {
              if (item.code == 200) {
                // console.log(item.code + "\tsuccess");
              } else {
                console.log(item.code + "\t" + item.data.error);
              }
            });
          } else {
            console.log(respInfo.deleteusCode);
            console.log(respBody);
          }
        }
      });
    })
  })
}

function main() {
  return cleanBucket(tokens.bucket).then(_ => {
    const files = glob.sync(config.paths.publicRoot + '/**/*', { nodir: true })
    let uploadedCount = 0
    return Promise.all(files.map(f => {
      return uploadOneFile(f).then(res => {
        uploadedCount++
        const progress = (uploadedCount / files.length * 100).toFixed()
        console.log(('uploaded: ' + progress + '%').bgGreen.black, res.file, res.respInfo.statusCode)
      })
    }))
  })
}

module.exports = main