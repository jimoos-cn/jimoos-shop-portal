import { ContentTypes, Methods } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

const api = {
  deleteSku: data => requestWrapper('/products/sku/' + data.id + '/delete', Methods.POST, data),
  updateSku: data => requestWrapper('/products/sku/update', Methods.POST, data, ContentTypes.JSON),
  batchProductSkus: data => requestWrapper('/products/' + data.productId + '/skus', Methods.POST, data, ContentTypes.JSON)
}

/**
 * 删除商品某一Sku
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteSku (data) {
  return axios(api.deleteSku(data))
}

/**
 * 更新商品的sku列表
 * @param data
 * @returns {AxiosPromise}
 */
export function updateSku (data) {
  return axios(api.updateSku(data))
}

/**
 * 批量更新商品的sku列表
 * @param data
 * @returns {AxiosPromise}
 */
export function batchProductSkus (data) {
  return axios(api.batchProductSkus(data))
}
