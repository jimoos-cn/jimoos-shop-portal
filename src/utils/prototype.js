import Vue from 'vue'
import moment from 'moment'
import storage from 'store'

Vue.prototype.$dateFormat = (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(dataStr).format(pattern)
}

Vue.prototype.$specialStrFilter = (str) => {
  // eslint-disable-next-line no-useless-escape
  const specialStrFilterReg = /[`~!@#_$%^&*()=|{}':;',\\\[\\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\s]/g
  return str.replace(specialStrFilterReg, '')
}

Vue.prototype.$storage = storage

/**
 * 判断值不为undefined、NULL、''
 * @param val
 * @returns {boolean}
 */
Vue.prototype.$available = val => {
  return val !== undefined && val !== '' && val != null
}
