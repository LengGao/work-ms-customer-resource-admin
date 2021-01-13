<template>
  <div class="table-scroll">
    <div :style="{height:Height+'px'}"
         class="scroll">
      <slot></slot>
    </div>
  </div>
</template>
<script>

export default {
  name: '',
  data () {
    return {
      Height: null
    }
  },
  props: {
    hNum: {
      type: Number,
      value: null
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.Height = document.documentElement.clientHeight - this.hNum
    this.$nextTick(() => {
      window.onresize = () => {
        this.Height = document.documentElement.clientHeight - this.hNum
      }
    })
  }
}
</script>

<style scoped>
.scroll {
  width: 100%;
  overflow: auto;
}
</style>
