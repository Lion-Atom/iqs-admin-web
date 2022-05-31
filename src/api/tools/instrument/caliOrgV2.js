import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/caliOrgV2',
    method: 'get',
    params
  })
}


export function add(data) {
  return request({
    url: 'api/caliOrgV2',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/caliOrgV2',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/caliOrgV2',
    method: 'put',
    data
  })
}

export function getCaliOrgById(id) {
  const params = {
    caliOrgId: id
  }
  return request({
    url: 'api/caliOrgV2/byId',
    method: 'get',
    params
  })
}

export function getCaliOrgByExample(data) {
  return request({
    url: 'api/caliOrgV2/queryByExample',
    method: 'post',
    data
  })
}

export default { get, add, edit, del, getCaliOrgById, getCaliOrgByExample }
