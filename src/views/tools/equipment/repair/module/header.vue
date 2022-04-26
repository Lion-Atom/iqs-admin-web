<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-select
      v-model="query.equipmentId"
      style="width: 220px;"
      clearable
      filterable
      placeholder="请选择设备"
      class="filter-item"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in equipments"
        :key="item.id"
        :label="item.equipNum+'-'+item.equipName"
        :value="item.id"
      />
    </el-select>
    <date-range-picker v-model="query.shutTime" start-placeholder="停机开始日期"
                       end-placeholder="停机结束日期" class="date-item"  @input="dateTimeChange()" />
    <el-select v-model="query.isFinished" clearable size="small" placeholder="处理状态" class="filter-item"
               @change="crud.toQuery">
      <el-option v-for="item in isFinishedOptions" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <el-select v-model="query.confirmBy" clearable filterable allow-create size="small" placeholder="确认人" class="filter-item"
               @change="crud.toQuery">
      <el-option
        v-for="item in users"
        :key="item.id"
        :label="item.dept.name + ' - '+ item.username"
        :value="item.username">
      </el-option>
    </el-select>
    <rrOperation/>
  </div>
</template>

<script>
import {header} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import {getAllUser} from "@/api/system/user";
import {getEquipmentByExample} from "@/api/tools/equipment";

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
  mounted() {
    this.getAllUser()
    this.getAllEquipments()
  },
  data() {
    return {
      users: [],
      equipments: [],
      isFinishedOptions:[
        {
          label:'未完成',
          value: false
        },
        {
          label:'已完成',
          value: true
        }
      ]
    }
  },
  methods:{
    getAllUser(){
      this.users = []
      getAllUser().then(res => {
        this.users = res.content
      })
    },
    // 获取所有的设备信息
    getAllEquipments() {
      this.equipments = []
      getEquipmentByExample({}).then(res => {
        this.equipments = res
        // alert(JSON.stringify(this.equipments))
      })
    },
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    }
  }
}
</script>
