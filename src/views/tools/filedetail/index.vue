<template>
  <div class="app-container">
    <h2>
      <!--      <i ref="view" class="el-icon-view" style="color:#00a0e9;"/>-->
      <!--文件下载-->
      <a
        v-if="form.hasDownloadAuthority"
        :href="baseApi + '/file/' + form.type + '/' + form.realName"
        class="el-link--primary"
        style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;"
        target="_blank"
      >
        <i ref="view" class="el-icon-view" style="color:#00a0e9;" />
        {{ realName }}&nbsp;
      </a>
      <a
        v-else
        class="el-link--primary"
        style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #808080;"
        target="_blank"
      >
        <i ref="view" class="el-icon-view" style="color:#808080;" />
        {{ realName }}&nbsp;
      </a>
      &nbsp;&nbsp;
      <el-popover
        placement="top-start"
        title="Go to Edit!Click it!"
        width="200"
        trigger="hover"
        content="就决定修改它了！"
      >
        <i ref="edit" slot="reference" class="el-icon-s-promotion" @click="changeToEdit" />
      </el-popover>
    </h2>
    <el-row>
      <el-col :span="24">
        <div style="color:#303133;font-size:13px;">
          Outline 文件概述：{{ (fileDesc === null || fileDesc === undefined) ? '--none--' : fileDesc }}
        </div>
      </el-col>
    </el-row>
    <el-divider />
    <el-select
      v-model="fileSelected.name"
      filterable
      style="width: 400px;padding-bottom: 10px;"
      placeholder="请选择"
      value-key="id"
      @change="changeFile"
    >
      <el-option
        v-for="item in files"
        :key="item.id"
        :label="item.name"
        :value="item"
      />
    </el-select>

    <el-collapse v-model="activeNames" accordion @change="handleChange">
      <el-form ref="form" class="dialog" :model="form" size="small" label-width="200px">
        <!--概括-->
        <el-collapse-item title="Profile 轮廓" name="1" class="collapse-item">
          <el-row>
            <el-col :span="12" class="el-col-left">
              <el-form-item label="SecurityLevel 保密级别">
                <!--                <el-input v-model="form.securityLevel" style="width: 370px;"/>-->
                <el-select
                  ref="fileType"
                  v-model="form.securityLevel"
                  clearable
                  placeholder="--none--"
                  style="width: 370px"
                  disabled
                >
                  <el-option
                    v-for="item in dict.file_security"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Designated 开放部门">
                <el-tag
                  v-for="item in bindDeptItems"
                  :key="item"
                  :type="item"
                  effect="plain"
                  style="margin-right: 5px;"
                >
                  {{ item }}
                </el-tag>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="el-col-left">
              <el-form-item label="Category 所属分类">
                <el-input v-model="form.fileCategory.name" style="width: 370px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="FileLevel 所属等级">
                <el-input v-model="form.fileLevel.name" style="width: 370px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="el-col-left">
              <el-form-item label="Size 文件大小">
                <el-input v-model="form.size" style="width: 370px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Type 文件用途">
                <!--                <el-input v-model="form.fileType" style="width: 370px;"/>-->
                <el-select
                  ref="fileType"
                  v-model="form.fileType"
                  clearable
                  placeholder="--none--"
                  style="width: 370px"
                  disabled
                >
                  <el-option
                    v-for="item in dict.file_type"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="el-col-left">
              <el-form-item label="CurrentVersion 当前版本">
                <el-input v-model="form.version" style="width: 370px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="CurrentStatus 当前状态">
                <!--                <el-input v-model="form.fileStatus" style="width: 370px;"/>-->
                <el-select
                  v-model="form.fileStatus"
                  filterable
                  style="width: 370px;"
                  disabled
                >
                  <el-option
                    v-for="item in dict.file_status"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="el-col-left">
              <el-form-item label="CreatedBy 创建信息">
                <el-input v-model="form.createBy" style="width: 370px;" />
              </el-form-item>
            </el-col>
            <el-form-item label="UpdatedBy 最新操作">
              <el-input v-model="form.updateBy" style="width: 370px;" />
            </el-form-item>
          </el-row>
        </el-collapse-item>
        <!--所属组织-->
        <el-collapse-item title="Organization 所属组织" name="2" class="collapse-item">
          <el-form-item label="FileDept 所属部门">
            <el-input v-model="form.fileDept.name" style="width: 370px;" />
          </el-form-item>
        </el-collapse-item>
        <!--关联文件-->
        <el-collapse-item title="Reference 参考文献" name="3" class="collapse-item">
          <el-row>
            <el-col>
              <div v-if="bindFileItems.length>0">
                <div v-for="(item,index) in bindFileItems" :key="item.id" style="margin-left: 10px;">
                  <el-button type="text" @click.native="refFile(item)">
                    {{ '[' + (index + 1) + '] ' + item.name + ',' + item.version }}
                  </el-button>
                </div>
              </div>
              <div v-else>
                <div style="color: #FFBA00;margin:0 0 18px 18px;!important;">No References! 暂无绑定文件
                </div>
              </div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <!--文件历史记录-->
        <el-collapse-item title="ApprovalProcess 审批记录" name="4" class="collapse-item">
          <el-row>
            <el-col>
              <div>
                <!-- 查询工具 -->
                <div class="head-container">
                  <div>
                    <el-input
                      v-model="params.bindingId"
                      style="display: none;"
                    />
                    <el-input
                      v-model="params.blurry"
                      clearable
                      size="small"
                      style="width: 180px;"
                      placeholder="请输入你要搜索的内容"
                      class="filter-item"
                      @keyup.enter.native="getApprovalProcessRecord(params)"
                    />
                    <el-select
                      v-model="params.version"
                      size="small"
                      placeholder="状态"
                      class="filter-item"
                      style="width: 90px"
                      @change="getApprovalProcessRecord(params)"
                    >
                      <el-option
                        v-for="item in versions"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                    <!--                    <date-range-picker
                                          v-model="params.createTime"
                                          class="date-item"
                                        />-->
                    <span>
                      <el-button
                        class="filter-item"
                        size="mini"
                        type="success"
                        icon="el-icon-search"
                        @click="getApprovalProcessRecord(params)"
                      >搜索</el-button>
                      <el-button
                        class="filter-item"
                        size="mini"
                        type="warning"
                        icon="el-icon-refresh-left"
                        @click="resetQueryProcess"
                      >重置</el-button>
                    </span>
                  </div>
                </div>
                <!--表格渲染-->
                <el-table
                  ref="table"
                  v-loading="crud.loading"
                  :data="approvalProcessData"
                  style="width: 100%;"
                  :row-class-name="tableRowClassName"
                >
                  <el-table-column prop="realName" label="文件真实名">
                    <template slot-scope="scope">
                      <el-popover
                        :content="'file/' + scope.row.type + '/' + scope.row.realName"
                        placement="top-start"
                        title="路径"
                        width="200"
                        trigger="hover"
                      >
                        <!--可下载文件-->
                        <a
                          v-if="form.hasDownloadAuthority"
                          slot="reference"
                          :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
                          class="el-link--primary"
                          style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                          target="_blank"
                          :download="scope.row.realName"
                        >
                          {{ scope.row.realName }}
                        </a>
                        <a
                          v-else
                          slot="reference"
                          class="el-link--primary"
                          style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #808080;font-size: 13px;"
                          target="_blank"
                          :download="scope.row.realName"
                        >
                          {{ scope.row.realName }}
                        </a>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column prop="processNo" min-width="180" label="审批单号" />
                  <el-table-column prop="version" width="50" label="版本" />
                  <el-table-column prop="changeType" width="120" label="变更类型" />
                  <el-table-column label="诉求" min-width="120">
                    <template slot-scope="scope">
                      <el-popover
                        placement="top-start"
                        title="审批请求"
                        width="200"
                        trigger="hover"
                      >
                        <div>{{ scope.row.changeDesc }}</div>
                        <a
                          slot="reference"
                          style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                        >
                          {{ scope.row.changeDesc }}
                        </a>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" width="150" label="创建时间" />
                  <el-table-column prop="createBy" label="创建人" width="100" />
                  <el-table-column prop="approver" width="120" label="预审批人" />
                  <el-table-column label="审核结果" :formatter="approveResultFormat" width="70"/>
                  <el-table-column prop="duration" label="审批时长" min-width="70" />
                  <el-table-column label="审批意见">
                    <template slot-scope="scope">
                      <el-popover
                        placement="top-start"
                        title="审批意见"
                        width="200"
                        trigger="hover"
                      >
                        <div>{{ scope.row.approvedComment }}</div>
                        <a
                          slot="reference"
                          style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                        >
                          {{ scope.row.approvedComment }}
                        </a>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column label="实际审批人" :formatter="updateByFormat" />
                  <!--审批-->
                  <!--                  <el-table-column
                                      label="操作"
                                      width="80"
                                      align="center"
                                      fixed="right"
                                    >
                                      <template slot-scope="scope">
                                        <udApprove
                                          :data="scope.row"
                                          :permission="permission"
                                          @func="getMsgFormSon"
                                        />
                                      </template>
                                    </el-table-column>-->
                </el-table>
                <!--分页组件-->
                <el-pagination
                  :page-size.sync="params.size"
                  :total="total"
                  style="margin-top: 8px;"
                  :page-sizes="[10,20,30,40,50,100]"
                  layout="total, prev, pager, next, sizes"
                  @size-change="sizeChangeHandler"
                  @current-change="pageChangeHandler"
                />
              </div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="OperationLog 操作日志" name="5" class="collapse-item">
          <el-row>
            <el-col>
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
                  <el-table-column prop="username" label="操作人" width="150px" />
                  <el-table-column prop="logType" label="日志类型" width="150px" />
                  <el-table-column prop="description" label="描述" width="200px" />
                  <el-table-column prop="descriptionDetail" label="变更明细" :formatter="stateFormat" />
                  <el-table-column prop="createTime" label="创建日期" width="180px" />
                </el-table>
                <!--分页组件-->
                <pagination />
              </div>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-form>
    </el-collapse>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import {
  getAllFilesAnonymousAccess,
  getAppProcessListByFileId,
  getFileById,
  getFilesByIds
} from '@/api/tools/localStorage'
import { delToolsLogByCond } from '@/api/monitor/toolslog'
import { getApprovalProcess } from '@/api/system/approvalProcess'
import CRUD, { crud, header, presenter } from '@crud/crud'
import DateRangePicker from '@/components/DateRangePicker'
import crudOperation from '@crud/CRUD.operation'
import udApprove from '@crud/UD.approve'
import pagination from '@crud/Pagination'
import { unique } from '@/utils/validationUtil'

export default {
  name: 'FileDetail',
  components: { crudOperation, pagination, udApprove, DateRangePicker },
  cruds() {
    return CRUD({ title: '日志', url: 'api/toolsLogs',queryOnPresenterCreated: false })
  },
  mixins: [presenter(), header(), crud()],
  // 设置数据字典
  dicts: ['file_status', 'common_status', 'file_type', 'file_security'],
  data() {
    return {
      id: null,
      files: [],
      file: null,
      realName: '',
      activeNames: ['1'],
      headers: { 'Authorization': getToken() },
      permission: {
        // management: ['admin', 'storage:management'],
        // edit: ['admin', 'storage:edit'],
        // del: ['admin', 'storage:del']
        approve: ['admin', 'storage:edit']
      },
      form: {
        id: null,
        name: '',
        realName: '',
        securityLevel: '',
        version: '',
        fileStatus: '',
        fileDesc: '',
        size: '',
        type: '',
        createBy: '',
        createTime: null,
        updateBy: '',
        updateTime: null,
        hasDownloadAuthority: null,
        fileCategory: {
          id: null,
          name: ''
        },
        fileLevel: {
          id: null,
          name: '',
          description: ''
        },
        fileDept: {
          id: null,
          name: ''
        }
      },
      bindFileItems: [],
      cond: {
        bindingId: null
      },
      fileSelected: {
        id: null,
        name: ''
      },
      params: {
        bindingId: null,
        blurry: '',
        createTime: null,
        version: '',
        page: 0,
        size: 10
      },
      versions: [],
      approvalProcessData: [],
      total: 0,
      isAdmin: false,
      bindDeptItems: []
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'fileUploadApi'
    ])
  },
  created: function() {
    if (this.$route.query.fileId !== undefined) {
      this.query.bindingId = this.$route.query.fileId
      this.fileSelected.id = this.$route.query.fileId
      this.fileSelected.name = this.$route.query.name
      this.realName = this.$route.query.realName
      this.fileDesc = this.$route.query.fileDesc
      this.crud.toQuery(this.query.bindingId)
      this.params.bindingId = this.query.bindingId
      // this.getApprovalProcessRecord(this.params)
    }
    this.getAllFilesByAnyAccess()
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true,
      reset: true
    }
    this.isAdmin = this.user.isAdmin
  },
  /*  mounted() {
      this.getAllFiles()
    },*/
  methods: {
    // 监控日志查询输入变化，强制刷新
    inputChange() {
      this.$forceUpdate()
    },
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
    },
    sizeChangeHandler(currentSize) {
      this.params.size = currentSize
      this.getApprovalProcessRecord(this.params)
    },
    pageChangeHandler(currentPage) {
      this.params.page = currentPage
      this.getApprovalProcessRecord(this.params)
    },
    // 查询审批数据变化
    getApprovalProcessRecord(params) {
      this.approvalProcessData = []
      this.total = 0
      // alert(JSON.stringify(params))
      getApprovalProcess(params).then(res => {
        // alert(JSON.stringify(res.content))
        this.approvalProcessData = res.content
        this.total = res.totalElements
      })
    },
    // 根据审批状态设置样式
    tableRowClassName({ row, rowIndex }) {
      if (row.approvedResult === undefined) {
        return 'warning-row'
      } else if (row.approvedResult === '驳回') {
        return 'alert-row'
      } else if (row.approvedResult === '同意') {
        return 'success-row'
      }
      return ''
    },
    // 搜索重置
    resetQueryProcess() {
      this.params.blurry = ''
      this.params.createTime = null
      this.params.page = 0
      this.params.size = 10
      this.getApprovalProcessRecord(this.params)
    },
    // 搜索重置
    resetQueryToolsLog(val) {
      // alert(JSON.stringify(val))
      this.query.blurry = ''
      this.query.createTime = null
      this.crud.toQuery(this.query.bindingId)
    },
    // 无视权限限制，获取所有文件
    getAllFilesByAnyAccess() {
      // getAllFiles({ enabled: true, }).then(res => {
      getAllFilesAnonymousAccess({ enabled: true, anonymousAccess: true }).then(res => {
        const data = res.content
        const _this = this
        data.forEach(function(v, index) {
          const file = { id: v.id, name: v.name }
          _this.files.push(file)
        })
        if (data.length > 0 && (this.$route.query.fileId === null || this.$route.query.fileId === undefined)) {
          // this.file = data[0].id
          this.fileSelected.id = data[0].id
          this.fileSelected.name = data[0].name
          this.realName = data[0].realName
          this.fileDesc = data[0].fileDesc
          // this.query.blurry = this.realName.slice(0, this.realName.indexOf('-'))
          // this.crud.toQuery(this.query.blurry)
        } else if (this.$route.query.fileId !== undefined) {
          // this.file = this.$route.query.fileId
          this.realName = this.$route.query.realName
          this.fileDesc = this.$route.query.fileDesc
          this.fileSelected.id = this.$route.query.fileId
          this.fileSelected.name = this.$route.query.name
        }
        if (this.fileSelected.id !== null && this.fileSelected.id !== '' && this.fileSelected.id !== undefined) {
          this.getFileById(this.fileSelected.id)
          this.getPreTrails(this.fileSelected.id)
        }
      })
    },
    getFileById(id) {
      getFileById(id).then(res => {
        // console.log('单个文件明细：' + JSON.stringify(res.fileDesc))
        // alert(JSON.stringify(res.bindDeptStr))
        this.bindDeptItems = []
        if (res.securityLevel === 'internal') {
          this.bindDeptItems = [res.fileDept.name + '『仅自己』']
        } else if (res.securityLevel === 'external') {
          if (res.bindDeptStr.length > 0) {
            this.bindDeptItems = res.bindDeptStr
          } else {
            this.bindDeptItems = ['全部']
          }
        }

        this.form = res
        // 设置部分显示内容
        this.realName = this.form.realName
        this.fileDesc = this.form.fileDesc
        // this.query.blurry = this.realName.slice(0, this.realName.indexOf('-'))
        // this.crud.toQuery(this.query.blurry)
        this.query.bindingId = id
        this.crud.toQuery(this.query.bindingId)
        this.params.bindingId = id
        // alert(JSON.stringify(this.query.blurry))
        this.form.fileLevel.name += '-' + this.form.fileLevel.description
        this.form.createBy = '由 ' + this.form.createBy + ' 在【 ' + this.form.createTime + '】创建'
        this.form.updateBy = '最新修改是由【' + this.form.updateBy + '】在【' + this.form.updateTime + '】提交'

        // 查询关联文件列表
        const ids = []
        if (res.bindFiles !== null && res.bindFiles.length > 0) {
          res.bindFiles.forEach(function(file, index) {
            ids.push(file.bindingStorageId)
          })
          // console.log(ids)
          this.getBindingFilesByIds(ids)
        } else {
          // alert("当前绑定文件为空")
          this.bindFileItems = []
        }
      })
    },
    // 获取文件待审批项
    getPreTrails(id) {
      // 获取版本时候，切换下拉框和绑定项等都应该重新调取此接口
      // 查询文件对应的审批任务列表
      this.params.version = ''
      this.versions = []
      this.params.bindingId = id
      // alert(JSON.stringify(id))
      getAppProcessListByFileId(id).then(res => {
        // 获取它的版本号:res.content
        // alert(JSON.stringify(res.content))
        if (res.content.length > 0) {
          const verList = []
          const i = res.content[res.content.length - 1]
          this.params.version = i.version
          res.content.forEach((data, index) => {
            verList.push(data.version)
          })
          this.versions = unique(verList)
          // alert(JSON.stringify(this.versions))
        }
        this.getApprovalProcessRecord(this.params)
      })
    },
    getBindingFilesByIds(ids) {
      // 获取参考文件集合
      getFilesByIds(ids).then(res => {
        this.bindFileItems = res
      })
    },
    // 改查询为编辑
    changeToEdit() {
      this.$refs.edit.style.color = 'rgb(24, 144, 255)'
      this.$refs.view.style.color = 'rgb(0,0,0)'
      this.$router.push(
        {
          path: '/fileManagement/file',
          query: {
            blurry: this.form.name,
            fileId: this.form.id
          }
        })
    },
    // todo切换文件，需要重新渲染form
    changeFile(value) {
      // alert(JSON.stringify(value))
      this.getFileById(value.id)
      this.params.bindingId = value.id
      this.getPreTrails(value.id)
      // this.getApprovalProcessRecord(this.params)
      this.activeNames = ['1']
    },
    refFile(item) {
      // alert(JSON.stringify(item))
      this.fileSelected.name = item.name
      this.getFileById(item.id)
      this.params.bindingId = item.id
      this.getPreTrails(item.id)
      // this.getApprovalProcessRecord(this.params)
      this.file = item.id
      this.activeNames = ['1']
    },
    handleChange(val) {
      console.log(val)
    },
    // 格式化审批清单表格信息内容
    // 格式化表格消息内容
    // 审批结果格式化
    approveResultFormat(row, col) {
      // alert(JSON.stringify(row))
      if (row.approvedResult === undefined) {
        return '待审批'
      } else {
        return row.approvedResult
      }
    },
    // 更新者--即实际审批人
    updateByFormat(row, col) {
      if (row.approvedResult === undefined) {
        return null
      } else {
        return row.updateBy
      }
    },
    // 格式化操作日志表格消息内容
    stateFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      if (!cellValue) return ''
      if (cellValue.length > 30) {
        // 最长固定显示4个字符
        return cellValue.slice(0, 30) + '...'
      }
      return cellValue
    },
    // 删除当前文件相关的日志
    confirmDelAll() {
      this.$confirm(`确认清空当前文件的操作日志吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        this.cond.bindingId = this.file
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.el-table > > > .alert-row {
  color: #606266 !important;
  background: #ffa4a4;
}

.el-table > > > .warning-row {
  color: #606266 !important;
  background: #fdf0e6;
}

.el-table > > > .success-row {
  color: #606266 !important;
  background: #f0f9eb;
}

::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}

.dialog > > > .is-disabled .el-input__inner {
  background-color: #ffffff;
  color: #606266;
}

.el-col-left {
  border-right: 1px solid #f00;
}

::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0 !important;
}

i:hover {
  color: #00a0e9;
}
</style>
