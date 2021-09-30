export const WITHDRAW_COLUMNS = [
  {
    title: '订单Id',
    dataIndex: 'orderId',
    align: 'center'
  },
  {
    title: '应付金额',
    dataIndex: 'money',
    scopedSlots: {
      customRender: 'money'
    },
    align: 'center'
  },
  {
    title: '凭证内容',
    dataIndex: 'content',
    align: 'center',
    width: '10%',
    ellipsis: true,
    scopedSlots: {
      customRender: 'content'
    }
  },
  {
    title: '凭证图片',
    scopedSlots: {
      customRender: 'picture'
    },
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: {
      customRender: 'status'
    }
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
