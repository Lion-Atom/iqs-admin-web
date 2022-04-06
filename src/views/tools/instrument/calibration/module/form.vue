<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="700px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="110px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="仪器名称"
            prop="instruName"
          >
            <el-input
              v-model="form.instruName"
              style="width: 550px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="出厂型号"
            prop="instruNum"
          >
            <el-input
              v-model="form.instruNum"
              style="width: 220px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="出厂日期"
            prop="purDate"
          >
            <el-date-picker
              v-model="form.purDate"
              :picker-options="initTimeOption"
              type="date"
              style="width: 220px;"
              placeholder="请填写日期时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="内部ID"
            prop="innerId"
          >
            <el-input
              v-model="form.innerId"
              style="width: 220px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="资产号"
            prop="assetNum"
          >
            <el-input
              v-model="form.assetNum"
              style="width: 220px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="测量范围"
            prop="caliScope"
          >
            <el-input
              v-model="form.caliScope"
              style="width: 220px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="精度要求"
            prop="precise"
          >
            <el-input
              v-model="form.precise"
              style="width: 220px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="允许误差"
            prop="errorRange"
          >
            <el-input
              v-model="form.errorRange"
              style="width: 220px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="使用区域"
            prop="useArea"
          >
            <el-input
              v-model="form.useArea"
              style="width: 220px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="使用人"
            prop="useBy"
          >
            <el-select
              v-model="form.useBy"
              placeholder="请选择使用人"
              style="width: 220px;"
            >
              <el-option
                v-for="item in users"
                style="width: 220px"
                :key="item.id"
                :label="item.dept.name + ' - ' +item.username "
                :value="item.username"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="上次校准日期"
            prop="lastCaliDate"
          >
            <el-date-picker
              v-model="form.lastCaliDate"
              :picker-options="pickerOptions[0]"
              type="date"
              style="width: 220px;"
              placeholder="请填写日期时间"
              @input="lastCaliDateHandler"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="校准周期"
            prop="caliPeriod"
          >
            <el-input
              v-model="form.caliPeriod"
              style="width: 220px;"
              class="input-with-select"
              :min="minCaliPeriod"
              type="number"
              :step="1"
              @input="caliPeriodChange"
            >
              <el-select v-model="form.periodUnit" slot="append" style="width: 60px;" @change="periodUnitChange"
                         placeholder="请选择">
                <el-option label="年" value="年"></el-option>
                <el-option label="月" value="月"></el-option>
                <el-option label="日" value="日"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <!--下次校准日期约束-->
        <el-col :span="12" v-if="form.lastCaliDate && form.caliPeriod">
          <el-form-item
            label="下次校准日期"
            prop="nextCaliDate"
          >
            <el-date-picker
              v-model="form.nextCaliDate"
              :picker-options="pickerOptions[1]"
              type="date"
              placeholder="请填写日期时间"
              @input="nextCaliDateChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="内部校准"
            prop="innerChecked"
          >
            <el-radio v-for="item in caliStatus" :key="item.id" v-model="form.innerChecked" @change="caliStatusChanged"
                      :label="item.value === 'true'">
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.innerChecked.toString()==='false'">
          <el-form-item
            label="外部校准选择"
            prop="isDoor"
          >
            <el-radio v-for="item in outCheck" :key="item.id" v-model="form.isDoor" :label="item.value === 'true'">
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="是否报废"
            prop="isDroped"
          >
            <el-radio v-for="item in caliStatus" :key="item.id" v-model="form.isDroped" @change="isDropedChanged"
                      :label="item.value === 'true'">
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.isDroped.toString() === 'true'">
          <el-form-item
            prop="dropRemark"
            label="报废说明"
          >
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入报废/无法使用说明"
              v-model="form.dropRemark">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.isDroped.toString() === 'false'">
          <el-form-item
            label="下次校准提醒"
            prop="isRemind"
          >
            <el-radio v-for="item in caliStatus" :key="item.id" v-model="form.isRemind" @change="isDropedChanged"
                      :label="item.value === 'true'">
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.isDroped.toString() === 'false' && form.isRemind.toString() === 'true'">
          <el-form-item
            prop="remindDays"
          >
            <template slot="label">
              <span><i style="color: red;">* </i>提前提醒天数</span>
            </template>
            <el-input placeholder="请输入提醒天数" type="number" :min="1" :max="maxRemindDays" v-model="form.remindDays"
                      @input="remindDaysHandler">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isNeedUpdate && form.status === '已完成'">
          <el-form-item
            label="激活下个周期"
            prop="isNextActive"
          >
            <el-radio v-for="item in caliStatus" :key="item.id" v-model="isNextActive" @change="isNextActiveChange"
                      :label="item.value === 'true'">
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="12" v-if="!crud.status.management">
                  <el-form-item
                    label="校准状态"
                    prop="status"
                  >
                    <el-input
                      disabled
                      v-model="form.status">
                    </el-input>
                  </el-form-item>
                </el-col>-->
      </el-row>
      <!--添加校准报告-->
      <el-row>
        <el-form-item style="width:100%;">
          <template slot="label">
            <span><i style="color: red">* </i>上次校准报告</span>
          </template>
          <div v-if="crud.status.add || toUpdateFile">
            <div>
              <el-form
                ref="fileForm"
                :model="fileForm"
                :rules="fileRules"
                size="small"
                label-width="140px;"
              >
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      label="校准结果"
                      prop="caliResult"
                    >
                      <el-radio v-for="item in caliResults" :key="item.value" v-model="fileForm.caliResult"
                                :label="item.label">
                        {{ item.value }}
                      </el-radio>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" v-if="fileForm.caliResult === '不合格'">
                    <el-form-item
                      label="不合格原因描述"
                      prop="failDesc"
                    >
                      <el-input
                        style="max-width: 370px;"
                        type="textarea"
                        autosize
                        placeholder="请输入报废/无法使用说明"
                        v-model="fileForm.failDesc">
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <el-upload
              ref="caliOrgFileUpload"
              class="upload-demo"
              drag
              :limit="1"
              :before-upload="beforeUpload"
              :headers="headers"
              :before-remove="beforeRemove"
              :on-remove="removeFile"
              :on-change="fileChange"
              :on-success="handleSuccess"
              :on-error="handleError"
              :file-list="form.fileList"
              :action="instruCaliFileUploadApi + '?caliId=' + bindingId + '&isLatest=' + true + '&caliResult=' + fileForm.caliResult + '&failDesc=' + fileForm.failDesc"
            >
              <i class="el-icon-upload"/>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件[限<b style="color: red;">1</b>份]，且不超过100M
                <el-button v-if="form.status === '已完成' &&toUpdateFile" type="text" @click="cancelToUpdate">取消
                </el-button>
              </div>
            </el-upload>
          </div>
          <div v-else v-for="file in form.fileList" :key="file.id" class="text item">
            <span style="display: inline;">
              <a :href="baseApi + '/file/' + file.type + '/' + file.name">{{ file.realName }} - <b style="color: red">{{ file.caliResult }}</b></a>
              <el-button type="text" @click="toUpdateFileBtn">更新报告</el-button>
            </span>
          </div>
        </el-form-item>
      </el-row>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import CRUD, {form} from '@crud/crud'
import {GMTToDate, judgeIsEqual, validIsNotNull} from "@/utils/validationUtil";
import {getToken} from "@/utils/auth";
import {mapGetters} from "vuex";
import {getUid} from "@/api/tools/supplier";
import {delByCaliOrgIdAndName} from "@/api/tools/caliOrgFile";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getAllUser} from "@/api/system/user";

const defaultForm = {
  id: null,
  instruName: null,
  instruNum: null,
  assetNum: null,
  purDate: null,
  innerId: null,
  caliPeriod: null,
  periodUnit: '年',
  lastCaliDate: null,
  nextCaliDate: null,
  innerChecked: true,
  isDoor: null,
  caliScope: null,
  precise: null,
  errorRange: null,
  useArea: null,
  useBy: null,
  isDroped: false,
  dropRemark: null,
  isRemind: false,
  remindDays: null,
  status: null,
  uid: null,
  fileList: []
}
export default {
  mixins: [form(defaultForm)],
  props: {
    caliStatus: {
      type: Array,
      required: true
    },
    outCheck: {
      type: Array,
      required: true
    },
    caliResults: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      headers: {'Authorization': getToken()},
      // 时间不可大于现在时间
      initTimeOption: {
        disabledDate(date) {
          return Date.now() < date.getTime()
        }
      },
      pickerOptions: [
        {
          disabledDate: time => {
            return (
              Date.now() < time.getTime()
            )
          }
        },
        {
          //限制结束时间为开始时间的一周后
          disabledDate: time => {
            let num = this.form.caliPeriod
            let unit = this.form.periodUnit
            let day = 24 * 3600 * 1000;
            if (validIsNotNull(unit)) {
              if (unit === '年') {
                day = num * 365 * 24 * 3600 * 1000
              } else if (unit === '月') {
                day = num * 30 * 24 * 3600 * 1000
              } else {
                day = num * 24 * 3600 * 1000
              }
            }
            // 是否限制的判断条件
            if (validIsNotNull(this.form.lastCaliDate)) {
              const date = new Date(this.form.lastCaliDate);
              // const dateRegion = date.getTime() + day - 24 * 3600 * 1000
              const dateRegion = date.getTime() + day
              // this.form.nextCaliDate = new Date(dateRegion)
              return (
                //禁用小于开始时间和大于开始时间一周后的日期
                new Date(time).getTime() > dateRegion ||
                new Date(time).getTime() < Date.now()
              )
            } else {
              return false
            }
          }
        }
      ],
      bindingId: null,
      rules: {
        instruName: [
          {required: true, message: '请输入仪器名称', trigger: 'blur'}
        ],
        innerId: [
          {required: true, message: '请输入内部ID', trigger: 'blur'}
        ],
        caliPeriod: [
          {required: true, message: '请输入校准周期', trigger: 'blur'}
        ],
        periodUnit: [
          {required: true, message: '请选择时间单位', trigger: 'blur'}
        ],
        lastCaliDate: [
          {required: true, message: '请输入上次校准日期', trigger: 'blur'}
        ],
        nextCaliDate: [
          {required: true, message: '请输入下次校准日期', trigger: 'blur'}
        ],
        innerChecked: [
          {required: true, message: '是否内部校准不可为空', trigger: 'blur'}
        ],
        isDoor: [
          {required: true, message: '是否是上门校准', trigger: 'blur'}
        ],
        caliScope: [
          {required: true, message: '测量范围不为空', trigger: 'blur'}
        ],
        precise: [
          {required: true, message: '精度要求不可为空', trigger: 'blur'}
        ],
        errorRange: [
          {required: true, message: '请填写允许误差', trigger: 'blur'}
        ],
        useArea: [
          {required: true, message: '请填写存放/使用区域', trigger: 'blur'}
        ],
        useBy: [
          {required: true, message: '请填写保管员/使用人', trigger: 'blur'}
        ],
        isDroped: [
          {required: true, message: '请判断是否作废或无法使用', trigger: 'blur'}
        ],
        dropRemark: [
          {required: true, message: '请填写作废或无法使用原因', trigger: 'blur'}
        ],
        isRemind: [
          {required: true, message: '请选择是否需要下次校准前提醒', trigger: 'blur'}
        ]
      },
      users: [],
      toUpdateFile: false,
      isNeedUpdate: false,
      oldLastCaliDate: null,
      oldPeriodUnit: null,
      oldCaliPeriod: null,
      isNextActive: false,
      oldFileList: [],
      minCaliPeriod: "1",
      maxRemindDays: "30",
      fileForm: {
        isLatest: true,
        caliResult: '合格',
        failDesc: null
      },
      fileRules: {
        isLatest: [
          {required: true, message: '请选择报告类型', trigger: 'blur'}
        ],
        caliResult: [
          {required: true, message: '请选择校准结果', trigger: 'blur'}
        ],
        failDesc: [
          {required: true, message: '请填写不合格原因', trigger: 'blur'}
        ]
      },
      caliResultOptions: [{
        label: '合格',
        value: '合格'
      }, {
        label: '不合格',
        value: '不合格'
      }]
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'instruCaliFileUploadApi'
    ])
  },
  watch: {},
  mounted: function () {
    this.getAllUseBy()
  },
  methods: {
    caliStatusChanged(val) {
      // alert(val)
      if (val.toString() === 'true') {
        // this.form.isDoor = null
      }
    },
    isDropedChanged(val) {
      if (val.toString() === 'true') {
        // this.form.isRemind = false
        this.form.remindDays = null
      }
    },
    isRemindChange(val) {
      if (val.toString() === 'false') {
        // this.form.isRemind = false
        this.form.remindDays = null
      }
    },
    // 监控上次校准时间变化
    lastCaliDateHandler(val) {
      this.isNeedUpdate = !judgeIsEqual(GMTToDate(val), GMTToDate(this.oldLastCaliDate));
      // this.getNextCaliDate()
      this.getMinCaliPeriod(val, this.form.periodUnit)
    },
    // 监控下次校准时间变化
    nextCaliDateChange(val) {
      this.$forceUpdate()
      // alert(val)
      // 根据下次校准日期设置提前设置的时间上限
      this.getMaxRemindDays(val)
    },
    getMaxRemindDays(val) {
      if (validIsNotNull(val)) {
        const end = new Date(val)
        this.maxRemindDays = Math.ceil((end - new Date(new Date(new Date().toLocaleDateString()).getTime())) / (24 * 3600 * 1000))
        if (this.maxRemindDays > 0 && this.form.isRemind.toString() === 'true') {
          // 若设置提醒则最大值不可超过今天距离提醒日
          if (this.form.remindDays > this.maxRemindDays) {
            this.form.remindDays = this.maxRemindDays
          }
        } else {
          this.form.isRemind = false
        }
      }
    },
    getMinCaliPeriod(val, unit) {
      const date = new Date(val);
      // const dateRegion = date.getTime() + day - 24 * 3600 * 1000
      if (unit === '年') {
        this.minCaliPeriod = Math.ceil(((new Date(new Date(new Date().toLocaleDateString()).getTime()) - date.getTime()) / (365 * 24 * 3600 * 1000)))
      } else if (unit === '月') {
        this.minCaliPeriod = Math.ceil((new Date(new Date(new Date().toLocaleDateString()).getTime()) - date.getTime()) / (30 * 24 * 3600 * 1000))
      } else {
        this.minCaliPeriod = Math.ceil((new Date(new Date(new Date().toLocaleDateString()).getTime()) - date.getTime()) / (24 * 3600 * 1000))
      }
      // alert(this.minCaliPeriod)
      if (this.minCaliPeriod < 1) {
        this.minCaliPeriod = 1
      }
      if (this.minCaliPeriod > this.form.caliPeriod) {
        this.form.caliPeriod = this.minCaliPeriod
      }
      // 判断现有的下次校准日期是否超出限制
      this.checkNextCaliDate()
    },
    checkNextCaliDate() {
      if (validIsNotNull(this.form.lastCaliDate)) {
        const date = new Date(this.form.lastCaliDate);
        // const dateRegion = date.getTime() + day - 24 * 3600 * 1000
        let num = this.form.caliPeriod
        let unit = this.form.periodUnit
        let day = 24 * 3600 * 1000;
        if (validIsNotNull(unit)) {
          if (unit === '年') {
            day = num * 365 * 24 * 3600 * 1000
          } else if (unit === '月') {
            day = num * 30 * 24 * 3600 * 1000
          } else {
            day = num * 24 * 3600 * 1000
          }
        }
        const dateRegion = date.getTime() + day
        // alert(this.form.nextCaliDate)
        this.form.nextCaliDate = new Date(dateRegion)
        this.getMaxRemindDays(this.form.nextCaliDate)

      } else {
        this.form.nextCaliDate = null
      }
    },
    // 限制可输入最大值
    remindDaysHandler(val) {
      // alert(val)
      if (val > this.maxRemindDays) {
        this.form.remindDays = this.maxRemindDays
      }
    },
    caliPeriodChange(val) {
      /*if (!judgeIsEqual(this.oldCaliPeriod, val)) {
        this.form.nextCaliDate = null
      }*/
      // this.getNextCaliDate()
      // 判断现有的下次校准日期是否超出限制
      this.checkNextCaliDate()
    },
    // 监控
    periodUnitChange(val) {
      this.getMinCaliPeriod(this.form.lastCaliDate, val)
    },
    getNextCaliDate() {
      // 是否限制的判断条件
      if (validIsNotNull(this.form.lastCaliDate)) {
        const date = new Date(this.form.lastCaliDate);
        // const dateRegion = date.getTime() + day - 24 * 3600 * 1000
        const dateRegion = date.getTime() + day
        this.defaultNextCaliDate = new Date(dateRegion)
      } else {
        this.defaultNextCaliDate = null
      }
    },
    // 是否激活下个循环
    isNextActiveChange(val) {
      // alert(val)
      if (val) {
        this.toUpdateFile = true
        // this.form.status = '报告待传'
        this.form.fileList = []
      } else {
        this.toUpdateFile = false
        this.form.fileList = this.oldFileList
      }
    },
    // 获取公司员工数据
    getAllUseBy() {
      // alert(val)
      this.users = []
      getAllUser().then(res => {
        // alert(JSON.stringify(res.content))
        this.users = res.content
      })
    },
    // 新增前操作处理
    [CRUD.HOOK.beforeToAdd]() {
      /*if (this.$refs['fileForm'] !== undefined) {
        this.$refs['fileForm'].resetFields()
      }*/
      this.fileForm= {
        isLatest: true,
          caliResult: '合格',
          failDesc: null
      }
      this.form.fileList = []
      this.toUpdateFile = false
      this.isNeedUpdate = false
      this.bindingId = null
      this.form.uid = null
      getUid().then(res => {
        this.form.uid = res
        // alert(JSON.stringify(this.form))
        this.bindingId = res
        // alert(this.bindingId)
      })
    },
    // 编辑前操作处理
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.bindingId = form.id
      this.toUpdateFile = form.status !== '已完成';
      this.isNeedUpdate = false
      this.oldLastCaliDate = form.lastCaliDate
      this.oldCaliPeriod = form.caliPeriod
      this.oldPeriodUnit = form.periodUnit
      this.oldFileList = form.fileList

      const end = new Date(form.nextCaliDate)
      this.maxRemindDays = Math.ceil((end - new Date(new Date(new Date().toLocaleDateString()).getTime())) / (24 * 3600 * 1000))
      if (this.maxRemindDays > 0 && form.isRemind.toString() === 'true') {
        // 若设置提醒则最大值不可超过今天距离提醒日
        if (form.remindDays > this.maxRemindDays) {
          form.remindDays = this.maxRemindDays
        }
      }
      this.getMinCaliPeriod(form.lastCaliDate, form.periodUnit)
    },
    // 取消变更
    cancelToUpdate() {
      this.toUpdateFile = false
      this.form.fileList = this.oldFileList
    },
    // 预更新校准文件
    toUpdateFileBtn() {
      this.toUpdateFile = true
      this.form.fileList = []
      if (this.$refs['fileForm'] !== undefined) {
        this.$refs['fileForm'].resetFields()
      }
    },
    // 新增/编辑验证后
    [CRUD.HOOK.afterValidateCU]() {
      let num = this.form.caliPeriod
      let unit = this.form.periodUnit
      let day = 24 * 3600 * 1000;
      if (validIsNotNull(unit)) {
        if (unit === '年') {
          day = num * 365 * 24 * 3600 * 1000
        } else if (unit === '月') {
          day = num * 30 * 24 * 3600 * 1000
        } else {
          day = num * 24 * 3600 * 1000
        }
      }
      // 验证时间设置是否合法
      const lastDate = new Date(this.form.lastCaliDate);
      const nextDate = new Date(this.form.nextCaliDate)
      const dateRegion = lastDate.getTime() + day;
      if (new Date(nextDate).getTime() < lastDate.getTime()) {
        this.$message.warning("下次校准时间不可早于上次校准日期！")
        return false
      } else if (new Date(nextDate).getTime() > dateRegion) {
        this.$message.warning("下次校准时间不可晚于校准周期下日期：【" + GMTToDate(dateRegion) + "】！")
        return false
      }
      /*else if (new Date(nextDate).getTime() < new Date(new Date(new Date().toLocaleDateString()).getTime())) {
        this.$message.warning("下次校准时日期设置不合理，不可在今天之前！")
        return false
      }*/

      if (this.form.isDroped.toString() === 'false' && this.form.isRemind.toString() === 'true' && !validIsNotNull(this.form.remindDays)) {
        this.$message.warning("请设置提前提醒天数！")
        return false
      }
      if (this.form.isRemind.toString() === 'false') {
        // this.form.isRemind = false
        this.form.remindDays = null
      }
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      // alert(this.toUpdateFile)
      //新增时候必须校验是否上传最新的校准报告
      if (this.crud.status.add) {
        if (this.form.fileList.length === 0) {
          this.$message.warning("请务必上传上次校准报告！")
          return false
        }
      } else if (this.crud.status.edit) {
        // 编辑时候判断是否上传校准报告，未上传则状态变更为提示状态
        if (this.isNextActive && this.form.fileList.length === 0) {
          this.form.status = '报告待传'
        }
      }
    },
    beforeUpload: function (file) {
      // alert(JSON.stringify(file))
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      if (this.form.name === '' || this.form.name === undefined) {
        this.form.name = file.name
      }
      return isLt2M
    },
    // 监听上传成功
    handleSuccess(response, file, fileList) {
      this.crud.notify('Upload Success! 上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      // this.$refs.upload.clearFiles()
    },
    // 监听删除操作
    beforeRemove(file, fileList) {
      // alert(JSON.stringify(file))
      // alert(JSON.stringify(fileList))
      // 删除失败了，回滚为无效删除
      delByCaliOrgIdAndName(this.bindingId, file.name).then(() => {

      }).catch(() => {

      })
      let a = true;
      if (file && file.status === 'success') {
        a = this.$confirm(`确定移除 ${file.name}？`);
        if (a) {
          delByCaliOrgIdAndName(this.bindingId, file.name).then(() => {

          }).catch(() => {
            // todo  删除失败咋办？？？
          })
        }
      }
      return a
    },
    // 选择文件、移除文件、上传文件成功/失败后，都会触发
    fileChange(file, fileList) {
      this.form.fileList = fileList
    },
    // 移除文件时触发
    removeFile(file, fileList) {
      this.form.fileList = fileList
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      this.form.name = ''
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
