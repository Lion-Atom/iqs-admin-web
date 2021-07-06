<template>
  <div v-if="crud.props.searchToggle">
    <el-input
      v-model="query.blurry"
      clearable
      size="small"
      placeholder="请输入你要搜索的内容"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="crud.toQuery"
    />
    <date-range-picker
      v-model="query.createTime"
      class="date-item"
      @change="crud.toQuery"
      @input="change($event)"
    />
    <el-select v-model="query.isDone" clearable size="small" placeholder="状态" class="filter-item"
               style="width: 90px" @change="crud.toQuery" @input="change($event)"
    >
      <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
    </el-select>
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
  data() {
    return {
      enabledTypeOptions: [
        { key: 'false', display_name: '待处理' },
        { key: 'true', display_name: '已完成' }
      ]
    }
  },
  created() {
    this.query.isDone = 'false'
    this.crud.toQuery()
  },
  methods: {
    // 监控日期选择器输入变化，强制刷新
    change() {
      this.$forceUpdate()
    }
  }
}
</script>
