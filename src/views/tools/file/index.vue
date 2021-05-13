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
                :label="item.value"
                :value="item.value"
              />
            </el-select>
            <date-range-picker v-model="query.createTime" class="date-item"/>
            <el-select
              v-model="query.fileStatus"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 100px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in dict.file_status"
                :key="item.id"
                :label="item.value"
                :value="item.value"
              />
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
          width="678px"
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
              <el-input v-model="form.version" style="width: 400px;" disabled/>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="文件等级" prop="fileLevel.id" required>
                  <treeselect
                    v-model="form.fileLevel.id"
                    :options="fileLevels"
                    :load-options="loadLevels"
                    style="width: 178px"
                    placeholder="选择文件对应等级"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="form.fileLevel.id===24" :span="12">
                <el-form-item label="过期时间" prop="form.expirationTime">
                  <el-date-picker
                    v-model="form.expirationTime"
                    type="datetime"
                    :placeholder="new Date().toLocaleString()"
                    format="yyyy-MM-dd HH:mm"
                    style="width: 178px"
                    :picker-options="pickerOptions"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文件分类" prop="fileCategory.id" required>
                  <treeselect
                    v-model="form.fileCategory.id"
                    :options="fileCategories"
                    :load-options="loadCategories"
                    style="width: 178px"
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
                    style="width: 178px"
                    placeholder="选择文件所属部门"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文件类型" prop="fileType">
                  <el-select v-model="form.fileType" clearable placeholder="--none--" style="width: 178px">
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
                <el-form-item v-if="!crud.status.add" label="是否改版">
                  <el-radio-group v-model="form.isRevision" :disabled="form.id === user.id">
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
            <el-form-item v-if="!crud.status.add" label="文件状态" required>
              <el-radio-group v-model="form.fileStatus" :disabled="form.id === user.id">
                <el-radio
                  v-for="item in dict.file_status"
                  :key="item.id"
                  :label="item.value"
                >{{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="文件明细" prop="fileDetails">
              <router-link
                :to="{path: '/sys-tools/filedetail',
                      query: {
                        fileId: form.id ,
                        realName:form.realName
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
                  + '&securityLevel=' + form.securityLevel + '&expirationTime=' + form.expirationTime"
              >
                <div class="eladmin-upload"><i class="el-icon-upload"/> 添加文件</div>
                <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
              </el-upload>
            </el-form-item>
            <!-- 关联文件 -->
            <el-form-item v-if="!crud.status.add" label="关联文件" prop="bindFiles">
              <el-select
                v-model="bindFileDatas"
                style="width: 400px"
                multiple
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
            <el-form-item v-if="!crud.status.add" label="关联文件列表" prop="bindFiles">
              <!--              <ol style="padding-inline-start: 15px;margin-block-start: 0;">
                              <li v-for="item in bindFileItems" style="text-decoration: underline;">
                                <router-link
                                  :to="{path: '/sys-tools/filedetail',
                                        query: {
                                          fileId: item.id ,
                                          realName:item.realName
                                        }
                                  }"
                                >{{ item.name }}
                                </router-link>
                              </li>
                            </ol>-->
              <div v-for="(item,index) in bindFileItems" :key="item.id" style="margin-left: 10px;">
                <el-button type="text">
                  <router-link
                    :to="{path: '/sys-tools/filedetail',
                          query: {
                            fileId: item.id ,
                            realName:item.realName
                          }
                    }"
                  >
                    {{ '[' + (index + 1) + '] ' + item.name + ',' + item.version }}
                  </router-link>
                </el-button>
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button v-if="crud.status.add" :loading="loading" type="primary" @click="upload">确认</el-button>
            <el-button v-else :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table
          ref="table"
          v-loading="crud.loading"
          :data="crud.data"
          style="width: 100%;"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column :selectable="checkboxT" type="selection" width="55"/>
          <el-table-column prop="name" label="文件名">
            <template slot-scope="scope">
              <el-popover
                :content="'file/' + scope.row.type + '/' + scope.row.realName"
                placement="top-start"
                title="路径"
                width="200"
                trigger="hover"
              >
                <a
                  slot="reference"
                  :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
                  class="el-link--primary"
                  style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                  target="_blank"
                >
                  {{ scope.row.name }}
                </a>
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
          <el-table-column prop="fileType" label="文件类型" width="100"/>
          <!--          <el-table-column prop="createTime" label="创建日期" width="180" />-->
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
import { getAllFiles, getOtherFiles, getFilesByIds } from '@/api/tools/localStorage'

let bindingFiles = []
const defaultForm = {
  id: null,
  name: '',
  realName: '',
  fileStatus: 'waitingfor',
  fileType: '--none--',
  securityLevel: 'internal',
  isRevision: 'false',
  fileLevel: { id: null },
  expirationTime: '9999-12-31 00:00:00.152',
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
  dicts: ['file_status', 'common_status', 'file_type', 'file_security'],
  data() {
    return {
      delAllLoading: false,
      loading: false,
      height: document.documentElement.clientHeight - 180 + 'px;',
      fileLevelName: '',
      fileCategoryName: '',
      fileCategory: { id: null },
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
      'fileUploadApi'
    ])
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
  },
  methods: {
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
    // 新增与编辑前做的操作
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
    // 初始化编辑时候的关联文件
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.getOtherFiles(this.form.id)
      this.bindFileDatas = []
      bindingFiles = []
      const _this = this
      form.bindFiles.forEach(function(file, index) {
        _this.bindFileDatas.push(file.bindingStorageId)
        const fl = { storageId: _this.fileId, bindingStorageId: file.id }
        bindingFiles.push(fl)
      })
      if (_this.bindFileDatas.length > 0) {
        this.getFilesByIds(_this.bindFileDatas)
      }
      // alert('初始化编辑的内容：' + JSON.stringify(_this.bindFileDatas))
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      /* if (!crud.form.dept.id) {
        this.$message({
          message: '部门不能为空',
          type: 'warning'
        })
        return false
      } else if (this.jobDatas.length === 0) {
        this.$message({
          message: '岗位不能为空',
          type: 'warning'
        })
        return false
      } */
      crud.form.bindFiles = bindingFiles
      return true
    },
    // 上传文件
    upload() {
      this.$refs.upload.submit()
    },
    beforeUpload: function(file) {
      if (!this.form.fileLevel.id) {
        this.$message({
          message: '文件等级必须设置',
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
    handleSuccess(response, file, fileList) {
      this.crud.notify('上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$refs.upload.clearFiles()
      this.crud.status.add = CRUD.STATUS.NORMAL
      this.crud.resetForm()
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

    getOtherFiles(fileId) {
      getOtherFiles(fileId).then(res => {
        const data = res.content
        this.bindFiles = data
      })
    },
    getFilesByIds(ids) {
      getFilesByIds(ids).then(res => {
        console.log('绑定的数据集合:' + res)
        this.bindFileItems = res
      })
    },
    clickBindFile(id) {
      alert(id)
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

.vue-treeselect__input {

}
</style>
