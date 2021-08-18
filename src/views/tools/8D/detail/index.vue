<template>
  <div @dblclick="back" class="app-container">
    <!--    <pre class="my-code" style="padding: 8px;!important;">8D明细-&#45;&#45;开发中</pre>-->
    <el-card class="box-card">
      <el-page-header @back="goBack" :content="headerContent"></el-page-header>
    </el-card>

    <el-card class="box-card">
      <div>
        <el-radio-group v-model="tabPosition" style="margin-bottom: 10px;">
          <el-radio-button label="top">top</el-radio-button>
          <el-radio-button label="right">right</el-radio-button>
          <el-radio-button label="bottom">bottom</el-radio-button>
          <el-radio-button label="left">left</el-radio-button>
        </el-radio-group>
        <el-tabs v-model="activeName" :tab-position="tabPosition" style="height: 100%;" type="card"
                 @tab-click="handleClick"
        >
          <el-tab-pane name="D1">
        <span slot="label">
           <span class="span-box">
                <i v-if="d1Status" class="el-icon-check"/>
                <i v-else class="el-icon-edit"/>
              <span>D1 成立小组</span>
           </span>
        </span>
            <FirstForm :issue-id="issueId" :status="d1Status" @func="getMsgFormFirstSon"/>
          </el-tab-pane>
          <el-tab-pane name="D2">
        <span slot="label">
           <span class="span-box">
                <i v-if="d2Status" class="el-icon-check"/>
                <i v-else class="el-icon-edit"/>
              <span>D2 问题描述</span>
           </span>
        </span>
            <SecondForm :issue-id="issueId" :status="d2Status" @func="getMsgFormSecSon" v-if="isSecond"/>
          </el-tab-pane>
          <el-tab-pane name="D3">
       <span slot="label">
           <span class="span-box">
                <i v-if="d3Status" class="el-icon-check"/>
                <i v-else class="el-icon-edit"/>
              <span>D3 围堵措施</span>
           </span>
        </span>
            <ThirdForm :issue-id="issueId" :status="d3Status" @func="getMsgFormThirdSon" v-if="isThird"/>
          </el-tab-pane>
          <el-tab-pane name="D4">
       <span slot="label">
           <span class="span-box">
                <i v-if="d4Status" class="el-icon-check"/>
                <i v-else class="el-icon-edit"/>
              <span>D4 根本原因分析</span>
           </span>
        </span>
            <ForthForm :issue-id="issueId" :status="d4Status" @func="getMsgFormForthSon" @funx="getSpecialMsgSon"
                       v-if="isForth"
            />
          </el-tab-pane>
          <el-tab-pane name="D5" v-if="!isSpecial">
       <span slot="label">
           <span class="span-box">
                <i v-if="d5Status" class="el-icon-check"/>
                <i v-else class="el-icon-edit"/>
              <span>D5 验证措施</span>
           </span>
        </span>
            <FifthForm :issue-id="issueId" :status="d5Status" @func="getMsgFormFifthSon" v-if="isFifth"/>
          </el-tab-pane>
          <el-tab-pane name="D6" v-if="!isSpecial">
        <span slot="label">
           <span class="span-box">
                <i v-if="d6Status" class="el-icon-check"/>
                <i v-else class="el-icon-edit"/>
              <span>D6 实施长期纠正措施</span>
           </span>
        </span>
            <SixthForm :issue-id="issueId" :status="d6Status" @func="getMsgFormSixthSon" v-if="isSixth"/>
          </el-tab-pane>
          <el-tab-pane name="D7" v-if="!isSpecial">
        <span slot="label">
           <span class="span-box">
                <i v-if="d7Status" class="el-icon-check"/>
                <i v-else class="el-icon-edit"/>
              <span>D7 永久措施</span>
           </span>
        </span>
            <SeventhForm :issue-id="issueId" :status="d7Status" @func="getMsgFormSeventhSon" v-if="isSeventh"/>
          </el-tab-pane>
          <el-tab-pane name="D8">
        <span slot="label">
           <span class="span-box">
                <i v-if="d8Status" class="el-icon-check"/>
                <i v-else class="el-icon-edit"/>
              <span>D8 关闭</span>
           </span>
        </span>
            <EighthForm :issue-id="issueId" :status="d8Status" @func="getMsgFormEighthSon" v-if="isEighth"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>

import { getByIssueId } from '@/api/tools/timeManagement'
import { getIssueById } from '@/api/tools/issue'
import { validIsNotNull } from '@/utils/validationUtil'
import FirstForm from './step/ISSUE.D1'
import SecondForm from './step/ISSUE.D2'
import ThirdForm from './step/ISSUE.D3'
import ForthForm from './step/ISSUE.D4'
import FifthForm from './step/ISSUE.D5'
import SixthForm from './step/ISSUE.D6'
import SeventhForm from './step/ISSUE.D7'
import EighthForm from './step/ISSUE.D8'

export default {
  name: 'Detail',
  components: { FirstForm, SecondForm, ThirdForm, ForthForm, FifthForm, SixthForm, SeventhForm, EighthForm },
  data() {
    return {
      tabPosition: 'left',
      activeName: 'D1',
      issueId: null,
      issue: {},
      status: {},
      isFirst: false,
      isSecond: false,
      isThird: false,
      isForth: false,
      isFifth: false,
      isSixth: false,
      isSeventh: false,
      isEighth: false,

      d1Status: false,
      d2Status: false,
      d3Status: false,
      d4Status: false,
      d5Status: false,
      d6Status: false,
      d7Status: false,
      d8Status: false,

      isSpecial: false,

      headerContent: '系统8D',

      initFishData: null
    }
  },
  created: function() {
    if (this.$route.query.issueId !== undefined) {
      this.issueId = this.$route.query.issueId
      this.getTimeManagementByIssueId(this.$route.query.issueId)
      this.getIssueInfoById(this.$route.query.issueId)
    }
  },
  methods: {
    // 获取问题信息
    getIssueInfoById(id) {
      getIssueById(id).then(res => {
        if (validIsNotNull(res.specialEvent)) {
          this.isSpecial = true
          this.headerContent = res.specialEvent
        }
      })
    },
    // 返回上一页
    goBack() {
      window.history.back()
    },
    back() {
      this.$confirm('回到问题列表？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Yes 回到列表',
        cancelButtonText: 'Wait 再看看'
      })
        .then(() => {
          window.history.back()
        })
    },
    // 监控附件组件相关改动
    getMsgFormFirstSon(msg) {
      this.d1Status = msg
      this.d2Status = false
      this.d3Status = false
      this.d4Status = false
      this.d5Status = false
      this.d6Status = false
      this.d7Status = false
      this.d8Status = false
    },
    getMsgFormSecSon(msg) {
      this.d2Status = msg
      this.d3Status = false
      this.d4Status = false
      this.d5Status = false
      this.d6Status = false
      this.d7Status = false
      this.d8Status = false
    },
    getMsgFormThirdSon(msg) {
      this.d3Status = msg
      this.d4Status = false
      this.d5Status = false
      this.d6Status = false
      this.d7Status = false
      this.d8Status = false
    },
    getMsgFormForthSon(msg) {
      this.d4Status = msg
      this.d5Status = false
      this.d6Status = false
      this.d7Status = false
      this.d8Status = false
    },
    getSpecialMsgSon(msg) {
      this.isSpecial = msg
    },
    getMsgFormFifthSon(msg) {
      this.d5Status = msg
      this.d6Status = false
      this.d7Status = false
      this.d8Status = false
    },
    getMsgFormSixthSon(msg) {
      this.d6Status = msg
      this.d7Status = false
      this.d8Status = false
    },
    getMsgFormSeventhSon(msg) {
      this.d7Status = msg
      this.d8Status = false
    },
    getMsgFormEighthSon(msg) {
      this.d8Status = msg
    },
    // 判断当前待处理的首个步骤
    getTimeManagementByIssueId(id) {
      getByIssueId(id).then(res => {
        this.d1Status = res.d1Status
        this.d2Status = res.d2Status
        this.d3Status = res.d3Status
        this.d4Status = res.d4Status
        this.d5Status = res.d5Status
        this.d6Status = res.d6Status
        this.d7Status = res.d7Status
        this.d8Status = res.d8Status
      })
    },
    handleClick(tab, event) {
      // 如此，可以实现实施刷新
      console.log(tab, event)
      if (tab.name === 'D1') {
        this.isFirst = true
        this.isSecond = false
        this.isThird = false
        this.isForth = false
        this.isFifth = false
        this.isSixth = false
        this.isSeventh = false
        this.isEighth = false
      } else if (tab.name === 'D2') {
        this.isFirst = false
        this.isSecond = true
        this.isThird = false
        this.isForth = false
        this.isFifth = false
        this.isSixth = false
        this.isSeventh = false
        this.isEighth = false
      } else if (tab.name === 'D3') {
        this.isFirst = false
        this.isSecond = false
        this.isThird = true
        this.isForth = false
        this.isFifth = false
        this.isSixth = false
        this.isSeventh = false
        this.isEighth = false
      } else if (tab.name === 'D4') {
        this.isFirst = false
        this.isSecond = false
        this.isThird = false
        this.isForth = true
        this.isFifth = false
        this.isSixth = false
        this.isSeventh = false
        this.isEighth = false
      } else if (tab.name === 'D5') {
        this.isFirst = false
        this.isSecond = false
        this.isThird = false
        this.isForth = false
        this.isFifth = true
        this.isSixth = false
        this.isSeventh = false
        this.isEighth = false
      } else if (tab.name === 'D6') {
        this.isFirst = false
        this.isSecond = false
        this.isThird = false
        this.isForth = false
        this.isFifth = false
        this.isSixth = true
        this.isSeventh = false
        this.isEighth = false
      } else if (tab.name === 'D7') {
        this.isFirst = false
        this.isSecond = false
        this.isThird = false
        this.isForth = false
        this.isFifth = false
        this.isSixth = false
        this.isSeventh = true
        this.isEighth = false
      } else if (tab.name === 'D8') {
        this.isFirst = true
        this.isSecond = false
        this.isThird = false
        this.isForth = false
        this.isFifth = false
        this.isSixth = false
        this.isSeventh = false
        this.isEighth = true
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin-bottom: 5px;
}
</style>
