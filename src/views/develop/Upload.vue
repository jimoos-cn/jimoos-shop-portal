<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical">
          <a-form-item label="OBS配置关键词">
            <a-input
              disabled
              v-model="setting.keyword"
            />
          </a-form-item>
          <a-form-item label="配置内容">
            <a-textarea
              v-model="setting.content"
              rows="16"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="saveSetting()">{{ $t('account.settings.basic.update') }}</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="setting-description">
          <h3>&nbsp;&nbsp;配置说明</h3>
          <h4>华为OBS配置</h4>
          <p>
            <b>配置关键词</b>: <code>huawei.obs</code> <br>
            <b>配置内容</b>
            <pre>

{
  "accessKey": "请填写accessKey",
  "secretKey": "请填写secretKey",
  "endPoint": "请填写 endPoint 地址",
  "duration": 3600,
  "buckets": [
    {
      "type": 0,
      "bucketName": "bucketName1"
    },
    {
      "type": 1,
      "bucketName": "bucketName2"
    }
  ]
}  </pre>
          </p>
          <h4>注意事项</h4>
          <p>
            配置修改后，需要重启服务才会生效。
          </p>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getSettingByKey, writeSettings } from '@/api/setting'

export default {
  mounted () {
    getSettingByKey({
      keyword: 'huawei.obs'
    }).then((res) => {
      this.setting = {
        ...res
      }
    })
  },
  data () {
    return {
      setting: {}
    }
  },
  methods: {
    saveSetting () {
      const _this = this
      console.log('shopInfo:' + JSON.stringify(this.shopInfo))
      writeSettings(this.setting).then(() => {
        _this.$message.success('更新成功!')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.setting-description {
  padding: 0 20px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
