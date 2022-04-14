<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission"/>
      <crudOperation :permission="permission"/>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      @selection-change="crud.selectionChangeHandler"
      @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="repairNum" label="维修单号" min-width="120" />
      <el-table-column prop="equipName" label="设备名称"/>
      <el-table-column prop="shutTime" label="停机时间" min-width="140" />
      <el-table-column prop="shutBy" label="停机人员" min-width="120"/>
      <el-table-column label="故障判定" :formatter="isFaultFormat"/>
      <el-table-column prop="judgeReason" label="停机原因"/>
      <el-table-column prop="repairBy" label="维修负责人"/>
      <el-table-column prop="repairTime" label="开始维修时间" min-width="140" />
      <el-table-column prop="resolveTime" label="结束维修时间" min-width="140" />
      <el-table-column label="是否完成" :formatter="isFinishFormat"/>
      <el-table-column label="相关附件">
        <template slot-scope="scope">
          <el-button type="text" @click="toOpenFileView(scope.row)">文件查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="confirmBy" label="确认人"/>
      <el-table-column prop="confirmTime" label="确认时间" min-width="140" />
      <el-table-column prop="createTime" label="创建日期" min-width="140" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','repair:edit','repair:del'])"
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
    <!--表单渲染-->
    <eForm :judge-fault="dict.common_status"/>
    <!--附件查看-->
    <el-dialog
      :visible.sync="fileDialogVisible"
      width="60%">
      <template slot="title">
        <span><b style="text-decoration: red underline;">{{ fileDialogTitle }}</b></span>
      </template>
      <el-table
        ref="fileTable"
        border
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
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import crudEquipRepair from '@/api/tools/equipRepair'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, {presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import {mapGetters} from "vuex";

export default {
  name: 'Repair',
  components: {eHeader, crudOperation, pagination, eForm, udOperation},
  cruds() {
    return CRUD({
      title: '设备维修',
      url: 'api/equipRepair',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudEquipRepair}
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['common_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'repair:add'],
        edit: ['admin', 'repair:edit'],
        del: ['admin', 'repair:del']
      },
      fileList: [],
      fileDialogTitle: '',
      fileDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'repairFileUploadApi'
    ])
  },
  methods: {
    // 是否是故障判定
    isFaultFormat(row, col) {
      // alert(JSON.stringify(row))
      if (row.isFault) {
        return '故障'
      } else {
        return '非故障'
      }
    },
    isFinishFormat(row, col) {
      if (row.isFinished) {
        return '已完成'
      } else {
        return '未完成'
      }
    },
    // 查看文档
    toOpenFileView(data) {
      // alert(JSON.stringify(data.fileList))
      this.fileList = data.fileList
      this.fileDialogTitle = data.equipName + ' - ' + data.repairNum
      this.fileDialogVisible = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
