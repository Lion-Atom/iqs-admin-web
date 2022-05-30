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
      label-width="110px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="仪器名称" prop="instruName">
            <el-input v-model="form.instruName" placeholder="请填写仪器名称" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出厂型号" prop="instruNum">
            <el-input v-model="form.instruNum" placeholder="请填写出厂型号"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="出厂日期"
            prop="purDate"
          >
            <el-date-picker
              v-model="form.purDate"
              type="date"
              placeholder="请填写出厂日期"
              :picker-options="pickerOption"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="内部编码" prop="innerId">
            <el-input v-model="form.innerId" placeholder="请填写内部编码"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产号" prop="assetNum">
            <el-input v-model="form.assetNum" placeholder="请填写资产号"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="测量范围" prop="caliScope">
            <el-input v-model="form.caliScope" placeholder="请填写测量范围"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="精度要求" prop="precise">
            <el-input v-model="form.precise" placeholder="请填写精度要求"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="允许误差" prop="errorRange">
            <el-input v-model="form.errorRange" placeholder="请填写允许误差范围"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="存放位置" prop="position">
            <el-input v-model="form.position" placeholder="请填写存放位置"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保管人" prop="keeper">
            <el-input v-model="form.keeper" placeholder="请填写保管人员"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用区域" prop="useArea">
            <el-input v-model="form.useArea" placeholder="请填写使用区域"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用人" prop="useBy">
            <el-select
              v-model="form.useBy"
              placeholder="请选/填使用人"
              filterable
              allow-create
              style="width: 100%"
            >
              <el-option
                v-for="item in users"
                :key="item.username"
                :label="item.dept.name + ' - ' +item.username "
                :value="item.username">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用状态" prop="status">
            <el-select
              v-model="form.status"
              placeholder="请选择使用状态"
              filterable
              allow-create
              style="width: 100%"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.value "
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.status !== '报废'">
          <el-form-item
            label="校准周期"
            prop="caliPeriod"
          >
            <el-input
              v-model="form.caliPeriod"
              placeholder="请填写校准周期"
              style="width: 100%"
              class="input-with-select"
              :min="1"
              type="number"
              :step="1"
              @input="maintainPeriodChange"
            >
              <el-select v-model="form.periodUnit" slot="append" style="width: 60px;"
                         placeholder="请选择" @change="maintainUnitChange">
                <el-option label="年" value="年"></el-option>
                <el-option label="月" value="月"></el-option>
                <el-option label="周" value="周"></el-option>
                <el-option label="日" value="日"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.status !== '报废'">
          <el-form-item
            label="下次校准提醒"
            prop="isRemind"
          >
            <el-radio
              v-for="item in caliStatus"
              :key="item.id"
              v-model="form.isRemind"
              :label="item.value === 'true'">
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.status !== '报废' && form.isRemind.toString() === 'true'">
          <el-form-item
            label="提前提醒天数"
            prop="remindDays"
          >
            <el-input placeholder="请输入提醒天数" type="number" :min="1" :max="maxRemindDays"
                      v-model="form.remindDays" @input="remindDaysMaxValue">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.status === '报废'">
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
        <el-col :span="24" v-if="form.status === '限制使用'">
          <el-form-item
            prop="limitRemark"
            label="限制说明"
          >
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入限制说明"
              v-model="form.limitRemark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-if="form.status==='报废'">
          <el-form-item>
            <template slot="label">
              <span><i style="color: red">* </i>异常报告</span>
            </template>
            <el-table
              ref="table"
              border
              v-loading="filesLoading"
              :data="form.fileList"
              style="width: 100%;margin-bottom: 10px;"
              highlight-current-row
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
              />
              <el-table-column prop="name" label="附件名称" min-width="200">
                <template slot-scope="scope">
                  <el-popover
                    :content="'file/' + scope.row.type + '/' + scope.row.name"
                    placement="top-start"
                    title="路径"
                    width="200"
                    trigger="hover"
                  >
                    <!--可下载文件-->
                    <a
                      slot="reference"
                      :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.name"
                      class="el-link--primary"
                      style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                      target="_blank"
                      :download="scope.row.realName"
                    >
                      {{ scope.row.realName }}
                    </a>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="path" label="预览图">
                <template slot-scope="{row}">
                  <el-image
                    :src=" baseApi + '/file/' + row.type + '/' + row.name"
                    :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.name]"
                    fit="contain"
                    lazy
                    class="el-avatar"
                  >
                    <div slot="error">
                      <i class="el-icon-document"/>
                    </div>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者" min-width="80"/>
              <!--   附件删除   -->
              <el-table-column
                label="操作"
                width="80"
                align="center"
              >
                <template slot-scope="scope">
                  <el-popover
                    :ref="`delStaffFile-popover-${scope.$index}`"
                    v-permission="permission.edit"
                    placement="top"
                    width="180"
                  >
                    <p>确定删除这个附件吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        type="text"
                        @click="scope._self.$refs[`delStaffFile-popover-${scope.$index}`].doClose()"
                      >取消
                      </el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="deleteInstruFile(scope.row), scope._self.$refs[`delStaffFile-popover-${scope.$index}`].doClose()"
                      >确定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      v-permission="permission.edit"
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      :disabled="form.fileList.length < 2"
                    />
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <el-upload
              class="upload-demo"
              ref="upload"
              :headers="headers"
              :multiple="true"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :action="instrumentFileUploadApi + '?instruId=' + bindingId"
              :on-error="handleError">
              <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
              <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且单文件不超过100M</div>
            </el-upload>
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
import TreeSelect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getDepts, getDeptTree} from "@/api/system/dept";
import {getAllUser, getUserByDeptId} from "@/api/system/user";
import {validIsNotNull} from "@/utils/validationUtil";
import {mapGetters} from "vuex";
import {getUid} from "@/api/tools/supplier";
import {getToken} from "@/utils/auth";
import {delInstruFile, getFileByInstruId} from "@/api/tools/instrument/instrumentFile";

const defaultForm = {
  id: null,
  instruName: null,
  instruNum: null,
  assetNum: null,
  purDate: null,
  innerId: null,
  position: null,
  keeper: null,
  caliScope: null,
  precise: null,
  errorRange: null,
  useArea: null,
  useBy: null,
  status: '正常使用',
  caliStatus: null,
  limitRemark: null,
  dropRemark: null,
  caliPeriod: null,
  periodUnit: '月',
  lastCaliDate: null,
  nextCaliDate: null,
  innerChecked: true,
  caliOrgId: null,
  isDoor: null,
  isRemind: false,
  remindDays: null,
  uid: null,
  fileList: []
}
export default {
  mixins: [form(defaultForm)],
  components: {TreeSelect},
  props: {
    statusOptions: {
      type: Array,
      required: true
    },
    caliStatus: {
      type: Array,
      required: true
    },
    permission: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      headers: {'Authorization': getToken()},
      rules: {
        instruName: [
          {required: true, message: '请输入仪器仪表名称', trigger: 'blur'}
        ],
        instruNum: [
          {required: true, message: '请输入出厂型号', trigger: 'blur'}
        ],
        assetNum: [
          {required: false, message: '请输入资产号', trigger: 'blur'}
        ],
        purDate: [
          {required: true, message: '请输入出厂日期', trigger: 'blur'}
        ],
        innerId: [
          {required: true, message: '请输入内部ID', trigger: 'blur'}
        ],
        position: [
          {required: true, message: '请填写存放位置', trigger: 'blur'}
        ],
        keeper: [
          {required: true, message: '请填写保管人员', trigger: 'blur'}
        ],
        caliScope: [
          {required: true, message: '请填写测量范围', trigger: 'blur'}
        ],
        precise: [
          {required: true, message: '请填写精度要求', trigger: 'blur'}
        ],
        errorRange: [
          {required: true, message: '请填写允许误差', trigger: 'blur'}
        ],
        useArea: [
          {required: true, message: '请填写使用区域', trigger: 'blur'}
        ],
        useBy: [
          {required: true, message: '请填写使用人员', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选/填仪器状态', trigger: 'blur'}
        ],
        caliPeriod: [
          {required: true, message: '请填写校准周期', trigger: 'blur'}
        ],
        isRemind: [
          {required: true, message: '请选择是否提前提醒', trigger: 'blur'}
        ],
        remindDays: [
          {required: true, message: '请填写提前提醒天数', trigger: 'blur'}
        ],
        limitRemark: [
          {required: true, message: '请填写限制说明', trigger: 'blur'}
        ],
        dropRemark: [
          {required: true, message: '请填写无法使用原因', trigger: 'blur'}
        ]
      },
      users: [],
      reasonRules: [
        {required: false}
      ],
      pickerOption: {
        disabledDate: time => {
          return (
            Date.now() <= time.getTime()
          )
        }
      },
      bindingId: null,
      filesLoading: false
    }
  },
  watch: {
    // 监听deptId
    'form.departId': 'currDeptChange'
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'instrumentFileUploadApi'
    ])
  },
  created: function () {
    this.getAllAvailUser()
  },
  methods: {
    // 获取公司员工数据
    getAllAvailUser() {
      this.users = []
      getAllUser().then(res => {
        // alert(JSON.stringify(res.content))
        this.users = res.content
      })
    },
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {
      this.bindingId = null
      this.form.uid = null
      getUid().then(res => {
        this.form.uid = res
        // alert(JSON.stringify(this.form))
        this.bindingId = res
        // alert(this.bindingId)
      })
    },
    // 编辑前操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      // alert(JSON.stringify(form))
      this.bindingId = form.id
      // 获取仪器报告单列表
      this.getInstruFileById(form.id)
      // 监控提前提醒最大值设计
      this.getMaxRemindDays(form.caliPeriod, form.periodUnit)
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      // alert(JSON.stringify(this.form.fileList))
      // 判断是否确认完成，若确认完成则必须上传确认单
      if (this.form.status === '报废' && this.form.fileList.length === 0) {
        this.$message.warning("请务必上传仪器异常报告！")
        return false
      }
    },
    // 获取维修相关确认单信息
    getInstruFileById(id) {
      this.form.fileList = []
      this.filesLoading = true
      getFileByInstruId(id).then(res => {
        // alert(JSON.stringify(res))
        this.form.fileList = res
        this.filesLoading = false
      })
    },
    // 监控培训结果变化
    trainResultChanged(val) {
      if (val.toString() === 'false') {
        this.reasonRules = this.rules.reason
      } else {
        this.reasonRules = [
          {required: false}
        ]
      }
    },
    // ------------上传附件管理--------------
    // 上传前的校验
    beforeUpload: function (file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      return isLt2M
    },
    // 监听上传成功
    handleSuccess(response, file, fileList) {
      this.getInstruFileById(this.bindingId)
      setTimeout(() => {
        this.$message.success('上传文件成功!')
      }, 300)
      this.$refs.upload.clearFiles()
    },
    // 删除附件
    deleteInstruFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delInstruFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getInstruFileById(row.instruId)
      })
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
    },
    // 提醒天数的设置
    // 监控保养周期单位变化
    maintainUnitChange(val) {
      this.getMaxRemindDays(this.form.caliPeriod, val)
    },
    // 监控保养周期变化
    maintainPeriodChange(val) {
      this.getMaxRemindDays(val, this.form.periodUnit)
    },
    getMaxRemindDays(period, unit) {
      let days = 1
      if (unit === '年') {
        days = 360
      } else if (unit === '季') {
        days = 90
      } else if (unit === '月') {
        days = 30
      } else if (unit === '周') {
        days = 7
      }
      if (validIsNotNull(period)) {
        this.maxRemindDays = period * days
        if (validIsNotNull(this.form.remindDays)) {
          if (this.form.remindDays > this.maxRemindDays) {
            this.form.remindDays = this.maxRemindDays
          }
        }
        // 重新计算设备保养到期时间
        // this.form.lastCaliDate = new Date(new Date(this.form.lastCaliDate).getTime() + (period * days * 24 * 1000 * 3600))
      }
    },
    remindDaysMaxValue(v) {
      this.form.remindDays = v > this.maxRemindDays ? this.maxRemindDays : v
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
