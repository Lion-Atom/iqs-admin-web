import request from '@/utils/request'

export function addChangeFactor(data) {
  return request({
    url: 'api/changeFactor',
    method: 'post',
    data
  })
}

export function delChangeFactor(ids) {
  return request({
    url: 'api/changeFactor',
    method: 'delete',
    data: ids
  })
}

export function editChangeFactor(data) {
  return request({
    url: 'api/changeFactor',
    method: 'put',
    data
  })
}

export function getFactorsByChangeId(id) {
  const params = {
    changeId: id
  }
  return request({
    url: 'api/changeFactor/byChangeId',
    method: 'get',
    params
  })
}

export default {addChangeFactor, delChangeFactor, editChangeFactor, getFactorsByChangeId}
