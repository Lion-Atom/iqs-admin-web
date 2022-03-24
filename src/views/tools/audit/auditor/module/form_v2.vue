<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="700px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="120px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="人员"
            prop="userId"
          >
            <el-select
              :disabled="!crud.status.add"
              filterable
              v-model="form.userId"
              placeholder="请添加审核人员"
              style="width: 200px;"
            >
              <el-option
                v-for="item in users"
                :key="item.id"
                :label="item.dept.name + ' - '+ item.username"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="体系"
            prop="system"
          >
            <el-select
              v-model="form.system"
              placeholder="请选择体系"
              style="width: 200px;"
            >
              <el-option
                v-for="item in auditSystem"
                :key="item.id"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="!crud.status.add"
            label="状态"
            prop="status"
          >
            <el-select
              disabled
              v-model="form.status"
              placeholder="展示状态"
              style="width: 200px;"
            >
              <el-option
                v-for="item in auditorStatus"
                :key="item.id"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="认证时间"
            prop="certificationTime"
          >
            <el-date-picker
              v-model="form.certificationTime"
              type="date"
              style="width: 200px;"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="有效期限（年）"
            prop="validity"
          >
            <el-input-number
              v-model="form.validity"
              style="width: 200px;"
              :precision="0"
              :step="1"
              :min="1"
              :max="200"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="下此认证时间"
            prop="nextCertificationTime"
          >
            <el-date-picker
              v-model="form.nextCertificationTime"
              type="date"
              style="width: 200px;"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="认证单位"
            prop="certificationUnit"
          >
            <el-input
              v-model="form.certificationUnit"
              style="width: 200px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="!crud.status.add"
            label="批准人"
            prop="approvedBy"
          >
            <el-select
              disabled
              v-model="form.approvedBy"
              style="width: 200px;"
            >
              <el-option
                v-for="item in users"
                :key="item.id"
                :label="item.dept.name + ' - '+ item.username"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="!crud.status.add && form.status !== '待批准'"
            label="批准时间"
            prop="approvedTime"
          >
            <el-date-picker
              disabled
              v-model="form.approvedTime"
              type="datetime"
              style="width: 200px;"
              placeholder="填写日期时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.userId !== null">
        <el-form-item label="附件上传">
          <el-upload
            class="upload-demo"
            ref="upload"
            drag
            :before-upload="beforeUpload"
            :auto-upload="false"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError"
            :action="auditorUploadApi + '?userId=' + form.userId"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>选取上传</em></div>
            <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
          </el-upload>
          <!--        <el-button style="margin-top:8px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
        </el-form-item>
      </el-row>
      <el-row v-if="!crud.status.add">
        <el-form-item label="附件列表">
          <el-table
            ref="table"
            :data="form.auditorFiles"
            style="width: 100%;"
          >
            <el-table-column prop="name" label="附件名称" min-width="100">
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
                    {{ scope.row.name }}
                  </a>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="size" label="大小" width="80"/>
            <el-table-column prop="type" label="附件类型" width="80"/>
            <el-table-column prop="createBy" label="创建者"/>
            <!--   编辑与删除   -->
            <el-table-column
              label="操作"
              max-width="130px"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <div>
                  <!--删除-->
                  <el-popover :ref="`delFile-popover-${scope.$index}`" placement="top"
                              width="180"
                  >
                    <p>确定删除这个附件吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text"
                                 @click="scope._self.$refs[`delFile-popover-${scope.$index}`].doClose()"
                      >取消
                      </el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="deleteFile(scope.$index,scope.row), scope._self.$refs[`delFile-popover-${scope.$index}`].doClose()"
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
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-row>

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
        @click="submitForm"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'
import { getAllUser } from '@/api/system/user'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { delAuditorFile } from '@/api/tools/auditorFile'
import { validIsNotNull } from '@/utils/validationUtil'
import { get, add, edit, del, getAuditorById } from '@/api/tools/auditor'

const defaultForm = {
  id: null,
  userId: null,
  system: null,
  status: null,
  certificationTime: null,
  validity: null,
  nextCertificationTime: null,
  certificationUnit: null,
  approvedBy: null,
  approvedTime: null,
  auditorFiles: []
}
export default {
  mixins: [form(defaultForm)],
  props: {
    auditorStatus: {
      type: Array,
      required: true
    },
    auditSystem: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      headers: {
        'Authorization': getToken()
      },
      users: [],
      rules: {
        userId: [
          { required: true, message: '请务必选择有效人员', trigger: 'blur' }
        ],
        system: [
          { required: true, message: '请输入体系', trigger: 'blur' }
        ],
        certificationTime: [
          { required: true, message: '请输入认证时间', trigger: 'blur' }
        ],
        validity: [
          { required: true, message: '请输入有效期', trigger: 'blur' }
        ],
        nextCertificationTime: [
          { required: true, message: '请输入下一次认证时间', trigger: 'blur' }
        ],
        certificationUnit: [
          { required: true, message: '请输入认证单位', trigger: 'blur' }
        ]
      },
      files: [],
      fileLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'auditorUploadApi'
    ])
  },
  created() {

  },
  mounted: function() {
    this.queryAllUser()
  },
  methods: {
    queryAllUser() {
      // 查询所有有效员工
      getAllUser().then(res => {
        this.users = res.content
      })
    },
    // 上传附件之前判断
    beforeUpload: function(file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      return isLt2M
    },
    /*submitUpload() {
      this.$refs.upload.submit()
    },*/
    // 监听上传成功
    handleSuccess(response, file, fileList) {
      this.$message.success('上传文件成功!')
      this.$refs.upload.clearFiles()
      this.getFiles(this.cond)
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },
    submitForm() {
      // this.crud.submitCU()

      if (validIsNotNull(this.form.id)) {
        // alert("编辑")
        this.$refs.form.validate().then((valid) => {
          if (!valid) {
            return false
          } else {
            edit(this.form).then(res => {
              this.$refs.upload.submit()
              this.crud.status.cu = 0
              setTimeout(() => {
                this.$message({
                  message: 'Edit Success! 修改成功！',
                  type: 'success'
                })
              }, 300)
            })
          }
        })
      } else {
        // alert("新增")
        this.$refs.form.validate().then((valid) => {
          if (!valid) {
            return false
          } else {
            add(this.form).then(res => {
              this.$refs.upload.submit()
              this.crud.status.cu = 0
              setTimeout(() => {
                this.$message({
                  message: 'Add Success! 新增成功！',
                  type: 'success'
                })
              }, 300)
            })
          }
        })
      }
    },
    // 删除附件
    deleteFile(index,row) {
      const data = []
      data.push(row.id)
      delAuditorFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.form.auditorFiles.splice(index,1)
      }).catch(() => {
        this.$message({
          message: 'Del File Failed! 删除附件失败!',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

.el-form-item--small.el-form-item {
  margin-bottom: 14px;
}
</style>
