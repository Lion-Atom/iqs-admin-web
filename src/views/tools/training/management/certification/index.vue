<template>
  <div class="app-container">
    <!--快速导航-->
    <div class="head-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/training/overview' }">培训概览</el-breadcrumb-item>
        <el-breadcrumb-item><b>认证</b></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--工具栏-->
    <div class="head-container">
      <eHeader :finish-status="dict.common_status" :type-options="typeOptions" :permission="permission"/>
      <crudOperation :permission="permission"/>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      :row-class-name="tableRowClassName"
      @selection-change="crud.selectionChangeHandler" @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="staffName" label="员工姓名" fixed/>
      <el-table-column prop="jobNum" label="员工工号"/>
      <el-table-column prop="departName" label="所属部门"/>
      <el-table-column prop="superior" label="上级主管"/>
      <el-table-column prop="jobName" label="岗位"/>
      <el-table-column prop="certificationType" label="认证种类"/>
      <el-table-column prop="jobType" label="工种种类"/>
      <!--      <el-table-column label="证书到期日期" :formatter="dueDateFormat" />-->
      <el-table-column label="证书到期日期" :formatter="dueDateFormat" />
      <el-table-column prop="certificationStatus" label="证书状态" />
      <el-table-column prop="trainContent" label="培训内容" :show-overflow-tooltip="true"/>
      <el-table-column prop="createTime" label="创建日期" width="140"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','certification:edit','certification:del'])"
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
    <eForm :finish-status="dict.common_status" :type-options="typeOptions" :permission="permission"/>
  </div>
</template>

<script>
import crudCertification from '@/api/tools/train/certification'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, {presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import {GMTToDate, validIsNotNull} from "@/utils/validationUtil";

export default {
  name: 'TrainCertification',
  components: {eHeader, eForm, crudOperation, pagination, udOperation},
  cruds() {
    return CRUD({
      title: '培训认证',
      url: 'api/train/certification',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudCertification}
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['common_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'certification:add'],
        edit: ['admin', 'certification:edit'],
        del: ['admin', 'certification:del']
      },
      typeOptions: [
        {
          label: '特殊工种证明',
          value: '特殊工种证明'
        },
        {
          label: '三方机构证明',
          value: '三方机构证明'
        },
        {
          label: '在职上岗证',
          value: '在职上岗证'
        }
      ]
    }
  },
  methods: {
    // 改变状态
    dueDateFormat(row, col) {
      return GMTToDate(row.dueDate)
    },
    // 根据有效期设置提醒样式
    tableRowClassName({row, rowIndex}) {
      const type = row.certificationStatus
      if (validIsNotNull(type)) {
        if (type === '已过期') {
          return 'alert-row'
        } else if (type === '即将过期') {
          return 'warning-row'
        } else if (type === '生效中') {
          return null
        }
      } else {
        return ''
      }
    },
  }
}
</script>
<style>
.el-table .alert-row {
  color: #C0C0C0;
}

.el-table .warning-row {
  color: #e6a23c !important;
}

</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
