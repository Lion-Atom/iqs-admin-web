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
      @expand-change="expendOrgSelected">
      <el-table-column type="selection" width="55"/>
      <el-table-column type="expand">
        <template slot-scope="props">
          <!--也可启用下面注释部分的el-descriptions代替el-form-->
          <el-form label-position="left" class="demo-table-expand" label-width="120px">
            <el-form-item label="机构名称">
              <span>{{ props.row.caliOrgName }}</span>
            </el-form-item>
            <el-form-item label="启用状态">
              <span>{{ boolToNullFormat(props.row.enabled) }}</span>
            </el-form-item>
            <el-form-item label="仪校机构附件列表">
              <el-table
                ref="table"
                border
                v-loading="caliOrgFilesLoading"
                :data="caliOrgFiles"
                style="width: 100%;"
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
                    <!--删除-->
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
                          @click="delCaliOrgFile(scope.row), scope._self.$refs[`delCaliOrgFile-popover-${scope.$index}`].doClose()"
                        >确定
                        </el-button>
                      </div>
                      <el-button
                        slot="reference"
                        v-permission="permission.edit"
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="caliOrgFiles.length === 1"
                      />
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
              <el-button
                type="primary"
                style="margin-top: 8px;"
                class="button-new-tag"
                icon="el-icon-plus"
                size="small"
                @click="toUploadCaliOrgFile(props.row)"
              >上传仪校组织相关附件
              </el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="caliOrgName" label="名称"/>
      <el-table-column prop="fax" label="传真"/>
      <el-table-column prop="phone" label="手机号"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="address" label="通讯地址"/>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','caliOrg:edit','caliOrg:del'])"
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
      width="650px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="caliOrgName">
              <el-input v-model="form.caliOrgName" style="width: 220px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" style="width: 220px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="传真" prop="fax">
              <el-input v-model="form.fax" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" style="width: 220px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="通讯地址" prop="address">
              <el-input
                v-model="form.address"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 5}"
                placeholder="请输入通讯地址"
                style="width: 400px;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="变更说明" prop="caliScope">
              <el-input
                v-model="form.caliScope"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 5}"
                placeholder="请输入变更说明"
                style="width: 400px;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="状态"
          prop="enabled"
        >
          <el-radio
            v-for="item in dict.job_status"
            :key="item.id"
            v-model="form.enabled"
            :label="item.value === 'true'"
          >
            {{ item.label }}
          </el-radio>
        </el-form-item>
        <el-form-item v-if="crud.status.add" style="width:520px;">
          <template slot="label">
            <span><i style="color: red;">* </i>上传证明</span>
          </template>
          <el-upload
            ref="caliOrgFileUpload"
            class="upload-demo"
            drag
            :multiple="true"
            :before-upload="beforeUpload"
            :headers="headers"
            :before-remove="beforeRemove"
            :on-remove="removeFile"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-change="fileChange"
            :file-list="fileList"
            :action="caliOrgFileUploadApi + '?caliOrgId=' + bindingId"
          >
            <i class="el-icon-upload"/>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
          </el-upload>
        </el-form-item>
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
    <!--仪校机构附件上传-->
    <el-dialog
      title="上传附件"
      :visible.sync="caliOrgFileUploadVisible"
      width="28%"
    >
      <div>
        <el-upload
          ref="uploadCaliOrgFile"
          drag
          :multiple="true"
          :before-upload="beforeUpload"
          :headers="headers"
          :auto-upload="false"
          :on-success="handleCaliOrgSuccess"
          :on-error="handleError"
          :action="caliOrgFileUploadApi + '?caliOrgId=' + bindingId"
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将<b style="color: red;">仪校机构</b>相关文件拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button style="margin-top:8px;" size="small" type="success" @click="submitCaliOrgFileUpload">上传到服务器
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudCaliOrg from '@/api/tools/caliOrg'
import eHeader from './module/header'
import CRUD, {crud, form, header, presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import {getUid} from "@/api/tools/supplier";
import {isvalidPhone} from "@/utils/validate";
import {mapGetters} from "vuex";
import {getToken} from "@/utils/auth";
import {delByCaliOrgIdAndName, delCaliOrgFile, getCaliOrgFileByCaliOrgId} from "@/api/tools/caliOrgFile";

const defaultForm = {
  id: null,
  caliOrgName: '',
  fax: null,
  phone: null,
  email: null,
  address: null,
  caliScope: null,
  enabled: true,
  uid: null
}
export default {
  name: 'Calibration',
  components: {eHeader, crudOperation, pagination, udOperation},
  cruds() {
    return CRUD({
      title: '仪校机构',
      url: 'api/caliOrg',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudCaliOrg}
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['job_status'],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'caliorg:add'],
        edit: ['admin', 'caliorg:edit'],
        del: ['admin', 'caliorg:del']
      },
      rules: {
        email: [
          {required: false, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ],
        /*phone: [
          {required: false, trigger: 'blur', validator: validPhone}
        ],*/
        caliOrgName: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        enabled: [
          {required: true, message: '请输入序号', trigger: 'blur'}
        ]
      },
      bindingId: null,
      caliOrgFileUploadVisible: false,
      caliOrgFilesLoading: false,
      caliOrgFiles: [],
      fileList: []
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'caliOrgFileUploadApi'
    ])
  },
  created() {

  },
  methods: {
    [CRUD.HOOK.beforeToAdd]() {
      this.fileList = []
      this.bindingId = null
      this.form.uid = null
      getUid().then(res => {
        this.form.uid = res
        // alert(JSON.stringify(this.form))
        this.bindingId = res
      })
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.bindingId = form.id
    },
    beforeUpload: function (file) {
      // alert(JSON.stringify(file))
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      return isLt2M
    },
    // 时间判空转换
    boolToNullFormat(b) {
      if (b !== true && b !== false) {
        return '--'
      } else {
        return b === true ? '启用' : '停用'
      }
    },
    // 监听上传成功
    handleSuccess(response, file, fileList) {
      this.crud.notify('Upload Success! 上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      // this.$refs.upload.clearFiles()
    },
    // 移除文件时触发
    removeFile(file, fileList) {
      this.fileList = fileList
    },
    // 监听删除操作
    beforeRemove(file, fileList) {
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
      this.fileList = fileList
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
      this.loading = false
    },
    expendOrgSelected(row, expandedRows) {
      const _this = this
      if (expandedRows.length > 1) {
        _this.expands = []
        if (row) {
          _this.expands.push(row)
        }
        _this.$refs.table.toggleRowExpansion(expandedRows[0])
      } else {
        _this.expands = []
      }
      _this.bindingId = row.id
      // 查询机构对应的附件列表信息
      _this.getCaliOrgFiles(row.id)
    },
    // 获取校准组织文件信息
    getCaliOrgFiles(caliOrgId) {
      this.caliOrgFilesLoading = true
      this.caliOrgFiles = []
      getCaliOrgFileByCaliOrgId(caliOrgId).then(res => {
        this.caliOrgFiles = res
        this.caliOrgFilesLoading = false
      })
    },
    // 改变状态
    changeEnabled(data, val) {
      // alert(JSON.stringify(data))
      this.$confirm('此操作将 "' + this.dict.label.job_status[val] + '" ' + data.caliOrgName + '机构, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudCaliOrg.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.job_status[val] + '成功', 'success')
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 上传仪校组织文件
    toUploadCaliOrgFile(row) {
      this.caliOrgFileUploadVisible = true
      this.bindingId = row.id
    },
    // 上传问题对应的附件
    submitCaliOrgFileUpload() {
      this.$refs.uploadCaliOrgFile.submit()
    },
    handleCaliOrgSuccess() {
      this.$message.success('上传文件成功!')
      this.$refs.uploadCaliOrgFile.clearFiles()
      this.getCaliOrgFiles(this.bindingId)
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      //新增时候必须校验是否上传最新的校准报告
      if (this.crud.status.add) {
        if (this.fileList.length === 0) {
          this.$message.warning("请务必上传相关资格证明等文件！")
          return false
        }
      }
    },
    // 删除附件
    delCaliOrgFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delCaliOrgFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getCaliOrgFiles(row.caliOrgId)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
