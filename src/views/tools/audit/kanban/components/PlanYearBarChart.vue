<template>
  <div id="main" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import {debounce} from '@/utils'
import {getCountByAuditPlanYear} from "@/api/tools/auditPlan";

require('echarts/theme/macarons') // echarts theme
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
      years: [],
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
      getCountByAuditPlanYear().then(res => {
        // alert(JSON.stringify(res))
        this.years = res.years
        this.planDatas = res.planDatas
        this.execDatas = res.execDatas
        this.trailDatas = res.trailDatas
        this.closeDatas = res.closeDatas
        if (this.years !== undefined) {
          this.initChart()
        }
      }).catch(() => {
      })
    },
    initChart() {
      let app = {};
      let option;
      // this.chart = echarts.init(this.$el, 'macarons')
      // let chartDom = document.getElementById('main');
      this.chart =echarts.init(this.$el, 'macarons')
      const posList = [
        'left',
        'right',
        'top',
        'bottom',
        'inside',
        'insideTop',
        'insideLeft',
        'insideRight',
        'insideBottom',
        'insideTopLeft',
        'insideTopRight',
        'insideBottomLeft',
        'insideBottomRight'
      ];
      app.configParameters = {
        rotate: {
          min: -90,
          max: 90
        },
        align: {
          options: {
            left: 'left',
            center: 'center',
            right: 'right'
          }
        },
        verticalAlign: {
          options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom'
          }
        },
        position: {
          options: posList.reduce(function (map, pos) {
            map[pos] = pos;
            return map;
          }, {})
        }
      };
      app.config = {
        // rotate: 90,
        align: 'center',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 5,
        onChange: function () {
          const labelOption = {
            rotate: app.config.rotate,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            position: app.config.position,
            distance: app.config.distance
          };
          this.chart.setOption({
            series: [
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              }
            ]
          });
        }
      };
      const labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        // formatter: '{c}  {name|{a}}',
        fontSize: 14
      };
      option = {
        title: {
          text: '年度审核系统计划数量分布',
          left: 'left'
        },
        grid: {
          top: 50,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['计划', '执行', '追踪', '结案']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            data: this.years
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '计划',
            type: 'bar',
            barGap: 0,
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            data: this.planDatas
          },
          {
            name: '执行',
            type: 'bar',
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            data: this.execDatas
          },
          {
            name: '追踪',
            type: 'bar',
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            data: this.trailDatas
          },
          {
            name: '结案',
            type: 'bar',
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            data: this.closeDatas
          }
        ]
      };
      if (option && typeof option === 'object') {
        this.chart.setOption(option);
      }
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
