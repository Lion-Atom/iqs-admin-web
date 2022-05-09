<template>
  <div class="app-container">
    <!--快速导航-->
    <div class="head-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/training/management' }">培训概览</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/training/train-exam' }">培训考试</el-breadcrumb-item>
        <el-breadcrumb-item><b>培训考试明细</b></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container class="app-container">
      <el-aside>考试题库</el-aside>
      <el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "ExamDetail"
}
</script>

<style scoped>

</style>
