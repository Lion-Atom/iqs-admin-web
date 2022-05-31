<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission"/>
      <crudOperation :permission="permission"/>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      @selection-change="crud.selectionChangeHandler"
      :row-class-name="maintainTableRowClassName"
      @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="equipNum" label="设备编号"  fixed />
      <el-table-column prop="equipName" label="设备名称" :show-overflow-tooltip="true" min-width="100" sortable />
      <el-table-column prop="equipModel" label="设备型号"/>
      <el-table-column prop="assetNum" label="资产号"/>
      <el-table-column prop="equipProvider" label="设备厂家" :show-overflow-tooltip="true" />
      <el-table-column prop="useDepartName" label="使用部门"/>
      <el-table-column prop="useArea" label="设备位置"/>
      <el-table-column prop="equipLevel" label="设备级别"/>
      <el-table-column prop="acceptStatus" label="验收状态"></el-table-column>
      <el-table-column prop="maintainLevel" label="保养级别"/>
      <el-table-column label="上次保养日期" :formatter="lastMaintainDateFormat" width="130"/>
      <el-table-column label="保养周期" :formatter="maintainPeriodFormat"/>
      <el-table-column label="保养到期日期" :formatter="maintainDueDateFormat"  width="130" />
      <el-table-column prop="maintainStatus" label="保养状态" />
      <el-table-column label="保养记录">
        <template slot-scope="scope">
          <el-button v-if="scope.row.lastMaintainDate" type="text" @click="checkMainRecord(scope.row)">查看记录</el-button>
          <el-button v-else type="text" disabled>尚未保养</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期"  width="150" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','equip:edit','equip:del'])"
        label="操作"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :show-del="showDel"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
    <!--表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible="crud.status.cu > 0"
      :title="crud.status.title"
      width="70%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-row class="el-row-inline">
          <el-col :span="8">
            <el-form-item label="设备编号" prop="equipNum">
              <el-input v-model="form.equipNum" style="width: 220px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备名称" prop="equipName">
              <el-input v-model="form.equipName" style="width: 220px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备型号" prop="equipModel">
              <el-input v-model="form.equipModel" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产号" prop="assetNum">
              <el-input v-model="form.assetNum" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备厂家" prop="equipProvider">
              <el-input v-model="form.equipProvider" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂编号" prop="factoryNum">
              <el-input v-model="form.factoryNum" style="width: 220px"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="设备类别" prop="equipType">
              <el-select
                v-model="form.equipType"
                filterable
                clearable
                allow-create
                placeholder="请选择设备类别"
                style="width: 220px;"
              >
                <el-option
                  v-for="item in equipTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="8">
                      <el-form-item label="设备级别" prop="equipLevel">
                        <el-select
                          v-model="form.equipLevel"
                          filterable
                          clearable
                          allow-create
                          placeholder="请选择设备级别"
                          style="width: 220px;"
                        >
                          <el-option
                            v-for="item in equipLevelOptions"
                            :key="item.value"
                            :label="item.label + ' - ' +item.value "
                            :value="item.label">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>-->
          <el-col :span="8">
            <el-form-item label="运行状态" prop="equipStatus">
              <el-select
                v-model="form.equipStatus"
                placeholder="请选择设备运行状态"
                style="width: 220px;"
              >
                <el-option
                  v-for="item in equipStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="设备规格" prop="equipSpec">
              <el-input v-model="form.equipSpec" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备重量" prop="equipWeight">
              <el-input v-model="form.equipWeight" style="width: 220px"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="设备尺寸" prop="equipSize">
              <el-input v-model="form.equipSize" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备原值" prop="netValue">
              <el-input v-model="form.netValue" placeholder="请输入设备价格" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.acceptStatus === '已验收'">
            <el-form-item label="ROI" prop="roi">
              <el-input v-model="form.roi" placeholder="请输入投资回报率" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂日期" prop="saleDate">
              <el-date-picker
                v-model="form.saleDate"
                :picker-options="pickerOptions[0]"
                type="date"
                placeholder="请填写出厂日期"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收到日期" prop="receiveDate">
              <el-date-picker
                v-model="form.receiveDate"
                :picker-options="pickerOptions[1]"
                type="date"
                placeholder="请填写收货日期"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="电压" prop="equipOltage">
              <el-input v-model="form.equipOltage" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="压缩空气" prop="equipAir">
              <el-input v-model="form.equipAir" style="width: 220px"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="水" prop="equipWater">
              <el-input v-model="form.equipWater" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="其它" prop="equipOther">
              <el-input v-model="form.equipOther" style="width: 220px"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="设备位置" prop="useArea">
              <el-input v-model="form.useArea" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用部门" prop="useDepart">
              <TreeSelect
                v-model="form.useDepart"
                :options="useDeparts"
                :load-options="loadFileDepts"
                class="newTree-item"
                placeholder="选择所属部门"
                style="width:220px !important;"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--保养记录查看-->
    <el-dialog title="保养记录" :visible.sync="maintenanceVisible" width="50%">
      <el-table
        v-fit-columns
        ref="maintenanceTable"
        v-loading="maintenanceLoading"
        :data="maintenanceList"
        style="width: 100%;margin-top: -20px;">
        <el-table-column label="保养日期" :formatter="maintainDateFormat"/>
        <el-table-column prop="maintainBy" label="保养人"/>
        <el-table-column prop="maintainDuration" label="保养时长"/>
        <el-table-column prop="maintainResult" label="保养结果"/>
        <el-table-column prop="confirmBy" label="确认人"/>
        <el-table-column prop="maintainDesc" label="保养反馈" :show-overflow-tooltip='true' />
        <el-table-column prop="createTime" label="创建日期" min-width="140"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import crudEquipment from '@/api/tools/equipment'
import eHeader from '../management/module/header'
import CRUD, {crud, form, header, presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import {mapGetters} from "vuex";
import {getToken} from "@/utils/auth";
import {GMTToDate, validIsNotNull} from "@/utils/validationUtil";
import {getDepts, getDeptTree} from "@/api/system/dept";
import TreeSelect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getMaintenanceByEquipId} from "@/api/tools/equipMaintenance";

const defaultForm = {
  id: null,
  equipName: null,
  equipProvider: null,
  equipNum: null,
  equipModel: null,
  equipSpec: null,
  equipWeight: null,
  equipSize: null,
  factoryNum: null,
  assetNum: null,
  saleDate: null,
  receiveDate: null,
  purDate: null,
  useDate: null,
  havAcceptReport: false,
  useDepart: null,
  useArea: null,
  useBy: null,
  equipType: null,
  // equipLevel: null,
  equipStatus: null,
  acceptStatus: null,
  maintainStatus: null,
  equipOltage: null,
  equipAir: null,
  equipWater: null,
  equipOther: null,
  maintainLevel: null,
  maintainPeriod: null,
  maintainPeriodUnit: null,
  lastMaintainDate: null,
  maintainDueDate: null,
  isRemind: null,
  remindDays: null,
  acceptBy: null,
  netValue: null,
  roi: null
}
export default {
  name: 'Management',
  components: {eHeader, crudOperation, pagination, udOperation, TreeSelect},
  cruds() {
    return CRUD({
      title: '设备维护',
      url: 'api/equipment',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudEquipment}
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['equip_status'],
  data() {
    return {
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'equip:add'],
        edit: ['admin', 'equip:edit'],
        del: ['admin', 'equip:del']
      },
      useDeparts: [],
      showDel: false,
      rules: {
        equipName: [
          {required: true, message: '请输入设备名称', trigger: 'blur'}
        ],
        equipModel: [
          {required: true, message: '请输入设备型号', trigger: 'blur'}
        ],
        equipType: [
          {required: true, message: '请输入选填设备类别', trigger: 'blur'}
        ],
        assetNum: [
          {required: true, message: '请输入设备资产号', trigger: 'blur'}
        ],
        factoryNum: [
          {required: true, message: '请输入设备出厂编号', trigger: 'blur'}
        ],
        equipStatus: [
          {required: true, message: '请输入设备运行状态', trigger: 'blur'}
        ],
        equipSpec: [
          {required: true, message: '请输入设备规格', trigger: 'blur'}
        ],
        equipWeight: [
          {required: true, message: '请输入设备重量', trigger: 'blur'}
        ],
        equipSize: [
          {required: true, message: '请输入设备尺寸', trigger: 'blur'}
        ],
        equipProvider: [
          {required: true, message: '请输入设备厂家', trigger: 'blur'}
        ],
        equipNum: [
          {required: true, message: '请输入设备编号', trigger: 'blur'}
        ],
        saleDate: [
          {required: true, message: '请输入出厂日期', trigger: 'blur'}
        ],
        receiveDate: [
          {required: true, message: '请输入收到日期', trigger: 'blur'}
        ],
        netValue: [
          {required: false, message: '请输入设备原值', trigger: 'blur'}
        ],
        roi: [
          {required: false, message: '请输入设备ROI', trigger: 'blur'}
        ],
        acceptBy: [
          {required: true, message: '请输入验收人员', trigger: 'blur'}
        ],
        useArea: [
          {required: true, message: '请输入设备位置', trigger: 'blur'}
        ],
        useDepart: [
          {required: true, message: '请输入设备使用部门', trigger: 'blur'}
        ]
      },
      pickerOptions: [
        {
          //出厂日期不可晚于现在时间
          disabledDate: time => {
            return (
              Date.now() <= time.getTime()
            )
          }
        },
        {
          //限制收货时间晚于出场时间
          disabledDate: time => {
            // 是否限制的判断条件
            if (validIsNotNull(this.form.saleDate)) {
              const date = new Date(this.form.saleDate);
              return (
                new Date(time).getTime() < date || Date.now() <= time.getTime()
              )
            } else {
              return (
                Date.now() <= time.getTime()
              )
            }
          }
        }
      ],
      equipLevelOptions: [
        {
          label: 'A类',
          value: '关键设备'
        },
        {
          label: 'B类',
          value: '主要设备'
        },
        {
          label: 'C类',
          value: '一般设备'
        },
      ],
      equipStatusOptions: [
        {
          label: '良好',
          value: '良好'
        },
        {
          label: '停用',
          value: '停用'
        }
      ],
      equipTypeOptions: [
        {
          label: '包装设备',
          value: '包装设备'
        },
        {
          label: '焊接设备',
          value: '焊接设备'
        },
        {
          label: '通用设备',
          value: '通用设备'
        },
        {
          label: '铸造设备',
          value: '铸造设备'
        },
        {
          label: '输送设备',
          value: '输送设备'
        },
        {
          label: '金属加工设备',
          value: '金属加工设备'
        },
        {
          label: '动力设备',
          value: '动力设备'
        },
        {
          label: '起重设备',
          value: '起重设备'
        },
        {
          label: '冷冻设备',
          value: '冷冻设备'
        },
        {
          label: '分离设备',
          value: '分离设备'
        }
      ],
      maintenanceList: [],
      maintenanceLoading: false,
      maintenanceVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi'
    ])
  },
  created() {
    this.getTopDept(),
      this.crud.optShow = {
        add: true,
        edit: true,
        del: false,
        download: true,
        reset: true
      }
  },
  methods: {
    // 获取所在公司的部门树结构
    getTopDept() {
      getDeptTree().then(res => {
        this.useDeparts = res.content
      })
    },
    // 获取弹窗内使用部门数据
    loadFileDepts({action, parentNode, callback}) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({enabled: true, pid: parentNode.id}).then(res => {
          parentNode.children = res.content.map(function (obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {

    },
    // 编辑前操作
    [CRUD.HOOK.beforeToEdit](crud, form) {

    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {

    },
    // 上次保养日期格式化
    lastMaintainDateFormat(row, col) {
      if (validIsNotNull(row.lastMaintainDate)) {
        return GMTToDate(row.lastMaintainDate)
      } else {
        return null
      }
    },
    // 上次保养日期格式化
    maintainPeriodFormat(row, col) {
      if (validIsNotNull(row.maintainPeriod) && validIsNotNull(row.maintainPeriodUnit)) {
        return row.maintainPeriod + row.maintainPeriodUnit
      } else {
        return null
      }
    },
    // 上次保养日期格式化
    maintainDueDateFormat(row, col) {
      if (validIsNotNull(row.maintainDueDate)) {
        return GMTToDate(row.maintainDueDate)
      } else {
        return null
      }
    },
    // 查看设备相关的保养记录
    checkMainRecord(row) {
      this.getMaintainInfoByEquipId(row.id)
      this.$nextTick(() => {
        this.maintenanceVisible = true
      }, 500)
    },
    // 获取设备保养记录列表
    getMaintainInfoByEquipId(id) {
      this.maintenanceList = []
      this.maintenanceLoading = true
      getMaintenanceByEquipId(id).then(res => {
        this.maintenanceList = res
        this.maintenanceLoading = false
        // alert(JSON.stringify(this.maintenanceList))
      })
    },
    // 保养日期格式化
    maintainDateFormat(row, col) {
      if (validIsNotNull(row.maintainDate)) {
        return GMTToDate(row.maintainDate)
      } else {
        return '--'
      }
    },
    // todo 根据设备保养级别等有无设置提醒样式
    maintainTableRowClassName({row, rowIndex}) {
      if (row.maintainStatus === '超期未保养') {
        return 'alert-row'
      } else {
        return ''
      }
    }
  }
}
</script>
<style>
.el-table .alert-row {
  color: #f00 !important;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value, .newTree-item {
  height: 29px;
  line-height: 29px !important;
  font-size: small;
}
</style>
