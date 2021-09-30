export const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    scopedSlots: {
      customRender: 'id'
    },
    align: 'center'
  },
  {
    title: '省',
    dataIndex: 'province',
    scopedSlots: {
      customRender: 'province'
    },
    align: 'center'
  },
  {
    title: '市',
    dataIndex: 'city',
    scopedSlots: {
      customRender: 'city'
    },
    align: 'center'
  },
  {
    title: '县',
    dataIndex: 'area',
    scopedSlots: {
      customRender: 'area'
    },
    align: 'center'
  },
  {
    title: '地址',
    dataIndex: 'address',
    scopedSlots: {
      customRender: 'address'
    },
    align: 'center'
  },
  {
    title: '邮编',
    dataIndex: 'zipCode',
    scopedSlots: {
      customRender: 'zipCode'
    },
    align: 'center'
  },
  {
    title: '是否默认',
    dataIndex: 'defaultIn',
    scopedSlots: {
      customRender: 'defaultIn'
    },
    align: 'center'
  },
  {
    title: '类型',
    dataIndex: 'tag',
    scopedSlots: {
      customRender: 'tag'
    },
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    align: 'center',
    scopedSlots: {
      customRender: 'createAt'
    }
  }
]
