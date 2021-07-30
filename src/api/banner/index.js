import { Methods } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

const api = {
  getBannerPage: data => requestWrapper('/banners', Methods.GET, data),
  getBannerDetail: data => requestWrapper('/banners/+' + data.id, Methods.GET, data),
  addBanner: data => requestWrapper('/banners', Methods.POST, data),
  editBanner: data => requestWrapper('/banners/' + data.id, Methods.POST, data),
  deleteBanner: data => requestWrapper('/banners/' + data.id, Methods.DELETE),
  putOnBanner: data => requestWrapper('/banners/' + data.id + '/up', Methods.POST, data),
  offShelfBanner: data => requestWrapper('/banners/' + data.id + '/down', Methods.POST, data)
}

/**
 * 获取banner列表
 * @param data
 * @returns {AxiosPromise}
 */
export function getBannerPage (data) {
  return axios(api.getBannerPage(data))
}

/**
 * 获取某banner详细
 * @param data
 * @returns {AxiosPromise}
 */
export function getBannerDetail (data) {
  return axios(api.getBannerDetail(data))
}

/**
 * 添加banner
 * @param data
 * @returns {AxiosPromise}
 */
export function addBanner (data) {
  return axios(api.addBanner(data))
}

/**
 * 修改banner
 * @param data
 * @returns {AxiosPromise}
 */
export function editBanner (data) {
  return axios(api.editBanner(data))
}

/**
 * 删除banner（软删除）
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteBanner (data) {
  return axios(api.deleteBanner(data))
}

/**
 * 上架banner
 * @param data
 * @returns {AxiosPromise}
 */
export function putOnBanner (data) {
  return axios(api.putOnBanner(data))
}

/**
 * 下架banner
 * @param data
 * @returns {AxiosPromise}
 */
export function offShelfBanner (data) {
  return axios(api.offShelfBanner(data))
}
