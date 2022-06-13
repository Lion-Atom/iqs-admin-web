<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :permission="permission"/>
      <crudOperation :permission="permission"/>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      :row-class-name="maintainTableRowClassName"
      @selection-change="crud.selectionChangeHandler"
      @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="equipNum" label="设备编号" fixed />
      <el-table-column prop="equipName" label="设备名称" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column prop="equipModel" label="设备型号" min-width="150"/>
      <el-table-column prop="assetNum" label="资产号" min-width="120"/>
      <el-table-column prop="equipProvider" label="设备厂家" :show-overflow-tooltip="true" />
      <el-table-column prop="useDepartName" label="使用部门"/>
      <el-table-column prop="useArea" label="设备位置"/>
      <el-table-column label="设备状态" min-width="150">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.maintainLevel && scope.row.lastMaintainDate" trigger="hover" placement="top">
            <p>1.设备定级：设备等级、保养等级、保养周期等设定 <i class="el-icon-check"></i></p>
            <p>2.设备保养：对已定级设备进行周期性保养 <i class="el-icon-check"></i></p>
            <el-tag v-if="scope.row.maintainStatus === maintainOverdue"  slot="reference" type="danger">{{ maintainOverdue }}</el-tag>
            <el-tag v-else  slot="reference" type="success">已保养</el-tag>
          </el-popover>
          <el-popover v-else-if="scope.row.maintainLevel && !scope.row.lastMaintainDate" trigger="hover" placement="top">
            <p>1.设备定级：设备等级、保养等级、保养周期等设定 <i class="el-icon-check"></i></p>
            <p>2.设备保养：对已定级设备进行周期性保养 <i class="el-icon-close"></i></p>
            <el-tag slot="reference" type="info">已定级，未保养</el-tag>
          </el-popover>
          <el-popover v-else trigger="hover" placement="top">
            <p>1.设备定级：设备等级、保养等级、保养周期等设定 <i class="el-icon-close"></i></p>
            <p>2.设备保养：对已定级设备进行周期性保养 <i class="el-icon-close"></i></p>
            <el-tag  slot="reference" class="name-wrapper" type="warning">未定级，未保养</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="equipLevel" label="设备级别"/>
      <el-table-column prop="maintainLevel" label="保养级别"/>
      <el-table-column label="上次保养日期" :formatter="lastMaintainDateFormat" min-width="100"/>
      <el-table-column label="保养周期" :formatter="maintainPeriodFormat"/>
      <el-table-column label="保养到期日期" :formatter="maintainDueDateFormat" min-width="100"/>
      <el-table-column prop="createTime" label="创建日期" min-width="150px"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','equip:edit'])"
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
import crudEquipment from '@/api/tools/equipment'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, {presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from './module/UD.operation'
import {mapGetters} from "vuex";
import {GMTToDate, validIsNotNull} from "@/utils/validationUtil";
import {getByMethodName} from "@/api/system/timing";

export default {
  name: 'Maintenance',
  components: {eHeader, crudOperation, pagination, eForm, udOperation},
  cruds() {
    return CRUD({
      title: '设备保养',
      url: 'api/equipment',
      query: {status: '已验收'},
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudEquipment},
      // 关闭前置create率先执行toQuery方法
      queryOnPresenterCreated: false
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['common_status'],
  data() {
    return {
      permission: {
        edit: ['admin', 'equip:edit']
      },
      fileList: [],
      fileDialogTitle: '',
      fileDialogVisible: false,
      maintainOverdue: '超期未保养',
      methodName: 'checkEquipMtIsOverdue'
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'repairFileUploadApi'
    ])
  },
  created() {
    this.flushEquipInfo()
    this.crud.optShow = {
      add: false,
      edit: true,
      del: false,
      download: true,
      reset: true
    }
  },
  methods: {
    // 调用同步-重新拉取走查仪器校准状态信息
    flushEquipInfo() {
      getByMethodName(this.methodName).then(res => {
        this.crud.toQuery()
      })
    },
    // 上次保养日期格式化
    lastMaintainDateFormat(row, col) {
      if (validIsNotNull(row.lastMaintainDate)) {
        return GMTToDate(row.lastMaintainDate)
      } else {
        return null
      }
    },
    // 上次保养日期格式化
    maintainPeriodFormat(row, col) {
      if (validIsNotNull(row.maintainPeriod) && validIsNotNull(row.maintainPeriodUnit)) {
        return row.maintainPeriod + row.maintainPeriodUnit
      } else {
        return null
      }
    },
    // 上次保养日期格式化
    maintainDueDateFormat(row, col) {
      if (validIsNotNull(row.maintainDueDate)) {
        return GMTToDate(row.maintainDueDate)
      } else {
        return null
      }
    },
    // 根据设备保养级别等有无设置提醒样式
    maintainTableRowClassName({row, rowIndex}) {
      if (row.maintainStatus === this.maintainOverdue) {
        return 'alert-row'
      } else {
        return ''
      }
    }
  }
}
</script>

<style>
.el-table .alert-row {
  color: #f00 !important;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
