<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边文件级别-->
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="fileLevelName"
            clearable
            size="small"
            placeholder="输入文件等级名称搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
            @input="getFileLevelDatas"
          />
        </div>
        <el-tree
          :data="fileLevelDatas"
          :load="getFileLevelDatas"
          :props="defaultProps"
          :expand-on-click-node="false"
          lazy
          @node-click="handleLevelNodeClick"
        />
      </el-col>
      <!--文件数据-->
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.blurry"
              clearable
              size="small"
              placeholder="输入名称、类型、创建者等搜索"
              style="width: 140px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
              @input="inputChange($event)"
            />
            <!-- 文件分类筛选，需要更改为树表筛选 -->
            <treeselect
              v-model="query.fileCategoryId"
              :options="fileCategories"
              :load-options="loadCategories"
              class="newTree-item"
              placeholder="选择文件分类"
              @input="crud.toQuery"
            />
            <!-- 文件所属部门筛选，需要更改为树表筛选 -->
            <treeselect
              v-model="query.deptId"
              :options="fileDepts"
              :load-options="loadFileDepts"
              class="newTree-item"
              placeholder="选择所属部门"
              @input="crud.toQuery"
            />
            <!-- 文件类型筛选 -->
            <el-select
              v-model="query.fileType"
              clearable
              size="small"
              placeholder="文件类型"
              class="filter-item"
              style="width: 120px"
              @change="crud.toQuery"
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
            <date-range-picker
              v-model="query.createTime"
              @change="crud.toQuery"
              @input="dateTimeChange($event)"
              class="date-item"
            />
            <el-select
              v-model="query.fileStatus"
              clearable
              size="small"
              placeholder="审批状态"
              class="filter-item"
              style="width: 100px"
              @change="crud.toQuery"
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
            <rrOperation/>
          </div>
          <crudOperation show="" :permission="permission"/>
        </div>
        <!--表单渲染-->
        <el-dialog
          append-to-body
          :close-on-click-modal="false"
          :before-close="crud.cancelCU"
          :visible.sync="crud.status.cu > 0"
          :title="crud.status.add ? '文件上传' : '编辑文件'"
          width="728px"
        >
          <el-form ref="form" :model="form" size="small" label-width="120px">
            <el-form-item label="文件名称">
              <el-input v-model="form.name" style="width: 400px;"/>
            </el-form-item>
            <!-- 编辑文件 -->
            <!--            <el-form-item v-if="!crud.status.add" label="真实名称">
                          <el-input v-model="form.realName" style="width: 400px;" />
                        </el-form-item>-->
            <el-form-item v-if="!crud.status.add" label="文件版本">
              <el-input
                v-model="form.version"
                style="width: 400px;color:#fff;!important;background-color: #fff;!important;"
                disabled
              />
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="文件等级" prop="fileLevel.id" required>
                  <treeselect
                    v-model="form.fileLevel.id"
                    :options="fileLevels"
                    :load-options="loadLevels"
                    style="width: 190px"
                    placeholder="选择文件对应等级"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文件分类" prop="fileCategory.id" required>
                  <treeselect
                    v-model="form.fileCategory.id"
                    :options="fileCategories"
                    :load-options="loadCategories"
                    style="width: 190px"
                    placeholder="选择文件所属分类"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属部门" prop="fileDept.id" required>
                  <treeselect
                    v-model="form.fileDept.id"
                    :options="fileDepts"
                    :load-options="loadFileDepts"
                    style="width: 190px"
                    placeholder="选择文件所属部门"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文件类型" prop="fileType">
                  <el-select v-model="form.fileType" clearable placeholder="--none--" style="width: 190px">
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
              <el-col :span="12">
                <el-form-item label="保密等级" required>
                  <el-radio-group v-model="form.securityLevel" :disabled="form.id === user.id">
                    <el-radio
                      v-for="item in dict.file_security"
                      :key="item.id"
                      :label="item.value"
                    >{{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文件状态" prop="fileStatus" required>
                  <el-select
                    v-model="form.fileStatus"
                    style="background: none;"
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
              <el-col v-if="form.fileStatus === 'temp'" :span="12">
                <el-form-item label="过期时间" prop="form.expirationTime" required>
                  <el-date-picker
                    v-model="form.expirationTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    style="width: 190px"
                    :picker-options="pickerOptions"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="!crud.status.add" label="审批状态">
                  <el-select
                    v-model="form.approvalStatus"
                    style="background: none;"
                    disabled
                  >
                    <el-option
                      v-for="item in dict.approval_status"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="!crud.status.add">
                  <span slot="label">
                <span class="span-box">
                  <span>是否改版</span>
                   <el-tooltip placement="top" effect="light">
                     <div slot="content">Choose 'true' ,you can Upgrade version via uploading new coverFile.<br/>切换到”是”可以上传覆盖文件进而发起升版请求.</div>
                  <i class="el-icon-question"></i>
                   </el-tooltip>
                </span>
              </span>
                  <el-radio-group v-model="form.isRevision" @change="agreeChange">
                    <el-radio
                      v-for="item in dict.common_status"
                      :key="item.id"
                      :label="item.value"
                    >{{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <!--   二次上传文件   -->
            <el-form-item v-if="form.isRevision==='true'" label="上传覆盖文件">
              <el-upload
                ref="coverUpload"
                :limit="1"
                :before-upload="beforeCover"
                :auto-upload="false"
                :headers="headers"
                :on-success="coverSuccess"
                :on-error="handleError"
                :action="fileCoverUploadApi + '?id=' + form.id "
              >
                <div class="eladmin-upload"><i class="el-icon-upload"/> 添加文件</div>
                <div slot="tip" class="el-upload__tip"><i style="color: #ff0000">*</i>文件覆盖操作完成审批后改版才能生效，请做好备份并确认新文件正确性
                </div>
              </el-upload>
              <el-button :loading="loading" type="text" @click="cancelCover">取消上传</el-button>
              <el-button :loading="loading" type="primary" @click="cover">确认覆盖</el-button>
            </el-form-item>
            <el-form-item label="文件概览" prop="fileDetails">
              <router-link
                :to="{path: '/sys-tools/filedetail',
                      query: {
                        fileId: form.id ,
                        name: form.name,
                        realName:form.realName,
                        fileDesc:form.fileDesc
                      }
                }"
              >
                <el-link href="/sys-tools/filedetail" icon="el-icon-view">查看</el-link>
              </router-link>
            </el-form-item>
            <!--   上传文件   -->
            <el-form-item v-if="crud.status.add" label="上传">
              <el-upload
                ref="upload"
                :limit="1"
                :before-upload="beforeUpload"
                :auto-upload="false"
                :headers="headers"
                :on-success="handleSuccess"
                :on-error="handleError"
                :action="fileUploadApi + '?name=' + form.name + '&fileLevelId=' + form.fileLevel.id+ '&fileCategoryId=' + form.fileCategory.id
                  + '&deptId=' + form.fileDept.id+ '&fileStatus=' + form.fileStatus + '&fileType=' + form.fileType
                  + '&securityLevel=' + form.securityLevel + '&expirationTime=' + form.expirationTime + '&fileDesc=' + form.fileDesc"
              >
                <div class="eladmin-upload"><i class="el-icon-upload"/> Add file 添加文件</div>
                <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
              </el-upload>
            </el-form-item>
            <!-- 关联文件 -->
            <el-row>
              <el-col>
                <el-form-item label="文件描述" prop="fileDesc">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 10}"
                    placeholder="请输入文件内容描述"
                    v-model="form.fileDesc"
                    style="width: 400px;"
                    @input="changeDescInput($event)"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 关联文件 -->
            <el-form-item v-if="!crud.status.add" label="参考文件" prop="bindFiles">
              <el-select
                v-model="bindFileDatas"
                style="width: 400px"
                multiple
                filterable
                placeholder="请选择"
                @remove-tag="deleteTag"
                @change="changeBindFile"
              >
                <el-option
                  v-for="item in bindFiles"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="bindFileDatas.length>0" label="参考文件列表" prop="bindFiles">
              <div v-for="(item,index) in bindFileItems" :key="item.id" style="margin-left: 5px;">
                <!--                <el-button type="text">-->
                <router-link
                  style="text-decoration:underline;"
                  :to="{path: '/sys-tools/filedetail',
                          query: {
                            fileId: item.id ,
                            name: item.name,
                            realName:item.realName,
                            fileDesc:item.fileDesc
                          }
                    }"
                >
                  {{ '[' + (index + 1) + '] ' + item.name + ',' + item.version }}
                </router-link>
                <!--                </el-button>-->
              </div>
            </el-form-item>
            <el-form-item v-if="!crud.status.add" label="变更说明" prop="changeDesc" required>
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 30}"
                placeholder="请输入变更说明"
                v-model="form.changeDesc"
                style="width: 400px;"
                @input="changeDescInput($event)"
              >
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-dialog
              title="提示"
              :visible.sync="centerDialogVisible"
              width="30%"
              center
              :modal=false
              :modal-append-to-body=false
              top="20%"
            >
              <span>检测到有新的改版操作，不保存相关修改吗？</span>
              <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">再想想</el-button>
              <el-button type="primary" @click="rollBackCover">放弃修改</el-button>
              </span>
            </el-dialog>
            <el-button type="text" @click="cancelOperation">取消</el-button>
            <el-button v-if="crud.status.add" :loading="loading" type="primary" @click="upload">确认</el-button>
            <el-button v-else :loading="crud.status.cu === 2" type="primary" @click="submitConfirm">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table
          ref="table"
          v-loading="crud.loading"
          :data="crud.data"
          style="width: 100%;"
          :row-key="getRowKeys"
          @selection-change="crud.selectionChangeHandler"
          @row-dblclick="dbSelected"
          @row-click="stepsListRowClick"
        >
          <el-table-column :selectable="checkboxT" :reserve-selection="true" type="selection" width="55"/>
          <el-table-column prop="name" label="文件名">
            <template slot-scope="scope">
              <el-popover
                :content="'file/' + scope.row.type + '/' + scope.row.realName"
                placement="top-start"
                title="路径"
                width="200"
                trigger="hover"
              >
                <!--可下载文件-->
                <!--                <a
                                  slot="reference"
                                  :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
                                  class="el-link&#45;&#45;primary"
                                  style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                                  target="_blank"
                                  :download="scope.row.realName"
                                >
                                  {{ scope.row.name }}
                                </a>-->
                <!--不下载文件-->
                <a
                  slot="reference"
                  class="el-link--primary"
                  style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                  target="_blank"
                  :download="scope.row.realName"
                >
                  {{ scope.row.name }}
                </a>
                <!--自定义指令下载文件（包含txt、jpg等，但chrome浏览器不支持）-->
                <!--                <span
                                  slot="reference"
                                  v-download="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
                                >
                                                  {{ scope.row.name }}
                                                </span>-->
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="预览图">
            <template slot-scope="{row}">
              <el-image
                :src=" baseApi + '/file/' + row.type + '/' + row.realName"
                :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.realName]"
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
          <el-table-column prop="suffix" label="文件类型"/>
          <el-table-column prop="type" label="类别"/>
          <el-table-column prop="size" label="大小"/>
          <el-table-column prop="createBy" label="创建者"/>
          <el-table-column prop="version" label="版本号"/>
          <el-table-column :show-overflow-tooltip="true" prop="fileLevel" label="文件等级">
            <template slot-scope="scope">
              <div>{{ scope.row.fileLevel.name }}</div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="fileCategory" label="文件分类">
            <template slot-scope="scope">
              <div>{{ scope.row.fileCategory.name }}</div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="fileDept" label="所属部门">
            <template slot-scope="scope">
              <div>{{ scope.row.fileDept.name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="fileStatus" label="文件状态" width="100"/>
          <el-table-column prop="approvalStatus" label="审批状态" width="100"/>
          <el-table-column prop="fileType" label="文件类型" width="100"/>
          <el-table-column prop="createTime" label="创建日期" width="180" sortable/>
          <el-table-column prop="updateTime" label="最近修改" width="180"/>
          <el-table-column
            v-if="checkPer(['admin','storage:edit','storage:del'])"
            label="操作"
            width="115"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <udOperation
                :data="scope.row"
                :permission="permission"
                :disabled-dle="scope.row.id === user.id"
              />
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudFile from '@/api/tools/localStorage'
import { getFileLevels, getFileLevelSuperior } from '@/api/tools/filelevel'
import { getFileCategories, getFileCategorySuperior } from '@/api/tools/filecategory'
import { getDepts, getDeptSuperior } from '@/api/system/dept'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { getToken } from '@/utils/auth'
import { getAllFiles, getOtherFiles, getFilesByIds, cancelCover, rollbackCover } from '@/api/tools/localStorage'

let bindingFiles = []
const defaultForm = {
  id: null,
  name: '',
  realName: '',
  fileStatus: 'release',
  approvalStatus: '',
  fileType: '--none--',
  securityLevel: 'internal',
  isRevision: 'false',
  fileLevel: { id: null },
  expirationTime: '9999-12-31 00:00:00.152',
  changeDesc: '',
  fileDesc: null,
  fileCategory: { id: null },
  fileDept: { id: null },
  bindFiles: []
}
export default {
  name: 'File',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker },
  cruds() {
    return CRUD({ title: '文件', url: 'api/localStorage', crudMethod: { ...crudFile } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['file_status', 'approval_status', 'common_status', 'file_type', 'file_security'],
  data() {
    return {
      editFormChanged: 0, // 是否修改标识
      preForm: this.form,
      centerDialogVisible: false,
      count: 0,
      sum: 0,
      coverFileCount: 0,
      rollbackData: {
        lastModifiedDate: null, // 抓取开始编辑的事件以便版本回滚
        approvalStatus: null,
        storageId: null
      },
      fileType: null, // 文件类型，监听使用
      fileStatus: null, // 文件状态，监听使用
      approvalStatus: null, // 审批状态，监听使用
      name: null, // 文件名称，监听使用
      fileDept: { id: null }, // 所属部门，监听使用
      fileLevel: { id: null }, // 文件等级，监听使用
      bindDatas: [], // 关联文件，监听使用
      fileDesc: null, // 文件描述，监听使用
      securityLevel: null, // 安全等级
      delAllLoading: false,
      loading: false,
      height: document.documentElement.clientHeight - 180 + 'px;',
      fileLevelName: '',
      fileCategoryName: '',
      fileCategory: { id: null }, // 文件分类，监听使用
      fileLevels: [],
      fileDepts: [],
      fileCategories: [],
      fileLevelDatas: [],
      fileCategoryDatas: [],
      fileTypes: [],
      bindFileDatas: [], // 关联文件列表
      bindFiles: [],
      bindFileItems: [],
      fileId: null,
      pickerOptions: {
        shortcuts: [{
          text: '一天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', new Date())
          }
        }, {
          text: '三天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 3)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '两周',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 14)
            picker.$emit('pick', date)
          }
        }, {
          text: '三十天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', date)
          }
        }]
      },
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      headers: { 'Authorization': getToken() },
      permission: {
        add: ['admin', 'storage:add'],
        edit: ['admin', 'storage:edit'],
        del: ['admin', 'storage:del']
      },
      enabledTypeOptions: [
        { key: 'approved', display_name: '已审批' },
        { key: 'waitingfor', display_name: '待审批' },
        { key: 'approve', display_name: '审批' },
        { key: 'obsoleted', display_name: '已作废' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'fileUploadApi',
      'fileCoverUploadApi'
    ])
  },
  watch: {
    count: {
      handler(val, oldVal) {
        if (val !== oldVal && val !== 1) {
          this.sum++
        }
      },
      deep: true
    }
  },
  created() {
    this.crud.msg.add = '新增成功，默认密码：123456'
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
    this.getFileCategoryDatas()
    this.getFileCategories()
    this.getFileDepts()
    // 详情返回列表中某一列处于命中状态
    if (this.$route.query.fileName !== undefined) {
      this.query.blurry = this.$route.query.fileName
      this.crud.toQuery()
    }
    if (this.$route.query.fileType !== undefined) {
      this.query.fileType = this.$route.query.fileType
      this.crud.toQuery()
    }
    if (this.$route.query.deptId !== undefined) {
      this.query.deptId = this.$route.query.deptId
      this.crud.toQuery()
    }
    if (this.$route.query.createTime !== undefined) {
      // alert(this.$route.query.createTime)
      const startTime = this.$route.query.createTime + ' 00:00:00'
      const endTime = this.$route.query.createTime + ' 23:59:59'
      this.query.createTime = [startTime, endTime]
      this.crud.toQuery()
    }
    if (this.$route.query.fileLevelName !== undefined) {
      this.fileLevelName = this.$route.query.fileLevelName
      const data = { id: null }
      data.id = this.$route.query.fileLevelId
      // 展开对应的文件级别
      this.handleLevelNodeClick(data)
    }
  },
  methods: {
    submitConfirm() {
      // 发起改版但未上传覆盖文件
      if (this.form.isRevision === 'true' && this.coverFileCount < 1) {
        this.$message({
          message: 'Revision needs new file for this !改版须提交新文件或取消改版',
          type: 'warning'
        })
        return false
      }
      // 如果啥都没改动，则无需保存
      this.watchChangeHandler(this.fileCategory.id, this.form.fileCategory.id) // 文件分类，监听使用
      this.watchChangeHandler(this.fileType, this.form.fileType) // 文件类型，监听使用
      this.watchChangeHandler(this.fileStatus, this.form.fileStatus) // 文件状态，监听使用
      this.watchChangeHandler(this.approvalStatus, this.form.approvalStatus) // 文件审批状态，监听使用
      this.watchChangeHandler(this.name, this.form.name) // 文件名称，监听使用
      this.watchChangeHandler(this.fileDept.id, this.form.fileDept.id) // 所属部门，监听使用
      this.watchChangeHandler(this.fileLevel.id, this.form.fileLevel.id) // 文件等级，监听使用
      this.watchChangeHandler(this.bindDatas, this.bindFileDatas) // 关联文件，监听使用
      this.watchChangeHandler(this.fileDesc, this.form.fileDesc) // 文件描述，监听使用
      this.watchChangeHandler(this.securityLevel, this.form.securityLevel) // 安全等级，监听使用

      if (this.editFormChanged === 0) {
        this.$message({
          message: 'No changes found, no need to save!未发生改动，无需保存',
          type: 'warning'
        })
        return false
      }
      this.crud.submitCU()
      if (this.$route.query.fileName !== undefined) {
        this.query.blurry = ''
        // this.crud.toQuery()
      }
    },
    getRowKeys(row) {
      return row.id
    },
    // 监控模糊查询输入框变化，强制刷新
    inputChange() {
      this.$forceUpdate()
    },
    // 监控变更记录输入框变化，强制刷新
    changeDescInput() {
      this.$forceUpdate()
    },
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
    },
    // 获取左侧文件级别数据
    getFileLevelDatas(node, resolve) {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        getFileLevels(params).then(res => {
          if (resolve) {
            resolve(res.content)
          } else {
            this.fileLevelDatas = res.content
          }
        })
      }, 100)
    },
    // 获取左侧文件分类数据
    getFileCategoryDatas(node, resolve) {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        getFileCategories(params).then(res => {
          if (resolve) {
            resolve(res.content)
          } else {
            this.fileCategoryDatas = res.content
          }
        })
      }, 100)
    },
    // 变更绑定项
    changeBindFile(value) {
      // alert(JSON.stringify(value))
      bindingFiles = []
      const _this = this
      value.forEach(function(data, index) {
        const file = { storageId: _this.fileId, bindingStorageId: data }
        bindingFiles.push(file)
      })
      this.getFilesByIds(value)
      // alert('编辑添加的内容：' + JSON.stringify(bindingFiles))
    },
    // 删除绑定项
    deleteTag(value) {
      bindingFiles.forEach(function(data, index) {
        if (data.id === value) {
          bindingFiles.splice(index, value)
        }
      })
      if (bindingFiles.length === 0) {
        this.bindFileItems = []
      } else {
        // 重新抓取绑定文件
        const data = []
        for (const i in bindingFiles) {
          data.push(bindingFiles[i].bindingStorageId)
        }
        // alert(JSON.stringify(data))
        this.getFilesByIds(data)
      }
      // alert(JSON.stringify(bindingFiles))
    },
    // 取消前检测是否存在覆盖文件的编辑操作
    cancelOperation() {
      // coverFileCount监控是否发生了覆盖事件
      if (this.coverFileCount > 0) {
        this.centerDialogVisible = true
      } else {
        this.crud.cancelCU()
      }
    },
    // 回滚文件覆盖操作，状态返回到编辑前的状态和待审批的数据
    rollBackCover() {
      // 删除之后所有的数据，并根据时间抓取编辑前的数据作为恢复依据
      this.rollbackData.storageId = this.form.id
      // alert(JSON.stringify(this.rollbackData))
      rollbackCover(this.rollbackData).then(res => {
        this.crud.notify('rollback cover Success! 撤销覆盖操作成功！', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.centerDialogVisible = false
      })
      this.crud.cancelCU()
    },
    // 新增与编辑之后做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.id == null) {
        this.getFileLevels()
        this.getFileCategories()
        this.getFileDepts()
        this.getAllFiles()
      } else {
        this.getSupFileLevels(form.fileLevel.id)
        this.getSupFileCategories(form.fileCategory.id)
        this.getSupFileDepts(form.fileDept.id)
        this.getOtherFiles(form.id)
        this.fileId = form.id
      }
      // this.getRoleLevel()
      form.isRevision = form.isRevision.toString()
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.bindFileDatas = []
    },
    // 初始化编辑时候的关联文件并初始化版本升级操作计数
    [CRUD.HOOK.beforeToEdit](crud, form) {
      // 编辑前置空变更描述
      this.form.changeDesc = ''
      // 编辑前存储编辑前的可变的属性的数据信息
      this.fileCategory.id = form.fileCategory.id // 文件分类，监听使用
      this.fileType = form.fileType // 文件类型，监听使用
      this.fileStatus = form.fileStatus // 文件状态，监听使用
      this.approvalStatus = form.approvalStatus // 文件审批状态，监听使用
      this.name = form.name // 文件名称，监听使用
      this.fileDept.id = form.fileDept.id // 所属部门，监听使用
      this.fileLevel.id = form.fileLevel.id // 文件等级，监听使用
      this.fileDesc = form.fileDesc
      this.securityLevel = form.securityLevel

      // 抓取当前时间+是否改版，以作回滚用
      this.rollbackData.lastModifiedDate = new Date()
      this.rollbackData.approvalStatus = form.approvalStatus

      this.getOtherFiles(this.form.id)
      this.bindFileDatas = []
      bindingFiles = []
      const _this = this
      form.bindFiles.forEach(function(file, index) {
        _this.bindFileDatas.push(file.bindingStorageId)
        const fl = { storageId: _this.fileId, bindingStorageId: file.bindingStorageId }
        bindingFiles.push(fl)
      })
      // alert("提交的绑定数据："+JSON.stringify(_this.bindFileDatas))
      if (_this.bindFileDatas.length > 0) {
        this.getFilesByIds(_this.bindFileDatas)
      }
      // console.log('绑定项的值来源：' + JSON.stringify(form.bindFiles))
      // console.log('初始化编辑的内容：' + JSON.stringify(_this.bindFileDatas))
      _this.bindDatas = _this.bindFileDatas // 关联文件，监听使用
      if (this.form.approvalStatus === 'waitingfor') {
        this.count = 1
      }
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (crud.form.isRevision === 'true' && this.$refs.coverUpload.uploadFiles.length === 0) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: 'Revision needs new file for this!' + ' <br/> ' + '改版须提交新文件或取消改版',
          type: 'warning'
        })
        return false
      }
      crud.form.bindFiles = bindingFiles
      return true
    },
    // 上传文件
    upload() {
      this.$refs.upload.submit()
    },
    cancelCover() {
      this.form.isRevision = 'false'
    },
    // 上传覆盖文件
    async cover() {
      this.$refs.coverUpload.submit()
    },
    beforeUpload: function(file) {
      if (!this.form.fileLevel.id) {
        this.$message({
          message: '文件等级必须设置',
          type: 'warning'
        })
        return false
      }
      if (!this.form.fileDept.id) {
        this.$message({
          message: '文件所属部门必须设置',
          type: 'warning'
        })
        return false
      }
      if (!this.form.fileCategory.id) {
        this.$message({
          message: '文件所属分类必须设置',
          type: 'warning'
        })
        return false
      }
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      this.form.name = file.name
      return isLt2M
    },
    // 改版切换时候判断是否已有审批
    agreeChange(val) {
      if (this.form.approvalStatus === 'waitingfor' && val === 'true') {
        this.$confirm('Replaced file existed! Really cancel the last submission?检测已有覆盖文件待审批，是否确认撤销上一次的提交？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 确定撤销',
          cancelButtonText: 'NO 放弃撤销'
        })
          .then(() => {
            cancelCover(this.form.id).then(res => {
              this.$message({
                type: 'info',
                message: 'Reverse 确定撤销'
              })
              this.coverFileCount++
              this.form.isRevision = 'false'
              this.form.approvalStatus = 'approved'
              this.form.changeDesc = '取消改版'
            })
          })
          .catch(action => {
            this.$message({
              type: 'info',
              message: action === 'cancel'
                ? 'Save Cover 放弃撤销'
                : 'Reconsider 暂停留本页面，考虑一下'
            })
          })
        this.form.isRevision = 'false'
      }
    },
    beforeCover: function(file) {
      if (!file) {
        this.$message({
          message: '文件必须存在',
          type: 'warning'
        })
        return false
      }
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      // this.form.name = file.name
      return isLt2M
    },
    handleSuccess(response, file, fileList) {
      this.crud.notify('Upload Success! 上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$refs.upload.clearFiles()
      this.crud.status.add = CRUD.STATUS.NORMAL
      this.crud.resetForm()
      this.crud.toQuery()
    },
    // 覆盖成功
    coverSuccess(response, file, fileList) {
      this.coverFileCount++
      this.crud.notify('CoverFile Upload Success! 待审批覆盖文件上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      if (this.coverFileCount > 1) {
        this.form.changeDesc = '撤销上一次覆盖文件后' + '文件再次改版，新文件替代原文件,待审批'
      } else {
        this.form.changeDesc = '新文件替代原文件,文件生版本，待审批'
      }
      this.form.approvalStatus = 'waitingfor'
      this.form.isRevision = 'false'
      this.crud.toQuery()
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
    // 获取弹窗内可绑定的文件数据
    getAllFiles() {
      getAllFiles().then(res => {
        this.bindFiles = res.content
      }).catch(() => {
      })
    },
    // 填充文件等级数据
    getFileLevels() {
      getFileLevels({ enabled: true }).then(res => {
        this.fileLevels = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    // 填充文件分类数据
    getFileCategories() {
      getFileCategories({ enabled: true }).then(res => {
        this.fileCategories = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    // 填充文件所属部门数据
    getFileDepts() {
      getDepts({ enabled: true }).then(res => {
        this.fileDepts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupFileLevels(levelId) {
      getFileLevelSuperior(levelId).then(res => {
        const data = res.content
        this.buildLevels(data)
        this.fileLevels = data
      })
    },
    buildLevels(data) {
      data.forEach(data => {
        if (data.children) {
          this.buildLevels(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    getSupFileCategories(cateId) {
      getFileCategorySuperior(cateId).then(res => {
        const data = res.content
        this.buildCategories(data)
        this.fileCategories = data
      })
    },
    buildCategories(data) {
      data.forEach(data => {
        if (data.children) {
          this.buildCategories(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    getSupFileDepts(deptId) {
      getDeptSuperior(deptId).then(res => {
        const data = res.content
        this.buildDepts(data)
        this.fileDepts = data
      })
    },
    buildDepts(data) {
      data.forEach(data => {
        if (data.children) {
          this.buildDepts(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    // 查询可绑定项
    getOtherFiles(fileId) {
      getOtherFiles(fileId).then(res => {
        const data = res.content
        this.bindFiles = data
        // alert('编辑前看到的绑定数据标识集合：' + JSON.stringify(this.bindFiles))
      })
    },
    getFilesByIds(ids) {
      this.bindFileItems = []
      getFilesByIds(ids).then(res => {
        // console.log('绑定的数据集合:' + JSON.stringify(res))
        this.bindFileItems = res
      }).then()
    },
    // 获取弹窗内文件等级数据
    loadLevels({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getFileLevels({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 获取弹窗内文件分类数据
    loadCategories({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getFileCategories({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 获取弹窗内文件所属部门数据
    loadFileDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 切换文件等级
    handleLevelNodeClick(data) {
      if (data.pid === 0) {
        this.query.fileLevelId = null
      } else {
        this.query.fileLevelId = data.id
      }
      // alert(this.query.fileLevelId)
      this.crud.toQuery()
    },
    // 切换文件分类
    handleCategoryNodeClick(data) {
      if (data.pid === 0) {
        this.query.fileCategoryId = null
      } else {
        this.query.fileCategoryId = data.id
      }
      this.crud.toQuery()
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.file_status[val] + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudFile.edit(data).then(res => {
          this.crud.notify(this.dict.label.file_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 某些列禁止改动
    checkboxT(row, rowIndex) {
      // todo 当前的user(除管理员外)与文件创建部门（大含小）不符合，只能看不能修改
      return row.fileLevel.levelSort !== 1
    },
    // 单击时候选中某列
    stepsListRowClick(row) {
      console.log(JSON.stringify(row))
      this.$refs.table.toggleRowSelection(row)
    },
    // 双击选中的行列
    dbSelected(row) {
      // alert(JSON.stringify(row))
      this.checkboxT(row)
      this.$router.push(
        {
          path: '/sys-tools/filedetail',
          query: {
            fileId: row.id,
            name: row.name,
            realName: row.realName,
            fileDesc: row.fileDesc
          }
        })
    },
    watchChangeHandler(val, newVal) {
      if (val !== newVal) {
        this.editFormChanged++
        // this.form.changeDesc += '改动' + this.editFormChanged + ':"' + val + '"->' + '"' + newVal + '"'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 29px;
  line-height: 29px;
  font-size: small;
}

a.router-link-exact-active {
  background-color: orange;
  color: #fff;
}

.vue-treeselect__input {

}
</style>
