import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function loginCode (params) {
  return request({
    url: '/user/login-code',
    method: 'get',
    params
  })
}

export function loginFn (params) {
  return request({
    url: '/user/login',
    method: 'get',
    params
  })
}

export function getInfo (token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
