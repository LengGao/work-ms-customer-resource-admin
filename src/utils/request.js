import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, getToken1 } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
      config.headers['token'] = getToken1()
    }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if(typeof(res) !== 'string') {
      res.headers = response.headers
    }
    return res
  },
  error => {
    // console.log(error.response.data) // for debug
    if(error.response) {
      if (error.response.request.responseType == 'arraybuffer') {
        let blob = new Blob([error.response.data])
        let reader = new FileReader()
        reader.readAsText(blob, 'utf-8')
        reader.onload = function () {
          error.response.message = JSON.parse(reader.result).message
          Message({
            // message: (error.response.data && error.response.data.message)? error.response.data.message : '请联系管理员',
            message:  (error.response.data && error.response.data.message) || error.response.message || '请联系管理员',
            type: 'error',
            duration: 5 * 1000
          })
        }
      } else {
        Message({
          // message: (error.response.data && error.response.data.message)? error.response.data.message : '请联系管理员',
          message: (error.response.data && error.response.data.message) || error.response.message || '请联系管理员',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
