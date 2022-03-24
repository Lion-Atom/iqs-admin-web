import Vue from 'vue'

Vue.directive('download', {
  inserted: (el, binding) => {
    el.style.cssText = 'cursor: pointer;color:write;'
    el.addEventListener('click', () => {
      console.log(binding.value)
      const link = document.createElement('a')
      const url = binding.value
      // 这里是将url转成blob地址，
      fetch(url).then(res => res.blob()).then(blob => { // 将链接地址字符内容转变成blob地址
        link.href = URL.createObjectURL(blob)
        console.log(link.href)
        link.download = ''
        document.body.appendChild(link)
        link.click()
      })
    })
  }
})

