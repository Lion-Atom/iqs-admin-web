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
      label-width="110px"
    >
      <!--培训日程安排信息-->
      <el-row :gutter="20" type="flex" class="el-row">
        <el-col :span="8">
          <el-form-item label="培训标题" prop="trainTitle">
            <el-input v-model="form.trainTitle" placeholder="请填写培训标题" style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="培训时间" prop="trainTime">
            <el-date-picker
              v-model="form.trainTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
              default-time="10:00:00"
              placeholder="请填写培训时间"
              :picker-options="timOptions[0]"
              @input="trainTimeChange"
              :disabled="form.isDelay.toString() === 'true'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="培训类型" prop="trainType">
            <el-select
              v-model="form.trainType"
              placeholder="请选择培训类型"
              style="width:100%"
            >
              <el-option
                v-for="item in trainTypes"
                :label="item.value"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="培训人" prop="trainer">
            <el-input v-model="form.trainer" placeholder="请填写培训人" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col v-if="form.trainType === '外部'" :span="8">
          <el-form-item label="培训机构" prop="trainIns">
            <el-input v-model="form.trainIns" placeholder="请填写培训机构" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="培训地点" prop="trainLocation">
            <el-input v-model="form.trainLocation" placeholder="请填写培训地址" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="培训费用" prop="cost">
            <el-input type="text" v-model="form.cost" placeholder="请填写培训费用"
                      @input="(v)=>(form.cost = v.replace(/[^0-9.]/g,''))" style="width: 100%">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="涉及部门" prop="department">
            <!--            <el-input v-model="form.department" placeholder="请填写培训部门" style="width:100%"/>-->
            <div>
              <el-tag
                v-for="tag in form.departTags"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleDepartClose(tag)"
                class="new-el-tag"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputDepartVisible"
                ref="departTagInput"
                v-model="inputDepartValue"
                class="input-new-tag"
                size="small"
                placeholder="涉及到的相关部门"
                @keyup.enter.native="handleInputDepartConfirm"
                @blur="handleInputDepartConfirm"
              />
              <el-button v-else size="small" class="button-new-tag" @click="showInputDepart">+涉及部门
              </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报名截止时间" prop="regDeadline">
            <el-date-picker
              v-model="form.regDeadline"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
              default-time="10:00:00"
              placeholder="请填写培训时间"
              :picker-options="timOptions[1]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="人数上限" prop="totalNum">
            <el-input type="text" v-model="form.totalNum" placeholder="请填写培训人数上限"
                      @input="(v)=>(form.totalNum = v.replace(/[^0-9.]/g,''))" style="width: 100%">
              <template slot="append">人</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="!crud.status.add">
          <el-form-item label="现参与人数" prop="curNum">
            <el-input type="text" v-model="form.curNum" placeholder="请填写现参与人数"
                      @input="(v)=>(form.curNum = v.replace(/[^0-9.]/g,''))" disabled style="width: 100%">
              <template slot="append">人</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否设置提醒" prop="isRemind">
            <el-radio
              v-for="item in commonStatus"
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
        <el-col :span="8">
          <el-form-item label="是否改期" prop="isDelay">
            <el-radio
              v-for="item in commonStatus"
              :key="item.id"
              v-model="form.isDelay"
              :label="item.value === 'true'"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.isDelay.toString() === 'true'">
          <el-form-item label="新培训时间" prop="newTrainTime">
            <el-date-picker
              v-model="form.newTrainTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
              default-time="10:00:00"
              placeholder="请填写新的培训时间"
              :picker-options="timOptions[2]"
              @input="trainTimeChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.isDelay.toString() === 'true'">
          <el-form-item label="改期原因" prop="delayDesc">
            <el-input
              v-model="form.delayDesc"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入改期原因"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="培训内容" prop="trainContent">
            <el-input
              v-model="form.trainContent"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入培训内容描述"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <template slot="label">
              <span><i style="color: red">* </i>附件信息</span>
            </template>
            <el-table
              ref="table"
              border
              v-loading="filesLoading"
              :data="form.fileList"
              style="width: 100%;margin-bottom: 10px;"
              highlight-current-row
            >
              <el-table-column prop="name" label="文件名称" min-width="120">
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
              <el-table-column prop="fileType" label="文件类型" min-width="100"/>
              <el-table-column prop="path" label="预览图">
                <template slot-scope="{row}">
                  <el-image
                    :src=" baseApi + '/file/' + row.type + '/' + row.realName"
                    :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.realName]"
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
              <el-table-column prop="type" label="类别"/>
              <el-table-column prop="size" label="大小"/>
              <el-table-column prop="createBy" label="上传人"/>
              <el-table-column prop="createTime" label="创建日期" min-width="140"/>
              <!--   附件删除   -->
              <el-table-column
                label="操作"
                width="80"
                align="center"
              >
                <template slot-scope="scope">
                  <el-popover
                    :ref="`delScheduleFile-popover-${scope.$index}`"
                    v-permission="permission.edit"
                    placement="top"
                    width="180"
                  >
                    <p>确定删除这个附件吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        type="text"
                        @click="scope._self.$refs[`delScheduleFile-popover-${scope.$index}`].doClose()"
                      >取消
                      </el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="deleteTrSchedule(scope.row), scope._self.$refs[`delScheduleFile-popover-${scope.$index}`].doClose()"
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
            <!--上传试卷-->
            <el-button type="text" @click="openTransDialog">上传培训附件</el-button>
            <el-dialog append-to-body :close-on-click-modal="false"
                       :visible.sync="transDialogVisible" title="培训附件上传" width="60%">
              <el-form ref="fileForm" :rules="fileRules" :model="fileForm" size="small" label-width="80px">
                <el-row :gutter="40" class="row-box">
                  <el-col :span="10">
                    <el-row :gutter="40" class="row-box">
                      <el-col :span="24">
                        <el-form-item label="附件名称" prop="name">
                          <el-input v-model="fileForm.name" placeholder="请填写附件名称" style="width: 100%;"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="附件类型" prop="fileType">
                          <!--                          <el-input v-model="fileForm.fileType" style="width: 100%;" placeholder="请填写附件类型"/>-->
                          <el-select
                            v-model="fileForm.fileType"
                            filterable
                            allow-create
                            placeholder="请选/填文件类型"
                            style="width: 100%;"
                          >
                            <el-option
                              v-for="item in fileTypes"
                              :key="item.value"
                              :label="item.value"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                         <pre class="my-code">
  # 培训附件类型包括签到表、问卷调查等等
  # 为便于管理，一次限传一份文件
  # 培训相关材料可到<i>培训材料</i>自行查看下载
        </pre>
                      </el-col>
                    </el-row>
                  </el-col>
                  <!--   上传文件   -->
                  <el-col :span="14">
                    <el-form-item>
                      <template slot="label">
                        <span><i style="color: red">* </i>上传</span>
                      </template>
                      <el-upload
                        ref="fileUpload"
                        :limit="1"
                        drag
                        :before-upload="beforeUpload"
                        :auto-upload="false"
                        :headers="headers"
                        :on-change="handleFileChange"
                        :file-list="uploadList"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :action="trScheduleUploadApi + '?trScheduleId=' + bindingId+ '&fileType=' + fileForm.fileType+'&name=' + fileForm.name"
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
                <el-button type="primary" :loading="loading" @click="uploadScheduleFile">确认</el-button>
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
import {judgeIsEqual, validIsNotNull} from "@/utils/validationUtil";
import {mapGetters} from "vuex";
import {getUid} from "@/api/tools/supplier";
import {getToken} from "@/utils/auth";
import {delTrScheduleFile, getFilesByTrScheduleId} from "@/api/tools/train/trScheduleFile";

const defaultForm = {
  id: null,
  trainTitle: null,
  trainTime: null,
  trainContent: null,
  regDeadline: null,
  trainLocation: null,
  cost: null,
  trainer: null,
  trainIns: null,
  department: null,
  departTags: [],
  trainType: null,
  totalNum: 200,
  curNum: 0,
  isRemind: false,
  remindDays: null,
  isDelay: false,
  newTrainTime: null,
  delayDesc: null,
  scheduleStatus: null, // 证书状态后台走查判断
  uid: null,
  fileList: []
}
export default {
  mixins: [form(defaultForm)],
  components: {},
  props: {
    commonStatus: {
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
        trainTitle: [
          {required: true, message: '请输入培训标题', trigger: 'blur'}
        ],
        trainTime: [
          {required: true, message: '请填写培训时间', trigger: 'blur'}
        ],
        trainContent: [
          {required: true, message: '请填写培训内容', trigger: 'blur'}
        ],
        regDeadline: [
          {required: true, message: '请填写直接报名时间', trigger: 'blur'}
        ],
        trainLocation: [
          {required: true, message: '请填写培训地点', trigger: 'blur'}
        ],
        trainer: [
          {required: true, message: '请填写培训员', trigger: 'blur'}
        ],
        trainIns: [
          {required: true, message: '请填写培训机构', trigger: 'blur'}
        ],
        department: [
          {required: true, message: '请填写涉及部门', trigger: 'blur'}
        ],
        trainType: [
          {required: true, message: '请选择培训类型', trigger: 'blur'}
        ],
        totalNum: [
          {required: true, message: '请填写人数上限', trigger: 'blur'}
        ],
        curNum: [
          {required: true, message: '请填写人数上限', trigger: 'blur'}
        ],
        isRemind: [
          {required: true, message: '请选择是否需要提醒', trigger: 'blur'}
        ],
        remindDays: [
          {required: true, message: '请填写提醒天数', trigger: 'blur'}
        ],
        isDelay: [
          {required: true, message: '请确认是否改期', trigger: 'blur'}
        ],
        newTrainTime: [
          {required: true, message: '请重新投定培训时间', trigger: 'blur'}
        ],
        delayDesc: [
          {required: true, message: '请填写改期原因', trigger: 'blur'}
        ]
      },
      fileForm: {
        name: null,
        fileType: null
      },
      fileRules: {
        name: [
          {required: true, message: '请输入文件名称', trigger: 'blur'}
        ],
        fileType: [
          {required: true, message: '请选择/填写试卷类型', trigger: 'blur'}
        ]
      },
      departs: [],
      superiors: [],
      reasonRules: [
        {required: false}
      ],
      timOptions: [
        {
          disabledDate: time => {
            return (
              time.getTime() <= Date.now()
            )
          }
        },
        {
          disabledDate: time => {
            let tarTime
            if(this.form.isDelay.toString() === 'false'){
              tarTime = new Date(this.form.trainTime).getTime()
            } else {
              tarTime = new Date(this.form.newTrainTime).getTime()
            }
            return (
              tarTime < time.getTime()
            )
          }
        }, {
          disabledDate: time => {
            return (
              // time.getTime() <= new Date(this.form.trainTime).getTime()
              time.getTime() <= new Date(this.form.regDeadline).getTime()
            )
          }
        }
      ],
      bindingId: null,
      filesLoading: false,
      transDialogVisible: false,
      loading: false,
      uploadList: [],
      trainTypes: [
        {
          label: 'internal',
          value: '内部'
        },
        {
          label: 'external',
          value: '外部'
        }
      ],
      fileTypes: [
        {
          value: '签到表'
        },
        {
          value: '问卷调查'
        }
      ],
      maxRemindDays: 30,
      // 涉及部门
      inputDepartVisible: false,
      inputDepartValue: '',
    }
  },
  watch: {},
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'trScheduleUploadApi'
    ])
  },
  created: function () {

  },
  methods: {
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {
      this.bindingId = null
      this.form.uid = null
      this.form.remindDays = null
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
      this.getTrScheduleById(form.id)
      if(form.isDelay.toString() === 'true') {
        this.getMaxTrRemindDays(form.newTrainTime)
      } else {
        this.getMaxTrRemindDays(form.trainTime)
      }

    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      // alert(JSON.stringify(this.form.fileList))
      // 判断是否确认完成，若确认完成则必须上传确认单
      if (this.form.fileList.length === 0) {
        this.$message.warning("请务必上传试卷信息！")
        return false
      }
      if(new Date(this.form.trainTime) === new Date(this.form.newTrainTime)) {
        this.$message.warning("新培训时间与原培训时间一样，请重新设定！")
        return false
      }
    },
    // 获取维修相关确认单信息
    getTrScheduleById(id) {
      this.form.fileList = []
      this.filesLoading = true
      getFilesByTrScheduleId(id).then(res => {
        // alert(JSON.stringify(res))
        console.log(res)
        this.form.fileList = res
        this.filesLoading = false
      })
    },
    // 提前提醒最大时间设计
    remindDaysMaxValue(v) {
      if (validIsNotNull(v)) {
        v = v.toString().replace(/[^0-9.]/g, '')
        this.form.remindDays = v > this.maxRemindDays ? this.maxRemindDays : v
      }
    },
    // 监控培训时间变化
    trainTimeChange(val) {
      this.$forceUpdate()
      this.getMaxTrRemindDays(val)
    },
    // 获取最大提醒时间
    getMaxTrRemindDays(val) {
      let end = new Date(val).getTime()
      // Math.floor()向下取整，Math.ceil()向上取整
      this.maxRemindDays = Math.ceil((end - new Date().getTime()) / (24 * 3600 * 1000))
      // alert(this.maxRemindDays)
      if (validIsNotNull(this.form.remindDays)) {
        this.remindDaysMaxValue(this.form.remindDays)
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
      return isLt2M
    },
    // 监听上传成功
    handleSuccess(response, file, fileList) {
      this.getTrScheduleById(this.bindingId)
      setTimeout(() => {
        this.$message.success('上传试卷信息成功!')
      }, 300)
      this.$refs.fileUpload.clearFiles()
      this.transDialogVisible = false
    },
    handleFileChange(file, fileList) {
      if (!validIsNotNull(this.fileForm.name)) {
        this.fileForm.name = file.name
      }
      this.uploadList = fileList;
    },
    // 删除附件
    deleteTrSchedule(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delTrScheduleFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除试卷信息成功!',
          type: 'success'
        })
        this.getTrScheduleById(row.trScheduleId)
      })
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      this.fileForm.name = ''
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },
    openTransDialog() {
      if (this.$refs['fileForm'] !== undefined) {
        this.$refs['fileForm'].resetFields()
      }
      this.form.fileList = []
      this.transDialogVisible = true
    },
    scoreMaxValue(v) {
      this.fileForm.examScore = v.replace(/[^0-9.]/g, '')
      this.fileForm.examScore = v > 100 ? 100 : v
    },
    // todo 是否通过判断
    currIsPassedChange(val) {
      // alert(val)
    },
    // 取消考试信息提交
    cancelSubmit() {
      if (this.$refs['fileForm'] !== undefined) {
        this.$refs['fileForm'].resetFields()
      }
      this.transDialogVisible = false
    },
    // 涉及部门相关
    showInputDepart() {
      this.inputDepartVisible = true
      this.$nextTick(_ => {
        this.$refs.departTagInput.$refs.input.focus()
      })
    },
    // 删除部门tag
    handleDepartClose(tag) {
      this.form.departTags.splice(this.form.departTags.indexOf(tag), 1)
      this.form.department = this.form.departTags.join(',')
    },
    handleInputDepartConfirm() {
      const inputValue = this.inputDepartValue
      if (inputValue) {
        this.form.departTags.push(inputValue)
      }
      this.form.department = this.form.departTags.join(',')
      this.inputDepartVisible = false
      this.inputDepartValue = ''
    },
    // 上传文件
    uploadScheduleFile() {
      this.$refs['fileForm'].validate((valid) => {
        if (valid) {
          // todo  判断有无文件
          if (this.uploadList.length === 0) {
            this.$notify.warning("请上传试卷")
          } else {
            // this.fileForm.examDate = toDateFormat(this.fileForm.examDate)
            this.$refs.fileUpload.submit()
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

::v-deep .new-el-tag {
  font-size: 14px;
  margin-right: 5px;
  padding: 5px;
  height: 32px;
}

.button-new-tag {
  margin-left: 5px;
  margin-top: 1px;
  height: 24px;
  line-height: 22px;
  padding: 0 8px;
}

.el-row {
  display: flex;
  flex-wrap: wrap
}
</style>
