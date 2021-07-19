import { Methods } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

/**
 * 订单后台管理模块接口
 */
const api = {
  getOrderInfo: data => requestWrapper('/orders/query', Methods.GET, data),
  getUserRecentOrder: data => requestWrapper('/orders/byUserId', Methods.GET, data),
  getOrderDetails: data => requestWrapper('/orders/' + data.id + '/details', Methods.GET)
}

/**
 * 获取订单信息
 * @param data
 * @returns {AxiosPromise}
 */
export function getOrderInfo (data) {
  return axios(api.getOrderInfo(data))
}

/**
 * 获取某用户 最近订单
 * @param data
 * @returns {AxiosPromise}
 */
export function getUserRecentOrder (data) {
  return axios(api.getUserRecentOrder(data))
}

/**
 * 获取某订单 详细内容
 * @param data
 * @returns {AxiosPromise}
 */
export function getOrderDetails (data) {
  return axios(api.getOrderDetails(data))
}
