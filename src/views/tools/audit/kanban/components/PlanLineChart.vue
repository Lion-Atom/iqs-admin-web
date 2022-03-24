<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from '@/views/dashboard/mixins/resize'

export default {
  mixins: [resize],
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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ title, count, xAxisData } = {}) {
      this.chart.setOption({
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        title: {
          text: 'Gradient Stacked Area Chart'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['Line 1']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Line 1',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(128, 255, 165)'
                },
                {
                  offset: 1,
                  color: 'rgba(1, 191, 236)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [140, 232, 101, 264, 90, 340, 250]
          }
        ]
      })
      this.chart.on('click', (params) => {
        // console.log(params)
        // alert(JSON.stringify(title.search('Departments')))
        if (title.search('Departments') !== -1) {
          this.$router.push(
            {
              path: '/system/dept',
              query: {
                createTime: params.name
              }
            }
          )
        } else if (title.search('LocalStorages') !== -1) {
          this.$router.push(
            {
              path: '/fileManagement/file',
              query: {
                createTime: params.name
              }
            }
          )
        } else if (title.search('Members') !== -1) {
          this.$router.push(
            {
              path: '/system/user',
              query: {
                createTime: params.name
              }
            }
          )
        } else if (title.search('Tasks') !== -1) {
          // alert("点击第几条线："+JSON.stringify(params.componentIndex))
          this.$router.push(
            {
              path: '/user/center',
              query: {
                createTime: params.name
              }
            }
          )
        } else if (title.search('Issues') !== -1) {
          this.$router.push(
            {
              path: '/8D/issue',
              query: {
                createTime: params.name
              }
            }
          )
        }
      })
    }
  }
}
</script>
