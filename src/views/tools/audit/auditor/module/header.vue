<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.blurry" clearable size="small" placeholder="输入审核单位名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
    <date-range-picker v-model="query.createTime" class="date-item" />
    <el-select v-model="query.system" clearable size="small" placeholder="体系" class="filter-item" style="width: 120px" @change="crud.toQuery">
      <el-option v-for="item in dict.dict.audit_system" :key="item.value" :label="item.value" :value="item.value" />
    </el-select>
    <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 120px" @change="crud.toQuery">
      <el-option v-for="item in dict.dict.auditor_status" :key="item.value" :label="item.value" :value="item.value" />
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
    dict: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    }
  }
}
</script>
