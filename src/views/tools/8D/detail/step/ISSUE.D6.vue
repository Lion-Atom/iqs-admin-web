<template>
  <div>
    <!--编辑改善行动-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">纠正措施</span>
      </div>
      <div>
        <el-dialog
          title="编辑改善行动"
          :visible.sync="correctActionVisible"
          width="600px"
          :before-close="handleClose"
        >
          <el-form
            ref="correctActionForm"
            :model="correctActionForm"
            :rules="correctActionRules"
            size="small"
            label-width="120px"
          >
            <el-form-item
              label="改善行动"
              prop="name"
            >
              <el-input
                v-model="correctActionForm.name"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="有效性(%)"
              prop="efficiency"
            >
              <el-input-number
                v-model="correctActionForm.efficiency"
                style="width: 370px;"
                :precision="2"
                :step="0.1"
                :max="100"
              />
            </el-form-item>
            <!--- 负责人列表查询 -->
            <el-form-item
              label="负责人"
              prop="responsibleId"
            >
              <el-select
                v-model="correctActionForm.responsibleId"
                placeholder="请选择人员"
                style="width: 370px;"
              >
                <el-option
                  v-for="item in members"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="预期时间"
              prop="plannedTime"
            >
              <el-date-picker
                v-model="correctActionForm.plannedTime"
                type="datetime"
                style="width: 370px;"
                placeholder="选择日期时间"
                default-time="12:00:00"
              />
            </el-form-item>
            <el-form-item
              label="完成时间"
              prop="completeTime"
            >
              <el-date-picker
                v-model="correctActionForm.completeTime"
                type="datetime"
                style="width: 370px;"
                placeholder="选择日期时间"
                default-time="12:00:00"
              />
            </el-form-item>
            <el-form-item
              label="标识"
              prop="identification"
            >
              <el-input
                v-model="correctActionForm.identification"
                style="width: 370px;"
              />
            </el-form-item>
            <!--状态-->
            <el-form-item
              label="状态"
              prop="status"
            >
              <el-select
                v-model="correctActionForm.status"
                placeholder="请选择状态"
                style="width: 370px;"
              >
                <el-option
                  v-for="item in statusTypeOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="测评方法"
              prop="correctiveMeasurementMethod"
            >
              <el-input
                v-model="correctActionForm.correctiveMeasurementMethod"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="测评结果"
              prop="correctiveEfficiencyResult"
            >
              <el-input
                v-model="correctActionForm.correctiveEfficiencyResult"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="评估日期"
              prop="evaluationTime"
            >
              <el-date-picker
                v-model="correctActionForm.evaluationTime"
                type="datetime"
                style="width: 370px;"
                placeholder="选择日期时间"
                default-time="12:00:00"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="doCancelCorrAct">取 消</el-button>
            <el-button type="primary" :loading="submitLoading" @click="submitCorrectAct">确 定</el-button>
          </span>
        </el-dialog>
        <el-table
          ref="table"
          v-loading="correctActLoading"
          :data="correctActions"
          style="width: 100%;"
        >
          <el-table-column prop="causeName" label="根本原因"/>
          <el-table-column prop="judgeResult" label="发生/检测"/>
          <el-table-column prop="name" label="改善行动"/>
          <el-table-column prop="validationMethod" label="确认方法" min-width="140"/>
          <el-table-column prop="validationResult" label="确认结果"/>
          <el-table-column prop="efficiency" label="有效性(%)"/>
          <el-table-column prop="responsibleName" label="负责人"/>
          <el-table-column prop="plannedTime" label="预定时间" width="140"/>
          <el-table-column prop="completeTime" label="完成时间" width="140"/>
          <el-table-column prop="identification" label="标识"/>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.status!== undefined"
                :type="scope.row.status === '已移除' ? 'danger' : 'success'"
                disable-transitions
              >{{ scope.row.status }}
              </el-tag>
              <span v-else>{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="correctiveMeasurementMethod" label="测评方法"/>
          <el-table-column prop="correctiveEfficiencyResult" label="测评结果"/>
          <el-table-column prop="evaluationTime" label="评估日期" width="140"/>
          <!--   编辑与删除   -->
          <el-table-column
            v-if="isNeed"
            label="操作"
            width="160px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <!--编辑-->
                <el-button
                  v-if="scope.row.id !==undefined"
                  slot="reference"
                  v-permission="permission.edit"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editCorrectAction(scope.row)"
                >纠正措施
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--移除行动-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">移除行动</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="addRemoveAct">新增移除行动
        </el-button>
      </div>
      <div>
        <el-dialog
          class="dialog"
          :title="removeActTitle"
          :visible.sync="removeActionVisible"
          width="600px"
          :before-close="handleClose"
        >
          <el-form
            ref="form"
            :model="removeActionForm"
            :rules="removeActionRules"
            size="small"
            label-width="120px"
          >
            <el-form-item
              label="改善行动"
              prop="name"
            >
              <span v-if="!isAdd">{{ removeActionForm.name }}</span>
              <el-select
                v-if="isAdd"
                v-model="removeActionForm.id"
                placeholder="请选择要移除的改善行动"
                style="width: 370px;"
              >
                <el-option
                  v-for="item in canBeRemoveActions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="%有效性"
              prop="efficiency"
            >
              <span v-if="!isAdd">{{ removeActionForm.efficiency }}</span>
              <span v-else>{{ removeActionForm.efficiency }}</span>
            </el-form-item>
            <!--- 负责人列表查询 -->
            <el-form-item
              label="负责人"
              prop="responsibleId"
            >
              <el-select
                v-model="removeActionForm.responsibleId"
                placeholder="请选择人员"
                style="width: 370px;"
                disabled
              >
                <el-option
                  v-for="item in members"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="!isAdd"
              label="移除时间"
              prop="removeTime"
            >
              <span>{{ removeActionForm.removeTime }}</span>
            </el-form-item>
            <el-form-item
              label="其他"
              prop="comment"
            >
              <el-input
                v-model="removeActionForm.comment"
                placeholder="请填写移除备注"
                type="textarea"
                :rows="3"
                style="width: 370px;"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="removeActionVisible = false">取 消</el-button>
            <el-button type="primary" :loading="submitRemoveActLoading" @click="submitRemoveAct">确 定</el-button>
          </span>
        </el-dialog>
        <el-table
          ref="table"
          v-loading="removeActLoading"
          :data="removeActions"
          style="width: 100%;"
        >
          <el-table-column prop="name" label="移除的改善行动"/>
          <el-table-column prop="comment" label="评论"/>
          <el-table-column prop="responsibleName" label="负责人"/>
          <el-table-column prop="removeTime" label="移除时间"/>
          <!--   编辑与删除   -->
          <el-table-column
            v-if="isNeed"
            label="操作"
            width="160px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <!--编辑-->
                <el-button
                  v-if="scope.row.id !==undefined"
                  slot="reference"
                  v-permission="permission.edit"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editRemoveAction(scope.row)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--详细描述-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">详细描述</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="addSixthDesc(form)">保存
        </el-button>
      </div>
      <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item
            prop="supplierDescription"
          >
            <el-input
              v-model="form.commentD6"
              type="textarea"
              :rows="3"
              style="min-width: 800px;"
              :disabled="!isNeed"
              @input="commentChange"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--添加附件及其列表-->
    <UploadFile
      :is-need="isNeed"
      :issue-id="this.$props.issueId"
      :permission="permission"
      :step-name="curStep"
      @func="getMsgFormSon"
    />

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
              v-model="confirmVisible"
              placement="top"
              width="300"
            >
              <p>您确定所有信息都已填写完毕，此步骤已完成吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="confirmVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="confirmFinished">确定</el-button>
              </div>
              <el-button
                slot="reference"
                v-permission="permission.edit"
                :loading="selfLoading"
                type="success"
                :disabled="isFinished && noChanged"
                icon="el-icon-check"
              >确认完成
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>

import { editTimeManage, getByIssueId } from '@/api/tools/timeManagement'
import { edit, getIssueById } from '@/api/tools/issue'
import UploadFile from '@/components/UploadFile'
import {
  editIssueAction,
  getCanRemoveActionByIssueId,
  getIssueActionByExample,
  getIssueActionById
} from '@/api/tools/issueAction'
import { getMembersByIssueId } from '@/api/tools/teamMember'
import { judgeIsEqual } from '@/utils/validationUtil'

export default {
  name: 'SixthForm',
  components: { UploadFile },
  props: ['issueId', 'needConfirm'],
  dicts: ['common_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      imCorrActions: [],
      imCorrActLoading: false,
      correctActionVisible: false,
      correctActionForm: {
        causeId: null,
        name: null,
        validationMethod: null,
        validationResult: null,
        efficiency: null,
        responsibleId: null,
        plannedTime: null,
        completeTime: null,
        identification: null,
        status: null,
        correctiveMeasurementMethod: null,
        correctiveEfficiencyResult: null,
        evaluationTime: null,
        removeTime: null,
        comment: null
      },
      correctActionRules: {
        name: [
          { required: true, message: '请输入改善行动标题', trigger: 'blur' }
        ],
        validationMethod: [
          { required: true, message: '请填写验证方法', trigger: 'blur' }
        ],
        validationResult: [
          { required: true, message: '请填写验证结果', trigger: 'blur' }
        ],
        efficiency: [
          { required: true, message: '请填写该行动有效性', trigger: 'blur' }
        ],
        responsibleId: [
          { required: true, message: '负责人不可不填', trigger: 'blur' }
        ],
        plannedTime: [
          { required: true, message: '请填写行动预期时间', trigger: 'blur' }
        ],
        completeTime: [
          { required: true, message: '请填写行动完成时间', trigger: 'blur' }
        ],
        identification: [
          { required: true, message: '若暂未定义标识，可填”暂无“等', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请填写措施状态', trigger: 'blur' }
        ],
        correctiveMeasurementMethod: [
          { required: true, message: '请填写测评方法', trigger: 'blur' }
        ],
        correctiveEfficiencyResult: [
          { required: true, message: '请填写测评结果', trigger: 'blur' }
        ],
        evaluationTime: [
          { required: true, message: '请填写评估时间', trigger: 'blur' }
        ]
      },
      confirmVisible: false,
      curStep: 'D6',
      form: {},
      timeManagement: {},
      selfLoading: false,
      members: [],
      queryCond: {
        issueId: null,
        isCon: false,
        type: 'D5',
        isImCorrectAct: true
      },
      queryRemoveCond: {
        issueId: null,
        isCon: false,
        type: 'D5',
        isImCorrectAct: true,
        status: '已移除'
      },
      submitLoading: false,
      correctActLoading: false,
      correctActions: [],
      removeActLoading: false,
      removeActions: [],
      statusTypeOptions: [
        { key: '进行中', display_name: '进行中' },
        { key: '完成', display_name: '完成' },
        { key: '已移除', display_name: '已移除' }
      ],
      isFinished: false,
      removeActionVisible: false,
      removeActTitle: '',
      isAdd: false,
      submitRemoveActLoading: false,
      removeActionForm: {
        name: null,
        efficiency: null,
        responsibleId: null,
        removeTime: null,
        comment: null
      },
      oldComment: null,
      commentChanged: false,
      noChanged: true,
      removeActionRules: {},
      canBeRemoveActions: [],
      isNeed: false
    }
  },
  watch: {
    // 监听removeActionForm.id
    'removeActionForm.id': 'currActionChange'
  },
  created() {

  },
  mounted: function() {
    this.isNeed = this.$props.needConfirm === undefined ? true : this.$props.needConfirm
    this.getIssueInfoById(this.$props.issueId)
    this.getTimeManagementByIssueId(this.$props.issueId)
    this.getCorrectActionByExample(this.$props.issueId)
    this.getTeamMembersByIssueId(this.$props.issueId)
    this.getRemoveActionByExample(this.$props.issueId)
    this.getCanBeRemoveAction(this.$props.issueId)
  },
  methods: {
    // 监控改善行动变化
    currActionChange(val) {
      if (val !== null || val !== undefined) {
        getIssueActionById(val).then(res => {
          this.removeActionForm = res
        })
      }
    },
    // 监控附件组件相关改动
    getMsgFormSon(msg) {
      this.isFinished = msg
      this.$emit('func', this.isFinished)
    },
    // 获取问题信息
    getIssueInfoById(id) {
      getIssueById(id).then(res => {
        this.form = res
        this.oldComment = res.commentD6
      })
    },
    // 获取时间进程
    getTimeManagementByIssueId(id) {
      this.selfLoading = true
      getByIssueId(id).then(res => {
        this.timeManagement = res
        if (res.d6Status) {
          this.isFinished = true
        }
        this.selfLoading = false
      })
    },
    // 获取人员信息
    getTeamMembersByIssueId(id) {
      getMembersByIssueId(id).then(res => {
        this.members = res.content
      })
    },
    // 获取验证措施信息
    getCorrectActionByExample(id) {
      this.correctActLoading = true
      this.correctActions = []
      this.queryCond.issueId = id
      getIssueActionByExample(this.queryCond).then(res => {
        this.correctActLoading = false
        this.correctActions = res
      })
    },
    // 获取已移除措施信息
    getRemoveActionByExample(id) {
      this.removeActLoading = true
      this.removeActions = []
      this.queryRemoveCond.issueId = id
      getIssueActionByExample(this.queryRemoveCond).then(res => {
        this.removeActLoading = false
        this.removeActions = res
      })
    },
    getCanBeRemoveAction(id) {
      this.queryRemoveCond.issueId = id
      this.canBeRemoveActions = []
      getCanRemoveActionByIssueId(id).then(res => {
        this.canBeRemoveActions = res
      })
    },
    // 改善行动的编辑弹窗
    editCorrectAction(row) {
      this.correctActionForm = row
      this.correctActionVisible = true
    },
    // 取消操作
    doCancelCorrAct() {
      this.getCorrectActionByExample(this.$props.issueId)
      this.correctActionVisible = false
    },
    // 提交改善行动信息的新增/编辑
    submitCorrectAct() {
      this.$refs.correctActionForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          this.correctActionForm.issueId = this.$props.issueId
          this.correctActionForm.type = 'D5'
          this.correctActionForm.isCon = false
          this.submitLoading = true
          if (this.correctActionForm.status === '已移除') {
            this.correctActionForm.removeTime = new Date()
          } else {
            this.correctActionForm.removeTime = null
            this.correctActionForm.comment = null
          }
          editIssueAction(this.correctActionForm).then(res => {
            this.$message({
              message: 'Edit Record Success! 编辑改善行动成功!',
              type: 'success'
            })
            this.correctActionVisible = false
            this.isFinished = false
            this.$emit('func', this.isFinished)
            this.getCorrectActionByExample(this.$props.issueId)
            this.getRemoveActionByExample(this.$props.issueId)
            this.getCanRemoveActionByIssueId(this.$props.issueId)
          })
          this.submitLoading = false
        }
      })
    },
    // 新增移除行动
    addRemoveAct() {
      if (this.correctActions.length > this.removeActions.length) {
        this.removeActionForm = {}
        this.removeActTitle = '新增移除改善行动'
        this.removeActionVisible = true
        this.isAdd = true
      } else {
        this.$message({
          message: 'No Action Need to Remove! 暂无改善措施可移除!',
          type: 'warning'
        })
      }
    },
    // 编辑移除行动
    editRemoveAction(row) {
      this.removeActionForm = row
      this.removeActTitle = '编辑移除的改善行动'
      this.removeActionVisible = true
      this.isAdd = false
    },
    // 提交已移除的改善行动信息的新增/编辑
    submitRemoveAct() {
      this.removeActionForm.issueId = this.$props.issueId
      this.removeActionForm.type = 'D5'
      this.removeActionForm.status = '已移除'
      this.removeActionForm.isCon = false
      this.removeActionForm.removeTime = new Date()
      this.submitRemoveActLoading = false
      editIssueAction(this.removeActionForm).then(res => {
        this.$message({
          message: 'Edit Record Success! 保存移除改善行动成功!',
          type: 'success'
        })
        this.isFinished = false
        this.$emit('func', this.isFinished)
        this.getCorrectActionByExample(this.$props.issueId)
        this.getRemoveActionByExample(this.$props.issueId)
      })
      this.submitRemoveActLoading = false
      this.removeActionVisible = false
    },
    addSixthDesc(form) {
      let val = true
      console.log(this.oldComment)
      if (this.oldComment === form.commentD6) {
        this.$message({
          message: 'Cannot submit! 内容未发生变更，无需重复提交!',
          type: 'warning'
        })
        val = false
      }
      if (val) {
        edit(form).then(res => {
          // 编辑问题，添加供应商详细描述
          this.$message({
            message: 'Submit D6-Desc Success! 添加D6详细描述完成!',
            type: 'success'
          })
          this.oldComment = form.commentD6
          this.commentChanged = false
          this.judgeChange()
          this.isFinished = false
          this.$emit('func', this.isFinished)
        }).catch(res => {
          this.form.commentD6 = this.oldComment
        })
      }
    },
    // 关闭弹窗前操作
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    commentChange(val) {
      this.commentChanged = !judgeIsEqual(val, this.oldComment)
      this.judgeChange()
    },
    judgeChange(){
      this.noChanged = !this.commentChanged
    },
    confirmFinished() {
      // alert("this.noChanged的值：" + this.noChanged)
      if (!this.noChanged) {
        this.$confirm('检测到【D6-详细描述】内容发生了变化，是否一并保存？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        })
          .then(() => {
            edit(this.form).then(res => {
              this.oldComment = this.form.commentD6
            }).catch(res => {
              this.form.commentD6 = this.oldComment
            })
            this.finishStep()
          })
          .catch(() => {
            this.form.commentD6 = this.oldComment
            this.finishStep()
          })
      } else {
        this.finishStep()
      }
    },
    finishStep(){
      // 确认D6完成
      this.timeManagement.curStep = 'D6'
      this.timeManagement.d6Status = true
      this.timeManagement.d6Time = new Date()
      if (!this.timeManagement.d5Status) {
        this.$message({
          message: 'Cannot submit! 上一步尚未完成，无法执行此操作!',
          type: 'warning'
        })
      } else {
        // 上一步已完成方可执行
        editTimeManage(this.timeManagement).then(res => {
          this.confirmVisible = false
          this.isFinished = true
          this.noChanged = true
          this.$emit('func', this.isFinished)
          this.$message({
            message: 'Submit Success! D6提交完成!',
            type: 'success'
          })
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.dialog > > > .is-disabled .el-input__inner {
  background-color: #ffffff;
  color: #000000;
}

::v-deep .box-card {
  margin-bottom: 5px;
}

.elRow {
  border-bottom: 1px solid #808080;
}

.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}
</style>
