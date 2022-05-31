<template>
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
      label-width="100px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="新员工姓名" prop="staffName">
            <el-input v-model="form.staffName" style="width: 220px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上级主管" prop="superior">
            <el-select
              v-model="form.superior"
              placeholder="请选择主管"
              filterable
              allow-create
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
          <el-form-item label="岗位名称" prop="jobName">
            <el-input v-model="form.jobName" style="width:220px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="车间" prop="workshop">
            <el-input v-model="form.workshop" style="width:220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工种" prop="jobType">
            <el-input v-model="form.jobType" style="width:220px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <template slot="label">
              <span><i style="color: red">* </i>考试信息</span>
            </template>
            <el-table
              ref="table"
              border
              v-loading="filesLoading"
              :data="form.transcriptList"
              style="width: 100%;margin-bottom: 10px;"
              highlight-current-row
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
              />
              <el-table-column prop="name" label="试卷名称" min-width="120">
                <template slot-scope="scope">
                  <el-popover
                    :content="'file/' + scope.row.type + '/' + scope.row.realName"
                    placement="top-start"
                    title="路径"
                    width="200"
                    trigger="hover"
                  >
                    <!--可下载文件-->
                    <a
                      slot="reference"
                      :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
                      class="el-link--primary"
                      style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                      target="_blank"
                    >
                      {{ scope.row.name }}
                    </a>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="examContent" label="考试内容" :show-overflow-tooltip="true"/>
              <el-table-column label="考试日期" :formatter="examDateFormat" min-width="110"/>
              <el-table-column label="考试类型" :formatter="examTypeFormat"/>
              <el-table-column prop="examScore" label="考试分数" min-width="60"/>
              <el-table-column label="是否通过" :formatter="examPassedFormat"/>
              <el-table-column label="下次补考日期" :formatter="nextDateFormat" min-width="110"/>
              <el-table-column prop="examDesc" label="备注" :show-overflow-tooltip="true"/>
              <!--   附件删除   -->
              <el-table-column
                label="操作"
                width="80"
                align="center"
              >
                <template slot-scope="scope">
                  <el-popover
                    :ref="`delExamStaffTrans-popover-${scope.$index}`"
                    v-permission="permission.edit"
                    placement="top"
                    width="180"
                  >
                    <p>确定删除这个附件吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        type="text"
                        @click="scope._self.$refs[`delExamStaffTrans-popover-${scope.$index}`].doClose()"
                      >取消
                      </el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="deleteTrExamTrans(scope.row), scope._self.$refs[`delExamStaffTrans-popover-${scope.$index}`].doClose()"
                      >确定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      v-permission="permission.edit"
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      :disabled="form.transcriptList.length < 2"
                    />
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <!--上传试卷-->
            <el-button type="text" v-if="needUpload.toString() ==='true'" @click="openTransDialog">上传考试信息</el-button>
            <el-dialog append-to-body :close-on-click-modal="false"
                       :visible.sync="transDialogVisible" title="题库试卷上传" width="80%">
              <el-form ref="examForm" :rules="examRules" :model="examForm" size="small" label-width="80px">
                <el-row :gutter="40" class="row-box">
                  <el-col :span="13">
                    <el-row :gutter="40" class="row-box">
                      <el-col :span="12">
                        <el-form-item label="试卷名称" prop="name">
                          <el-input v-model="examForm.name" placeholder="请填写试卷名称" style="width: 100%;"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="考试类型" prop="examType">
                          <el-input v-model="examForm.examType" style="width: 100%;" disabled placeholder="请填写考试日期"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          label="考试日期"
                          prop="examDate"
                        >
                          <el-date-picker
                            v-model="examForm.examDate"
                            type="datetime"
                            style="width: 100%;"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请填写考试时间"
                            default-time="10:00:00"
                            :picker-options="pickerOption"
                            :disabled="form.transcriptList.length>0"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="考试内容" prop="examContent">
                          <el-input v-model="examForm.examContent" :disabled="form.transcriptList.length>0"
                                    style="width: 100%;" placeholder="请填写考试内容"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="考试分数" prop="examScore">
                          <el-input type="text" v-model="examForm.examScore" placeholder="请填写考试分数"
                                    @input="scoreMaxValue" style="width: 100%"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="是否通过" prop="examPassed">
                          <el-radio
                            v-for="item in examStatus"
                            :key="item.id"
                            v-model="examForm.examPassed"
                            :label="item.value === 'true'"
                            @change="currIsPassedChange"
                          >
                            {{ item.label }}
                          </el-radio>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          v-if="examForm.examPassed.toString() === 'false'"
                          label="补考日期"
                          prop="nextDate"
                        >
                          <el-date-picker
                            v-model="examForm.nextDate"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            style="width: 100%;"
                            default-time="10:00:00"
                            placeholder="请填写下次考试日期"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="试卷描述" prop="examDesc">
                          <el-input
                            v-model="examForm.examDesc"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 5}"
                            placeholder="请输入试卷内容描述"
                            style="width: 100%;"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <!--   上传文件   -->
                  <el-col :span="11">
                    <el-form-item>
                      <template slot="label">
                        <span><i style="color: red">* </i>上传</span>
                      </template>
                      <el-upload
                        ref="examUpload"
                        :limit="1"
                        drag
                        :before-upload="beforeUpload"
                        :auto-upload="false"
                        :headers="headers"
                        :on-change="handleFileChange"
                        :file-list="fileList"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :action="trExamStaffTranscriptUploadApi + '?trExamStaffId=' + bindingId+ '&examContent=' + examForm.examContent+ '&examDate=' + examForm.examDate +
               '&examScore=' + examForm.examScore+'&examPassed=' + examForm.examPassed+'&examType=' + examForm.examType+'&nextDate=' + examForm.nextDate +
               '&resitSort=' + examForm.resitSort+'&examDesc=' + examForm.examDesc+'&name=' + examForm.name"
                        class="upload-demo"
                      >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="cancelSubmit">取消</el-button>
                <el-button type="primary" :loading="loading" @click="uploadTranscript">确认</el-button>
              </div>
            </el-dialog>
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
import {getUserByDeptId} from "@/api/system/user";
import {GMTToDate, toDateFormat, validIsNotNull} from "@/utils/validationUtil";
import {mapGetters} from "vuex";
import {getUid} from "@/api/tools/supplier";
import {getToken} from "@/utils/auth";
import {delTrExamStaffTranscript, getTranscriptByTrExamStaffId} from "@/api/tools/train/trExamStaffTranscript";

const defaultForm = {
  id: null,
  staffName: null,
  departId: null,
  workshop: null,
  superior: null,
  jobName: null,
  jobType: null,
  uid: null,
  transcriptList: []
}
export default {
  mixins: [form(defaultForm)],
  components: {},
  props: {
    departId: {
      type: Number,
      required: true
    },
    examStatus: {
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
        departId: [
          {required: true, message: '请选择新员工所属部门', trigger: 'blur'}
        ],
        superior: [
          {required: true, message: '请选择上级主管', trigger: 'blur'}
        ],
        jobName: [
          {required: true, message: '请填写新员工岗位', trigger: 'blur'}
        ],
        jobType: [
          {required: true, message: '请填写新员工工种', trigger: 'blur'}
        ],
        workshop: [
          {required: true, message: '请填写培训车间', trigger: 'blur'}
        ]
      },
      examForm: {
        name: null,
        examContent: null,
        examDate: null,
        examScore: null,
        examPassed: true,
        examType: '考试类型',
        nextDate: null,
        resitSort: 0,
        examDesc: ''
      },
      examRules: {
        name: [
          {required: true, message: '请输入试卷名称', trigger: 'blur'}
        ],
        examContent: [
          {required: true, message: '请输入试卷名称', trigger: 'blur'}
        ],
        examDate: [
          {required: true, message: '请输入考试日期', trigger: 'blur'}
        ],
        examScore: [
          {required: true, message: '请输入考试分数', trigger: 'blur'}
        ],
        examPassed: [
          {required: true, message: '请选择是否通过', trigger: 'blur'}
        ],
        nextDate: [
          {required: true, message: '请输入下次考试日期', trigger: 'blur'}
        ]
      },
      departs: [],
      superiors: [],
      reasonRules: [
        {required: false}
      ],
      fileList: [],
      pickerOption: {
        disabledDate: time => {
          return (
            Date.now() <= time.getTime()
          )
        }
      },
      bindingId: null,
      filesLoading: false,
      transDialogVisible: false,
      loading: false,
      needUpload: true
    }
  },
  watch: {},
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'trExamStaffTranscriptUploadApi'
    ])
  },
  created: function () {
    this.form.departId = this.$props.departId
    this.currDeptChange(this.form.departId)
  },
  methods: {
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {
      this.bindingId = null
      this.needUpload = true
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
      this.getTrExamStaffTransById(form.id)
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      // alert(JSON.stringify(this.form.transcriptList))
      // 判断是否确认完成，若确认完成则必须上传确认单
      if (this.form.transcriptList.length === 0) {
        this.$message.warning("请务必上传试卷信息！")
        return false
      }
      this.form.departId = this.$props.departId
    },
    // 获取维修相关确认单信息
    getTrExamStaffTransById(id) {
      this.form.transcriptList = []
      this.filesLoading = true
      this.needUpload = true
      getTranscriptByTrExamStaffId(id).then(res => {
        // alert(JSON.stringify(res))
        console.log(res)
        this.form.transcriptList = res
        if (this.form.transcriptList.length > 0) {
          this.form.transcriptList.forEach((data, index) => {
            if (data.examPassed.toString() === 'true') {
              this.needUpload = false
            }
          })
        }
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
          if (!validIsNotNull(this.form.superior)) {
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
    // 考试结果格式化
    examPassedFormat(row, col) {
      if (row.examPassed) {
        return '通过'
      } else {
        return '未通过'
      }
    },
    // 下次考试日期格式化
    nextDateFormat(row, col) {
      if (validIsNotNull(row.nextDate)) {
        return row.nextDate
      } else {
        return '--'
      }
    },
    // 考试日期格式化
    examDateFormat(row, col) {
      if (validIsNotNull(row.examDate)) {
        return row.examDate
      } else {
        return '--'
      }
    },
    // 考试类型格式化
    examTypeFormat(row, col) {
      if (row.resitSort > 0) {
        return '第' + row.resitSort + '次补考'
      } else {
        return '初试'
      }
    },
    // ------------上传附件管理--------------
    // 上传前的校验
    beforeUpload: function (file) {
      this.loading = false
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传试卷大小不能超过 100MB!')
      }
      if (validIsNotNull(this.examForm.name)) {
        this.examForm.name = file.name
      }
      return isLt2M
    },
    // 监听上传成功
    handleSuccess(response, file, fileList) {
      this.getTrExamStaffTransById(this.bindingId)
      setTimeout(() => {
        this.$message.success('上传试卷信息成功!')
      }, 300)
      this.$refs.examUpload.clearFiles()
      this.transDialogVisible = false
    },
    // 删除附件
    deleteTrExamTrans(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delTrExamStaffTranscript(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除试卷信息成功!',
          type: 'success'
        })
        this.getTrExamStaffTransById(row.trExamStaffId)
      })
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      this.examForm.name = ''
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },
    openTransDialog() {
      if (this.$refs['examForm'] !== undefined) {
        this.$refs['examForm'].resetFields()
      }
      let sort = this.form.transcriptList.length
      if (sort === 0) {
        this.examForm.examType = '初试'
        this.examForm.resitSort = 0
      } else {
        this.examForm.examType = '第' + sort + '补考'
        this.examForm.resitSort = sort
        // 初始化补考时间
        // alert(JSON.stringify(this.form.transcriptList[sort - 1]))
        this.examForm.examDate = this.form.transcriptList[sort - 1].nextDate
        this.examForm.examContent = this.form.transcriptList[0].examContent
      }
      this.fileList = []
      this.transDialogVisible = true
    },
    scoreMaxValue(v) {
      this.examForm.examScore = v.replace(/[^0-9.]/g, '')
      this.examForm.examScore = v > 100 ? 100 : v
    },
    // todo 是否通过判断
    currIsPassedChange(val) {
      // alert(val)
    },
    // 取消考试信息提交
    cancelSubmit() {
      if (this.$refs['examForm'] !== undefined) {
        this.$refs['examForm'].resetFields()
      }
      this.transDialogVisible = false
    },
    // 上传文件
    uploadTranscript() {
      this.$refs['examForm'].validate((valid) => {
        if (valid) {
          // todo  判断有无文件
          if (this.fileList.length === 0) {
            this.$notify.warning("请上传试卷")
          } else {
            // this.examForm.examDate = toDateFormat(this.examForm.examDate)
            this.$refs.examUpload.submit()
          }
        }
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
