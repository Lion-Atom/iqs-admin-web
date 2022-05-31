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
      @input="crud.toQuery"
    />
    <date-range-picker v-model="query.createTime" class="date-item" @input="dateChange" />
    <el-select
      v-model="query.supplierId"
      size="small"
      placeholder="请选择供应商"
      filterable
      clearable
      class="filter-item"
      style="width: 200px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in suppliers"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <el-select
      v-model="query.type"
      clearable
      filterable
      allow-create
      size="small"
      placeholder="人员类型"
      class="filter-item"
      style="width: 120px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in dict.dict.contact_type"
        :key="item.id"
        :label="item.value"
        :value="item.value"
      >
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
      </el-option>
    </el-select>
    <el-select
      v-model="query.importantLevel"
      clearable
      size="small"
      placeholder="重要程度"
      class="filter-item"
      style="width: 120px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in dict.dict.contact_level"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      >
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
      </el-option>
    </el-select>
    <el-select
      v-model="query.jobStatus"
      clearable
      size="small"
      placeholder="在职状态"
      class="filter-item"
      style="width: 130px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in dict.dict.contact_status"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      >
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
      </el-option>
    </el-select>
    <rrOperation />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import { get } from '@/api/tools/supplier'

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
      suppliers: []
    }
  },
  mounted() {
    this.getAllSupplier()
  },
  methods: {
    // 获取所有的供应商信息
    getAllSupplier() {
      get().then(res => {
        // alert(JSON.stringify(res))
        this.suppliers = res.content
      })
    },
    dateChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
  }
}
</script>
