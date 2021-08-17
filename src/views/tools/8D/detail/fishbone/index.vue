<template>
  <div class="app-container">
    <el-page-header @back="goBack" content="鱼骨图"></el-page-header>
    <br/>
    <Jtopo :fish-data="fishData"/>
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
    if (this.$route.query.fishData !== undefined) {
      this.fishData = this.$route.query.fishData
    } else {
      window.location.go(-1)
    }
    /*this.fishData = {"name":"一期内胶内壁难清理异物",
      "children":
        [{"children":[{"name":"内胶挤出时脏污随芯棒被内胶覆盖","children":[]}],"name":"机器"},
          {"children":[{"name":"粗心大意","children":[]}],"name":"人员"},
          {"children":[{"name":"芯棒不干净","children":[]}],"name":"材料"},
          {"children":[{"name":"芯棒清洗过程控制不好","children":[]}],"name":"方法"},
          {"children":[{"name":"转运过程中芯棒受到污染","children":[]}],"name":"环境"}]
    } */
    /* this.fishData = {
      'children': [
        {
          'children': [
            {
              'children': [
                {'children': [], 'name': '睡眠中迷糊'},
                {'children': [], 'name': '意识不清'},
                {'children': [], 'name': '精神异常'},
              ], 'name': '精神因素'
            },
            {
              'children': [
                {'children': [], 'name': '舒适度改变'},
                {'children': [], 'name': '其它'}
              ], 'name': '依从性差'
            },
            {
              'children': [
                {'children': [], 'name': '自身理解'},
                {'children': [], 'name': '护士指导'}
              ], 'name': '知识缺乏'
            },
          ], 'name': '病人'
        },
        {
          'children': [
            {
              'children': [
                {'children': [], 'name': '缺乏安全意识'},
                {'children': [], 'name': '自身知识不足'}
              ], 'name': '安全告知不到位'
            },
            {
              'children': [
                {'children': [], 'name': '工作责任心不强'},
                {'children': [], 'name': '分级护理落实差'}
              ], 'name': '未及时发现安全隐患'
            },
            {
              'children': [
                {'children': [], 'name': '医生固定'}
              ], 'name': '违反管道护理常规'
            },
            {
              'children': [
                {'children': [], 'name': '分级护理交接班制度执行差'},
                {'children': [], 'name': '医护沟通不足'},
                {'children': [], 'name': '特殊病人、重点环节风险评估不足'}
              ], 'name': '约束措施、无力、不当'
            }
          ], 'name': '医生护士'
        },
        {
          'children': [
            {'children': [], 'name': '粗心大意'},
            {
              'children': [
                {'children': [], 'name': '对保护性约束'},
                {'children': [], 'name': '对自行拔管可能带来的危害不清'}
              ], 'name': '家属随意终止约束'
            }
          ], 'name': '好友'
        },
        {
          'children': [
            {'children': [], 'name': '粗心大意'},
            {
              'children': [
                {'children': [], 'name': '对保护性约束'},
                {'children': [], 'name': '对自行拔管可能带来的危害不清'}
              ], 'name': '家属随意终止约束'
            }
          ], 'name': '家属'
        },
        {
          'children': [
            {
              'children': [
                {'children': [], 'name': '未沟通'}
              ], 'name': '质量问题'
            },
            {'children': [], 'name': '培训不足'},
            {
              'children': [
                {'children': [], 'name': '护士长'}
              ], 'name': '监管不足'
            },
            {'children': [], 'name': '护士人力不足'}
          ], 'id': '1004', 'fid': '1', 'name': '管理'
        }
      ], 'name': '管道脱落'
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
