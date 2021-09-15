<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.name" clearable size="small" placeholder="输入审核计划名称搜索" style="width: 200px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" @change="crud.toQuery"/>
        <el-select
          v-model="query.type"
          filterable
          allow-create
          clearable
          size="small"
          placeholder="审核种类"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in dict.audit_type" :key="item.id" :label="item.value" :value="item.value"/>
        </el-select>
        <el-select
          v-model="query.status"
          filterable
          clearable
          size="small"
          placeholder="计划状态"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in dict.plan_status" :key="item.id" :label="item.value" :value="item.value"/>
        </el-select>
        <el-select
          v-model="query.reason"
          filterable
          clearable
          allow-create
          size="small"
          placeholder="审核原因"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in dict.audit_reason" :key="item.id" :label="item.value" :value="item.value"/>
        </el-select>
        <el-select
          v-model="query.content"
          filterable
          clearable
          size="small"
          allow-create
          placeholder="审核内容"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in dict.audit_system" :key="item.id" :label="item.value" :value="item.value"/>
        </el-select>
        <rrOperation/>
      </div>
      <crudOperation :permission="permission"/>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
               :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="700px"
    >
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="name">
              <span slot="label">
                <span class="span-box">
                  <span>计划名称</span>
                  <el-tooltip placement="top" effect="light">
                    <div slot="content">
                      计划名称组成：【系统名称】 + 【审核内容-建立时间格式化（yyyyMMdd）】+ 【审核类型】<br>
                      例：IQS-QPR20210918年度审核
                    </div>
                    <i class="el-icon-question"/>
                  </el-tooltip>
                </span>
              </span>
              <el-input v-model="form.systemName" placeholder="系统名称" style="width: 150px;"/>
              <el-input v-model="form.name" style="width: 380px;">
                <template slot="prepend">{{ prefix }}</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核计划种类" prop="type">
              <el-select
                v-model="form.type"
                size="small"
                filterable
                allow-create
                placeholder="支持自定义输入"
                class="filter-item"
                style="width: 200px"
                @change="typeChangeHandler"
              >
                <el-option
                  v-for="item in dict.audit_type"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type" label="审核内容" prop="content">
              <el-select
                v-model="form.content"
                size="small"
                placeholder="支持自定义输入"
                filterable
                allow-create
                class="filter-item"
                style="width: 200px"
                @change="contentChangeHandler"
              >
                <el-option
                  v-for="item in contents"
                  :key="item.label"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12">
                      <el-form-item v-if="form.auditNo" label="审核编号" prop="auditNo">
                        <el-input disabled v-model="form.auditNo" style="width: 200px;"/>
                      </el-form-item>
                    </el-col>-->
          <el-col :span="12">
            <el-form-item label="审核模板类型" prop="templateType">
              <el-select
                v-model="form.templateType"
                size="small"
                placeholder="支持自定义输入"
                filterable
                allow-create
                clearable
                class="filter-item"
                style="width: 200px"
              >
                <el-option
                  v-for="item in dict.audit_template"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!--todo VDA6.3模板待添加数据结构和功能模块-->
            <el-form-item v-if="form.templateType === 'VDA6.3'" label="审核模板" prop="templateType">
              <el-select
                v-model="form.templateId"
                size="small"
                placeholder="支持自定义输入"
                filterable
                allow-create
                class="filter-item"
                style="width: 200px"
              >
                <el-option
                  v-for="item in templates"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核计划时间" prop="planTime">
              <el-input v-model="form.planTime" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核范围" prop="scope">
              <el-input v-model="form.scope" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核周期" prop="period">
              <!--              <el-input v-model="form.period" style="width: 200px;"/>-->
              <el-autocomplete
                class="inline-input"
                v-model="form.period"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                style="width: 200px;"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核原因" prop="reason">
              <el-select
                v-model="form.reason"
                size="small"
                placeholder="审核原因"
                class="filter-item"
                style="width: 200px"
              >
                <el-option
                  v-for="item in dict.audit_reason"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核产品" prop="product">
              <el-input v-model="form.product" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品技术" prop="technology">
              <el-input v-model="form.technology" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核地点" prop="address">
              <el-input v-model="form.address" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核产线" prop="line">
              <el-input v-model="form.line" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.status !== null " label="审核状态" prop="status">
              <el-select disabled v-model="form.status" size="small" placeholder="审核状态" class="filter-item"
                         style="width: 200px"
              >
                <el-option v-for="item in dict.approval_status" :key="item.label" :label="item.label"
                           :value="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核负责人" prop="chargeBy">
              <el-select
                v-model="form.chargeBy"
                style="width: 200px;"
              >
                <el-option
                  v-for="item in users"
                  :key="item.id"
                  :label="item.dept.name + ' - '+ item.username"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划描述" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                style="width: 530px;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="审核人员" prop="bindAuditors">
            <el-select
              v-model="form.bindAuditors"
              style="width: 400px"
              multiple
              filterable
              placeholder="请选择"
              @remove-tag="deleteTag"
              @change="changeBindAuditors"
            >
              <el-option
                v-for="item in users"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-row>
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
      :data="crud.data"
      style="width: 100%;"
      @selection-change="crud.selectionChangeHandler"
      @row-dblclick="dbSelected"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55"/>
      <!--      <el-table-column label="计划名称" :formatter="nameFormat" min-width="180"/>-->
      <el-table-column label="计划名称" prop="realName" min-width="180"/>
      <el-table-column label="审核编号" prop="auditNo" min-width="150"/>
      <el-table-column label="审核种类" prop="type"/>
      <el-table-column label="审核内容" prop="content"/>
      <el-table-column label="审核状态" prop="status"/>
      <el-table-column label="计划时间" prop="planTime"/>
      <el-table-column label="模板类型" prop="templateType"/>
      <el-table-column label="审核范围" prop="scope" min-width="140"/>
      <el-table-column label="审核周期" prop="period"/>
      <el-table-column label="审核原因" prop="reason"/>
      <el-table-column label="审核产品" prop="product"/>
      <el-table-column label="产品技术" prop="technology"/>
      <el-table-column label="审核地点" prop="address"/>
      <el-table-column label="审核产线" prop="line"/>
      <el-table-column label="审核负责人" prop="chargeman"/>
      <el-table-column label="计划批准人" prop="approver"/>
      <el-table-column label="批准时间" prop="approvedTime"/>
      <el-table-column label="变更描述" prop="changeDesc"/>
      <el-table-column label="修改批准时间" prop="changeApprovedTime" min-width="120"/>
      <el-table-column label="创建日期" prop="createTime" min-width="140"/>
      <el-table-column v-if="checkPer(['admin','plan:edit','plan:del'])" label="操作" width="130px" align="center"
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
import crudAuditPlan from '@/api/tools/auditPlan'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import { getAllUser } from '@/api/system/user'
import pagination from '@crud/Pagination'
import { getTodayFormat, toDateFormat, validIsNotNull } from '@/utils/validationUtil'

const defaultForm = {
  id: null,
  auditNo: null,
  type: null,
  content: null,
  systemName: null,
  name: null,
  realName: null,
  planTime: null,
  templateType: null,
  templateId: null,
  status: null,
  scope: null,
  period: null,
  reason: null,
  product: null,
  technology: null,
  address: null,
  line: null,
  chargeBy: null,
  description: null,
  approvedBy: null,
  approveTime: null,
  changeDesc: null,
  changeApprovedTime: null,
  bindAuditors: []
}
export default {
  name: 'Audit',
  components: { crudOperation, rrOperation, pagination, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '审核计划', url: 'api/auditPlan', crudMethod: { ...crudAuditPlan } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['audit_type', 'audit_template', 'audit_reason', 'audit_system', 'plan_status'],
  data() {
    return {
      plans: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        /*auditNo: [
          { required: true, message: '编号不可为空', trigger: 'blur' }
        ],*/
        systemName: [
          { required: true, message: '请输入系统名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入审核种类', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '审核内容不可为空', trigger: 'blur' }
        ],
        planTime: [
          { required: true, message: '请输入审核计划时间', trigger: 'blur' }
        ],
        templateType: [
          { required: true, message: '请选择审核模板类型', trigger: 'blur' }
        ],
        scope: [
          { required: true, message: '请填写计划审核范围', trigger: 'blur' }
        ],
        period: [
          { required: true, message: '审核周期不可为空', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请填写审核计划发起原因', trigger: 'blur' }
        ],
        product: [
          { required: true, message: '请填写计划审核的产品名称', trigger: 'blur' }
        ],
        technology: [
          { required: true, message: '请填写审核产品使用的技术', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请填写审核地点', trigger: 'blur' }
        ],
        line: [
          { required: true, message: '请填写审核产线', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请描述本次审核计划具体信息', trigger: 'blur' }
        ]
      },
      permission: {
        add: ['admin', 'plan:add'],
        edit: ['admin', 'plan:edit'],
        del: ['admin', 'plan:del']
      },
      contents: [],
      templates: [],
      prefix: '-审核内容-',
      periods: [],
      users: [],
      auditors: []
    }
  },
  watch: {},
  created() {
    // 获取可用人员作为本审核计划负责人
    this.getAvailableUser()
    // todo 获取符合要求的审核人员
    //  this.getAuditorsByExample()
  },
  mounted() {
    this.periods = this.loadPeriods()
  },
  methods: {
    checkboxT(row, rowIndex) {
      return row.id !== 0
    },
    // 获取人员信息
    getAvailableUser() {
      getAllUser().then(res => {
        this.users = res.content
        // this.auditors = res.content
      })
    },
    [CRUD.HOOK.beforeToAdd](crud, form) {
      this.prefix = '审核内容'
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.prefix = form.content + '-' + toDateFormat(form.createTime)
    },

    [CRUD.HOOK.beforeSubmit]() {
      // 暂设定为VDA6.3
      if (this.form.templateType !== 'VDA6.3') {
        this.form.templateId = null
      }
    },
    // 周期查询推荐
    querySearch(queryString, cb) {
      let periods = this.periods
      let results = queryString ? periods.filter(this.createFilter(queryString)) : periods
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (period) => {
        return (period.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadPeriods() {
      return [
        { 'value': '月度' },
        { 'value': '季度' },
        { 'value': '年度' },
        { 'value': '三年度' },
        { 'value': '定期' },
        { 'value': '其他' }
      ]
    },
    // 删除行数
    handleDelete(index) {
      this.from.bindAuditors.splice(index, 1)
    },
    // 添加行数
    addClick() {
      const obj = {
        orderSort: this.from.bindAuditors.length + 1,
        auditorId: null
      }
      this.from.bindAuditors.push(obj)
    },
    // 审核种类变化
    typeChangeHandler(val) {
      this.form.content = null
      this.contents = []

      if (val === '过程审核') {
        this.contents = [
          {
            value: 'VDA6.3',
            label: 'VDA6.3'
          }, {
            value: 'CQI',
            label: 'CQI'
          }, {
            value: 'QPR',
            label: 'QPR'
          }
        ]
        // this.form.auditNo = 'GC' + getNowFormat()
      } else if (val === '体系审核') {
        // this.form.auditNo = 'TX' + getNowFormat()
        this.contents = [
          {
            value: 'IATF16949',
            label: 'IATF16949'
          }, {
            value: 'ISO9001',
            label: 'ISO9001'
          }, {
            value: 'ISO14001',
            label: 'ISO14001'
          }, {
            value: 'ISO13485',
            label: 'ISO13485'
          }, {
            value: 'ESD S20.20',
            label: 'ESD S20.20'
          }
        ]
      } else if (val === '产品审核') {
        // this.form.auditNo = 'CP' + getNowFormat()
        this.contents = [{
          value: 'VDA6.5',
          label: 'VDA6.5'
        }]
      } else if (val === '管理评审') {
        // this.form.auditNo = 'GL' + getNowFormat()
      } else if (val === '其他') {
        // this.form.auditNo = 'QT' + getNowFormat()
      }
    },
    // 审核内容变化
    contentChangeHandler(val) {
      //  固定计划名称前缀
      if (validIsNotNull(this.form.createTime)) {
        this.prefix = '-' + val + '-' + toDateFormat(this.form.createTime) + '-'
      } else {
        this.prefix = '-' + val + '-' + getTodayFormat(this.form.createTime) + '-'
      }
    },
    // 计划名称格式化处理
    nameFormat(row, column, cellValue) {
      return row.content + '-' + toDateFormat(row.createTime) + row.name
    },
    dbSelected(row) {
      this.$router.push(
        {
          path: '/plan/execute',
          query: {
            planId: row.id
          }
        })
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
