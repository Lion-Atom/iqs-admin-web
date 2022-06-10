<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-select
      class="filter-item"
      size="small"
      v-model="query.trScheduleId"
      placeholder="请选择培训项目"
      style="width: 200px;"
      filterable
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in schedules"
        :key="item.id"
        :label="item.trainTitle "
        :value="item.id"
      />
    </el-select>
    <el-input v-model="query.blurry" clearable size="small" placeholder="输入新员工名称搜索" style="width: 200px;"
              class="filter-item" @input="crud.toQuery"/>
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
import {getAllSchedule} from "@/api/tools/train/schedule";

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
      schedules: []
    }
  },
  created() {
    this.query.departId = this.$props.departId
    this.getAllSchedule()
  },
  methods: {
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 获取所有的培训计划
    getAllSchedule() {
      this.schedules = []
      getAllSchedule().then(res => {
        // alert(JSON.stringify(res))
        this.schedules = res.content
      })
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
