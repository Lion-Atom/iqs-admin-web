<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
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
          @node-click="handleNodeClick"
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
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <date-range-picker v-model="query.createTime" class="date-item" />
            <el-select
              v-model="query.fileStatus"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 90px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in dict.file_status"
                :key="item.id"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
            // todo 文件分类筛选
            <rrOperation />
          </div>
          <crudOperation show="" :permission="permission" />
        </div>
        <!--todo 表单渲染-->
        <el-dialog
          append-to-body
          :close-on-click-modal="false"
          :before-close="crud.cancelCU"
          :visible.sync="crud.status.cu > 0"
          :title="crud.status.add ? '文件上传' : '编辑文件'"
          width="500px"
        >
          <el-form ref="form" :model="form" size="small" label-width="80px">
            <el-form-item label="文件名">
              <el-input v-model="form.name" style="width: 370px;" />
            </el-form-item>
            <!-- 编辑文件 -->
            <el-form-item v-if="!crud.status.add" label="名称">
              <el-input v-model="form.realName" style="width: 370px;" />
            </el-form-item>
            <el-form-item v-if="!crud.status.add" label="版本号">
              <el-input v-model="form.version" style="width: 370px;" disabled />
            </el-form-item>
            <el-form-item v-if="!crud.status.add" label="是否改版">
              <el-radio-group v-model="form.isRevision" :disabled="form.id === user.id">
                <el-radio
                  v-for="item in dict.common_status"
                  :key="item.id"
                  :label="item.value"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="文件等级" prop="fileLevel.id">
              <treeselect
                v-model="form.fileLevel.id"
                :options="fileLevels"
                :load-options="loadLevels"
                style="width: 178px"
                placeholder="选择文件对应等级"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="form.fileStatus" :disabled="form.id === user.id">
                <el-radio
                  v-for="item in dict.file_status"
                  :key="item.id"
                  :label="item.value"
                >{{ item.label }}
                </el-radio>
              </el-radio-group>
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
                :action="fileUploadApi + '?name=' + form.name + '&fileLevelId=' + form.fileLevel.id+ '&fileStatus=' + form.fileStatus"
              >
                <div class="eladmin-upload"><i class="el-icon-upload" /> 添加文件</div>
                <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
              </el-upload>
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
          <el-table-column :selectable="checkboxT" type="selection" width="55" />
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
                  <i class="el-icon-document" />
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="suffix" label="文件类型" />
          <el-table-column prop="type" label="类别" />
          <el-table-column prop="size" label="大小" />
          <el-table-column prop="createBy" label="创建者" />
          <el-table-column prop="version" label="版本号" />
          <el-table-column :show-overflow-tooltip="true" prop="fileLevel" label="文件等级">
            <template slot-scope="scope">
              <div>{{ scope.row.fileLevel.name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="fileStatus" label="文件状态" />
          <el-table-column prop="createTime" label="创建日期" />
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
        <pagination />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudFile from '@/api/tools/localStorage'
import { getFileLevels, getFileLevelSuperior } from '@/api/system/filelevel'
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

const defaultForm = { id: null, name: '', fileStatus: 'valid', isRevision: 'false', fileLevel: { id: null }}
export default {
  name: 'File',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker },
  cruds() {
    return CRUD({ title: '文件', url: 'api/localStorage', crudMethod: { ...crudFile }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['file_status', 'common_status'],
  data() {
    return {
      delAllLoading: false,
      loading: false,
      height: document.documentElement.clientHeight - 180 + 'px;',
      fileLevelName: '', fileLevels: [], fileLevelDatas: [],
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      headers: { 'Authorization': getToken() },
      permission: {
        add: ['admin', 'storage:add'],
        edit: ['admin', 'storage:edit'],
        del: ['admin', 'storage:del']
      },
      enabledTypeOptions: [
        { key: 'valid', display_name: '生效' },
        { key: 'wait', display_name: '待审批' },
        { key: 'invalid', display_name: '失效' }
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
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.id == null) {
        this.getFileLevels()
      } else {
        this.getSupFileLevels(form.fileLevel.id)
      }
      // this.getRoleLevel()
      // this.getJobs()
      form.isRevision = form.isRevision.toString()
    },
    // 初始化编辑时候的角色与岗位
    [CRUD.HOOK.beforeToEdit](crud, form) {

    },
    // 上传文件
    upload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
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
    // 切换部门
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.fileLevelId = null
      } else {
        this.query.fileLevelId = data.id
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
      return row.fileLevel.levelSort !== 1
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
