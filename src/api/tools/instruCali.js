import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/instruCali',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/instruCali',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/instruCali',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/instruCali',
    method: 'put',
    data
  })
}

export function getInstruCaliById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/instruCali/byId',
    method: 'get',
    params
  })
}

export default { get, add, edit, del, getInstruCaliById }
