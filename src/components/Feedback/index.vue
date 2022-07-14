<template>
  <div>
    <svg-icon icon-class="feedback" @click="click" />
  </div>
</template>

<script>
export default {
  name: 'FeedBack',
  methods: {
    click() {
      this.$router.push({
        path: '/more/feedback',
        query: {
        }
      })
    }
  }
}
</script>
