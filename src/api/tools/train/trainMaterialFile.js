import request from '@/utils/request'


export function del(ids) {
  return request({
    url: 'api/trainMaterialFile',
    method: 'delete',
    data: ids
  })
}

export function get(params) {
  return request({
    url: 'api/trainMaterialFile',
    method: 'get',
    params
  })
}

export function edit(data) {
  return request({
    url: 'api/trainMaterialFile',
    method: 'put',
    data
  })
}

export default {del, get, edit}
