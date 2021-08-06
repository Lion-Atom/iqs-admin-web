// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function() {
      var title = this.reportTitle
      html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: true
      }).then(function(canvas) {
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = contentWidth / 592.28 * 841.89
          let leftHeight = contentHeight
          let position = 0
          let imgWidth = 595.28
          let imgHeight = 592.28 / contentWidth * contentHeight
          let pageData = canvas.toDataURL('image/jpeg', 1.0)
          let PDF = new JsPDF('', 'pt', 'a4')
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          PDF.save(title + '.pdf')
          let btn = document.getElementsByTagName('button')
          for (let i = 0; i < btn.length; i++) {
            btn[i].style.display = 'block'
          }
        }
      )
    },
      Vue.prototype.printPdf = function() {
        var title = this.reportTitle
        var that = this
        var shareContent = document.querySelector('#pdfDom') //需要截图的包裹的（原生的）DOM 对象
        var width = shareContent.offsetWidth //获取dom 宽度
        var height = shareContent.offsetHeight //获取dom 高度
        var canvas = document.createElement('canvas') //创建一个canvas节点
        var scale = 2 //定义任意放大倍数 支持小数
        canvas.width = width * scale //定义canvas 宽度 * 缩放，在此我是把canvas放大了2倍
        canvas.height = height * scale //定义canvas高度 *缩放
        canvas.getContext('2d').scale(scale, scale) //获取context,设置scale
        html2Canvas(document.querySelector('#pdfDom'), {
          allowTaint: true
        }).then(function(canvas) {
          var context = canvas.getContext('2d')
          // 【重要】关闭抗锯齿
          context.mozImageSmoothingEnabled = false
          context.webkitImageSmoothingEnabled = false
          context.msImageSmoothingEnabled = false
          context.imageSmoothingEnabled = false

          var imgData = canvas.toDataURL('image/jpeg', 1.0) //转化成base64格式,可上网了解此格式
          var img = new Image()
          img.src = imgData
          img.onload = function() {
            img.width = img.width / 2 //因为在上面放大了2倍，生成image之后要/2
            img.height = img.height / 2
            img.style.transform = 'scale(0.5)'
            if (this.width > this.height) {
              //此可以根据打印的大小进行自动调节
              var doc = new JsPDF('l', 'mm', [
                this.width * 0.555,
                this.height * 0.555
              ])
            } else {
              var doc = new JsPDF('p', 'mm', [
                this.width * 0.555,
                this.height * 0.555
              ])
            }
            doc.addImage(
              imgData,
              'jpeg',
              10,
              0,
              this.width * 0.505,
              this.height * 0.545
            )
            doc.save(title + '.pdf')
            let btn = document.getElementsByTagName('button')
            for (let i = 0; i < btn.length; i++) {
              btn[i].style.display = 'block'
            }
            that.dianpingShow = true
          }
        })
      }
  }
}
