import { Methods } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

/**
 * 用户管理模块接口
 */
const api = {
  getUserInfo: data => requestWrapper('/users/query', Methods.GET, data),
  banUser: data => requestWrapper('/users/' + data.id + '/ban', Methods.POST, data),
  cancelBanUser: data => requestWrapper('/users/' + data.id + '/unban', Methods.POST, data),
  deleteUser: data => requestWrapper('/users/' + data.id + '/remove', Methods.POST, data),
  getUserDetail: data => requestWrapper('/users/' + data.userId + '/details', Methods.GET),
  getUserAddress: data => requestWrapper('/users/' + data.userId + '/address', Methods.GET)
}

/**
 * 获取用户信息列表
 * @param data
 * @returns {AxiosPromise}
 */
export function getUserInfo (data) {
  return axios(api.getUserInfo(data))
}

/**
 * 禁止用户登录
 * @param data
 * @returns {AxiosPromise}
 */
export function banUser (data) {
  return axios(api.banUser(data))
}

/**
 * 取消禁止用户登录
 * @param data
 * @returns {AxiosPromise}
 */
export function cancelBanUser (data) {
  return axios(api.cancelBanUser(data))
}

/**
 * 删除用户
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteUser (data) {
  return axios(api.deleteUser(data))
}

/**
 * 获取某个用户数据
 * @param data
 * @returns {AxiosPromise}
 */
export function getUserDetail (data) {
  return axios(api.getUserDetail(data))
}

/**
 * 获取某个用户的收货地址
 * @param data
 * @returns {AxiosPromise}
 */
export function getUserAddress (data) {
  return axios(api.getUserAddress(data))
}
