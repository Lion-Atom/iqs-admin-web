import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/instrument',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/instrument',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/instrument',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/instrument',
    method: 'put',
    data
  })
}

export function getInstrumentById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/instrument/byId',
    method: 'get',
    params
  })
}

export default { get, add, edit, del, getInstrumentById }
