<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-row>
        <a-col :span="4">
          <h3>支付方式选择</h3>
        </a-col>
      </a-row>
      <a-col class="payment-select">
        <span class="payment-label">线下支付</span>
        <a-switch
          @change="changePayment"
          checked-children="开"
          un-checked-children="关"
          v-model="isOfflinePay"
        />
      </a-col>
      <a-col class="payment-select">
        <span class="payment-label">微信支付</span>
        <a-switch
          @change="changePayment"
          checked-children="开"
          un-checked-children="关"
          v-model="isWxPay"
        />
      </a-col>
    </a-row>
    <a-tabs type="card">
      <a-tab-pane key="1" tab="线下支付配置">
        <a-row :gutter="16">
          <a-col :md="24" :lg="16">
            配置了文件上传，无需额外配置线下支付
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="2" tab="微信支付配置">
        <a-row :gutter="16">
          <a-col :md="24" :lg="16">
            <a-form layout="vertical">
              <a-form-item label="微信支付配置">
                <a-input
                  disabled
                  v-model="wxPay.keyword"
                />
              </a-form-item>
              <a-form-item label="配置内容">
                <a-textarea
                  v-model="wxPay.content"
                  rows="16"
                />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="saveSetting">{{ $t('account.settings.basic.update') }}</a-button>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
            <div class="setting-description">
              <h3>&nbsp;&nbsp;配置说明</h3>
              <h4>微信支付配置</h4>
              <div>
                <b>配置关键词</b>: <code>wx.pay</code> <br>
                <b>配置内容</b>
                <pre>
{
    "appId": "请填写appId",
    "mchId": "请填写mchId",
    "mchKey": "请填写mchKey",
    "notifyUrl": "请填写notifyUrl",
    "keyPath": "",
    "refundNotifyUrl": ""
}
            </pre>
              </div>
              <h4>注意事项</h4>
              <p>
                配置修改后，需要重启服务才会生效。
              </p>
            </div>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { getSettingByKey, writeSettings } from '@/api/setting'
import { changePayment, checkPayment } from '@/api/obs'

export default {
  name: 'Payment',
  data () {
    return {
      isOfflinePay: false,
      isWxPay: false,
      offlinePay: {},
      wxPay: {}
    }
  },
  mounted () {
    checkPayment().then(res => {
      this.isOfflinePay = res.offlinePay
      this.isWxPay = res.wxPay
      getSettingByKey({
        keyword: 'wx.pay'
      }).then((res) => {
        this.wxPay = {
          ...res
        }
      })
    })
  },
  methods: {
    saveSetting (index) {
      const _this = this
      console.log('shopInfo:' + JSON.stringify(this.shopInfo))
      writeSettings(this.wxPay).then(() => {
        _this.$message.success('更新成功!')
      })
    },
    changePayment () {
      const data = {
        offlinePay: this.isOfflinePay,
        wxPay: this.isWxPay
      }
      changePayment(data).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang='less' scoped>
.setting-description {
  padding: 0 20px;
  color: rgba(0, 0, 0, 0.45);
}
.payment-select {
  margin: 10px 0;
  padding: 10px 0;
  .payment-label {
    display: inline-block;
    min-width: 80px;
  }
}
</style>
