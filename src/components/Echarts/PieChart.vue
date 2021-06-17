<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { getCountByFileLevel } from '@/api/overview/overview'

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
      chartData: [],
      subtext: 'All',
      chart: null
    }
  },
  beforeMount() {
    this.getChartDateByFileLevel()
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
    getChartDateByFileLevel() {
      getCountByFileLevel().then(res => {
        this.chartData = res.totalElements
        this.subtext = res.scope
        if (this.chartData.length > 0) {
          this.initChart()
        }
      }).catch(() => {
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: '等级关联文件图',
          //subtext: 'Level&File',
          subtext: 'Scope:' + this.subtext,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Level:FileCount',
            type: 'pie',
            radius: '60%',
            data: this.chartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      this.chart.on('click', (params) => {
        // alert(JSON.stringify(params.data))
        this.$router.push(
          {
            path: '/sys-tools/file',
            query: {
              fileLevelId: params.data.id,
              fileLevelName: params.data.name
            }
          }
        )
      })
    }
  }
}
</script>
