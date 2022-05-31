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
      label-width="80px"
    >
      <!--校准机构信息-->
      <el-row class="el-row-inline">
        <el-col :span="8">
          <el-form-item label="机构名称" prop="caliOrgName">
            <el-input v-model="form.caliOrgName"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="传真" prop="fax">
            <el-input v-model="form.fax"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="移动电话" prop="phone">
            <el-input v-model="form.phone"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="通讯地址" prop="address">
            <el-input v-model="form.address"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="停启状态" prop="enabled">
            <el-radio
              v-for="item in enableOptions"
              :key="item.id"
              v-model="form.enabled"
              :label="item.value === 'true'"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="校准范围" prop="caliScope">
            <el-input
              v-model="form.caliScope"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入校准范围"
              style="width: 400px;"
            />
          </el-form-item>
        </el-col>
        <!--上传确认信息-->
        <el-col :span="24">
          <el-form-item>
            <template slot="label">
              <span><i style="color: red">* </i>资格证明</span>
            </template>
            <el-table
              ref="table"
              border
              v-loading="caliOrgFileLoading"
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
                    :ref="`delCaliOrgFile-popover-${scope.$index}`"
                    v-permission="permission.edit"
                    placement="top"
                    width="180"
                  >
                    <p>确定删除这个附件吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        type="text"
                        @click="scope._self.$refs[`delCaliOrgFile-popover-${scope.$index}`].doClose()"
                      >取消
                      </el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="deleteCaliOrgFile(scope.row), scope._self.$refs[`delCaliOrgFile-popover-${scope.$index}`].doClose()"
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
              :action="caliOrgFileUploadApi + '?caliOrgId=' + bindingId "
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
import {mapGetters} from "vuex";
import {getToken} from "@/utils/auth";
import {getUid} from "@/api/tools/supplier";
import {getAllUser} from "@/api/system/user";
import {delCaliOrgFile, getCaliOrgFileByCaliOrgId} from "@/api/tools/instrument/caliOrgFile";

const defaultForm = {
  id: null,
  caliOrgName: '',
  fax: null,
  phone: null,
  email: null,
  address: null,
  caliScope: null,
  enabled: true,
  uid: null,
  fileList: []
}
export default {
  mixins: [form(defaultForm)],
  props: {
    enableOptions: {
      type: Array,
      required: true
    },
    permission: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'repair:add'],
        edit: ['admin', 'repair:edit'],
        del: ['admin', 'repair:del']
      },
      cond: {
        statusInList: ['已验收']
      },
      users: [],
      timeout: '',
      rules: {
        caliOrgName: [
          {required: true, message: '请输入校准机构名称', trigger: 'blur'}
        ],
        enabled: [
          {required: true, message: '启用状态不可为空', trigger: 'blur'}
        ]
      },
      maintainDatePickOption: {
        disabledDate: time => {
          return (
            Date.now() < time.getTime()
          )
        }
      },
      bindingId: null,
      caliOrgFileLoading: false,
    }
  },
  created: function () {

  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'caliOrgFileUploadApi'
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
    // 获取保养相关确认单信息
    getCaliOrgFilesByOrgId(id) {
      this.form.fileList = []
      this.caliOrgFileLoading = true
      getCaliOrgFileByCaliOrgId(id).then(res => {
        // alert(res)
        this.form.fileList = res
        this.caliOrgFileLoading = false
      })
    },
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {
      // alert(JSON.stringify(this.form))
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
      // 获取设备保养确认单信息列表
      this.getCaliOrgFilesByOrgId(form.id)
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      // alert(JSON.stringify(this.form.fileList))
      // 判断是否确认完成，若确认完成则必须上传确认单
      if (this.form.fileList.length === 0) {
        this.$message.warning("请务必上传机构证明等附件！")
        return false
      }
    },
    beforeUpload: function (file) {
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
      this.getCaliOrgFilesByOrgId(this.bindingId)
      setTimeout(() => {
        this.$message.success('上传文件成功!')
      }, 300)
      this.$refs.upload.clearFiles()
    },
    // 删除附件
    deleteCaliOrgFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delCaliOrgFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除文件成功!',
          type: 'success'
        })
        this.getCaliOrgFilesByOrgId(row.caliOrgId)
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

.el-row-inline {
  display: flex;
  flex-wrap: wrap;
}
</style>
