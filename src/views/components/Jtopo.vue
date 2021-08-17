<template>
  <div id="content" ref="content" style="width:100%">
    <br/>
    <canvas id="canvas" ref="canvas" :style="{width:canvasW, height:canvasH}"></canvas>
  </div>
</template>

<script>

export default {
  name: 'Jtopo',
  props: {
    fishData: {
      type: Object
    }
  },
  data() {
    return {
      canvasW: '0px',
      canvasH: '600px'
    }
  },
  created() {
    setTimeout(() => {
      this.initTopo()
    }, 1000)
  },
  mounted() {
    let contentW = this.$refs.content.offsetWidth
    this.canvasW = contentW + 'px'
  },
  methods: {
    initTopo() {
      console.log(this.fishData)
      let canvas = this.$refs.canvas
      if (this.fishData) {
        let mfb = new MakFishBone(canvas, { data: this.fishData })
        mfb.start()
      }
    }
  }
}
</script>
