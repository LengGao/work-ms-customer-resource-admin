import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

const TokenKey1 = 'token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function getToken1 () {
  return Cookies.get(TokenKey1)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function setToken1 (token) {
  return Cookies.set(TokenKey1, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function removeToken1 () {
  return Cookies.remove(TokenKey1)
}
