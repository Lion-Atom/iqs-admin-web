import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/train/materialDepart',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/train/materialDepart',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/train/materialDepart',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/train/materialDepart',
    method: 'put',
    data
  })
}

export default {get, add, edit, del}
