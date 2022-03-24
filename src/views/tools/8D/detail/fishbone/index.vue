<template>
  <div class="app-container">
    <el-page-header @back="goBack" content="鱼骨图"></el-page-header>
    <br/>
    <Jtopo :issue-id="issueId" :fish-data="fishData"/>
  </div>
</template>

<script>

import Jtopo from '@/views/components/Jtopo'

export default {
  name: 'FishBone',
  components: { Jtopo },

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
    }
    // if (this.$route.query.fishData !== undefined) {
    //   this.fishData = this.$route.query.fishData
    // } else {
    //   window.location.go(-1)
    // }
    /*this.fishData = {"name":"一期内胶内壁难清理异物",
      "children":
        [{"children":[{"name":"内胶挤出时脏污随芯棒被内胶覆盖","children":[]}],"name":"机器"},
          {"children":[{"name":"粗心大意","children":[]}],"name":"人员"},
          {"children":[{"name":"芯棒不干净","children":[]}],"name":"材料"},
          {"children":[{"name":"芯棒清洗过程控制不好","children":[]}],"name":"方法"},
          {"children":[{"name":"转运过程中芯棒受到污染","children":[]}],"name":"环境"}]
    }*/
  },
  mounted: function() {
  },
  methods: {
    // 返回上一页
    goBack() {
      window.history.back()
    }
    /* // 获取原因树数据
     getCauseTreeByIssueId(id) {
       getCauseTreeByIssueId(id).then(res => {
         this.fishData = {}
         this.fishData.name = res.issueTitle
         this.fishData.children = res.content
       })
     }*/
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
