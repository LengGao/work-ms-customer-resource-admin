import { Message } from 'element-ui'

/**
 * 成功弹框
 * @param {String} message
 */
export const msgSuccess = message =>
  Message({
    message,
    type: 'success'
  })
// 警告弹框
export const msgWarning = message =>
  Message({
    message,
    type: 'warning'
  })
// 错误弹框
export const msgError = message =>
  Message({
    message,
    type: 'error'
  })
