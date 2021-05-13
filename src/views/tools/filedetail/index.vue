<template>
  <div class="app-container">
    <h2><i class="el-icon-document"/>{{ realName }}</h2>
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
        <el-collapse-item title="Process 所属过程" name="4" class="collapse-item">
          <div>简化流程：设计简洁直观的操作流程；</div>
          <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
          <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        </el-collapse-item>
      </el-form>
    </el-collapse>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import crudFile from '@/api/tools/localStorage'
import { getAllFiles, getFilesByIds, getFileById } from '@/api/tools/localStorage'

const defaultForm = {
  id: null,
  name: null,
  isRevision: 'false',
  pid: null,
  description: '无',
  cateSort: 999,
  fileLevel: { id: null },
  fileCategory: { id: null },
  enabled: 'true'
}
export default {
  name: 'FileDetail',
  cruds() {
    return CRUD({ title: '文件', url: 'api/localStorage', crudMethod: { ...crudFile } })
  },
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
      bindFileItems: []
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
    this.getAllFiles()
  },
  mounted: function() {
    if (this.$route.query.fileId !== undefined) {
      this.id = this.$route.query.fileId
      this.realName = this.$route.query.realName
      this.file = this.$route.query.fileId
      this.getFileById(this.file)
    }
  },
  methods: {
    getAllFiles() {
      getAllFiles({ enabled: true }).then(res => {
        // console.log(JSON.stringify(res.content[0].id))
        const data = res.content
        if (data.length > 0) {
          this.file = data[0].id
          this.getFileById(this.file)
          this.realName = data[0].realName
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
    }
    // 获取弹窗内文件分类数据
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
