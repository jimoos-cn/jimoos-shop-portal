import { Methods, ContentTypes } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

/**
 * 销售属性模块接口
 */
const api = {
    getProductAttrPage: data => requestWrapper('/product/attrs/query', Methods.GET, data),
    createProductAttr: data => requestWrapper('/product/attrs', Methods.POST, data, ContentTypes.JSON),
    updateProductAttr: data => requestWrapper('/product/attrs/' + data.id, Methods.POST, data, ContentTypes.JSON),
    getProductAttr: data => requestWrapper('/product/attrs/' + data.id, Methods.GET, data),
    getProductAttrValues: data => requestWrapper('/product/attrs/' + data.id + '/values', Methods.GET),
    addAttrValue: data => requestWrapper('/product/attrs/' + data.attrId + '/values', Methods.POST, data),
    deleteProductAttr: data => requestWrapper('/product/attrs/' + data.id + '/delete', Methods.POST)
}

/**
 * 获取商品销售属性列表
 * @param data
 * @returns
 */
export function getProductAttrPage (data) {
    return axios(api.getProductAttrPage(data))
}
/**
 * 创建销售属性
 * @param {Object} data
 * @returns
 */
export function createProductAttr (data) {
    return axios(api.createProductAttr(data))
}

/**
 * 更新销售属性
 * @param {Object} data
 * @returns
 */
export function updateProductAttr (data) {
    return axios(api.updateProductAttr(data))
}
/**
 * 获取销售属性
 * @param {Object} data
 * @returns
 */
export function getProductAttr (data) {
    return axios(api.getProductAttr(data))
}
/**
 * 获取销售属性值列表
 * @param {Object} data#id
 * @returns
 */
export function getProductAttrValues (data) {
    return axios(api.getProductAttrValues(data))
}
/**
 * 添加单个销售属性值
 * @param {Object} data#id
 * @returns
 */
export function addAttrValue (data) {
    return axios(api.addAttrValue(data))
}
/**
 * 删除销售属性
 * @param {Object} data
 * @returns
 */
export function deleteProductAttr (data) {
    return axios(api.deleteProductAttr(data))
}
