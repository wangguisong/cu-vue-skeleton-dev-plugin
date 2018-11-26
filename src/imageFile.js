/** 图片处理程序 */
const globalOptions = require('./options')
const fs = require('fs')
const gm = require('gm')
const crypto = require('crypto')
const path = require('path')

/** 保存临时图片 */
function saveTempFile(filename, base64str) {
  let destDir = globalOptions.tempImageDir
  let destPath = `${destDir}/${filename}.png`
  let imgData = base64str.replace(/^data:image\/\w+;base64,/, "")
  let buf = Buffer.from(imgData, 'base64')
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir)
  }
  fs.writeFileSync(destPath, buf)
  return destPath
}

/** 删除临时图片 */
function deleteTempFile(filename) {
  let destDir = globalOptions.tempImageDir
  let destPath = `${destDir}/${filename}.png`
  if (fs.existsSync(destPath)) {
    fs.unlinkSync(destPath)
  }
}

/** 获取图片md5 */
function getFileMD5(fullpath) {
  return new Promise(resolve => {
    let md5sum = crypto.createHash('md5')
    let stream = fs.createReadStream(fullpath)
    stream.on('data', chunk => {
      md5sum.update(chunk)
    })
    stream.on('end', () => {
      resolve(md5sum.digest('hex').toLowerCase())
    })
  })
}

/** 删除骨架图 */
function deleteSkeletonImage (filename) {
  let dir = globalOptions.skeletonImageDir
  let files = fs.readdirSync(dir)
  let reg = new RegExp(`${filename}\\.[^\\.]*\\.jpg`)
  files.forEach(fname => {
    let fullPath = path.resolve(dir, fname)
    if (reg.test(fname)) {
      fs.unlinkSync(fullPath)
    }
  })
}

/** 生成骨架图 */
function generateSkeletonImage (filename) {
  let tmpDir = globalOptions.tempImageDir
  let tmpPath = `${tmpDir}/${filename}.png`
  let destDir = globalOptions.skeletonImageDir
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir)
  }
  return getFileMD5(tmpPath)
    .then(md5 => new Promise(resolve => {
      let destFileName = `${filename}.${md5}.jpg`
      let destPath = `${destDir}/${destFileName}`
      deleteSkeletonImage(filename)
      gm(tmpPath)
        .colorspace('GRAY')
        .setFormat('JPEG')
        .quality(2)
        .write(destPath, e => {
          if (e) {
            console.log('[generateSkeletonImage error]',e.message)
          } else {
            console.log('generateSkeletonImage done')
          }
          let data = fs.readFileSync(destPath, 'base64')
          let dataUri = "data:image/jpg;base64,"  + data;
          resolve({ destFileName, dataUri })
        })
      }))
}

/** 处理图片 */
function execImage(filename, base64str) {
  saveTempFile(filename, base64str)
  return generateSkeletonImage(filename).then(({ destFileName, dataUri }) => {
    deleteTempFile(filename)
    return Promise.resolve({ destFileName, dataUri })
  })
}

module.exports = {
  execImage,
  saveTempFile,
  deleteTempFile
}