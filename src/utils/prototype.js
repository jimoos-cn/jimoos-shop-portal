import Vue from 'vue'
import moment from 'moment'

Vue.prototype.$dateFormat = (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(dataStr).format(pattern)
}
