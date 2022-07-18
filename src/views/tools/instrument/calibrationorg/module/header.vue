<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.blurry" clearable size="small" placeholder="输入名称、地址搜索" style="width: 200px;" class="filter-item" @input="crud.toQuery" />
    <el-input v-model="query.caliScope" clearable size="small" placeholder="输入校准范围搜索" style="width: 200px;" class="filter-item" @input="crud.toQuery"  />
    <date-range-picker v-model="query.createTime" class="date-item" @input="dateTimeChange()" />
    <el-select v-model="query.enabled" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
      <el-option v-for="item in enableOptions" :key="item.value" :label="item.label" :value="item.value" />
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
    enableOptions: {
      type: Array,
      required: true
    },
    permission: {
      type: Object,
      required: true
    }
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
