import { getSettingByKey, writeSettings } from '@/api/setting'

export async function saveSetting (key, content) {
  const param = {
    keyword: key,
    content: content
  }
  let result = ''
  await writeSettings(param).then(res => {
    result = res
  })
  return result
}

export async function getSetting (key) {
  const param = {
    keyword: key,
    limit: 1,
    offset: 0
  }
  let json = ''
  await getSettingByKey(param).then(res => {
    json = res.content
  })
  return json
}
