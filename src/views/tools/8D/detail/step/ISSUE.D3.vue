<template>
  <div>
    <!--围堵措施-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">常见围堵措施</span>
      </div>
      <div>
        <el-dialog
          title="编辑围堵措施"
          :visible.sync="addConActionVisible"
          width="600px"
          :before-close="handleClose"
        >
          <el-form
            ref="conActionform"
            :model="conActionForm"
            :rules="conActionRules"
            size="small"
            label-width="120px"
          >
            <el-form-item
              label="紧急处理产品"
              prop="title"
            >
              <span>{{ conActionForm.title }}</span>
            </el-form-item>
            <el-form-item
              label="良品数量"
              prop="qtyOk"
            >
              <el-input
                v-model="conActionForm.qtyOk"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="不良品数量"
              prop="qtyNo"
            >
              <el-input
                v-model="conActionForm.qtyNo"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="围堵对策"
              prop="actionName"
            >
              <el-input
                v-model="conActionForm.actionName"
                style="width: 370px;"
              />
            </el-form-item>
            <!--- 负责人列表查询 -->
            <el-form-item
              label="负责人"
              prop="responsibleId"
            >
              <el-select
                v-model="conActionForm.responsibleId"
                placeholder="请选择人员"
                style="width: 370px;"
              >
                <el-option
                  v-for="item in members"
                  :key="item.userId"
                  :label="item.deptName + ' - ' + item.userName "
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="%有效性"
              prop="efficiency"
            >
              <el-input-number
                v-model="conActionForm.efficiency"
                style="width: 370px;"
                :precision="2"
                :step="0.1"
                :max="100"
              />
            </el-form-item>
            <el-form-item
              prop="partIdentification"
            >
              <span slot="label">
                <span class="span-box">
                  <span>产品标识</span>
                  <el-tooltip placement="top" effect="light">
                    <div slot="content">
                      需要上传图片、文档等附件可统一在下方【添加附件】和【附件列表】功能区域上传、管理
                    </div>
                    <i class="el-icon-question"/>
                  </el-tooltip>
                </span>
              </span>
              <el-input
                v-model="conActionForm.partIdentification"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="计划执行时间"
              prop="plannedTime"
            >
              <el-date-picker
                v-model="conActionForm.plannedTime"
                type="datetime"
                style="width: 370px;"
                placeholder="选择日期时间"
                default-time="12:00:00"
              />
            </el-form-item>
            <el-form-item
              label="实际执行时间"
              prop="actualTime"
            >
              <el-date-picker
                v-model="conActionForm.actualTime"
                type="datetime"
                style="width: 370px;"
                placeholder="选择日期时间"
                default-time="12:00:00"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="doCancelConAct">取 消</el-button>
            <el-button type="primary" @click="submitConAct">确 定</el-button>
          </span>
        </el-dialog>
        <el-table
          ref="table"
          v-loading="conActionLoading"
          :data="conActions"
          style="width: 100%;"
        >
          <el-table-column prop="title" label="紧急处理产品" width="150"/>
          <el-table-column prop="qtyOk" label="良品数量" width="80"/>
          <el-table-column prop="qtyNo" label="不良品数量" min-width="80"/>
          <el-table-column prop="actionName" label="围堵对策" width="180"/>
          <el-table-column prop="responsibleName" label="负责人"/>
          <el-table-column prop="efficiency" label="有效性(%)" width="100"/>
          <el-table-column prop="partIdentification" label="产品标识" width="100"/>
          <el-table-column prop="plannedTime" label="计划执行时间" min-width="150"/>
          <el-table-column prop="actualTime" label="实际执行时间" min-width="150"/>
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
                  slot="reference"
                  v-permission="permission.edit"
                  :disabled="scope.row.isLeader === true"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editConAction(scope.row)"
                />
                <!--删除-->
                <el-popover
                  :ref="`delMem-popover-${scope.$index}`"
                  v-permission="permission.edit"
                  placement="top"
                  width="180"
                >
                  <p>确定清空本条数据吗？此操作会联动删除对应的措施</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >取消
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="clearConAction(scope.row), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    v-permission="permission.del"
                    type="warning"
                    icon="el-icon-delete"
                    size="mini"
                  >清空
                  </el-button>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--其他围堵措施-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">自定义围堵措施</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="toAddOtherConAct">增加新措施
        </el-button>
      </div>
      <div>
        <el-dialog
          :title="actOperationTitle"
          :visible.sync="addOtherConActionVisible"
          width="600px"
          :before-close="handleClose"
        >
          <el-form
            ref="otherConActionform"
            :model="otherConActionForm"
            :rules="otherConActionRules"
            size="small"
            label-width="120px"
          >
            <el-form-item
              label="自定义围堵措施"
              prop="name"
            >
              <el-input
                v-model="otherConActionForm.name"
                style="width: 370px;"
              />
            </el-form-item>
            <!--状态选择-->
            <el-form-item
              label="状态"
              prop="status"
            >
              <el-select
                v-model="otherConActionForm.status"
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
            <!--- 负责人列表查询 -->
            <el-form-item
              label="负责人"
              prop="responsibleId"
            >
              <el-select
                v-model="otherConActionForm.responsibleId"
                placeholder="请选择人员"
                style="width: 370px;"
              >
                <el-option
                  v-for="item in members"
                  :key="item.userId"
                  :label="item.deptName + ' - ' + item.userName "
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="%有效性"
              prop="efficiency"
            >
              <el-input-number
                v-model="otherConActionForm.efficiency"
                style="width: 370px;"
                :precision="2"
                :step="0.1"
                :min="0"
                :max="100"
              />
            </el-form-item>
            <el-form-item
              label="计划执行时间"
              prop="plannedTime"
            >
              <el-date-picker
                v-model="otherConActionForm.plannedTime"
                type="datetime"
                style="width: 370px;"
                placeholder="选择日期时间"
                default-time="12:00:00"
              />
            </el-form-item>
            <el-form-item
              label="其他"
              prop="comment"
            >
              <el-input
                v-model="otherConActionForm.comment"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="具体描述"
              prop="description"
            >
              <el-input
                v-model="otherConActionForm.description"
                type="textarea"
                autosize
                style="width: 370px;"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="doCancelOtherConAct">取 消</el-button>
            <el-button type="primary" :loading="submitLoading" @click="submitOtherConAct">确 定</el-button>
          </span>
        </el-dialog>
        <el-table
          ref="table"
          v-loading="otherActLoading"
          :data="otherConActions"
          style="width: 100%;"
        >
          <el-table-column prop="name" label="自定义围堵措施"/>
          <el-table-column prop="responsibleName" label="负责人"/>
          <el-table-column prop="efficiency" label="有效性(%)"/>
          <el-table-column prop="plannedTime" label="计划执行时间"/>
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
                  slot="reference"
                  v-permission="permission.edit"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editOtherConAction(scope.row)"
                />
                <!--删除-->
                <el-popover
                  :ref="`delMem-popover-${scope.$index}`"
                  v-permission="permission.edit"
                  placement="top"
                  width="180"
                >
                  <p>确定删除本条数据吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >取消
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="delOtherConAction(scope.row), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    v-permission="permission.del"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                  />
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--追踪消息-->
    <!--    <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="header-title">追踪消息</span>
          </div>
          <div>
            <span>&#45;&#45;待写入&#45;&#45;</span>
          </div>
        </el-card>-->

    <!--风险评估-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">风险评估</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="addRiskAssessment(form)">保存
        </el-button>
      </div>
      <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item
            prop="riskAssessment"
          >
            <el-input
              v-if="isNeed"
              v-model="form.riskAssessment"
              type="textarea"
              :rows="3"
              style="min-width: 800px;"
              :disabled="!isNeed"
              @input="descChange"
            />
            <span v-if="!isNeed">{{transNullFormat(form.riskAssessment)}}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--添加附件及其列表-->
    <UploadFile
      :issue-id="this.$props.issueId"
      :is-need="isNeed"
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
        <el-row style="margin-bottom: 20px;">
          <el-col :span="4">
            <span>是否存在临时文件?</span>
          </el-col>
          <el-col :span="6">
            <el-radio-group v-model="form.hasTempFile" @change="hasTempFileChange">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
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
import { clearConAction, editConAction, getConActionByIssueId } from '@/api/tools/conAction'
import { getMembersByIssueId } from '@/api/tools/teamMember'
import UploadFile from '@/components/UploadFile'
import { addIssueAction, delIssueAction, editIssueAction, getIssueActionByExample } from '@/api/tools/issueAction'
import { judgeIsEqual } from '@/utils/validationUtil'

export default {
  name: 'ThirdForm',
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
      selfLoading: false,
      conActionLoading: false,
      conActions: [],
      addConActionVisible: false,
      conActionForm: {
        title: null,
        qtyOk: null,
        qtyNo: null,
        actionName: null,
        responsibleId: null,
        efficiency: null,
        partIdentification: '待定',
        plannedTime: null,
        actualTime: null
      },
      conActionRules: {
        qtyOk: [
          { required: true, message: '请输入良品数量', trigger: 'blur' }
        ],
        qtyNo: [
          { required: true, message: '请输入不良品数量', trigger: 'blur' }
        ],
        actionName: [
          { required: true, message: '请输入围堵对策', trigger: 'blur' }
        ],
        responsibleId: [
          { required: true, message: '请务必选择此项负责人', trigger: 'blur' }
        ],
        efficiency: [
          { required: true, message: '请填写有效性', trigger: 'blur' }
        ],
        partIdentification: [
          { required: true, message: '请输入产品标识', trigger: 'blur' }
        ],
        plannedTime: [
          { required: true, message: '请填写计划执行时间', trigger: 'blur' }
        ],
        actualTime: [
          { required: true, message: '请如实填写实际执行时间', trigger: 'blur' }
        ]
      },
      otherActLoading: false,
      otherConActions: [],
      addOtherConActionVisible: false,
      actOperationTitle: '',
      otherConActionForm: {
        name: null,
        status: null,
        responsibleId: null,
        efficiency: null,
        plannedTime: null,
        comment: null,
        description: null,
        isCon: false,
        type: 'D3'
      },
      otherConActionRules: {
        name: [
          { required: true, message: '围堵措施标题不可为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '默认可选“开始”', trigger: 'blur' }
        ],
        responsibleId: [
          { required: true, message: '请务必选择此项负责人', trigger: 'blur' }
        ],
        efficiency: [
          { required: true, message: '请填写有效性', trigger: 'blur' }
        ],
        plannedTime: [
          { required: true, message: '请选择计划执行时间', trigger: 'blur' }
        ],
        comment: [
          { required: true, message: '若无其他补充，可填入”暂无“', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写详细描述', trigger: 'blur' }
        ]
      },
      statusTypeOptions: [
        { key: '开始', display_name: '开始' },
        { key: '进行中', display_name: '进行中' },
        { key: '关闭', display_name: '关闭' }
      ],
      timeManagement: {},
      confirmVisible: false,
      curStep: 'D3',
      curTime: 'd3Time',
      form: {},
      isFinished: false,
      members: [],
      queryCond: {
        issueId: null,
        isCon: false,
        type: 'D3'
      },
      oldHasTemp: false,
      oldDesc: null,
      descChanged: false,
      hasTempChanged: false,
      noChanged: true,
      isNeed: true,
      submitLoading: false
    }
  },
  created() {

  },
  mounted: function() {
    this.isNeed = this.$props.needConfirm === undefined ? true : this.$props.needConfirm
    this.getIssueInfoById(this.$props.issueId)
    this.getTimeManagementByIssueId(this.$props.issueId)
    this.getIssueConActionByIssueId(this.$props.issueId)
    this.getTeamMembersByIssueId(this.$props.issueId)
    this.getConActionByExample(this.$props.issueId)
  },
  methods: {
    // 监控附件相关改动
    getMsgFormSon(msg) {
      this.isFinished = msg
      this.$emit('func', this.isFinished)
    },
    // 获取问题信息
    getIssueInfoById(id) {
      getIssueById(id).then(res => {
        this.form = res
        this.oldDesc = res.riskAssessment
        this.oldHasTemp = res.hasTempFile
      })
    },
    // 获取问题关联记录信息
    getIssueConActionByIssueId(id) {
      this.conActionLoading = true
      this.conActions = []
      getConActionByIssueId(id).then(res => {
        this.conActionLoading = false
        this.conActions = res
      })
    },
    // 获取人员信息
    getTeamMembersByIssueId(id) {
      getMembersByIssueId(id).then(res => {
        this.members = res.content
      })
    },
    getConActionByExample(id) {
      this.otherActLoading = true
      this.otherConActions = []
      this.queryCond.issueId = id
      getIssueActionByExample(this.queryCond).then(res => {
        this.otherActLoading = false
        this.otherConActions = res
      })
    },
    // 获取时间进程
    getTimeManagementByIssueId(id) {
      this.selfLoading = true
      getByIssueId(id).then(res => {
        this.timeManagement = res
        if (res.d3Status) {
          this.isFinished = true
        }
        this.selfLoading = false
      })
    },
    hasTempFileChange(val) {
      this.hasTempChanged = this.oldHasTemp !== val
      this.judgeChange()
    },
    // 编辑记录
    editConAction(row) {
      this.conActionForm = row
      this.addConActionVisible = true
    },
    doCancelConAct() {
      this.addConActionVisible = false
      this.getIssueConActionByIssueId(this.$props.issueId)
    },
    submitConAct() {
      this.$refs.conActionform.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          editConAction(this.conActionForm).then(res => {
            this.$message({
              message: 'Edit Containment Success! 编辑围堵措施成功!',
              type: 'success'
            })
            this.addConActionVisible = false
            this.isFinished = false
            this.$emit('func', this.isFinished)
            this.getIssueConActionByIssueId(this.$props.issueId)
          }).catch(res => {

          })
        }
      })
    },
    // 删除记录
    clearConAction(data) {
      clearConAction(data).then(res => {
        this.$message({
          message: 'Clear Record Success! 清空记录成功!',
          type: 'success'
        })
        this.isFinished = false
        this.$emit('func', this.isFinished)
        this.getIssueConActionByIssueId(this.$props.issueId)
      }).catch(() => {
        this.$message({
          message: 'Clear Failed! 清空记录失败!',
          type: 'error'
        })
      })
    },
    // 围堵措施的新增弹窗
    toAddOtherConAct() {
      this.otherConActionForm = {}
      this.actOperationTitle = '新增围堵措施'
      this.addOtherConActionVisible = true
    },
    editOtherConAction(row) {
      this.otherConActionForm = row
      this.actOperationTitle = '编辑围堵措施'
      this.addOtherConActionVisible = true
    },
    doCancelOtherConAct() {
      this.getConActionByExample(this.$props.issueId)
      this.addOtherConActionVisible = false
    },
    submitOtherConAct() {
      this.$refs.otherConActionform.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          this.otherConActionForm.issueId = this.$props.issueId
          this.otherConActionForm.type = 'D3'
          this.otherConActionForm.isCon = false
          if (this.otherConActionForm.id === undefined) {
            this.submitLoading = true
            addIssueAction(this.otherConActionForm).then(res => {
              this.$message({
                message: 'Add Record Success! 新增其他围堵措施记录成功!',
                type: 'success'
              })
              this.addOtherConActionVisible = false
              this.isFinished = false
              this.$emit('func', this.isFinished)
              this.getConActionByExample(this.$props.issueId)
            }).catch(res => {
              this.submitLoading = false
            })
          } else {
            this.submitLoading = true
            editIssueAction(this.otherConActionForm).then(res => {
              this.$message({
                message: 'Edit Record Success! 编辑其他围堵措施记录成功!',
                type: 'success'
              })
              this.submitLoading = false
              this.addOtherConActionVisible = false
              this.isFinished = false
              this.$emit('func', this.isFinished)
              this.getConActionByExample(this.$props.issueId)
            }).catch(res => {
              this.submitLoading = false
            })
          }
        }
      })
    },
    delOtherConAction(data) {
      delIssueAction(data).then(res => {
        this.$message({
          message: 'Del Record Success! 删除措施成功!',
          type: 'success'
        })
        this.isFinished = false
        this.$emit('func', this.isFinished)
        this.getConActionByExample(this.$props.issueId)
      }).catch(() => {
        this.$message({
          message: 'Del Failed! 删除措施失败!',
          type: 'error'
        })
      })
    },
    addRiskAssessment(form) {
      let val = true
      if (this.oldDesc === form.riskAssessment) {
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
            message: 'Submit Success! 保存风险评估成功!',
            type: 'success'
          })
          this.oldDesc = form.riskAssessment
          this.descChanged = false
          this.isFinished = false
          this.judgeChange()
          this.$emit('func', this.isFinished)
        }).catch(res => {
          this.form.riskAssessment = this.oldDesc
        })
      }
    },
    transNullFormat(val){
      if (val === '' || val === undefined || val === null) {
        return '--'
      } else {
        return val
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
    // 监控风险评估有无变化
    descChange(val) {
      this.descChanged = !judgeIsEqual(val.trim(), this.oldDesc)
      this.judgeChange()
    },
    // 判断界面输入有无变化
    judgeChange() {
      this.noChanged = !(this.descChanged || this.hasTempChanged)
    },
    confirmFinished() {
      // 判断是否切换临时文件选项
      if (!this.noChanged) {
        let msg = ''
        if (this.descChanged && this.hasTempChanged) {
          msg = '检测到【风险评估】【临时文件】是否存在发生了变化，是否一并保存?'
        } else if (this.descChanged && !this.hasTempChanged) {
          msg = '检测到【风险评估】发生了变化，是否一并保存?'
        } else if (!this.descChanged && this.hasTempChanged) {
          msg = '【临时文件是否存在选择项】发生了变化，是否一并保存?'
        }
        this.$confirm(msg, '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        }).then(() => {
          edit(this.form).then(res => {
            this.oldDesc = this.form.riskAssessment
            this.oldHasTemp = this.form.hasTempFile
            this.descChanged = false
            this.hasTempChanged = false
            this.finishStep()
          }).catch(res => {
            this.form.riskAssessment = this.oldDesc
            this.form.hasTempFile = this.oldHasTemp
          })
        })
          .catch(() => {
            this.form.riskAssessment = this.oldDesc
            this.form.hasTempFile = this.oldHasTemp
            this.finishStep()
          })
      } else {
        this.finishStep()
      }
    },
    finishStep() {
      // 确认D3完成
      this.timeManagement.curStep = 'D3'
      this.timeManagement.d3Status = true
      this.timeManagement.d3Time = new Date()
      if (!this.timeManagement.d2Status) {
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
            message: 'Submit Success! D3提交完成!',
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
