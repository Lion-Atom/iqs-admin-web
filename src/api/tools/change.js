import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/change',
    method: 'get',
    params
  })
}

export function addChange(data) {
  return request({
    url: 'api/change',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/change',
    method: 'delete',
    data: ids
  })
}

export function editChange(data) {
  return request({
    url: 'api/change',
    method: 'put',
    data
  })
}

export function getChangeById(id) {
  const params = {
    changeId: id
  }
  return request({
    url: 'api/change/byId',
    method: 'get',
    params
  })
}

export default { get, addChange, editChange, del, getChangeById }
