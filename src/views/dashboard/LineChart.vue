<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
      chart: null,
      titleName: null,
      lengendData: []
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
    setOptions({ title, personalCount, count, xAxisData } = {}) {
      if (title.search('Tasks') !== -1) {
        this.lengendData = ['全局', '个人']
        this.titleName = '每日任务增长趋势图'
      } else if (title.search('LocalStorages') !== -1) {
        this.lengendData = ['全部', '部门']
        this.titleName = '文件增长趋势图'
      } else if (title.search('Issues') !== -1) {
        this.lengendData = ['全局']
        this.titleName = '8D增长趋势图'
      } else if (title.search('Departments') !== -1) {
        this.lengendData = ['全局']
        this.titleName = '部门增长趋势图'
      }
      this.chart.setOption({
        title: {
          text: this.titleName,
          left: 'center'
        },
        xAxis: {
          data: xAxisData,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: { //  如果这个字段不设置，echarts会根据屏宽及横坐标数据自动给出间隔
            // interval: 5 // 间隔长度，可自定义（如果是时间格式，echarts会自动处理）
            // rotate: 40 // 横坐标上label的倾斜度
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: this.lengendData,
          left: 30
        },
        series: [{
          name: this.lengendData[0], itemStyle: {
            normal: {
              color: '#FF005A',
              label: { show: true },
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: count,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }, {
          name: this.lengendData[1], itemStyle: {
            normal: {
              color: '#3888fa',
              label: { show: true },
              lineStyle: {
                color: '#3888fa',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: personalCount,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
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
