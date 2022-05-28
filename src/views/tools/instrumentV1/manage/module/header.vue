<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.blurry" clearable size="small" placeholder="输入仪器名称、编码、使用人、区域搜索" style="width: 280px;"
              class="filter-item" @keyup.enter.native="crud.toQuery"/>
    <date-range-picker v-model="query.lastCaliDate" start-placeholder="上次校准开始日期"
                       end-placeholder="上次校准结束日期" class="date-item" @input="dateTimeChange()" />
    <date-range-picker v-model="query.nextCaliDate"  start-placeholder="下次校准开始日期"
                       end-placeholder="下次校准结束日期" class="date-item"  @input="dateTimeChange()" />
    <el-select v-model="query.innerChecked" clearable size="small" placeholder="内部校准" class="filter-item"
               style="width: 100px" @change="crud.toQuery">
      <el-option v-for="item in caliStatus" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <el-select v-if="query.innerChecked === 'false'" v-model="query.isDoor" clearable size="small" placeholder="外检选择"
               class="filter-item" style="width: 100px" @change="crud.toQuery">
      <el-option v-for="item in outCheck" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <el-select v-model="query.status" clearable size="small" placeholder="使用状态" class="filter-item"
               style="width: 100px" @change="crud.toQuery">
      <el-option v-for="item in statusOptions" :key="item.value" :label="item.value" :value="item.value"/>
    </el-select>
    <rrOperation/>
  </div>
</template>

<script>
import {header} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import TreeSelect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getEquipmentByExample} from "@/api/tools/equipment";
import {getDepts, getDeptTree} from "@/api/system/dept";

export default {
  components: {rrOperation, DateRangePicker, TreeSelect},
  mixins: [header()],
  props: {
    caliStatus: {
      type: Array,
      required: true
    },
    outCheck: {
      type: Array,
      required: true
    },
    statusOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods:{
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    }
  }
}
</script>
