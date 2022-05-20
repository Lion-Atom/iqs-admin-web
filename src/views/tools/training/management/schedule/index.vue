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
      <el-table-column prop="trainer" label="培训员" />
      <el-table-column prop="trainContent" label="培训内容" :show-overflow-tooltip="true" />
      <el-table-column prop="trainType" label="培训类型" />
      <el-table-column prop="regDeadline" label="报名截止时间" min-width="140"/>
      <el-table-column prop="trainLocation" label="培训地点" :show-overflow-tooltip="true"/>
      <el-table-column label="培训费用" :formatter="costFormat"/>
      <el-table-column prop="trainIns" label="培训机构" :show-overflow-tooltip="true" />
      <el-table-column prop="department" label="涉及部门" :show-overflow-tooltip="true" />
      <el-table-column prop="totalNum" label="人数限制" />
      <el-table-column prop="curNum" label="现与会人数" />
      <el-table-column prop="scheduleStatus" label="日程状态" />
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
  dicts: ['common_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'schedule:add'],
        edit: ['admin', 'schedule:edit'],
        del: ['admin', 'schedule:del']
      }
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
</style>
