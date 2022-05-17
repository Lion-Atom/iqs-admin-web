<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.blurry" clearable size="small" placeholder="输入新员工名称搜索" style="width: 200px;"
              class="filter-item" @keyup.enter.native="crud.toQuery"/>
    <el-input v-model="query.departId" v-show="false"/>
    <date-range-picker v-model="query.createTime" class="date-item" @input="dateTimeChange()" start-placeholder="录入开始日期"
                       end-placeholder="录入结束日期"/>
    <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索
    </el-button>
    <el-button v-if="crud.optShow.reset" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left"
               @click="resetNewQuery">重置
    </el-button>
  </div>
</template>

<script>
import {header} from '@crud/crud'
import DateRangePicker from '@/components/DateRangePicker'

export default {
  components: {DateRangePicker},
  mixins: [header()],
  props: {
    departId: {
      type: String,
      required: true
    },
    permission: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      departs: [],
    }
  },
  created() {
    this.query.departId = this.$props.departId
  },
  methods: {
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 重置查询
    resetNewQuery() {
      this.crud.resetQuery(false)
      this.query.departId = this.$props.departId
      this.crud.toQuery()
    }
  }
}
</script>
