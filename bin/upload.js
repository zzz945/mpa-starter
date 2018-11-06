const upload = require('./qiniu-uploader')
upload().then(function(res) {
  console.log('Upload done'.bgGreen.black)
})