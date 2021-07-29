import { ContentTypes, Methods } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

/**
 * 商品标签模块接口
 */
const api = {
    getProductTagPage: data => requestWrapper('/product/tags/query', Methods.GET, data),
    createProductTag: data => requestWrapper('/product/tags', Methods.POST, data),
    updateProductTag: data => requestWrapper('/product/tags/' + data.id, Methods.POST, data),
    deleteProductTag: data => requestWrapper('/product/tags/' + data.id + '/delete', Methods.POST),
    deleteBoundValue: data => requestWrapper('/product/tags/deleteBoundValue', Methods.POST, data),
    addBoundValue: data => requestWrapper('/product/tags/addBoundValue', Methods.POST, data, ContentTypes.JSON),
    queryBoundValue: data => requestWrapper('/product/tags/queryBoundValue', Methods.POST, data),
    queryUnBoundValue: data => requestWrapper('/product/tags/queryUnBoundValue', Methods.GET, data)
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
/**
 * 删除 某商品的绑定值
 * @param {Object} data
 * @returns
 */
export function deleteBoundValue (data) {
  return axios(api.deleteBoundValue(data))
}
/**
 * 增加 某商品的标签绑定值
 * @param {Object} data
 * @returns
 */
export function addBoundValue (data) {
  return axios(api.addBoundValue(data))
}
/**
 * 查询 某商品的标签绑定值(根据商品ID)
 * @param {Object} data
 * @returns
 */
export function queryBoundValue (data) {
  return axios(api.queryBoundValue(data))
}
/**
 * 查询 某商品的标签绑定值(根据商品ID)
 * @param {Object} data
 * @returns
 */
export function queryUnBoundValue (data) {
  return axios(api.queryUnBoundValue(data))
}
