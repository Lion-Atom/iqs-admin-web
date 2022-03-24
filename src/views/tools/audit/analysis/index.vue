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
          placeholder="输入问题名称搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" @change="crud.toQuery"/>
        <el-select
          v-model="query.isRepeat"
          filterable
          allow-create
          clearable
          size="small"
          placeholder="是否重复发生"
          class="filter-item"
          style="width: 130px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in isCommon" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-select
          v-model="query.isCompleted"
          filterable
          allow-create
          clearable
          size="small"
          placeholder="是否改善完成"
          class="filter-item"
          style="width: 130px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in isCommon" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <rrOperation/>
      </div>
      <crudOperation :permission="permission"/>
    </div>
    <!--弹窗编辑-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="700px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="120px"
      >
        <el-form-item
          label="问题标题"
          prop="name"
        >
          <el-input
            v-model="form.name"
            maxlength="30"
            show-word-limit
            style="width: 320px;"
          />
        </el-form-item>
        <el-form-item label="是否重复发生" prop="isRepeat" required>
          <el-select
            v-model="form.isRepeat"
            size="small"
            placeholder="是/否"
            class="filter-item"
            style="width: 320px;"
          >
            <el-option
              v-for="item in isCommon"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否已完成" prop="isCompleted">
          <el-select
            v-model="form.isCompleted"
            size="small"
            placeholder="是/否"
            class="filter-item"
            style="width: 320px;"
            disabled
          >
            <el-option
              v-for="item in isCommon"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </span>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      @selection-change="crud.selectionChangeHandler"
      @row-dblclick="dbSelected"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55"/>
      <el-table-column label="计划名称" prop="planName" min-width="180"/>
      <el-table-column label="问题标题" prop="name" min-width="150"/>
      <el-table-column label="是否重复" :formatter="isRepeatFormat"/>
      <el-table-column label="是否已完成" :formatter="isCompletedFormat"/>
      <el-table-column label="创建日期" prop="createTime" width="140"/>
      <el-table-column
        v-if="checkPer(['admin','plan:edit'])"
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
    <!--分页组件-->
    <pagination/>
  </div>
</template>

<script>
import crudApReportQuestion from '@/api/tools/apReportQuestion'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from './module/CRUD.operation'
import udOperation from './module/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@crud/Pagination'

const defaultForm = {
  name: '',
  isRepeat: false,
  isCompleted: false
}
export default {
  name: 'AuditAnalysis',
  components: {crudOperation, rrOperation, pagination, udOperation, DateRangePicker},
  cruds() {
    return CRUD({title: '审核分析', url: 'api/planReportQuestion', crudMethod: {...crudApReportQuestion}})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['user_status'],
  data() {
    return {
      permission: {
        edit: ['admin', 'plan:edit']
      },
      isCommon: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      rules: {
        name: [
          {required: true, message: '请输入问题名称', trigger: 'blur'}
        ],
        isRepeat: [
          {required: true, message: '请确认问题是否是重复项', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    checkboxT(row, rowIndex) {
      return row.id !== 0
    },
    // 格式化是否重复
    isRepeatFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      return row.isRepeat === true ? '是' : '否'
    },
    // 格式化是否已完成
    isCompletedFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      return row.isCompleted === true ? '是' : '否'
    },
    dbSelected(row) {
      // alert(JSON.stringify(row))
      /*this.$router.push(
        {
          path: '/audit/execute',
          query: {
            planId: row.planId
          }
        })*/
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}

::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
<style>
.el-table .alert-row {
  color: #f00 !important;
}

.el-tag + .el-tag {
  margin-left: 2px;
}

.button-new-tag {
  margin-left: 10px;
  margin-top: 1px;
  height: 24px;
  line-height: 22px;
  padding: 0 8px;
}

.none {
  display: none !important;
}
</style>
