/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validIsNotNull(str) {
  // return !(str == null || str === '' || str === undefined || str.match(/^[ ]*$/))
  if(str == null) {
    return false
  } else if (str === '') {
    return false
  } else if (str === undefined) {
    return false
  } else if (str.toString().match(/^[ ]*$/)) {
    return false
  } else {
    return true
  }
}

export function validIsMatch(val1, val2) {
  if ((val1 === null || val1 === '' || val1 === undefined) && (val2 !== null && val2 !== '' && val2 !== undefined)) {
    return false
  } else return !((val2 === null || val2 === '' || val2 === undefined) && (val1 !== null && val1 !== '' && val1 !== undefined))
}

export function judgeIsEqual(v1, v2) {
  /*return ((v1 === null || v1 === '' || v1.toString().trim() || v1 === undefined) && (v2 === null || v2 === '' || v2.toString().trim() || v2 === undefined)) ||
    (v1 === v2)*/
  if( v1 === null  || v1 === undefined) {
    if(v2 === null || v2 === ''  || v2 === undefined) {
      return true
    } else {
      return false
    }
  } else {
    if(v2 === null || v2 === undefined) {
      return false
    } else if(v1.toString().trim() === v2.toString().trim()) {
      return true
    } else {
      return false
    }
  }
}

export function judgeObjectIsEqual(a, b) {
  // 取对象a和b的属性名
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);
  // 判断属性名的length是否一致
  if (aProps.length !== bProps.length) {
    return false;
  }
  // 循环取出属性名，再判断属性值是否一致
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}

export function judgeArrIsEqual(arr1, arr2) {
  if (!arr1 || !arr2) {
    return false
  }
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
      if (!arr1[i].equals(arr2[i])) {
        return false
      }
    } else if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

export function arrSort(arr) {
  arr.sort(function (a, b) {
    return a - b;
  });
  return arr;//返回已经排序的数组
}

export function judgeCanDel(arr) {
  if (!arr) {
    return false
  }
  if (arr.length === 1) {
    return false
  } else if (arr.length > 1) {
    return true
  }
}

export function unique(arr) {
  var newArr = []
  for (var i = 0; i < arr.length; i++) {
    if (newArr.indexOf(arr[i]) === -1) {
      newArr.push(arr[i])
    }
  }
  return newArr
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
  const datetime = new Date(time)
  const year = datetime.getFullYear()
  let month = datetime.getMonth() + 1// js从0开始取
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
  const Str = year + '-' +
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
  const datetime = new Date(time)
  const year = datetime.getFullYear()
  let month = datetime.getMonth() + 1// js从0开始取
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
export function GMTToYear(time) {
  const datetime = new Date(time)
  return datetime.getFullYear()
}

/*
 * 格林时间转化为普通时间
 */
export function toDateFormat(time) {
  const datetime = new Date(time)
  const year = datetime.getFullYear()
  let month = datetime.getMonth() + 1// js从0开始取
  let day = datetime.getDate()
  const hour = datetime.getHours()
  const minutes = datetime.getMinutes()
  const second = datetime.getSeconds()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  // 空字符拼接，防止数字叠加
  return year + '' + month + '' + day + '' + '' + hour + '' + minutes + '' + second
}

/*
 * 格林时间转化为普通时间
 */
export function getTodayFormat() {
  const datetime = new Date()
  const year = datetime.getFullYear()
  let month = datetime.getMonth() + 1// js从0开始取
  let day = datetime.getDate()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  return year + month + day
}

export function dateDiff(tarDate) {
  const s1 = new Date()
  const days = tarDate.getTime() - s1.getTime();
  return parseInt(days / (1000 * 60 * 60 * 24))
}

/**
 * 判断此对象是否是Object类型
 * @param {Object} obj
 */
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 判断此类型是否是Array类型
 * @param {Array} arr
 */
function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}

export function equalsObj(oldData, newData) {
  // 类型为基本类型时,如果相同,则返回true
  if (oldData === newData) return true;
  if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
    // 类型为对象并且元素个数相同

    // 遍历所有对象中所有属性,判断元素是否相同
    for (const key in oldData) {
      if (oldData.hasOwnProperty(key)) {
        if (!equalsObj(oldData[key], newData[key]))
          // 对象中具有不相同属性 返回false
          return false;
      }
    }
  } else if (isArray(oldData) && isArray(oldData) && oldData.length === newData.length) {
    // 类型为数组并且数组长度相同

    for (let i = 0, length = oldData.length; i < length; i++) {
      if (!equalsObj(oldData[i], newData[i]))
        // 如果数组元素中具有不相同元素,返回false
        return false;
    }
  } else {
    // 其它类型,均返回false
    return false;
  }
  // 走到这里,说明数组或者对象中所有元素都相同,返回true
  return true
}


