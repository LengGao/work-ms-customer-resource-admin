const state = {
  // 搜索到的所有公众号信息
  tableData: [],
  // 总条数
  totalNum: 0,
  // 搜索的公众号名字
  clientName: '',
  // 目前的页数
  currentPage: 1
}

const mutations = {
  // 给state的每个属性赋值
  getTableData (state, params) {
    state.tableData = params.tableData || state.tableData
    state.totalNum = params.totalNum || state.totalNum
    state.clientName = params.clientName || state.clientName
    state.currentPage = params.currentPage || state.currentPage
  }
}

const actions = {
  getTableData ({ commit }, params) {
    commit('getTableData', params)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
