import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/caliOrg',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/caliOrg',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/caliOrg',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/caliOrg',
    method: 'put',
    data
  })
}

export function getCaliOrgById(id) {
  const params = {
    caliOrgId: id
  }
  return request({
    url: 'api/caliOrg/byId',
    method: 'get',
    params
  })
}

export default { get, add, edit, del, getCaliOrgById }
