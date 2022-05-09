import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/train/examDepart',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/train/examDepart',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/train/examDepart',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/train/examDepart',
    method: 'put',
    data
  })
}

export default {get, add, edit, del}
