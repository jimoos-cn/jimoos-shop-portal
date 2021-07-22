export function isPromiseLike (p) {
  if (!p) {
    return false
  }

  const proto = Object.getPrototypeOf ? Object.getPrototypeOf(p) : p.__proto__; // eslint-disable-line
  return typeof proto.then === 'function'
}

export function isArray (arr) {
  return Object.prototype.toString.apply(arr) === '[object Array]'
}

// 计算每个sku后面有多少项
export function getLevels (tree) {
  const level = []
  for (let i = tree.length - 1; i >= 0; i--) {
    if (tree[i + 1] && tree[i + 1].leaf) {
      level[i] = tree[i + 1].leaf.length * level[i + 1] || 1
    } else {
      level[i] = 1
    }
  }
  return level
}

/**
 * 笛卡尔积运算
 * @param  {[type]} tree   [description]
 * @param  {Array}  stocks [description]
 * @return {[type]}        [description]
 */
export function flatten (tree, stocks = [], options) {
  const { optionValue = 'id', optionText = 'text' } = options || {}
  const result = []
  let skuLen = 0
  const stockMap = {} // 记录已存在的stock的数据
  const level = getLevels(tree)
  if (tree.length === 0) return result
  tree.forEach(sku => {
    const { leaf } = sku
    if (!leaf || leaf.length === 0) return true
    skuLen = (skuLen || 1) * leaf.length
  })
  // 根据已有的stocks生成一个map
  stocks.forEach(stock => {
    const { attrs, ...attr } = stock
    stockMap[attrs.map(item => `${item.k_id}_${item.v_id}`).join('|')] = attr
  })
  for (let i = 0; i < skuLen; i++) {
    const attrs = []
    const mapKey = []
    tree.forEach((sku, column) => {
      const { leaf } = sku
      let item = {}
      if (!leaf || leaf.length === 0) return true
      if (leaf.length > 1) {
        const row = parseInt(i / level[column], 10) % leaf.length
        item = tree[column].leaf[row]
      } else {
        item = tree[column].leaf[0]
      }
      if (!sku[optionValue] || !item[optionValue]) return
      mapKey.push(`${sku[optionValue]}_${item[optionValue]}`)
      attrs.push({
        attrId: sku[optionValue],
        attrName: sku[optionText],
        attrValueId: item[optionValue],
        attrValueName: item[optionText]
      })
    })
    const { ...data } = stockMap[mapKey.join('|')] || {}
    // 从map中找出存在的sku并保留其值
    result.push({ ...data, attrs })
  }
  return result
}

/**
 * 判断单个 sku 是否相同
 * @param {sku} sku
 * @param {sku} sku1
 * @param {Object} options
 * @returns
 */
export function isEqualSku (sku, sku1, options) {
  const { optionValue = 'attrValueId' } = options || {}
  return sku.attrs.length === sku1.attrs.length &&
    sku.attrs.map(item => item[optionValue]).join(',') ===
    sku1.attrs.map(item => item[optionValue]).join(',')
}
/**
 * 更新 SKU 列表，并保持已有的 sku 的数值
 * @param {Array} skus 原有
 * @param Array skus1 新增
 * @param Object options
 */
export function updateSkus (skus, skus1, options) {
  const { price = 0, showPrice = 0, cover = '' } = options || {}
  const resultSkus = skus
  for (let index = 0; index < skus1.length; index++) {
    const element = skus1[index]
    const exist = findExistSku(element, skus)
    if (exist != null) {
      resultSkus.push(exist)
    } else {
      resultSkus.push({
        'attrs': element.attrs,
        'cover': cover,
        'price': price,
        'showPrice': showPrice
      })
    }
  }
  return resultSkus
}

/**
 * 已经存在的 sku 则 保存原有的数据
 * @param {sku} sku
 * @param skus skus
 * @returns
 */
export function findExistSku (sku, skus) {
  for (let index = 0; index < skus.length; index++) {
    const element = skus[index]
    if (isEqualSku(sku, element)) {
      return element
    }
  }
  return null
}

/**
 * 判断两个sku是否相同
 * @param  {[type]}  prevSKU [description]
 * @param  {[type]}  nextSKU [description]
 * @return {Boolean}         [description]
 */
export function isEqual (prevSKU, nextSKU, options) {
  const { optionValue = 'id' } = options || {}
  return (
    nextSKU.length === prevSKU.length &&
    nextSKU.every(({ leaf = [] }, index) => {
      const prevLeaf = prevSKU[index].leaf || []
      return (
        prevSKU[index][optionValue] === nextSKU[index][optionValue] &&
        leaf.length === prevLeaf.length &&
        leaf.map(item => item[optionValue]).join(',') ===
        prevLeaf.map(item => item[optionValue]).join(',')
      )
    })
  )
}
