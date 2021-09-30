/**
 * 购物商品
 * @type {({scopedSlots: {customRender: string}, width: string, title: string}|{scopedSlots: {customRender: string}, width: string, title: string}|{scopedSlots: {customRender: string}, dataIndex: string, width: string, title: string}|{scopedSlots: {customRender: string}, width: string, title: string}|{dataIndex: string, width: string, title: string})[]}
 */
export const columns = [
  {
    title: '商品',
    scopedSlots: {
      customRender: 'product'
    },
    width: '50%'
  },
  {
    title: '金额',
    scopedSlots: {
      customRender: 'productPrice'
    }
  },
  {
    title: '实付',
    dataIndex: 'realPay',
    scopedSlots: {
      customRender: 'realPay'
    }
  }
]

export const ORDER_STATUS = [
  {
    desc: '新订单',
    value: 0
  },
  {
    desc: '已支付',
    value: 1
  },
  {
    desc: '已发货',
    value: 2
  },
  {
    desc: '已签收',
    value: 3
  },
  {
    desc: '已评价',
    value: 4
  },
  {
    desc: '已取消',
    value: -99
  }
]

export const ORDER_TYPE = [
  {
    desc: '实体商品',
    value: 'PRODUCT'
  },
  {
    desc: '虚拟商品',
    value: 'VIRTUAL'
  },
  {
    desc: '混合商品',
    value: 'MIX'
  }
]
