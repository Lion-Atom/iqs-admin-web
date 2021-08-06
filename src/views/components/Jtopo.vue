<template>
  <div id="content" style="width:100%">
    <br/>
    <canvas id="canvas" ref="canvas" style="background-color: rgb(238, 238, 238);width:1080px;height:600px"></canvas>
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
  mounted() {
    this.initTopo()
  },
  methods: {
    initTopo() {
      let canvas = this.$refs.canvas
      if (this.fishData) {
        let mfb = new MakFishBone(canvas, { data: this.fishData })
        mfb.start()
      }
    }
  }
}
</script>
