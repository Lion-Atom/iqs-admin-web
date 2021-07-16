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
    <el-select v-if="isAdmin" v-model="query.selfFlag" clearable size="small" placeholder="查询范围" class="filter-item"
               style="width: 120px" @change="queryTask" @input="changeScope($event)"
    >
      <el-option v-for="item in scopeTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
    </el-select>
    <el-select v-model="query.isDone" clearable size="small" placeholder="审批状态" class="filter-item"
               style="width: 120px" @change="queryTask" @input="changeStatus($event)"
    >
      <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
    </el-select>
    <el-select v-if="query.isDone" v-model="query.approveResult" clearable size="small" placeholder="审批结论"
               class="filter-item"
               style="width: 120px" @change="crud.toQuery" @input="changeResult($event)"
    >
      <el-option v-for="item in resultTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
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
  mixins: [header(), crud()],
  props: ['isAdmin'],
  data() {
    return {
      scopeTypeOptions: [
        { key: false, display_name: '全部' },
        { key: true, display_name: '本人' }
      ],
      enabledTypeOptions: [
        { key: false, display_name: '待处理' },
        { key: true, display_name: '已完成' }
      ],
      resultTypeOptions: [
        { key: true, display_name: '同意' },
        { key: false, display_name: '驳回' }
      ]
    }
  },
  mounted() {
    this.query.isDone = false
    this.crud.toQuery()
  },
  methods: {
    // 监控审批状态选择器输入变化，强制刷新
    changeScope() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 监控审批状态选择器输入变化，强制刷新
    changeStatus() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 监控审批结论选择器输入变化，强制刷新
    changeResult() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    queryTask() {
      if (!this.query.isDone) {
        this.query.approveResult = null
      }
      this.crud.toQuery()
    }
  }
}
</script>
