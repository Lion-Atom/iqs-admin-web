<template>
  <div v-if="crud.props.searchToggle">
    <el-input
      v-model="query.blurry"
      clearable
      size="small"
      placeholder="请输入你要搜索的内容"
      style="width: 200px;"
      class="filter-item"
    />
    <date-range-picker
      v-model="query.createTime"
      class="date-item"
      @change="crud.toQuery"
      @input="change($event)"
    />
    <rrOperation/>
  </div>
</template>

<script>
import { header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
export default {
  components: { rrOperation, DateRangePicker },
  mixins: [header()],
  methods: {
    // 监控日期选择器输入变化，强制刷新
    change() {
      this.$forceUpdate()
    }
  }
}
</script>
