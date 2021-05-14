<template>
  <div class="app-container">
    <h2><i ref="view" class="el-icon-view" style="color:rgb(24, 144, 255);"/>{{ realName }}&nbsp;
      <i ref="edit" class="el-icon-s-release" @click="changeToEdit"/></h2>
    <el-select
      v-model="file"
      style="width: 400px;padding-bottom: 10px;"
      placeholder="请选择"
      @change="changeFile"
    >
      <el-option
        v-for="item in files"
        :key="item.name"
        :label="item.name"
        :value="item.id"
      />
    </el-select>

    <el-collapse v-model="activeNames" accordion @change="handleChange">
      <el-form ref="form" :model="form" size="small" label-width="200px">
        <!--概括-->
        <el-collapse-item title="Profile 轮廓" name="1" class="collapse-item">
          <el-row>
            <el-col :span="12" class="el-col-left">
              <el-form-item label="InitTitle 初始名称">
                <el-input v-model="form.realName" style="width: 370px;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="SecurityLevel 安全级别">
                <el-input v-model="form.securityLevel" style="width: 370px;"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="el-col-left">
              <el-form-item label="Category 所属分类">
                <el-input v-model="form.fileCategory.name" style="width: 370px;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="FileLevel 所属等级">
                <el-input v-model="form.fileLevel.name" style="width: 370px;"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="el-col-left">
              <el-form-item label="Size 文件大小">
                <el-input v-model="form.size" style="width: 370px;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Type 文件类型">
                <el-input v-model="form.type" style="width: 370px;"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="el-col-left">
              <el-form-item label="CurrentVersion 当前版本">
                <el-input v-model="form.version" style="width: 370px;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="CurrentStatus 当前状态">
                <el-input v-model="form.fileStatus" style="width: 370px;"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="el-col-left">
              <el-form-item label="CreatedBy 创建信息">
                <el-input v-model="form.createBy" style="width: 370px;"/>
              </el-form-item>
            </el-col>
            <el-form-item label="UpdatedBy 最新操作">
              <el-input v-model="form.updateBy" style="width: 370px;"/>
            </el-form-item>
          </el-row>
        </el-collapse-item>
        <!--所属组织-->
        <el-collapse-item title="Organization 所属组织" name="2" class="collapse-item">
          <el-form-item label="FileDept 所属部门">
            <el-input v-model="form.fileDept.name" style="width: 370px;"/>
          </el-form-item>
        </el-collapse-item>
        <!--关联文件-->
        <el-collapse-item title="Reference 关联文件" name="3" class="collapse-item">
          <el-row>
            <el-col>
              <div v-if="bindFileItems.length>0">
                <div v-for="(item,index) in bindFileItems" style="margin-left: 10px;">
                  <el-button type="text" @click.native="refFile(item.id)">
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
        <el-collapse-item title="OperationLog 操作日志" name="4" class="collapse-item">
          <el-row>
            <el-col>
              <div class="app-container">
                <div class="head-container">
                  <div v-if="crud.props.searchToggle">
                    <el-input
                      v-model="query.blurry"
                      id="addRealName"
                      clearable
                      size="small"
                      placeholder="请输入你要搜索的内容"
                      style="display: none;"
                      class="filter-item"
                    />
                    <date-range-picker v-model="query.createTime" class="date-item"/>
                    <rrOperation/>
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
                          <span>{{ props.row.method }}</span>
                        </el-form-item>
                        <el-form-item label="请求参数">
                          <span>{{ props.row.params }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="username" label="用户名"/>
                  <el-table-column prop="requestIp" label="IP"/>
                  <el-table-column :show-overflow-tooltip="true" prop="address" label="IP来源"/>
                  <el-table-column prop="description" label="描述" width="200px"/>
                  <el-table-column prop="browser" label="浏览器"/>
                  <el-table-column prop="time" label="请求耗时" align="center">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
                      <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
                      <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建日期" width="180px"/>
                </el-table>
                <!--分页组件-->
                <pagination/>
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
import { getAllFiles, getFilesByIds, getFileById } from '@/api/tools/localStorage'
import { delInfoByCond } from '@/api/monitor/log'
import CRUD, { presenter } from '@crud/crud'
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'FileDetail',
  components: { crudOperation, pagination, rrOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '日志', url: 'api/logs' })
  },
  mixins: [presenter(), header()],
  // 设置数据字典
  dicts: ['file_status', 'common_status'],
  data() {
    return {
      id: null,
      files: [],
      file: null,
      realName: '',
      activeNames: ['1'],
      headers: { 'Authorization': getToken() },
      permission: {
        add: ['admin', 'storage:add'],
        edit: ['admin', 'storage:edit'],
        del: ['admin', 'storage:del']
      },
      form: {
        id: null,
        name: '',
        realName: '',
        securityLevel: '',
        version: '',
        fileStatus: '',
        desc: '',
        size: '',
        type: '',
        createBy: '',
        createTime: null,
        updateBy: '',
        updateTime: null,
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
        blurry: null
      }
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
      // alert(JSON.stringify(this.$route.query.fileId))
      this.id = this.$route.query.fileId
      this.realName = this.$route.query.realName
      this.file = this.$route.query.fileId
      this.getFileById(this.file)
    }
    this.getAllFiles()
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true
    }
  },
  /*  mounted() {
      this.getAllFiles()
    },*/
  methods: {
    getAllFiles() {
      getAllFiles({ enabled: true }).then(res => {
        // alert(JSON.stringify(this.file))
        const data = res.content
        if (data.length > 0 && this.file === null) {
          this.file = data[0].id
          this.getFileById(this.file)
          this.realName = data[0].realName
          this.query.blurry = this.realName.slice(0, this.realName.indexOf('-'))
          this.crud.toQuery(this.query.blurry)
        }
        this.files = data.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getFileById(id) {
      getFileById(id).then(res => {
        // console.log('单个文件明细：' + JSON.stringify(res))
        this.form = res
        // 设置部分显示内容
        this.realName = this.form.realName
        this.query.blurry = this.realName.slice(0, this.realName.indexOf('-'))
        this.crud.toQuery(this.query.blurry)
        // alert(JSON.stringify(this.query.blurry))
        this.form.fileLevel.name += '-' + this.form.fileLevel.description
        this.form.createBy = ' created by ' + this.form.createBy + ' on ' + this.form.createTime
        this.form.updateBy = ' last updated by' + this.form.updateBy + ' on ' + this.form.updateTime
        // 查询关联文件列表
        const ids = []
        if (res.bindFiles !== null && res.bindFiles.length > 0) {
          res.bindFiles.forEach(function(file, index) {
            ids.push(file.bindingStorageId)
          })
          // console.log(ids)
          this.getFilesByIds(ids)
        } else {
          // alert("当前绑定文件为空")
          this.bindFileItems = []
        }
      })
    },
    getFilesByIds(ids) {
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
          path: '/sys-tools/file',
          query: {}
        })
    },
    // todo切换文件，需要重新渲染form
    changeFile(value) {
      this.getFileById(value)
      this.activeNames = ['1']
    },
    refFile(id) {
      this.getFileById(id)
      this.file = id
      this.activeNames = ['1']
    },
    handleChange(val) {
      console.log(val)
    },
    // 删除当前文件相关的日志
    confirmDelAll() {
      this.$confirm(`确认清空当前文件的操作日志吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        this.cond.blurry = this.query.blurry
        delInfoByCond(this.cond).then(res => {
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
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}

.el-col-left {
  border-right: 1px solid #f00;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

.collapse-item > > >
.el-collapse-item__content {
  padding-bottom: 0;
}
</style>
