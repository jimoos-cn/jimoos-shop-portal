import { Methods } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

/**
 * 优惠券模块接口
 */
const api = {
    getProductTagPage: data => requestWrapper('/product/tags/query', Methods.GET, data),
    createProductTag: data => requestWrapper('/product/tags', Methods.POST, data),
    updateProductTag: data => requestWrapper('/product/tags/' + data.id, Methods.POST, data),
    deleteProductTag: data => requestWrapper('/product/tags/' + data.id + '/delete', Methods.POST)
}

/**
 * 获取商品标签列表
 * @param data
 * @returns
 */
export function getProductTagPage (data) {
    return axios(api.getProductTagPage(data))
}
/**
 * 创建标签
 * @param {Object} data
 * @returns
 */
export function createProductTag (data) {
    return axios(api.createProductTag(data))
}

/**
 * 更新标签
 * @param {Object} data
 * @returns
 */
export function updateProductTag (data) {
    return axios(api.updateProductTag(data))
}
/**
 * 删除标签
 * @param {Object} data
 * @returns
 */
export function deleteProductTag (data) {
    return axios(api.deleteProductTag(data))
}
