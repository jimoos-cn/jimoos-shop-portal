import { Methods, ContentTypes } from '@/api/methods'
import { obj2FormData, stringifyObj } from '@/utils/util'
import storage from 'store'

/**
 * 组装 request
 * @param {*} url 地址
 * @param {*} method 方法
 * @param {*} data 数据
 * @param {*} type 类别 0 application/x-www-form-urlencoded 1 json other form-data
 * @returns
 */
export default function requestWapper (url, method, data = null, type = ContentTypes.FORM) {
    if (method === Methods.GET || method === Methods.DELETE) {
        return { url: url, method: method, params: data }
    } else {
        const userInfo = storage.get('info')
        if (userInfo) {
            data['adminId'] = userInfo.id
        }
        if (type === ContentTypes.FORM) {
            return { url: url, method: method, data: stringifyObj(data) }
        } else if (type === ContentTypes.JSON) {
            // json
            return { url: url, method: method, data: data }
        } else if (type === ContentTypes.FORM_DATA) {
            // form-data
            return { url: url, method: method, data: obj2FormData(data) }
        } else {
            // 默认 application/x-www-form-urlencoded
            return { url: url, method: method, data: stringifyObj(data) }
        }
    }
}
