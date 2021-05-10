<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical">
          <a-form-item label="商城名称">
            <a-input
              v-model="shopInfo.shopName"
              :placeholder="$t('account.settings.basic.nickname-message')"
              v-decorator="['shopInfo.shopName', { rules: [{ required: true, message: '请输入商城名称' }] }]"
            />
          </a-form-item>
          <a-form-item label="简介">
            <a-textarea
              v-model="shopInfo.shopIntro"
              rows="4"
              :placeholder="$t('account.settings.basic.profile-message')"
            />
          </a-form-item>
          <a-form-item label="联系人手机号" :required="false">
            <a-input v-model="shopInfo.shopPhone" placeholder="请输入运营联系人手机号" />
          </a-form-item>
          <a-form-item label="联系人邮箱" :required="false">
            <a-input v-model="shopInfo.shopEmail" placeholder="请输入运营联系人邮箱" />
          </a-form-item>
          <a-form-item label="更多介绍" :required="false">
            <WangEditorExt ref="editor" @change="changeWang" :value="shopInfo.shopAbout" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="saveShopInfo()">{{ $t('account.settings.basic.update') }}</a-button>
          </a-form-item>
        </a-form>
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
      shopInfo: {}
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
