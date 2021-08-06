// 页面工具栏
function showJTopoToobar(stage) {
  var toobarDiv = $('<div class="jtopo_toolbar">').html(''
    + '<input type="button" id="centerButton" value="居中显示"/>'
    + '<input type="button" id="fullScreenButton" value="全屏显示"/>'
    + '<input type="button" id="zoomOutButton" value=" 放 大 " />'
    + '<input type="button" id="zoomInButton" value=" 缩 小 " />'
    + '&nbsp;&nbsp;<input type="checkbox" id="zoomCheckbox"/><label for="zoomCheckbox">鼠标缩放</label>'
    + '&nbsp;&nbsp;<input type="button" id="exportButton" value="导出PNG">')

  $('#content').prepend(toobarDiv)

  // 工具栏按钮处理
  $('input[name=\'modeRadio\']').click(function() {
    stage.mode = $('input[name=\'modeRadio\']:checked').val()
  })
  $('#centerButton').click(function() {
    stage.centerAndZoom() //缩放并居中显示
  })
  $('#zoomOutButton').click(function() {
    stage.zoomOut()
  })
  $('#zoomInButton').click(function() {
    stage.zoomIn()
  })
  $('#cloneButton').click(function() {
    stage.saveImageInfo()
  })
  $('#exportButton').click(function() {
    stage.saveImageInfo()
  })
  $('#printButton').click(function() {
    stage.saveImageInfo()
  })
  $('#zoomCheckbox').click(function() {
    if ($('#zoomCheckbox').is(':checked')) {
      stage.wheelZoom = 1.2 // 设置鼠标缩放比例
    } else {
      stage.wheelZoom = null // 取消鼠标缩放比例
    }
  })
  $('#fullScreenButton').click(function() {
    runPrefixMethod(stage.canvas, 'RequestFullScreen')
  })

  window.enterPressHandler = function(event) {
    if (event.keyCode == 13 || event.which == 13) {
      $('#findButton').click()
    }
  }

  // 查询
  $('#findButton').click(function() {
    var text = $('#findText').val().trim()
    //var nodes = stage.find('node[text="'+text+'"]');
    var scene = stage.childs[0]
    var nodes = scene.childs.filter(function(e) {
      return e instanceof JTopo.Node
    })
    nodes = nodes.filter(function(e) {
      if (e.text == null) return false
      return e.text.indexOf(text) != -1
    })

    if (nodes.length > 0) {
      var node = nodes[0]
      node.selected = true
      var location = node.getCenterLocation()
      // 查询到的节点居中显示
      stage.setCenter(location.x, location.y)

      function nodeFlash(node, n) {
        if (n == 0) {
          node.selected = false
          return
        }

        node.selected = !node.selected
        setTimeout(function() {
          nodeFlash(node, n - 1)
        }, 300)
      }

      // 闪烁几下
      nodeFlash(node, 6)
    }
  })
}

var runPrefixMethod = function(element, method) {
  var usablePrefixMethod;
  ['webkit', 'moz', 'ms', 'o', ''].forEach(function(prefix) {
      if (usablePrefixMethod) return
      if (prefix === '') {
        // 无前缀，方法首字母小写
        method = method.slice(0, 1).toLowerCase() + method.slice(1)
      }
      var typePrefixMethod = typeof element[prefix + method]
      if (typePrefixMethod + '' !== 'undefined') {
        if (typePrefixMethod === 'function') {
          usablePrefixMethod = element[prefix + method]()
        } else {
          usablePrefixMethod = element[prefix + method]
        }
      }
    }
  )

  return usablePrefixMethod
}
