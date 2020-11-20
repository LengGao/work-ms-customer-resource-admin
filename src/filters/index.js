/**
 * 推送类型
 * @param(String) key
 * @return (String)
 */
const pushType = key => {
  const arr = ['立即推送', '定时推送', '规律推送']
  return arr[Number(key)]
}

/**
 * 推送状态
 * @param(Boolean) key
 * @return (String)
 */
const pushStatus = boolean => {
  return boolean ? '已发送' : '未发送'
}

export default {
  pushType,
  pushStatus
}
