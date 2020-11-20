<template>
  <div class="container dashboard-editor-container">
    <p>数据</p>
    <el-form label-width="100px">
      <el-form-item label="工作台">
        <el-select v-model="clientId"
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  name: 'DashboardAdmin',
  data () {
    return {
      options: [{
        id: 1,
        name: 'ms'
      }],
      clientId: null
    }
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.dashboard-editor-container {
  position: relative;
}

.el-form-item__label {
  text-align: left;
}
</style>
