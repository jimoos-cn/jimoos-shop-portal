export const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    scopedSlots: {
      customRender: 'id'
    },
    align: 'center',
    width: '100px'
  },
  {
    title: '省',
    dataIndex: 'province',
    scopedSlots: {
      customRender: 'province'
    },
    align: 'center',
    width: '150px'
  },
  {
    title: '市',
    dataIndex: 'city',
    scopedSlots: {
      customRender: 'city'
    },
    align: 'center',
    width: '150px'
  },
  {
    title: '县',
    dataIndex: 'area',
    scopedSlots: {
      customRender: 'area'
    },
    align: 'center',
    width: '150px'
  },
  {
    title: '地址',
    dataIndex: 'address',
    scopedSlots: {
      customRender: 'address'
    },
    align: 'center',
    width: '150px'
  },
  {
    title: '邮编',
    dataIndex: 'zipCode',
    scopedSlots: {
      customRender: 'zipCode'
    },
    align: 'center',
    width: '150px'
  },
  {
    title: '是否默认',
    dataIndex: 'defaultIn',
    scopedSlots: {
      customRender: 'defaultIn'
    },
    align: 'center',
    width: '150px'
  },
  {
    title: '类型',
    dataIndex: 'tag',
    scopedSlots: {
      customRender: 'tag'
    },
    align: 'center',
    width: '150px'
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    width: '190px',
    align: 'center',
    scopedSlots: {
      customRender: 'createAt'
    }
  }
]
