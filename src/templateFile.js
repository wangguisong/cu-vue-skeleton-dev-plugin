/** 模板处理文件 */
const globalOptions = require('./options')
const fs = require('fs')
const cheerio = require('cheerio')

/** 页面中注入骨架图片元素 */
function addSkeletonElement(id, imgName) {
  console.log(id, imgName)
  let filePath = globalOptions.templatePath
  let html = fs.readFileSync(filePath)
  let $ = cheerio.load(html)
  $(`img#skeleton_${id}`).remove()
  $('body').append(`<img id="skeleton_${id}" src="/skeleton/${imgName}" style="width:100%;display:none;" />`)
  fs.writeFileSync(filePath, $.html())
}

/** 挂载点注入首屏骨架图片元素 */
function replaceAppContainer(dataUri) {
  let filePath = globalOptions.templatePath
  let html = fs.readFileSync(filePath)
  let $ = cheerio.load(html)
  $(`#${globalOptions.mountId}`).html(`<img style="width:100%;" src="${dataUri}" />`)
  console.log(`#${globalOptions.mountId}`)
  fs.writeFileSync(filePath, $.html())
}

module.exports = {
  addSkeletonElement,
  replaceAppContainer
}