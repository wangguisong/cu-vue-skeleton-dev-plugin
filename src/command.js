/** 页面中注入的命令 */

/** 当前页面截图， 并将截图发送给server， 用于生成骨架图  */
Object.defineProperty(window, 'skeleton', {
  get () {
    var options = {
      allowTaint: true,
      useCORS: true,
      width: 375,
      height: 667,
      windowWidth: 375,
      windowHeight: 667
    }
    html2canvas(document.body, options).then(canvas => {
      var hash = window.location.hash.split('?')[0].replace('#', '')
      if (!hash) hash = '_'
      var filename = `${hash.replace(/\//g, '_')}`
      var dataUrl = canvas.toDataURL()
      window.skeletonWS.send(JSON.stringify({
        operation: 'skeleton',
        filename: filename,
        content: dataUrl
      }))
    })
  }
})

/** 当前页面截图，并发送给server, 生成骨架图并注入挂载元素， 首屏用这个命令 */
Object.defineProperty(window, 'skeleton_index', {
  get () {
    var options = {
      allowTaint: true,
      useCORS: true,
      width: 375,
      height: 667,
      windowWidth: 375,
      windowHeight: 667
    }
    html2canvas(document.body, options).then(canvas => {
      var hash = window.location.hash.split('?')[0].replace('#', '')
      if (!hash) hash = '_'
      var filename = `${hash.replace(/\//g, '_')}`
      var dataUrl = canvas.toDataURL()
      window.skeletonWS.send(JSON.stringify({
        operation: 'skeleton_index',
        filename: filename,
        content: dataUrl
      }))
    })
  }
})

/** 对页面元素进行骨架预处理 */
Object.defineProperty(window, 'skeleton_preview', {
  get () {  
    skeletonText(document.body)
    skeletonInput()
    skeletonImage()
  }
})

/** 取消骨架预处理效果 */
Object.defineProperty(window, 'skeleton_cancel', {
  get () {
    window.location.reload()
  }
})

/** 骨架预处理文本 */
function skeletonText (element) {
  var fill = '▇'
  if (element.style) {
    element.style.color = 'lightgray'
    element.style.borderColor = 'lightgray'
    element.style.letterSpacing = '-1px'
    element.style.backgroundImage = 'none'
  }
  if (element.constructor === Text ) {
    var len = element.data.trim().length
    element.data = ''.padStart(len, fill)
  } else if (element.constructor !== HTMLScriptElement && element.constructor !== HTMLStyleElement) {
    element.childNodes.forEach(function(e) {
      skeletonText(e)
    })
  }
}

/** 骨架预处理input */
function skeletonInput () {
  var fill = '▇'
  var inputList = document.body.getElementsByTagName('input')
  for (var i=0; i < inputList.length; i++) {
    var element = inputList[i]
    if (element.style) {
      element.style.color = 'lightgray'
      element.style.borderColor = 'lightgray'
      element.style.overflow = 'hidden'
      element.style.letterSpacing = '-1px'
    }
    if (element.placeholder) element.placeholder = ''
    if (element.value) {
      var len = element.value.trim().length
      element.value = ''.padStart(len, fill)
    }
  }
}

/** 骨架预处理图片 */
function skeletonImage () {
  var fill = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2NoaGj4DwAFhAKAowjAZgAAAABJRU5ErkJggg=='
  var images = document.getElementsByTagName('img')
  for (var i=0; i < images.length; i++) {
    var w = images[i].width
    var h = images[i].height
    images[i].src = fill
    images[i].width = w
    images[i].height = h
  }
}
