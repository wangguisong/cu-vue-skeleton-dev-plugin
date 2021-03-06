const SkeletonPlugin = require('./src/index')
const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
  pages: {
    index: {
      entry: './examples/main.js',
      template: './public/index.html',
      filename: 'index.html'
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('examples'))
    config.plugin('skeleton')
      .use(SkeletonPlugin, [{
        "skeletonImageDir": resolve('examples/skeletonImages'),
        "templatePath": resolve('public/index.html')
      }])
      .end()
  }
}