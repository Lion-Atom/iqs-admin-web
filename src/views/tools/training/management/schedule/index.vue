<template>
  <div class="app-container" @click="closeMenus">
    <!--快速导航-->
    <div class="head-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/training/overview' }">培训概览</el-breadcrumb-item>
        <el-breadcrumb-item><b>培训计划</b></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--工具栏-->
    <div class="head-container">
      <div
        v-if="crud.props.searchToggle"
      >
        <el-input v-model="query.blurry" clearable size="small" placeholder="输入培训标题、内容、培训人或机构搜索" style="width: 300px;"
                  class="filter-item" @input="crud.toQuery"/>
        <date-range-picker v-model="query.createTime" class="date-item" @input="dateTimeChange()"
                           start-placeholder="录入开始日期"
                           end-placeholder="录入结束日期"/>
        <el-select
          class="filter-item"
          v-model="query.scheduleStatus"
          placeholder="计划状态"
          clearable
          style="width: 120px;"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索
        </el-button>
        <el-button v-if="crud.optShow.reset" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left"
                   @click="crud.resetQuery()">重置
        </el-button>
      </div>
      <crudOperation @func="getPartInfo" :permission="permission"/>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      @selection-change="crud.selectionChangeHandler"
      :row-class-name="tableRowClassName"
      @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="trainTitle" label="培训标题" min-width="140" fixed/>
      <el-table-column prop="trainTime" label="培训时间" min-width="140"/>
      <el-table-column prop="trainer" label="培训员"/>
      <el-table-column prop="trainContent" label="培训内容" :show-overflow-tooltip="true"/>
      <el-table-column prop="trainType" label="培训类型"/>
      <el-table-column label="是否考试" :formatter="isExamFormat"/>
      <el-table-column prop="regDeadline" label="报名截止时间" min-width="140">
        <template slot-scope="scope">
          <span v-if="new Date(scope.row.regDeadline).getTime() < new Date().getTime()"
                style="color: red">{{ scope.row.regDeadline }}</span>
          <span v-else>{{ scope.row.regDeadline }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="trainLocation" label="培训地点" :show-overflow-tooltip="true"/>
      <el-table-column label="培训费用" :formatter="costFormat"/>
      <el-table-column prop="trainIns" label="培训机构" :show-overflow-tooltip="true"/>
      <el-table-column prop="bindDeptStr" label="涉及部门" :show-overflow-tooltip="true"/>
      <el-table-column prop="totalNum" label="人数限制"/>
      <el-table-column prop="curNum" label="现参与人数"/>
      <el-table-column prop="scheduleStatus" label="计划状态"/>
      <el-table-column prop="createBy" label="创建者"/>
      <el-table-column prop="createTime" label="创建日期" min-width="140"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','schedule:edit','schedule:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :disabled-edit="scope.row.scheduleStatus==='已关闭' || !scope.row.hasEditAuthorized"
            :disabled-dle="!scope.row.hasEditAuthorized"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
    <!--表单渲染-->
    <eForm :common-status="dict.common_status" :status-options="statusOptions" :permission="permission"/>
    <!--培训参与者列表-->
    <el-dialog
      title="培训参加者信息"
      :visible.sync="viewPartDialogVisible"
      width="50%">
      <el-table
        ref="parts"
        border
        :data="partList"
        style="width: 100%;"
        @row-dblclick="gotoTarget"
      >
        <el-table-column prop="participantDepartName" label="所属部门"/>
        <el-table-column prop="participantName" label="参与者"/>
        <el-table-column prop="createTime" label="报名日期" min-width="140"/>
        <!--删除操作---暂注释-->
        <!--<el-table-column
                  label="操作"
                  width="80"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-popover
                      :ref="`delStaffFile-popover-${scope.$index}`"
                      v-permission="permission.edit"
                      placement="top"
                      width="180"
                    >
                      <p>确定删除当前参与者吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button
                          size="mini"
                          type="text"
                          @click="scope._self.$refs[`delStaffFile-popover-${scope.$index}`].doClose()"
                        >取消
                        </el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          @click="deleteTrParticipator(scope.row), scope._self.$refs[`delStaffFile-popover-${scope.$index}`].doClose()"
                        >确定
                        </el-button>
                      </div>
                      <el-button
                        slot="reference"
                        v-permission="permission.edit"
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                      />
                    </el-popover>
                  </template>
                </el-table-column>-->
      </el-table>
    </el-dialog>
    <!--培训参与信息V1-->
    <!--    <el-dialog
          title="培训参与信息"
          :before-close="beforeCloseJudge"
          :visible.sync="partDialogVisible"
          width="50%">
          <el-descriptions column="1" border>
            &lt;!&ndash;拟报名列表&ndash;&gt;
            <el-descriptions-item label="拟报名名单">
              <div>
                <el-button type="primary" @click="toAddPart(addPartForm.newPartList)">新增</el-button>
                <el-button style="float: right;" type="success" @click="submitPartList(addPartForm.newPartList)">提交
                </el-button>
                <el-form
                  :model="addPartForm"
                  ref="addPartForm"
                  :rules="addPartForm.addPartRules"
                  :inline="true"
                  class="special-form"
                  label-width="108px"
                >
                  <el-table
                    :data="addPartForm.newPartList"
                    border
                    style="width: 100%"
                    @row-dblclick="dbSelectedRow"
                  >
                    <el-table-column label="序号" width="50">
                      <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                      </template>
                    </el-table-column>
                    <el-table-column width="150">
                      <template slot="header" slot-scope="scope">
                        <span>所在部门</span>
                        <i style="color:#F56C6C;">*</i>
                      </template>
                      <template slot-scope="scope">
                        <el-form-item
                          :prop="'newPartList.' + scope.$index + '.participantDepart'"
                          :rules="addPartForm.addPartRules.participantDepart"
                        >
                          <el-select
                            v-show="scope.row.isEditor"
                            filterable
                            allow-create
                            v-model="scope.row.participantDepart"
                            @change="partDepartChanged(scope.row)"
                          >
                            <el-option
                              v-for="item of availableDeparts"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            >
                            </el-option>
                          </el-select>
                          <span v-show="!scope.row.isEditor">
                                      <el-select
                                        v-model="scope.row.participantDepart"
                                      >
                                      <el-option
                                        v-for="item of availableDeparts"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                      >
                                      </el-option>
                                    </el-select>
                                    </span>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column width="160">
                      <template slot="header" slot-scope="scope">
                        <span>参与者</span>
                        <i style="color:#F56C6C;">*</i>
                      </template>
                      <template slot-scope="scope">
                        <el-form-item
                          :prop="'newPartList.' + scope.$index + '.userId'"
                          :rules="addPartForm.addPartRules.userId"
                        >
                          <el-select
                            v-show="scope.row.isEditor"
                            v-model="scope.row.userId"
                            placeholder="请选择参与人"
                            style="width:100% !important;"
                          >
                            <el-option
                              v-for="item in availUsers"
                              :key="item.id"
                              :label="item.username"
                              :value="item.id"
                              :disabled="existedPartDatas.indexOf(item.id) > -1"
                            />
                          </el-select>
                          <span v-show="!scope.row.isEditor">
                                      <el-select
                                        v-model="scope.row.userId"
                                        placeholder="请选择参与人"
                                        style="width:100% !important;"
                                      >
                                      <el-option
                                        v-for="item in availUsers"
                                        :key="item.id"
                                        :label="item.username"
                                        :value="item.id"
                                      />
                                    </el-select>
                                    </span>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column width="180">
                      <template slot="header" slot-scope="scope">
                        <span>是否生效</span>
                        <i style="color:#F56C6C;">*</i>
                      </template>
                      <template slot-scope="scope">
                        <el-form-item
                          :prop="'newPartList.' + scope.$index + '.isValid'"
                          :rules="addPartForm.addPartRules.isValid"
                        >
                          <el-radio
                            v-show="scope.row.isEditor"
                            v-for="item in dict.dict.common_status"
                            :key="item.id"
                            v-model="partForm.isValid"
                            :label="item.value === 'true'"
                          >
                            {{ item.label }}
                          </el-radio>
                          <span v-show="!scope.row.isEditor">{{ transBoolToStr(scope.row.isValid) }}</span>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        &lt;!&ndash;                  <el-button type="warning" @click="edit(scope.row, scope)">编辑</el-button>&ndash;&gt;
                        &lt;!&ndash;                  <el-button type="success" @click="savePart(scope.row)">保存</el-button>&ndash;&gt;
                        <el-button type="success" @click="deletePart(scope.$index,addPartForm.newPartList)">移除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form>
              </div>
            </el-descriptions-item>
            &lt;!&ndash;已报名人员列表&ndash;&gt;
            <el-descriptions-item label="已报名人员">
              <div @dblclick="beforeInfoClose">
                <div v-if="basicInfoVisible === true">
                  <el-table
                    ref="parts"
                    border
                    :loading="participantLoading"
                    :data="participantList"
                    style="width: 100%;"
                  >
                    <el-table-column label="序号" width="50">
                      <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="participantDepartName" label="所在部门" width="150"/>
                    <el-table-column prop="participantName" label="参与者" width="160"/>
                    <el-table-column prop="isValid" label="是否生效" align="center" width="120">
                      <template slot-scope="scope">
                        <el-switch
                          v-model="scope.row.isValid"
                          active-color="#409EFF"
                          inactive-color="#F56C6C"
                          @change="changeIsValid(scope.row, scope.row.isValid)"
                          :disabled="disChangePartStatus"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建日期"/>
                  </el-table>
                </div>
                <el-button v-else type="text" icon="el-icon-zoom-in" @click="basicInfoVisible = true">参与人员列表
                </el-button>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>-->
    <!--培训报名信息V2-->
    <el-dialog
      title="培训参与信息"
      :before-close="beforeCloseJudgeV2"
      :visible.sync="partDialogVisible"
      width="50%">
      <el-descriptions column="1" border>
        <!--穿梭框-->
        <el-descriptions-item>
          <template slot="label">
            <span>员工报名信息</span><br>
            <span>人数限制：{{ totalNum }}</span>
          </template>
          <el-transfer
            v-model="addParticipantList"
            style="text-align: left; display: inline-block"
            filterable
            :titles="['员工库', '已选']"
            :format="{
                      noChecked: '${total}',
                      hasChecked: '${checked}/${total}'
                    }"
            :data="availPartUsers">
            <!-- 保存操作 转换到培训计划下材料列表中-->
<!--            <el-button class="transfer-footer" slot="right-footer" size="small" type="primary"
                       @click="saveSelectedUser(addParticipantList)">保存
            </el-button>-->
          </el-transfer>
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
    <el-button @click="partDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveSelectedUser(addParticipantList)">提 交</el-button>
  </span>
    </el-dialog>
    <!-- 右键菜单 -->
    <div id="menu" class="menuDiv">
      <ul class="menuUl">
        <li
          v-for="(item, index) in menus"
          :key="index"
          @click.stop="infoClick(index)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import crudSchedule from '@/api/tools/train/schedule'
import eForm from './module/form'
import CRUD, {presenter, header} from '@crud/crud'
import crudOperation from './module/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import {judgeArrIsEqual, validIsNotNull} from "@/utils/validationUtil";
import {
  addPart,
  batchSavePart, batchSavePartV2,
  delPart,
  editPart,
  getPartsByTrScheduleId,
  getTrParticipantByExample
} from "@/api/tools/train/trParticipant";
import {getUserByDeptId, getUserByDeptIds} from "@/api/system/user";
import {getByMethodName} from "@/api/system/timing";

export default {
  name: 'TrainSchedule',
  components: {eForm, crudOperation, pagination, udOperation, DateRangePicker},
  cruds() {
    return CRUD({
      title: '培训计划',
      url: 'api/train/schedule',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudSchedule},
      queryOnPresenterCreated: false
    })
  },
  mixins: [header(), presenter()],
  // 数据字典
  dicts: ['common_status', 'job_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'schedule:add'],
        edit: ['admin', 'schedule:edit'],
        del: ['admin', 'schedule:del']
      },
      viewPartDialogVisible: false,
      partForm: {
        participantDepart: null,
        userId: null,
        isValid: true
      },
      statusOptions: [
        {
          value: '准备中'
        },
        {
          value: '开放中'
        },
        {
          value: '已关闭',
          disabled: true
        },
      ],
      partRules: {
        participantDepart: [
          {required: true, message: '请选/输参与者所在部门', trigger: 'blur'}
        ],
        userId: [
          {required: true, message: '请输入参与者名称', trigger: 'blur'}
        ],
        isValid: [
          {required: true, message: '请确定是否参与', trigger: 'blur'}
        ]
      },
      availableDeparts: [],
      // partLoading: false,
      // parts: []
      cancelJudge: '',
      //右键菜单
      menus: [
        // {name: '报名参加', operType: 1},
        {name: '查看参与者', operType: 2}
      ],
      methodName: 'checkIsToTrain',
      curData: {},
      partList: [],
      partDialogVisible: false,
      participantLoading: false,
      participantList: [],
      basicInfoVisible: true,
      bindingId: null,
      bindDeptDatas: [],
      availUsers: [],
      availPartUsers: [],
      addParticipantList: [],
      existedParticipantList: [],
      addPartForm: {
        newPartList: [
          {
            partId: null,
            trScheduleId: null,
            participantDepart: null,
            userId: null,
            isValid: true,
            isEditor: true
          }
        ],
        addPartRules: {
          participantDepart: [
            {required: true, message: "请选/输入所在部门", trigger: "blur"}
          ],
          userId: [
            {required: true, message: "请选择参与者", trigger: "blur"}
          ],
          isValid: [
            {required: true, message: "请确定是否生效", trigger: "blur"}
          ]
        }
      },
      existedParts: [],
      existedPartDatas: [],
      disChangePartStatus: false,
      totalNum: 0
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created() {
    this.flushTrainTip()
  },
  mounted() {

  },
  methods: {
    // 调用同步-重新拉取走查培训提示信息
    flushTrainTip() {
      getByMethodName(this.methodName).then(res => {
        this.crud.toQuery()
      })
    },
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 布尔值转换
    transBoolToStr(flag) {
      if (flag.toString() === 'true') {
        return '是'
      } else {
        return '否'
      }
    },
    // 下次考试日期格式化
    nextExamDateFormat(row, col) {
      if (validIsNotNull(row.nextExamDate)) {
        return row.nextExamDate
      } else {
        return '--'
      }
    },
    // 根据部门获取部门下成员
    partDepartChanged(row) {
      // alert(JSON.stringify(row))
      this.availUsers = []
      // 根据部门获取培训计划已有成员数据
      this.getExistedPartByExample(row)
      // 根据部门获取部门成员数据
      setTimeout(() => {
        getUserByDeptId({deptId: row.participantDepart}).then(res => {
          // alert(JSON.stringify(res))
          this.availUsers = res
          if (this.availUsers.length > 0) {
            // 若不是同部门成员则需要默认切换到首选默认值
            let userIds = []
            this.availUsers.forEach((data, index) => {
              userIds.push(data.id)
            })
            if (validIsNotNull(row.userId)) {
              if (userIds.indexOf(row.userId) === -1) {
                row.userId = null
              }
            } else {
              // 若原无值则设置首选默认值
              row.userId = null
            }
            // alert(userIds.indexOf(this.form.acceptBy))
          } else {
            row.userId = null
          }
        })
      }, 300)
    },
    // 根据部门和培训计划查询已报名成员
    getExistedPartByExample(row) {
      this.existedParts = []
      this.existedPartDatas = []
      // 已落库的已存在数据
      if (this.participantList.length > 0) {
        this.participantList.forEach((data, index) => {
          if (data.participantDepart === row.participantDepart) {
            this.existedPartDatas.push(data.userId)
          }
        })
      }
      // alert(JSON.stringify(this.addPartForm.newPartList))
      // 尚未保存表格中存在
      if (this.addPartForm.newPartList.length > 0) {
        this.addPartForm.newPartList.forEach((data, index) => {
          if (data.participantDepart === row.participantDepart) {
            this.existedPartDatas.push(data.userId)
          }
        })
      }
    },
    costFormat(row, col) {
      if (validIsNotNull(row.cost)) {
        return row.cost + '元'
      } else {
        return '--'
      }
    },
    // 根据有效期设置提醒样式
    tableRowClassName({row, rowIndex}) {
      const type = row.scheduleStatus
      if (validIsNotNull(type)) {
        if (type === '已关闭') {
          return 'alert-row'
        } else if (type === '开放中') {
          return null
        }
      } else {
        return ''
      }
    },
    submitPartList(newPartList) {
      if (newPartList.length > 0) {
        newPartList.forEach((data, index) => {
          data.trScheduleId = this.bindingId
        })
        this.$refs["addPartForm"].validate(valid => {
          if (valid) {
            batchSavePart(newPartList).then(res => {
              this.crud.notify('添加成功', 'success')
              this.crud.toQuery()
              this.getParticipant(this.bindingId)
              this.basicInfoVisible = true
              this.addPartForm.newPartList = []
              if (this.$refs['addPartForm'] !== undefined) {
                this.$refs['addPartForm'].resetFields()
              }
            })
          } else {
            return false;
          }
        });
      }
    },
    // 获取参与者信息
    getParticipantV2(scheduleId) {
      this.addParticipantList = []
      this.existedParticipantList = []
      getPartsByTrScheduleId(scheduleId).then(res => {
        // alert(JSON.stringify(res))
        res.forEach((data, index) => {
          // 获取现有
          this.existedParticipantList.push(data.userId)
          this.addParticipantList.push(data.userId)
        })
        // alert(JSON.stringify(this.addParticipantList))
      })
    },
    // 获取参与者信息
    getParticipant(scheduleId) {
      this.partList = []
      this.participantList = []
      this.participantLoading = true
      getPartsByTrScheduleId(scheduleId).then(res => {
        this.participantList = res
        this.participantLoading = false
        this.participantList.forEach((data, index) => {
          if (data.isValid) {
            this.partList.push(data)
          }
        })
      })
    },
    // 改变状态
    changeIsValid(data, val) {
      let cancelJudge = this.dict.label.job_status[val] === '启用' ? '申请参与' : '撤销参与'
      this.$confirm('此操作将 "' + cancelJudge + '" ' + '此次' + data.participantName + '培训, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        editPart(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(cancelJudge + '成功', 'success')
          this.crud.resetQuery()
        }).catch(err => {
          data.isValid = !data.isValid
          console.log(err.data.message)
        })
      }).catch(() => {
        data.isValid = !data.isValid
      })
    },
    // table的右键点击当前行事件
    rightClick(row, column, event) {
      // alert(1)
      this.curData = {}
      let menu = document.querySelector("#menu");
      //阻止元素发生默认的行为
      event.preventDefault();
      // 根据事件对象中鼠标点击的位置，进行定位
      menu.style.left = event.clientX + 10 + "px";
      menu.style.top = event.clientY - 30 + "px";
      // 改变自定义菜单的隐藏与显示
      menu.style.display = "block";
      menu.style.zIndex = 1000;
      this.curData = row
    },
    // table的左键点击当前行事件
    closeMenus() {
      let menu = document.querySelector("#menu");
      menu.style.display = "none";
    },
    // 自定义菜单的点击事件
    infoClick(index) {
      // 暂注释单条添加参与者功能
      // if (index === 0) {
      //   // do something
      //   if (this.curData.scheduleStatus === '已关闭' || new Date(this.curData.regDeadline).getTime() < new Date().getTime()) {
      //     this.crud.notify('无效操作，报名时间已过！', 'warning')
      //   } else {
      //     this.openPartDialog(this.curData)
      //   }
      // } else if (index === 1) {
      // this.openPartDialog(this.curData)
      this.partList = this.curData.partList
      this.viewPartDialogVisible = true
      // }
      let menu = document.querySelector("#menu");
      menu.style.display = "none";
    },
    // 获取报名信息
    getPartInfo(msg) {
      // alert(JSON.stringify(msg))
      this.partDialogVisible = msg.partDialogVisible
      this.viewPartDialogVisible = msg.viewPartDialogVisible
      this.basicInfoVisible = false
      this.curData = msg.curData
      this.disChangePartStatus = new Date(msg.curData.regDeadline).getTime() < new Date().getTime()
      // this.participantList = msg.curData.partList
      this.availableDeparts = msg.curData.bindDepts
      this.bindingId = msg.curData.id
      this.totalNum = msg.curData.totalNum
      this.addPartForm.newPartList = []
      // alert(JSON.stringify(this.availableDeparts))
      // 获取所有员工信息
      this.getAvailUserByDeptIds(this.availableDeparts)
      // 获取穿梭框内已有数据
      this.addParticipantList = []
      this.getParticipantV2(this.bindingId)
      // 获取已报名列表
      this.getParticipant(this.bindingId)
    },
    beforeInfoClose() {
      this.$confirm('确认缩放参与者列表？')
        .then(_ => {
          this.basicInfoVisible = false
        })
        .catch(_ => {
        })
    },
    // 删除参与者
    deleteTrParticipator(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delPart(data).then(res => {
        this.$message({
          message: 'Del Participator Success! 删除参与者信息成功!',
          type: 'success'
        })
      })
    },
    // 新增参与者信息
    toAddPart(tableData, e) {
      // alert(JSON.stringify(this.newPartList))
      // 新增前判断是否通过校验
      tableData.push({
        partId: null,
        trScheduleId: this.bindingId,
        participantDepart: null,
        userId: null,
        isValid: true,
        isEditor: true
      })
    },
    // 关闭参与信息V1之前
    beforeCloseJudge() {
      // alert(JSON.stringify(this.addPartForm.newPartList))
      if (this.addPartForm.newPartList.length > 0) {
        this.$confirm('存在新增项目，仍要关闭？')
          .then(_ => {
            this.partDialogVisible = false
            if (this.$refs['addPartForm'] !== undefined) {
              this.$refs['addPartForm'].resetFields()
            }
          })
          .catch(_ => {
          })
      } else {
        this.partDialogVisible = false
      }
    },
    beforeCloseJudgeV2() {
      // alert(JSON.stringify(this.addPartForm.newPartList))
      // 判断是否发生了变化
      if (!judgeArrIsEqual(this.existedParticipantList, this.addParticipantList)) {
        this.$confirm('报名人员发生变化，仍要关闭？')
          .then(_ => {
            this.partDialogVisible = false
          })
          .catch(_ => {
          })
      } else {
        this.partDialogVisible = false
      }
    },
    dbSelectedRow(row, index) {
      row.isEditor = !row.isEditor
    },
    // 移除备件信息
    deletePart(index, rows) {
      rows.splice(index, 1)
    },
    isExamFormat(row, col) {
      if (row.isExam.toString() === 'true') {
        return '是'
      } else {
        return '否'
      }
    },
    gotoTarget(row) {
      if (row.isExam.toString() === 'true') {
        this.$router.push(
          {
            path: '/training/train-exam/detail',
            query: {
              departId: row.participantDepart,
              departName: row.participantDepartName
            }
          })
      } else {
        this.$router.push(
          {
            path: '/training/manage/newStaff',
            query: {}
          })
      }
    },
    // 获取可选参加培训的员工列表
    getAvailUserByDeptIds(availableDeparts) {
      // alert(JSON.stringify(availableDeparts))
      let deptIds = []
      availableDeparts.forEach((data, index) => {
        deptIds.push(data.id)
      })
      // alert(JSON.stringify(deptIds))
      this.availPartUsers = []
      getUserByDeptIds(deptIds).then(res => {
        // alert(JSON.stringify(res))
        res.forEach((user, index) => {
          this.availPartUsers.push({
            label: user.dept.name + '-' + user.username,
            //这里的key值一定要是index，否则目标列表无法显示
            key: user.id
          })
        })
      })
    },
    // 保存参与员工报名信息
    saveSelectedUser(parts) {
      // alert(JSON.stringify(this.bindingId))
      // alert(JSON.stringify(parts))
      let toAddPartList = []
      parts.forEach((data, index) => {
        toAddPartList.push({trScheduleId: this.bindingId, userId: data,})
      })
      // alert(JSON.stringify(toAddPartList))
      batchSavePartV2(toAddPartList).then(res => {
        this.crud.notify('报名成功', 'success')
        this.existedParticipantList = parts
        setTimeout(() => {
          this.partDialogVisible = false
          this.crud.toQuery()
        })
      })
    }
  }
}
</script>
<style>
.el-table .alert-row {
  color: #C0C0C0;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
> > > .special-form .el-form-item--small.el-form-item {
  margin-bottom: 0 !important;
}

.transfer-footer {
  margin-left: 15px;
}

.menuDiv {
  display: none;
  position: absolute;

  .menuUl {
    height: auto;
    width: auto;
    font-size: 14px;
    text-align: left;
    border-radius: 3px;
    border: none;
    background-color: #c4c4c4;
    color: #fff;
    list-style: none;
    padding: 0 10px;

    li {
      width: 140px;
      height: 35px;
      line-height: 35px;
      cursor: pointer;
      border-bottom: 1px solid rgba(255, 255, 255, 0.47);

      &:hover {
        // background-color: rgb(26, 117, 158);
        color: rgb(54, 138, 175);
      }
    }
  }
}

</style>
