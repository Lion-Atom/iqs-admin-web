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
          <el-row v-if="!isNeed" class="elRow">
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
    <!--时间要求-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">时间要求
          <el-button
          v-if="isNeed"
          size="mini"
          type="text"
          icon="el-icon-refresh-left"
          @click="refreshTimeMange"
          >
          </el-button>
        </span>
        <el-button
          v-if="isNeed"
          style="float: right; padding: 3px 0"
          type="text"
          @click="saveTimeManagement(timeManagement)"
        >保存
        </el-button>
      </div>
      <div>
        <el-form ref="timeManage" :inline="true" :model="timeManagement" class="demo-form-inline">
          <!--预计步骤1-->
          <el-row>
            <el-col :span="12">
              <el-form-item label="预计完成步骤 :" prop="planStep1">
                <el-select
                  v-if="isNeed"
                  v-model="timeManagement.planStep1"
                  placeholder="选择预期要完成的步骤"
                  clearable
                  :disabled="!isNeed"
                  @change="firstStepChange"
                >
                  <el-option
                    v-for="item in resultTypeOptions"
                    :key="item.key"
                    :label="item.display_name"
                    :value="item.key"
                  />
                </el-select>
                <span v-if="!isNeed">{{transNullFormat(timeManagement.planStep1)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计完成时间 :" prop="planTime1">
                <el-date-picker
                  v-if="isNeed"
                  v-model="timeManagement.planTime1"
                  type="datetime"
                  style="width: 200px;"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
                  :disabled="!isNeed"
                  @change="firstTimeChange"
                />
                <span v-if="!isNeed">{{transNullFormat(timeManagement.planTime1)}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <!--预计步骤2-->
          <el-row>
            <el-col :span="12">
              <el-form-item label="预计完成步骤 :" prop="planStep1">
                <el-select
                  v-if="isNeed"
                  v-model="timeManagement.planStep2"
                  :disabled="!isNeed"
                  clearable
                  placeholder="选择预期要完成的步骤"
                  @change="secStepChange"
                >
                  <el-option
                    v-for="item in resultTypeOptions"
                    :key="item.key"
                    :label="item.display_name"
                    :value="item.key"
                    :disabled="!isNeed"
                  />
                </el-select>
                <span v-if="!isNeed">{{transNullFormat(timeManagement.planStep2)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计完成时间 :" prop="planTime1">
                <el-date-picker
                  v-if="isNeed"
                  v-model="timeManagement.planTime2"
                  type="datetime"
                  style="width: 200px;"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
                  :disabled="!isNeed"
                  @change="secTimeChange"
                />
                <span v-if="!isNeed">{{transNullFormat(timeManagement.planTime2)}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <!--预计步骤3-->
          <el-row>
            <el-col :span="12">
              <el-form-item label="预计完成步骤 :" prop="planStep1">
                <el-select
                  v-if="isNeed"
                  v-model="timeManagement.planStep3"
                  clearable
                  placeholder="选择预期要完成的步骤"
                  :disabled="!isNeed"
                  @change="thirdStepChange"
                >
                  <el-option
                    v-for="item in resultTypeOptions"
                    :key="item.key"
                    :label="item.display_name"
                    :value="item.key"
                    :disabled="!isNeed"
                  />
                </el-select>
                <span v-if="!isNeed">{{transNullFormat(timeManagement.planStep3)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计完成时间 :" prop="planTime1">
                <el-date-picker
                  v-if="isNeed"
                  v-model="timeManagement.planTime3"
                  type="datetime"
                  style="width: 200px;"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
                  :disabled="!isNeed"
                  @change="thirdTimeChange"
                />
                <span v-if="!isNeed">{{transNullFormat(timeManagement.planTime3)}}</span>
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
            :options="options"
            style="width: 190px"
            placeholder="选择人员所属部门"
          />
        </el-form-item>
        <!--        <el-form-item label="第一步：选择部门" prop="deptName">
                  <treeselect
                    v-model="member.deptId"
                    :options="depts"
                    :load-options="loadDepts"
                    style="width: 190px"
                    placeholder="选择人员所属部门"
                  />
                </el-form-item>-->
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
            <el-option
              v-for="item in roleTypeOptions"
              :key="item.key"
              :label="item.display_name"
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
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="toAddMember">增加新成员</el-button>
      </div>
      <div>
        <el-table
          ref="table"
          v-loading="teamLoading"
          :data="members"
          style="width: 100%;"
        >
          <el-table-column prop="companyName" label="公司名称" width="150"/>
          <el-table-column prop="deptName" label="部门名称"/>
          <el-table-column prop="userName" label="组员"/>
          <el-table-column prop="phone" label="联系电话"/>
          <el-table-column prop="email" label="电子邮箱"/>
          <el-table-column prop="teamRole" label="成员角色"/>
          <!--   编辑与删除   -->
          <el-table-column
            v-if="isNeed"
            label="操作"
            width="130px"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <!--编辑-->
                <el-popover
                  :ref="`editRole-popover-${scope.$index}`"
                  v-permission="permission.edit"
                  placement="left"
                  width="300"
                  title="编辑角色"
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
                        <el-option
                          v-for="item in roleTypeOptions"
                          :key="item.key"
                          :label="item.display_name"
                          :value="item.key"
                        />
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="scope._self.$refs[`editRole-popover-${scope.$index}`].doClose()"
                    >取消
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="editRole(scope.$index,scope.row), scope._self.$refs[`editRole-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    v-permission="permission.edit"
                    :disabled="scope.row.isLeader === true"
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="openEditRole(scope.row)"
                  />
                </el-popover>
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
                      @click="deleteMember(scope.row.id), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    v-permission="permission.del"
                    :disabled="scope.row.isLeader === true"
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

import { addTimeManage, editTimeManage, getByIssueId } from '@/api/tools/timeManagement'
import { getIssueById } from '@/api/tools/issue'
import { getUserByDeptId } from '@/api/system/user'
import { addMember, delMember, editMember, getMembersByIssueId } from '@/api/tools/teamMember'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { getDepts, getDeptTree } from '@/api/system/dept'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GMTToStr, judgeIsEqual, validIsMatch, validIsNotNull} from '@/utils/validationUtil'
// import ConfirmFinish from '@/views/tools/8D/module/ConfirmFinish'

export default {
  name: 'FirstForm',
  components: { Treeselect },
  props: ['issueId', 'needConfirm'],
  data() {
    return {
      permission: {
        add: ['admin', 'd:management'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      isNeed: true,
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
      isFinished: false,
      options: [],
      oldStep1: null,
      oldTime1: null,
      oldStep2: null,
      oldTime2: null,
      oldStep3: null,
      oldTime3: null,
      step1Change: false,
      step2Change: false,
      step3Change: false,
      time1Change: false,
      time2Change: false,
      time3Change: false,
      noChanged: true
    }
  },
  watch: {
    // 监听deptId
    'member.deptId': 'currDeptChange'
  },
  created() {

  },
  mounted: function() {
    this.isNeed = this.$props.needConfirm === undefined ? true : this.$props.needConfirm
    this.getIssueInfoById(this.$props.issueId)
    this.getTeamMembersByIssueId(this.$props.issueId)
    this.getTimeManagementByIssueId(this.$props.issueId)
    this.getTopDept()
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
    // 刷新时间要求
    refreshTimeMange(){
      this.noChanged = true
      this.getTimeManagementByIssueId(this.$props.issueId)
    },
    // 获取问题基本信息
    getIssueInfoById(id) {
      getIssueById(id).then(res => {
        this.form = res
      })
    },
    // 获取所在公司的部门树结构
    getTopDept() {
      getDeptTree().then(res => {
        this.options = res.content
      })
    },
    getTimeManagementByIssueId(id) {
      this.timeManagement = {}
      getByIssueId(id).then(res => {
        this.timeManagement = res
        this.oldStep1 = res.planStep1
        this.oldTime1 = res.planTime1
        this.oldStep2 = res.planStep2
        this.oldTime2 = res.planTime2
        this.oldStep3 = res.planStep3
        this.oldTime3 = res.planTime3
        if (res.d1Status) {
          this.isFinished = true
        }
      })
    },
    getTeamMembersByIssueId(id) {
      this.teamLoading = true
      this.members = []
      getMembersByIssueId(id).then(res => {
        console.log(res)
        this.members = res.content
      })
      this.teamLoading = false
    },
    saveTimeManagement(timeData) {
      console.log(timeData)
      // 提交前验证
      let val = true
      const step1 = this.timeManagement.planStep1
      const step2 = this.timeManagement.planStep2
      const step3 = this.timeManagement.planStep3
      const time1 = this.timeManagement.planTime1
      const time2 = this.timeManagement.planTime2
      const time3 = this.timeManagement.planTime3

      // alert("原步骤："+this.oldStep1+"新步骤："+ step1 +"新旧对比："+judgeIsEqual(step1, this.oldStep1) )
      // alert("原步骤："+this.oldStep2+"新旧对比："+judgeIsEqual(step2, this.oldStep2) )
      // alert("原步骤："+this.oldStep3+"新旧对比："+judgeIsEqual(step3, this.oldStep3) )
      // alert(!validTwo(step1, time1))
      if (!validIsMatch(step1, time1) ||
        !validIsMatch(step2, time2) ||
        !validIsMatch(step3, time3)) {
        this.$message({
          message: '设置预计完成步骤与对应的预计时间不可单独填写!',
          type: 'warning'
        })
        val = false
      } else if (((validIsNotNull(step1) && validIsNotNull(step2)) && step1 === step2) ||
        ((validIsNotNull(step1) && validIsNotNull(step3)) && step1 === step3) ||
        ((validIsNotNull(step2) && validIsNotNull(step3)) && step2 === step3)) {
        this.$message({
          message: '请不要设置重复步骤!',
          type: 'warning'
        })
        val = false
      } else if (
        judgeIsEqual(step1, this.oldStep1) && judgeIsEqual(time1, this.oldTime1) &&
        judgeIsEqual(step2, this.oldStep2) && judgeIsEqual(time2, this.oldTime2) &&
        judgeIsEqual(step3, this.oldStep3) && judgeIsEqual(time3, this.oldTime3)
      ) {
        this.$message.warning('没有发生变动，无需保存！')
        val = false
      }
      if (val) {
        timeData.curStep = 'D1'
        timeData.d1Status = false
        if (timeData.id === undefined) {
          timeData.issueId = this.$props.issueId
          addTimeManage(timeData).then(res => {
            this.getTimeManagementByIssueId(this.$props.issueId)
            setTimeout(() => {
              this.$message.success('Add Success! 保存时间要求成功!')
            }, 600)
            this.isFinished = false
            this.noChanged = true
            this.$emit('func', this.isFinished)
          }).catch(() => {
            this.$message({
              message: 'Add Failed! 保存时间要求失败!',
              type: 'error'
            })
          })
        } else {
          editTimeManage(timeData).then(res => {
            this.getTimeManagementByIssueId(this.$props.issueId)
            setTimeout(() => {
              this.$message.success('Update Success! 更新时间要求成功!')
            }, 600)
            this.isFinished = false
            this.noChanged = true
            this.$emit('func', this.isFinished)
          }).catch(() => {
            this.$message({
              message: 'Add Failed! 保存时间要求失败!',
              type: 'error'
            })
          })
        }
      }
    },
    firstStepChange(val) {
      this.step1Change = !judgeIsEqual(val, this.oldStep1)
      this.judgeChange()
    },
    firstTimeChange(val) {
      this.time1Change = !judgeIsEqual(GMTToStr(val), this.oldTime1)
      this.judgeChange()
    },
    secStepChange(val) {
      this.step2Change = !judgeIsEqual(val, this.oldStep2)
      this.judgeChange()
    },
    secTimeChange(val) {
      this.time2Change = !judgeIsEqual(GMTToStr(val), this.oldTime2)
      this.judgeChange()
    },
    thirdStepChange(val) {
      this.step3Change = !judgeIsEqual(val, this.oldStep3)
      this.judgeChange()
    },
    thirdTimeChange(val) {
      this.time3Change = !judgeIsEqual(GMTToStr(val), this.oldTime3)
      this.judgeChange()
    },
    // 判断界面输入有无变化
    judgeChange() {
      this.noChanged = !(this.step1Change || this.step2Change || this.step3Change ||
        this.time1Change || this.time2Change || this.time3Change)
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
        }).catch(() => {
          this.getTeamMembersByIssueId(this.$props.issueId)
        })
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
        /* this.$message({
          message: 'Del Failed! 删除小组成员失败!',
          type: 'error'
        })*/
        this.getTeamMembersByIssueId(this.$props.issueId)
      })
    },
    confirmFinished() {
      // 如果有变化
      if (!this.noChanged) {
        this.$confirm('检测到【时间要求】发生了变化，是否一并保存？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        })
          .then(() => {
            this.finishStep()
          })
          .catch(() => {
            // 取消保存时间要求
            this.timeManagement = {}
            getByIssueId(this.$props.issueId).then(res => {
              this.timeManagement = res
              // 确认D1完成
              this.timeManagement.curStep = 'D1'
              this.timeManagement.d1Status = true
              this.timeManagement.d1Time = new Date()
              editTimeManage(this.timeManagement).then(res => {
                this.confirmVisible = false
                this.isFinished = true
                this.noChanged = true
                this.$emit('func', this.isFinished)
                this.$message({
                  message: 'Submit Success! D1提交完成!',
                  type: 'success'
                })
              })
            })

          })
      } else {
        this.finishStep()
      }

    },
    finishStep(){
      // 确认D1完成
      this.timeManagement.curStep = 'D1'
      this.timeManagement.d1Status = true
      this.timeManagement.d1Time = new Date()
      editTimeManage(this.timeManagement).then(res => {
        this.confirmVisible = false
        this.isFinished = true
        this.noChanged = true
        this.$emit('func', this.isFinished)
        this.$message({
          message: 'Submit Success! D1提交完成!',
          type: 'success'
        })
      })
    },
    transNullFormat(val){
      if (val === '' || val === undefined || val === null) {
        return '--'
      } else {
        return val
      }
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
  margin-bottom: 14px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}
</style>
