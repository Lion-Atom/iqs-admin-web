<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <!--      <github-corner class="github-corner"/>-->

      <panel-group @handleSetLineChartData="handleSetLineChartData"/>

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <!--工具栏-->
        <div class="head-container">
          <date-range-picker v-model="query.createTime" class="date-item" @change="changeDateTimeRange"/>
        </div>
        <line-chart :chart-data="lineChartData"/>
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <doughnut-chart/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart/>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import PieChart from '@/components/Echarts/PieChart'
import BarChart from '@/components/Echarts/BarChart'
import DoughnutChart from '@/components/Echarts/DoughnutChart'
import DateRangePicker from '@/components/DateRangePicker'
import { queryByCond } from '@/api/overview/overview'

const lineChartData = {
  departments: {
    title: '',
    count: [],
    xAxisData: []
  },
  localStorages: {
    title: '',
    count: [],
    xAxisData: []
  },
  members: {
    title: '',
    count: [],
    xAxisData: []
  },
  fileCategories: {
    title: '',
    count: [],
    xAxisData: []
  }
}

export default {
  name: 'Dashboard',
  components: {
    // GithubCorner,
    PanelGroup,
    DateRangePicker,
    LineChart,
    DoughnutChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      query: {
        createTime: []
      },
      defaultCategory: 'departments',
      lineChartData: null,
      departments: {
        count: [],
        xAxisData: []
      },
      type: ''
    }
  },
  mounted() {
    const date = new Date()
    date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
    this.query.createTime = [date, new Date()]
    this.queryAllByCond(this.defaultCategory, this.query.createTime)
  },
  methods: {
    queryAllByCond(name, time) {
      const obj = {}
      obj.name = name
      obj.createTime = time
      queryByCond(obj).then(res => {
        // alert(JSON.stringify(res.category))
        lineChartData.departments = {}
        const count = []
        const xAxisData = []
        res.category.forEach(function(data, index) {
          count.push(data.value)
          xAxisData.push(data.name)
        })
        // 标题：首字符大写后并拼接完成名称，此处如此处理是防抖动
        lineChartData.departments = {
          title: name.charAt(0).toUpperCase() + name.slice(1) + ' Growth Trend Chart 增长趋势图',
          count: count,
          xAxisData: xAxisData
        }
        this.lineChartData = lineChartData.departments
      })
    },
    changeDateTimeRange(e, index) {
      this.query.createTime = e
      const type = this.type === '' ? this.defaultCategory : this.type
      this.queryAllByCond(type, this.query.createTime)
    },
    handleSetLineChartData(type) {
      this.type = type
      this.queryAllByCond(type, this.query.createTime)
      this.lineChartData = lineChartData[type]
    }
  }
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
