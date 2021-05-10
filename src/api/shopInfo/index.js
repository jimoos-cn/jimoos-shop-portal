import requestWapper from '@/api/requestWrapper'
import { Methods } from '@/api/methods'
import { axios } from '@/utils/request'

const api = {
    saveShopInfo: data => requestWapper('/shopInfo', Methods.POST, data),
    getShopInfo: data => requestWapper('/shopInfo', Methods.GET, data)
}

/**
 * 保存商城基本信息
 * @param  data
 * @returns BaseSettings
 */
export function saveShopInfo (data) {
    return axios(api.saveShopInfo(data))
}
/**
 * 读取商城基本信息
 * @param data
 * @returns BaseSettings
 */
export function getShopInfo (data) {
    return axios(api.getShopInfo(data))
}
