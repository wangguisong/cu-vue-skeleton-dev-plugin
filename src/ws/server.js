/** Websocket 服务端， 开发环境build开始时候启动，用于接收骨架源数据，生成骨架并注入 */
const WebSocketServer = require('ws').Server
const { execImage } = require('../imageFile')
const program = require('commander')
const globalOptions = require('../options')
const { addSkeletonElement, replaceAppContainer } = require('../templateFile')

program
  .version('0.0.1')
  .option('-O --output <string>', 'skeleton output dir')
  .option('-T --template <string>', 'template file path')
  .option('-C --container <string>', 'app container id')
  .parse(process.argv)

if(!program.output) {
  console.error('ws miss argv --output')
  process.exit(0)
}

globalOptions.skeletonImageDir = program.output
globalOptions.templatePath = program.template
globalOptions.mountId = program.container

const wss = new WebSocketServer({ port: 8123 })

console.log('ws server opened')

wss.on('connection', ws => {
  console.log('ws connected')
  ws.on('message', msg => {
    let file = JSON.parse(msg)
    console.log('ws recive operation:', file.operation)
    // 生成骨架图片
    execImage(file.filename, file.content).then(({ destFileName, dataUri }) => {
      // 模板中注入骨架图
      addSkeletonElement(file.filename, destFileName)
      if (file.operation === 'skeleton_index') {
        // vue挂载元素中注意骨架图，首屏优化
        replaceAppContainer(dataUri)
      }
    })
  })
})