import { Methods } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

/**
 * 商品分类模块接口
 */
const api = {
    getProductCategoryPage: data => requestWrapper('/product/categories/query', Methods.GET, data),
    createProductCategory: data => requestWrapper('/product/categories', Methods.POST, data),
    updateProductCategory: data => requestWrapper('/product/categories/' + data.id, Methods.POST, data),
    deleteProductCategory: data => requestWrapper('/product/categories/' + data.id + '/delete', Methods.POST)
}

/**
 * 获取商品分类列表
 * @param data
 * @returns
 */
export function getProductCategoryPage (data) {
    return axios(api.getProductCategoryPage(data))
}
/**
 * 创建分类
 * @param {Object} data
 * @returns
 */
export function createProductCategory (data) {
    return axios(api.createProductCategory(data))
}

/**
 * 更新分类
 * @param {Object} data
 * @returns
 */
export function updateProductCategory (data) {
    return axios(api.updateProductCategory(data))
}
/**
 * 删除分类
 * @param {Object} data
 * @returns
 */
export function deleteProductCategory (data) {
    return axios(api.deleteProductCategory(data))
}
