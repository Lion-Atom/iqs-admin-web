<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import { getCauseTreeByIssueId } from '@/api/tools/issueCause'

require('echarts/theme/macarons') // echarts theme

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
      default: '500px'
    },
    issueId: {
      type: Number
    }

  },
  data() {
    return {
      fishData: {},
      subtext: 'All',
      chart: null
    }
  },
  beforeMount() {
    this.getChartDateByIssueId(this.issueId)
  },
  mounted() {
    this.initChart()
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
    getChartDateByIssueId(id) {
      getCauseTreeByIssueId(id).then(res => {
        this.fishData = {}
        this.fishData.name = res.issueTitle
        this.fishData.children = res.content
        if (this.fishData.children.length > 0) {
          this.initChart()
        }
      }).catch(() => {
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      let color = 'green'
      this.changeColor(this.fishData.children[0], color)
      color = 'red'
      this.changeColor(this.fishData.children[1], color)
      color = 'blue'
      this.changeColor(this.fishData.children[2], color)
      color = 'yellow'
      this.changeColor(this.fishData.children[3], color)
      color = 'pink'
      this.changeColor(this.fishData.children[4], color)
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',

            data: [this.fishData],

            top: '1%',
            left: '12%',
            bottom: '1%',
            right: '20%',

            symbolSize: 7,

            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 12
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      })
      this.chart.on('dblclick', (params) => {
        // alert(JSON.stringify(params.data))
        this.$router.push(
          {
            path: '/issue/detail',
            query: {
              issueId: this.issueId
            }
          }
        )
      })
    },

    changeColor(obj, color) {
      obj.itemStyle = {
        color: color,
        borderColor: color
      }
      obj.lineStyle = {
        color: color,
        borderColor: color
      }

      for (let i = 0; i < obj.children.length; i++) {
        obj.children[i].itemStyle = {
          color: color,
          borderColor: color
        }
        obj.children[i].lineStyle = {
          color: color,
          borderColor: color
        }
      }
    }

  }
}
</script>
