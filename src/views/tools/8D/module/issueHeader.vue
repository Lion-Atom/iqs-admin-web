<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input
      v-model="query.customerName"
      clearable
      size="small"
      placeholder="输入客户名称搜索"
      style="width: 160px;"
      class="filter-item"
      @input="crud.toQuery"
    />
    <el-input
      v-model="query.issueTitle"
      clearable
      size="small"
      placeholder="输入问题标题搜索"
      style="width: 160px;"
      class="filter-item"
      @input="crud.toQuery"
    />
    <el-input
      v-model="query.partNum"
      clearable
      size="small"
      placeholder="输入物料编码搜索"
      style="width: 160px;"
      class="filter-item"
      @input="crud.toQuery"
    />
    <el-input
      v-model="query.duration"
      type="number"
      clearable
      size="small"
      placeholder="结案时长(天)"
      style="width: 140px;"
      class="filter-item"
      @input="crud.toQuery"
    />
    <date-range-picker v-model="query.createTime" class="date-item" @input="dateChange" />
    <el-select v-model="query.status" clearable size="small" placeholder="8D状态" class="filter-item" style="width: 120px"
               @change="crud.toQuery"
    >
      <el-option
        v-for="item in dict.dict.d_status"
        :key="item.id"
        :label="item.label"
        :value="item.label"
      >
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
      </el-option>
    </el-select>
    <el-select v-model="query.process" clearable size="small" placeholder="8D进程" class="filter-item" style="width: 90px"
               @change="crud.toQuery"
    >
      <el-option v-for="item in dict.dict.d_process" :key="item.value" :label="item.label" :value="item.label"/>
    </el-select>
    <rrOperation/>
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
  },
  methods: {
    dateChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
  }
}
</script>
