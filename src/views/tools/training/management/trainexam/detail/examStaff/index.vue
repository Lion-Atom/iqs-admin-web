<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <div
        v-if="crud.props.searchToggle"
      >
        <el-select
          class="filter-item"
          size="small"
          v-model="query.trScheduleId"
          placeholder="请选择培训项目"
          style="width: 200px;"
          filterable
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in schedules"
            :key="item.id"
            :label="item.trainTitle "
            :value="item.id"
          />
        </el-select>
        <el-input v-model="query.blurry" clearable size="small" placeholder="输入名字、车间、工种等搜索" style="width: 220px;"
                  class="filter-item" @input="crud.toQuery"/>
        <el-input v-model="query.departId" v-show="false"/>
        <date-range-picker v-model="query.createTime" class="date-item" @input="dateTimeChange()"
                           start-placeholder="录入开始日期"
                           end-placeholder="录入结束日期"/>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索
        </el-button>
        <el-button v-if="crud.optShow.reset" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left"
                   @click="resetNewQuery">重置
        </el-button>
      </div>
      <crudOperation :permission="permission"/>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler" @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="staffName" label="员工姓名" fixed/>
      <el-table-column prop="jobName" label="岗位"/>
      <el-table-column prop="superior" label="上级主管"/>
      <el-table-column prop="staffType" label="员工类型"/>
      <el-table-column prop="jobType" label="工种"/>
      <el-table-column prop="workshop" label="车间" min-width="100"/>
      <el-table-column prop="trainTitle" label="培训项目" :show-overflow-tooltip="true"/>
      <el-table-column prop="lastExamDate" label="考试日期" min-width="140"/>
      <el-table-column prop="lastExamContent" label="考试内容" :show-overflow-tooltip="true"/>
      <el-table-column prop="lastScore" label="考试分数" min-width="70"/>
      <el-table-column label="考试结果" min-width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.lastExamDate && scope.row.isPassed.toString() === 'true'" type="success">通过</el-tag>
          <el-tag v-else-if="scope.row.lastExamDate && scope.row.isPassed.toString() === 'false'" type="danger">未通过
          </el-tag>
          <el-tag v-else-if="scope.row.isAuthorize.toString()==='true'" type="primary">已培训，待考试</el-tag>
          <el-tag v-else type="warning">培训尚未开始</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="下次考试日期" :formatter="nextExamDateFormat" min-width="140"/>
      <el-table-column prop="lastExamDesc" label="备注" :show-overflow-tooltip="true"/>
      <el-table-column prop="createTime" label="创建日期" min-width="140"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','exam:edit','exam:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :show-del="false"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
    <!--表单渲染-->
    <eForm :depart-id="departId" :exam-status="dict.common_status" :type-options="typeOptions"
           :permission="permission"/>
  </div>
</template>

<script>
import crudExamStaff from '@/api/tools/train/examStaff'
import eForm from './module/form'
import CRUD, {presenter, header} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import {validIsNotNull} from "@/utils/validationUtil";
import {getAllSchedule} from "@/api/tools/train/schedule";

export default {
  props: {
    departId: {
      type: Number,
      required: true
    }
  },
  name: 'TrainExamStaff',
  components: {eForm, crudOperation, pagination, udOperation, DateRangePicker},
  cruds() {
    return CRUD({
      title: '培训考试',
      url: 'api/train/examStaff',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudExamStaff},
      queryOnPresenterCreated: false
    })
  },
  mixins: [header(), presenter()],
  // 数据字典
  dicts: ['common_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'exam:add'],
        edit: ['admin', 'exam:edit'],
        del: ['admin', 'exam:del']
      },
      typeOptions: [
        {
          label: 'DL',
          value: '直接员工'
        },
        {
          label: 'IDL',
          value: '间接员工'
        }
      ],
      schedules: []
    }
  },
  created() {
    this.query.departId = this.$props.departId
    this.crud.optShow = {
      add: false,
      edit: true,
      del: false,
      download: true,
      reset: true
    }
    this.getAllSchedule()
  },
  mounted() {
    this.crud.toQuery()
  },
  methods: {
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 获取所有的培训计划
    getAllSchedule() {
      this.schedules = []
      getAllSchedule().then(res => {
        // alert(JSON.stringify(res))
        this.schedules = res.content
      })
    },
    // 重置查询
    resetNewQuery() {
      this.crud.resetQuery(false)
      this.query.departId = this.$props.departId
      this.crud.toQuery()
    },
    // 下次考试日期格式化
    nextExamDateFormat(row, col) {
      // alert(row.isPassed)
      if (validIsNotNull(row.nextExamDate)) {
        return row.nextExamDate
      } else {
        return '--'
      }
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
