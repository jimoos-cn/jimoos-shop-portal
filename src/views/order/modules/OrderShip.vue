<!-- 订单发货操作 -->
<template>
  <a-modal
    title="填写发货信息"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="false" label="订单号">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item v-show="model && model.outTradeNo > 0" label="订单号">
          <a-input v-decorator="['outTradeNo', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="快递单号">
          <a-input v-decorator="['shipCode', {rules: [{required: true, message: '请输入快递单号！'}]}]" />
        </a-form-item>
        <a-form-item label="快递名称">
          <a-select v-decorator="['express', {rules: [{required: true, message: '请输入快递名称'}]}]" @change="changeSelect">
            <a-select-option
              v-for="item of EXPRESS"
              :value="item.express"
              :key="item.expressCode">
              {{ item.express }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="快递编码">
          <a-input v-decorator="['expressCode', {rules: [{required: true, message: '请输入快递编码！'}]}]" disabled/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
  import { EXPRESS } from './express'
  import pick from 'lodash.pick'
  // 表单字段
  const fields = ['shipCode', 'express', 'expressCode', 'id', 'outTradeNo']
  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      loading: {
        type: Boolean,
        default: () => false
      },
      model: {
        type: Object,
        default: () => null
      }
    },
    data () {
      this.formLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        }
      }
      this.EXPRESS = EXPRESS
      return {
        form: this.$form.createForm(this)
      }
    },
    created () {
      fields.forEach(v => this.form.getFieldDecorator(v))
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      console.log(this.form)
    },
    methods: {
      changeSelect (val, option) {
        this.form.setFieldsValue({ expressCode: option.key })
      }
    }
  }
</script>
