const tagCreateForm = {
    list: [
      {
        type: 'input',
        label: '标签名称',
        options: {
          type: 'text',
          width: '80%',
          defaultValue: '',
          placeholder: '请输入标签名称',
          clearable: true,
          maxLength: null,
          hidden: false,
          disabled: false
        },
        model: 'name',
        key: 'input_1594708184503',
        rules: [
          {
            required: true,
            message: '请输入标签名称'
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
  export default tagCreateForm
