<template>
  <div
    v-if="crud.props.searchToggle"
  >
<!--    <el-input v-model="query.blurry" clearable size="small" placeholder="输入名称、厂家、设备型号等搜索" style="width: 250px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
    <el-select
      v-model="query.equipmentId"
      style="width: 220px;"
      clearable
      filterable
      placeholder="请选择设备"
      class="filter-item"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in equipments"
        :key="item.id"
        :label="item.equipNum+'-'+item.equipName"
        :value="item.id"
      />
    </el-select>
    <!--    <el-input v-model="query.caliScope" clearable size="small" placeholder="输入校准范围搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
    <!-- 文件所属部门筛选，需要更改为树表筛选 -->
    <TreeSelect
      v-model="query.acceptDepart"
      :options="useDeparts"
      :load-options="loadFileDepts"
      class="newTree-item"
      placeholder="选择验收部门"
      style="width:160px !important;"
      @input="crud.toQuery"
    />
    <date-range-picker v-model="query.acceptTime" @input="dateTimeChange()" start-placeholder="验收开始日期"
                       end-placeholder="验收结束日期" class="date-item" />
    <el-select v-model="query.acceptStatus" clearable size="small" placeholder="验收状态" class="filter-item" style="width: 120px" @change="crud.toQuery">
      <el-option v-for="item in dict.dict.equip_status" :key="item.id" :label="item.value" :value="item.value" />
    </el-select>
    <rrOperation />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import TreeSelect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getDepts, getDeptTree} from "@/api/system/dept";
import {getEquipmentByExample} from "@/api/tools/equipment";
export default {
  components: { rrOperation, DateRangePicker,TreeSelect },
  mixins: [header()],
  props: {
    dict: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    }
  },
  data(){
    return{
      useDeparts: [],
      acceptStatusOptions:[
        {
          label:'待验收',
          value:'待验收'
        },
        {
          label:'验收中',
          value:'验收中'
        },
        {
          label:'已验收',
          value:'已验收'
        }
      ],
      equipments: []
    }
  },
  created() {
    this.getTopDept()
    this.getAllEquipments()
  },
  methods:{
    // 获取所有符合条件的设备信息
    getAllEquipments() {
      this.equipments = []
      getEquipmentByExample({}).then(res => {
        this.equipments = res
        // alert(JSON.stringify(this.equipments))
      })
    },
    // 获取所在公司的部门树结构
    getTopDept() {
      getDeptTree().then(res => {
        this.useDeparts = res.content
      })
    },
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 获取弹窗内使用部门数据
    loadFileDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value, .newTree-item {
  height: 29px;
  line-height: 29px !important;
  font-size: small;
}
</style>
