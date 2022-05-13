<template>
  <div class="app-container">
    <!--快速导航-->
    <div class="head-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/training/management' }">培训概览</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/training/train-material' }">培训部门-{{ departName }}</el-breadcrumb-item>
        <el-breadcrumb-item><b>培训资源</b></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="输入内容模糊搜索" style="width: 200px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"/>
        <el-input v-model="query.departId" v-show="false"/>
        <date-range-picker v-model="query.createTime" class="date-item" @input="dateChange"/>
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
               :visible.sync="crud.status.cu > 0" :title="crud.status.add ? '培训资料上传' : '编辑培训资料'" width="75%">
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
                  <!--                  <el-select
                                      v-model="form.isInternal"
                                      style="width: 100%;"
                                    >
                                      <el-option
                                        v-for="item in dict.dict.common_status"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                      </el-option>
                                    </el-select>-->
                </el-form-item>
              </el-col>
              <!--todo 根据内部/外部选择对应的专业工具-->
              <el-col :span="12">
                <el-form-item label="专业工具" prop="toolType">
                  <el-select
                    v-model="form.toolType"
                    filterable
                    allow-create
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in toolTypeOption"
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
          <el-col :span="11">
            <!--   上传文件   -->
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
            <div v-if="crud.status.edit">
              <el-form-item label="更新文件">
                <el-radio-group v-model="form.revision" style="width: 140px">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.revision==='1'">
                <template slot="label">
                  <span><i style="color: red">* </i>新版</span>
                </template>
                <el-upload
                  ref="upload"
                  :limit="1"
                  drag
                  :before-upload="beforeUpload"
                  :auto-upload="false"
                  :headers="headers"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :action="trainMaterialFileUploadApi + '?id=' + form.id + '&name=' + form.name +'&departId=' + departId +'&author=' + form.author
             +'&version=' + form.version + '&isInternal=' + form.isInternal + '&toolType=' + form.toolType + '&fileDesc=' + form.fileDesc + '&enabled=' + form.enabled"
                  class="upload-demo"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
                </el-upload>
              </el-form-item>
            </div>
            <!--            <el-form-item v-if="crud.status.edit">
                          <template slot="label">
                            <span><i style="color: red">* </i>新版</span>
                          </template>
                          <el-upload
                            ref="upload"
                            :limit="1"
                            drag
                            :before-upload="beforeUpload"
                            :auto-upload="false"
                            :headers="headers"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :action="trainMaterialFileUploadApi + '?id=' + form.id + '&name=' + form.name +'&departId=' + departId +'&author=' + form.author
                         +'&version=' + form.version + '&isInternal=' + form.isInternal + '&toolType=' + form.toolType + '&fileDesc=' + form.fileDesc + '&enabled=' + form.enabled"
                            class="upload-demo"
                          >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
                          </el-upload>
                        </el-form-item>-->
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button v-if="crud.status.add" :loading="loading" type="primary" @click="upload">确认</el-button>
        <el-button v-else :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler" @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="name" label="文件名" min-width="180">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.hasDownloadAuthority"
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
          <span v-else>{{ scope.row.name }}</span>
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
  fileDesc: null
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
      toolTypeOption: []
    }
  },
  watch: {
    // 监听deptId
    // 'form.isInternal': 'currIsInternalChange'
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'trainMaterialFileUploadApi'
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
      this.$refs.upload.submit()
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
        this.toolTypeOption = [
          {
            label: 'OPL',
            value: 'OPL'
          },
          {
            label: 'L&L',
            value: 'L&L'
          }
        ]
      } else {
        this.toolTypeOption = [
          {
            label: 'GB/ISO',
            value: 'GB/ISO'
          }
        ]
      }
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
