<template>
  <div>
    <!--缺陷定位-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">改善行动</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="addCorrectAction">添加改善行动</el-button>
      </div>
      <div>
        <el-dialog
          :title="actOperationTitle"
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
            <!--获取根本原因列表-->
            <el-form-item
              label="根本原因"
              prop="causeId"
            >
              <el-select
                v-model="correctActionForm.causeId"
                placeholder="请选择根本原因"
                style="width: 370px;"
              >
                <el-option
                  v-for="item in rootCauses"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="改善行动标题"
              prop="name"
            >
              <el-input
                v-model="correctActionForm.name"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="验证方法"
              prop="validationMethod"
            >
              <el-input
                v-model="correctActionForm.validationMethod"
                type="textarea"
                autosize
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="验证结果"
              prop="validationResult"
            >
              <el-input
                v-model="correctActionForm.validationResult"
                type="textarea"
                autosize
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="%有效性"
              prop="efficiency"
            >
              <el-input-number v-model="correctActionForm.efficiency" style="width: 370px;" :precision="2" :step="0.1"
                               :max="100"
              ></el-input-number>
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
              label="计划完成时间"
              prop="plannedCompleteTime"
            >
              <el-date-picker
                v-model="correctActionForm.plannedCompleteTime"
                type="datetime"
                style="width: 370px;"
                placeholder="选择日期时间"
                default-time="12:00:00"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
         <el-button @click="doCancelCorrectAct">取 消</el-button>
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
          <el-table-column prop="plannedCompleteTime" label="计划完成时间" width="140"/>
          <!--   编辑与删除   -->
          <el-table-column
            label="操作"
            width="160px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <!--编辑-->
                <el-button slot="reference" v-permission="permission.edit" v-if="scope.row.id !==undefined"
                           size="mini"
                           type="primary" icon="el-icon-edit" @click="editCorrectAction(scope.row)"
                />
                <!--删除-->
                <el-popover :ref="`delMem-popover-${scope.$index}`" v-permission="permission.edit" placement="top"
                            width="180"
                >
                  <p>确定删除本条数据吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text"
                               @click="scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >取消
                    </el-button>
                    <el-button type="primary" size="mini"
                               @click="delCorrectAction(scope.row), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button slot="reference" v-permission="permission.del" type="danger" icon="el-icon-delete"
                             size="mini" v-if="scope.row.id !==undefined"
                  />
                </el-popover>
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
        <el-button style="float: right; padding: 3px 0" type="text" @click="addFifthDesc(form)">保存</el-button>
      </div>
      <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item
            prop="supplierDescription"
          >
            <el-input
              type="textarea"
              :rows="3"
              v-model="form.commentD5"
              style="min-width: 800px;"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--添加附件及其列表-->
    <UploadFile :is-need="isNeed" :issue-id="this.$props.issueId" :permission="permission" :step-name="curStep"
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
              placement="top"
              width="300"
              v-model="confirmVisible"
            >
              <p>您确定所有信息都已填写完毕，此步骤已完成吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="confirmVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="confirmFinished">确定</el-button>
              </div>
              <el-button slot="reference" :loading="selfLoading" v-permission="permission.edit" type="success"
                         :disabled="isFinished"
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

import { getByIssueId, editTimeManage } from '@/api/tools/timeManagement'
import { getIssueById, edit } from '@/api/tools/issue'
import { getMembersByIssueId } from '@/api/tools/teamMember'
import { addIssueAction, delIssueAction, editIssueAction, getIssueActionByExample } from '@/api/tools/issueAction'
import { getIssueCauseByExample } from '@/api/tools/issueCause'

import UploadFile from '../../module/uploadFile.vue'

export default {
  name: 'FifthForm',
  props: ['issueId', 'needConfirm'],
  dicts: ['common_status'],
  components: { UploadFile },
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      rootCauses: [],
      actOperationTitle: '',
      correctActionVisible: false,
      correctActionForm: {
        causeId: null,
        name: null,
        validationMethod: null,
        validationResult: null,
        efficiency: null,
        responsibleId: null,
        plannedCompleteTime: null
      },
      correctActionRules: {
        causeId: [
          { required: true, message: '务必选择原因', trigger: 'blur' }
        ],
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
        plannedCompleteTime: [
          { required: true, message: '请填写行动预计完成时间', trigger: 'blur' }
        ]
      },
      confirmVisible: false,
      curStep: 'D5',
      form: {},
      timeManagement: {},
      selfLoading: false,
      isFinished: false,
      members: [],
      queryCond: {
        issueId: null,
        isCon: false,
        type: 'D5'
      },
      queryCauseCond: {
        issueId: null,
        isExact: true
      },
      isNeed: false,
      submitLoading: false,
      correctActLoading: false,
      correctActions: []
    }
  },
  created() {

  },
  mounted: function() {
    this.isNeed = this.$props.needConfirm === undefined ? true : this.$props.needConfirm
    this.getIssueInfoById(this.$props.issueId)
    this.getTimeManagementByIssueId(this.$props.issueId)
    this.getTeamMembersByIssueId(this.$props.issueId)
    this.getRootCauseByExample(this.$props.issueId)
    this.getCorrectActionByExample(this.$props.issueId)
  },
  methods: {
    // 监控附件组件相关改动
    getMsgFormSon(msg) {
      this.isFinished = msg
      this.$emit('func', this.isFinished)
    },
    // 获取问题信息
    getIssueInfoById(id) {
      getIssueById(id).then(res => {
        this.form = res
      })
    },
    // 获取时间进程
    getTimeManagementByIssueId(id) {
      this.selfLoading = true
      getByIssueId(id).then(res => {
        this.timeManagement = res
        if (res.d5Status) {
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
    // 获取根本原因
    getRootCauseByExample(id) {
      this.rootCauses = []
      this.queryCauseCond.issueId = id
      this.queryCauseCond.isExact = true
      getIssueCauseByExample(this.queryCauseCond).then(res => {
        this.rootCauses = res
      })
    },
    // 添加D5问题详细描述
    addFifthDesc(form) {
      edit(form).then(res => {
        //编辑问题，添加供应商详细描述
        this.$message({
          message: 'Submit D6-Desc Success! 添加D5详细描述完成!',
          type: 'success'
        })
        this.isFinished = false
      })
    },
    // 改善措施的新增弹窗
    addCorrectAction() {
      this.correctActionForm = {}
      this.actOperationTitle = '新增改善行动'
      this.correctActionVisible = true
    },
    // 改善行动的编辑弹窗
    editCorrectAction(row) {
      this.correctActionForm = row
      this.actOperationTitle = '编辑改善行动'
      this.correctActionVisible = true
    },
    // 取消操作
    doCancelCorrectAct() {
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
          if (this.correctActionForm.id === undefined) {
            this.submitLoading = true
            addIssueAction(this.correctActionForm).then(res => {
              this.$message({
                message: 'Add Record Success! 新增改善行动成功!',
                type: 'success'
              })
              this.correctActionVisible = false
              this.isFinished = false
              this.$emit('func', this.isFinished)
              this.getCorrectActionByExample(this.$props.issueId)
            })
            this.submitLoading = false
          } else {
            this.submitLoading = true
            editIssueAction(this.correctActionForm).then(res => {
              this.$message({
                message: 'Edit Record Success! 编辑改善行动成功!',
                type: 'success'
              })
              this.correctActionVisible = false
              this.isFinished = false
              this.$emit('func', this.isFinished)
              this.getCorrectActionByExample(this.$props.issueId)
            })
            this.submitLoading = false
          }
        }
      })
    },
    delCorrectAction(data) {
      delIssueAction(data).then(res => {
        this.$message({
          message: 'Del Record Success! 删除改善行动成功!',
          type: 'success'
        })
        this.isFinished = false
        this.$emit('func', this.isFinished)
        this.getCorrectActionByExample(this.$props.issueId)
      }).catch(() => {
        this.$message({
          message: 'Del Failed! 删除改善行动失败!',
          type: 'error'
        })
      })
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
    // 确认完成
    confirmFinished() {
      // 确认D5完成
      this.timeManagement.curStep = 'D5'
      this.timeManagement.d5Status = true
      this.timeManagement.d5Time = new Date()
      if (!this.timeManagement.d4Status) {
        this.$message({
          message: 'Cannot submit! 上一步尚未完成，无法执行此操作!',
          type: 'warning'
        })
      } else {
        // 上一步已完成方可执行
        editTimeManage(this.timeManagement).then(res => {
          this.confirmVisible = false
          this.isFinished = true
          this.$emit('func', this.isFinished)
          this.$message({
            message: 'Submit Success! D5提交完成!',
            type: 'success'
          })
        })
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
