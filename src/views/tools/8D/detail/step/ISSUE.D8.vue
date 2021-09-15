<template>
  <div>

    <!--各方意见描述-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">各方意见</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="saveConclusion(conclusion)">
          保存
        </el-button>
      </div>
      <div>
        <el-form
          ref="conclusionForm"
          :rules="conclusionRules"
          :inline="true"
          :model="conclusion"
          class="demo-form-inline"
          label-width="120px"
        >
          <el-form-item
            prop="leaderConclusion"
            label="组长意见"
          >
            <el-input
              v-if="isNeed"
              type="textarea"
              :rows="3"
              v-model="conclusion.leaderConclusion"
              style="min-width: 800px;"
              :disabled="!isNeed"
              @input="leaderInputChange"
            />
            <span v-if="!isNeed">{{ transNullFormat(conclusion.leaderConclusion) }}</span>
          </el-form-item>
          <el-form-item
            prop="managerConclusion"
            label="管理层意见"
          >
            <el-input
              v-if="isNeed"
              type="textarea"
              :rows="3"
              v-model="conclusion.managerConclusion"
              style="min-width: 800px;"
              :disabled="!isNeed"
              @input="managerInputChange"
            />
            <span style="display: block;" v-if="!isNeed">{{ transNullFormat(conclusion.managerConclusion) }}</span>
          </el-form-item>
          <el-form-item
            prop="otherConclusion"
            label="其他部门意见"
          >
            <el-input
              v-if="isNeed"
              type="textarea"
              :rows="3"
              v-model="conclusion.otherConclusion"
              style="min-width: 800px;"
              :disabled="!isNeed"
              @input="otherInputChange"
            />
            <span v-if="!isNeed">{{ transNullFormat(conclusion.otherConclusion) }}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--关闭-->
    <el-card v-if="this.form.hasScore" class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">8D评分</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="saveScore(issueScores)">保存
        </el-button>
      </div>
      <div>
        <el-table
          ref="table"
          v-loading="scoreLoading"
          :data="issueScores"
          style="width: 100%;"
        >
          <el-table-column prop="name" label="D#" width="60"/>
          <el-table-column prop="content" label="步骤" width="200"/>
          <el-table-column prop="" label="分数分布">
            <el-table-column label="不合格" show-overflow-tooltip min-width="120">
              <template scope="scope">
                <el-col :span="2">
                  <el-checkbox
                    v-model="scope.row.unqualified"
                    style="margin: 10px 10px 0 10px;"
                    :disabled="!isNeed || scope.row.unqualified"
                    @change="unqualifiedChange(scope.$index,scope.row)"
                  />
                </el-col>
                <el-col :offset="3" :span="4">
                  <div style="display: inline-block" v-if="scope.$index === 0">
                    <span> - 未任命负责人<br> - 无经理</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 1">
                    <span> - 不完整的描述<br> - 无数据</span>
                  </div>
                  <div style="display: inline-block;margin-top: 10px;" v-if="scope.$index === 2">
                    <span> - 无实际遏制措施</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 3">
                    <span> - 无5Why分析<br> - 无因果图分析</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 4">
                    <span> - 无5Why分析<br> - 无因果图分析</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 5">
                    <span> - 浅显的描述<br> - 无有效的估计</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 6">
                    <span> - 浅显的描述<br> - 无有效的估计</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 7">
                    <span> - 复制D5<br> - 无有效的验证</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 8">
                    <span> - 复制D5<br> - 无有效的验证</span>
                  </div>
                  <div style="display: inline-block;margin-top: 10px;" v-if="scope.$index === 9">
                    <span> - 浅显/无效的行动</span>
                  </div>
                  <div style="display: inline-block;margin-top: 10px;" v-if="scope.$index === 10">
                    <span> - 复制和粘贴语句</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 11">
                    <span> - 不好的陈述<br> - 不易理解</span>
                  </div>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column label="合格（最低要求）" show-overflow-tooltip min-width="120">
              <template scope="scope">
                <el-col :span="2">
                  <el-checkbox
                    v-model="scope.row.qualified"
                    style="margin: 10px 10px 0 10px;"
                    :disabled="!isNeed || scope.row.qualified"
                    @change="qualifiedChange(scope.$index,scope.row)"
                  />
                </el-col>
                <el-col :offset="3" :span="4">
                  <div style="display: inline-block" v-if="scope.$index === 0">
                    <span> - 任命了负责人<br> - 不仅仅是质量部门<br> - 团队中有经理</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 1">
                    <span> - 清晰完整的描述（零件号，<br>批次，生产日期，<br>质量问题编号，件数，工厂<br>/0公里/售后， ...）</span>
                  </div>
                  <div style="display: inline-block;margin-top: 10px;" v-if="scope.$index === 2">
                    <span> - 可追溯性分析<br> - 批次封存（供应商处，在Conti处）<br> 及时的防火墙</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 3">
                    <span> - 结果的5Why分析<br> - 结果的果图分析<br> - 实际/物理验证</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 4">
                    <span> - 结果的5Why分析<br> - 结果的果图分析<br> - 所有可能性分析</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 5">
                    <span> - 清晰的纠正措施<br> - 详细的行动计划 (日期 ,负责人)<br> - 有效的估计</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 6">
                    <span> - 清晰的纠正措施<br> - 详细的行动计划 (日期 ,负责人)<br> - 有效的估计</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 7">
                    <span> - 有实施计划<br> - 有效的验证<br> - 首批鉴定</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 8">
                    <span> - 有实施计划<br> - 有效的验证</span>
                  </div>
                  <div style="display: inline-block;" v-if="scope.$index === 9">
                    <span> - 正式的书面经验教训<br> - 文档变更<br> - 其他生产线、产品、工厂</span>
                  </div>
                  <div style="display: inline-block;" v-if="scope.$index === 10">
                    <span> - 负责人签署<br> - 负责经理签署</span>
                  </div>
                  <div style="display: inline-block;margin-top: 10px;" v-if="scope.$index === 11">
                    <span> - 8D版本更进（更新日期，内容，...）</span>
                  </div>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column label="额外加分" show-overflow-tooltip min-width="120">
              <template scope="scope">
                <el-col :span="2">
                  <el-checkbox
                    v-model="scope.row.additional"
                    style="margin: 10px 10px 0 10px;"
                    :disabled="!isNeed || scope.row.additional"
                    @change="additionalChange(scope.$index,scope.row)"
                  />
                </el-col>
                <el-col :offset="3" :span="4">
                  <div style="display: inline-block" v-if="scope.$index === 0">
                    <span> - 清晰的职责描述<br> - 所有参与者的联系电话</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 1">
                    <span> - 图片<br> - 测量<br> - 测试结果</span>
                  </div>
                  <div style="display: inline-block;margin-top: 10px;" v-if="scope.$index === 2">
                    <span> - 检查了防火墙的有效性<br> - 供应商在现场组织了分选 <br> - 可靠批次的识别</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 3">
                    <span> - 附加问题解决方法应用（是/不是...）<br> - 有效的风险分析</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 4">
                    <span> - 附加问题解决方法应用（是/不是...）<br> - 有效的风险分析</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 5">
                    <span> - 可能的副作用分析 <br> - 图片</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 6">
                    <span> - 可能的副作用分析 <br> - 图片</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 7">
                    <span> - 有效的后续行动（SLC）<br> - 支持性文档，图表，...</span>
                  </div>
                  <div style="display: inline-block" v-if="scope.$index === 8">
                    <span> - 有效的后续行动（SLC）<br> - 支持性文档，图表，...<br> - 首批鉴定</span>
                  </div>
                  <div style="display: inline-block;" v-if="scope.$index === 9">
                    <span> - 附上措施的证据（文件...)<br> - 分析了措施的影响（FMEA）</span>
                  </div>
                  <div style="display: inline-block;" v-if="scope.$index === 10">
                    <span> - 其他经理签署（生产、物流...）<br> - 相关的管理意见</span>
                  </div>
                  <div style="display: inline-block;" v-if="scope.$index === 11">
                    <span> - 容易理解 <br> - 结果的附件</span>
                  </div>
                </el-col>
                <!--              @change="shouldDetectedChange(scope.$index,scope.row.shouldDetected)"-->
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="分数" :formatter="scoreFormat"/>
        </el-table>
        <div style="margin: 10px 0 0 8px;">
          <b>总分：</b>
          <!--          <el-input-number
                      v-if="isNeed"
                      v-model="form.score"
                      style="width: 200px;"
                      :step="1"
                      :min="0"
                      :max="100"
                      @input="scoreChange"
                    ></el-input-number>-->
          <!--          <span v-if="!isNeed">{{ transNullFormat(form.score) }}</span>-->
          <span>{{ transNullFormat(form.score) }}</span>
        </div>
      </div>
    </el-card>

    <!--确认完成-->
    <el-card v-if="isNeed" class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">确认完成</span>
      </div>
      <div>
        <el-row>
          <el-col :span="6">
            确认完成当前步骤：
            <el-popover
              placement="top"
              width="300"
              v-model="confirmVisible"
            >
              <p>您确定所有信息都已填写完毕，此步骤已完成吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="confirmVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="confirmFinished">确定</el-button>
              </div>
              <el-button
                slot="reference"
                :loading="selfLoading"
                v-permission="permission.edit"
                type="success"
                :disabled="isFinished && noChanged"
                icon="el-icon-check"
              >确认完成
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
        <el-row v-if="form.closeTime !==undefined && isFinished && noChanged">
          <span>&emsp;关闭时间：{{ form.closeTime }}</span>
        </el-row>
      </div>
    </el-card>

  </div>
</template>

<script>

import { editTimeManage, getByIssueId } from '@/api/tools/timeManagement'
import { getIssueById } from '@/api/tools/issue'
import { editConclusion, getConclusionByIssueId } from '@/api/tools/issueConclusion'
import { judgeIsEqual, validIsNotNull } from '@/utils/validationUtil'
import { editIssueScores, getScoresByIssueId } from '@/api/tools/issueScore'

export default {
  name: 'SeventhForm',
  props: ['issueId', 'needConfirm'],
  dicts: ['common_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      form: {},
      conclusion: {
        leaderConclusion: null,
        managerConclusion: null,
        otherConclusion: null
      },
      conclusionRules: {
        leaderConclusion: [
          { required: true, message: '组件意见不可为空', trigger: 'blur' }
        ],
        managerConclusion: [
          { required: true, message: '管理层意见不可为空', trigger: 'blur' }
        ]
      },
      isNeed: true,
      confirmVisible: false,
      curStep: 'd8Status',
      curTime: 'd8Time',
      timeManagement: {},
      selfLoading: false,
      isFinished: false,
      oldLeaderDesc: null,
      leaderDescChanged: false,
      oldManageDesc: null,
      manageDescChanged: false,
      oldOtherDesc: null,
      otherDescChanged: false,
      oldScore: null,
      scoreChanged: false,
      noChanged: true,
      issueScores: [],
      scoreLoading: false,

      oldUnq1: null,
      oldQual1: null,
      oldAdd1: null,

      oldUnq2: null,
      oldQual2: null,
      oldAdd2: null,

      oldUnq3: null,
      oldQual3: null,
      oldAdd3: null,

      oldUnq4: null,
      oldQual4: null,
      oldAdd4: null,

      oldUnq5: null,
      oldQual5: null,
      oldAdd5: null,

      oldUnq6: null,
      oldQual6: null,
      oldAdd6: null,

      oldUnq7: null,
      oldQual7: null,
      oldAdd7: null,

      oldUnq8: null,
      oldQual8: null,
      oldAdd8: null,

      oldUnq9: null,
      oldQual9: null,
      oldAdd9: null,

      oldUnq10: null,
      oldQual10: null,
      oldAdd10: null,

      oldUnq11: null,
      oldQual11: null,
      oldAdd11: null,

      oldUnq12: null,
      oldQual12: null,
      oldAdd12: null,

      oldUnqX: null,
      oldQualX: null,
      oldAddX: null,

      unqualifiedChanged: false,
      qualifiedChanged: false,
      additionalChanged: false,
      scoreScopeChanged: false
    }
  },
  created() {

  },
  mounted: function() {
    this.isNeed = this.$props.needConfirm === undefined ? true : this.$props.needConfirm
    this.getIssueInfoById(this.$props.issueId)
    this.getIssueConclusionByIssueId(this.$props.issueId)
    this.getTimeManagementByIssueId(this.$props.issueId)
    this.getIssueScoreByIssueId(this.$props.issueId)
  },
  methods: {
    // 获取问题信息
    getIssueInfoById(id) {
      getIssueById(id).then(res => {
        this.form = res
        this.oldScore = res.score
      })
    },
    // 获取时间进程
    getTimeManagementByIssueId(id) {
      this.selfLoading = true
      getByIssueId(id).then(res => {
        if (res.d8Status) {
          this.isFinished = true
        }
        this.timeManagement = res
        this.selfLoading = false
      })
    },
    // 查询各方意见
    getIssueConclusionByIssueId(id) {
      getConclusionByIssueId(id).then(res => {
        this.conclusion = res
        this.oldLeaderDesc = res.leaderConclusion
        this.oldManageDesc = res.managerConclusion
        this.oldOtherDesc = res.otherConclusion
      })
    },
    // 获取8D分数分布
    getIssueScoreByIssueId(id) {
      this.scoreLoading = true
      this.issueScores = []
      getScoresByIssueId(id).then(res => {
        this.issueScores = res
        if (res.length > 0) {
          this.oldUnq1 = res[0].unqualified
          this.oldQual1 = res[0].qualified
          this.oldAdd1 = res[0].additional

          this.oldUnq2 = res[1].unqualified
          this.oldQual2 = res[1].qualified
          this.oldAdd2 = res[1].additional

          this.oldUnq3 = res[2].unqualified
          this.oldQual3 = res[2].qualified
          this.oldAdd3 = res[2].additional

          this.oldUnq4 = res[3].unqualified
          this.oldQual4 = res[3].qualified
          this.oldAdd4 = res[3].additional

          this.oldUnq5 = res[4].unqualified
          this.oldQual5 = res[4].qualified
          this.oldAdd5 = res[4].additional

          this.oldUnq6 = res[5].unqualified
          this.oldQual6 = res[5].qualified
          this.oldAdd6 = res[5].additional

          this.oldUnq7 = res[6].unqualified
          this.oldQual7 = res[6].qualified
          this.oldAdd7 = res[6].additional

          this.oldUnq8 = res[7].unqualified
          this.oldQual8 = res[7].qualified
          this.oldAdd8 = res[7].additional

          this.oldUnq9 = res[8].unqualified
          this.oldQual9 = res[8].qualified
          this.oldAdd9 = res[8].additional

          this.oldUnq10 = res[9].unqualified
          this.oldQual10 = res[9].qualified
          this.oldAdd10 = res[9].additional

          this.oldUnq11 = res[10].unqualified
          this.oldQual11 = res[10].qualified
          this.oldAdd11 = res[10].additional

          this.oldUnq12 = res[11].unqualified
          this.oldQual12 = res[11].qualified
          this.oldAdd12 = res[11].additional
        }
        this.scoreLoading = false
      })
    },
    judgeIndex(index) {
      if (index === 0) {
        this.oldUnqX = this.oldUnq1
        this.oldQualX = this.oldQual1
        this.oldAddX = this.oldAdd1
      }
      if (index === 1) {
        this.oldUnqX = this.oldUnq2
        this.oldQualX = this.oldQual2
        this.oldAddX = this.oldAdd2
      }
      if (index === 2) {
        this.oldUnqX = this.oldUnq3
        this.oldQualX = this.oldQual3
        this.oldAddX = this.oldAdd3
      }
      if (index === 3) {
        this.oldUnqX = this.oldUnq4
        this.oldQualX = this.oldQual4
        this.oldAddX = this.oldAdd4
      }
      if (index === 4) {
        this.oldUnqX = this.oldUnq5
        this.oldQualX = this.oldQual5
        this.oldAddX = this.oldAdd5
      }
      if (index === 5) {
        this.oldUnqX = this.oldUnq6
        this.oldQualX = this.oldQual6
        this.oldAddX = this.oldAdd6
      }
      if (index === 6) {
        this.oldUnqX = this.oldUnq7
        this.oldQualX = this.oldQual7
        this.oldAddX = this.oldAdd7
      }
      if (index === 7) {
        this.oldUnqX = this.oldUnq8
        this.oldQualX = this.oldQual8
        this.oldAddX = this.oldAdd8
      }
      if (index === 8) {
        this.oldUnqX = this.oldUnq9
        this.oldQualX = this.oldQual9
        this.oldAddX = this.oldAdd9
      }
      if (index === 9) {
        this.oldUnqX = this.oldUnq10
        this.oldQualX = this.oldQual10
        this.oldAddX = this.oldAdd10
      }
      if (index === 10) {
        this.oldUnqX = this.oldUnq11
        this.oldQualX = this.oldQual11
        this.oldAddX = this.oldAdd11
      }
      if (index === 11) {
        this.oldUnqX = this.oldUnq12
        this.oldQualX = this.oldQual12
        this.oldAddX = this.oldAdd12
      }
    },
    // 不合格变化
    unqualifiedChange(index, row) {
      if (row.unqualified) {
        row.qualified = false
        row.additional = false
      }
      // 检测变化实时更新8D分数，不合格被激活则前数值为“合格”或者“额外加分”，该项直接置为0
      this.form.score = this.form.score - row.score
      this.judgeIndex(index)
      this.scoreScopeChanged = this.oldQualX !== row.qualified || this.oldAddX !== row.additional || this.oldUnqX !== row.unqualified
      this.judgeChange()
    },
    // 合格变化
    qualifiedChange(index, row) {
      if (row.qualified) {
        row.unqualified = false
        row.additional = false
      }
      // 检测变化实时更新8D分数，合格被激活则前数值为“不合格”或者“额外加分”
      if (row.score === 0 && row.scoreType === 'THREE') {
        this.form.score = this.form.score + 1
      } else if (row.score === 0 && row.scoreType === 'FIVE') {
        this.form.score = this.form.score + 4
      } else if (row.score === 0 && row.scoreType === 'SEVEN') {
        this.form.score = this.form.score + 5
      } else if (row.score === 0 && row.scoreType === 'TEN') {
        this.form.score = this.form.score + 7
      } else if (row.score === 3 && row.scoreType === 'THREE') {
        this.form.score = this.form.score - 2
      } else if (row.score === 5 && row.scoreType === 'FIVE') {
        this.form.score = this.form.score - 1
      } else if (row.score === 7 && row.scoreType === 'SEVEN') {
        this.form.score = this.form.score - 2
      } else if (row.score === 10 && row.scoreType === 'TEN') {
        this.form.score = this.form.score - 3
      }
      this.judgeIndex(index)
      this.scoreScopeChanged = this.oldQualX !== row.qualified || this.oldAddX !== row.additional || this.oldUnqX !== row.unqualified
      this.judgeChange()
    },
    // 额外加分变化
    additionalChange(index, row) {
      if (row.additional) {
        row.unqualified = false
        row.qualified = false
      }
      // 检测变化实时更新8D分数，额外加分被激活则前数值为“不合格”或者“合格”
      if (row.score === 0 && row.scoreType === 'THREE') {
        this.form.score = this.form.score + 3
      } else if (row.score === 0 && row.scoreType === 'FIVE') {
        this.form.score = this.form.score + 5
      } else if (row.score === 0 && row.scoreType === 'SEVEN') {
        this.form.score = this.form.score + 7
      } else if (row.score === 0 && row.scoreType === 'TEN') {
        this.form.score = this.form.score + 10
      } else if (row.score === 1 && row.scoreType === 'THREE') {
        this.form.score = this.form.score + 2
      } else if (row.score === 4 && row.scoreType === 'FIVE') {
        this.form.score = this.form.score + 1
      } else if (row.score === 5 && row.scoreType === 'SEVEN') {
        this.form.score = this.form.score + 2
      } else if (row.score === 7 && row.scoreType === 'TEN') {
        this.form.score = this.form.score + 3
      }
      this.judgeIndex(index)
      this.scoreScopeChanged = this.oldQualX !== row.qualified || this.oldAddX !== row.additional || this.oldUnqX !== row.unqualified
      this.judgeChange()
    },
    // 打分格式
    scoreFormat(row, col) {
      if (row.scoreType === 'THREE') {
        if (row.unqualified) {
          row.score = 0
          return '0/3'
        } else if (row.qualified) {
          row.score = 1
          return '1/3'
        } else if (row.additional) {
          row.score = 3
          return '3/3'
        }

      } else if (row.scoreType === 'FIVE') {
        if (row.unqualified) {
          row.score = 0
          return '0/5'
        } else if (row.qualified) {
          row.score = 4
          return '4/5'
        } else if (row.additional) {
          row.score = 5
          return '5/5'
        }
      } else if (row.scoreType === 'SEVEN') {
        if (row.unqualified) {
          row.score = 0
          return '0/7'
        } else if (row.qualified) {
          row.score = 5
          return '5/7'
        } else if (row.additional) {
          row.score = 7
          return '7/7'
        }
      } else if (row.scoreType === 'TEN') {
        if (row.unqualified) {
          row.score = 0
          return '0/10'
        } else if (row.qualified) {
          row.score = 7
          return '7/10'
        } else if (row.additional) {
          row.score = 10
          return '10/10'
        }
      }
    },
    rowChange(index, val) {
      alert(index)
    },
    saveConclusion(data) {
      this.$refs.conclusionForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          let val = true
          if (judgeIsEqual(data.leaderConclusion, this.oldLeaderDesc) &&
            judgeIsEqual(data.managerConclusion, this.oldManageDesc) &&
            judgeIsEqual(data.otherConclusion, this.oldOtherDesc)
          ) {
            this.$message({
              message: 'Submit invalid! 各项意见没有变更，无需重复提交!',
              type: 'warning'
            })
            val = false
          }
          if (val) {
            editConclusion(data).then(res => {
              // 编辑问题，添加供应商详细描述
              this.$message({
                message: 'Submit Conclusion Success! 添加各项意见完成!',
                type: 'success'
              })
              this.oldLeaderDesc = data.leaderConclusion
              this.oldManageDesc = data.managerConclusion
              this.oldOtherDesc = data.otherConclusion
              this.isFinished = false
              this.leaderDescChanged = false
              this.manageDescChanged = false
              this.otherDescChanged = false
              this.judgeChange()
              this.$emit('func', this.isFinished)
              this.getIssueConclusionByIssueId(this.$props.issueId)
            }).catch(() => {
              this.getIssueConclusionByIssueId(this.$props.issueId)
            })
          }
        }
      })
    },
    transNullFormat(val) {
      if (val === '' || val === undefined || val === null) {
        return '--'
      } else {
        return val
      }
    },
    saveScore(scores) {
      if (this.scoreScopeChanged) {
        editIssueScores(scores).then(res => {
          this.$message({
            message: 'Save Score Record Success! 保存打分记录成功!',
            type: 'success'
          })
          // this.resetDefectChange()
          this.scoreScopeChanged = false
          this.isFinished = false
          this.judgeChange()
          this.$emit('func', this.isFinished)
          this.getIssueScoreByIssueId(this.$props.issueId)
          this.getIssueInfoById(this.$props.issueId)
        }).catch(() => {
          this.$message({
            message: 'Save Score Record Failed! 保存打分记录失败!',
            type: 'error'
          })
          this.getIssueScoreByIssueId(this.$props.issueId)
          this.getIssueInfoById(this.$props.issueId)
        })
      } else {
        this.$message({
          message: 'No Data change! 分数分布未发生改动，无需重复保存!',
          type: 'warning'
        })
        return false
      }

    },
    leaderInputChange(val) {
      this.leaderDescChanged = !judgeIsEqual(val, this.oldLeaderDesc)
      this.judgeChange()
    },
    managerInputChange(val) {
      this.manageDescChanged = !judgeIsEqual(val, this.oldManageDesc)
      this.judgeChange()
    },
    otherInputChange(val) {
      this.otherDescChanged = !judgeIsEqual(val, this.oldOtherDesc)
      this.judgeChange()
    },
    scoreChange(val) {
      this.scoreChanged = !judgeIsEqual(val, this.oldScore)
      this.judgeChange()
    },
    judgeChange() {
      this.noChanged = !(this.leaderDescChanged || this.manageDescChanged ||
        this.otherDescChanged || this.scoreChanged || this.scoreScopeChanged
      )
    },
    confirmFinished() {
      if (!this.noChanged) {
        let msg = '检测到'
        if (this.leaderDescChanged) {
          msg += '【组长意见】'
        }
        if (this.manageDescChanged) {
          msg += '【管理层意见】'
        }
        if (this.otherDescChanged) {
          msg += '【其他部门意见】'
        }
        if (this.scoreScopeChanged) {
          msg += '【8D评分-分数分布】,确认后将重新打分'
        }
        msg += '发生了变化，是否一并保存?'
        this.$confirm(msg, '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        })
          .then(() => {
            if (this.leaderDescChanged || this.manageDescChanged || this.otherDescChanged) {
              this.saveConclusion(this.conclusion)
            }
            // 保存8D分数分布
            if (this.scoreScopeChanged) {
              this.saveScore(this.issueScores)
              setTimeout(() => {
                this.finishStep()
              }, 300)
            }
          })
          .catch(() => {
            this.getIssueInfoById(this.$props.issueId)
            this.getIssueScoreByIssueId(this.$props.issueId)
            // this.form.score = this.oldScore
            this.conclusion.leaderConclusion = this.oldLeaderDesc
            this.conclusion.managerConclusion = this.oldManageDesc
            this.conclusion.otherConclusion = this.oldOtherDesc
            this.finishStep()
          })
      } else {
        this.finishStep()
      }
    },
    finishStep() {
      // 确认D8完成
      this.timeManagement.curStep = 'D8'
      this.timeManagement.d8Status = true
      this.timeManagement.d8Time = new Date()
      if (!this.timeManagement.d7Status && !validIsNotNull(this.form.specialEvent)) {
        this.$message({
          message: 'Cannot submit! 上一步尚未完成，无法执行此操作!',
          type: 'warning'
        })
      } else if (validIsNotNull(this.form.specialEvent) && !this.timeManagement.d4Status) {
        this.$message({
          message: 'Cannot submit! D4尚未完成，无法执行此特殊事件的完结操作!',
          type: 'warning'
        })
      } else {
        // 上一步已完成方可执行
        // 验证各方是否完成结论填写
        let val = true
        if (!validIsNotNull(this.conclusion.leaderConclusion)) {
          this.$message({
            message: 'Cannot submit! 组长意见为空，不可提交8D!',
            type: 'warning'
          })
          val = false
        } else if (!validIsNotNull(this.conclusion.managerConclusion)) {
          this.$message({
            message: 'Cannot submit! 管理层意见为空，不可提交8D!',
            type: 'warning'
          })
          val = false
        }
        if (val) {
          editTimeManage(this.timeManagement).then(res => {
            this.confirmVisible = false
            this.isFinished = true
            this.noChanged = true
            this.getIssueInfoById(this.$props.issueId)
            this.$emit('func', this.isFinished)
            this.$message({
              message: 'Submit Success! D8提交完成!',
              type: 'success'
            })
          }).catch(res => {

          })
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin-bottom: 5px;
}

.elRow {
  border-bottom: 1px solid #808080;
}

.el-form-item--small.el-form-item {
  margin-bottom: 15px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}
</style>
