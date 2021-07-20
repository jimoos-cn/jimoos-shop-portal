
/**
 * 判断值不为undefined、NULL、''
 * @param val
 * @returns {boolean}
 */
export function avliable (val) {
  return val !== undefined && val !== '' && val != null
}
