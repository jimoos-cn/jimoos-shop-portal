import { Methods } from '@/api/methods'
import requestWrapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

/**
 * 优惠券模块接口
 */
const api = {
    getCouponPage: data => requestWrapper('/coupons/query', Methods.GET, data),
    createCoupon: data => requestWrapper('/coupons', Methods.POST, data),
    updateCoupon: data => requestWrapper('/coupons/' + data.id, Methods.POST, data),
    deleteCoupon: data => requestWrapper('/coupons/' + data.id + '/delete', Methods.POST),
    upCoupon: data => requestWrapper('/coupons/' + data.id + '/up', Methods.POST, data),
    downCoupon: data => requestWrapper('/coupons/' + data.id + '/down', Methods.POST),
    couponRecords: data => requestWrapper('/coupons/' + data.id + '/records', Methods.GET, data)
}

/**
 * 获取优惠券列表
 * @param data
 * @returns
 */
export function getCouponPage (data) {
    return axios(api.getCouponPage(data))
}
/**
 * 创建优惠券
 * @param {Object} data
 * @returns
 */
export function createCoupon (data) {
    return axios(api.createCoupon(data))
}

/**
 * 更新优惠券
 * @param {Object} data
 * @returns
 */
export function updateCoupon (data) {
    return axios(api.updateCoupon(data))
}
/**
 * 删除优惠券
 * @param {Object} data
 * @returns
 */
export function deleteCoupon (data) {
    return axios(api.deleteCoupon(data))
}

/**
 * 上架优惠券
 * @param data
 * @returns {AxiosPromise}
 */
export function upCoupon (data) {
    return axios(api.upCoupon(data))
}

/**
 * 下架优惠券
 * @param data
 * @returns {AxiosPromise}
 */
export function downCoupon (data) {
    return axios(api.downCoupon(data))
}
/**
 * 查询 优惠券的领取记录
 * @param {object} data
 * @returns
 */
export function getCouponRecords (data) {
    return axios(api.couponRecords(data))
}
