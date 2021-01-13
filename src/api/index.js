import axios from '@/utils/request'
import qs from 'qs'

export function getList (params) {
  return {
    url: '/table/list',
    method: 'get',
    params
  }
}

export const types = query => axios.get(`/types?${qs.stringify(query)}`)

// 用户列表
export function userList (params) {
  return axios({
    url: 'user/list',
    method: 'get',
    params
  })
}
// 用户新增或修改
export function user (params) {
  return axios({
    url: '/user',
    method: 'post',
    data: params
  })
}

// 资源列表查询
export function resourcesList (params) {
  return axios({
    url: '/resources/list',
    method: 'get',
    params
  })
}

// 单个资源查询
export function resourcesSingle (params) {
  return axios({
    url: '/resources/single',
    method: 'get',
    params
  })
}

// 导出资源列表
export function resourcesExportList (params) {
  return axios({
    url: '/resources/export-list',
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}
