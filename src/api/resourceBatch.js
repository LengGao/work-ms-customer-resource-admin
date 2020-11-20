import request from '@/utils/request'

export default {
  getResourceList (params) {
    return request({
      url: '/resources-batch/list',
      method: 'get',
      params
    })
  },
  downloadTemplate () {
    return request({
      url: '/resources-batch/download-template',
      method: 'get',
      responseType: 'arraybuffer'
    })
  },
  singleSearch (params) {
    return request({
      url: '/resources/single',
      method: 'get',
      params
    })
  },
  downloadBatch (params) {
    return request({
      url: '/resources-batch/download',
      method: 'get',
      params,
      responseType: 'arraybuffer'
    })
  },
  cashOutBatch (params) {
    return request({
      url: '/resources-batch/cash-out',
      method: 'get',
      params
    })
  },
  importMatch (params) {
    return request({
      url: '/resources-batch/import-match',
      method: 'post',
      data: params
    })
  }

}
