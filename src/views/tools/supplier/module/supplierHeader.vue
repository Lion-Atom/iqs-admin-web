<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input
      v-model="query.blurry"
      clearable
      size="small"
      placeholder="输入模糊项搜索"
      style="width: 160px;"
      class="filter-item"
      @keyup.enter.native="crud.toQuery"
    />
    <date-range-picker v-model="query.createTime" class="date-item" />
    <el-select
      v-model="query.type"
      clearable
      size="small"
      placeholder="供应商类别"
      class="filter-item"
      style="width: 120px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in dict.dict.supplier_type"
        :key="item.id"
        :label="item.value"
        :value="item.value"
      >
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
      </el-option>
    </el-select>
    <el-select
      v-model="query.level"
      clearable
      size="small"
      placeholder="供应商级别"
      class="filter-item"
      style="width: 120px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in dict.dict.supplier_level"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      >
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
      </el-option>
    </el-select>
    <el-select
      v-model="query.status"
      clearable
      size="small"
      placeholder="经营状态"
      class="filter-item"
      style="width: 130px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in statusOptions"
        :key="item.key"
        :label="item.display_name"
        :value="item.display_name"
      />
    </el-select>
    <rrOperation />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'

export default {
  components: { rrOperation, DateRangePicker },
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
  data() {
    return {
      statusOptions: [
        { key: true, display_name: '开业' },
        { key: false, display_name: '停业' }
      ]
    }
  }
}
</script>
