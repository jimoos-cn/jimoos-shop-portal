import requestWapper from '@/api/requestWrapper'
import { Methods } from '@/api/methods'
import { axios } from '@/utils/request'

const api = {
  login: data => requestWapper('/login', Methods.POST, data),
  logout: () => requestWapper('/logout', Methods.POST)
}

/**
 * 登录
 * @param {data} 登录参数
 * @returns AdminVO
 */
export function login (data) {
  return axios(api.login(data))
}

/**
 * 登出
 */
export function logout () {
  return axios(api.logout())
}
