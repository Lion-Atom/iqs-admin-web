/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validIsNull(str) {
  return !(str == null || str === '')
}

export function validTwo(val1, val2) {
  if ((val1 == null || val1 === '') && (val2 != null && val2 !== '')) {
    return false
  } else {
    return !((val2 == null || val2 === '') && (val1 != null && val1 !== ''))
  }
}
