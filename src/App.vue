<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
/**
  解决element-ui的table表格控件表头与内容列不对齐问题，必须放到全局文件App.vue或者index.html文件下
 */
body .el-table th.gutter {
  display: table-cell !important;
}
</style>
