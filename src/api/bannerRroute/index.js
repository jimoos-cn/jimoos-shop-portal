import { Methods } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

const api = {
  getRouteList: data => requestWrapper('/routes', Methods.GET, data),
  addRoute: data => requestWrapper('/routes', Methods.POST, data),
  editRoute: data => requestWrapper('/routes/' + data.id, Methods.POST, data),
  deleteRoute: data => requestWrapper('/routes/' + data.id, Methods.DELETE)
}

/**
 * 获取route列表
 * @param data
 * @returns {AxiosPromise}
 */
export function getRouteList (data) {
  return axios(api.getRouteList(data))
}

/**
 * 获取route列表
 * @param data
 * @returns {AxiosPromise}
 */
export function addRoute (data) {
  return axios(api.addRoute(data))
}

/**
 * 获取route列表
 * @param data
 * @returns {AxiosPromise}
 */
export function editRoute (data) {
  return axios(api.editRoute(data))
}

/**
 * 获取route列表
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteRoute (data) {
  return axios(api.deleteRoute(data))
}
