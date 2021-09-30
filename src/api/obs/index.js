import methods, { ContentTypes } from '@/api/methods'

import requestWapper from '@/api/requestWrapper'
import { axios } from '@/utils/request'

import rawAxios from 'axios'

const api = {
    // 获取文件URL签名
    getObsTempSign: data => requestWapper('/huawei/obs/temporary-signature', methods.POST, data, ContentTypes.JSON),
    checkObs: data => requestWapper('/huawei/obs/checkObs', methods.GET, data),
    deleteFile: data => requestWapper('/storage/delete', methods.DELETE, data)
}

const UploadType = {
    IMG: 0, // img
    MEDIA: 1 // 视频或音频
}

export function getObsTempSign (data) {
    return axios(api.getObsTempSign(data))
}

export function checkObs () {
  return axios(api.checkObs())
}

export function deleteFile (data) {
  return axios(api.deleteFile(data))
}

/**
 * 上传数据
 * @param {form} data
 * @param {file} file
 * @returns photo url
 */
export async function uploadFile (data, file) {
    let result = {}
    await getObsTempSign(data).then(res => {
        result = res
    })
    const mediaUrl = 'https://' + result[0].blobUrl
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
    await rawAxios.post(url, formData, config)
    return mediaUrl
}

export function uploadFileToLocal (data) {
  return axios({ url: '/storage/upload', method: 'post', data: data })
}

export {
    UploadType
}
