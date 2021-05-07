const adminResetForm = {
    list: [
      {
        type: 'input',
        label: '新密码',
        icon: 'icon-write',
        options: {
          type: 'password',
          width: '100%',
          defaultValue: '',
          placeholder: '请输入新密码',
          clearable: true,
          maxLength: null,
          hidden: false,
          disabled: false
        },
        model: 'pwd',
        key: 'input_1594716465282',
        rules: [
          {
            required: true,
            message: '请输入新密码'
          }
        ]
      },
      {
        type: 'input',
        label: '确认密码',
        icon: 'icon-write',
        options: {
          type: 'password',
          width: '100%',
          defaultValue: '',
          placeholder: '请输入确认密码',
          clearable: false,
          maxLength: null,
          hidden: false,
          disabled: false
        },
        model: 'pwdRepeat',
        key: 'input_1594716807623',
        rules: [
          {
            required: true,
            message: '请输入确认密码'
          }
        ]
      }
    ],
    config: {
      layout: 'horizontal',
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 17
      },
      hideRequiredMark: false,
      customStyle: ''
    }
}
export default adminResetForm
