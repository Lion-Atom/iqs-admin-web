<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="60%"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-row class="el-row-inline">
        <el-col :span="24" v-show="false">
          <el-form-item label="客户名称" prop="companyName">
            <el-input
              v-model="form.companyName"
              style="width: 370px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="问题分类" prop="type">
            <el-select v-model="form.type" allow-create filterable placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.id">
          <el-form-item label="反馈状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择用户反馈状态" style="width: 100%">
              <el-option
                v-for="item in feedbackStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="问题描述" prop="desc">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model="form.desc" placeholder="请描述问题"
                      maxlength="500"
                      show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件列表">
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
              <el-table-column prop="name" label="附件名称" min-width="100" :show-overflow-tooltip="true">
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
                    :ref="`delFdFile-popover-${scope.$index}`"
                    placement="top"
                    width="180"
                  >
                    <p>确定删除这个附件吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        type="text"
                        @click="scope._self.$refs[`delFdFile-popover-${scope.$index}`].doClose()"
                      >取消
                      </el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="deleteFdFile(scope.row), scope._self.$refs[`delCerFile-popover-${scope.$index}`].doClose()"
                      >确定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
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
              :action="csFeedbackFileUploadApi + '?csFeedbackId=' + bindingId "
              :on-error="handleError">
              <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
              <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且单文件不超过100M</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <span style="color:#C0C4CC;">联系方式选填，便于我们与你联系，保密不公开</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="QQ号码" prop="qq">
            <el-input v-model="form.qq" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model.number="form.phone" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="form.email" style="width: 100%"/>
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
import {isvalidPhone} from "@/utils/validate";
import {mapGetters} from "vuex";
import {getUid} from "@/api/tools/supplier";
import {delCsFeedbackFile, getFilesByCsFeedbackId} from "@/api/more/csFeedbackFile";
import {getToken} from "@/utils/auth";

const defaultForm = {
  id: null,
  companyName: '',
  type: '',
  desc: '',
  qq: null,
  phone: null,
  email: null,
  status: '新建',
  fileList: []
}
export default {
  mixins: [form(defaultForm)],
  props: {
    feedbackStatus: {
      type: Array,
      required: true
    },
    typeOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        // 没填写手机号码，不做任何处理
        callback()
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      headers: {'Authorization': getToken()},
      bindingId: null,
      filesLoading: false,
      rules: {
        companyName: [
          {required: true, message: '请输入客户名称', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请输入反馈类型', trigger: 'blur'}
        ],
        desc: [
          {required: true, message: '请输入问题描述', trigger: 'blur'}
        ],
        qq: [
          {required: false, message: '请输入问题描述', trigger: 'blur', type: 'number'}
        ],
        phone: [
          {required: false, trigger: 'blur', validator: validPhone}
        ],
        email: [
          {required: false, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ],
        status: [
          {required: false, message: '请选择反馈状态', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'appTitle',
      'baseApi',
      'csFeedbackFileUploadApi'
    ])
  },
  created() {
  },
  methods: {
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {
      this.bindingId = null
      this.form.companyName = this.appTitle
      getUid().then(res => {
        this.bindingId = res
      })
    },
    // 编辑前操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.bindingId = form.id
      // 获取反馈附件信息列表
      this.getCsFeedbackFilesById(form.id)
    },
    // 查询反馈附件信息
    getCsFeedbackFilesById(bindingId) {
      this.form.fileList = []
      this.filesLoading = true
      getFilesByCsFeedbackId(bindingId).then(res => {
        // alert(JSON.stringify(res))
        this.form.fileList = res
        this.filesLoading = false
      })
    },
    // 删除附件
    deleteFdFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delCsFeedbackFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getCsFeedbackFilesById(row.csFeedbackId)
      })
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
      this.getCsFeedbackFilesById(this.bindingId)
      setTimeout(() => {
        this.$message.success('上传文件成功!')
      }, 300)
      this.$refs.upload.clearFiles()
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
