<template>
  <div class="app-container">
    <el-row>
      <!--附件列表-->
      <el-card class="box-card"  shadow="never">
        <div slot="header" class="clearfix">
          <span class="header-title">{{ gridTitle }}列表</span>
        </div>
        <div>
          <el-table
            ref="table"
            border
            v-loading="gridFilesLoading"
            :data="gridFiles"
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
            <!--          <el-table-column prop="path" label="预览">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="docView( baseApi + '/file/' + scope.row.type + '/' + scope.row.name)">
                            预览
                          </el-button>
                        </template>
                      </el-table-column>-->
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
            <el-table-column prop="createTime" label="上传时间" min-width="120"/>
            <el-table-column prop="createBy" label="上传者" min-width="80"/>
            <!--   附件删除   -->
            <el-table-column
              label="操作"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                <!--删除-->
                <el-popover
                  :ref="`delGridFile-popover-${scope.$index}`"
                  v-permission="permission.edit"
                  placement="top"
                  width="180"
                >
                  <p>确定删除这个附件吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="scope._self.$refs[`delGridFile-popover-${scope.$index}`].doClose()"
                    >取消
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="deleteGridFile(scope.row), scope._self.$refs[`delGridFile-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    v-permission="permission.edit"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="gridFiles.length === 1"
                  />
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <!--上传附件-->
      <div>
        <el-card class="box-card"  shadow="never" v-if="gridFileUploadVisible">
          <div slot="header" class="clearfix">
            <span class="header-title">上传{{ gridTitle }}</span>
            <el-button
              style="float: right; padding: 3px 0"
              icon="el-icon-close"
              type="text"
              @click="gridFileUploadVisible = false"
            />
          </div>
          <div style="width:100%;">
            <el-upload
              ref="uploadGridFile"
              class="upload-demo"
              drag
              :before-upload="beforeUpload"
              :auto-upload="false"
              :headers="headers"
              :on-success="handleGridFileSuccess"
              :on-error="handleError"
              :action="gridFileUploadApi + '?fileType=' + this.$props.fileType "
            >
              <i class="el-icon-upload"/>
              <div class="el-upload__text">将文件拖到此处，或<em>选取上传</em></div>
              <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
            </el-upload>
            <el-button
              style="margin-top:8px;"
              size="small"
              type="success"
              @click="submitGridUpload"
            >
              上传到服务器
            </el-button>
          </div>
        </el-card>
        <el-button
          v-else
          type="primary"
          style="margin-top: 8px;"
          class="button-new-tag"
          icon="el-icon-plus"
          size="small"
          @click="gridFileUploadVisible = true"
        >上传{{ gridTitle }}
        </el-button>
      </div>
    </el-row>
  </div>
</template>

<script>

import {getToken} from "@/utils/auth";
import {mapGetters} from "vuex";
import {delGridFile, getGridFileByExample} from "@/api/tools/instrument/gridFile";

export default {
  name: "GridFile",
  props: ['permission', 'fileType','gridTitle'],
  data() {
    return {
      headers: {
        'Authorization': getToken()
      },
      gridFilesLoading: false,
      gridFiles: false,
      gridFileUploadVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'gridFileUploadApi'
    ])
  },
  created() {
  },
  mounted: function () {
    this.getInstrumentFiles(this.$props.fileType)
  },
  methods: {
    // 仪器校准报告相关方法
    getInstrumentFiles(type) {
      this.gridFilesLoading = true
      this.gridFiles = []
      getGridFileByExample({fileType: type}).then(res => {
        this.gridFiles = res
        this.gridFilesLoading = false
      })
    },
    submitGridUpload() {
      this.$refs.uploadGridFile.submit()
    },
    beforeUpload: function (file) {
      // alert(JSON.stringify(file))
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      return isLt2M
    },
    // 监听仪器台账上传成功
    handleGridFileSuccess(response, file, fileList) {
      this.$message.success('上传文件成功!')
      this.$refs.uploadGridFile.clearFiles()
      this.getInstrumentFiles(this.fileType)
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
    // 删除台账
    deleteGridFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delGridFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getInstrumentFiles(this.fileType)
      })
    },
    // 文件预览
    docView(url) {
      // 直接使用第三方官网需要url有外部域名，而不是本地地址
      // window.open('https://view.officeapps.live.com/op/view.aspx?src='+v,'_target')
      window.open('http://127.0.0.1:8012/onlinePreview?url=' + encodeURIComponent(Base64.encode(url)))
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 8px;
}

.box-card {
  margin-bottom: 10px;
}
</style>
