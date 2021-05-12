const categoryCreateForm = {
  list: [
    {
      type: 'input',
      label: '分类名称',
      options: {
        type: 'text',
        width: '100%',
        defaultValue: '',
        placeholder: '请输入分类名称',
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
          message: '请输入分类名称'
        }
      ]
    },
    {
      type: 'textarea',
      label: '分类描述',
      options: {
        width: '100%',
        minRows: 4,
        maxRows: 6,
        maxLength: null,
        defaultValue: '',
        clearable: true,
        hidden: false,
        disabled: false,
        placeholder: '请输入分类描述'
      },
      model: 'description',
      key: 'textarea_1608196975009',
      rules: [
        {
          required: true,
          message: '请输入分类描述'
        }
      ]
    },
    {
      type: 'input',
      label: '排序',
      options: {
        type: 'number',
        width: '100%',
        defaultValue: '100',
        placeholder: '请输入排序(数值小的排前面）',
        clearable: true,
        maxLength: null,
        hidden: false,
        disabled: false
      },
      model: 'sort',
      key: 'input_1608198069206',
      rules: [
        {
          required: true,
          message: '请输入排序(数值小的排前面）'
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
export default categoryCreateForm
