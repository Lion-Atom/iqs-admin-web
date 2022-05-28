<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      @selection-change="crud.selectionChangeHandler"
      @row-dblclick="dbSelected"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="联系人名称" width="120" />
      <el-table-column prop="supplierName" label="所属供应商" min-width="200" />
      <el-table-column prop="importantLevel" label="重要程度" width="120" />
      <el-table-column prop="gender" label="性别" width="80" />
      <el-table-column prop="unit" label="单位" width="120" />
      <el-table-column prop="jobStatus" label="在职状态" />
      <el-table-column prop="type" label="人员类型" />
      <el-table-column prop="workTel" label="工作电话" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="email" label="邮箱地址" />
      <el-table-column prop="address" label="住址" :show-overflow-tooltip="true" />
      <el-table-column prop="createBy" label="创建者" />
      <el-table-column prop="createTime" label="创建日期" width="140" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','supplier:edit'])"
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
  </div>
</template>

<script>
import eHeader from './module/contactHeader'
import pagination from '@crud/Pagination'
import CRUD, { presenter } from '@crud/crud'
import crudSupplierContact from '@/api/tools/supplierContact'
import crudOperation from './module/CRUD.dOperation'
import udOperation from './module/UD.dOperation'

export default {
  // 供应商管理
  name: 'SupplierContact',
  components: { eHeader, pagination, crudOperation, udOperation },
  cruds() {
    return CRUD({
      title: '供应商联系人',
      url: 'api/supplierContact',
      crudMethod: { ...crudSupplierContact }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['contact_level', 'contact_type', 'contact_status'],
  data() {
    return {
      permission: {
        edit: ['admin', 'supplier:edit']
      }
    }
  },
  created() {

  },
  methods: {
    dbSelected(row) {
      // alert(JSON.stringify(row))
      // 跳转到供应商联系人编辑界面中
      this.$router.push(
        {
          path: '/supplier/supplier-contact-update',
          query: {
            contactId: row.id
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
