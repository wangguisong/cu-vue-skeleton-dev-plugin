/** 注入页面js中的websocket客户端， 用于传送需要server处理的数据 */
;(function(global) {
  global.skeletonWS = new WebSocket('ws://127.0.0.1:8123')
  global.skeletonWS.onopen = function(){ console.log('ws skeleton connected') }
  global.skeletonWS.onclose = function(){ console.log('ws skeleton closed')}
})(window ? window : self)