import requestWapper from '@/api/requestWrapper'
import { Methods } from '@/api/methods'
import { axios } from '@/utils/request'

const api = {
    writeSettings: data => requestWapper('/settings', Methods.POST, data),
    getSettingByKey: data => requestWapper('/settings/byKeyword', Methods.GET, data)
}

/**
 * 写入配置
 * @param {data} data
 * @returns BaseSettings
 */
export function writeSettings (data) {
    return axios(api.writeSettings(data))
}
/**
 *  读取配置
 * @param {data} 登录参数
 * @returns BaseSettings
 */
export function getSettingByKey (data) {
    return axios(api.getSettingByKey(data))
}
