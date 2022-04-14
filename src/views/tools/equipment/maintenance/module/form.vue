<template>
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
      label-width="120px"
    >
      <!--设备信息-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="设备编号" prop="equipNum">
            <el-input v-model="form.equipNum" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="equipmentId">
            <template slot="label">
              <span><i style="color: red">* </i>设备名称</span>
            </template>
            <el-input v-model="form.equipName" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备型号" prop="equipModel">
            <el-input v-model="form.equipModel" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产号" prop="assetNum">
            <el-input v-model="form.assetNum" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备位置" prop="useArea">
            <el-input v-model="form.useArea" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用部门" prop="useDepart">
            <el-input v-model="form.useDepartName" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <!--设备保养信息-->
        <el-col :span="8">
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
        </el-col>
        <el-col :span="8">
          <el-form-item label="保养等级" prop="maintainLevel">
            <el-select
              v-model="form.maintainLevel"
              filterable
              clearable
              allow-create
              placeholder="请选择设备级别"
              style="width: 220px;"
            >
              <el-option
                v-for="item in maintainLevelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="保养周期"
            prop="maintainPeriod"
          >
            <el-input
              v-model="form.maintainPeriod"
              style="width: 220px;"
              class="input-with-select"
              :min="1"
              type="number"
              :step="1"
            >
              <el-select v-model="form.maintainPeriodUnit" slot="append" style="width: 60px;"
                         placeholder="请选择">
                <el-option label="年" value="年"></el-option>
                <el-option label="季" value="季"></el-option>
                <el-option label="月" value="月"></el-option>
                <el-option label="周" value="周"></el-option>
                <el-option label="日" value="日"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" v-if="form.lastMaintainDate">
          <el-form-item
            label="上次保养日期"
            prop="lastMaintainDate"
          >
            <el-date-picker
              v-model="form.lastMaintainDate"
              type="date"
              style="width: 220px;"
              placeholder="请填写日期时间"
              @input="lastMaintainDateHandler"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.lastMaintainDate && form.maintainPeriod && form.maintainPeriodUnit">
          <el-form-item
            label="保养到期日期"
            prop="lastMaintainDate"
          >
            <el-date-picker
              v-model="form.maintainDueDate"
              type="date"
              disabled
              style="width: 220px;"
              placeholder="请填写日期时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="下次校准提醒"
            prop="isRemind"
          >
            <el-radio v-for="item in judgeFault" :key="item.id" v-model="form.isRemind" :label="item.value === 'true'">
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.isRemind">
          <el-form-item
            prop="remindDays"
          >
            <template slot="label">
              <span><i style="color: red;">* </i>提前提醒天数</span>
            </template>
            <el-input placeholder="请输入提醒天数" type="number" :min="1" v-model="form.remindDays" style="width: 220px">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="crud.cancelCU">取消</el-button>
      <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CRUD, {form} from '@crud/crud'
import {mapGetters} from "vuex";
import {getToken} from "@/utils/auth";
import {getAllUser} from "@/api/system/user";

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
  equipLevel: null,
  equipStatus: null,
  status: null,
  equipOltage: null,
  equipAir: null,
  equipWater: null,
  equipOther: null,
  maintainLevel: null,
  maintainPeriod: null,
  maintainPeriodUnit: '年',
  lastMaintainDate: null,
  maintainDueDate: null,
  isRemind: false,
  remindDays: null,
  acceptBy: null,
  netValue: null,
  roi: null
}
export default {
  mixins: [form(defaultForm)],
  props: {
    judgeFault: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      headers: {'Authorization': getToken()},
      permission: {
        edit: ['admin', 'equip:edit']
      },
      cond: {
        statusInList: ['已验收']
      },
      users: [],
      pickerOptions: [
        {
          /*disabledDate: time => {
            return (
              Date.now() < time.getTime()
            )
          }*/
        },
        {
          //限制开始维修时间不可早于停机时间
          /* disabledDate: time => {
             // 是否限制的判断条件
             if (validIsNotNull(this.form.shutTime)) {
               return (
                 //禁用小于开始时间和大于开始时间一周后的日期
                 new Date(time).getTime() > Date.now() ||
                 new Date(time).getTime() < this.form.shutTime
               )
             } else {
               return false
             }
           }*/
        },
        {
          //限制开始维修时间不可早于停机时间
          /*disabledDate: time => {
            // 是否限制的判断条件
            if (validIsNotNull(this.form.repairTime)) {
              return (
                //禁用小于开始时间和大于开始时间一周后的日期
                new Date(time).getTime() > Date.now() ||
                new Date(time).getTime() < this.form.repairTime
              )
            } else {
              return false
            }
          }*/
        }
      ],
      rules: {
        equipNum: [
          {required: true, message: '请输入设备编号', trigger: 'blur'}
        ],
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
        equipStatus: [
          {required: true, message: '请输入设备运行状态', trigger: 'blur'}
        ],
        useArea: [
          {required: true, message: '请输入设备位置', trigger: 'blur'}
        ],
        useDepart: [
          {required: true, message: '请输入设备使用部门', trigger: 'blur'}
        ],
        equipLevel: [
          {required: true, message: '请输入设备等级', trigger: 'blur'}
        ],
        maintainLevel: [
          {required: true, message: '请输入保养等级', trigger: 'blur'}
        ],
        maintainPeriod: [
          {required: true, message: '请输入保养等级', trigger: 'blur'}
        ],
        maintainPeriodUnit: [
          {required: true, message: '请输入保养周期单位', trigger: 'blur'}
        ],
        isRemind: [
          {required: true, message: '请选择是否保养提前提醒', trigger: 'blur'}
        ]
      },
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
      maintainLevelOptions: [
        {
          label: '一级保养',
          value: '一级保养'
        },
        {
          label: '二级保养',
          value: '二级保养'
        },
        {
          label: '三级保养',
          value: '三级保养'
        },
      ],
    }
  },
  created: function () {
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi'
    ])
  },
  watch: {},
  mounted() {
    this.getAllUser()
  },
  methods: {
    getAllUser() {
      this.users = []
      getAllUser().then(res => {
        this.users = res.content
      })
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
    // todo 监控上次保养日期变化
    lastMaintainDateHandler(v) {
      // alert(v)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
