<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-row>
        <a-col :span="4">
          <h3>支付方式选择</h3>
        </a-col>
        <a-col :span="4">
          <a-button size="small" type="primary" @click="show" icon="plus">添加支付方式</a-button>
        </a-col>
      </a-row>
      <a-col class="payment-select" v-for="(config, index) in paymentProperties.configs" :key="index">
        <span class="payment-label">{{ config.name + ": " }}</span>
        <a-switch
          @change="changePayment"
          checked-children="开"
          un-checked-children="关"
          v-model="paymentProperties.configs[index].active"
        />
      </a-col>
    </a-row>
    <a-row :gutter="16" v-if='false'>
      <a-col :md="24" :lg="16">
        <h3>支付方式配置</h3>
        <a-form layout="vertical">
          <a-form-item label="关键词">
            <a-input
              disabled
              v-model="payment.keyword"
            />
          </a-form-item>
          <a-form-item label="配置内容">
            <a-textarea
              v-model="payment.content"
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
          <h4>支付配置说明</h4>
          <div>
            <b>配置关键词</b>: <code>payment</code> <br>
            <b>配置内容</b>
            <pre>
{
    "configs":[
        {
              "name": "线下支付",
              "keyword": "offlinePay",
              "content": "",
              "active": true
        }
    ]
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
    <div>
      <a-modal
        :visible="visible"
        title="新增支付方式配置"
        :confirm-loading="confirmLoading"
        :destroyOnClose="true"
        okText="提交"
        :width="900"
        cancelText="取消"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <a-form :form="form">
          <a-form-item label="配置名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入配置名称"
              v-decorator="['name', { rules: [{ required: true, message: '请输入配置名称' }] }]"
            />
          </a-form-item>
          <a-form-item label="配置关键词" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入配置关键词"
              v-decorator="['keyword', { rules: [{ required: true, message: '请输入配置关键词' }] }]"
            />
          </a-form-item>
          <a-form-item label="配置内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入配置内容"
              v-decorator="['content', { rules: [{ required: true, message: '请输入配置内容' }] }]"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { getSettingByKey, writeSettings } from '@/api/setting'
import { addPayment, changePayment, checkPayment } from '@/api/obs'

export default {
  name: 'Payment',
  data () {
    return {
      payment: {},
      paymentProperties: {},
      visible: false,
      confirmLoading: false,
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 13 }, sm: { span: 17 } },
      form: this.$form.createForm(this)
    }
  },
  mounted () {
    this.checkPayment()
    getSettingByKey({
      keyword: 'payment'
    }).then((res) => {
      this.payment = {
        ...res
      }
    })
  },
  methods: {
    checkPayment () {
      checkPayment().then(res => {
        this.paymentProperties = {
          ...res
        }
      })
    },
    saveSetting () {
      const _this = this
      console.log('shopInfo:' + JSON.stringify(this.shopInfo))
      writeSettings(this.payment).then(() => {
        _this.$message.success('更新成功!')
      })
    },
    changePayment () {
      const data = {}
      for (let i = 0; i < this.paymentProperties.configs.length; i++) {
        data['configs[' + i + '].name'] = this.paymentProperties.configs[i].name
        data['configs[' + i + '].keyword'] = this.paymentProperties.configs[i].keyword
        data['configs[' + i + '].active'] = this.paymentProperties.configs[i].active
      }
      console.log(data)
      changePayment(data).then(res => {
        this.refresh()
      }).catch(err => {
        console.log(err)
        this.refresh()
      })
    },
    show () {
      this.visible = true
    },
    handleOk () {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          const data = Object.assign({}, this.data, values)
          console.log('theData:' + JSON.stringify(data))
          this.confirmLoading = true
          this.addPayment(data)
          this.form.resetFields()
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    addPayment (data) {
      addPayment(data).then(res => {
        this.refresh()
      }).catch(err => {
        console.log(err)
        this.refresh()
      })
    },
    refresh () {
      this.visible = false
      this.confirmLoading = false
      this.checkPayment()
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
