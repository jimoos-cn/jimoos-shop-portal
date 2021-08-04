/**
 * banner位置
 * @type {{MIDDLE_BOTTOM: {value: number, desc: string}, TOP: {value: number, desc: string}, BOTTOM: {value: number, desc: string}, MIDDLE: {value: number, desc: string}}}
 */
export const BANNER_POSITION = {
  ALL: {
    desc: '全部位置',
    value: -1
  },
  TOP: {
    desc: '顶部轮播banner',
    value: 0
  },
  MIDDLE: {
    desc: '中间广告/橱窗',
    value: 1
  },
  MIDDLE2: {
    desc: '首页中间2',
    value: 2
  },
  MIDDLE3: {
    desc: '首页中间左',
    value: 3
  },
  MIDDLE4: {
    desc: '首页中间右',
    value: 4
  },
  ORIGIN_TO: {
    desc: '原产地顶部',
    value: 5
  },
  ORIGIN_BOTTOM: {
    desc: '原产地底部',
    value: 6
  }
}
/**
 * banner的route类型
 * @type {{TYPE3: {value: number, desc: string}, TYPE2: {value: number, desc: string}, TYPE5: {value: number, desc: string}, TYPE4: {value: number, desc: string}, TYPE1: {value: number, desc: string}}}
 */
export const BANNER_ROUTE_TYPE = {
  TYPE1: {
    desc: '网站',
    value: 0
  },
  TYPE2: {
    desc: '商品详细页',
    value: 1
  },
  TYPE3: {
    desc: '优惠券领取中心',
    value: 2
  },
  TYPE4: {
    desc: '频道',
    value: 3
  },
  TYPE5: {
    desc: '不跳转',
    value: 4
  }
}
