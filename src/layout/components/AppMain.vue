<template>
  <section class="app-main">
    <transition name="fade-transform"
                mode="out-in">
<!--      <keep-alive :include="$store.state.tagsView.cachedViews">-->
      <keep-alive :include="$store.state.tagsView.cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key () {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  position: relative;
  width: 100%;

  /* 50 = navbar  */
  min-height: calc(100vh - 84px);
  /* overflow: hidden; */
}

.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
