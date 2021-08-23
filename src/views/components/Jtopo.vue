<template>
  <div id="content" ref="content" style="width:100%">
    <br/>
    <canvas id="canvas" ref="canvas" :style="{width:canvasW, height:canvasH}"></canvas>
<!--    <canvas id="canvas" ref="canvas" style="width:1080px;height:600px;"></canvas>-->
  </div>
</template>

<script>
import { getCauseTreeByIssueId } from '@/api/tools/issueCause'
export default {
  name: 'Jtopo',
  props: ['issueId'],
  data() {
    return {
      fishData: {},
      canvasW: '1280px',
      canvasH: '600px'
    }
  },
  created() {
    const contentW = this.$refs.content.offsetWidth
    this.canvasW = contentW + 'px'
    setTimeout(() => {
      this.getChartDateByIssueId(this.issueId)
    }, 300)
  },
  mounted() {
    this.getChartDateByIssueId(this.issueId)
  },

  methods: {
    getChartDateByIssueId(id) {
      getCauseTreeByIssueId(id).then(res => {
        this.fishData = {}
        this.fishData.name = res.issueTitle
        this.fishData.children = res.content
        if (this.fishData.children.length > 0) {
          this.initTopo()
        }
      }).catch(res => {

      })
    },
    initTopo() {
      const canvas = this.$refs.canvas
      if (this.fishData) {
        const mfb = new MakFishBone(canvas, { data: this.fishData })
        mfb.start()
      }
    }
  }
}
</script>
