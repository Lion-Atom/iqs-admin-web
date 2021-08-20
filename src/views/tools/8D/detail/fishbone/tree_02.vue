<template>
  <div class="app-container">
    <el-page-header @back="goBack" content="原因分析图"></el-page-header>
    <br/>
    <TreeChart :issue-id="issueId" :fish-data="fishData"/>
  </div>
</template>

<script>

import TreeChart from '@/components/Echarts/TreeChart'

export default {
  name: 'FishBone',
  components: { TreeChart },

  data() {
    return {
      issueId: null,
      fishData: {}
    }
  },
  created() {
    if (this.$route.query.issueId !== undefined) {
      this.issueId = this.$route.query.issueId
      this.fishData = this.$route.query.fishData
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
