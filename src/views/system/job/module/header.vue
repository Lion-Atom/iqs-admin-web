<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <!--@keyup.enter.native="crud.toQuery" -->
    <el-input v-model="query.name" clearable size="small" placeholder="输入岗位名称搜索" style="width: 200px;"
              class="filter-item" @input="crud.toQuery"/>
    <date-range-picker v-model="query.createTime" class="date-item" @input="dateChange"/>
    <el-select v-model="query.enabled" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px"
               @change="crud.toQuery">
      <el-option v-for="item in dict.dict.job_status" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <rrOperation/>
  </div>
</template>

<script>
import {header} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'

export default {
  components: {rrOperation, DateRangePicker},
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
  methods: {
    dateChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    }
  }
}
</script>
