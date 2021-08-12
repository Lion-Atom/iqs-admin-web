<template>

  <div class="app-container">
    <el-card class="box-card">
      <el-page-header @back="goBack" content="单独报告"></el-page-header>
    </el-card>

    <!--问题基本信息-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">问题基本信息</span>
      </div>
      <div>
        <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="问题标题 :">
                <span>{{ form.issueTitle }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户姓名 :">
                <span>{{ form.customerName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="客户追踪码 :">
                <span>{{ form.caNum }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品料号 :">
                <span>{{ form.partNum }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="问题来源 :">
                <span>{{ form.source }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间 :">
                <span>{{ form.initTime }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="紧急计划 :">
                <span>{{ form.urgencyPlan }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="具体描述 :">
                <span>{{ form.description }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="关闭时间 :">
                <span>{{ form.closeTime }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结案时长 :">
                <span>{{ form.duration }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>

    <!--原因描述-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">原因描述</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="addSupDesc(form)">保存</el-button>
      </div>
      <div>
        <el-form :inline="true" :model="form" class="demo-form-inline" label-width="120">
          <el-form-item
            prop="supplierDescription"
          >
            <el-input
              type="textarea"
              :rows="3"
              v-model="form.supplierDescription"
              style="min-width: 800px;"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--对应措施-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">应对措施</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="toAddReportAct">增加新措施</el-button>
      </div>
      <div>
        <el-dialog
          :title="actOperationTitle"
          :visible.sync="addReportActionVisible"
          width="600px"
          :before-close="handleClose"
        >
          <el-form
            ref="reportActionForm"
            :model="reportActionForm"
            :rules="reportActionRules"
            size="small"
            label-width="120px"
          >
            <el-form-item
              label="应对措施"
              prop="name"
            >
              <el-input
                v-model="reportActionForm.name"
                style="width: 370px;"
              />
            </el-form-item>
            <!--状态选择-->
            <el-form-item
              label="状态"
              prop="status"
            >
              <el-select
                v-model="reportActionForm.status"
                placeholder="请选择状态"
                style="width: 370px;"
              >
                <el-option v-for="item in statusTypeOptions" :key="item.key" :label="item.display_name"
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
                v-model="reportActionForm.responsibleId"
                placeholder="请选择人员"
                style="width: 370px;"
              >
                <el-option
                  v-for="item in members"
                  :key="item.id"
                  :label="item.dept.name + '-'+item.jobs[0].name + '-'+ item.username "
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="%有效性"
              prop="efficiency"
            >
              <el-input-number v-model="reportActionForm.efficiency" style="width: 370px;" :precision="2" :step="0.1"
                               :min="0" :max="100"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              label="计划执行时间"
              prop="plannedTime"
            >
              <el-date-picker
                v-model="reportActionForm.plannedTime"
                type="datetime"
                style="width: 370px;"
                placeholder="选择日期时间"
                default-time="12:00:00"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="其他"
              prop="comment"
            >
              <el-input
                v-model="reportActionForm.comment"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="具体描述"
              prop="description"
            >
              <el-input
                v-model="reportActionForm.description"
                type="textarea"
                autosize
                style="width: 370px;"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
         <el-button @click="doCancelReportAct">取 消</el-button>
         <el-button type="primary" :loading="submitLoading" @click="submitReportAct">确 定</el-button>
      </span>
        </el-dialog>
        <el-table
          ref="table"
          v-loading="reportActLoading"
          :data="reportActions"
          style="width: 100%;"
        >
          <el-table-column prop="name" label="应对措施"/>
          <el-table-column prop="status" label="状态"/>
          <el-table-column prop="responsibleName" label="负责人"/>
          <el-table-column prop="efficiency" label="有效性(%)"/>
          <el-table-column prop="plannedTime" label="计划执行时间"/>
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
                <el-button slot="reference" v-permission="permission.edit"
                           size="mini"
                           type="primary" icon="el-icon-edit" @click="editReportAction(scope.row)"
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
                               @click="delReportAction(scope.row), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button slot="reference" v-permission="permission.del" type="danger" icon="el-icon-delete"
                             size="mini"
                  />
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--添加附件及其列表-->
    <UploadFile
      :upload-title="cardTitle"
      :list-title="listTitle"
      :issue-id="this.issueId"
      :is-need="isNeed"
      :permission="permission"
      :step-name="curStep"
      @func="getMsgFormSon"
    />

    <!--结案确认-->
    <el-card v-if="isNeed" class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">结案确认</span>
      </div>
      <div>
        <el-row>
          <el-col :span="6">
            确认结案：
            <el-popover
              placement="top"
              width="300"
              v-model="confirmVisible"
            >
              <p>您确定所有信息都已填写完毕，此案已完成吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="confirmVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="confirmFinished">确定</el-button>
              </div>
              <el-button
                slot="reference"
                :loading="selfLoading"
                v-permission="permission.edit"
                type="success"
                :disabled="isFinished"
                icon="el-icon-check"
              >结案确认
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
        <el-row v-if="form.closeTime !==undefined && isFinished">
          <span>&emsp;关闭时间：{{ form.closeTime }}</span>
        </el-row>
      </div>
    </el-card>

  </div>
</template>

<script>

import { edit, getIssueById } from '@/api/tools/issue'
import UploadFile from '../module/uploadFile.vue'
import { addIssueAction, delIssueAction, editIssueAction, getIssueActionByExample } from '@/api/tools/issueAction'
// import { getMembersByIssueId } from '@/api/tools/teamMember'
import { getAllUser } from '@/api/system/user'

export default {
  name: 'report',
  components: { UploadFile },
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      form: {
        id: null,
        issueTitle: null,
        customerName: null,
        caNum: null,
        partNum: null,
        source: 'external',
        urgencyPlan: null,
        initTime: null,
        description: null,
        phone: null,
        email: null,
        type: null,
        isRepeat: null,
        hasSimilar: null,
        initRisk: null,
        department: null,
        customerTime: null,
        other: null,
        supplierDescription: null,
        status: null,
        closeTime: null
      },
      reportActLoading: false,
      queryCond: {
        issueId: null,
        isCon: false,
        type: 'separateReport'
      },
      reportActions: [],
      addReportActionVisible: false,
      actOperationTitle: '',
      reportActionForm: {
        name: null,
        status: null,
        responsibleId: null,
        efficiency: null,
        plannedTime: null,
        comment: null,
        description: null,
        isCon: false,
        type: 'separateReport'
      },
      members: [],
      reportActionRules: {
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
      submitLoading: false,
      cardTitle: '报告上传',
      listTitle: '报告列表',
      issueId: null,
      isNeed: true,
      curStep: 'separateReport',
      isFinished: false,
      selfLoading: false,
      confirmVisible: false
    }
  },
  created() {
    if (this.$route.query.issueId !== undefined) {
      this.issueId = this.$route.query.issueId
    }
  },
  mounted: function() {
    this.getIssueInfoById(this.issueId)
    this.getReportActionByExample(this.issueId)
    // this.getTeamMembersByIssueId(this.issueId)
    this.getAvailableUser()
  },
  methods: {
    // 返回上一页
    goBack() {
      window.history.back()
    },
    // 监控附件组件相关改动
    getMsgFormSon(msg) {
      this.isFinished = msg
      this.$emit('func', this.isFinished)
    },
    // 获取问题基本信息
    getIssueInfoById(id) {
      getIssueById(id).then(res => {
        this.form = res
        if (this.form.status === '完成') {
          this.isFinished = true
        }
      })
    },
    getReportActionByExample(id) {
      this.reportActLoading = true
      this.reportActions = []
      this.queryCond.issueId = id
      getIssueActionByExample(this.queryCond).then(res => {
        this.reportActLoading = false
        this.reportActions = res
      })
    },
    // 获取人员信息
    getAvailableUser() {
      getAllUser().then(res => {
        this.members = res.content
      })
    },
    // 保存原因描述
    addSupDesc(form) {
      form.status = '进行中'
      edit(form).then(res => {
        // 编辑问题，添加原因描述
        this.$message({
          message: 'Submit Success! 添加原因描述完成!',
          type: 'success'
        })
        this.isFinished = false
        this.getIssueInfoById(this.issueId)
      })
    },
    // 预新增应对措施
    // 围堵措施的新增弹窗
    toAddReportAct() {
      this.reportActionForm = {}
      this.actOperationTitle = '新增对应措施'
      this.addReportActionVisible = true
    },
    editReportAction(row) {
      this.reportActionForm = row
      this.actOperationTitle = '编辑对应措施'
      this.addReportActionVisible = true
    },
    doCancelReportAct() {
      this.getReportActionByExample(this.issueId)
      this.addReportActionVisible = false
    },
    // 保存单独报告对应的措施
    submitReportAct() {
      this.$refs.reportActionForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          this.reportActionForm.issueId = this.issueId
          this.reportActionForm.type = 'separateReport'
          this.reportActionForm.isCon = false
          if (this.reportActionForm.id === undefined) {
            this.submitLoading = true
            addIssueAction(this.reportActionForm).then(res => {
              this.$message({
                message: 'Add Record Success! 新增其他围堵措施记录成功!',
                type: 'success'
              })
              this.submitLoading = false
              this.addReportActionVisible = false
              this.isFinished = false
              this.getReportActionByExample(this.issueId)
            })
          } else {
            this.submitLoading = true
            editIssueAction(this.reportActionForm).then(res => {
              this.$message({
                message: 'Edit Record Success! 编辑其他围堵措施记录成功!',
                type: 'success'
              })
              this.submitLoading = false
              this.addReportActionVisible = false
              this.isFinished = false
              this.getReportActionByExample(this.issueId)
            })
          }
        }
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
    delReportAction(data) {
      delIssueAction(data).then(res => {
        this.$message({
          message: 'Del Record Success! 删除措施成功!',
          type: 'success'
        })
        this.isFinished = false
      }).catch(() => {
        this.$message({
          message: 'Del Failed! 删除措施失败!',
          type: 'error'
        })
      })
      this.getReportActionByExample(this.issueId)
    },
    // 结案确认
    confirmFinished() {
      this.form.status = '完成'
      this.form.closeTime = new Date()
      edit(this.form).then(res => {
        this.confirmVisible = false
        // 编辑问题，添加与纳音描述
        this.$message({
          message: 'Submit Success! 成功结案!',
          type: 'success'
        })
      })
      this.getIssueInfoById(this.issueId)
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
  margin-bottom: 10px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}
</style>
