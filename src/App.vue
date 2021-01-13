<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('roleObj', JSON.stringify(this.$store.state.user.roleObj))
    })

    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('roleObj')) {
      this.$store.commit('user/SET_ROLEObj', JSON.parse(sessionStorage.getItem('roleObj')))
    }
  }
}
</script>

<style>
  /* 解决element-ui的table表格控件表头与内容列不对齐问题 */
  .el-table th.gutter {
    display: table-cell !important;
  }
</style>
