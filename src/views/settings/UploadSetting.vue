<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="本地上传配置">
            <a-form layout="vertical">
              <a-form-item label="文件上传根路径">
                <a-input
                  v-model="location.rootPath"
                  placeholder="文件上传根路径"
                  v-decorator="['shopInfo.shopName', { rules: [{ required: true, message: '请输入上传根路径' }] }]"
                />
              </a-form-item>
              <a-form-item label="域名地址">
                <a-input
                  v-model="location.host"
                  placeholder="网站URL"
                  v-decorator="['shopInfo.shopName', { rules: [{ required: true, message: '请输入网站URL' }] }]"
                />
              </a-form-item>
            </a-form>
            <a-button type="primary" @click="saveLocalUpload">保存</a-button>
          </a-tab-pane>
          <a-tab-pane key="2" tab="华为OBS配置" force-render>
            Content of Tab Pane 2
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { saveSetting, getSetting } from './index'

export default {
  mounted () {
    this.getLocalUploadSetting()
  },
  data () {
    return {
      location: {},
      localKey: 'local.storage'
    }
  },
  methods: {
    getLocalUploadSetting () {
      getSetting(this.localKey).then(res => {
        console.log('res', res)
        if (this.$available(res)) {
          this.location = JSON.parse(res)
        }
      })
    },
    saveLocalUpload () {
      const json = JSON.stringify(this.location)
      console.log('location:' + json)
      saveSetting(this.localKey, json).then(res => {
        this.$message.success('修改成功')
      })
    }
  }
}
</script>
