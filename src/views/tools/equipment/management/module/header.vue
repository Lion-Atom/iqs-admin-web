<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.blurry" clearable size="small" placeholder="输入名称、厂家、设备型号等搜索" style="width: 250px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
<!--    <el-input v-model="query.caliScope" clearable size="small" placeholder="输入校准范围搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
    <!-- 文件所属部门筛选，需要更改为树表筛选 -->
    <TreeSelect
      v-model="query.useDepart"
      :options="useDeparts"
      :load-options="loadFileDepts"
      class="newTree-item"
      placeholder="选择所属部门"
      style="width:160px !important;"
      @input="crud.toQuery"
    />
    <date-range-picker v-model="query.createTime" @input="dateTimeChange()" class="date-item" />
    <el-select v-model="query.status" clearable size="small" placeholder="设备状态" class="filter-item" style="width: 120px" @change="crud.toQuery">
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
      useDeparts: []
    }
  },
  created() {
    this.getTopDept()
  },
  methods:{
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
