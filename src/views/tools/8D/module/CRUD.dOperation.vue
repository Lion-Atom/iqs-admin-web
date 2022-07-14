<template>
  <div class="crud-opts">
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="handleClose"
      :visible.sync="diaVisible"
      title="编辑问题"
      width="70%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="120px"
      >
        <el-row class="el-row-inline">
          <el-col :span="8">
            <el-form-item
              label="问题标题"
              prop="issueTitle"
            >
              <el-input
                v-model="form.issueTitle"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="客户名称"
              prop="customerName"
            >
              <el-input
                v-model="form.customerName"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="客户追踪码"
              prop="caNum"
            >
              <el-input
                v-model="form.caNum"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="产品料号"
              prop="partNum"
            >
              <el-input
                v-model="form.partNum"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item
              label="问题来源"
              prop="source"
            >
              <el-radio
                v-for="item in dict.d_source"
                :key="item.value"
                v-model="form.source"
                :label="item.value"
              >
                {{ item.value }}
              </el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="紧急计划"
              prop="urgencyPlan"
            >
              <el-input
                v-model="form.urgencyPlan"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="创建时间"
              prop="initTime"
            >
              <el-date-picker
                v-model="form.initTime"
                style="width:100%;"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="具体描述"
              prop="description"
            >
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="3"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 附件管理-->
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <template slot="label">
                <span><i style="color: red">* </i>附件列表</span>
              </template>
              <el-table
                ref="table"
                border
                v-loading="fileLoading"
                :data="fileList"
                style="width: 100%;margin-bottom: 10px;"
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
                    <el-popover
                      :ref="`delIssueFile-popover-${scope.$index}`"
                      v-permission="permission.edit"
                      placement="top"
                      width="180"
                    >
                      <p>确定删除这个附件吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button
                          size="mini"
                          type="text"
                          @click="scope._self.$refs[`delIssueFile-popover-${scope.$index}`].doClose()"
                        >取消
                        </el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          @click="deleteIssueFile(scope.row.id), scope._self.$refs[`delIssueFile-popover-${scope.$index}`].doClose()"
                        >确定
                        </el-button>
                      </div>
                      <el-button
                        slot="reference"
                        v-permission="permission.edit"
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="fileList.length < 2"
                      />
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
              <el-upload
                class="upload-demo"
                ref="upload"
                :headers="headers"
                :multiple="true"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :action="appendixUploadApi + '?issueId=' + this.bindingId + '&stepName=' + this.curStep"
                :on-error="handleError">
                <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且单文件不超过100M</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="text"
          @click="diaVisible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitIssue"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
    <span class="crud-opts-left">
      <!--左侧插槽-->
      <slot name="left"/>
      <el-tooltip class="item" effect="dark" content="新增后记得审核哦" placement="top-start">
        <el-button
          v-if="crud.optShow.add"
          v-permission="permission.add"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="crud.toAdd"
        >
          新增
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="不同的执行指向不同的编辑流程哦" placement="top-start">
        <el-button
          v-if="crud.optShow.edit"
          v-permission="permission.edit"
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-edit"
          :disabled="crud.selections.length !== 1"
          @click="crud.toEdit(crud.selections[0])"
        >
          {{ editTitle }}
        </el-button>
      </el-tooltip>
      <!--      <el-button
        v-if="crud.optShow.edit"
        v-permission="permission.edit"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-edit"
        :disabled="crud.selections.length !== 1 || (crud.selections[0].hasReport !== '系统8D')"
        @click="gotoEdit(crud.selections[0])"
      >
        编辑8D
      </el-button>-->
      <el-button
        v-if="crud.optShow.add"
        v-permission="permission.add"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-edit"
        :disabled="crud.selections.length !== 1"
        @click="toEditForm(crud.selections[0])"
      >
        编辑问题
      </el-button>
      <el-tooltip class="item" effect="dark" content="打印之前要确定数据都加载完毕哦" placement="top-start">
        <el-button
          v-if="crud.optShow.edit"
          v-permission="permission.edit"
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-edit"
          :disabled="crud.selections.length !== 1 || crud.selections[0].status === '待审核'|| crud.selections[0].status === '驳回'"
          :loading="viewLoading"
          @click="gotoView(crud.selections[0])"
        >
          打印预览
        </el-button>
      </el-tooltip>
      <el-button
        v-if="crud.optShow.del"
        slot="reference"
        v-permission="permission.del"
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        size="mini"
        :loading="crud.delAllLoading"
        :disabled="crud.selections.length === 0"
        @click="toDelete(crud.selections)"
      >
        删除
      </el-button>
      <el-button
        v-if="crud.optShow.download"
        :loading="crud.downloadLoading"
        :disabled="!crud.data.length"
        class="filter-item"
        size="mini"
        type="warning"
        icon="el-icon-download"
        @click="crud.doExport"
      >导出</el-button>
      <!--右侧-->
      <slot name="right"/>
    </span>
    <el-button-group class="crud-opts-right">
      <el-button
        size="mini"
        plain
        type="info"
        icon="el-icon-search"
        @click="toggleSearch()"
      />
      <el-button
        size="mini"
        icon="el-icon-refresh"
        @click="crud.refresh()"
      />
      <el-popover
        placement="bottom-end"
        width="150"
        trigger="click"
      >
        <el-button
          slot="reference"
          size="mini"
          icon="el-icon-s-grid"
        >
          <i
            class="fa fa-caret-down"
            aria-hidden="true"
          />
        </el-button>
        <el-checkbox
          v-model="allColumnsSelected"
          :indeterminate="allColumnsSelectedIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox
          v-for="item in tableColumns"
          :key="item.property"
          v-model="item.visible"
          @change="handleCheckedTableColumnsChange(item)"
        >
          {{ item.label }}
        </el-checkbox>
      </el-popover>
    </el-button-group>
  </div>
</template>
<script>
import CRUD, {crud} from '@crud/crud'
import {getCauseTreeByIssueId} from '@/api/tools/issueCause'
import {mapGetters} from 'vuex'
import {edit} from '@/api/tools/issue'
import {getToken} from "@/utils/auth";
import {delIssueFile, getIssueFileByExample} from "@/api/tools/issueFile";

function sortWithRef(src, ref) {
  const result = Object.assign([], ref)
  let cursor = -1
  src.forEach(e => {
    const idx = result.indexOf(e)
    if (idx === -1) {
      cursor += 1
      result.splice(cursor, 0, e)
    } else {
      cursor = idx
    }
  })
  return result
}

export default {
  mixins: [crud()],
  props: {
    permission: {
      type: Object,
      default: () => {
        return {}
      }
    },
    hiddenColumns: {
      type: Array,
      default: () => {
        return []
      }
    },
    ignoreColumns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  dicts: ['d_source'],
  data() {
    return {
      bindingId: null,
      editTitle: '审核问题',
      tableColumns: [],
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      tableUnwatcher: null,
      // 忽略下次表格列变动
      ignoreNextTableColumnsChange: false,
      viewLoading: false,
      fishData: {},
      form: {},
      diaVisible: false,
      curStep: 'D0',
      cond: {
        issueId: null,
        stepName: 'D0'
      },
      fileLoading: false,
      fileList: [],
      headers: {
        'Authorization': getToken()
      },
      rules: {
        issueTitle: [
          {required: true, message: '请输入问题标题', trigger: 'blur'}
        ],
        customerName: [
          {required: true, message: '请输入客户名', trigger: 'blur'}
        ],
        caNum: [
          {required: true, message: '请输入客户追踪码', trigger: 'blur'}
        ],
        partNum: [
          {required: true, message: '请输入产品料号', trigger: 'blur'}
        ],
        source: [
          {required: true, message: '请选择问题来源', trigger: 'blur'}
        ],
        urgencyPlan: [
          {required: true, message: '请输入紧急计划', trigger: 'blur'}
        ],
        initTime: [
          {required: true, message: '请输入创建时间', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请描述下问题具体信息', trigger: 'blur'}
        ]
      }
    }
  },
  watch: {
    'crud.props.table'() {
      this.updateTableColumns()
      this.tableColumns.forEach(column => {
        if (this.hiddenColumns.indexOf(column.property) !== -1) {
          column.visible = false
          this.updateColumnVisible(column)
        }
      })
    },
    'crud.props.table.store.states.columns'() {
      this.updateTableColumns()
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
    this.user.isAdmin ? this.editTitle = '审核问题' : this.editTitle = '查看问题'
    this.crud.updateProp('searchToggle', true)
    this.listenerParentDbRowClick()
  },
  methods: {
    // 监听父组件双击事件
    listenerParentDbRowClick() {
      alert(JSON.stringify(this.$prop.activeRow))
    },
    updateTableColumns() {
      const table = this.crud.getTable()
      if (!table) {
        this.tableColumns = []
        return
      }
      let cols = null
      const columnFilter = e => e && e.type === 'default' && e.property && this.ignoreColumns.indexOf(e.property) === -1
      const refCols = table.columns.filter(columnFilter)
      if (this.ignoreNextTableColumnsChange) {
        this.ignoreNextTableColumnsChange = false
        return
      }
      this.ignoreNextTableColumnsChange = false
      const columns = []
      const fullTableColumns = table.$children.map(e => e.columnConfig).filter(columnFilter)
      cols = sortWithRef(fullTableColumns, refCols)
      cols.forEach(config => {
        const column = {
          property: config.property,
          label: config.label,
          visible: refCols.indexOf(config) !== -1
        }
        columns.push(column)
      })
      this.tableColumns = columns
    },
    toDelete(datas) {
      this.$confirm(`确认删除选中的${datas.length}条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        this.crud.doDelete(datas)
      }).catch(() => {
      })
    },
    handleCheckAllChange(val) {
      if (val === false) {
        this.allColumnsSelected = true
        return
      }
      this.tableColumns.forEach(column => {
        if (!column.visible) {
          column.visible = true
          this.updateColumnVisible(column)
        }
      })
      this.allColumnsSelected = val
      this.allColumnsSelectedIndeterminate = false
    },
    handleCheckedTableColumnsChange(item) {
      let totalCount = 0
      let selectedCount = 0
      this.tableColumns.forEach(column => {
        ++totalCount
        selectedCount += column.visible ? 1 : 0
      })
      if (selectedCount === 0) {
        this.crud.notify('请至少选择一列', CRUD.NOTIFICATION_TYPE.WARNING)
        this.$nextTick(function () {
          item.visible = true
        })
        return
      }
      this.allColumnsSelected = selectedCount === totalCount
      this.allColumnsSelectedIndeterminate = selectedCount !== totalCount && selectedCount !== 0
      this.updateColumnVisible(item)
    },
    updateColumnVisible(item) {
      const table = this.crud.props.table
      const vm = table.$children.find(e => e.prop === item.property)
      const columnConfig = vm.columnConfig
      if (item.visible) {
        // 找出合适的插入点
        const columnIndex = this.tableColumns.indexOf(item)
        vm.owner.store.commit('insertColumn', columnConfig, columnIndex + 1, null)
      } else {
        vm.owner.store.commit('removeColumn', columnConfig, null)
      }
      this.ignoreNextTableColumnsChange = true
    },
    toggleSearch() {
      this.crud.props.searchToggle = !this.crud.props.searchToggle
    },
    // 关闭弹窗前操作
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    // 提交问题信息
    submitIssue() {
      this.$refs.form.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          edit(this.form).then(res => {
            this.$message({
              message: 'Edit Issue Success! 编辑问题基本信息成功!',
              type: 'success'
            })
            this.diaVisible = false
          }).catch(res => {

          })
        }
      })
    },
    gotoEdit(data) {
      // 跳转到8D明细中
      this.$router.push(
        {
          path: '/issue/detail',
          query: {
            issueId: data.id
          }
        })
    },
    // 编辑问题
    toEditForm(data) {
      this.diaVisible = true
      this.form = data
      this.bindingId = data.id
      this.getIssueFilesById(this.bindingId)
    },
    gotoView(data) {
      this.viewLoading = true
      getCauseTreeByIssueId(data.id).then(res => {
        this.fishData = {}
        this.fishData.name = res.issueTitle
        this.fishData.children = res.content
        this.viewLoading = false
        // 跳转到8D预览界面
        this.$router.push(
          {
            path: '/issue/overview',
            query: {
              issueId: data.id,
              initFishData: this.fishData
            }
          })
      })
    },
    // 获取附件
    getIssueFilesById(id) {
      // alert(issueId + "--对应步骤：--"+stepName)
      this.fileLoading = true
      this.fileList = []
      this.cond.issueId = id
      getIssueFileByExample(this.cond).then(res => {
        // alert(res.length)
        this.fileLoading = false
        this.fileList = res
      })
    },
    // 上传附件之前判断
    beforeUpload: function (file) {
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
      this.getIssueFilesById(this.bindingId)
      setTimeout(() => {
        this.$message.success('上传文件成功!')
      }, 600)
      this.$refs.upload.clearFiles()
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
    deleteIssueFile(id) {
      const data = []
      data.push(id)
      delIssueFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getIssueFilesById(this.bindingId)
      }).catch(() => {
        this.$message({
          message: 'Del File Failed! 删除附件成功!',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style>
.crud-opts {
  padding: 4px 0;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}

.crud-opts .crud-opts-right {
  margin-left: auto;
}

.crud-opts .crud-opts-right span {
  float: left;
}
</style>
