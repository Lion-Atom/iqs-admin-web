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
      <el-table-column prop="instruName" label="仪器名称" :show-overflow-tooltip="true" fixed/>
      <el-table-column prop="instruNum" label="出厂型号"/>
      <el-table-column prop="assetNum" label="资产号"/>
      <el-table-column prop="innerId" label="内部编号"/>
      <el-table-column prop="caliScope" label="测量范围"/>
      <el-table-column prop="useArea" label="使用区域" :show-overflow-tooltip="true" />
      <el-table-column prop="useBy" label="使用人"/>
      <el-table-column prop="position" label="存放区域" :show-overflow-tooltip="true" />
      <el-table-column prop="keeper" label="保管人"/>
      <el-table-column prop="status" label="使用状态"/>
      <el-table-column prop="caliStatus" label="校准状态"/>
      <el-table-column label="校准周期">
        <template slot-scope="scope">
          {{ scope.row.caliPeriod }}{{ scope.row.periodUnit }}
        </template>
      </el-table-column>
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
            :show-del="false"
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
          value: '正常使用'
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

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
