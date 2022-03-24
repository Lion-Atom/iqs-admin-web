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
        dpi: window.devicePixelRatio * 1.2, // 将分辨率提高到特定的DPI
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
            var index = 0,
              canvas1 = document.createElement('canvas'),
              height
            pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen')

            $('.app-container').append($(
              '<div class="pdfTip" style="position:fixed;color: #ff0000;font-size: 20px;bottom:8%;right:10%;z-index: 99;">' +
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
              $('.pdfProgress').text(index + 1)
              $('.pdfTotal').text(index + Math.ceil(leftHeight / a4HeightRef))
              pdf.save(title + '.pdf')
              let btn_save_pdf = document.getElementById('save_pdf')
              btn_save_pdf.style.display = 'block'
              $('.pdfTip').remove()
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
          }
        )
    },
      Vue.prototype.exportPdf = function (title, dom) {
        // 注册getPdf方法，传入两个参数，此处使用了promise处理导出后的操作
        /*
        title: 导出文件名
        dom: 需要导出dom的id
         */
        return new Promise((resolve, reject) => {
          html2Canvas(document.querySelector(dom), {
            useCORS: true, // 由于打印时，会访问dom上的一些图片等资源，解决跨域问题！！重要
            allowTaint: true // 允许跨域
          }).then(function (canvas) {
            let contentWidth = canvas.width;
            let contentHeight = canvas.height;
            // 根据A4纸的大小，计算出dom相应比例的尺寸
            let pageHeight = contentWidth / 592.28 * 841.89;
            let leftHeight = contentHeight;
            let position = 0;
            let imgWidth = 595.28;
            // 根据a4比例计算出需要分割的实际dom位置
            let imgHeight = 592.28 / contentWidth * contentHeight;
            // canvas绘图生成image数据，1.0是质量参数
            let pageData = canvas.toDataURL('image/jpeg', 1.0);
            // a4大小
            let PDF = new JsPDF('', 'pt', 'a4');
            // 当内容达到a4纸的高度时，分割，将一整块画幅分割出一页页的a4大小，导出pdf
            if (leftHeight < pageHeight) {
              PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
            } else {
              while (leftHeight > 0) {
                PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                leftHeight -= pageHeight;
                position -= 841.89;
                if (leftHeight > 0) {
                  PDF.addPage();
                }
              }
            }
            // 导出
            PDF.save(title + '.pdf');
            resolve(true);
          })
            .catch(() => {
              reject(false);
            });
        });
      };
  }
}
