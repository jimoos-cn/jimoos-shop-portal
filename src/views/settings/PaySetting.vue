<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="线下支付">
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
          </a-tab-pane>
          <a-tab-pane key="2" tab="微信支付" force-render>
            Content of Tab Pane 2
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { saveShopInfo, getShopInfo } from '@/api/shopInfo'
import WangEditorExt from '@/components/Editor/WangEditorExt'

export default {
  components: {
    WangEditorExt
  },
  mounted () {
    getShopInfo().then((res) => {
      this.shopInfo = {
        ...res
      }
      this.$refs.editor.setContent(this.shopInfo.shopAbout)
    })
  },
  data () {
    return {
      location: {}
    }
  },
  methods: {
    // 更新 wangEditor
    changeWang (val) {
      console.log(val)
      this.shopInfo.shopAbout = val
    },
    saveShopInfo () {
      const _this = this
      console.log('shopInfo:' + JSON.stringify(this.shopInfo))
      saveShopInfo(this.shopInfo).then(() => {
          _this.$message.success('更新成功!')
      })
    }
  }
}
</script>
