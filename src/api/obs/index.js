import methods, { ContentTypes } from '@/api/methods'

import requestWapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

import rawAxios from 'axios'

const api = {
    // 获取文件URL签名
    getObsTempSign: data => requestWapper('/huawei/obs/temporary-signature', methods.POST, data, ContentTypes.JSON)
}

const UploadType = {
    IMG: 0, // img
    MEDIA: 1 // 视频或音频
}

export {
    UploadType
}

export function getObsTempSign (data) {
    return axios(api.getObsTempSign(data))
}

/**
 * 上传数据
 * @param {form} data
 * @param {file} file
 * @returns photo url
 */
export async function uploadFileToObs (data, file) {
    let result = {}
    await getObsTempSign(data).then(res => {
        console.log('obs result:' + res)
        result = res
    })
    const photo = 'https://' + result[0].blobUrl
    const url = 'https://' + result[0].url
    var formData = new FormData()
    formData.append('key', result[0].key)
    formData.append('x-obs-acl', result[0]['xObsAcl'])
    formData.append('policy', result[0].policy)
    formData.append('AccessKeyId', result[0].accessKeyId)
    formData.append('signature', result[0].signature)
    formData.append('file', file)
    const config = {
        headers: {
            'Content-type': 'multipart/form-data'
        }
    }
    await rawAxios.post(url, formData, config).then(() => { })
    return photo
}
