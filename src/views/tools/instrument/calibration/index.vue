<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :cali-status="dict.common_status" :out-check="outCheckOptions" :permission="permission"/>
      <crudOperation :permission="permission"/>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      :row-class-name="tableRowClassName"
      @selection-change="crud.selectionChangeHandler"
      @row-dblclick="dbSelected"
      @expand-change="expendCaliSelected">
      <el-table-column type="selection" width="55"/>
      <el-table-column type="expand">
        <template slot-scope="props">
          <!--也可启用下面注释部分的el-descriptions代替el-form-->
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="仪器名称">
              <span>{{ props.row.instruName }}</span>
            </el-form-item>
            <!--仪器校准报告-->
            <el-form-item label="仪校报告列表">
              <div>
                <el-table
                  ref="table"
                  border
                  v-loading="caliFilesLoading"
                  :data="caliFiles"
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
                  <el-table-column label="报告所属" :formatter="isLatestFormat"/>
                  <el-table-column label="校准结果" min-width="100">
                    <template slot-scope="scope">
                      <el-popover
                        :content="scope.row.failDesc"
                        placement="top-start"
                        title="原因"
                        width="200"
                        trigger="hover"
                        v-if="scope.row.caliResult === '不合格'"
                      >
                        <a
                          slot="reference"
                          style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #ff3b18;font-size: 13px;"
                        >
                          {{ scope.row.caliResult }}
                        </a>
                      </el-popover>
                      <span v-else>
                       {{ scope.row.caliResult }}
                      </span>
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
                        :ref="`delCaliFile-popover-${scope.$index}`"
                        v-permission="permission.edit"
                        placement="top"
                        width="180"
                      >
                        <p>确定删除这个附件吗？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button
                            size="mini"
                            type="text"
                            @click="scope._self.$refs[`delCaliFile-popover-${scope.$index}`].doClose()"
                          >取消
                          </el-button>
                          <el-button
                            type="primary"
                            size="mini"
                            @click="deleteCaliFile(scope.row), scope._self.$refs[`delCaliFile-popover-${scope.$index}`].doClose()"
                          >确定
                          </el-button>
                        </div>
                        <el-button
                          slot="reference"
                          v-permission="permission.edit"
                          type="danger"
                          icon="el-icon-delete"
                          size="mini"
                          :disabled="scope.row.isLatest"
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
                  @click="toUploadCaliFile"
                >上传仪校报告
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="仪器名称">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="基本信息"
            width="300"
            trigger="hover"
          >
            <div>
              <el-descriptions :column="1" label-class-name="labelClass">
                <el-descriptions-item label="仪器名称">{{ transToNullFormat(scope.row.instruName) }}</el-descriptions-item>
              </el-descriptions>
              <el-descriptions :column="2">
                <el-descriptions-item label="内部ID">{{ transToNullFormat(scope.row.innerId) }}</el-descriptions-item>
                <el-descriptions-item label="出厂型号">{{ transToNullFormat(scope.row.instruNum) }}</el-descriptions-item>
                <el-descriptions-item label="出厂型号">{{ transToNullFormat(scope.row.instruNum) }}</el-descriptions-item>
                <el-descriptions-item label="出厂日期">{{ dateToNullFormat(scope.row.purDate) }}</el-descriptions-item>
                <el-descriptions-item label="测量范围">{{ transToNullFormat(scope.row.caliScope) }}</el-descriptions-item>
                <el-descriptions-item label="精度要求">{{ transToNullFormat(scope.row.precise) }}</el-descriptions-item>
                <el-descriptions-item label="误差范围">{{ transToNullFormat(scope.row.errorRange) }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <span slot="reference"
                  style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"> {{
                scope.row.instruName
              }} </span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="instruNum" label="出厂型号" min-width="100"/>
      <el-table-column prop="assetNum" label="资产号" min-width="100"/>
      <el-table-column prop="innerId" label="内部ID" min-width="100"/>
      <el-table-column prop="caliScope" label="测量范围" min-width="100"/>
      <el-table-column prop="useArea" label="使用区域" min-width="100"/>
      <el-table-column prop="useBy" label="使用人" min-width="100"/>
      <el-table-column label="上次校准日期" :formatter="lastCaliDateFormat" min-width="100"/>
      <el-table-column label="校准周期">
        <template slot-scope="scope">
          {{ scope.row.caliPeriod }}{{ scope.row.periodUnit }}
        </template>
      </el-table-column>
      <el-table-column label="下次校准日期" :formatter="nextCaliDateFormat" min-width="100"/>
      <el-table-column label="校准选择" :formatter="innerCheckedFormat" min-width="100"/>
      <!-- 最新校准报告，支持下载查看-->
      <el-table-column prop="fileList" label="上次校准报告" min-width="120">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.fileList.length"
            :content="'file/' + scope.row.fileList[0].type + '/' + scope.row.fileList[0].name"
            placement="top-start"
            title="路径"
            width="200"
            trigger="hover"
          >
            <!--可下载文件-->
            <a
              slot="reference"
              :href="baseApi + '/file/' + scope.row.fileList[0].type + '/' + scope.row.fileList[0].name"
              class="el-link--primary"
              style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
              target="_blank"
              :download="scope.row.fileList[0].name"
            >
              {{ scope.row.fileList[0].name }}
            </a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="使用状态" :formatter="isDropFormat"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column prop="createTime" label="创建日期" min-width="140"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','calibration:edit','calibration:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :show-del="showDel"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
    <el-button type="text" @click="openCaliFileUploadDialog">打开仪器参考</el-button>
    <!--表单渲染-->
    <eForm :cali-results="caliResultOptions" :out-check="outCheckOptions" :cali-status="dict.common_status"/>
    <!--报告上传-->
    <el-dialog
      title="上传报告"
      :visible.sync="caliFileUploadVisible"
      width="32%"
    >
      <div>
        <el-form
          ref="fileForm"
          :model="fileForm"
          :rules="fileRules"
          size="small"
          label-width="140px;"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="是否是最新上次校准报告"
                prop="isLatest"
              >
                <el-radio v-for="item in dict.common_status" :key="item.id" v-model="fileForm.isLatest"
                          :label="item.value === 'true'">
                  {{ item.label }}
                </el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="校准结果"
                prop="caliResult"
              >
                <el-radio v-for="item in caliResultOptions" :key="item.value" v-model="fileForm.caliResult"
                          :label="item.label">
                  {{ item.value }}
                </el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="fileForm.caliResult === '不合格'">
              <el-form-item
                label="不合格原因描述"
                prop="failDesc"
              >
                <el-input
                  type="textarea"
                  style="max-width: 300px;"
                  autosize
                  placeholder="请输入报废/无法使用说明"
                  v-model="fileForm.failDesc">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-upload
          ref="uploadCaliFile"
          drag
          :multiple="true"
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleCaliFileSuccess"
          :on-error="handleError"
          :action="instruCaliFileUploadApi + '?caliId=' + caliId + '&isLatest=' + fileForm.isLatest + '&caliResult=' + fileForm.caliResult + '&failDesc=' + fileForm.failDesc"
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将<b style="color: red;">仪器校准</b>相关报告拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button size="small" style="margin-top:8px;" type="success" @click="submitCaliFileUpload">上传到服务器</el-button>
      </div>
    </el-dialog>
    <!--台账管理-->
    <el-drawer
      title="台账管理"
      :visible.sync="gridDiaVisible"
      direction="ttb"
      size="100%">
      <grid-file :permission="permission" :file-type="fileType"/>
    </el-drawer>
  </div>
</template>

<script>


import crudInstruCali from '@/api/tools/instruCali'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, {presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import {GMTToDate, validIsNotNull} from "@/utils/validationUtil";
import {mapGetters} from "vuex";
import {delCaliFile, getCaliFileByExample} from "@/api/tools/instruCaliFile";
import {getToken} from "@/utils/auth";
import GridFile from "@/components/GridFile";
import {update} from "@/api/tools/email";

export default {
  name: 'Calibration',
  components: {eHeader, eForm, crudOperation, pagination, udOperation, GridFile},
  cruds() {
    return CRUD({
      title: '仪器校准',
      url: 'api/instruCali',
      crudMethod: {...crudInstruCali},
      // 关闭前置create率先执行toQuery方法
      queryOnPresenterCreated: false
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['common_status'],
  data() {
    return {
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'calibration:management'],
        edit: ['admin', 'calibration:edit'],
        del: ['admin', 'calibration:del']
      },
      showDel: false,
      outCheckOptions: [
        {
          value: 'true',
          label: '上门校准'
        }, {
          value: 'false',
          label: '送出校准'
        }
      ],
      caliFilesLoading: false,
      caliFiles: [],
      caliFileUploadVisible: false,
      fileForm: {
        isLatest: false,
        caliResult: '合格',
        failDesc: null
      },
      fileRules: {
        isLatest: [
          {required: true, message: '请选择报告类型', trigger: 'blur'}
        ],
        caliResult: [
          {required: true, message: '请选择校准结果', trigger: 'blur'}
        ],
        failDesc: [
          {required: true, message: '请填写不合格原因', trigger: 'blur'}
        ]
      },
      caliResultOptions: [{
        label: '合格',
        value: '合格'
      }, {
        label: '不合格',
        value: '不合格'
      }],
      caliId: null,
      gridFiles: [],
      gridFilesLoading: false,
      gridDiaVisible: false,
      fileType: '仪器/仪表'
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'instruCaliFileUploadApi',
      'gridFileUploadApi'
    ])
  },
  created() {
    this.crud.optShow = {
      add: true,
      edit: true,
      del: false,
      download: true,
      reset: true
    }
  },
  mounted() {
    this.crud.toQuery()
  },
  methods: {
    // 上次校准日期格式化
    lastCaliDateFormat(row, col) {
      if (validIsNotNull(row.lastCaliDate)) {
        return GMTToDate(row.lastCaliDate)
      } else {
        return null
      }
    },
    // 下次校准日期格式化
    nextCaliDateFormat(row, col) {
      if (validIsNotNull(row.nextCaliDate)) {
        return GMTToDate(row.nextCaliDate)
      } else {
        return null
      }
    },
    // 是否已废弃
    isDropFormat(row, col) {
      if (row.isDroped.toString() === 'true') {
        return '已废弃'
      } else {
        return '正常使用中'
      }
    },
    // 是否内部校准格式化
    innerCheckedFormat(row, col) {
      if (row.innerChecked.toString() === 'true') {
        return '内部校准'
      } else {
        if (row.isDoor.toString() === 'true') {
          return '外部-上门校准'
        } else {
          return '外部-送出校准'
        }
      }
    },
    // 常规字符判空转换
    transToNullFormat(val) {
      if (!validIsNotNull(val)) {
        return '--'
      } else {
        return val
      }
    },
    // 时间判空转换
    dateToNullFormat(time) {
      if (!validIsNotNull(time)) {
        return '--'
      } else {
        return GMTToDate(time)
      }
    },
    // 时间判空转换
    boolToNullFormat(b) {
      if (b !== true && b !== false) {
        return '--'
      } else {
        return b === true ? '是' : '否'
      }
    },
    // 根据有效期设置提醒样式
    tableRowClassName({row, rowIndex}) {
      const type = row.status
      if (row.isDroped.toString() === 'true') {
        return 'gray-row'
      } else {
        if (validIsNotNull(type)) {
          if (type === '超时未校准') {
            return 'alert-row'
          } else if (type === '报告待传') {
            return 'warning-row'
          }
        } else {
          return ''
        }
      }
    },
    openCaliFileUploadDialog() {
      this.gridDiaVisible = true
    },
    // 双击跳转
    dbSelected(row) {
      // alert(JSON.stringify(row))
      // 跳转到供应商编辑界面中
      this.$router.push(
        {
          path: '/instrument/calibration-detail',
          query: {
            caliId: row.id
          }
        })
    },
    // 展开行数据
    expendCaliSelected(row, expandedRows) {
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
      _this.caliId = row.id
      // 查询机构对应的附件列表信息
      _this.getCaliFilesById(row.id)
    },
    // 仪器校准报告相关方法
    getCaliFilesById(id) {
      this.caliFilesLoading = true
      this.caliFiles = []
      getCaliFileByExample({calibrationId: id}).then(res => {
        this.caliFiles = res
        this.caliFilesLoading = false
      })
    },
    // 上传仪校报告弹窗触发
    toUploadCaliFile() {
      if (this.$refs['fileForm'] !== undefined) {
        this.$refs['fileForm'].resetFields()
      }
      this.caliFileUploadVisible = true
    },
    // 上传问题对应的附件
    submitCaliFileUpload() {
      this.$refs['fileForm'].validate((valid) => {
        if (valid) {
          this.$refs.uploadCaliFile.submit()
        } else {
          return false
        }
      })
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
    // 监听上传成功
    handleSuccess(response, file, fileList) {
      this.crud.notify('Upload Success! 上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      // this.$refs.upload.clearFiles()
    },
    // 监听仪器校准报告上传成功
    handleCaliFileSuccess(response, file, fileList) {
      this.crud.notify('Upload Success! 上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$refs.uploadCaliFile.clearFiles()
      this.getCaliFilesById(this.caliId)
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
    // 校准报告类型判断格式化
    isLatestFormat(row, col) {
      if (row.isLatest) {
        return '上次校准报告'
      } else {
        return '以往校准报告'
      }
    },
    // 删除仪器校准报告
    deleteCaliFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delCaliFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getCaliFilesById(row.calibrationId)
      })
    }
  }
}
</script>
<style>
.labelClass {
  width: 80px;
}

.el-table .alert-row {
  color: #f00 !important;
}

.el-table .warning-row {
  color: #e6a23c;
}

.el-table .gray-row {
  color: #C0C0C0;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
