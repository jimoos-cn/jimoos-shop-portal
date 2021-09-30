export const BASE_COLUMNS = [
  {
    title: '价格(元)',
    dataIndex: 'price',
    key: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '展示价(元)',
    dataIndex: 'showPrice',
    key: 'showPrice',
    scopedSlots: { customRender: 'showPrice' }
  },
  {
    title: '库存量',
    dataIndex: 'quantity',
    scopedSlots: { customRender: 'quantity' }
  },
  {
    title: '可用库存',
    dataIndex: 'ableQuantity',
    scopedSlots: { customRender: 'ableQuantity' }
  },
  {
    title: '图片',
    key: 'cover',
    dataIndex: 'cover',
    scopedSlots: { customRender: 'cover' }
  }
]

export const BASE_COLUMNS_STOCKMANAGE = [
  {
    title: '图片',
    key: 'cover',
    dataIndex: 'cover',
    align: 'center',
    scopedSlots: { customRender: 'cover' }
  },
  {
    title: '展示价(元)',
    dataIndex: 'showPrice',
    width: '10%',
    align: 'center',
    key: 'showPrice',
    scopedSlots: { customRender: 'showPrice' }
  },
  {
    title: '价格(元)',
    dataIndex: 'price',
    width: '10%',
    align: 'center',
    key: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '库存量',
    dataIndex: 'quantity',
    width: '10%',
    align: 'center',
    scopedSlots: { customRender: 'quantity' }
  },
  {
    title: '可用库存',
    dataIndex: 'ableQuantity',
    align: 'center',
    scopedSlots: { customRender: 'ableQuantity' }
  },
  {
    title: '操作',
    align: 'center',
    width: '15%',
    scopedSlots: { customRender: 'action' }
  }
]
