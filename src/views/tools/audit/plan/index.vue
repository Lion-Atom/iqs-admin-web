<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="输入检索条件" style="width: 160px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" @change="crud.toQuery" />
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
          <el-option v-for="item in dict.audit_type" :key="item.id" :label="item.value" :value="item.value" />
        </el-select>
        <el-select
          v-model="query.status"
          filterable
          clearable
          size="small"
          placeholder="计划进度状态"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in dict.plan_status" :key="item.id" :label="item.value" :value="item.value" />
        </el-select>
        <el-select
          v-model="query.approvalStatus"
          filterable
          clearable
          size="small"
          placeholder="计划审批状态"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in approvalStatusOptions" :key="item.value" :label="item.value" :value="item.value" />
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
          <el-option v-for="item in dict.audit_reason" :key="item.id" :label="item.value" :value="item.value" />
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
          <el-option v-for="item in dict.audit_system" :key="item.id" :label="item.value" :value="item.value" />
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
      width="700px"
    >
      <template slot="title">
        <span>{{ disEdit===true ? '查看审核计划':crud.status.title}}
          <i style="color: #ffb700;font-size: 10px;">{{ titleRemark }}</i>
        </span>
      </template>
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="name">
              <span slot="label">
                <span class="span-box">
                  <span>计划名称</span>
                  <el-tooltip placement="top" effect="light">
                    <div slot="content">
                      计划名称组成：【审核内容-建立时间格式化（yyyyMMdd）】+ 【审核种类】<br>
                      例：QPR+20210918-体系审核
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </span>
              </span>
              <el-input v-model="form.type" disabled style="width: 380px;" placeholder="审核种类">
                <template slot="prepend">{{ prefix }}</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核种类" prop="type">
              <el-select
                v-model="form.type"
                size="small"
                filterable
                allow-create
                placeholder="支持自定义输入"
                class="filter-item"
                style="width: 200px"
                @change="typeChangeHandler"
                :disabled="disEdit"
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
                :disabled="disEdit"
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
                @change="tempTypeChange"
                :disabled="disEdit"
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
            <!--VDA6.3模板待添加数据结构和功能模块-->
            <el-form-item v-if="crud.status.add && form.templateType === 'VDA6.3'" prop="templateId">
              <template slot="label">
                <span><i style="color: red;">* </i>审核模板</span>
              </template>
              <el-select
                v-model="form.templateId"
                size="small"
                placeholder="请选择模板"
                class="filter-item"
                style="width: 200px"
                :disabled="disEdit"
              >
                <el-option
                  v-for="item in templates"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.templateType === 'VDA6.3' && !crud.status.add" label="审核模板" prop="templateId">
              <el-input value="系统自带VDA.6.3模板" disabled style="width: 200px;" />
            </el-form-item>
            <!--模板无须显示-->
            <!--<el-form-item v-if="crud.status.edit" label="审核模板" prop="templateName">
                  <el-input v-model="templateName" disabled style="width: 200px;"/>
                </el-form-item>-->
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核计划时间" prop="planTime">
<!--              <el-input v-model="form.planTime" style="width: 200px;" />-->
              <el-date-picker
                v-model="form.planTime"
                type="date"
                placeholder="选择审核计划日期"
                style="width: 200px;"
                :disabled="disEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核范围" prop="scope">
              <el-select
                v-if="form.templateType === 'VDA6.3'"
                v-model="bindScopes"
                size="small"
                filterable
                multiple
                class="filter-item"
                style="width: 200px"
                @change="changeBindScopes"
                :disabled="disEdit"
              >
                <el-option
                  v-for="item in dict.vda_process"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
              <el-input v-else v-model="form.scope" style="width: 200px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核周期" prop="period">
              <el-input v-model="form.period" :disabled="disEdit" style="width: 200px;" />
              <!--              <el-autocomplete
                              v-model="form.period"
                              class="inline-input"
                              :fetch-suggestions="querySearch"
                              placeholder="请输入内容"
                              style="width: 200px;"
                            />-->
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
                :disabled="disEdit"
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
              <el-input v-model="form.product" :disabled="disEdit" style="width: 200px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品技术" prop="technology">
              <el-input v-model="form.technology" :disabled="disEdit" style="width: 200px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核地点" prop="address">
              <el-input v-model="form.address" :disabled="disEdit" style="width: 200px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核产线" prop="line">
              <!--<el-input style="width: 200px;" v-model="lineTags" />-->
              <div style="width: 200px;">
                <el-tag
                  v-for="tag in lineTags"
                  :key="tag"
                  :closable="!disEdit"
                  :disabled="disEdit"
                  :disable-transitions="false"
                  @close="handleLineClose(tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  v-if="inputLineVisible"
                  ref="saveTagInput"
                  v-model="inputLineValue"
                  class="input-new-tag"
                  size="small"
                  @keyup.enter.native="handleInputLineConfirm"
                  @blur="handleInputLineConfirm"
                />
                <el-button :disabled="disEdit" v-else class="button-new-tag" size="small" @click="showInputLine">+产线</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.status !== null " label="计划状态" prop="status">
              <el-select
                v-model="form.status"
                disabled
                size="small"
                placeholder="审核状态"
                class="filter-item"
                style="width: 200px"
              >
                <el-option
                  v-for="item in dict.approval_status"
                  :key="item.label"
                  :label="item.label"
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
                :disabled="disEdit"
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
                :disabled="disEdit"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.reason">
          <el-form-item prop="bindAuditors">
            <template slot="label">
              <span><i style="color:red;">* </i>审核人员</span>
            </template>
            <el-select
              v-model="auditorDatas"
              style="width: 400px"
              multiple
              filterable
              :allow-create="isTrue"
              placeholder="请选择"
              @remove-tag="deleteTag"
              @change="changeBindAuditors"
              :disabled="disEdit"
            >
              <el-option
                v-for="item in auditors"
                :key="item.id"
                :label="item.deptName + ' - '+ item.system + ' - '+ item.username"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div v-if="disEdit === false" slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
      <div v-else slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">关闭</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      :row-class-name="tableRowClassName"
      @selection-change="crud.selectionChangeHandler"
      @row-dblclick="dbSelected"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column label="计划名称" min-width="180">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="计划名称"
            width="200"
            trigger="hover"
          >
            <div>{{ scope.row.realName }}<br>
              <span v-if="scope.row.isOverdue === true" style="color: #f00;">已超期</span>
            </div>
            <a
              slot="reference"
              style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size: 13px;"
            >
              {{ scope.row.realName }}
            </a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审核编号" prop="auditNo" min-width="150" />
      <el-table-column label="审核种类" prop="type" />
      <el-table-column label="审核内容" prop="content" />
      <el-table-column label="计划状态" prop="status">
        <template slot-scope="scope">
          <div v-if="scope.row.isOverdue === true">
            <el-popover
              placement="top-start"
              title="超期信息"
              width="260"
              trigger="hover"
            >
              <div v-if="scope.row.closeTime">
                <!--不用判空，如果确定超期，说明报告已生成，必不为空，若为空则生成报告逻辑有问题-->
                <span>计划结案时间：{{ scope.row.finalDeadline }}<br></span>
                <span style="color: #f00;">实际结案时间：{{ scope.row.closeTime }}<br></span>
              </div>
              <div v-else>
                <span>计划结案时间：{{ scope.row.finalDeadline }}<br></span>
                <span style="color: #f00;">截至目前尚未结案<br></span>
              </div>
              <a
                slot="reference"
                style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
              >
                {{ scope.row.status }}
              </a>
            </el-popover>
          </div>
          <div v-else>
            {{ scope.row.status }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="计划时间" :formatter="planDateFormat" min-width="100" />
      <el-table-column label="模板类型" prop="templateType" />
      <el-table-column label="审核范围" prop="scope" min-width="140" />
      <el-table-column label="审核周期" prop="period" />
      <el-table-column label="审核原因" prop="reason" />
      <el-table-column label="审核产品" prop="product" />
      <el-table-column label="产品技术" prop="technology" />
      <el-table-column label="审核地点" prop="address" />
      <el-table-column label="审核产线" prop="line" />
      <el-table-column label="审核负责人" prop="chargeman" />
      <el-table-column label="计划批准人" prop="approver" />
      <el-table-column label="审批状态" prop="approvalStatus">
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
      <el-table-column label="审批时间" prop="approvedTime" width="140" />
      <el-table-column label="变更描述" prop="changeDesc" />
<!--      <el-table-column label="修改批准时间" prop="changeApprovedTime" min-width="120" />-->
      <el-table-column label="创建日期" prop="createTime" width="140" />
      <el-table-column label="结案时间" prop="closeTime" width="140" />
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
    <!--分页组件-->
    <pagination />
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
import {arrSort, GMTToDate, judgeArrIsEqual, judgeIsEqual, toDateFormat, validIsNotNull} from '@/utils/validationUtil'
import { getAuditorByExample } from '@/api/tools/auditor'
import { getPlanTemplateByPlanId, getPlanTemplateByType } from '@/api/tools/auditPlanTemplate'

let planAuditors = []
const defaultForm = {
  id: null,
  auditNo: null,
  type: null,
  content: null,
  // systemName: null,
  // name: null,
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
  auditors: [],
  isTrue: false
}
export default {
  name: 'Audit',
  components: { crudOperation, rrOperation, pagination, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '审核计划', url: 'api/auditPlan', crudMethod: { ...crudAuditPlan }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['audit_type', 'audit_template', 'audit_reason', 'audit_system', 'plan_status', 'vda_process'],
  data() {
    return {
      plans: [],
      approvalStatusOptions:[
        {
          label:'toActive',
          value:'待激活'
        },
        {
          label:'wait',
          value:'待批准'
        },
        {
          label:'approved',
          value:'已批准'
        },
        {
          label:'refused',
          value:'被驳回'
        }
      ],
      rules: {
        /* name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],*/
        /* auditNo: [
          { required: true, message: '编号不可为空', trigger: 'blur' }
        ],*/
        /* systemName: [
          { required: true, message: '请输入系统名称', trigger: 'blur' }
        ],*/
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
        chargeBy: [
          { required: true, message: '请填写审核负责人', trigger: 'blur' }
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
      prefix: '审核内容-',
      periods: [],
      users: [],
      auditors: [],
      cond: {
        approvalStatus: '已批准'
      },
      auditorDatas: [],
      bindScopes: [],
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      lineTags: [],
      inputLineVisible: false,
      inputLineValue: '',
      defaultScopes: [],
      titleRemark: '',
      // 监控审核计划属性内容变化
      disEdit: false,
      type: null,
      content: null,
      planTime: null,
      templateType: null,
      templateId: null,
      scope: null,
      period: null,
      reason: null,
      product: null,
      technology: null,
      address: null,
      line: null,
      chargeBy: null,
      description: null,
      oldAuditors: []
    }
  },
  computed: {
    reasonChange() {
      return this.form.reason
    }
  },
  watch: {
    // 监控原因变化，如果是第三方或者客户审核，则允许自定义审核员
    reasonChange(newVal, oldVal) {
      this.isTrue = newVal === '新客户审核' || newVal === '客户定期审核' || newVal === '第三方定期审核'
    }
  },
  created() {
    // 获取可用人员作为本审核计划负责人
    this.getAvailableUser()
    // 获取符合要求的审核人员
    this.getAvailableAuditor(this.cond)
  },
  mounted() {
    this.periods = this.loadPeriods()
  },
  methods: {
    // 根据有效期设置提醒样式
    tableRowClassName({ row, rowIndex }) {
      const type = row.isOverdue
      if (row.isOverdue === true) {
        return 'alert-row'
      }
    },
    checkboxT(row, rowIndex) {
      return row.id !== 0
    },
    // 获取人员信息
    getAvailableUser() {
      getAllUser().then(res => {
        this.users = res.content
      })
    },
    // 获取审核人员信息
    getAvailableAuditor(cond) {
      getAuditorByExample(cond).then(res => {
        this.auditors = res
      })
    },
    // 检测模板类型变化
    tempTypeChange(val) {
      this.templates = []
      getPlanTemplateByType(val).then(res => {
        this.templates = res
      })
    },
    // 范围监控
    changeBindScopes(val) {
      this.form.scope = val.join(',')
      // alert(this.form.scope)
    },
    planDateFormat(row, col) {
      // alert(JSON.stringify(row.planTime))
      if (validIsNotNull(row.planTime)) {
        return GMTToDate(row.planTime)
      } else {
        return null
      }
    },
    [CRUD.HOOK.beforeToAdd](crud, form) {
      // alert(this.disEdit)
      this.disEdit = false
      this.titleRemark = ''
      this.lineTags = []
      this.prefix = '审核内容-'
      this.auditorDatas = []
      this.bindScopes = []
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.titleRemark = ''
      this.disEdit = form.status !== '计划';
      // alert(JSON.stringify(form.auditors))
      if(form.approvalStatus ==='被驳回') {
        /*this.$message({
          message: 'Soon to Active!当前审核信息被驳回，需更正后重新激活审批',
          type: 'warning'
        })*/
        this.titleRemark = '[当前审核信息被驳回，需更正后重新激活审批]'
      }
      if(form.status !=='计划') {
        /*this.$message({
          message: 'Soon to Active!当前审核信息被驳回，需更正后重新激活审批',
          type: 'warning'
        })*/
        this.titleRemark = '[当前审核计划【'+form.status+'】中，暂无权修改]'
      }
      this.bindScopes = []
      // 获取模板名称
      this.getTemplateByPlanId(form.id)
      // alert(toDateFormat(form.createTime))
      this.prefix = form.content + '-' + toDateFormat(form.createTime) + '-'
      this.auditorDatas = []
      this.oldAuditors = []
      planAuditors = []
      // userJobs = []
      const _this = this
      form.auditors.forEach(function(auditor, index) {
        _this.auditorDatas.push(auditor.id)
        const rol = { id: auditor.id }
        planAuditors.push(rol)
        _this.oldAuditors.push(auditor.id)
      })
      this.bindScopes = form.scope.split(',')
      // alert(JSON.stringify(this.bindScopes))
      this.lineTags = form.line.split(',')
      // todo 监控属性是否变化
      this.type = form.type
      this.content = form.content
      this.planTime = form.planTime
      this.templateType = form.templateType
      this.templateId = form.templateId
      this.scope = form.scope
      this.period = form.period
      this.reason = form.reason
      this.product = form.product
      this.technology = form.technology
      this.address = form.address
      this.line = form.line
      this.chargeBy = form.chargeBy
      this.description = form.description
    },
    // 查询审核计划模板信息
    getTemplateByPlanId(id) {
      getPlanTemplateByPlanId(id).then(res => {
        // alert(JSON.stringify(res))
        this.templateName = res.name
      })
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (this.auditorDatas.length === 0) {
        this.$message({
          message: '审核人员不可为空',
          type: 'warning'
        })
        return false
      }
      crud.form.auditors = planAuditors
      return true
    },
    [CRUD.HOOK.beforeSubmit]() {
      if(this.form.status === '计划'){
        // 暂设定为VDA6.3
        if (this.form.templateType !== 'VDA6.3') {
          this.form.templateId = null
        } else if (this.form.templateType === 'VDA6.3') {
          if (!validIsNotNull(this.form.templateId)) {
            this.$message({
              message: '请选择该模板下推荐模板',
              type: 'warning'
            })
            return false
          }
        }
        // alert(JSON.stringify(arrSort(this.oldAuditors)))
        // alert(JSON.stringify(arrSort(this.auditorDatas)))
        // alert(judgeArrIsEqual(arrSort(this.oldAuditors),arrSort(this.auditorDatas)))
        if (judgeIsEqual(this.type, this.form.type) &&
          judgeIsEqual(this.content, this.form.content) &&
          judgeIsEqual(this.templateType, this.form.templateType) &&
          judgeIsEqual(GMTToDate(this.planTime), GMTToDate(this.form.planTime)) &&
          judgeIsEqual(this.scope, this.form.scope) &&
          judgeIsEqual(this.period, this.form.period)&&
          judgeIsEqual(this.reason, this.form.reason)&&
          judgeIsEqual(this.product, this.form.product)&&
          judgeIsEqual(this.technology, this.form.technology)&&
          judgeIsEqual(this.address, this.form.address)&&
          judgeIsEqual(this.line, this.form.line)&&
          judgeIsEqual(this.chargeBy, this.form.chargeBy)&&
          judgeIsEqual(this.description, this.form.description)&&
          judgeArrIsEqual(arrSort(this.oldAuditors),arrSort(this.auditorDatas))) {
          this.$message({
            message: 'No changes found, no need to save!未发生改动，无需提交保存',
            type: 'warning'
          })
          return false
        }
      }
    },
    // 周期查询推荐
    querySearch(queryString, cb) {
      const periods = this.periods
      const results = queryString ? periods.filter(this.createFilter(queryString)) : periods
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
        this.prefix = val + '-' + toDateFormat(this.form.createTime) + '-'
      } else {
        this.prefix = val + '-' + toDateFormat(new Date()) + '-'
      }
    },
    // 计划名称格式化处理
    nameFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      if (!cellValue) return ''
      if (cellValue.length > 30) {
        // 最长固定显示4个字符
        return cellValue.slice(0, 30) + '...'
      }
      return cellValue
    },
    dbSelected(row) {
      // alert(JSON.stringify(row))
      this.$router.push(
        {
          path: '/plan/detail',
          query: {
            planId: row.id,
            templateId: row.templateId
          }
        })
    },
    // 变更审批人员
    changeBindAuditors(value) {
      planAuditors = []
      value.forEach(function(data, index) {
        const auditor = { id: data }
        planAuditors.push(auditor)
      })
    },
    // 删除审批人员
    deleteTag(value) {
      planAuditors.forEach(function(data, index) {
        if (data.id === value) {
          planAuditors.splice(index, value)
        }
      })
    },
    handleLineClose(tag) {
      this.lineTags.splice(this.lineTags.indexOf(tag), 1)
    },

    showInputLine() {
      this.inputLineVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputLineConfirm() {
      const inputValue = validIsNotNull(this.inputLineValue)?this.inputLineValue.trim():''
      if (inputValue) {
        this.lineTags.push(inputValue)
      }
      this.form.line = this.lineTags.join(',')
      this.inputLineVisible = false
      this.inputLineValue = ''
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
  color: #ff0000 !important;
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
