<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.blurry" clearable size="small" placeholder="输入仪器名称、编码、使用人、区域搜索" style="width: 280px;"
              class="filter-item" @keyup.enter.native="crud.toQuery"/>
    <date-range-picker v-model="query.lastCaliDate" start-placeholder="上次校准开始日期"
                       end-placeholder="上次校准结束日期" class="date-item" @input="dateTimeChange()" />
    <date-range-picker v-model="query.nextCaliDate"  start-placeholder="下次校准开始日期"
                       end-placeholder="下次校准结束日期" class="date-item"  @input="dateTimeChange()" />
    <el-select v-model="query.innerChecked" clearable size="small" placeholder="内部校准" class="filter-item"
               style="width: 100px" @change="crud.toQuery">
      <el-option v-for="item in caliStatus" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <el-select v-if="query.innerChecked === 'false'" v-model="query.isDoor" clearable size="small" placeholder="外检选择"
               class="filter-item" style="width: 100px" @change="crud.toQuery">
      <el-option v-for="item in outCheck" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <el-select v-model="query.isDroped" clearable size="small" placeholder="废弃状态" class="filter-item"
               style="width: 100px" @change="crud.toQuery">
      <el-option v-for="item in caliStatus" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
<!--    <rrOperation/>-->
    <span>
       <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
       <el-button v-if="crud.optShow.reset" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="resetQuery">重置</el-button>
    </span>
  </div>
</template>

<script>
import {header} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import Date from "@/utils/datetime";
import {GMTToStr} from "@/utils/validationUtil";
import { crud } from '@crud/crud'

export default {
  components: {rrOperation, DateRangePicker},
  mixins: [header(),crud()],
  props: {
    caliStatus: {
      type: Array,
      required: true
    },
    outCheck: {
      type: Array,
      required: true
    },
    permission: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      /*query: {
        nextCaliDate: []
      }*/
    }
  },
  created() {
    const startTime = new Date(new Date().setHours(0, 0, 0))
    const endTime = new Date(startTime.getTime()+ 3600 * 1000 * 24 * 30)
    this.query.nextCaliDate = [GMTToStr(startTime), GMTToStr(endTime)]
  },
  methods: {
    // 强制时间监控变化
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    resetQuery() {
      this.crud.resetQuery()
      this.dateTimeChange()
    }
  }
}
</script>
