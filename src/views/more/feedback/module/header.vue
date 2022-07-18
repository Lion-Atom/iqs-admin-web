<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-if="isAuthorized" v-model="query.blurry" clearable size="small" placeholder="输入客户名称、问题描述"
              style="width: 250px;"
              class="filter-item" @input="crud.toQuery"/>
    <el-input v-if="!isAuthorized" v-model="query.companyName" clearable size="small" placeholder="输入客户名称、问题描述"
              style="width: 250px;display: none;"
              class="filter-item" @input="crud.toQuery"/>
    <date-range-picker v-model="query.createTime" @input="dateTimeChange()" class="date-item"/>
    <el-select v-model="query.type" allow-create filterable clearable size="small" placeholder="问题分类"
               class="filter-item" style="width: 120px" @change="crud.toQuery">
      <el-option v-for="item in typeOptions" :key="item.value" :label="item.value" :value="item.value"/>
    </el-select>
    <el-select v-if="isAuthorized" v-model="query.status" clearable size="small" placeholder="反馈状态" class="filter-item"
               style="width: 120px"
               @change="crud.toQuery">
      <el-option v-for="item in feedbackStatus" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <span>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                 @click="crud.toQuery">搜索</el-button>
      <el-button v-if="crud.optShow.reset" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left"
                 @click="resetQueryCsFeedback">重置</el-button>
    </span>
  </div>
</template>

<script>
import {header} from '@crud/crud'
import DateRangePicker from '@/components/DateRangePicker'
import {mapGetters} from "vuex";

export default {
  components: {DateRangePicker},
  mixins: [header()],
  props: {
    feedbackStatus: {
      type: Array,
      required: true
    },
    typeOptions: {
      type: Array,
      required: true
    },
    isAuthorized: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'appTitle'
    ])
  },
  created() {
    if (!this.isAuthorized) {
      this.query.companyName = this.appTitle
    }
  },
  methods: {
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    resetQueryCsFeedback() {
      if (!this.isAuthorized) {
        this.query.companyName = this.appTitle
      } else {
        this.query.companyName = null
      }
      this.query.blurry = null
      this.query.status = null
      this.query.type = null
      this.query.createTime = null
      this.query.page = 0
      this.query.size = 10
      this.crud.toQuery()
      this.dateTimeChange()
    }
  }
}
</script>
