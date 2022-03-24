<template>
  <div class="app-container" @dblclick="back">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>审核人员信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <svg-icon icon-class="user" class="avatar" />
            </div>
            <ul class="user-info">
              <li>
                <div style="height: 100%">
                  <svg-icon icon-class="user" />
                  审核人员姓名
                  <div class="user-right">{{ auditor.username }}</div>
                </div>
              </li>
              <li>
                <svg-icon icon-class="user1" />
                所属公司
                <div class="user-right">{{ auditor.companyName }}</div>
              </li>
              <li>
                <svg-icon icon-class="dept" />
                所属部门
                <div class="user-right"> {{ auditor.deptName }}</div>
              </li>
              <li>
                <svg-icon icon-class="phone" />
                审核体系
                <div class="user-right">{{ auditor.system }}</div>
              </li>
              <li>
                <svg-icon icon-class="anq" />
                认证单位
                <div class="user-right">{{ auditor.certificationUnit }}</div>
              </li>
              <li>
                <svg-icon icon-class="email" />
                认证生效期
                <div class="user-right">{{ certificationPeriod }}</div>
              </li>
              <li>
                <svg-icon icon-class="icon" />
                证件状态
                <div class="user-right">{{ auditor.status }}</div>
              </li>
              <li>
                <svg-icon icon-class="icon" />
                审批状态
                <div v-if="auditor.approvalStatus !=='被驳回'" class="user-right">{{ auditor.approvalStatus }}</div>
                <div v-else class="user-right">
                  <el-tooltip class="item" effect="dark" :content="auditor.rejectComment" placement="top-start">
                    <span style="color: #f00;">{{ auditor.approvalStatus }}</span>
                  </el-tooltip>
                </div>
              </li>
              <li v-if="auditor.approvalStatus !=='待激活'">
                <svg-icon icon-class="icon" />
                审批人
                <div class="user-right">{{ auditor.approver }}</div>
              </li>
              <li>
                <div class="user-right">
                  <a v-if="auditor.approvalStatus==='待激活'" @click="updateApprovalStatus">发起审批</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--上传附件-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="header-title">上传附件</span>
          </div>
          <div style="width:360px;">
            <el-upload
              ref="upload"
              class="upload-demo"
              drag
              :before-upload="beforeUpload"
              :auto-upload="false"
              :headers="headers"
              :on-success="handleSuccess"
              :on-error="handleError"
              :disabled="disIsTrue"
              :action="auditorUploadApi + '?auditorId=' + this.auditorId"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>选取上传</em></div>
              <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
            </el-upload>
            <el-button
              :disabled="disIsTrue"
              style="margin-top:8px;"
              size="small"
              type="success"
              @click="submitUpload"
            >
              上传到服务器
            </el-button>
          </div>
        </el-card>
        <!--附件列表-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="header-title">附件列表</span>
          </div>
          <div>
            <el-table
              ref="table"
              v-loading="fileLoading"
              :data="files"
              style="width: 100%;"
            >
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
                      {{ scope.row.name }}
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
                      <i class="el-icon-document" />
                    </div>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column prop="size" label="大小" min-width="120" />
              <el-table-column prop="type" label="附件类型" min-width="120" />
              <el-table-column prop="createBy" label="创建者" />
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
                    <el-popover
                      :ref="`delMem-popover-${scope.$index}`"
                      v-permission="permission.edit"
                      placement="top"
                      width="180"
                    >
                      <p>确定删除这个附件吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button
                          size="mini"
                          type="text"
                          @click="scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                        >取消
                        </el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          @click="deleteFile(scope.row.id), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                        >确定
                        </el-button>
                      </div>
                      <el-button
                        slot="reference"
                        v-permission="permission.edit"
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="disIsTrue"
                      />
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--审核人-->
    <!--    <div style="display: inline-block">
          <el-dialog
            :visible.sync="approvalVisible"
            :close-on-click-modal="false"
            :before-close="cancel"
            :title="title"
            append-to-body
            width="500px"
            @close="cancel"
          >
            <el-form ref="form" :model="auditor" :rules="rules" size="small" label-width="100px">
              <el-form-item label="当前审批人" prop="approvedBy">
                <el-input v-model="auditor.approvedBy" style="width: 200px;"/>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="text" @click="cancel">取消</el-button>
              <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
            </div>
          </el-dialog>
        </div>-->
  </div>
</template>

<script>
import { delAuditorFile, getAuditorFileByAuditorId } from '@/api/tools/auditorFile'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { activatedByAuditorId, getAuditorById } from '@/api/tools/auditor'
import { GMTToDate, validIsNotNull } from '@/utils/validationUtil'

export default {
  name: 'AuditorDetail',
  data() {
    return {
      headers: {
        'Authorization': getToken()
      },
      auditorId: null,
      fileLoading: false,
      loading: false,
      files: [],
      permission: {
        edit: ['admin', 'auditor:edit']
      },
      auditor: {},
      certificationPeriod: null,
      approvalVisible: false,
      rules: {
        approvedBy: [
          { required: true, message: '审批者不可为空', trigger: 'blur' }
        ]
      },
      disIsTrue: false
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'auditorUploadApi'
    ])
  },
  created: function() {
    if (this.$route.query.auditorId !== undefined) {
      this.auditorId = this.$route.query.auditorId
      this.getFilesByAuditorId(this.$route.query.auditorId)
      this.getInfoByAuditorId(this.$route.query.auditorId)
    }
  },
  methods: {
    // 获取该审核人员对应的附件
    getFilesByAuditorId(id) {
      this.files = []
      this.fileLoading = true
      getAuditorFileByAuditorId(id).then(res => {
        this.fileLoading = false
        this.files = res
      }).catch(() => {
        this.$message({
          message: 'Get Files Failed! 获取附件失败!',
          type: 'error'
        })
      })
    },
    // 获取该审核人员信息
    getInfoByAuditorId(id) {
      getAuditorById(id).then(res => {
        // alert(JSON.stringify(res.approvalStatus))
        this.auditor = res
        if (validIsNotNull(JSON.stringify(res))) {
          this.certificationPeriod = GMTToDate(res.certificationTime) + ' - ' + GMTToDate(res.nextCertificationTime)
          // 若处在有效期，只可看不可修改
          this.disIsTrue = this.auditor.status === '有效' && this.auditor.approvalStatus === '已批准'
        }
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
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 监听上传成功
    handleSuccess(response, file, fileList) {
      this.$message.success('上传文件成功!')
      this.$refs.upload.clearFiles()
      this.getInfoByAuditorId(this.$route.query.auditorId)
      this.getFilesByAuditorId(this.auditorId)
    },
    cancel() {
      this.approvalVisible = false
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
    // 删除附件
    deleteFile(id) {
      const data = []
      data.push(id)
      delAuditorFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getFilesByAuditorId(this.auditorId)
      }).catch(() => {
        this.$message({
          message: 'Del File Failed! 删除附件失败!',
          type: 'error'
        })
      })
    },
    // 激活审批
    updateApprovalStatus() {
      if (!(this.files.length > 0)) {
        this.$message({
          message: 'Files Must Exist!必须添加【审核员资料】、【认证证书】和【培训证书】作为发起审批的依据',
          type: 'warning'
        })
      } else {
        this.$confirm('确认添加完了？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 发起审批',
          cancelButtonText: 'No 继续添加'
        })
          .then(() => {
            activatedByAuditorId(this.auditorId).then(res => {
              this.$message({
                message: 'Activate Approval Process Success! 审批流程发起成功!',
                type: 'success'
              })
              this.getInfoByAuditorId(this.auditorId)
            }).catch(() => {

            })
          })
      }
    },
    // 返回列表
    back() {
      this.$confirm('返回列表？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Yes 返回列表',
        cancelButtonText: 'Wait 留在本页'
      })
        .then(() => {
          this.$router.push(
            {
              path: '/audit/auditor'
            })
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin-bottom: 5px;
}

.elRow {
  border-bottom: 1px solid #808080;
}

.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info {
  padding-left: 0;
  list-style: none;

  li {
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0;
    font-size: 13px;
  }

  .user-right {
    float: right;

    a {
      color: #317EF3;
    }
  }
}
</style>
