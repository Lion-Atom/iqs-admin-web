<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.instruId" v-show="false" size="small" placeholder="仪器ID" style="width: 120px;"
              class="filter-item" @keyup.enter.native="crud.toQuery"/>
    <date-range-picker v-model="query.caliDate" start-placeholder="开始校准日期"
                       end-placeholder="结束校准日期" class="date-item" @input="dateTimeChange()"/>
    <el-select v-model="query.caliResult"  size="small" placeholder="校准结果" class="filter-item"
               style="width: 150px" @change="caliResultByChange">
      <el-option
        v-for="item in caliResults"
        :key="item.value"
        :label="item.value"
        :value="item.value">
      </el-option>
    </el-select>
    <span>
       <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                  @click="crud.toQuery">搜索</el-button>
       <el-button v-if="crud.optShow.reset" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left"
                  @click="resetQueryInstruCalibration">重置</el-button>
    </span>
  </div>
</template>

<script>
import {header} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import {crud} from '@crud/crud'


export default {
  components: {rrOperation, DateRangePicker},
  mixins: [header(), crud()],
  props: {
    caliResults: {
      type: Array,
      required: true
    },
    instruId: {
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

    }
  },
  created() {
    this.query.instruId = this.$props.instruId
    this.getAllUser()
  },
  methods: {
    // 强制时间监控变化
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 监控人员信息变化
    caliResultByChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    resetQueryInstruCalibration() {
      this.query.instruId = this.$props.instruId
      this.query.caliDate = null
      this.query.caliResult = null
      this.query.page = 0
      this.query.size = 10
      this.crud.toQuery()
      this.dateTimeChange()
    }
  }
}
</script>
