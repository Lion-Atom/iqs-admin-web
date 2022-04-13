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
      <el-table-column prop="name" label="供应商名称" width="160" />
      <el-table-column label="准入供应商" min-width="100" :formatter="isQualifiedFormat" />
      <el-table-column prop="production" label="产品" width="120" />
      <el-table-column prop="type" label="供应商类别" width="150" />
      <el-table-column label="准入时间" min-width="100" :formatter="qualifiedDateFormat" />
      <el-table-column prop="qualifiedScore" label="准入分数" min-width="100" />
      <el-table-column prop="level" label="产品级别" width="120" />
      <el-table-column label="成立时间" width="120" :formatter="foundDateFormat" />
      <el-table-column prop="address" label="公司地址" width="120" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="createBy" label="创建者" />
      <el-table-column prop="createTime" label="创建日期" width="140" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','supplier:edit','supplier:del'])"
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
import eHeader from './module/supplierHeader'
import pagination from '@crud/Pagination'
import CRUD, { presenter } from '@crud/crud'
import crudSupplier from '@/api/tools/supplier'
import crudOperation from './module/CRUD.dOperation'
import { GMTToDate, validIsNotNull } from '@/utils/validationUtil'
import udOperation from './module/UD.dOperation'

export default {
  // 供应商管理
  name: 'Supplier',
  components: { eHeader, pagination, crudOperation, udOperation },
  cruds() {
    return CRUD({
      title: '供应商',
      url: 'api/supplier',
      crudMethod: { ...crudSupplier }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['supplier_level', 'supplier_type'],
  data() {
    return {
      permission: {
        add: ['admin', 'supplier:add'],
        edit: ['admin', 'supplier:edit'],
        del: ['admin', 'supplier:del']
      }
    }
  },
  created() {

  },
  methods: {
    foundDateFormat(row, col) {
      if (validIsNotNull(row.foundationDate)) {
        return GMTToDate(row.foundationDate)
      } else {
        return null
      }
    },
    qualifiedDateFormat(row, col) {
      if (validIsNotNull(row.qualifiedDate)) {
        return GMTToDate(row.qualifiedDate)
      } else {
        return null
      }
    },
    isQualifiedFormat(row,col) {
      if (validIsNotNull(row.isQualified)) {
        if(row.isQualified){
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
          path: '/supplier/supplier-update',
          query: {
            supplierId: row.id
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
