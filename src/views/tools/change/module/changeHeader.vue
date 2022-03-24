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
      v-model="query.reason"
      clearable
      size="small"
      placeholder="变更原因"
      class="filter-item"
      style="width: 140px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in changeReasonOptions"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      >
        {{ item.value }}
      </el-option>
    </el-select>
    <el-select
      v-model="query.source"
      clearable
      size="small"
      placeholder="变更来源"
      class="filter-item"
      style="width: 140px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in dict.dict.d_source"
        :key="item.id"
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
      placeholder="变更进度"
      class="filter-item"
      style="width: 140px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in changeStatusOptions"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      >
        {{ item.value }}
      </el-option>
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
      changeReasonOptions: [
        {
          label: 'Problem from Quality',
          value: '质量出现问题'
        },
        {
          label: 'Change Request',
          value: '正常变更请求'
        }
      ],
      changeStatusOptions: [
        {
          label: 'draft',
          value: '起草中'
        },
        {
          label: 'refuse',
          value: '被拒绝'
        },
        {
          label: 'soon to manage',
          value: '待管理'
        },
        {
          label: 'manage',
          value: '管理中'
        },
        {
          label: 'soon to approve',
          value: '待批准'
        },
        {
          label: 'approve',
          value: '批准中'
        },
        {
          label: 'close',
          value: '已批准'
        }
      ]
    }
  }
}
</script>
