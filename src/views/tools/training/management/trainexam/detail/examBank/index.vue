<template>
  <div class="app-container" style="padding: 8px;">
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
               :visible.sync="crud.status.cu > 0" :title="crud.status.add ? '文件上传' : '编辑文件'" width="500px">
      <el-form ref="form" :model="form" size="small" label-width="80px">
        <el-form-item label="试卷名">
          <el-input v-model="form.name" style="width: 360px;"/>
        </el-form-item>
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
            :action="trExamDepartFileUploadApi + '?name=' + form.name +'&departId=' + departId"
            class="upload-demo"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
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
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="name" label="文件名" min-width="180">
        <template slot-scope="scope">
          <el-popover
            v-permission="permission.del"
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
          <span v-permission="!permission.del">{{ scope.row.name }}</span>
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
      <el-table-column prop="createTime" label="创建日期"/>
    </el-table>
    <!--分页组件-->
    <pagination/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getToken} from '@/utils/auth'
import crudFile from '@/api/tools/train/trExamDepartFile'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import {validIsNotNull} from "@/utils/validationUtil";

const defaultForm = {id: null, name: '', departId: null}
export default {
  props: ['departId'],
  components: {pagination, crudOperation, DateRangePicker},
  cruds() {
    return CRUD({
      title: '培训考试题库',
      url: 'api/trExamDepartFile',
      crudMethod: {...crudFile},
      queryOnPresenterCreated: false
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      delAllLoading: false,
      loading: false,
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'exam:add'],
        edit: ['admin', 'exam:edit'],
        del: ['admin', 'exam:del']
      }
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'trExamDepartFileUploadApi'
    ])
  },
  created() {
    this.crud.optShow.add = false
    this.query.departId = this.$props.departId
  },
  mounted() {
    this.crud.toQuery()
  },
  methods: {
    // 上传文件
    upload() {
      this.$refs.upload.submit()
    },
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
      this.query.departId = this.$props.departId
      this.crud.toQuery()
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
