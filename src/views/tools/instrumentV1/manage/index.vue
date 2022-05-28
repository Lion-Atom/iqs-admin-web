<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :cali-status="dict.common_status" :out-check="outCheckOptions" :status-options="instruStatusOptions" />
      <crudOperation :permission="permission"/>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler" @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="staffName" label="员工姓名" fixed/>
      <el-table-column prop="jobNum" label="员工工号"/>
      <el-table-column prop="jobName" label="岗位"/>
      <el-table-column prop="departName" label="所属部门"/>
      <el-table-column prop="superior" label="上级主管"/>
      <el-table-column prop="staffType" label="员工分类"/>
      <el-table-column prop="jobType" label="工种"/>
      <el-table-column prop="workshop" label="车间"/>
      <el-table-column prop="team" label="班组"/>
      <el-table-column prop="isFinished" label="是否完成" :formatter="isFinishedFormat"/>
      <el-table-column prop="trainContent" label="培训内容" :show-overflow-tooltip="true"/>
      <el-table-column prop="reason" label="未完成原因" :show-overflow-tooltip="true"/>
      <el-table-column prop="createTime" label="创建日期" width="140"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','newStaff:edit','newStaff:del'])"
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
    <eForm :status-options="instruStatusOptions" :cali-status="dict.common_status" :permission="permission"/>
  </div>
</template>

<script>
import crudInstrument from '@/api/tools/instrument/instrument'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, {presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'

export default {
  name: 'Instrument',
  components: {eHeader, eForm, crudOperation, pagination, udOperation},
  cruds() {
    return CRUD({
      title: '仪器信息',
      url: 'api/instrument',
      sort: ['id,asc'],
      crudMethod: {...crudInstrument}
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['common_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'instrument:add'],
        edit: ['admin', 'instrument:edit'],
        del: ['admin', 'instrument:del']
      },
      instruStatusOptions: [
        {
          label: 'normal',
          value: '正在使用'
        },
        {
          label: 'limit',
          value: '限制使用'
        },
        {
          label: 'drop',
          value: '报废'
        }
      ],
      outCheckOptions: [
        {
          value: 'true',
          label: '上门校准'
        }, {
          value: 'false',
          label: '送出校准'
        }
      ]
    }
  },
  methods: {
    // 改变状态
    isFinishedFormat(row, col) {
      if (row.isFinished) {
        return '是'
      } else {
        return '否'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
