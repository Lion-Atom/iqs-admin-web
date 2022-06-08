<template>
  <div class="app-container">
    <!--快速导航-->
    <div class="head-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/training/overview' }">培训概览</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/training/manage/material' }">培训部门-{{ departName }}</el-breadcrumb-item>
        <el-breadcrumb-item><b>培训资源</b></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="输入内容模糊搜索" style="width: 200px;"
                  class="filter-item" @input="crud.toQuery" />
        <el-input v-model="query.departId" v-show="false"/>
        <date-range-picker v-model="query.createTime" class="date-item" @input="dateChange"/>
        <el-select
          v-model="query.isInternal"
          clearable
          size="small"
          placeholder="出处类型"
          class="filter-item"
          @clear="isInternalClear"
          @change="isInternalChange"
        >
          <el-option
            v-for="item in sourceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select
          v-model="query.toolType"
          filterable
          allow-create
          clearable
          size="small"
          placeholder="专业工具"
          class="filter-item"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in toolTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索
        </el-button>
        <el-button v-if="crud.optShow.reset" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left"
                   @click="resetNewQuery">重置
        </el-button>
      </div>
      <crudOperation :permission="permission">
        <!-- 新增 -->
        <el-button
          slot="left"
          v-permission="['admin','exam:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-upload"
          @click="crud.toAdd"
        >上传
        </el-button>
      </crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
               :visible.sync="crud.status.cu > 0" :title="crud.status.add ? '培训资料上传' : '编辑培训资料'" width="70%">
      <el-form ref="form" :rules="rules" :model="form" size="small" label-width="80px">
        <el-row :gutter="40" class="row-box">
          <el-col :span="13">
            <el-row :gutter="40" class="row-box">
              <el-col :span="12">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="form.name" placeholder="请填写材料名称" style="width: 100%;"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="版本"
                  prop="version"
                >
                  <el-input v-model="form.version" placeholder="请填写材料版本" style="width: 100%;"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="作者" prop="author">
                  <el-input v-model="form.author" style="width: 100%;"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="来自内部" prop="isInternal">
                  <el-radio-group v-model="form.isInternal" style="width: 140px" @change="currIsInternalChange">
                    <el-radio label="true">是</el-radio>
                    <el-radio label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <!--根据内部/外部选择对应的专业工具-->
              <el-col :span="12">
                <el-form-item label="专业工具" prop="toolType">
                  <el-select
                    v-model="form.toolType"
                    filterable
                    allow-create
                    clearable
                    placeholder="可自定义标准认证工具"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in toolTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="状态"
                  prop="enabled"
                >
                  <el-radio
                    v-for="item in dict.dict.job_status"
                    :key="item.id"
                    v-model="form.enabled"
                    :label="item.value === 'true'"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="材料描述" prop="fileDesc">
                  <el-input
                    v-model="form.fileDesc"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 5}"
                    placeholder="请输入材料内容描述"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <!--   上传文件   -->
          <el-col :span="11">
            <el-form-item v-if="crud.status.add">
              <template slot="label">
                <span><i style="color: red">* </i>上传</span>
              </template>
              <el-upload
                ref="upload"
                :limit="1"
                drag
                :before-upload="beforeUpload"
                :auto-upload="false"
                :headers="headers"
                :on-change="handleFileChange"
                :file-list="fileList"
                :on-success="handleSuccess"
                :on-error="handleError"
                :action="trainMaterialFileUploadApi + '?name=' + form.name +'&departId=' + departId +'&author=' + form.author
             +'&version=' + form.version + '&isInternal=' + form.isInternal + '&toolType=' + form.toolType + '&fileDesc=' + form.fileDesc + '&enabled=' + form.enabled"
                class="upload-demo"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
              </el-upload>
            </el-form-item>
            <el-form-item v-if="crud.status.edit">
              <template slot="label">
                <span>新版</span>
              </template>
              <el-upload
                ref="coverUpload"
                :limit="1"
                drag
                :before-upload="beforeUpload"
                :auto-upload="false"
                :headers="headers"
                :on-success="handleCoverSuccess"
                :on-change="handleCoverFileChange"
                :file-list="coverFileList"
                :on-error="handleError"
                :action="trainMaterialFileCoverApi + '?id=' + form.id + '&name=' + form.name +'&departId=' + departId +'&author=' + form.author
             +'&version=' + form.version + '&isInternal=' + form.isInternal + '&toolType=' + form.toolType + '&fileDesc=' + form.fileDesc + '&enabled=' + form.enabled"
                class="upload-demo"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将新版本文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M<i style="color: red">【若文件无改动，无须再上传】</i></div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button v-if="crud.status.add" :loading="loading" type="primary" @click="upload">确认</el-button>
        <el-button v-else-if="crud.status.edit && coverFileList.length > 0" :loading="loading" type="primary"
                   @click="coverUpload">确认
        </el-button>
        <el-button v-else :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        <!--        <el-button v-if="crud.status.add" :loading="loading" type="primary" @click="upload">确认</el-button>
                <el-button v-else :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>-->
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler" @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="name" label="文件名" min-width="180">
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
      <el-table-column prop="author" label="作者"/>
      <el-table-column label="出处" :formatter="isInternalFormat"/>
      <el-table-column prop="toolType" label="专业工具"/>
      <el-table-column label="生效状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="fileDesc" label="文件描述" :show-overflow-tooltip="true"/>
      <el-table-column prop="suffix" label="文件类型"/>
      <el-table-column prop="type" label="类别"/>
      <el-table-column prop="size" label="大小"/>
      <el-table-column prop="createBy" label="创建者"/>
      <el-table-column prop="createTime" label="创建日期" min-width="140"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','exam:edit','exam:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getToken} from '@/utils/auth'
import crudFile from '@/api/tools/train/trainMaterialFile'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import {validIsNotNull} from "@/utils/validationUtil";


const defaultForm = {
  id: null,
  departId: null,
  name: '',
  author: '',
  version: '',
  isInternal: true,
  revision: '0',
  toolType: null,
  enabled: true,
  fileDesc: ''
}
export default {
  props: [],
  components: {pagination, crudOperation, udOperation, DateRangePicker},
  cruds() {
    return CRUD({
      title: '培训资料',
      url: 'api/trainMaterialFile',
      crudMethod: {...crudFile},
      queryOnPresenterCreated: false
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['job_status', 'common_status'],
  data() {
    return {
      delAllLoading: false,
      loading: false,
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'exam:add'],
        edit: ['admin', 'exam:edit'],
        del: ['admin', 'exam:del']
      },
      rules: {
        name: [
          {required: true, message: '请填写材料名称', trigger: 'blur'}
        ],
        author: [
          {required: true, message: '请填写作者名字', trigger: 'blur'}
        ],
        version: [
          {required: true, message: '请填写版本号', trigger: 'blur'}
        ],
        isInternal: [
          {required: true, message: '请选择材料出处', trigger: 'blur'}
        ],
        toolType: [
          {required: true, message: '请选择专业工具标准', trigger: 'blur'}
        ],
        enabled: [
          {required: true, message: '请确认试题状态', trigger: 'blur'}
        ]
      },
      toolTypeOptions: [
        {
          label: 'OPL',
          value: 'OPL'
        },
        {
          label: 'L&L',
          value: 'L&L'
        }
      ],
      sourceTypeOptions: [
        {
          label: '内部',
          value: true
        },
        {
          label: '外部',
          value: false
        }
      ],
      fileList: [],
      coverFileList: []
    }
  },
  watch: {
    // 监听deptId
    // 'form.isInternal': 'currIsInternalChange'
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'trainMaterialFileUploadApi',
      'trainMaterialFileCoverApi'
    ])
  },
  created() {
    this.crud.optShow.add = false
    if (this.$route.query.departId !== undefined) {
      this.departId = this.$route.query.departId
      this.query.departId = this.$route.query.departId
      this.departName = this.$route.query.departName
    }
  },
  mounted() {
    this.crud.toQuery()
  },
  methods: {
    // 上传文件
    upload() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.fileList.length > 0) {
            this.$refs.upload.submit()
          } else {
            this.crud.notify('请上传材料', CRUD.NOTIFICATION_TYPE.WARNING)
          }
        }
      })
    },
    // 新版提交
    coverUpload() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$refs.coverUpload.submit()
        }
      })
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.fileList = []
    },
    // 初始化编辑时候的关联文件并初始化版本升级操作计数
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.coverFileList = []
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.job_status[val] + '" ' + data.name + '此材料, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudFile.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.job_status[val] + '成功', 'success')
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    handleCoverSuccess(response, file, coverFileList) {
      this.crud.notify('替换材料成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$refs.coverUpload.clearFiles()
      this.crud.status.edit = CRUD.STATUS.NORMAL
      this.crud.resetForm()
      this.crud.toQuery()
    },
    handleCoverFileChange(file, coverFileList) {
      this.coverFileList = coverFileList;
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },
    // 上传之前设置
    beforeUpload(file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      if (!validIsNotNull(this.form.name)) {
        this.form.name = file.name
      }
      return isLt2M
    },
    handleSuccess(response, file, coverFileList) {
      this.crud.notify('上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$refs.upload.clearFiles()
      this.crud.status.add = CRUD.STATUS.NORMAL
      this.crud.resetForm()
      this.crud.toQuery()
    },
    // 监听上传失败
    handleError(e, file, coverFileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },
    dateChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    resetNewQuery() {
      this.crud.resetQuery(false)
      this.query.departId = this.$route.query.departId
      this.crud.toQuery()
    },
    // 监控是否内外部变化
    currIsInternalChange(val) {
      this.form.toolType = null
      if (val.toString() === 'true') {
        this.toolTypeOptions = [
          {
            label: 'OPL',
            value: 'OPL'
          },
          {
            label: 'L&L',
            value: 'L&L'
          }
        ]
      } else if (val.toString() === 'false') {
        this.toolTypeOptions = [
          {
            label: 'GB/ISO',
            value: 'GB/ISO'
          }
        ]
      }
    },
    isInternalChange(val) {
      if (val.toString() === 'false') {
        this.toolTypeOptions = [
          {
            label: 'GB/ISO',
            value: 'GB/ISO'
          }
        ]
        this.query.toolType = this.toolTypeOptions[0].value
      } else if (val.toString() === 'true') {
        this.toolTypeOptions = [
          {
            label: 'OPL',
            value: 'OPL'
          },
          {
            label: 'L&L',
            value: 'L&L'
          }
        ]
        this.query.toolType = this.toolTypeOptions[0].value
      }
      this.crud.toQuery()
    },
    // 内/外部清空监控
    isInternalClear() {
      this.query.toolType = null
      this.crud.toQuery()
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      form.isInternal = `${form.isInternal}`
    },
    // 是否来自内部格式化
    isInternalFormat(row, col) {
      if (row.isInternal) {
        return '内部'
      } else {
        return '外部'
      }
    }
  }
}
</script>

<style scoped>
::v-deep .el-image__error, .el-image__placeholder {
  background: none;
}

::v-deep .el-image-viewer__wrapper {
  top: 55px;
}
</style>
