<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.name"
          clearable
          size="small"
          placeholder="输入审核计划名称搜索"
          style="width: 200px;"
          class="filter-item"
          @input="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" @input="dateChange" />
        <el-select
          v-model="query.auditType"
          clearable
          size="small"
          placeholder="审核类型"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in dict.audit_type" :key="item.value" :label="item.value" :value="item.value" />
        </el-select>
        <el-select
          v-model="query.auditStatus"
          clearable
          size="small"
          placeholder="审核状态"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in dict.approval_status" :key="item.label" :label="item.label" :value="item.label" />
        </el-select>
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="600px"
    >
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="120px">
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="form.name" style="width: 390px;" />
        </el-form-item>
        <el-form-item label="计划排序" prop="planSort">
          <el-input-number
            v-model.number="form.planSort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 390px;"
          />
        </el-form-item>
        <el-form-item label="计划描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            style="width: 390px;"
          />
        </el-form-item>
        <el-form-item label="年度计划">
          <el-radio-group v-model="form.isTop" style="width: 140px">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.auditStatus !== null " label="审核状态" prop="auditStatus">
          <el-select
            v-model="form.auditStatus"
            disabled
            size="small"
            placeholder="审核状态"
            class="filter-item"
            style="width: 120px"
          >
            <el-option v-for="item in dict.approval_status" :key="item.label" :label="item.label" :value="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核类型" prop="auditType">
          <el-select
            v-model="form.auditType"
            :disabled="form.isTop ==='0'"
            clearable
            size="small"
            placeholder="审核类型"
            class="filter-item"
            style="width: 120px"
          >
            <el-option v-for="item in dict.audit_type" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.isTop === '0'" style="margin-bottom: 0;" label="所属年度计划" prop="pid">
          <treeselect
            v-model="form.pid"
            :load-options="loadAuditPlans"
            :options="plans"
            style="width: 370px;"
            placeholder="选择所属的年度审核计划"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      lazy
      :load="getFileLevelDatas"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :data="crud.data"
      row-key="id"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column label="名称" prop="name" />
      <el-table-column label="排序" prop="planSort" />
      <el-table-column label="描述" prop="description" min-width="120" />
      <el-table-column label="审核类型" prop="auditType" />
      <el-table-column label="审核状态" prop="auditStatus" />
      <el-table-column prop="createTime" label="创建日期" />
      <el-table-column
        v-if="checkPer(['admin','plan:edit','plan:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            msg="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import crudAuditPlan from '@/api/tools/auditPlan'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import { validIsNotNull } from '@/utils/validationUtil'

const defaultForm = {
  id: null,
  name: null,
  isTop: '1',
  subCount: 0,
  auditType: null,
  pid: null,
  description: '无',
  planSort: 999,
  auditStatus: null
}
export default {
  name: 'Audit',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '审核计划', url: 'api/auditPlan', crudMethod: { ...crudAuditPlan }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['dept_status', 'audit_type', 'approval_status'],
  data() {
    return {
      plans: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        planSort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ],
        auditType: [
          { required: true, message: '请输入审核类型', trigger: 'blur' }
        ]
      },
      permission: {
        add: ['admin', 'plan:add'],
        edit: ['admin', 'plan:edit'],
        del: ['admin', 'plan:del']
      }
    }
  },
  watch: {
    'form.pid': 'currPidChange'
  },
  methods: {
    getFileLevelDatas(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudAuditPlan.getAuditPlans(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.pid !== null) {
        form.isTop = '0'
      } else if (form.id !== null) {
        form.isTop = '1'
      }
      form.enabled = `${form.enabled}`
      if (form.id != null) {
        this.getSupAuditPlans(form.id)
      } else {
        this.getAuditPlans()
      }
    },
    getSupAuditPlans(id) {
      crudAuditPlan.getAuditPlanSuperior(id).then(res => {
        const date = res.content
        this.buildFileLevels(date)
        this.levels = date
      })
    },
    buildFileLevels(plans) {
      plans.forEach(data => {
        if (data.children) {
          this.buildFileLevels(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    getAuditPlans() {
      crudAuditPlan.getAuditPlans({}).then(res => {
        this.plans = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    // 获取弹窗内审核计划数据
    loadAuditPlans({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        crudAuditPlan.getAuditPlans({ pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 100)
        })
      }
    },
    // 监控所属年度审核计划的变化
    currPidChange(val) {
      if (validIsNotNull(val)) {
        crudAuditPlan.getAuditPlanById(val).then(res => {
          this.form.auditType = res.auditType
        })
      }
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      if (this.form.isTop === '0') {
        if (!validIsNotNull(this.form.pid)) {
          this.$message({
            message: '年度计划不能为空',
            type: 'warning'
          })
          return false
        }
      }
      if (this.form.isTop === '1') {
        this.form.pid = null
      }
      return true
    },
    checkboxT(row, rowIndex) {
      return row.id !== 0
    },
    dateChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    pidChange(val) {
      // alert(JSON.stringify(val))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
