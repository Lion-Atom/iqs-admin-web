<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission"/>
      <crudOperation :permission="permission"/>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="jobSort" label="排序">
        <template slot-scope="scope">
          {{ scope.row.jobSort }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','d:edit'])"
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
import crudJob from '@/api/system/job'
import eHeader from './module/header'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'

export default {
  name: '8dTask',
  components: { eHeader, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '岗位',
      url: 'api/a',
      sort: ['jobSort,asc', 'id,desc'],
      crudMethod: { ...crudJob }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['job_status'],
  data() {
    return {
      permission: {
        edit: ['admin', 'd:edit']
      }
    }
  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
