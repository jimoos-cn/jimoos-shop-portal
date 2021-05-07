<template>
  <a-modal
    :visible="openModel"
    :title="title"
    :confirm-loading="confirmLoading"
    :destroyOnClose="true"
    okText="提交"
    :width="1000"
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-form-item label="优惠券名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="请输入优惠券名称"
          v-decorator="['des', { initialValue: data.des, rules: [{ required: true, message: '请输入优惠券名称' }] }]"
        />
      </a-form-item>
      <a-form-item label="满减条件" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          prefix="￥"
          type="number"
          style="width: 100%"
          placeholder="请输入"
          v-decorator="['fullMoney', { initialValue: 100, rules: [{ required: true, message: '满减条件不能为空' }] }]"
        />
      </a-form-item>
      <a-form-item label="优惠金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          prefix="￥"
          type="number"
          style="width: 100%"
          placeholder="请输入"
          v-decorator="['reduceMoney', { initialValue: 10, rules: [{ required: true, message: '优惠金额不能为空' }] }]"
        />
      </a-form-item>
      <a-form-item label="有效时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-range-picker
          v-decorator="[
            'join-time-picker',
            {
              rules: [{ required: true, message: '请选择起止日期' }],
            },
          ]"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item label="领券时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-range-picker
          v-decorator="[
            'range-time-picker',
            {
              rules: [{ required: true, message: '请选择起止日期' }],
            },
          ]"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item label="发放数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input-number
          style="width: 100%"
          :min="1"
          placeholder="请输入"
          v-decorator="['quantity', { initialValue: 100, rules: [{ required: true, message: '请输入' }] }]"
        />
      </a-form-item>
      <a-form-item label="上架状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-switch checked-children="上架" un-checked-children="下架" v-decorator="['status', {initialValue: true, valuePropName: 'checked' }]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'

export default {
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    openModel: {
      type: Boolean,
      default: false
    },
    confirmLoading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    editFlag: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 13 }, sm: { span: 17 } },
      form: this.$form.createForm(this),
      loading: false
    }
  },
  methods: {
    moment,
    handleCancel () {
      this.form.resetFields()
      this.$emit('cancel')
    },
    handleOk () {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log(values)
          const theData = Object.assign({}, this.data, values)

          theData.useStartAt = values['join-time-picker'][0].format('x')
          theData.useEndAt = values['join-time-picker'][1].format('x')
          theData.startAt = values['range-time-picker'][0].format('x')
          theData.endAt = values['range-time-picker'][1].format('x')

          theData.receiveLimit = 1
          theData.validityType = 0
          theData.type = 0 // 默认类型
          theData.show = 1 // 默认上架
          // theData.duration = theData.useEndAt - theData.useStartAt

          console.log(theData)
          this.$emit('submit', theData, this.editFlag)
          this.form.resetFields()
        }
      })
    }
  }
}
</script>
