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
      <!--设备信息-->
      <el-row class="el-row-inline">
        <el-col :span="8">
          <el-form-item label="设备名称" prop="equipName">
            <el-input v-model="equipForm.equipName" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
<!--        <el-col :span="8">
          <el-form-item label="设备名称" prop="equipName">
            <el-input v-model="equipForm.equipName" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备编号" prop="equipNum">
            <el-input v-model="equipForm.equipNum" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备型号" prop="equipModel">
            <el-input v-model="equipForm.equipModel" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备位置" prop="useArea">
            <el-input v-model="equipForm.useArea" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用部门" prop="useDepartName">
            <el-input v-model="equipForm.useDepartName" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运行状态" prop="equipStatus">
            <el-input v-model="equipForm.equipStatus" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备等级" prop="equipLevel">
            <el-input v-model="equipForm.equipLevel" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保养等级" prop="maintainLevel">
            <el-input v-model="equipForm.maintainLevel" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保养周期" prop="maintainPeriod">
            <el-input v-model="equipForm.maintainPeriod" disabled style="width: 220px">
              <template slot="append">
                {{ equipForm.maintainPeriodUnit }}
              </template>
            </el-input>
          </el-form-item>
        </el-col>-->
        <!--设备维修信息-->
        <el-col :span="8">
          <el-form-item label="保养日期" prop="maintainDate">
            <el-date-picker
              v-model="form.maintainDate"
              :picker-options="maintainDatePickOption"
              type="date"
              placeholder="请填写保养日期"
              style="width: 220px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保养人员" prop="maintainBy">
            <el-select v-model="form.maintainBy" filterable allow-create style="width: 220px;">
              <el-option
                v-for="item in users"
                :key="item.id"
                :label="item.dept.name + ' - '+ item.username"
                :value="item.username">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保养时长" prop="maintainDuration">
            <el-input v-model="form.maintainDuration" placeholder="请填写保养时长" style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保养结果" prop="maintainResult">
            <el-select style="width: 220px !important;" v-model="form.maintainResult" placeholder="请填写保养结果">
              <el-option label="好" value="好"></el-option>
              <el-option label="不好" value="不好"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="确认人" prop="confirmBy">
            <!--            <el-input v-model="form.confirmBy" placeholder="请填写维修确认人员"/>-->
            <el-select v-model="form.confirmBy" filterable allow-create style="width: 220px;">
              <el-option
                v-for="item in users"
                :key="item.id"
                :label="item.dept.name + ' - '+ item.username"
                :value="item.username">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="保养反馈" prop="maintainDesc">
            <el-input type="textarea" :rows="3" v-model="form.maintainDesc" placeholder="请填写保养相关内容补充"/>
          </el-form-item>
        </el-col>
        <!--上传确认信息-->
        <el-col :span="24">
          <el-form-item>
            <template slot="label">
              <span><i style="color: red">* </i>保养记录</span>
            </template>
            <el-table
              ref="table"
              border
              v-loading="maintainFilesLoading"
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
                    :ref="`delRepairFile-popover-${scope.$index}`"
                    v-permission="permission.edit"
                    placement="top"
                    width="180"
                  >
                    <p>确定删除这个附件吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        type="text"
                        @click="scope._self.$refs[`delRepairFile-popover-${scope.$index}`].doClose()"
                      >取消
                      </el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="deleteMaintainFile(scope.row), scope._self.$refs[`delRepairFile-popover-${scope.$index}`].doClose()"
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
              :action="maintainFileUploadApi + '?maintainId=' + bindingId "
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
import {delMaintainFile, getFilesByMaintainId} from "@/api/tools/maintainFile";

const defaultForm = {
  id: null,
  equipmentId: null,
  maintainDate: null,
  maintainBy: null,
  maintainResult: null,
  maintainDuration: null,
  maintainDesc: null,
  confirmBy: null,
  uid: null,
  fileList: []
}
export default {
  mixins: [form(defaultForm)],
  props: {
    equipForm: {
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
        equipmentId: [
          {required: true, message: '请输入设备名称', trigger: 'blur'}
        ],
        maintainDate: [
          {required: true, message: '请输入保养日期', trigger: 'blur'}
        ],
        maintainResult: [
          {required: true, message: '请确认本次保养结果', trigger: 'blur'}
        ],
        maintainBy: [
          {required: true, message: '请输入本次保养人员', trigger: 'blur'}
        ],
        confirmBy: [
          {required: true, message: '请输入本次维修确认人', trigger: 'blur'}
        ],
        maintainDuration: [
          {required: true, message: '请输入本次保养时长', trigger: 'blur'}
        ],
        maintainDesc: [
          {required: true, message: '可追加保养相关补充', trigger: 'blur'}
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
      maintainFilesLoading: false,
    }
  },
  created: function () {

  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'maintainFileUploadApi'
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
    getMaintainFilesById(id) {
      this.form.fileList = []
      this.maintainFilesLoading = true
      getFilesByMaintainId(id).then(res => {
        // alert(res)
        this.form.fileList = res
        this.maintainFilesLoading = false
      })
    },
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {
      this.form.equipmentId = this.$props.equipForm.id
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
      this.getMaintainFilesById(form.id)
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      // alert(JSON.stringify(this.form.fileList))
      // 判断是否确认完成，若确认完成则必须上传确认单
      if (this.form.fileList.length === 0) {
        this.$message.warning("请务必上传保养确认单等附件！")
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
      this.getMaintainFilesById(this.bindingId)
      setTimeout(() => {
        this.$message.success('上传文件成功!')
      }, 300)
      this.$refs.upload.clearFiles()
    },
    // 删除附件
    deleteMaintainFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delMaintainFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getMaintainFilesById(row.maintenanceId)
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
</style>
