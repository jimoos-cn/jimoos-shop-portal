import { Methods, ContentTypes } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

/**
 * 商品模块接口
 */
const api = {
    getProductPage: data => requestWrapper('/products/query', Methods.GET, data),
    createProduct: data => requestWrapper('/products', Methods.POST, data, ContentTypes.JSON),
    updateProduct: data => requestWrapper('/products/' + data.id + '/info', Methods.POST, data, ContentTypes.JSON),
    getProduct: data => requestWrapper('/products/' + data.id, Methods.GET, data),
    deleteProduct: data => requestWrapper('/products/' + data.id + '/delete', Methods.POST),
    updateProductInfo: data => requestWrapper('/products/' + data.id + '/info', Methods.POST, data, ContentTypes.JSON),
    getProductSkus: data => requestWrapper('/products/' + data.id + '/skus', Methods.GET, data),
    upProduct: data => requestWrapper('/products/' + data.id + '/up', Methods.POST),
    downProduct: data => requestWrapper('/products/' + data.id + '/down', Methods.POST)
}

/**
 * 获取商品列表
 * @param data
 * @returns
 */
export function getProductPage (data) {
    return axios(api.getProductPage(data))
}
/**
 * 创建商品
 * @param {Object} data
 * @returns
 */
export function createProduct (data) {
    return axios(api.createProduct(data))
}

/**
 * 更新商品
 * @param {Object} data
 * @returns
 */
export function updateProduct (data) {
    return axios(api.updateProduct(data))
}
/**
 * 获取商品
 * @param {Object} data
 * @returns
 */
export function getProduct (data) {
    return axios(api.getProduct(data))
}
/**
 * 删除商品
 * @param {Object} data
 * @returns
 */
export function deleteProduct (data) {
    return axios(api.deleteProduct(data))
}
/**
 * 更新商品信息
 * @param {Object} data
 * @returns
 */
export function updateProductInfo (data) {
    return axios(api.updateProductInfo(data))
}
/**
 * 上架商品
 * @param {Object} data
 * @returns
 */
export function upProduct (data) {
    return axios(api.upProduct(data))
}
/**
 * 下架商品
 * @param {Object} data
 * @returns
 */
export function downProduct (data) {
    return axios(api.downProduct(data))
}
/**
 * 获取商品 SKU 列表
 * @param {Object} data
 * @returns
 */
export function getProductSkus (data) {
    return axios(api.getProductSkus(data))
}
