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
      <a-form-item label="兑换码(可选)" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="请输入兑换码"
          v-decorator="['code', { initialValue: data.code }]"
        />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
        <span slot="label">
          满减条件&nbsp;
          <a-tooltip title="用户的购买金额须满足该设置金额，才可以使用该优惠券">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input
          suffix="元"
          type="number"
          style="width: 100%"
          placeholder="请输入"
          v-decorator="['fullMoney', { initialValue: 100, rules: [{ required: true, message: '满减条件不能为空' }] }]"
        />
      </a-form-item>
      <a-form-item label="优惠金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          suffix="元"
          type="number"
          style="width: 100%"
          placeholder="请输入"
          v-decorator="['reduceMoney', { initialValue: 10, rules: [{ required: true, message: '优惠金额不能为空' }] }]"
        />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
        <span slot="label">
          有效时长&nbsp;
          <a-tooltip title="用户领券后的有效时长">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input
          suffix="天"
          type="number"
          style="width: 100%"
          placeholder="请输入"
          v-decorator="['validTime', { initialValue: 30, rules: [{ required: true, message: '有效时长不能为空' }] }]"
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
          v-decorator="['totalNum', { initialValue: 100, rules: [{ required: true, message: '请输入' }] }]"
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

          theData.effectiveStartTime = values['join-time-picker'][0].format('x')
          theData.effectiveEndTime = values['join-time-picker'][1].format('x')
          theData.startTime = values['range-time-picker'][0].format('x')
          theData.endTime = values['range-time-picker'][1].format('x')
          theData.validTime = values['validTime'] * 3600 * 24
          console.log(theData)
          this.$emit('submit', theData, this.editFlag)
          this.form.resetFields()
        }
      })
    }
  }
}
</script>
