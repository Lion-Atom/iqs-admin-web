<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import {getCountByAuditPlanMonth, getCountByAuditPlanYear} from '@/api/tools/auditPlan'
const animationDuration = 6000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      planDatas: [],
      execDatas: [],
      trailDatas: [],
      closeDatas: [],
      chart: null
    }
  },
  beforeMount() {
    this.getChartDateByAuditYear()
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getChartDateByAuditYear() {
      getCountByAuditPlanMonth().then(res => {
        // alert(JSON.stringify(res))
        this.planDatas = res.planDatas
        this.execDatas = res.execDatas
        this.trailDatas = res.trailDatas
        this.closeDatas = res.closeDatas
        if (this.planDatas !== undefined) {
          this.initChart()
        }
      }).catch(() => {
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '月审核系统计划数量分布',
          left: 'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: this.xAxisData
        },
        grid: {
          top: 50,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'value'
        }],
        yAxis: [{
          type: 'category',
          data: ['1月份', '2月份', '3月份', '4月份', '5月份', '6月份','7月份',
            '8月份', '9月份', '10月份', '11月份', '12月份']
        }],
        series: [
          {
            name: '计划',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.planDatas
          },
          {
            name: '执行',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.execDatas
          },
          {
            name: '追踪',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.trailDatas
          },
          {
            name: '结案',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.closeDatas
          }
        ]
      })
      this.chart.on('click', (params) => {
        // alert(JSON.stringify(params.data))
        this.$router.push(
          {
            path: '/audit/plan',
            query: {

            }
          }
        )
      })
    }
  }
}
</script>
