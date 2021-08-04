<template>
  <div>
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
        </el-form>
      </div>
    </el-card>
    <!--时间要求-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">时间要求</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="saveTimeManagement(timeManagement)">保存
        </el-button>
      </div>
      <div>
        <el-form ref="timeManage" :inline="true" :model="timeManagement" class="demo-form-inline">
          <!--预计步骤1-->
          <el-row>
            <el-col :span="12">
              <el-form-item label="预计完成步骤 :" prop="planStep1">
                <el-select v-model="timeManagement.planStep1" clearable placeholder="选择预期要完成的步骤">
                  <el-option v-for="item in resultTypeOptions" :key="item.key" :label="item.display_name"
                             :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计完成时间 :" prop="planTime1">
                <el-date-picker
                  v-model="timeManagement.planTime1"
                  type="datetime"
                  style="width: 200px;"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!--预计步骤2-->
          <el-row>
            <el-col :span="12">
              <el-form-item label="预计完成步骤 :" prop="planStep1">
                <el-select v-model="timeManagement.planStep2" clearable placeholder="选择预期要完成的步骤">
                  <el-option v-for="item in resultTypeOptions" :key="item.key" :label="item.display_name"
                             :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计完成时间 :" prop="planTime1">
                <el-date-picker
                  v-model="timeManagement.planTime2"
                  type="datetime"
                  style="width: 200px;"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!--预计步骤3-->
          <el-row>
            <el-col :span="12">
              <el-form-item label="预计完成步骤 :" prop="planStep1">
                <el-select v-model="timeManagement.planStep3" clearable placeholder="选择预期要完成的步骤">
                  <el-option v-for="item in resultTypeOptions" :key="item.key" :label="item.display_name"
                             :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计完成时间 :" prop="planTime1">
                <el-date-picker
                  v-model="timeManagement.planTime3"
                  type="datetime"
                  style="width: 200px;"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>

    <!--添加组员-->
    <el-dialog
      title="添加组员"
      :visible.sync="addMemVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :model="member"
        :rules="memRules"
        size="small"
        label-width="160px"
      >
        <el-form-item label="第一步：选择部门" prop="deptName">
          <treeselect
            v-model="member.deptId"
            :options="depts"
            :load-options="loadDepts"
            style="width: 190px"
            placeholder="选择人员所属部门"
          />
        </el-form-item>
        <el-form-item
          label="第二步：选择组员"
          prop="userId"
        >
          <el-select
            v-model="member.userId"
            placeholder="请选择组员"
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.jobs[0].name + '-'+ item.username "
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="第三步：选择角色"
          prop="teamRole"
        >
          <el-select
            v-model="member.teamRole"
            placeholder="请选择角色"
          >
            <el-option v-for="item in roleTypeOptions" :key="item.key" :label="item.display_name"
                       :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="addMemVisible = false">取 消</el-button>
         <el-button type="primary" @click="addTeamMember">确 定</el-button>
      </span>
    </el-dialog>
    <!--小组成员-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">成员组成</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="toAddMember">增加新成员</el-button>
      </div>
      <div>
        <el-table
          ref="table"
          v-loading="teamLoading"
          :data="members"
          style="width: 100%;"
        >
          <el-table-column prop="companyName" label="公司名称" width="150"/>
          <el-table-column prop="deptName" label="部门名称" width="120"/>
          <el-table-column prop="userName" label="组员" width="160"/>
          <el-table-column prop="phone" label="联系电话" width="160"/>
          <el-table-column prop="email" label="电子邮箱" width="180"/>
          <el-table-column prop="teamRole" label="成员角色" width="80"/>
          <!--   编辑与删除   -->
          <el-table-column
            label="操作"
            width="130px"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <!--编辑-->
                <el-popover :ref="`editRole-popover-${scope.$index}`" v-permission="permission.edit" placement="left"
                            width="300" title="编辑角色"
                >
                  <el-form
                    ref="form"
                    :model="member"
                    :rules="memRules"
                    size="small"
                    label-width="80px"
                  >
                    <el-form-item
                      label="选择角色"
                      prop="teamRole"
                    >
                      <el-select
                        v-model="member.teamRole"
                        placeholder="请选择角色"
                        clearable
                      >
                        <el-option v-for="item in roleTypeOptions" :key="item.key" :label="item.display_name"
                                   :value="item.key"
                        />
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text"
                               @click="scope._self.$refs[`editRole-popover-${scope.$index}`].doClose()"
                    >取消
                    </el-button>
                    <el-button type="primary" size="mini"
                               @click="editRole(scope.$index,scope.row), scope._self.$refs[`editRole-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button slot="reference" v-permission="permission.edit" :disabled="scope.row.isLeader === true"
                             size="mini"
                             type="primary" icon="el-icon-edit" @click="openEditRole(scope.row)"
                  />
                </el-popover>
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
                               @click="deleteMember(scope.row.id), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button slot="reference" v-permission="permission.del" :disabled="scope.row.isLeader === true"
                             type="danger" icon="el-icon-delete" size="mini"
                  />
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--确认完成-->
    <el-card class="box-card">
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
              <el-button slot="reference" v-permission="permission.edit" type="success" :disabled="isFinished"
                         icon="el-icon-check"
              >确认完成
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!--    <ConfirmFinish :time-manage="timeManagement" :confirm-visible="confirmVisible" :cur-step="curStep"
                       :cur-time="curTime" :is-finished="isFinished"
        />-->
  </div>
</template>

<script>

import { getByIssueId, addTimeManage, editTimeManage } from '@/api/tools/timeManagement'
import { getIssueById } from '@/api/tools/issue'
import { getUserByDeptId } from '@/api/system/user'
import { getMembersByIssueId, addMember, delMember, editMember } from '@/api/tools/teamMember'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { getDepts } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { validTwo } from '@/utils/validationUtil'
// import ConfirmFinish from '@/views/tools/8D/module/ConfirmFinish'

export default {
  name: 'FirstForm',
  props: ['issueId'],
  components: { Treeselect },
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      confirmVisible: false,
      curStep: 'D1',
      curTime: 'd1Time',
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
        hasReport: null,
        hasScore: null
      },
      timeManagement: {
        id: null,
        curStep: 'D1',
        issueId: this.$props.issueId,
        planStep1: null,
        planTime1: null,
        planStep2: null,
        planTime2: null,
        planStep3: null,
        planTime3: null
      },
      resultTypeOptions: [
        { key: 'D2', display_name: 'D2 问题描述' },
        { key: 'D3', display_name: 'D3 围堵措施' },
        { key: 'D4', display_name: 'D4 根本原因分析' },
        { key: 'D5', display_name: 'D5 验证措施' },
        { key: 'D6', display_name: 'D6 实施长期纠正措施' },
        { key: 'D7', display_name: 'D7 永久措施' },
        { key: 'D8', display_name: 'D8 关闭' }
      ],
      team: {},
      teamLoading: false,
      members: [],
      addMemVisible: false,
      users: [],
      depts: [],
      member: {
        deptId: null,
        issueId: null,
        userId: null,
        teamRole: null
      },
      memRules: {
        deptId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '请选择组员', trigger: 'blur' }
        ],
        teamRole: [
          { required: true, message: '角色不可为空', trigger: 'blur' }
        ]
      },
      roleTypeOptions: [
        { key: '管理层', display_name: '管理层' },
        { key: '组员', display_name: '组员' }
      ],
      isFinished: false
    }
  },
  created() {

  },
  mounted: function() {
    this.getIssueInfoById(this.$props.issueId)
    this.getTeamMembersByIssueId(this.$props.issueId)
    this.getTimeManagementByIssueId(this.$props.issueId)
  },
  watch: {
    // 监听deptId
    'member.deptId': 'currDeptChange'
  },
  methods: {
    currDeptChange(val) {
      this.users = []
      this.member = {}
      console.log('currDeptChange', val)
      if (val) {
        // 根据部门标识（val）查找人员信息
        getUserByDeptId({ deptId: val }).then(res => {
          this.users = res
        })
      }
    },
    getIssueInfoById(id) {
      getIssueById(id).then(res => {
        this.form = res
      })
    },
    getTimeManagementByIssueId(id) {
      getByIssueId(id).then(res => {
        this.timeManagement = res
        if (res.d1Status) {
          this.isFinished = true
        }
      })
    },
    getTeamMembersByIssueId(id) {
      getMembersByIssueId(id).then(res => {
        this.members = res.content
      })
    },
    saveTimeManagement(timeData) {
      // 提交前验证
      let val = true
      if (!validTwo(this.timeManagement.planStep1, this.timeManagement.planTime1) ||
        !validTwo(this.timeManagement.planStep2, this.timeManagement.planTime2) ||
        !validTwo(this.timeManagement.planStep3, this.timeManagement.planTime3)) {
        this.$message({
          message: '设置预计完成步骤与对应的预计时间不可单独填写!',
          type: 'error'
        })
        val = false
      }
      if (val) {
        timeData.curStep = 'D1'
        timeData.d1Status = false
        if (timeData.id === undefined) {
          timeData.issueId = this.$props.issueId
          addTimeManage(timeData).then(res => {
            this.$message({
              message: 'Add Success! 保存时间要求成功!',
              type: 'success'
            })
            this.isFinished = false
            this.$emit('func', this.isFinished)
          }).catch(() => {
            this.$message({
              message: 'Add Failed! 保存时间要求失败!',
              type: 'error'
            })
          })
        } else {
          editTimeManage(timeData).then(res => {
            this.$message({
              message: 'Update Success! 更新时间要求成功!',
              type: 'success'
            })
            this.isFinished = false
            this.$emit('func', this.isFinished)
          }).catch(() => {
            this.$message({
              message: 'Add Failed! 保存时间要求失败!',
              type: 'error'
            })
          })
        }
      }
      this.getTimeManagementByIssueId(this.$props.issueId)
    },
    // 填充所属部门数据
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    toAddMember() {
      this.getDepts()
      this.member = {}
      this.addMemVisible = true
    },
    addTeamMember() {
      this.$refs.form.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          this.member.issueId = this.$props.issueId
          addMember(this.member).then(res => {
            this.$message({
              message: 'Add Member Success! 添加小组成员成功!',
              type: 'success'
            })
            this.addMemVisible = false
            this.isFinished = false
            this.$emit('func', this.isFinished)
            this.getTeamMembersByIssueId(this.$props.issueId)
          }).catch(() => {
            this.$message({
              message: 'Add Failed! 添加小组成员失败!',
              type: 'error'
            })
          })
        }
      })
    },
    // 获取弹窗内文件所属部门数据
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
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
    // 编辑角色之前
    openEditRole(row) {
      this.member.teamRole = row.teamRole
    },
    // 提交编辑角色
    editRole(index, row) {
      if (this.member.teamRole === row.teamRole) {
        this.$message({
          message: 'No changes found, no need to save!未发生改动，无需提交',
          type: 'warning'
        })
        return false
      } else {
        row.teamRole = this.member.teamRole
        editMember(row).then(res => {
          this.$message({
            message: 'Edit Member-Role Success! 变更角色成功!',
            type: 'success'
          })
          this.isFinished = false
          this.$emit('func', this.isFinished)
        })
        this.getTeamMembersByIssueId(this.$props.issueId)
      }
    },
    deleteMember(id) {
      // alert(JSON.stringify(id))
      const data = []
      data.push(id)
      delMember(data).then(res => {
        this.$message({
          message: 'Del Member Success! 删除小组成员成功!',
          type: 'success'
        })
        this.isFinished = false
        this.$emit('func', this.isFinished)
        this.getTeamMembersByIssueId(this.$props.issueId)
      }).catch(() => {
        this.$message({
          message: 'Del Failed! 删除小组成员失败!',
          type: 'error'
        })
      })
    },
    confirmFinished() {
      // 确认D1完成
      this.timeManagement.curStep = 'D1'
      this.timeManagement.d1Status = true
      this.timeManagement.d1Time = new Date()
      editTimeManage(this.timeManagement).then(res => {
        this.confirmVisible = false
        this.isFinished = true
        this.$emit('func', this.isFinished)
        this.$message({
          message: 'Submit Success! D1提交完成!',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-fixed > > .el-table__fixed-right {
  height: 100% !important;
}

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
