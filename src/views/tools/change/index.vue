<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission"/>
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
      @row-dblclick="dbSelected"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="changeNum" label="变更识别码" width="160"/>
      <el-table-column prop="reason" label="变更原因" width="100"/>
      <el-table-column prop="source" label="变更来源" width="100"/>
      <el-table-column prop="initiator" label="发起人" width="100"/>
      <el-table-column prop="department" label="发起部门" width="100"/>
      <el-table-column label="发起时间" min-width="100" :formatter="initDateFormat"/>
      <el-table-column prop="area" label="涉及地区" min-width="100"/>
      <el-table-column prop="depart" label="涉及部门" min-width="100"/>
      <el-table-column prop="project" label="涉及项目" min-width="100"/>
      <el-table-column prop="production" label="涉及产品" min-width="100"/>
      <el-table-column label="是否客户要求" width="100" :formatter="isCustomerFormat"/>
      <el-table-column label="是否同意" width="100" :formatter="isAcceptFormat"/>
      <el-table-column prop="status" label="变更状态" min-width="100"/>
      <el-table-column prop="createBy" label="创建者" />
      <el-table-column prop="createTime" label="创建日期" width="140"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','change:edit','change:del'])"
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
  </div>
</template>

<script>
import eHeader from './module/changeHeader'
import CRUD, {presenter} from '@crud/crud'
import crudChange from '@/api/tools/change'
import crudOperation from './module/CRUD.dOperation'
import {GMTToDate, validIsNotNull} from '@/utils/validationUtil'
import udOperation from './module/UD.dOperation'
import pagination from '@crud/Pagination'

export default {
  // 供应商管理
  name: 'Change',
  components: {eHeader, pagination, crudOperation, udOperation},
  cruds() {
    return CRUD({
      title: '变更信息',
      url: 'api/change',
      crudMethod: {...crudChange}
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['d_source'],
  data() {
    return {
      permission: {
        add: ['admin', 'change:add'],
        edit: ['admin', 'change:edit'],
        del: ['admin', 'change:del']
      }
    }
  },
  created() {

  },
  methods: {
    // 根据有效期设置提醒样式
    tableRowClassName({row, rowIndex}) {
      if (row.finishedStep === 4 && row.isAccepted.toString() === 'false') {
        return 'alert-row'
      }
    },
    initDateFormat(row, col) {
      if (validIsNotNull(row.initTime)) {
        return GMTToDate(row.initTime)
      } else {
        return null
      }
    },
    // 是否客户要求
    isCustomerFormat(row, col) {
      if (validIsNotNull(row.isCustomer)) {
        if (row.isCustomer) {
          return '是'
        } else {
          return '否'
        }
      } else {
        return '-'
      }
    },
    // 是否同意
    isAcceptFormat(row, col) {
      if (validIsNotNull(row.isAccepted)) {
        if (row.isAccepted) {
          return '是'
        } else {
          return '否'
        }
      } else {
        return '-'
      }
    },
    dbSelected(row) {
      // alert(JSON.stringify(row))
      // 跳转到供应商编辑界面中
      this.$router.push(
        {
          path: '/change/change-update',
          query: {
            changeId: row.id
          }
        })
    }
  }
}
</script>

<style>
.el-table .alert-row {
  color: #ff0000 !important;
}
</style>
