<template>
  <div>
    <!-- <div v-if='this.options.length > 0'> -->
    <div v-for='(item ,index) in options'
         id='testDom'
         :key='index'>
      <div class='test'>
        {{item}}
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      props: { multiple: true },
      options: [1, 2, 3, 4, 5, 5, 6],
      options2: [7, 8, 9, 0, 11, 12, 13]
    }
  },
  created () {
    const dom = document.getElementsByClassName('test')
    console.log(111, dom)
  },
  mounted () {
    setTimeout(() => {
      const dom = document.getElementsByClassName('test')
      console.log(dom)
      dom[0].innerHTML = '888888'
      this.options = []
      this.$nextTick(() => {
        this.options = this.options2
      })
    }, 3000)
  }

}
</script>

<style lang="scss" scoped>

</style>
