<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="userName" label="名称" />
      <el-table-column prop="companyName" label="公司" min-width="120" />
      <el-table-column prop="deptName" label="部门" />
      <el-table-column prop="system" label="体系" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="certificationTime" label="认证时间" :formatter="certTimeFormat" width="100" />
      <el-table-column prop="validity" label="有效期限" :formatter="validityFormat" />
      <el-table-column prop="nextCertificationTime" label="下次认证时间" :formatter="nextCertTimeFormat" width="120" />
      <el-table-column prop="certificationUnit" label="认证单位" />
      <el-table-column prop="approver" label="批准人" />
      <el-table-column prop="approvedTime" label="批准时间" width="140" />
      <el-table-column prop="createTime" label="创建日期" width="140" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','auditor:edit','auditor:del'])"
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
    <pagination />
    <!--表单渲染-->
    <eForm :auditor-status="dict.auditor_status" :audit-system="dict.audit_system" />
  </div>
</template>

<script>
import crudAuditor from '@/api/tools/auditor'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import { GMTToDate } from '@/utils/validationUtil'
export default {
  name: 'Auditor',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '审核人员',
      url: 'api/auditor',
      sort: ['id,desc'],
      crudMethod: { ...crudAuditor }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['auditor_status','audit_system'],
  data() {
    return {
      permission: {
        add: ['admin', 'auditor:add'],
        edit: ['admin', 'auditor:edit'],
        del: ['admin', 'auditor:del']
      }
    }
  },
  methods: {
    // 格式化认证日期
    certTimeFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      return GMTToDate(cellValue);
    },
    // 格式化有效期限
    validityFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      return cellValue + '年';
    },
    // 格式化下次认证日期
    nextCertTimeFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      return GMTToDate(cellValue);
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
