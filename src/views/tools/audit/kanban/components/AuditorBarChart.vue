<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { getCountByFileDept, getCountByFileType, getCountByExecuteType } from '@/api/overview/overview'
import { getCountByDept } from '@/api/tools/auditor'
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
      xAxisData: [],
      yAxisData: [],
      subtext: 'All',
      chart: null
    }
  },
  beforeMount() {
    this.getChartDateByFileDept()
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
    getChartDateByFileDept() {
      getCountByDept().then(res => {
        // alert(JSON.stringify(res))
        this.xAxisData = res.xAxis
        this.yAxisData = res.yAxis
        this.subText = res.scope
        if (this.xAxisData !== undefined) {
          this.initChart()
        }
      }).catch(() => {
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '审核员部门分布',
          // subtext: 'Department&File',
          subText: 'Scope:' + this.subText,
          left: 'center'
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
          type: 'category',
          data: this.xAxisData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          interval: 1,
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '审核人员数目',
          type: 'bar',
          stack: 'auditors',
          barWidth: '60%',
          data: this.yAxisData,
          itemStyle: {
            normal: {
              color: function(params) {
                const colorList = ['#c23531', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#2f4554']
                return colorList[params.dataIndex]
              }
            }
          },
          animationDuration
        }]
      })
      this.chart.on('click', (params) => {
        // alert(JSON.stringify(params.data))
        this.$router.push(
          {
            path: '/8D/issue',
            query: {

            }
          }
        )
      })
    }
  }
}
</script>
