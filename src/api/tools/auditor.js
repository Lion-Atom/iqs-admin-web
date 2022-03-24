import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/auditor',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/auditor',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/auditor',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/auditor',
    method: 'put',
    data
  })
}

export function getAuditorById(id) {
  const params = {
    auditorId: id
  }
  return request({
    url: 'api/auditor/byId',
    method: 'get',
    params
  })
}

export function getAuditorByUserId(id) {
  const params = {
    userId: id
  }
  return request({
    url: 'api/auditor/byUserId',
    method: 'get',
    params
  })
}


export function activatedByAuditorId(id) {
  const params = {
    auditorId: id
  }
  return request({
    url: 'api/auditor/activate',
    method: 'get',
    params
  })
}

export function getAuditorByExample(data) {
  return request({
    url: 'api/auditor/byExample',
    method: 'post',
    data
  })
}

export function getCountByStatus() {
  const params = {}
  return request({
    url: 'api/auditor/byStatus',
    method: 'get',
    params
  })
}

export function getCountByDept() {
  const params = {}
  return request({
    url: 'api/auditor/byDept',
    method: 'get',
    params
  })
}

export default { get, add, edit, del, getCountByStatus, getCountByDept }
