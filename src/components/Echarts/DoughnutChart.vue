<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { getCountByFileType } from '@/api/overview/overview'

export default {
  name: 'DoughnutChart',
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
      chart: null
    }
  },
  beforeMount() {
    this.getChartDateByFileType()
  },
  mounted() {
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
    getChartDateByFileType() {
      getCountByFileType().then(res => {
        this.chartData = res.totalElements
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
          text: '类型关联文件图',
          subtext: 'FileType&File',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          right: '-3%',
          orient: 'vertical'
        },
        series: [
          {
            // name: '文件类型:文件数目',
            name: 'FileType:FileCount',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.chartData
          }
        ]
      })
      this.chart.on('click', (params) => {
        // alert(JSON.stringify(params.data))
        this.$router.push(
          {
            path: '/sys-tools/file',
            query: {
              fileType: params.data.name
            }
          }
        )
      })
    }
  }
}
</script>
