import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
//
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 数据字典
import dict from './components/Dict'

// 权限指令
import checkPer from '@/utils/permission'
import permission from './components/Permission'
import './assets/styles/element-variables.scss'
// global css
import './assets/styles/index.scss'

// 代码高亮
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import App from './App'
import store from './store'
import router from './router/routers'

import './assets/icons' // icon
import './router/index' // permission control
import 'echarts-gl'
import './utils/directive'
import htmlToPdf from '@/components/utils/htmlToPdf'
import Print from 'vue-print-nb'
import vueToPdf from 'vue-to-pdf';
import VueEasyPrinter from 'vue-easy-printer';


Vue.use(vueToPdf);
Vue.use(VueEasyPrinter);
Vue.use(Print)
Vue.use(htmlToPdf)
Vue.use(checkPer)
Vue.use(VueHighlightJS)
Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(dict)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})


Vue.prototype.myLoading = function () {
  return this.$loading({
    lock: true,
    text: "正在导出pdf，请稍候。。。",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
}

Vue.directive('defaultSelect', {
  componentUpdated(el, bindings) {
    const [defaultValues] = bindings.value

    const dealStyle = function(tags) {
      // 因为不可删除原有值，所以原有值的index是不会变的，也就是将前n个tag的close隐藏掉即可。n即已有值的长度defaultValues.length
      tags.forEach((el, index) => {
        if (index <= defaultValues.length - 1 && ![...el.classList].includes('select-tag-close-none')) {
          el.classList.add('none')
        }
      })
    }
    // 设置样式 隐藏close icon
    const tags = el.querySelectorAll('.el-tag__close')
    if (tags.length === 0) {
      // 初始化tags为空处理
      setTimeout(() => {
        const tagTemp = el.querySelectorAll('.el-tag__close')
        dealStyle(tagTemp)
      })
    } else {
      dealStyle(tags)
    }
  }
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
