<template>
  <div>
    <el-card
      v-if="this.$props.isNeed"
      class="box-card"
      :shadow="this.$props.shadow === undefined ? 'always':this.$props.shadow"
    >
      <div slot="header" class="clearfix">
        <span class="header-title">{{ uploadHeader }}</span>
      </div>
      <div style="width:360px;">
        <el-upload
          class="upload-demo"
          ref="upload"
          drag
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleSuccess"
          :on-error="handleError"
          :action="appendixUploadApi + '?issueId=' + this.$props.issueId + '&stepName=' + this.$props.stepName"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button style="margin-top:8px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </div>
    </el-card>
    <el-card class="box-card" :shadow="this.$props.shadow === undefined ? 'always':this.$props.shadow">
      <div slot="header" class="clearfix">
        <span class="header-title">{{ listHeader }}</span>
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
          <!--          <el-table-column prop="path" label="预览图">
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
                    </el-table-column>-->
          <el-table-column prop="size" label="大小" min-width="120"/>
          <el-table-column prop="type" label="附件类型" min-width="120"/>
          <el-table-column prop="createBy" label="创建者"/>
          <!--   编辑与删除   -->
          <el-table-column
            v-if="!(!this.user.isAdmin && this.cond.stepName === 'D0') && isNeed"
            label="操作"
            max-width="130px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <!--删除-->
                <el-popover :ref="`delMem-popover-${scope.$index}`" v-permission="permission.edit" placement="top"
                            width="180"
                >
                  <p>确定删除这个附件吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text"
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
                    v-permission="permission.del"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                  />
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { delIssueFile, getIssueFileByExample } from '@/api/tools/issueFile'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  name: 'uploadFile',
  props: ['uploadTitle', 'listTitle', 'issueId', 'stepName', 'permission', 'isNeed', 'shadow'],
  data() {
    return {
      headers: {
        'Authorization': getToken()
      },
      isFinished: false,
      fileLoading: false,
      loading: false,
      cond: {
        issueId: this.$props.issueId,
        stepName: this.$props.stepName
      },
      files: [],
      uploadHeader: this.$props.uploadTitle === undefined ? '添加附件' : this.$props.uploadTitle,
      listHeader: this.$props.listTitle === undefined ? '附件列表' : this.$props.listTitle
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'appendixUploadApi'
    ])
  },
  created() {
  },
  mounted: function() {
    this.getFiles(this.cond)
  },
  methods: {
    // 获取附件
    getFiles(data) {
      // alert(issueId + "--对应步骤：--"+stepName)
      this.fileLoading = true
      getIssueFileByExample(data).then(res => {
        // alert(JSON.stringify(res))
        this.fileLoading = false
        this.files = res
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
      this.isFinished = false
      this.$emit('func', this.isFinished)
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
    // 删除附件
    deleteFile(id) {
      const data = []
      data.push(id)
      delIssueFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.isFinished = false
        this.$emit('func', this.isFinished)
        this.getFiles(this.cond)
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
</style>
