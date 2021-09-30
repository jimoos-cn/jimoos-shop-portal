import { Methods } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

/**
 * 线下支付订单审核模块
 */
const api = {
  getOfflinePage: data => requestWrapper('/offlinePay', Methods.GET, data),
  getOfflineOne: data => requestWrapper('/offlinePay/' + data.id, Methods.GET, data),
  offlinePass: data => requestWrapper('/offlinePay/pass', Methods.POST, data),
  offlineFail: data => requestWrapper('/offlinePay/fail', Methods.POST, data)
}

/**
 * 获取线下支付记录 分页
 * @param data
 * @returns {AxiosPromise}
 */
export function getOfflinePage (data) {
  return axios(api.getOfflinePage(data))
}

/**
 * 获取线下支付记录 详情
 * @param data
 * @returns {AxiosPromise}
 */
export function getOfflineOne (data) {
  return axios(api.getOfflineOne(data))
}

/**
 * 线下支付审核通过
 * @param data
 * @returns {AxiosPromise}
 */
export function offlinePass (data) {
  return axios(api.offlinePass(data))
}

/**
 * 线下支付审核不通过
 * @param data
 * @returns {AxiosPromise}
 */
export function offlineFail (data) {
  return axios(api.offlineFail(data))
}
