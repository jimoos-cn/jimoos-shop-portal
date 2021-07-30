import Vue from 'vue'
import moment from 'moment'
import storage from 'store'

Vue.prototype.$dateFormat = (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(dataStr).format(pattern)
}

Vue.prototype.$storage = storage
