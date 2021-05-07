import { Methods } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'
/**
 * 管理员模块接口
 */
const api = {
  getAdminPage: data => requestWrapper('/admins/query', Methods.GET, data),
  createAdmin: data => requestWrapper('/admins', Methods.POST, data),
  deleteAdmin: data => requestWrapper('/admins/' + data.toDeleteAdminId + '/delete', Methods.POST),
  adminBanChange: data => requestWrapper('/admins/' + data.adminId + '/ban', Methods.POST, data),
  resetAdminPassword: data => requestWrapper('/admins/pwd', Methods.POST, data),
  resetPassword: data => requestWrapper('/admins/' + data.id + '/pwd', Methods.POST, data)
}

export function getAdminPage (data) {
  return axios(api.getAdminPage(data))
}

export function createAdmin (data) {
  return axios(api.createAdmin(data))
}

export function deleteAdmin (data) {
  return axios(api.deleteAdmin(data))
}

/**
 * 修改管理员自己的密码
 * @param data
 * @returns {AxiosPromise}
 */
export function resetAdminPassword (data) {
  return axios(api.resetAdminPassword(data))
}

/**
 * 修改管理员密码
 * @param data
 * @returns {AxiosPromise}
 */
export function resetPassword (data) {
  return axios(api.resetPassword(data))
}

export function adminBanChange (data) {
  return axios(api.adminBanChange(data))
}
