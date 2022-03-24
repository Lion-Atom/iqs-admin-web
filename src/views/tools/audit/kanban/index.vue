<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="chart-wrapper">
            <plan-year-bar-chart />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="chart-wrapper">
            <plan-month-bar-chart />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <plan-type-bar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <plan-reason-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <plan-execute-chart />
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <auditor-bar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <auditor-system-pie-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <auditor-pie-chart />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import DateRangePicker from '@/components/DateRangePicker'
import AuditorPieChart from '@/views/tools/audit/kanban/components/AuditorPieChart'
import AuditorBarChart from '@/views/tools/audit/kanban/components/AuditorBarChart'
import PlanExecuteChart from '@/views/tools/audit/kanban/components/PlanExecuteChart'
import PlanTypeBarChart from '@/views/tools/audit/kanban/components/PlanTypeBarChart'
import PlanYearBarChart from '@/views/tools/audit/kanban/components/PlanYearBarChart'
import PlanMonthBarChart from '@/views/tools/audit/kanban/components/PlanMonthBarChart'
import AuditorSystemPieChart from '@/views/tools/audit/kanban/components/AuditorSystemPieChart'
import PlanLineChart from '@/views/tools/audit/kanban/components/PlanLineChart'
import PlanReasonChart from '@/views/tools/audit/kanban/components/PlanReasonChart'

export default {
  name: 'AuditKanban',
  components: {
    DateRangePicker,
    PlanLineChart,
    PlanExecuteChart,
    AuditorPieChart,
    AuditorBarChart,
    PlanTypeBarChart,
    PlanYearBarChart,
    PlanMonthBarChart,
    AuditorSystemPieChart,
    PlanReasonChart
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
