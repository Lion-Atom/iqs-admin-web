<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.equipmentId" v-show="false" size="small" placeholder="设备ID索" style="width: 120px;"
              class="filter-item" @keyup.enter.native="crud.toQuery"/>
    <date-range-picker v-model="query.maintainDate" start-placeholder="开始保养日期"
                       end-placeholder="结束保养日期" class="date-item" @input="dateTimeChange()"/>
    <el-select v-model="query.isDroped" clearable size="small" placeholder="保养状态" class="filter-item"
               style="width: 100px" @change="crud.toQuery">
      <el-option v-for="item in maintainStatus" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <span>
       <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                  @click="crud.toQuery">搜索</el-button>
       <el-button v-if="crud.optShow.reset" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left"
                  @click="resetQuery">重置</el-button>
    </span>
  </div>
</template>

<script>
import {header} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import Date from "@/utils/datetime";
import {GMTToStr} from "@/utils/validationUtil";
import {crud} from '@crud/crud'

export default {
  components: {rrOperation, DateRangePicker},
  mixins: [header(), crud()],
  props: {
    maintainStatus: {
      type: Array,
      required: true
    },
    equipId: {
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
      /*query: {
        nextCaliDate: []
      }*/
    }
  },
  created() {
    this.query.equipmentId = this.$props.equipId
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
