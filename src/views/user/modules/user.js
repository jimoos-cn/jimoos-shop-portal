export const columns = [
  {
    title: '用户Id',
    scopedSlots: {
      customRender: 'id'
    },
    width: '100px'
  },
  {
    title: '昵称',
    dataIndex: 'nickname'
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    scopedSlots: {
      customRender: 'avatar'
    },
    width: '120px'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    scopedSlots: {
      customRender: 'phone'
    },
    width: '120px'
  },
  {
    title: '状态',
    dataIndex: 'ban',
    scopedSlots: {
      customRender: 'ban'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    scopedSlots: {
      customRender: 'createAt'
    }
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: '300px',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
