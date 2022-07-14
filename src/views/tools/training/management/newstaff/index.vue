<template>
  <div class="app-container">
    <!--快速导航-->
    <div class="head-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/training/overview' }">培训概览</el-breadcrumb-item>
        <el-breadcrumb-item><b>培训记录</b></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--工具栏-->
    <div class="head-container">
      <eHeader :finish-status="dict.common_status" :type-options="typeOptions" :permission="permission"/>
      <crudOperation :permission="permission"/>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler" @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="staffName" label="员工姓名"/>
      <el-table-column prop="jobNum" label="员工工号"/>
      <el-table-column prop="jobName" label="岗位"/>
      <el-table-column prop="departName" label="所属部门"/>
      <el-table-column prop="superior" label="上级主管"/>
      <el-table-column prop="staffType" label="员工类型"/>
<!--      <el-table-column prop="jobType" label="工种" />-->
<!--      <el-table-column prop="workshop" label="车间"/>-->
<!--      <el-table-column prop="team" label="班组"/>-->
      <el-table-column prop="isFinished" label="是否完成" :formatter="isFinishedFormat"/>
      <el-table-column prop="trainTitle" label="培训项目" :show-overflow-tooltip="true"/>
      <el-table-column prop="isExam" label="是否考试" :formatter="isExamFormat"/>
      <el-table-column prop="reason" label="未完成原因" min-width="160" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.isAuthorize" type="danger">
            {{ scope.row.reason}}
          </el-tag>
          <el-tag v-else-if="scope.row.reason" type="warning">
            {{ scope.row.reason}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建者" />
      <el-table-column prop="createTime" label="创建日期" width="140"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','newStaff:edit','newStaff:del'])"
        label="操作"
        width="130px"
        align="center"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :show-del="false"
            :disabled-edit="!scope.row.hasEditAuthorized"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
    <!--表单渲染-->
    <eForm :finish-status="dict.common_status" :type-options="typeOptions" :permission="permission"/>
  </div>
</template>

<script>
import crudNewStaff from '@/api/tools/train/newStaff'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, {presenter} from '@crud/crud'
import crudOperation from './module/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import {getByMethodName} from "@/api/system/timing";

export default {
  name: 'TrainNewStaff',
  components: {eHeader, eForm, crudOperation, pagination, udOperation},
  cruds() {
    return CRUD({
      title: '员工培训',
      url: 'api/train/newStaff',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudNewStaff},
      queryOnPresenterCreated: false
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['common_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'newStaff:add'],
        edit: ['admin', 'newStaff:edit'],
        del: ['admin', 'newStaff:del']
      },
      methodName: 'checkIsToTrain',
      typeOptions: [
        {
          label: 'DL',
          value: '直接员工'
        },
        {
          label: 'IDL',
          value: '间接员工'
        }
      ]
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: true,
      del: false,
      download: true,
      reset: true
    }
    this.flushTrainTip()
  },
  methods: {
    // 调用同步-重新拉取走查培训提示信息
    flushTrainTip() {
      getByMethodName(this.methodName).then(res => {
        this.crud.toQuery()
      })
    },
    // 改变状态
    isFinishedFormat(row, col) {
      if (row.isFinished) {
        return '是'
      } else {
        return '否'
      }
    },
    isExamFormat(row, col) {
      if (row.isExam) {
        return '是'
      } else {
        return '否'
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
