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
          <el-form-item label="新员工姓名" prop="staffName">
            <el-input v-model="form.staffName" style="width: 220px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="入职日期"
            prop="hireDate"
          >
            <el-date-picker
              v-model="form.hireDate"
              type="date"
              style="width: 220px;"
              placeholder="请填写入职时间"
              :picker-options="pickerOption[0]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属部门" prop="departId">
            <TreeSelect
              v-model="form.departId"
              :options="departs"
              :load-options="loadDeparts"
              class="newTree-item"
              placeholder="选择新员工所在部门"
              style="width:220px !important;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上级主管" prop="superior">
            <el-select
              v-model="form.superior"
              placeholder="请先选择所在部门"
              style="width:220px"
            >
              <el-option
                v-for="item in superiors"
                :key="item.id"
                :label="item.jobs[0].name + '-'+ item.username "
                :value="item.username"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工号" prop="jobNum">
            <el-input v-model="form.jobNum" style="width:220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="认证种类" prop="certificationType">
            <el-select
              v-model="form.certificationType"
              placeholder="请选择认证种类"
              style="width: 220px;"
              @change="certificationTypeChange"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.value "
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.certificationType === typeOptions[0].value || form.certificationType === typeOptions[1].value">
        <el-col :span="8">
          <el-form-item label="工种种类" prop="jobType">
            <el-select
              v-model="form.jobType"
              filterable
              allow-create
              placeholder="请选择工种种类"
              style="width: 220px;"
            >
              <el-option
                v-for="item in jobTypeOptions"
                :key="item.value"
                :label="item.value "
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.certificationType === typeOptions[1].value">
          <el-form-item label="签发机构" prop="orgName">
            <el-input v-model="form.orgName" placeholder="请填写签发机构" style="width:220px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.certificationType === typeOptions[2].value">
        <el-col :span="8">
          <el-form-item label="岗位名称" prop="jobName">
            <el-input v-model="form.jobName" style="width:220px" placeholder="请填写岗位"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="培训日期" prop="trainDate">
            <el-date-picker
              v-model="form.trainDate"
              type="date"
              style="width: 220px;"
              placeholder="请填写培训时间"
              :picker-options="pickerOption[0]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发证日期" prop="issueDate">
            <el-date-picker
              v-model="form.issueDate"
              type="date"
              style="width: 220px;"
              placeholder="请填写培训时间"
              :picker-options="pickerOption[0]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="考试结果" prop="trainResult">
            <el-input v-model="form.trainResult" style="width:220px" placeholder="请填写培训考试结果"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="培训内容" prop="trainContent">
            <el-input type="textarea" :row="3" v-model="form.trainContent" placeholder="请填写培训内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.certificationType && (form.jobType || form.certificationType === typeOptions[2].value)">
        <el-col :span="8">
          <el-form-item label="到期时间" prop="dueDate">
            <el-date-picker
              v-model="form.dueDate"
              type="date"
              style="width: 220px;"
              placeholder="请填写到期时间"
              :picker-options="pickerOption[1]"
              @input="dueDateChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否设置提醒" prop="isRemind">
            <el-radio
              v-for="item in finishStatus"
              :key="item.id"
              v-model="form.isRemind"
              :label="item.value === 'true'"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.isRemind.toString() === 'true'">
          <el-form-item label="到期提前提醒" prop="remindDays">
            <el-input placeholder="请输入提醒天数" type="number" :min="1" :max="maxRemindDays" v-model="form.remindDays"
                      @input="remindDaysMaxValue"
                      style="width: 220px">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <template slot="label">
              <span v-if="form.certificationType !== typeOptions[2].value"><i style="color: red">* </i>有效证件列表</span>
              <span v-else><i style="color: red">* </i>上岗证书列表</span>
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
                    :ref="`delCerFile-popover-${scope.$index}`"
                    v-permission="permission.edit"
                    placement="top"
                    width="180"
                  >
                    <p>确定删除这个附件吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        type="text"
                        @click="scope._self.$refs[`delCerFile-popover-${scope.$index}`].doClose()"
                      >取消
                      </el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="deleteTrCertificationFile(scope.row), scope._self.$refs[`delCerFile-popover-${scope.$index}`].doClose()"
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
              :action="trCertificationFileUploadApi + '?trCertificationId=' + bindingId "
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
import {getUserByDeptId} from "@/api/system/user";
import {validIsNotNull} from "@/utils/validationUtil";
import {mapGetters} from "vuex";
import {getUid} from "@/api/tools/supplier";
import {getToken} from "@/utils/auth";
import {delTrCertificationFile, getFilesByTrCertificationId} from "@/api/tools/train/trCertificationFile";

const defaultForm = {
  id: null,
  staffName: null,
  certificationType: null,
  jobType: null,
  hireDate: null,
  departId: null,
  superior: null,
  jobName: null,
  jobNum: null,
  trainDate: null,
  trainContent: null,
  orgName: null,
  issueDate: null,
  trainResult: null,
  isRemind: true,
  remindDays: null,
  dueDate: null,
  certificationStatus: null, // 证书状态后台走查判断
  uid: null,
  fileList: []
}
export default {
  mixins: [form(defaultForm)],
  components: {TreeSelect},
  props: {
    finishStatus: {
      type: Array,
      required: true
    },
    typeOptions: {
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
        staffName: [
          {required: true, message: '请输入新员工姓名', trigger: 'blur'}
        ],
        hireDate: [
          {required: true, message: '请输入入职时间', trigger: 'blur'}
        ],
        certificationType: [
          {required: true, message: '请选择认证证明种类', trigger: 'blur'}
        ],
        departId: [
          {required: true, message: '请选择新员工所属部门', trigger: 'blur'}
        ],
        superior: [
          {required: true, message: '请选择上级主管', trigger: 'blur'}
        ],
        jobNum: [
          {required: false, message: '请填写新员工工号', trigger: 'blur'}
        ],
        jobName: [
          {required: true, message: '请填写新员工岗位', trigger: 'blur'}
        ],
        jobType: [
          {required: true, message: '请填写工种类型', trigger: 'blur'}
        ],
        orgName: [
          {required: true, message: '请填写签发机构', trigger: 'blur'}
        ],
        issueDate: [
          {required: true, message: '请填写发证日期', trigger: 'blur'}
        ],
        trainResult: [
          {required: true, message: '请填写考试结果', trigger: 'blur'}
        ],
        dueDate: [
          {required: true, message: '请填写到期日期', trigger: 'blur'}
        ],
        isRemind: [
          {required: true, message: '请选择是否设置提前提醒', trigger: 'blur'}
        ],
        remindDays: [
          {required: true, message: '请设置提前提醒天数', trigger: 'blur'}
        ],
        trainDate: [
          {required: true, message: '请填写在岗培训日期', trigger: 'blur'}
        ],
        trainContent: [
          {required: true, message: '培训内容不可为空', trigger: 'blur'}
        ],
        reason: [
          {required: true, message: '请填写未完成培训的原因', trigger: 'blur'}
        ]
      },
      departs: [],
      superiors: [],
      reasonRules: [
        {required: false}
      ],
      pickerOption: [{
        disabledDate: time => {
          return (
            Date.now() <= time.getTime()
          )
        }
      }, {
        disabledDate: time => {
          return (
            time.getTime() <= Date.now()
          )
        }
      }],
      jobTypeOptions: [
        {value: '叉车'},
        {value: '电工'},
        {value: '危险品作业'},
        {value: '金属焊接/切割'}
      ],
      maxRemindDays: 90,
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
      'trCertificationFileUploadApi'
    ])
  },
  created: function () {
    this.getTopDept()
  },
  methods: {
    getTopDept() {
      // alert(JSON.stringify(this.user))
      getDeptTree().then(res => {
        this.departs = res.content
      })
    },
    // 获取弹窗内使用部门数据
    loadDeparts({action, parentNode, callback}) {
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
      this.bindingId = null
      this.form.remindDays = null
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
      // 获取设备维修确认单信息列表
      this.getTrCerFilesById(form.id)
      this.getMaxTrRemindDays(form.dueDate)
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      // alert(JSON.stringify(this.form.fileList))
      // 判断是否确认完成，若确认完成则必须上传确认单
      if (this.form.fileList.length === 0) {
        this.$message.warning("请务必上传确认单等附件！")
        return false
      }
    },
    // 获取维修相关确认单信息
    getTrCerFilesById(id) {
      this.form.fileList = []
      this.filesLoading = true
      getFilesByTrCertificationId(id).then(res => {
        // alert(JSON.stringify(res))
        this.form.fileList = res
        this.filesLoading = false
      })
    },
    // 监控数据变化
    currDeptChange(deptId) {
      this.superiors = []
      // 根据部门标识（val）查找人员信息
      getUserByDeptId({deptId: deptId}).then(res => {
        // alert(JSON.stringify(res))
        this.superiors = res
        if (this.superiors.length > 0) {
          // 若不是同部门成员则需要默认切换到首选默认值
          let usernames = []
          this.superiors.forEach((data, index) => {
            usernames.push(data.username)
          })
          if (validIsNotNull(this.form.superior)) {
            if (usernames.indexOf(this.form.superior) === -1) {
              this.form.superior = this.superiors[0].username
            }
          } else {
            // 若原无值则设置首选默认值
            this.form.superior = this.superiors[0].username
          }
          // alert(usernames.indexOf(this.form.acceptBy))
        } else {
          this.form.superior = null
        }
        // alert(JSON.stringify(this.users))
      })
    },
// 监控证书种类变化
    certificationTypeChange(val) {
      this.$forceUpdate()
      this.form.jobType = null
      if (val === this.typeOptions[0].value) {
        this.jobTypeOptions = [
          {value: '叉车'},
          {value: '电工'},
          {value: '危险品作业'},
          {value: '金属焊接/切割'},
          {value: '其它'}
        ]
      } else if (val === this.typeOptions[1].value) {
        this.jobTypeOptions = [
          {value: '内审员'},
          {value: '计量员'},
          {value: '其它'}
        ]
      }
    },
    // 提前提醒最大时间设计
    remindDaysMaxValue(v) {
      if (validIsNotNull(v)) {
        v = v.toString().replace(/[^0-9.]/g, '')
        this.form.remindDays = v > this.maxRemindDays ? this.maxRemindDays : v
      }
    },
    // 监控培训时间变化
    dueDateChange(val) {
      this.$forceUpdate()
      this.getMaxTrRemindDays(val)
    },
    // 获取最大提醒时间
    getMaxTrRemindDays(val) {
      let end = new Date(val)
      // Math.floor()向下取整，Math.ceil()向上取整
      this.maxRemindDays = Math.floor((end - new Date(new Date(new Date().toLocaleDateString()).getTime())) / (24 * 3600 * 1000))
      // 监控现有数据的大小是否超出上限
      if (validIsNotNull(this.form.remindDays)) {
        this.remindDaysMaxValue(this.form.remindDays)
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
      this.getTrCerFilesById(this.bindingId)
      setTimeout(() => {
        this.$message.success('上传文件成功!')
      }, 300)
      this.$refs.upload.clearFiles()
    },
    // 删除附件
    deleteTrCertificationFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delTrCertificationFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getTrCerFilesById(row.trCertificationId)
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
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
