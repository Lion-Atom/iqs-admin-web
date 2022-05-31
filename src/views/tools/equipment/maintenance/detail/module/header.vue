<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.equipmentId" v-show="false" size="small" placeholder="设备ID" style="width: 120px;"
              class="filter-item" @keyup.enter.native="crud.toQuery"/>
    <date-range-picker v-model="query.maintainDate" start-placeholder="开始保养日期"
                       end-placeholder="结束保养日期" class="date-item" @input="dateTimeChange()"/>
    <el-select v-model="query.confirmBy" filterable allow-create size="small" placeholder="确认人" class="filter-item"
               style="width: 150px" @change="confirmByChange">
      <el-option
        v-for="item in users"
        :key="item.id"
        :label="item.dept.name + ' - '+ item.username"
        :value="item.username">
      </el-option>
    </el-select>
    <span>
       <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                  @click="crud.toQuery">搜索</el-button>
       <el-button v-if="crud.optShow.reset" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left"
                  @click="resetQueryMaintenance">重置</el-button>
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
import {getAllUser} from "@/api/system/user";

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
      users: []
    }
  },
  created() {
    this.query.equipmentId = this.$props.equipId
    this.getAllUser()
  },
  methods: {
    // 获取公司人员信息
    getAllUser() {
      this.users = []
      getAllUser().then(res => {
        this.users = res.content
      })
    },
    // 强制时间监控变化
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 监控人员信息变化
    confirmByChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    resetQueryMaintenance() {
      this.query.equipmentId = this.$props.equipId
      this.query.maintainDate = null
      this.query.confirmBy = null
      this.query.page = 0
      this.query.size = 10
      this.crud.toQuery()
      this.dateTimeChange()
    }
  }
}
</script>
