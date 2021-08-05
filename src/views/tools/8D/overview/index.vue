<template>
  <div class="app-container">
    <el-row class="report-title">{{ reportTitle }}</el-row>
    <el-divider></el-divider>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item class="collapse-title" title="D1 - 问题介绍和小组定义" name="1">
        <FirstForm :issue-id="issueId" :need-confirm="confirmVisible"/>
      </el-collapse-item>
      <el-collapse-item class="collapse-title" title="D2 - 问题描述" name="2">
        <SecondForm :issue-id="issueId" :need-confirm="confirmVisible"/>
      </el-collapse-item>
      <el-collapse-item class="collapse-title" title="D3 - 短期围堵措施" name="3">
        <ThirdForm :issue-id="issueId" :need-confirm="confirmVisible"/>
      </el-collapse-item>
      <el-collapse-item class="collapse-title" title="D4 - 根本原因分析与验证" name="4">
        <ForthForm :issue-id="issueId" :need-confirm="confirmVisible"/>
      </el-collapse-item>
      <el-collapse-item class="collapse-title" title="D5 - 改善措施" name="5">
        <FifthForm :issue-id="issueId" :need-confirm="confirmVisible"/>
      </el-collapse-item>
      <el-collapse-item class="collapse-title" title="D6 - 改善措施的有效性评估" name="6">
        <SixthForm :issue-id="issueId" :need-confirm="confirmVisible"/>
      </el-collapse-item>
      <el-collapse-item class="collapse-title" title="D7 - 永久措施" name="7">
        <SeventhForm :issue-id="issueId" :need-confirm="confirmVisible"/>
      </el-collapse-item>
      <el-collapse-item class="collapse-title" title="D8 - 关闭8D" name="8">
        <EighthForm :issue-id="issueId" :need-confirm="confirmVisible"/>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>

import FirstForm from '../../../tools/8D/detail/step/ISSUE.D1'
import SecondForm from '../../../tools/8D/detail/step/ISSUE.D2'
import ThirdForm from '../../../tools/8D/detail/step/ISSUE.D3'
import ForthForm from '../../../tools/8D/detail/step/ISSUE.D4'
import FifthForm from '../../../tools/8D/detail/step/ISSUE.D5'
import SixthForm from '../../../tools/8D/detail/step/ISSUE.D6'
import SeventhForm from '../../../tools/8D/detail/step/ISSUE.D7'
import EighthForm from '../../../tools/8D/detail/step/ISSUE.D8'
import { getIssueById } from '@/api/tools/issue'

export default {
  name: 'Overview',
  components: { FirstForm, SecondForm, ThirdForm, ForthForm, FifthForm, SixthForm, SeventhForm, EighthForm },
  data() {
    return {
      issueId: null,
      activeNames: ['1'],
      reportTitle: null,
      confirmVisible: false
    }
  },
  created: function() {
    if (this.$route.query.issueId !== undefined) {
      this.issueId = this.$route.query.issueId
      this.getIssueInfoById(this.issueId)
    }
  },
  methods: {
    // 查询问题信息
    getIssueInfoById(id) {
      getIssueById(id).then(res => {
        this.reportTitle = res.issueTitle + '_8D报'
      })
    },
    // 手风琴操作
    handleChange(val) {
      console.log(val)
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-divider--horizontal {
  margin: 10px 0;
}

.report-title {
  padding: 15px 0 5px 0;
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: #ff0000;
}

.report-title > > .el-collapse-item__header {
  font-weight: bold;
  font-size: 18px;
}

</style>
