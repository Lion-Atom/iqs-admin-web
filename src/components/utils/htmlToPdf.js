// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function() {
      var title = this.reportTitle
      var element = document.getElementById('pdfDom')
      var c = document.createElement('canvas')//创建照片
      var opts = {
        scale: 1.2,
        canvas: c,
        logging: true,
        allowTaint: true,
        useCORS: true,
        dpi: 120, // 图片清晰度问题
        width: element.clientWidth,
        height: element.clientHeight
      }
      //照片高度和宽度是页面元素的两倍
      c.width = element.clientWidth * 1.2
      c.height = element.clientHeight * 1.2
      c.getContext('2d').scale(1, 1)
      html2Canvas(element, opts)
        .then(function(canvas) {

            //未生成pdf的html页面高度
            var leftHeight = canvas.height

            var a4Width = 595.28
            var a4Height = 841.89
            //一页pdf显示html页面生成的canvas高度;
            var a4HeightRef = Math.floor(canvas.width / a4Width * a4Height)

            //pdf页面偏移
            var position = 0

            var pageData = canvas.toDataURL('image/jpeg', 1.0)

            var pdf = new JsPDF('', 'pt', 'a4')
            var index = 1,
              canvas1 = document.createElement('canvas'),
              height
            pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen')

            $('.head-content').append($(
              '<div class="pdfTip">' +
              '   <div>正在生成第<span class="pdfProgress">1</span>页，共<span class="pdfTotal"></span>页...' +
              '</div>'))

            function createImpl(canvas) {
              if (leftHeight > 0) {
                index++

                var checkCount = 0
                if (leftHeight > a4HeightRef) {
                  var i = position + a4HeightRef
                  for (i = position + a4HeightRef; i >= position; i--) {
                    var isWrite = true
                    for (var j = 0; j < canvas.width; j++) {
                      var c = canvas.getContext('2d').getImageData(j, i, 1, 1).data

                      if (c[0] !== 0xff || c[1] !== 0xff || c[2] !== 0xff) {
                        isWrite = false
                        break
                      }
                    }
                    if (isWrite) {
                      checkCount++
                      if (checkCount >= 10) {
                        break
                      }
                    } else {
                      checkCount = 0
                    }
                  }
                  height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef)
                  if (height <= 0) {
                    height = a4HeightRef
                  }
                } else {
                  height = leftHeight
                }

                canvas1.width = canvas.width
                canvas1.height = height

                // console.log(index, 'height:', height, 'pos', position);

                var ctx = canvas1.getContext('2d')
                ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height)

                var pageHeight = Math.round(a4Width / canvas.width * height)
                // pdf.setPageSize(null, pageHeight)
                if (position !== 0) {
                  pdf.addPage()
                }
                pdf.addImage(canvas1.toDataURL('image/jpeg', 1.2), 'JPEG', 0, 0, a4Width, a4Width / canvas1.width * height)
                leftHeight -= height
                position += height
                $('.pdfProgress').text(index + 1)
                $('.pdfTotal').text(index + Math.ceil(leftHeight / a4HeightRef))
                if (leftHeight > 0) {
                  setTimeout(createImpl, 200, canvas)
                } else {
                  pdf.save(title + '.pdf')
                  let btn_save_pdf = document.getElementById('save_pdf')
                  btn_save_pdf.style.display = 'block'
                  $('.pdfTip').remove()
                }
              }
            }

            //当内容未超过pdf一页显示的范围，无需分页
            if (leftHeight < a4HeightRef) {
              pdf.addImage(pageData, 'JPEG', 0, 0, a4Width, a4Width / canvas.width * leftHeight)
              pdf.save(title + '.pdf')
            } else {
              try {
                pdf.deletePage(0)
                $('.pdfTip').show()
                $('.pdfTotal').text(index + Math.ceil(leftHeight / a4HeightRef))
                setTimeout(createImpl, 500, canvas)
              } catch (err) {
                console.log(err)
              }
            }

            /*let contentWidth = canvas.width
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
            let btn_save_pdf = document.getElementById('save_pdf')
            btn_save_pdf.style.display = 'block'*/
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
            // 将打印按钮重置回来
            let btn_save_pdf = document.getElementById('save_pdf')
            btn_save_pdf.style.display = 'block'
            that.dianpingShow = true
          }
        })
      }
  }
}
