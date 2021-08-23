<template>
  <div>
    <el-input
      v-model="query.blurry"
      clearable
      size="small"
      placeholder="输入措施名称/描述搜索"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="crud.toQuery"
    />
    <date-range-picker v-model="query.createTime" class="date-item"/>
    <el-select
      v-model="query.status"
      clearable
      size="small"
      placeholder="状态"
      class="filter-item"
      style="width: 100px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in statusTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-select
      v-model="query.selfFlag"
      clearable
      size="small"
      placeholder="查询范围"
      class="filter-item"
      style="width: 100px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in scopeTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <rrOperation/>
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import { mapGetters } from 'vuex'

export default {
  components: { rrOperation, DateRangePicker },
  mixins: [header()],
  props: {
    permission: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  data() {
    return {
      statusTypeOptions: [
        { label: '已创建', value: '开始' },
        { label: '进行中', value: '进行中' },
        { label: '关闭', value: '完成' },
        { label: '已移除', value: '已移除' }
      ],
      scopeTypeOptions: [
        { label: '个人', value: true },
        { label: '全部', value: false }
      ]
    }
  }
}
</script>
