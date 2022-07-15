<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.blurry" clearable size="small" placeholder="输入客户名称、问题描述" style="width: 250px;" class="filter-item" @input="crud.toQuery" />
    <date-range-picker v-model="query.createTime" class="date-item" />
    <el-select v-model="query.type"  allow-create filterable clearable size="small" placeholder="问题分类" class="filter-item" style="width: 120px" @change="crud.toQuery">
      <el-option v-for="item in typeOptions"  :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-select v-model="query.status" clearable size="small" placeholder="反馈状态" class="filter-item" style="width: 120px" @change="crud.toQuery">
      <el-option v-for="item in feedbackStatus" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <rrOperation />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
export default {
  components: { rrOperation, DateRangePicker },
  mixins: [header()],
  props: {
    feedbackStatus: {
      type: Array,
      required: true
    },
    typeOptions: {
      type: Array,
      required: true
    }
  }
}
</script>
