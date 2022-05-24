<template>
  <div class="app-container">
    <!--快速导航-->
    <div class="head-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/training/management' }">培训概览</el-breadcrumb-item>
        <el-breadcrumb-item><b>培训日程安排</b></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--工具栏-->
    <div class="head-container">
      <div
        v-if="crud.props.searchToggle"
      >
        <el-input v-model="query.blurry" clearable size="small" placeholder="输入标题、部门、培训人、机构等搜索" style="width: 220px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"/>
        <date-range-picker v-model="query.createTime" class="date-item" @input="dateTimeChange()"
                           start-placeholder="录入开始日期"
                           end-placeholder="录入结束日期"/>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索
        </el-button>
        <el-button v-if="crud.optShow.reset" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left"
                   @click="crud.resetQuery()">重置
        </el-button>
      </div>
      <crudOperation :permission="permission"/>
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
      <el-table-column prop="trainTitle" label="培训标题" min-width="120" fixed/>
      <el-table-column prop="trainTime" label="培训时间" min-width="140"/>
      <el-table-column prop="trainer" label="培训员"/>
      <el-table-column prop="trainContent" label="培训内容" :show-overflow-tooltip="true"/>
      <el-table-column prop="trainType" label="培训类型"/>
      <el-table-column prop="regDeadline" label="报名截止时间" min-width="140"/>
      <el-table-column prop="trainLocation" label="培训地点" :show-overflow-tooltip="true"/>
      <el-table-column label="培训费用" :formatter="costFormat"/>
      <el-table-column prop="trainIns" label="培训机构" :show-overflow-tooltip="true"/>
      <el-table-column prop="department" label="涉及部门" :show-overflow-tooltip="true"/>
      <el-table-column prop="totalNum" label="人数限制"/>
      <!--todo 现与会人数，支持点击参与培训-->
      <el-table-column label="现与会人数">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" placement="right-start">
            <div slot="content">
              <el-table
                ref="parts"
                border
                :data="scope.row.partList"
                style="width: 100%;"
              >
                <el-table-column prop="participantDepart" label="所属部门"/>
                <el-table-column prop="participantName" label="参与者"/>
                <el-table-column prop="isValid" label="是否参与" align="center">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.isValid"
                      active-color="#409EFF"
                      inactive-color="#F56C6C"
                      @change="changeIsValid(scope.row, scope.row.isValid)"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建日期" min-width="140"/>
              </el-table>
            </div>
            <el-button
              :disabled="scope.row.scheduleStatus === '已关闭' || new Date(scope.row.regDeadline).getTime() < new Date().getTime()"
              type="success" size="small" plain @click="openPartDialog(scope.row)">{{ scope.row.curNum }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="scheduleStatus" label="日程状态"/>
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
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
    <!--表单渲染-->
    <eForm :common-status="dict.common_status" :permission="permission"/>
    <el-dialog
      title="添加培训参加者信息"
      :visible.sync="partDialogVisible"
      :before-close="handleClose"
      width="50%">
      <div>
        <el-form
          ref="partForm"
          :model="partForm"
          :rules="partRules"
          size="small"
          label-width="80px"
        >
          <!--培训日程安排信息-->
          <el-row :gutter="20" type="flex" class="el-row">
            <el-col :span="8">
              <el-form-item label="所在部门" prop="participantDepart">
                <el-select
                  filterable
                  allow-create
                  v-model="partForm.participantDepart">
                  <el-option
                    v-for="item of availableDeparts"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="参与人员" prop="participantName">
                <el-input v-model="partForm.participantName" placeholder="请填写培训人" style="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="确认参与" prop="isValid">
                <el-radio
                  v-for="item in dict.dict.common_status"
                  :key="item.id"
                  v-model="partForm.isValid"
                  :label="item.value === 'true'"
                >
                  {{ item.label }}
                </el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancelSubmitPart">取 消</el-button>
    <el-button type="primary" @click="submitPart">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import crudSchedule from '@/api/tools/train/schedule'
import eForm from './module/form'
import CRUD, {presenter, header} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import {validIsNotNull} from "@/utils/validationUtil";
import {addPart, editPart, getPartsByTrScheduleId} from "@/api/tools/train/trParticipant";

export default {
  name: 'TrainSchedule',
  components: {eForm, crudOperation, pagination, udOperation, DateRangePicker},
  cruds() {
    return CRUD({
      title: '培训日程安排',
      url: 'api/train/schedule',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudSchedule}
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
      partDialogVisible: false,
      partForm: {
        participantDepart: null,
        participantName: null,
        isValid: true
      },
      partRules: {
        participantDepart: [
          {required: true, message: '请选/输参与者所在部门', trigger: 'blur'}
        ],
        participantName: [
          {required: true, message: '请输入参与者名称', trigger: 'blur'}
        ],
        isValid: [
          {required: true, message: '请确定是否参与', trigger: 'blur'}
        ]
      },
      availableDeparts: [],
      // partLoading: false,
      // parts: []
      cancelJudge: ''
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 下次考试日期格式化
    nextExamDateFormat(row, col) {
      if (validIsNotNull(row.nextExamDate)) {
        return row.nextExamDate
      } else {
        return '--'
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
    // 打开参与会议人员界面
    openPartDialog(data) {
      // alert(JSON.stringify(data))
      this.availableDeparts = []
      this.partDialogVisible = true
      // this.getParticipant(data.id)
      this.partForm.trScheduleId = data.id
      this.availableDeparts = data.departTags
    },
    // 获取参与者信息
    /*getParticipant(trScheduleId) {
      this.partLoading = true
      this.parts = []
      // 查询参与者信息
      getPartsByTrScheduleId(trScheduleId).then(res => {
        this.parts = res
        this.partLoading = false
      })
    },*/
    // 取消参与本次培训
    cancelSubmitPart() {
      if (this.$refs['partForm'] !== undefined) {
        this.$refs['partForm'].resetFields()
      }
      this.partDialogVisible = false
      this.crud.resetQuery()
    },
    // 关闭前操作
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          if (this.$refs['partForm'] !== undefined) {
            this.$refs['partForm'].resetFields()
          }
        })
        .catch(_ => {});
    },
    // 提交培训参与者信息
    submitPart() {
      addPart(this.partForm).then(res => {
        this.crud.notify('添加成功', 'success')
        // this.getParticipant(this.partForm.trScheduleId)
        this.partDialogVisible = false
        if (this.$refs['partForm'] !== undefined) {
          this.$refs['partForm'].resetFields()
        }
        this.crud.resetQuery()
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
</style>
