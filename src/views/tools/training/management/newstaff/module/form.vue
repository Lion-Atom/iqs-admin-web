<template>
  <el-dialog
    append-to-body
    :before-close="handleClose"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="70%"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="100px"
    >
      <el-row class="el-row-inline">
        <el-col :span="8">
          <el-form-item label="员工姓名" prop="staffName">
            <!--            <el-input v-model="form.staffName" style="width: 220px;"/>-->
            <el-select
              v-model="form.staffName"
              placeholder="请选择员工"
              style="width: 220px;"
              filterable
              :disabled="crud.status.edit===1"
            >
              <el-option
                v-for="item in members"
                :key="item.id"
                :label="item.dept.name + '-'+ item.username "
                :value="item.id"
                @click.native="staffChangeHandler(item)"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.staffName">
          <el-form-item
            label="入职日期"
            prop="hireDate"
          >
            <el-date-picker
              v-model="form.hireDate"
              type="date"
              style="width: 220px;"
              placeholder="请填写入职时间"
              :picker-options="pickerOption"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.staffName">
          <el-form-item label="员工类型" prop="staffType">
            <el-select
              v-model="form.staffType"
              placeholder="请选择员工类型"
              style="width: 220px;"
              disabled
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label + ' - ' +item.value "
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.staffType">
        <el-col :span="8">
          <el-form-item label="所属部门" prop="departId">
            <TreeSelect
              v-model="form.departId"
              :options="departs"
              :load-options="loadDeparts"
              class="newTree-item"
              placeholder="选择员工所在部门"
              style="width:220px !important;"
              disabled=""
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上级主管" prop="superior">
            <el-input v-model="form.superior" style="width:220px" placeholder="请填写上级主管" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.staffType">
          <el-form-item label="岗位名称" prop="jobName">
            <el-input v-model="form.jobName" style="width:220px" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <!--暂时注释工号-->
      <!--      <el-row v-if="form.staffType === typeOptions[1].value">
              <el-col :span="8">
                <el-form-item label="工号" prop="jobNum">
                  <el-input v-model="form.jobNum" style="width:220px" disabled />
                </el-form-item>
              </el-col>
            </el-row>-->
      <el-row v-if="form.staffType === typeOptions[0].value">
        <el-col :span="8">
          <el-form-item label="所属车间" prop="workshop">
            <el-input v-model="form.workshop" style="width:220px" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属班组" prop="team">
            <el-input v-model="form.team" style="width:220px" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工种" prop="jobType">
            <el-input v-model="form.jobType" style="width:220px" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!--        <el-col :span="24" v-if="form.staffType">
                  <el-form-item label="培训内容" prop="trainContent">
                    <el-input type="textarea" :row="3" v-model="form.trainContent" placeholder="请填写培训内容"></el-input>
                  </el-form-item>
                </el-col>-->
        <el-col :span="8" v-if="form.staffName">
          <el-form-item label="培训项目" prop="trScheduleId">
            <el-select
              v-model="form.trScheduleId"
              placeholder="请选择培训项目"
              style="width: 220px;"
              filterable
              disabled
            >
              <el-option
                v-for="item in schedules"
                :key="item.id"
                :label="item.trainTitle "
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.trScheduleId">
          <el-form-item
            label="培训时间"
            prop="trainTime"
          >
            <el-date-picker
              v-model="form.trainTime"
              type="datetime"
              style="width: 220px;"
              placeholder="请填写培训时间"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.staffType">
          <el-form-item label="是否完成" prop="isFinished">
            <el-radio
              v-for="item in finishStatus"
              :key="item.id"
              v-model="form.isFinished"
              :label="item.value === 'true'"
              @change="trainResultChanged"
              :disabled="!form.hasEditAuthorized"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.staffType && form.isFinished.toString() === 'false'">
          <el-form-item label="未完成原因" prop="reason">
            <el-input type="textarea" :row="3" v-model="form.reason" :disabled="form.isAuthorize.toString() !=='true' || !form.hasEditAuthorized"
                      placeholder="请填写未完成培训原因"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.staffType && form.isFinished.toString() === 'true'">
          <el-form-item>
            <template slot="label">
              <span><i style="color: red">* </i>确认单列表</span>
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
                        @click="deleteTrNewStaffFile(scope.row), scope._self.$refs[`delStaffFile-popover-${scope.$index}`].doClose()"
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
              :action="trNewStaffFileUploadApi + '?trNewStaffId=' + bindingId "
              :on-error="handleError">
              <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
              <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且单文件不超过100M</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="form.hasEditAuthorized">
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
import {delTrNewStaffFile, getFilesByTrNewStaffId} from "@/api/tools/train/trNewStaffFile";
import {getAllSchedule, getTrainScheduleById} from "@/api/tools/train/schedule";

const defaultForm = {
  id: null,
  staffName: null,
  staffType: null,
  hireDate: null,
  departId: null,
  workshop: null,
  team: null,
  superior: null,
  jobName: null,
  jobNum: null,
  jobType: null,
  // trainContent: null,
  trainTitle: null,
  trainTime: null,
  trScheduleId: null,
  isFinished: true,
  reason: null,
  scheduleStatus: null,
  isAuthorize: false,
  uid: null,
  fileList: [],
  hasEditAuthorized: true
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
          {required: true, message: '请输入员工姓名', trigger: 'blur'}
        ],
        hireDate: [
          {required: true, message: '请输入入职时间', trigger: 'blur'}
        ],
        staffType: [
          {required: true, message: '请选择员工类型', trigger: 'blur'}
        ],
        departId: [
          {required: true, message: '请选择员工所属部门', trigger: 'blur'}
        ],
        superior: [
          {required: true, message: '请选择上级主管', trigger: 'blur'}
        ],
        jobNum: [
          {required: false, message: '请填写员工工号', trigger: 'blur'}
        ],
        jobName: [
          {required: true, message: '请填写员工岗位', trigger: 'blur'}
        ],
        jobType: [
          {required: true, message: '请填写员工工种', trigger: 'blur'}
        ],
        workshop: [
          {required: true, message: '请填写培训车间', trigger: 'blur'}
        ],
        team: [
          {required: true, message: '请填写所在班组', trigger: 'blur'}
        ],
        trScheduleId: [
          {required: true, message: '培训项目不可为空', trigger: 'blur'}
        ],
        trainTime: [
          {required: true, message: '培训时间不可为空', trigger: 'blur'}
        ],
        /*trainContent: [
          {required: true, message: '培训内容不可为空', trigger: 'blur'}
        ],*/
        isFinished: [
          {required: true, message: '请选择是否完成培训', trigger: 'blur'}
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
      pickerOption: {
        disabledDate: time => {
          return (
            Date.now() <= time.getTime()
          )
        }
      },
      bindingId: null,
      filesLoading: false,
      members: [],
      trSchedule: {},
      schedules: []
    }
  },
  watch: {
    // 监听deptId
    // 'form.departId': 'currDeptChange'
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'trNewStaffFileUploadApi'
    ])
  },
  created: function () {
    this.getTopDept()
    this.getAvailableUser()
    this.getAllSchedule()
  },
  methods: {
    getTopDept() {
      // alert(JSON.stringify(this.user))
      getDeptTree().then(res => {
        this.departs = res.content
      })
    },
    // 获取所有的培训计划
    getAllSchedule() {
      this.schedules = []
      getAllSchedule().then(res => {
        // alert(JSON.stringify(res))
        this.schedules = res.content
      })
    },
    // 获取人员信息
    getAvailableUser() {
      getAllUser().then(res => {
        this.members = res.content
      })
    },
    // 监控员工数据变化
    staffChangeHandler(user) {
      // alert(JSON.stringify(user.superiorName))
      this.form.staffName = user.username
      this.form.hireDate = user.hireDate
      this.form.departId = user.deptId
      this.form.superior = user.superiorName
      // 目前工种允许自定义
      this.form.staffType = user.staffType
      this.form.jobType = user.jobType
      this.form.workshop = user.workshop
      this.form.team = user.team
      this.form.jobName = user.jobName
      this.form.jobNum = user.jobNum
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
      this.getTrNewStaffFilesById(form.id)
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      // alert(JSON.stringify(this.form.fileList))
      // 判断是否确认完成，若确认完成则必须上传确认单
      if (this.form.isFinished && this.form.fileList.length === 0) {
        this.$message.warning("请务必上传确认单等附件！")
        return false
      }
    },
    // 获取维修相关确认单信息
    getTrNewStaffFilesById(id) {
      this.form.fileList = []
      this.filesLoading = true
      getFilesByTrNewStaffId(id).then(res => {
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
    // 监控培训结果变化
    trainResultChanged(val) {
      // alert(JSON.stringify(this.form))
      if (val.toString() === 'false') {
        this.reasonRules = this.rules.reason
      } else {
        if (this.form.isAuthorize.toString() !== 'true') {
          if (this.form.isExam.toString() === 'true' && this.form.scheduleStatus === '已关闭') {
            this.$notify({
              title: '考试尚未通过',
              type: 'warning',
              duration: 2500
            })
          } else {
            this.$notify({
              title: '培训尚未结束',
              type: 'warning',
              duration: 2500
            })
          }
          this.form.isFinished = !val
        } else {
          this.reasonRules = [
            {required: false}
          ]
        }
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
      this.getTrNewStaffFilesById(this.bindingId)
      setTimeout(() => {
        this.$message.success('上传文件成功!')
      }, 300)
      this.$refs.upload.clearFiles()
    },
    // 删除附件
    deleteTrNewStaffFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delTrNewStaffFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getTrNewStaffFilesById(row.trNewStaffId)
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
    // 关闭前操作
    handleClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.crud.cancelCU()
        })
        .catch(_ => {});
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
