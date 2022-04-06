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
            <span v-if="!isNeed">{{transNullFormat(conclusion.leaderConclusion)}}</span>
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
            <span style="display: block;" v-if="!isNeed">{{transNullFormat(conclusion.managerConclusion)}}</span>
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
            <span v-if="!isNeed">{{transNullFormat(conclusion.otherConclusion)}}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--关闭-->
    <el-card v-if="this.form.hasScore" class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">关闭</span>
        <el-button v-if="isNeed"  style="float: right; padding: 3px 0" type="text" @click="saveScore(form)">保存</el-button>
      </div>
      <div>
        <div class="demo-input-suffix">
          分数：
          <el-input-number
            v-if="isNeed"
            v-model="form.score"
            style="width: 200px;"
            :step="1"
            :min="0"
            :max="100"
            @input="scoreChange"
          ></el-input-number>
          <span v-if="!isNeed">{{transNullFormat(form.score)}}</span>
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
import { edit, getIssueById } from '@/api/tools/issue'
import { editConclusion, getConclusionByIssueId } from '@/api/tools/issueConclusion'
import { judgeIsEqual, validIsNotNull } from '@/utils/validationUtil'

export default {
  name: 'SeventhForm',
  props: ['issueId', 'needConfirm'],
  dicts: ['common_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'd:management'],
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
      noChanged: true
    }
  },
  created() {

  },
  mounted: function() {
    this.isNeed = this.$props.needConfirm === undefined ? true : this.$props.needConfirm
    this.getIssueInfoById(this.$props.issueId)
    this.getIssueConclusionByIssueId(this.$props.issueId)
    this.getTimeManagementByIssueId(this.$props.issueId)
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
    saveConclusion(data) {
      this.$refs.conclusionForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          let val = true
          if(judgeIsEqual(data.leaderConclusion, this.oldLeaderDesc) &&
            judgeIsEqual(data.managerConclusion, this.oldManageDesc) &&
            judgeIsEqual(data.otherConclusion, this.oldOtherDesc)
          ){
            this.$message({
              message: 'Submit invalid! 各项意见没有变更，无需重复提交!',
              type: 'warning'
            })
            val = false
          }
          if(val){
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
    transNullFormat(val){
      if (val === '' || val === undefined || val === null) {
        return '--'
      } else {
        return val
      }
    },
    saveScore(form) {
      edit(form).then(res => {
        // 编辑问题，添加8D分数
        this.$message({
          message: 'Submit Score Success! 分数更新完成!',
          type: 'success'
        })
        this.isFinished = false
        this.oldScore =  form.score
        this.scoreChanged = false
        this.judgeChange()
        this.$emit('func', this.isFinished)
      })
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
      this.noChanged = !(this.leaderDescChanged || this.manageDescChanged || this.otherDescChanged || this.scoreChanged)
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
        if (this.scoreChanged) {
          msg += '【8D评分】'
        }
        msg += '发生了变化，是否一并保存?'
        this.$confirm(msg, '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        })
          .then(() => {
            if(this.leaderDescChanged || this.manageDescChanged || this.otherDescChanged){
              this.saveConclusion(this.conclusion)
            }
            // 保存8D分数
            edit(this.form).then(res => {
              this.oldScore =  this.form.score
              this.scoreChanged = false
              this.judgeChange()
            }).catch(res => {
              // 详细描述
              this.form.score = this.oldScore
            })
            setTimeout(() => {
              this.finishStep()
            }, 300)
          })
          .catch(() => {
            this.form.score = this.oldScore
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
        } else if (this.form.hasScore && !validIsNotNull(this.form.score)) {
          this.$message({
            message: 'Cannot submit! 提交前请给8D打个分',
            type: 'warning'
          })
          this.confirmVisible = false
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
