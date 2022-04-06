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
      :row-class-name="tableRowClassName"
      @selection-change="crud.selectionChangeHandler"
      @row-dblclick="checkDetails"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="username" label="名称" />
      <el-table-column prop="companyName" label="公司" min-width="120" />
      <el-table-column prop="deptName" label="部门" />
      <el-table-column prop="system" label="体系" />
      <el-table-column prop="status" label="证件状态" />
      <el-table-column prop="certificationTime" label="认证时间" :formatter="certTimeFormat" width="100" />
      <el-table-column label="附件数" :formatter="fileCountFormat" />
      <el-table-column prop="validity" label="有效期限" :formatter="validityFormat" />
      <el-table-column prop="nextCertificationTime" label="下次认证时间" :formatter="nextCertTimeFormat" width="120" />
      <el-table-column prop="certificationUnit" label="认证单位" />
      <el-table-column prop="approvalStatus" label="审核状态">
        <template slot-scope="scope">
          <div v-if="scope.row.approvalStatus === '被驳回'">
            <el-popover
              placement="top-start"
              title="驳回原因"
              width="200"
              trigger="hover"
            >
              <div>{{ scope.row.rejectComment }}</div>
              <a
                slot="reference"
                style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
              >
                {{ scope.row.approvalStatus }}
              </a>
            </el-popover>
          </div>
          <div v-else>
            {{ scope.row.approvalStatus }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="approver" label="批准人" />
      <el-table-column prop="approvedTime" label="批准时间" width="140" />
      <el-table-column prop="createTime" label="创建日期" width="140" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','auditor:edit','auditor:del'])"
        label="操作"
        width="150px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :disabled-edit="scope.row.status === '过期'"
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
import udOperation from './module/UD.operation'
import { GMTToDate, validIsNotNull } from '@/utils/validationUtil'

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
  dicts: ['auditor_status', 'audit_system'],
  data() {
    return {
      permission: {
        add: ['admin', 'auditor:management'],
        edit: ['admin', 'auditor:edit'],
        del: ['admin', 'auditor:del']
      }
    }
  },
  methods: {
    // 根据有效期设置提醒样式
    tableRowClassName({ row, rowIndex }) {
      const type = row.styleType
      if (validIsNotNull(type)) {
        if (type === 'alert') {
          return 'alert-row'
        } else if (type === 'warn') {
          return 'warning-row'
        } else if (type === 'gray') {
          return 'gray-row'
        }
      } else {
        return ''
      }
    },
    // 格式化认证日期
    certTimeFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      return GMTToDate(cellValue)
    },
    // 格式化有效期限
    validityFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      return cellValue + '年'
    },
    // 格式化下次认证日期
    nextCertTimeFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      return GMTToDate(cellValue)
    },
    // 附件数目
    fileCountFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      return row.auditorFiles.length
    },
    // 查看审批文件等
    checkDetails(row) {
      this.$router.push(
        {
          path: '/auditor/detail',
          query: {
            auditorId: row.id
          }
        })
    }
  }
}
</script>
<style>
.el-table .alert-row {
  color: #e6a23c !important;
}

.el-table .warning-row {
  color: #ff0;
}

.el-table .gray-row {
  color: #C0C0C0;
}

.el-table .success-row {
  color: #f0f9eb;
}

</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

</style>
