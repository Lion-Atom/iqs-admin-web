<template>
  <div class="app-container">
    <el-page-header @back="goBack" content="鱼骨图"></el-page-header>
  </div>
</template>

<script>

import { getCauseTreeByIssueId } from '@/api/tools/issueCause'

export default {
  name: 'FishBone',
  data() {
    return {
      issueId: null,
      fishData: []
    }
  },
  created() {
    if (this.$route.query.issueId !== undefined) {
      this.issueId = this.$route.query.issueId
      this.getCauseTreeByIssueId(this.issueId)
    } else {
      window.location.go(-1)
    }
  },
  mounted: function() {

  },
  methods: {
    // 返回上一页
    goBack() {
      window.history.back()
    },
    // 获取原因树数据
    getCauseTreeByIssueId(id) {
      getCauseTreeByIssueId(id).then(res => {
        this.fishData = res
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
