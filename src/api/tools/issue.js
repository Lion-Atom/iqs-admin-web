import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/issue',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/issue',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/issue',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/issue',
    method: 'put',
    data
  })
}

export function getIssueById(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/issue/byId',
    method: 'get',
    params
  })
}

export default { get, add, edit, del, getIssueById }
