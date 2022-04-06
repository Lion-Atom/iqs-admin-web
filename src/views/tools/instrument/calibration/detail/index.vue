<template>
  <div class="app-container" id="caliCanvas" ref="caliCanvas" @dblclick="backToList">
    <!--基本信息-->
    <div class="xItem">
      <el-descriptions title="BasicInfo 基础信息">
        <el-descriptions-item label="仪器名称">{{ transToNullFormat(caliForm.instruName) }}</el-descriptions-item>
        <el-descriptions-item label="内部ID">{{ transToNullFormat(caliForm.innerId) }}</el-descriptions-item>
        <el-descriptions-item label="出厂型号">{{ transToNullFormat(caliForm.instruNum) }}</el-descriptions-item>
        <el-descriptions-item label="出厂型号">{{ transToNullFormat(caliForm.instruNum) }}</el-descriptions-item>
        <el-descriptions-item label="出厂日期">{{ dateToNullFormat(caliForm.purDate) }}</el-descriptions-item>
        <el-descriptions-item label="测量范围">{{ transToNullFormat(caliForm.caliScope) }}</el-descriptions-item>
        <el-descriptions-item label="精度要求">{{ transToNullFormat(caliForm.precise) }}</el-descriptions-item>
        <el-descriptions-item label="允许误差">{{ transToNullFormat(caliForm.errorRange) }}</el-descriptions-item>
        <el-descriptions-item label="使用区域">{{ transToNullFormat(caliForm.useArea) }}</el-descriptions-item>
        <el-descriptions-item label="使用人">{{ transToNullFormat(caliForm.useBy) }}</el-descriptions-item>
        <el-descriptions-item label="上次校准日期">{{ dateToNullFormat(caliForm.lastCaliDate) }}</el-descriptions-item>
        <el-descriptions-item label="校准周期">{{ transToNullFormat(caliForm.caliPeriod)}}{{ transToNullFormat(caliForm.periodUnit)}}</el-descriptions-item>
        <el-descriptions-item label="下次校准日期">{{ dateToNullFormat(caliForm.nextCaliDate) }}</el-descriptions-item>
        <el-descriptions-item label="校准选择">{{ innerCheckedToNullFormat(caliForm.innerChecked) }}</el-descriptions-item>
        <el-descriptions-item v-if="caliForm.innerChecked" label="外部校准方式">{{ isDoorToNullFormat(caliForm.isDoor) }}</el-descriptions-item>
        <el-descriptions-item label="是否报废">{{ boolToNullFormat(caliForm.isDroped) }}</el-descriptions-item>
        <el-descriptions-item v-if="caliForm.isDroped" label="报废说明">{{ boolToNullFormat(caliForm.dropRemark) }}</el-descriptions-item>
        <el-descriptions-item v-if="!caliForm.isDroped" label="下次校准提醒">{{ boolToNullFormat(caliForm.isRemind) }}</el-descriptions-item>
        <el-descriptions-item v-if="!caliForm.isDroped && caliForm.isRemind" label="提前提醒天数">{{ boolToNullFormat(caliForm.remindDays) }}天</el-descriptions-item>
      </el-descriptions>
    </div>
    <!--todo 以往校准报告-->
    <div class="xItem">
      <el-descriptions title="ReportLog 以往报告"></el-descriptions>
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
          <el-table-column label="报告所属" :formatter="isLatestFormat" />
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
          <el-table-column prop="createBy" label="创建者" min-width="80"/>
          <!--   附件删除   -->
          <el-table-column
            label="操作"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <!--预览:均需要域名-->
<!--              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="yulan( baseApi + '/file/' + scope.row.type + '/' + scope.row.name)"
              />-->
<!--              <a
                :href="'http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc='+baseApi + '/file/' + scope.row.type + '/' + scope.row.name"
                target="_blank"
                rel="nofollow"
              >预览</a>-->
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
    </div>
    <!--操作日志-->
    <div class="xItem">
      <el-descriptions title="OperaLog 操作日志"></el-descriptions>
      <div>
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <el-input
              v-model="query.bindingId"
              style="display: none;"
            />
            <el-input
              v-model="query.blurry"
              clearable
              size="small"
              style="width: 180px;"
              placeholder="请输入你要搜索的内容"
              class="filter-item"
              @input="inputChange($event)"
              @keyup.enter.native="crud.toQuery"
            />
            <date-range-picker
              v-model="query.createTime"
              class="date-item"
              @change="crud.toQuery"
              @input="dateTimeChange($event)"
            />
            <span>
                <el-button
                  class="filter-item"
                  size="mini"
                  type="success"
                  icon="el-icon-search"
                  @click="crud.toQuery"
                >搜索</el-button>
                <el-button
                  v-if="crud.optShow.reset"
                  class="filter-item"
                  size="mini"
                  type="warning"
                  icon="el-icon-refresh-left"
                  @click="resetQueryToolsLog"
                >重置</el-button>
              </span>
          </div>
          <crudOperation>
            <el-button
              slot="left"
              class="filter-item"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :loading="crud.delAllLoading"
              @click="confirmDelAll()"
            >
              清空
            </el-button>
          </crudOperation>
        </div>
        <!--表格渲染-->
        <el-table
          ref="table"
          v-loading="crud.loading"
          :data="crud.data"
          style="width: 100%;"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="请求方法">
                  <span>{{ props.row.description }}</span>
                </el-form-item>
                <el-form-item label="变更明细">
                  <span>{{ props.row.descriptionDetail }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="logType" label="日志类型" width="150px"/>
          <el-table-column prop="description" label="描述" width="200px"/>
          <el-table-column prop="descriptionDetail" label="变更明细">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                title="变更明细"
                width="300"
                trigger="hover"
              >
                  <pre class="detail-rn">
                    {{ scope.row.descriptionDetail }}
                  </pre>
                <span slot="reference" class="popover-span"> {{ scope.row.descriptionDetail }} </span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="操作人" width="150px"/>
          <el-table-column prop="createTime" label="创建日期" width="180px"/>
        </el-table>
        <!--分页组件-->
        <pagination/>
      </div>
    </div>
    <!--上传仪器校准报告-->
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
          :action="instruCaliFileUploadApi + '?caliId=' + cond.bindingId + '&isLatest=' + fileForm.isLatest + '&caliResult=' + fileForm.caliResult + '&failDesc=' + fileForm.failDesc"
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将<b style="color: red;">仪器校准</b>相关报告拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button size="small" style="margin-top:8px;" type="success" @click="submitCaliFileUpload">上传到服务器</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import {delToolsLogByCond} from '@/api/monitor/toolslog'
import CRUD, {crud, header, presenter} from '@crud/crud'
import DateRangePicker from '@/components/DateRangePicker'
import crudOperation from '@crud/CRUD.operation'
import udApprove from '@crud/UD.approve'
import pagination from '@crud/Pagination'
import {getToken} from '@/utils/auth';
import {GMTToDate, validIsNotNull} from "@/utils/validationUtil";
import {getInstruCaliById} from "@/api/tools/instruCali";
import {delCaliFile, getCaliFileByExample} from "@/api/tools/instruCaliFile";
import {mapGetters} from "vuex";
import excelview from 'vue-preview'

export default {
  name: "CalibrationDetail",
  components: {crudOperation, pagination, udApprove, DateRangePicker},
  cruds() {
    return CRUD({
      title: '校准操作日志',
      url: 'api/toolsLogs',
      sort: ['createTime,asc', 'id,asc'],
      // 关闭前置create率先执行toQuery方法
      queryOnPresenterCreated: false
    })
  },
  mixins: [presenter(), header(), crud()],
  // 设置数据字典
  dicts: ['common_status'],
  comments:{'excel-view': excelview},
  data() {
    return {
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'calibration:management'],
        edit: ['admin', 'calibration:edit'],
        del: ['admin', 'calibration:del']
      },
      cond: {
        bindingId: null
      },
      activeNames: ['1'],
      caliForm: {},
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
      }]
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'instruCaliFileUploadApi'
    ])
  },
  created: function () {
    if (this.$route.query.caliId !== undefined) {
      this.query.bindingId = this.$route.query.caliId
      this.cond.bindingId = this.$route.query.caliId
      this.crud.toQuery(this.query.bindingId)
      // alert("-----带参数执行完毕：----"+JSON.stringify(this.crud.data))
      // 获取仪器校准信息
      this.getCaliInfoById(this.$route.query.caliId)
      // 获取仪器校准报告信息
      this.getCaliFilesById(this.$route.query.caliId)
    }
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true,
      reset: true
    }
  },
  methods: {
    yulan(url) {
      // 直接使用第三方官网需要url有外部域名，而不是本地地址
      // window.open('https://view.officeapps.live.com/op/view.aspx?src='+v,'_target')
      // 本地加载第三方，可直接读取本地文件
      window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
    },
    // 监控日志查询输入变化，强制刷新
    inputChange() {
      this.$forceUpdate()
    },
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
    },
    // 查询仪器校准信息
    getCaliInfoById(id) {
      getInstruCaliById(id).then(res=>{
        this.caliForm = res
      })
    },
    // 仪器校准报告相关方法
    getCaliFilesById(id) {
      this.caliFilesLoading = true
      this.caliFiles = []
      getCaliFileByExample({calibrationId:id}).then(res=>{
        this.caliFiles = res
        this.caliFilesLoading = false
      })
    },
    isLatestFormat(row,col) {
      if(row.isLatest){
        return '上次校准报告'
      } else {
        return '以往校准报告'
      }
    },
    // 上传仪校报告弹窗触发
    toUploadCaliFile() {
      this.caliFileUploadVisible = true
    },
    // 上传问题对应的附件
    submitCaliFileUpload() {
      this.$refs.uploadCaliFile.submit()
    },
    beforeUpload: function(file) {
      // alert(JSON.stringify(file))
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      return isLt2M
    },
    // 监听上传成功
    handleCaliFileSuccess(response, file, fileList) {
      this.crud.notify('Upload Success! 上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$refs.uploadCaliFile.clearFiles()
      this.getCaliFilesById(this.cond.bindingId)
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
    },
    backToList() {
      this.$confirm('返回列表？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Yes 前往列表',
        cancelButtonText: 'Wait 留在本页'
      })
        .then(() => {
          // 跳转到仪器校准列表界面
          this.$router.push(
            {
              path: '/instrument/calibration',
              query: {

              }
            })
        })
    },
    // 仪器校准操作日志相关方法
    // 搜索重置
    resetQueryToolsLog(val) {
      // alert(JSON.stringify(val))
      this.query.blurry = ''
      this.query.createTime = null
      this.crud.toQuery(this.query.bindingId)
    },
    // 格式化仪器校准操作日志表格消息内容
    stateFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      if (!cellValue) return ''
      if (cellValue.length > 30) {
        // 最长固定显示4个字符
        return cellValue.slice(0, 30) + '...'
      }
      return cellValue
    },
    // 删除当前仪器校准操作日志
    confirmDelAll() {
      this.$confirm(`确认清空当前仪器校准的操作日志吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        delToolsLogByCond(this.cond).then(res => {
          this.crud.delAllLoading = false
          this.crud.dleChangePage(1)
          this.crud.delSuccessNotify()
          this.crud.toQuery()
        }).catch(err => {
          this.crud.delAllLoading = false
          console.log(err.response.data.message)
        })
      }).catch(() => {
      })
    },
    // 显示项目的统一格式化处理
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
    // 布尔型判空转换
    boolToNullFormat(b) {
      if (b !== true && b !== false) {
        return '--'
      } else {
        return b === true ? '是' : '否'
      }
    },
    // 是否内部校准
    innerCheckedToNullFormat(b) {
      if (b !== true && b !== false) {
        return '--'
      } else {
        return b === true ? '内部校准' : '外部校准'
      }
    },
    isDoorToNullFormat(b) {
      if (b !== true && b !== false) {
        return '--'
      } else {
        return b === true ? '上门校准' : '送出校准'
      }
    },
  }
}
</script>

<style scoped>

#caliCanvas .xItem {
  padding: 10px 20px;
}

.popover-span {
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #1890ff;
  font-size: 12px;
}

.detail-rn {
  white-space: pre-line;
}
</style>
