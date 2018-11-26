const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const globalOptions = require('./src/options')

class CuVueSkeletonPlugin {

  constructor (options) {
    Object.assign(globalOptions, options)   
    if (process.env.NODE_ENV === 'development') {
      if (!globalOptions.skeletonImageDir) {
        console.error('option skeletonImageDir is required')
      }
      // 启动websocket server
      this.wsProcess = exec(`node ${__dirname}/src/ws/server.js --output ${globalOptions.skeletonImageDir} --template ${globalOptions.templatePath} --container ${globalOptions.mountId}`)

      this.wsProcess.stdout.on('data', data => {
        console.log(`[ws] ${data}`)
      })

      this.wsProcess.stderr.on('data', data => {
        console.error(`[ws] ${data}`)
      })

      console.log('[ws] server started')
    }
  }

  apply (compiler) {
    console.log('skeleton plugin start')
    compiler.plugin('emit', (compilation, callback) => {
      if (process.env.NODE_ENV === 'development') {
        // 开发模式下注入需要的js文件
        let tplName = path.basename(globalOptions.templatePath)
        if (compilation.assets[tplName]) {
          let indexContent = compilation.assets[tplName].source()
          let wsScript = fs.readFileSync(`${__dirname}/src/ws/client.js`)
          indexContent = indexContent + `<script>${wsScript}</script>`
          let html2canvasScript = fs.readFileSync(`${__dirname}/src/html2canvas.js`)
          indexContent = indexContent + `<script>${html2canvasScript}</script>`
          let commandScript = fs.readFileSync(`${__dirname}/src/command.js`)
          indexContent = indexContent + `<script>${commandScript}</script>`
          compilation.assets[tplName] = {
            source () {
              return indexContent
            },
            size () {
              return Buffer.byteLength(indexContent, 'utf-8')
            } 
          }
        }
      }
      // 打包时输出骨架图文件
      if (fs.existsSync(globalOptions.skeletonImageDir)) {
        let files = fs.readdirSync(globalOptions.skeletonImageDir)
        files.forEach(fname => {
          let fullPath = path.resolve(globalOptions.skeletonImageDir, fname)
          let image = fs.readFileSync(fullPath)
          compilation.assets[`skeleton/${fname}`] = {
            source () {
              return image
            },
            size () {
              return image.byteLength
            }
          }
        })
      }
      callback()
    })
  }
}

module.exports = CuVueSkeletonPlugin