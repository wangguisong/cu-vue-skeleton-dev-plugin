# cu-vue-skeleton-dev-plugin
cu骨架屏webpack插件

## 使用依赖
imagemagick、graphicsmagick
- 安装方法
  ```
  brew install imagemagick
  brew install graphicsmagick
  ```

## 安装
`npm i cu-vue-skeleton-dev-plugin -D`

## 使用
webpack.conf.js
```js
const SkeletonPlugin = require('cu-vue-skeleton-dev-plugin')
config.plugins.push(new SkeletonPlugin(config))
```

## 配置

- tempImageDir[选填] 存放临时文件的目录, 默认 /tmp
- skeletonImageDir 骨架图文件存放目录
- templatePath html模板文件路径
- mountId[选填] vue实例挂载元素id, 默认 app

## 控制台命令

-  skeleton_preview 骨架预处理
-  skeleton 生成骨架图
-  skeleton_index 生成首屏骨架图
-  skeleton_cancel 取消骨架预处理效果

## 开发
```
npm run serve
```