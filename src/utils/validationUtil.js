/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validIsNotNull(str) {
  return !(str === null || str === '' || str === undefined)
}

export function validTwo(val1, val2) {
  if ((val1 === null || val1 === '' || val1 === undefined) && (val2 !== null && val2 !== '')) {
    return false
  } else {
    return !((val2 === null || val2 === '' || val2 === undefined) && (val1 !== null && val1 !== ''))
  }
}

export function judgeIsEqual(v1, v2) {
  return ((v1 === null || v1 === '' || v1 === undefined) && (v2 === null || v2 === '' || v2 === undefined)) ||
    (v1 === v2)
}

export function transToNullFormat(val) {
  if (val === '' || val === undefined || val === null) {
    return '----'
  } else {
    return val
  }
}

/*
 * 格林时间转化为普通时间
 */
export function GMTToStr(time) {
  let datetime = new Date(time)
  let year = datetime.getFullYear()
  let month = datetime.getMonth() + 1//js从0开始取
  let day = datetime.getDate()
  let hour = datetime.getHours()
  let minutes = datetime.getMinutes()
  let second = datetime.getSeconds()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (second < 10) {
    second = '0' + second
  }
  let Str = year + '-' +
    month + '-' +
    day + ' ' +
    hour + ':' +
    minutes + ':' +
    second
  return Str
}

/*
 * 格林时间转化为普通时间
 */
export function GMTToDate(time) {
  let datetime = new Date(time)
  let year = datetime.getFullYear()
  let month = datetime.getMonth() + 1//js从0开始取
  let day = datetime.getDate()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  return year + '-' +
    month + '-' +
    day + ' '
}

/*
 * 格林时间转化为普通时间
 */
export function toDateFormat(time) {
  let datetime = new Date(time)
  let year = datetime.getFullYear()
  let month = datetime.getMonth() + 1//js从0开始取
  let day = datetime.getDate()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  return year + month + day
}

/*
 * 格林时间转化为普通时间
 */
export function getTodayFormat() {
  let datetime = new Date()
  let year = datetime.getFullYear()
  let month = datetime.getMonth() + 1//js从0开始取
  let day = datetime.getDate()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  return year + month + day
}
