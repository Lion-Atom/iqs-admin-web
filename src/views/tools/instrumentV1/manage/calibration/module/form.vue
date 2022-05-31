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
      <!--设备信息-->
      <el-row class="el-row-inline">
        <el-col :span="8">
          <el-form-item label="仪器名称" prop="instruName">
            <el-input v-model="instruForm.instruName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="内部编号" prop="innerId">
            <el-input v-model="instruForm.innerId" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出厂型号" prop="instruNum">
            <el-input v-model="instruForm.instruNum" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="测量范围" prop="caliScope">
            <el-input v-model="instruForm.caliScope" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="精度要求" prop="precise">
            <el-input v-model="instruForm.precise" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="误差范围" prop="errorRange">
            <el-input v-model="instruForm.errorRange" disabled />
          </el-form-item>
        </el-col>
        <!--仪器校准信息-->
        <el-col :span="8">
          <el-form-item label="校准日期" prop="caliDate">
            <el-date-picker
              v-model="form.caliDate"
              :picker-options="caliDatePickOption"
              type="date"
              placeholder="请填写保养日期"

            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="内部校准"
            prop="innerChecked"
          >
            <el-radio v-for="item in caliStatus" :key="item.id" v-model="form.innerChecked"
                      :label="item.value === 'true'">
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.innerChecked.toString()==='false'">
          <el-form-item
            label="外部校准方式"
            prop="isDoor"
          >
            <el-radio v-for="item in outCheck" :key="item.id" v-model="form.isDoor" :label="item.value === 'true'">
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.innerChecked.toString()==='false'">
          <el-form-item label="校准机构" prop="caliOrgId">
            <el-select
              v-model="form.caliOrgId"
              placeholder="请选择校准机构"
            >
              <el-option
                v-for="item in caliOrgs"
                :key="item.id"
                :label="item.caliOrgName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="校准结果" prop="caliResult">
            <el-select  v-model="form.caliResult" style="width: 100%" placeholder="请反馈校准结果">
              <el-option
                v-for="item in caliResults"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.caliResult === '不合格'">
          <el-form-item label="不合格原因" prop="failDesc">
            <el-input type="textarea" :rows="3" v-model="form.failDesc" placeholder="请填写校准不合格原因"/>
          </el-form-item>
        </el-col>
        <!--上传校准报告-->
        <el-col :span="24">
          <el-form-item>
            <template slot="label">
              <span><i style="color: red">* </i>校准报告</span>
            </template>
            <el-table
              ref="table"
              border
              v-loading="caliFileLoading"
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
                        @click="deleteCaliFile(scope.row), scope._self.$refs[`delRepairFile-popover-${scope.$index}`].doClose()"
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
              :action="instruCaliFileUploadApiV2 + '?caliId=' + bindingId "
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
import {delMaintainFile, getFilesByMaintainId} from "@/api/tools/maintainFile";
import {getCaliOrgByExample} from "@/api/tools/instrument/caliOrg";
import {delCaliFileV2, getFilesByCaliIdV2} from "@/api/tools/instrument/instruCaliFileV2";

const defaultForm = {
  id: null,
  instruId: null,
  caliDate: null,
  innerChecked: true,
  caliOrgId: null,
  isDoor: null,
  caliResult: null,
  failDesc: null,
  uid: null,
  fileList: []
}
export default {
  mixins: [form(defaultForm)],
  props: {
    instruForm: {
      type: Object,
      required: true
    },
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
      permission: {
        add: ['admin', 'repair:add'],
        edit: ['admin', 'repair:edit'],
        del: ['admin', 'repair:del']
      },
      timeout: '',
      rules: {
        instruId: [
          {required: true, message: '仪器不可为空', trigger: 'blur'}
        ],
        caliDate: [
          {required: true, message: '请输入校准日期', trigger: 'blur'}
        ],
        innerChecked: [
          {required: true, message: '请确认校准方式', trigger: 'blur'}
        ],
        isDoor: [
          {required: true, message: '请选择外部校准方式', trigger: 'blur'}
        ],
        caliOrgId: [
          {required: true, message: '请选择外部校准机构', trigger: 'blur'}
        ],
        caliResult: [
          {required: true, message: '请反馈本次校准结果', trigger: 'blur'}
        ],
        failDesc: [
          {required: true, message: '可追加校准不合格明细', trigger: 'blur'}
        ]
      },
      caliDatePickOption: {
        disabledDate: time => {
          return (
            Date.now() < time.getTime()
          )
        }
      },
      bindingId: null,
      caliFileLoading: false,
      caliOrgs: [],
      cond: {
        enabled: true
      }
    }
  },
  created: function () {
    this.getAvailCaliOrg(this.cond)
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'instruCaliFileUploadApiV2'
    ])
  },
  watch: {},
  mounted() {

  },
  methods: {
    // 获取启用状态的校准机构
    getAvailCaliOrg(cond) {
      this.caliOrgs = []
      getCaliOrgByExample(cond).then(res => {
        this.caliOrgs = res
      })
    },
    // 获取保养相关确认单信息
    getCaliFilesByCaliId(id) {
      this.form.fileList = []
      this.caliFileLoading = true
      getFilesByCaliIdV2(id).then(res => {
        // alert(res)
        this.form.fileList = res
        this.caliFileLoading = false
      })
    },
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {
      this.form.instruId = this.$props.instruForm.id
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
      this.getCaliFilesByCaliId(form.id)
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
      /*if (this.form.name === '' || this.form.name === undefined) {
        this.form.name = file.name
      }*/
      return isLt2M
    },
    // 监听上传成功
    handleSuccess(response, file, fileList) {
      this.getCaliFilesByCaliId(this.bindingId)
      setTimeout(() => {
        this.$message.success('上传文件成功!')
      }, 300)
      this.$refs.upload.clearFiles()
    },
    // 删除附件
    deleteCaliFile(row) {
      // alert(JSON.stringify(row))
      const data = []
      data.push(row.id)
      delCaliFileV2(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getCaliFilesByCaliId(row.caliId)
      })
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      // this.form.name = ''
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
