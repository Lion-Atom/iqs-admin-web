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
      @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="equipName" label="设备名称"/>
<!--      <el-table-column prop="acceptParticipant" label="参与人员"/>-->
      <el-table-column prop="acceptDepartName" label="验收部门"/>
      <el-table-column prop="acceptBy" label="验收人"/>
      <el-table-column prop="approveDepartName" label="批准部门"/>
      <el-table-column prop="approveBy" label="批准人"/>
      <el-table-column prop="approveTime" label="验收时间"/>
      <el-table-column prop="createTime" label="创建日期" min-width="150px"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','acceptance:edit','acceptance:del'])"
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
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible="crud.status.cu > 0"
      :title="crud.status.title"
      width="80%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-divider content-position="left">设备出厂信息</el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备名称" prop="equipmentId">
              <el-select
                v-model="form.equipmentId"
                style="width: 220px;"
                placeholder="请选择"
                @change="changeEquip"
              >
                <el-option
                  v-for="item in equipments"
                  :key="item.id"
                  :label="item.equipName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备型号" prop="equipModel">
              <el-input v-model="equipForm.equipModel" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备类别" prop="equipType">
              <el-input v-model="equipForm.equipType" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备级别" prop="equipLevel">
              <el-input v-model="equipForm.equipLevel" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备厂家" prop="equipProvider">
              <el-input v-model="equipForm.equipProvider" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂编号" prop="factoryNum">
              <el-input v-model="equipForm.factoryNum" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备规格" prop="equipSpec">
              <el-input v-model="equipForm.equipSpec" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备重量" prop="equipWeight">
              <el-input v-model="equipForm.equipWeight" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备尺寸" prop="equipSize">
              <el-input v-model="equipForm.equipSize" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂日期" prop="saleDate">
              <el-date-picker
                v-model="equipForm.saleDate"
                disabled
                type="date"
                placeholder="请填写出厂日期"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收到日期" prop="receiveDate">
              <el-date-picker
                v-model="equipForm.receiveDate"
                disabled
                type="date"
                placeholder="请填写收货日期"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备原值" prop="netValue">
              <el-input v-model="equipForm.netValue" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电" prop="equipOltage">
              <el-input v-model="equipForm.equipOltage" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="气" prop="equipAir">
              <el-input v-model="equipForm.equipAir" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="水" prop="equipWater">
              <el-input v-model="equipForm.equipWater" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="其它" prop="equipOther">
              <el-input v-model="equipForm.equipOther" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备位置" prop="useArea">
              <el-input v-model="equipForm.useArea" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用部门" prop="useDepart">
              <TreeSelect
                v-model="equipForm.useDepart"
                :options="useDeparts"
                :load-options="loadFileDepts"
                disabled
                placeholder="选择所属部门"
                style="width:220px !important;height: 32px!important; line-height: 32px!important;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left">设备验收参与信息</el-divider>
            <el-form-item label="参与人员" prop="acceptParticipant">
              <div>
                <el-tag
                  v-for="tag in form.participantTags"
                  :key="tag"
                  closable
                  :disable-transitions="false"
                  @close="handleParticipantClose(tag)"
                  class="new-part-tag"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  v-if="inputParticipantVisible"
                  ref="participantTagInput"
                  v-model="inputParticipantValue"
                  class="input-new-tag"
                  size="small"
                  placeholder="涉及到的相关部门"
                  @keyup.enter.native="handleInputParticipantConfirm"
                  @blur="handleInputParticipantConfirm"
                />
                <el-button v-else class="button-new-tag" size="small" @click="showInputDepart">+参与人员
                </el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left">设备验收明细</el-divider>
          </el-col>
            <el-col :span="8">
              <el-form-item label="验收部门" prop="acceptDepart">
                <TreeSelect
                  v-model="form.acceptDepart"
                  :options="useDeparts"
                  :load-options="loadFileDepts"
                  class="newTree-item"
                  placeholder="选择验收人所在部门"
                  style="width:220px !important;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="验收人" prop="acceptBy">
                <el-select
                  v-model="form.acceptBy"
                  placeholder="请选择验收人"
                >
                  <el-option
                    v-for="item in acceptBys"
                    :key="item.id"
                    :label="item.jobs[0].name + '-'+ item.username "
                    :value="item.username"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          <br>
          <el-col :span="8">
            <el-form-item label="批准部门" prop="approveDepart">
              <TreeSelect
                v-model="form.approveDepart"
                :options="useDeparts"
                :load-options="loadFileDepts"
                class="newTree-item"
                placeholder="选择批准验收部门"
                style="width:220px !important;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批准人" prop="approveBy">
              <el-select
                v-model="form.approveBy"
                placeholder="请选择批准人人"
              >
                <el-option
                  v-for="item in approveBys"
                  :key="item.id"
                  :label="item.jobs[0].name + '-'+ item.username "
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudEquipAcceptance from '@/api/tools/equipAcceptance'
import eHeader from '../management/module/header'
import CRUD, {crud, form, header, presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import {mapGetters} from "vuex";
import {getToken} from "@/utils/auth";
import {GMTToDate, judgeIsEqual, validIsNotNull} from "@/utils/validationUtil";
import {getDepts, getDeptTree} from "@/api/system/dept";
import TreeSelect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getEquipmentByExample, getEquipmentById} from "@/api/tools/equipment";
import {getUserByDeptId} from "@/api/system/user";

const defaultForm = {
  id: null,
  equipmentId: null,
  acceptParticipant: null,
  participantTags: [],
  acceptDepart: null,
  acceptBy: null,
  approveDepart: null,
  approveBy: null
}
export default {
  name: 'Acceptance',
  components: {eHeader, crudOperation, pagination, udOperation, TreeSelect},
  cruds() {
    return CRUD({
      title: '设备验收',
      url: 'api/equipAcceptance',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudEquipAcceptance}
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['equip_status'],
  data() {
    return {
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'acceptance:add'],
        edit: ['admin', 'acceptance:edit'],
        del: ['admin', 'acceptance:del']
      },
      equipForm: {},
      useDeparts: [],
      rules: {
        equipmentId: [
          {required: true, message: '请选择需要验收的设备', trigger: 'blur'}
        ],
        acceptParticipant: [
          {required: true, message: '验收人员不可为空', trigger: 'blur'}
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
                new Date(time).getTime() <= date
              )
            } else {
              return false
            }
          }
        }
      ],
      equipments: [],
      cond: {
        statusInList: ['待验收']
      },
      inputParticipantVisible: false,
      inputParticipantValue: null,
      acceptBys: [],
      approveBys: []
    }
  },
  watch: {
    // 监听deptId
    'form.acceptDepart': 'currAcceptDeptChange',
    'form.approveDepart': 'currApproveDeptChange'
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi'
    ])
  },
  created: function () {
    this.getTopDept()
    this.getAllEquipments(this.cond)
    this.crud.optShow = {
      add: true,
      edit: true,
      del: false,
      download: true,
      reset: true
    }
  },
  methods: {
    // 获取所有的设备信息
    getAllEquipments(cond) {
      this.equipments = []
      getEquipmentByExample(cond).then(res => {
        this.equipments = res
        // alert(JSON.stringify(this.equipments))
      })
    },
    // 监控设备ID变化
    changeEquip(id) {
      getEquipmentById(id).then(res => {
        this.equipForm = res
      })
    },
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
    // 检测验收部门变化
    currAcceptDeptChange(deptId) {
      this.acceptBys = []
      // 根据部门标识（val）查找人员信息
      getUserByDeptId({deptId: deptId}).then(res => {
        this.acceptBys = res
        this.form.acceptBy = this.acceptBys.length > 0 ? this.acceptBys[0].username : null
        // alert(JSON.stringify(this.users))
        // alert(this.form.acceptBy)
      })
    },
    currApproveDeptChange(deptId) {
      this.approveBys = []
      // 根据部门标识（val）查找人员信息
      getUserByDeptId({deptId: deptId}).then(res => {
        // alert(JSON.stringify(res))
        this.approveBys = res
        this.form.approveBy = this.approveBys.length > 0 ? this.approveBys[0].username : null
        // alert(JSON.stringify(this.users))
      })
    },
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {
      this.getAllEquipments(this.cond)
      this.equipForm = {}
    },
    // 编辑前操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      // 初始化设备信息
      this.changeEquip(form.equipmentId)
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
    // todo 查看设备相关的保养记录
    checkMainRecord(row) {
      alert(JSON.stringify(row))
    },
    // 删除参与人员tag
    handleParticipantClose(tag) {
      this.form.participantTags.splice(this.form.participantTags.indexOf(tag), 1)
      this.form.acceptParticipant = this.form.participantTags.join(',')
    },
    // 参与人员相关
    showInputDepart() {
      this.inputParticipantVisible = true
      this.$nextTick(_ => {
        this.$refs.participantTagInput.$refs.input.focus()
      })
    },
    handleInputParticipantConfirm() {
      const inputValue = this.inputParticipantValue
      if (inputValue) {
        this.form.participantTags.push(inputValue)
      }
      this.form.acceptParticipant = this.form.participantTags.join(',')
      this.inputParticipantVisible = false
      this.inputParticipantValue = ''
    }
  }
}
</script>

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
